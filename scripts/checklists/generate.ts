import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeChecklist, serializeChecklist } from './normalize.ts';
import type { ImportBundle, Manifest, ImportRow } from './normalize.ts';

export function readImport(manifestPath: string): ImportBundle {
  const directory = dirname(manifestPath);
  const manifest: Manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const extracts: Record<string, ImportRow[]> = {};
  for (const source of manifest.sources) {
    const bytes = readFileSync(resolve(directory, source.extract));
    if (createHash('sha256').update(bytes).digest('hex') !== source.extractSha256) throw new Error('Extract hash changed: ' + source.id);
    extracts[source.id] = JSON.parse(bytes.toString('utf8'));
  }
  return { manifest, extracts, resolutions: JSON.parse(readFileSync(resolve(directory, 'discrepancies.json'), 'utf8')), legacy: JSON.parse(readFileSync(resolve(directory, 'legacy-identities.json'), 'utf8')) };
}

export function generate(manifestPath: string, check: boolean): void {
  const bundle = readImport(manifestPath);
  const output = resolve(dirname(manifestPath), bundle.manifest.output);
  const text = serializeChecklist(normalizeChecklist(bundle));
  // Validation completes before any canonical output is touched. Never update hashes or review status automatically.
  if (check) { if (readFileSync(output, 'utf8') !== text) throw new Error('Generated checklist is stale'); }
  else writeFileSync(output, text, 'utf8');
  console.log(`${check ? 'Verified reproducible' : 'Generated'} checklist: ${bundle.manifest.expectedCount} cards`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const path = process.argv.slice(2).find(arg => arg !== '--check');
  if (!path) throw new Error('Usage: node scripts/checklists/generate.ts <manifest.json> [--check]');
  generate(resolve(path), process.argv.includes('--check'));
}
