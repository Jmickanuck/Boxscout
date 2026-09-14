import { publicImages } from '../data/fixtures/generated/golden-product-images.ts';
import { selectPrimaryImage } from '../domain/catalog/images.ts';
import type { PublicImage } from '../types/images.ts';
export function createCardImageRepository(images: readonly PublicImage[]) {
  return { findPrimary: (cardId: string, variantId: string | null = null) => selectPrimaryImage(images, cardId, variantId) };
}
export const cardImageRepository = createCardImageRepository(publicImages);
