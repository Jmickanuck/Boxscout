import { cardImageRepository } from './card-image-repository.ts';
import { goldenCards, goldenProduct } from '../data/fixtures/golden-product.ts';
import { configurationIntelligence, sealedPriceObservations } from '../data/fixtures/golden-product-configuration.ts';
import { assessNppMapping } from '../domain/catalog/configuration-intelligence.ts';
import type { SealedPriceObservation } from '../types/market.ts';
import type { Card, Product, ConfigurationIntelligence } from '../types/catalog.ts';

export interface CatalogRepository {
  getConfigurationIntelligence(productId: string): ConfigurationIntelligence | undefined;
  listSealedPrices(productId: string): readonly SealedPriceObservation[];
  listProducts(): readonly Product[];
  findProduct(slug: string): Product | undefined;
  listReleaseCards(releaseId: string): readonly Card[];
}
function reviewedProduct(): Product {
  return { ...goldenProduct, configuration: { ...goldenProduct.configuration, nppMappingStatus: assessNppMapping(configurationIntelligence) } };
}
export const catalogRepository: CatalogRepository = {
  getConfigurationIntelligence: productId => productId === goldenProduct.id ? configurationIntelligence : undefined,
  listSealedPrices: productId => sealedPriceObservations.filter(item => item.productId === productId),
  listProducts: () => [reviewedProduct()],
  findProduct: slug => slug === goldenProduct.slug ? reviewedProduct() : undefined,
  listReleaseCards: releaseId => goldenCards.filter(card => card.releaseId === releaseId).map(card => {
    const image = cardImageRepository.findPrimary(card.id);
    return image ? { ...card, image } : card;
  }),
};
