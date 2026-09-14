import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, realpathSync } from 'node:fs';
import { resolve, relative, dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { validateImageManifest, type ImageTarget } from './validate.ts';
import { approvedForPublication } from '../../src/domain/catalog/images.ts';
import type { PublicImage } from '../../src/types/images.ts';
export const imageRecipe = 'webp-800-q80-sharp-0.35.4-v1';
export const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
function inside(root: string, path: string): string {
  const full = resolve(root,path); const rel = relative(resolve(root),full);
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) throw new Error('Image path escapes root');
  return full;
}
function noSymlinkEscape(root: string, file: string): void {
  inside(realpathSync(root),realpathSync(file));
}
export type GenerationOptions = { manifestPath: string; inputDirectory: string; publicDirectory: string; outputPath: string; targets: readonly ImageTarget[]; check: boolean; replay?: boolean };
export async function generateImages(options: GenerationOptions): Promise<readonly PublicImage[]> {
  const manifest = validateImageManifest(JSON.parse(readFileSync(options.manifestPath,'utf8')),options.targets);
  const files = new Map<string,Buffer>(); const images: PublicImage[] = [];
  // No network fetches. Only explicitly approved primaries are eligible to become public files.
  for (const asset of manifest.assets.filter(a => a.isPrimary && approvedForPublication(a))) {
    if (!asset.input) throw new Error('Missing approved input');
    if (options.check && !options.replay) {
      // Deployment checks approved committed output without requiring ignored/private originals.
      const prefix = asset.id + '-';
      const names = existsSync(options.publicDirectory) ? readdirSync(options.publicDirectory).filter(name=>name.startsWith(prefix) && /^[a-f0-9]{64}\.webp$/.test(name.slice(prefix.length))) : [];
      if (names.length !== 1) throw new Error('Missing or ambiguous public derivative');
      const path = inside(options.publicDirectory,names[0]); noSymlinkEscape(options.publicDirectory,path);
      const bytes = readFileSync(path); const digest = hash(bytes);
      if (names[0] !== asset.id+'-'+digest+'.webp' || bytes.length > 200_000) throw new Error('Public derivative hash/size mismatch');
      const metadata = await sharp(bytes,{limitInputPixels:16_000_000}).metadata();
      if (metadata.format !== 'webp' || !metadata.width || !metadata.height || metadata.width > 800 || metadata.height > 1120 || (metadata.pages ?? 1) !== 1 || metadata.exif) throw new Error('Invalid public derivative');
      files.set(names[0],bytes);
      images.push({assetId:asset.id,cardId:asset.cardId,variantId:asset.variantId,side:asset.side,assetUrl:'/card-images/'+names[0],sourceUrl:asset.sourceUrl,
        matchStatus:'VERIFIED',usageStatus:'PUBLIC_ALLOWED',approvalStatus:'APPROVED',width:metadata.width,height:metadata.height,format:'webp',sha256:digest,bytes:bytes.length,credit:asset.credit});
      continue;
    }
    const file = inside(options.inputDirectory,asset.input.file); noSymlinkEscape(options.inputDirectory,file);
    const bytes = readFileSync(file);
    if (bytes.length > 10_000_000 || hash(bytes) !== asset.input.sha256) throw new Error('Image size/hash mismatch');
    const image = sharp(bytes,{limitInputPixels:16_000_000,failOn:'warning'});
    const metadata = await image.metadata();
    const inputFormat = metadata.format === 'heif' && metadata.compression === 'av1' ? 'avif' : metadata.format;
    if (!['jpeg','png','webp','avif'].includes(inputFormat ?? '') || (metadata.pages ?? 1) !== 1) throw new Error('Unsupported image content');
    if ((asset.width !== null && asset.width !== metadata.width) || (asset.height !== null && asset.height !== metadata.height) || (asset.format !== null && asset.format !== inputFormat)) throw new Error('Declared image metadata mismatch');
    // Auto-orient, preserve complete card, never upscale. Default sharp output strips EXIF/GPS.
    const result = await image.rotate().resize({width:800,height:1120,fit:'inside',withoutEnlargement:true}).webp({quality:80,effort:4}).toBuffer({resolveWithObject:true});
    if (result.data.length > 200_000) throw new Error('Optimized master exceeds 200 KB; review quality/size');
    const digest = hash(result.data); const name = asset.id + '-' + digest + '.webp';
    files.set(name,result.data);
    images.push({assetId:asset.id,cardId:asset.cardId,variantId:asset.variantId,side:asset.side,assetUrl:'/card-images/'+name,sourceUrl:asset.sourceUrl,
      matchStatus:'VERIFIED',usageStatus:'PUBLIC_ALLOWED',approvalStatus:'APPROVED',width:result.info.width,height:result.info.height,format:'webp',sha256:digest,bytes:result.data.length,credit:asset.credit});
  }
  // Fail rather than silently delete withdrawn/orphan files. Operator must review their removal and caches.
  if (existsSync(options.publicDirectory)) {
    for (const name of readdirSync(options.publicDirectory)) {
      if (!files.has(name)) throw new Error('Unapproved/stale public image: '+name);
      noSymlinkEscape(options.publicDirectory,join(options.publicDirectory,name));
    }
  }
  const inputHashes = manifest.assets.filter(a=>a.isPrimary).map(a=>[a.id,a.input?.sha256]);
  const output = '// Approved input hashes: '+JSON.stringify(inputHashes)+'\n// Generated by scripts/images/generate.ts; recipe: '+imageRecipe+'\nimport type { PublicImage } from "../../../types/images.ts";\nexport const publicImages: readonly PublicImage[] = '+JSON.stringify(images,null,2)+';\n';
  if (options.check) {
    if (!existsSync(options.outputPath) || readFileSync(options.outputPath,'utf8') !== output) throw new Error('Generated image metadata is stale');
    for (const [name,bytes] of files) { const path = inside(options.publicDirectory,name); if (!existsSync(path) || !readFileSync(path).equals(bytes)) throw new Error('Generated image bytes are stale'); }
  } else {
    // All validation and transforms finish before any output is touched.
    if (files.size) mkdirSync(options.publicDirectory,{recursive:true});
    for (const [name,bytes] of files) writeFileSync(inside(options.publicDirectory,name),bytes);
    mkdirSync(dirname(options.outputPath),{recursive:true}); writeFileSync(options.outputPath,output);
  }
  return images;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifestPath = process.argv[2]; if (!manifestPath) throw new Error('Usage: generate.ts manifest.json [--check] [--input-dir=PATH]');
  const { cards } = await import('../../src/data/fixtures/generated/golden-product-base.ts');
  const inputArg = process.argv.find(arg=>arg.startsWith('--input-dir='));
  const images = await generateImages({manifestPath:resolve(manifestPath),inputDirectory:resolve(inputArg?.slice(12) ?? '.image-inputs'),publicDirectory:resolve('public/card-images'),outputPath:resolve('src/data/fixtures/generated/golden-product-images.ts'),targets:cards,check:process.argv.includes('--check') || process.argv.includes('--replay'),replay:process.argv.includes('--replay')});
  console.log('Image assets verified: '+images.length+' public primaries; '+images.reduce((n,i)=>n+i.bytes,0)+' bytes');
}
