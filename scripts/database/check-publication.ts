import { readFileSync } from 'node:fs';
import { publication } from '../../src/data/published/catalogue.ts';
import { manifestText, snapshotText } from './operations.ts';
import { digest } from './records.ts';
import { validateCatalogue } from './validate.ts';

validateCatalogue(publication.data);

if (publication.schemaVersion !== 1 || digest(publication.data) !== publication.revision) {
  throw new Error('Publication integrity mismatch');
}

if (
  publication.data.entries.some((entry) => !['REVIEWED', 'VERIFIED'].includes(entry.verificationState)) ||
  publication.data.variants.some((variant) => !['REVIEWED', 'VERIFIED'].includes(variant.verificationState))
) {
  throw new Error('Unreviewed publication');
}

if (
  readFileSync('src/data/published/catalogue.ts', 'utf8').replaceAll('\r\n', '\n') !==
  snapshotText(publication)
) {
  throw new Error('Snapshot is not reproducible');
}

if (
  readFileSync('src/data/published/manifest.json', 'utf8').replaceAll('\r\n', '\n') !==
  manifestText(publication)
) {
  throw new Error('Publication manifest is stale or non-deterministic');
}

console.log('Verified offline publication', publication.revision);
