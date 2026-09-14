import type { CardImage } from '../../types/catalog.ts';
export function displayableImage(image: CardImage): string | null {
  return image.matchStatus === 'VERIFIED' && ['PUBLIC_ALLOWED', 'OWNED_ASSET'].includes(image.usageStatus) ? image.assetUrl : null;
}
