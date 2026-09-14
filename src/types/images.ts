export type ImageMatchState = 'CANDIDATE' | 'REVIEWED' | 'VERIFIED' | 'MISSING';
export type ImageUsageState = 'INTERNAL_REFERENCE' | 'PUBLIC_ALLOWED' | 'USER_SUBMITTED' | 'OWNED_ASSET' | 'UNKNOWN_RIGHTS';
export type ImageApprovalState = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
export type ImageSide = 'FRONT' | 'BACK';
export type ImageAsset = Readonly<{
  id: string; releaseId: string; cardId: string; variantId: string | null; side: ImageSide;
  sourceName: string; sourceUrl: string; originalUrl: string | null; checkedAt: string;
  matchStatus: ImageMatchState; matchRationale: string;
  usageStatus: ImageUsageState; rightsRationale: string;
  approvalStatus: ImageApprovalState; reviewedBy: string | null; reviewedAt: string | null;
  isPrimary: boolean;
  rights: Readonly<{ evidenceUrl: string; publicWeb: boolean; derivatives: boolean; repositoryDistribution: boolean; expiresAt: string | null }> | null;
  credit: string | null;
  input: Readonly<{ file: string; sha256: string }> | null;
  width: number | null; height: number | null; format: 'jpeg' | 'png' | 'webp' | 'avif' | null;
}>;
// Only this projection crosses the server/client boundary; no private review or original URL.
export type PublicImage = Readonly<{
  assetId: string; cardId: string; variantId: string | null; side: ImageSide;
  assetUrl: string; sourceUrl: string; matchStatus: 'VERIFIED'; usageStatus: 'PUBLIC_ALLOWED';
  approvalStatus: 'APPROVED'; width: number; height: number; format: 'webp';
  sha256: string; bytes: number; credit: string | null;
}>;
export type ImageManifest = Readonly<{ schemaVersion: 1; releaseId: string; assets: readonly ImageAsset[] }>;
