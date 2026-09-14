import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { approvedForPublication, displayableImage, selectPrimaryImage } from '../src/domain/catalog/images.ts';
import { validateImageManifest } from '../scripts/images/validate.ts';
import { generateImages, hash } from '../scripts/images/generate.ts';
import type { ImageAsset, PublicImage } from '../src/types/images.ts';
import { catalogRepository } from '../src/repositories/catalog-repository.ts';
import { goldenCards, goldenProduct } from '../src/data/fixtures/golden-product.ts';
import { publicImages } from '../src/data/fixtures/generated/golden-product-images.ts';

const targets = [{id:'test-card',releaseId:'test-release'}];
const asset: ImageAsset = {
 id:'test-image',releaseId:'test-release',cardId:'test-card',variantId:null,side:'FRONT',
 sourceName:'Synthetic test only',sourceUrl:'https://example.com/test',originalUrl:null,checkedAt:'2026-09-14',
 matchStatus:'VERIFIED',matchRationale:'Synthetic identity for tests, never factual card data.',usageStatus:'PUBLIC_ALLOWED',rightsRationale:'Generated test pixels only.',
 approvalStatus:'APPROVED',reviewedBy:'test',reviewedAt:'2026-09-14',isPrimary:true,
 rights:{evidenceUrl:'https://example.com/test-permission',publicWeb:true,derivatives:true,repositoryDistribution:true,expiresAt:null},credit:null,
 input:{file:'test.png',sha256:'a'.repeat(64)},width:1000,height:1400,format:'png',
};
const publicImage: PublicImage = {assetId:'test-image',cardId:'test-card',variantId:null,side:'FRONT',assetUrl:'/card-images/test-image-'+ 'a'.repeat(64)+'.webp',sourceUrl:'https://example.com/test',matchStatus:'VERIFIED',usageStatus:'PUBLIC_ALLOWED',approvalStatus:'APPROVED',width:800,height:1120,format:'webp',sha256:'a'.repeat(64),bytes:1000,credit:null};
const manifest = (assets: readonly ImageAsset[]) => ({schemaVersion:1,releaseId:'test-release',assets});

