export type VerificationState = 'RAW' | 'CANDIDATE' | 'REVIEWED' | 'VERIFIED';
export type Provenance = Readonly<{
  sourceName: string; sourceUrl: string; checkedAt: string;
  verificationState: VerificationState; scope: string;
}>;
export type CardImage = Readonly<{
  assetUrl: string | null; sourceUrl: string | null;
  matchStatus: 'CANDIDATE' | 'REVIEWED' | 'VERIFIED' | 'MISSING';
  usageStatus: 'INTERNAL_REFERENCE' | 'PUBLIC_ALLOWED' | 'USER_SUBMITTED' | 'OWNED_ASSET' | 'UNKNOWN_RIGHTS';
}>;
export type Card = Readonly<{
  id: string; releaseId: string; cardNumber: string; playerName: string;
  country: string; subset: string; sortOrder: number;
  provenance: readonly Provenance[]; image: CardImage;
}>;
export type Release = Readonly<{
  id: string; name: string; year: number; manufacturer: string;
  provenance: readonly Provenance[];
}>;
export type Configuration = Readonly<{
  id: string; releaseId: string; name: string; sku: string | null; upc: string | null;
  identificationStatus: 'UNKNOWN' | 'PROBABLE' | 'VERIFIED';
  nppMappingStatus: 'UNKNOWN' | 'PROBABLE' | 'VERIFIED';
  packsPerBox: number | null; cardsPerPack: number | null;
  provenance: readonly Provenance[];
}>;
export type Product = Readonly<{ id: string; slug: string; release: Release; configuration: Configuration }>;
export type ConfigurationEligibility = Readonly<{
  configurationId: string; cardId: string; status: 'UNKNOWN' | 'PROBABLE' | 'VERIFIED';
  provenance: readonly Provenance[];
}>;
