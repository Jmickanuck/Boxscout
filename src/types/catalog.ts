export type VerificationState = 'RAW' | 'CANDIDATE' | 'REVIEWED' | 'VERIFIED';
export type Provenance = Readonly<{
  sourceName: string; sourceUrl: string; checkedAt: string;
  sourceId?: string; locator?: string;
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
  verificationState: VerificationState; checkedAt: string; discrepancyIds: readonly string[];
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


export type AssessmentStatus = 'UNKNOWN' | 'PROBABLE' | 'VERIFIED';
export type SourceKind = 'PANINI_OFFICIAL' | 'OFFICIAL_SELL_SHEET' | 'EXACT_RETAILER' | 'SECONDARY';
export type SourceEvidence = Provenance & Readonly<{
  id: string;
  sourceKind: SourceKind;
  locator: string;
  statement: string;
  qualification: string;
  observedAt?: string;
}>;
export type SourcedIdentifier = Readonly<{ value: string; evidenceIds: readonly string[] }>;
export type RetailerListing = Readonly<{
  id: string;
  productId: string;
  configurationId: string;
  retailerName: string;
  listingUrl: string;
  variantOfferUrl: string;
  variantId: string;
  retailerSku: SourcedIdentifier;
  reportedUpc: SourcedIdentifier;
}>;
export type ConfigurationLink = Readonly<{
  evidenceId: string;
  family: string;
  upc: string | null;
  linkKind: 'EXPLICIT_UPC_FAMILY' | 'MATCHING_UPC_CONTENTS' | 'FAMILY_ONLY' | 'RELEASE_ONLY';
}>;
export type ClaimSemantics = 'GUARANTEED' | 'PER_BOX_AVERAGE' | 'PUBLISHED_ODDS' | 'POSSIBLE';
export type ClaimSubject = Readonly<{ scope: 'MATCHING_UPC' | 'CONFIGURATION_FAMILY'; value: string }>;
export type BoxContentClaim = Readonly<{
  id: string;
  subject: ClaimSubject;
  evidenceId: string;
  item: string;
  quantity: number | null;
  unit: 'PER_BOX';
  claimSemantics: ClaimSemantics | null;
  publishedOdds: string | null;
  includes: readonly Readonly<{ item: string; quantity: number }>[];
  conflictIds: readonly string[];
  qualification: string;
}>;
export type PackagingSpecification = Readonly<{
  id: string;
  subject: ClaimSubject;
  evidenceId: string;
  packsPerBox: number;
  cardsPerPack: number;
  statedCardsPerBox: number | null;
}>;
export type ConfigurationIntelligence = Readonly<{
  listing: RetailerListing;
  evidence: readonly SourceEvidence[];
  links: readonly ConfigurationLink[];
  assessment: Readonly<{ family: string; reviewedStatus: AssessmentStatus; rationale: string; gaps: readonly string[] }>;
  specifications: readonly PackagingSpecification[];
  claims: readonly BoxContentClaim[];
}>;