test('match, usage and approval are independent fail-closed gates',()=>{
 assert.equal(approvedForPublication(asset),true);
 for (const usageStatus of ['UNKNOWN_RIGHTS','INTERNAL_REFERENCE','USER_SUBMITTED','OWNED_ASSET'] as const) {
   assert.equal(approvedForPublication({...asset,usageStatus}),false);
   assert.equal(displayableImage({...publicImage,usageStatus},'test-card'),null);
 }
 for (const matchStatus of ['CANDIDATE','REVIEWED','MISSING'] as const) assert.equal(approvedForPublication({...asset,matchStatus}),false);
 for (const approvalStatus of ['PENDING','REJECTED','WITHDRAWN'] as const) assert.equal(approvedForPublication({...asset,approvalStatus}),false);
 for (const change of [{publicWeb:false},{derivatives:false},{repositoryDistribution:false},{expiresAt:'2030-01-01'}]) assert.equal(approvedForPublication({...asset,rights:{...asset.rights!,...change}}),false);
 assert.throws(()=>validateImageManifest(manifest([{...asset,usageStatus:'UNKNOWN_RIGHTS'}]),targets));
 assert.throws(()=>validateImageManifest(manifest([{...asset,matchStatus:'CANDIDATE'}]),targets));
});
test('primary selection is exact, side-aware, variant-aware and deterministic',()=>{
 assert.equal(displayableImage(publicImage,'test-card'),publicImage.assetUrl);
 assert.equal(displayableImage(publicImage,'another-card'),null);
 assert.equal(selectPrimaryImage([],'test-card'),null);
 assert.equal(selectPrimaryImage([{...publicImage,side:'BACK'}],'test-card'),null);
 assert.equal(selectPrimaryImage([{...publicImage,variantId:'silver'}],'test-card'),null);
 const unrelated={...publicImage,cardId:'another-card',assetId:'other'};
 assert.deepEqual(selectPrimaryImage([unrelated,publicImage],'test-card'),selectPrimaryImage([publicImage,unrelated],'test-card'));
 assert.equal(selectPrimaryImage([publicImage,{...publicImage,assetId:'conflicting'}],'test-card'),null);
 assert.throws(()=>validateImageManifest(manifest([asset,{...asset,id:'second'}]),targets),/primary/);
});
test('unknown JSON, identity, dates and unsafe paths cannot enter the image pipeline',()=>{
 for(const input of [null,{},manifest([{...asset,cardId:'wrong'}]),manifest([{...asset,variantId:'silver'}]),manifest([{...asset,checkedAt:'2026-02-30'}]),manifest([{...asset,input:{file:'../test.png',sha256:'a'.repeat(64)}}]),manifest([{...asset,approvalStatus:'yes'} as unknown as ImageAsset])]) assert.throws(()=>validateImageManifest(input,targets));
 const candidate={...asset,matchStatus:'CANDIDATE' as const,usageStatus:'UNKNOWN_RIGHTS' as const,approvalStatus:'PENDING' as const,isPrimary:false,input:null};
 assert.equal(validateImageManifest(manifest([candidate]),targets).assets[0].input,null);
});
test('approved synthetic image generates optimized repeatable bytes; unapproved images never publish',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'boxscout-images-'));
 try {
   const input=join(dir,'input'); mkdirSync(input);
   const bytes=await sharp({create:{width:1000,height:1400,channels:3,background:'#d8eaba'}}).png().toBuffer();
   writeFileSync(join(input,'test.png'),bytes);
   const approved={...asset,input:{file:'test.png',sha256:hash(bytes)}};
   const path=join(dir,'manifest.json'); writeFileSync(path,JSON.stringify(manifest([approved])));
   const options={manifestPath:path,inputDirectory:input,publicDirectory:join(dir,'public'),outputPath:join(dir,'generated.ts'),targets,check:false};
   const images=await generateImages(options);
   assert.equal(images.length,1); assert.equal(images[0].width,800); assert.equal(images[0].height,1120);
   assert.ok(images[0].bytes < bytes.length); assert.equal(displayableImage(images[0],'test-card'),images[0].assetUrl);
   assert.ok(!readFileSync(options.outputPath,'utf8').includes('test-permission'));
   const metadata=await sharp(readFileSync(join(options.publicDirectory,images[0].assetUrl.split('/').pop()!))).metadata();
   assert.equal(metadata.format,'webp'); assert.equal(metadata.exif,undefined);
   assert.deepEqual(await generateImages({...options,check:true,replay:true}),images);
   assert.deepEqual(await generateImages({...options,check:true,inputDirectory:join(dir,'absent')}),images);
   writeFileSync(join(options.publicDirectory,'unapproved.webp'),bytes);
   await assert.rejects(generateImages({...options,check:true}),/Unapproved/);
   rmSync(join(options.publicDirectory,'unapproved.webp'));
   writeFileSync(path,JSON.stringify(manifest([{...approved,usageStatus:'UNKNOWN_RIGHTS'}])));
   await assert.rejects(generateImages(options),/rights/);
   writeFileSync(path,JSON.stringify(manifest([{...approved,isPrimary:false,approvalStatus:'WITHDRAWN'}])));
   await assert.rejects(generateImages(options),/stale/);
   writeFileSync(path,JSON.stringify(manifest([{...approved,input:{file:'test.png',sha256:'0'.repeat(64)}}])));
   await assert.rejects(generateImages(options),/hash/);
   const avif=await sharp(bytes).avif().toBuffer(); writeFileSync(join(input,'test.avif'),avif);
   const avifAsset={...approved,format:'avif' as const,input:{file:'test.avif',sha256:hash(avif)}};
   writeFileSync(path,JSON.stringify(manifest([avifAsset,{...avifAsset,id:'test-image-other',side:'BACK'}])));
   const second={...options,publicDirectory:join(dir,'second-public')};
   const pair=await generateImages(second); assert.equal(pair.length,2);
   assert.deepEqual(await generateImages({...second,check:true}),pair);
 } finally { rmSync(dir,{recursive:true,force:true}); }
});
test('image repository keeps the full checklist unchanged and publishes no uncleared imagery',()=>{
 const cards=catalogRepository.listReleaseCards(goldenProduct.release.id);
 assert.equal(cards.length,500); assert.deepEqual(cards.map(c=>c.id),goldenCards.map(c=>c.id));
 assert.deepEqual(cards.map(c=>Number(c.cardNumber)),Array.from({length:500},(_,i)=>i+1));
 assert.equal(publicImages.length,0);
 assert.ok(cards.every(c=>displayableImage(c.image,c.id)===null));
});
