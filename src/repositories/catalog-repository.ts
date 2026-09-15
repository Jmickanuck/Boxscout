import { assessNppMapping } from '../domain/catalog/configuration-intelligence.ts';
import type { Card, ConfigurationIntelligence, Product, Release } from '../types/catalog.ts';
import type { SealedPriceObservation } from '../types/market.ts';
import type { CatalogueData } from '../types/publication.ts';
import type { ReleaseConfiguration } from '../types/variants.ts';
import { cardImageRepository } from './card-image-repository.ts';
import { buildCatalogueIndex } from './catalogue-index.ts';
import { catalogueData, catalogueIndex } from './published-catalogue.ts';

export interface CatalogRepository {
  getConfigurationIntelligence(productId: string): ConfigurationIntelligence | undefined;
  listSealedPrices(productId: string): readonly SealedPriceObservation[];
  listProducts(): readonly Product[];
  listReleases(): readonly Release[];
  findRelease(id: string): Release | undefined;
  listReleaseProducts(releaseId: string): readonly Product[];
  listReleaseConfigurations(releaseId: string): readonly ReleaseConfiguration[];
  listFormatProducts(releaseId: string, familyName: string): readonly Product[];
  findProduct(slug: string): Product | undefined;
  listReleaseCards(releaseId: string): readonly Card[];
}

type CatalogueIndex = ReturnType<typeof buildCatalogueIndex>;

export function createCatalogRepository(
  data: CatalogueData,
  index: CatalogueIndex = buildCatalogueIndex(data),
): CatalogRepository {
  const intelligence = (id: string) => index.intelligenceByProduct.get(id);

  const reviewed = (product: Product): Product => {
    const evidence = intelligence(product.id);
    return evidence
      ? {
          ...product,
          configuration: {
            ...product.configuration,
            nppMappingStatus: assessNppMapping(evidence),
          },
        }
      : product;
  };

  return {
    getConfigurationIntelligence: intelligence,
    listSealedPrices: (id) => index.pricesByProduct.get(id) ?? [],
    listProducts: () => data.products.map(reviewed),
    listReleases: () => [...index.releaseById.values()],
    findRelease: (id) => index.releaseById.get(id),
    listReleaseProducts: (releaseId) => (index.productsByRelease.get(releaseId) ?? []).map(reviewed),
    listReleaseConfigurations: (releaseId) => index.configurationsByRelease.get(releaseId) ?? [],

    // Presentation association only: callers must retain the product's mapping confidence.
    listFormatProducts: (releaseId, familyName) =>
      (index.productsByRelease.get(releaseId) ?? [])
        .filter((product) => {
          const evidence = intelligence(product.id);
          return evidence?.assessment.family === familyName && assessNppMapping(evidence) !== 'UNKNOWN';
        })
        .map(reviewed),

    findProduct: (slug) => {
      const product = index.productBySlug.get(slug);
      return product ? reviewed(product) : undefined;
    },

    listReleaseCards: (releaseId) =>
      (index.entriesByRelease.get(releaseId) ?? [])
        .filter((entry) => entry.entryType === 'BASE')
        .map((card) => {
          const image = cardImageRepository.findPrimary(card.id);
          return image ? { ...card, image } : card;
        }),
  };
}

export const catalogRepository = createCatalogRepository(catalogueData, catalogueIndex);
