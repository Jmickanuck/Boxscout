import assert from 'node:assert/strict';
import test from 'node:test';
import { publication } from '../src/data/published/catalogue.ts';
import { buildCatalogueIndex } from '../src/repositories/catalogue-index.ts';

test('catalogue indexes preserve release, variant and eligibility membership', () => {
  const data = publication.data;
  const index = buildCatalogueIndex(data);
  const product = data.products[0];
  const releaseId = product.release.id;

  assert.equal(index.productBySlug.get(product.slug)?.id, product.id);
  assert.equal(index.releaseById.get(releaseId)?.id, releaseId);
  assert.equal(index.productsByRelease.get(releaseId)?.length, data.products.length);
  assert.equal(index.entriesByRelease.get(releaseId)?.length, data.entries.length);
  assert.equal(index.variantsByRelease.get(releaseId)?.length, data.variants.length);
  assert.equal(index.configurationsByRelease.get(releaseId)?.length, data.configurations.length);
  assert.equal(index.eligibilityByRelease.get(releaseId)?.length, data.eligibility.length);

  const firstVariant = data.variants[0];
  assert.equal(index.variantsByEntry.get(firstVariant.entryId)?.some((item) => item.id === firstVariant.id), true);
  assert.equal(
    index.eligibilityByVariant.get(firstVariant.id)?.every((edge) => edge.variantId === firstVariant.id) ?? true,
    true,
  );
});
