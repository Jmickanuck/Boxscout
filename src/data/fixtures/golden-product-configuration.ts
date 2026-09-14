import type { BoxContentClaim, ConfigurationIntelligence, SourceEvidence } from '../../types/catalog.ts';
import type { SealedPriceObservation } from '../../types/market.ts';

const mastermindUrl = 'https://www.mastermindtoys.com/products/2026-panini-soccer-prizm-world-cup-mega-box';
const upc = '746134202520';
export const configurationEvidence: readonly SourceEvidence[] = [
  {
    id: 'panini-release', sourceKind: 'PANINI_OFFICIAL',
    sourceName: 'Panini America — official release article',
    sourceUrl: 'https://blog.paniniamerica.net/panini-prizm-fifa-world-cup-2026-hits-the-net/',
    checkedAt: '2026-09-14', verificationState: 'VERIFIED', locator: 'Release introduction; configuration headings',
    scope: 'Release identity only; no exact Mega UPC linkage.',
    statement: 'Panini identifies the Prizm FIFA World Cup 2026 soccer release and discusses Hobby, FOTL and Blaster/retail.',
    qualification: 'The article does not identify this Mega UPC. Its other configurations and their counts are not applied to Mega.',
  },
  {
    id: 'panini-npp-sheet', sourceKind: 'OFFICIAL_SELL_SHEET',
    sourceName: 'Panini NPP sell sheet — hosted by GTS',
    sourceUrl: 'https://gogts.net/wp-content/uploads/2026/06/2026-Panini-Prizm-World-Cup-Soccer-Cards-Sell-Sheet-Retail.pdf',
    checkedAt: '2026-09-14', verificationState: 'REVIEWED', locator: 'Page 5, NPP Mega configuration and guarantees block',
    scope: 'NPP Mega family specifications and source claims; no UPC bridge.',
    statement: 'NPP MEGA BOX GUARANTEES',
    qualification: 'Content is subject to change. Manufacturer-branded, distributor-hosted; not Panini-hosted. Does not tie UPC 746134202520 to NPP Mega.',
  },
  {
    id: 'mastermind-listing', sourceKind: 'EXACT_RETAILER', sourceName: 'Mastermind Toys', sourceUrl: mastermindUrl,
    checkedAt: '2026-09-14', observedAt: '2026-09-14T20:30:25.573Z', verificationState: 'VERIFIED',
    locator: 'Visible MMT SKU; Product JSON-LD sku, gtin and offers',
    scope: 'Observed Canadian listing identifiers and offer only.',
    statement: 'Retailer SKU 256877; reported GTIN 746134202520; variant 41821202317445; CAD 119.99.',
    qualification: 'Retailer-reported UPC is not manufacturer configuration confirmation. Structured stock and page text conflict. Distributor brand metadata is not used as the release manufacturer.',
  },
  {
    id: 'emporium-mega', sourceKind: 'EXACT_RETAILER', sourceName: 'Collectors Emporium',
    sourceUrl: 'https://collectorsemporium.com/en-ca/products/2026-panini-prizm-fifa-world-cup-trading-cards-mega-box',
    checkedAt: '2026-09-14', verificationState: 'REVIEWED', locator: 'UPC row and product description',
    scope: 'Same-UPC NPP/Retail description, pack counts and per-box-average claims.',
    statement: 'Lists UPC 746134202520 and describes NPP/Retail Mega. Gives average contents and mentions Red Disco /99.',
    qualification: 'Retailer statement; not an authoritative manufacturer UPC-to-NPP bridge. Final physical packaging has not been inspected.',
  },
  {
    id: 'scheels-mega', sourceKind: 'EXACT_RETAILER', sourceName: 'SCHEELS',
    sourceUrl: 'https://www.scheels.com/p/18467-2-20253-20mo20/74613420252',
    checkedAt: '2026-09-14', verificationState: 'REVIEWED', locator: 'Product GTIN data and full description',
    scope: 'Same-UPC pack counts and grouped Prizm average.',
    statement: 'GTIN 746134202520; six packs of seven cards; eight Prizms including six Disco Prizms per box on average.',
    qualification: 'Six Disco Prizms are included in eight, not additional. No price from this retailer is imported.',
  },
];

