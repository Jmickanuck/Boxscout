import type { CardImage } from '../../types/catalog.ts';
import type { ImageAsset, PublicImage, ImageSide } from '../../types/images.ts';

// Static delivery cannot enforce expiring grants or erase copies from Git history.
// This pilot accepts only explicitly reviewed, non-expiring repository-safe permission.
export function approvedForPublication(asset: ImageAsset): boolean {
  return asset.matchStatus === 'VERIFIED' && asset.usageStatus === 'PUBLIC_ALLOWED'
    && asset.approvalStatus === 'APPROVED' && !!asset.reviewedBy && !!asset.reviewedAt
    && !!asset.rightsRationale.trim() && !!asset.matchRationale.trim()
    && !!asset.rights?.evidenceUrl && asset.rights.publicWeb === true
    && asset.rights.derivatives === true && asset.rights.repositoryDistribution === true
    && asset.rights.expiresAt === null;
}
export function selectPrimaryImage(images: readonly PublicImage[], cardId: string, variantId: string | null = null, side: ImageSide = 'FRONT'): PublicImage | null {
  const matches = images.filter(i => i.cardId === cardId && i.variantId === variantId && i.side === side);
  // Ambiguity fails closed, independent of input ordering.
  return matches.length === 1 && displayableImage(matches[0], cardId, variantId, side) ? matches[0] : null;
}
export function displayableImage(image: CardImage, cardId?: string, variantId: string | null = null, side: ImageSide = 'FRONT'): string | null {
  return !!cardId && image.cardId === cardId && image.variantId === variantId && image.side === side
    && image.approvalStatus === 'APPROVED' && image.matchStatus === 'VERIFIED' && image.usageStatus === 'PUBLIC_ALLOWED'
    && !!image.assetId && !!image.width && !!image.height && image.format === 'webp'
    && /^\/card-images\/[a-z0-9-]+-[a-f0-9]{64}\.webp$/.test(image.assetUrl ?? '') ? image.assetUrl : null;
}
