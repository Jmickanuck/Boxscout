import type { CatalogueData } from '../types/publication.ts';

function push<K, V>(map: Map<K, V[]>, key: K, value: V) {
  const current = map.get(key);
  if (current) current.push(value);
  else map.set(key, [value]);
}

/**
 * Build immutable-by-convention lookup indexes once for the approved publication.
 *
 * The publication arrays remain the source projection; these Maps only prevent
 * repositories from repeatedly rescanning the entire catalogue as it grows.
 */
export function buildCatalogueIndex(data: CatalogueData) {
  const productBySlug = new Map(data.products.map((product) => [product.slug, product]));
  const releaseById = new Map(data.products.map((product) => [product.release.id, product.release]));
  const intelligenceByProduct = new Map(data.intelligence.map((item) => [item.productId, item.data]));
  const entryById = new Map(data.entries.map((entry) => [entry.id, entry]));

  const productsByRelease = new Map<string, typeof data.products>();
  const entriesByRelease = new Map<string, typeof data.entries>();
  const variantsByEntry = new Map<string, typeof data.variants>();
  const variantsByRelease = new Map<string, typeof data.variants>();
  const configurationsByRelease = new Map<string, typeof data.configurations>();
  const eligibilityByRelease = new Map<string, typeof data.eligibility>();
  const eligibilityByVariant = new Map<string, typeof data.eligibility>();
  const pricesByProduct = new Map<string, typeof data.prices>();

  for (const product of data.products) push(productsByRelease, product.release.id, product);
  for (const entry of data.entries) push(entriesByRelease, entry.releaseId, entry);
  for (const configuration of data.configurations) {
    push(configurationsByRelease, configuration.releaseId, configuration);
  }
  for (const price of data.prices) push(pricesByProduct, price.productId, price);

  const variantRelease = new Map<string, string>();
  for (const variant of data.variants) {
    push(variantsByEntry, variant.entryId, variant);
    const releaseId = entryById.get(variant.entryId)?.releaseId;
    if (!releaseId) continue;
    variantRelease.set(variant.id, releaseId);
    push(variantsByRelease, releaseId, variant);
  }

  for (const edge of data.eligibility) {
    push(eligibilityByVariant, edge.variantId, edge);
    const releaseId = variantRelease.get(edge.variantId);
    if (releaseId) push(eligibilityByRelease, releaseId, edge);
  }

  return {
    productBySlug,
    releaseById,
    intelligenceByProduct,
    entryById,
    productsByRelease,
    entriesByRelease,
    variantsByEntry,
    variantsByRelease,
    configurationsByRelease,
    eligibilityByRelease,
    eligibilityByVariant,
    pricesByProduct,
  };
}