const contents = [
  ['numbered', 'Numbered Prizm', 1],
  ['other', 'Other Prizms', 6],
  ['silver', 'Silver Prizm', 1],
  ['silver-insert', 'Silver insert', 1],
  ['other-insert', 'Other inserts / insert parallels', 5],
] as const;
// Keep each source's semantics intact. Family guarantees are never rewritten as retailer averages.
const contentClaims: readonly BoxContentClaim[] = contents.flatMap(([key, item, quantity]) => [
  {
    id: 'retailer-' + key, subject: { scope: 'MATCHING_UPC', value: upc }, evidenceId: 'emporium-mega',
    item, quantity, unit: 'PER_BOX', claimSemantics: 'PER_BOX_AVERAGE', publishedOdds: null, includes: [],
    conflictIds: ['sheet-' + key], qualification: 'Retailer-reported average; exact Mastermind applicability is probable, not guaranteed.',
  },
  {
    id: 'sheet-' + key, subject: { scope: 'CONFIGURATION_FAMILY', value: 'NPP Mega' }, evidenceId: 'panini-npp-sheet',
    item, quantity, unit: 'PER_BOX', claimSemantics: 'GUARANTEED', publishedOdds: null, includes: [],
    conflictIds: ['retailer-' + key], qualification: 'Sell-sheet wording for the NPP family; content subject to change. Exact-box guarantee remains unresolved.',
  },
]);
export const configurationIntelligence: ConfigurationIntelligence = {
  listing: {
    id: 'mastermind-256877', productId: 'golden-product-1', configurationId: 'mastermind-mega-unresolved',
    retailerName: 'Mastermind Toys', listingUrl: mastermindUrl,
    variantOfferUrl: mastermindUrl + '?variant=41821202317445', variantId: '41821202317445',
    retailerSku: { value: '256877', evidenceIds: ['mastermind-listing'] },
    reportedUpc: { value: upc, evidenceIds: ['mastermind-listing'] },
  },
  evidence: configurationEvidence,
  links: [
    { evidenceId: 'panini-release', family: 'NPP Mega', upc: null, linkKind: 'RELEASE_ONLY' },
    { evidenceId: 'panini-npp-sheet', family: 'NPP Mega', upc: null, linkKind: 'FAMILY_ONLY' },
    { evidenceId: 'emporium-mega', family: 'NPP Mega', upc, linkKind: 'EXPLICIT_UPC_FAMILY' },
    { evidenceId: 'scheels-mega', family: 'NPP Mega', upc, linkKind: 'MATCHING_UPC_CONTENTS' },
  ],
  assessment: {
    family: 'NPP Mega', reviewedStatus: 'PROBABLE',
    rationale: 'Mastermind reports the same UPC as retailer listings describing NPP/Retail Mega. Their pack counts agree with the Panini NPP sell sheet.',
    gaps: ['No Panini or official distributor record linking this exact UPC to NPP Mega was found in the bounded review.', 'Final physical packaging and its guarantee wording have not been independently inspected.'],
  },
  specifications: [
    { id: 'sheet-packs', subject: { scope: 'CONFIGURATION_FAMILY', value: 'NPP Mega' }, evidenceId: 'panini-npp-sheet', packsPerBox: 6, cardsPerPack: 7, statedCardsPerBox: null },
    { id: 'retailer-packs', subject: { scope: 'MATCHING_UPC', value: upc }, evidenceId: 'emporium-mega', packsPerBox: 6, cardsPerPack: 7, statedCardsPerBox: 42 },
    { id: 'scheels-packs', subject: { scope: 'MATCHING_UPC', value: upc }, evidenceId: 'scheels-mega', packsPerBox: 6, cardsPerPack: 7, statedCardsPerBox: 42 },
  ],
  claims: [...contentClaims, {
    id: 'scheels-group', subject: { scope: 'MATCHING_UPC', value: upc }, evidenceId: 'scheels-mega',
    item: 'Prizms', quantity: 8, unit: 'PER_BOX', claimSemantics: 'PER_BOX_AVERAGE', publishedOdds: null,
    includes: [{ item: 'Disco Prizms', quantity: 6 }], conflictIds: [], qualification: 'Included subcount, not additional cards.',
  }],
};

export const sealedPriceObservations: readonly SealedPriceObservation[] = [
  '2026-09-14T20:20:41.132Z',
  '2026-09-14T20:30:25.573Z',
].map(observedAt => ({
  id: 'mastermind-price-' + observedAt, retailerListingId: 'mastermind-256877', productId: 'golden-product-1',
  amountMinor: 11999, currency: 'CAD', observedAt, observationType: 'LISTING_PRICE', saleUnit: 'ONE_SEALED_BOX',
  availability: 'UNKNOWN', availabilityNote: 'Page representations contain sold-out and in-stock signals; JSON-LD reports InStock. Availability is unconfirmed.',
  taxIncluded: 'UNKNOWN', shippingIncluded: 'NO',
  provenance: { sourceName: 'Mastermind Toys', sourceUrl: mastermindUrl + '?variant=41821202317445', checkedAt: observedAt.slice(0,10), verificationState: 'VERIFIED', scope: 'Observed listed CAD amount for one sealed Mega Box; not a completed sale or a promise of stock. Shipping calculated at checkout; tax treatment unknown.' },
}));
