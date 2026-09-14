import { goldenCards, goldenProduct } from '../data/fixtures/golden-product.ts';
import type { Card, Product } from '../types/catalog.ts';

export interface CatalogRepository {
  listProducts(): readonly Product[];
  findProduct(slug: string): Product | undefined;
  listReleaseCards(releaseId: string): readonly Card[];
}
export const catalogRepository: CatalogRepository = {
  listProducts: () => [goldenProduct],
  findProduct: slug => slug === goldenProduct.slug ? goldenProduct : undefined,
  listReleaseCards: releaseId => goldenCards.filter(card => card.releaseId === releaseId),
};
