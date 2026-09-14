import type { Provenance } from './catalog.ts';

export type SealedPriceObservation = Readonly<{
  id: string;
  retailerListingId: string;
  productId: string;
  amountMinor: number;
  currency: string;
  observedAt: string;
  observationType: 'LISTING_PRICE';
  saleUnit: 'ONE_SEALED_BOX';
  availability: 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';
  availabilityNote: string;
  taxIncluded: 'YES' | 'NO' | 'UNKNOWN';
  shippingIncluded: 'YES' | 'NO' | 'UNKNOWN';
  provenance: Provenance;
}>;
