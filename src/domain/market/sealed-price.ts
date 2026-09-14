import type { SealedPriceObservation } from '../../types/market.ts';

export function isValidObservationDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0,19) === value.slice(0,19);
}
export function selectSealedPrice(observations: readonly SealedPriceObservation[], listingId: string, productId: string, now: Date) {
  const valid = observations.filter(item =>
    item.retailerListingId === listingId && item.productId === productId && item.currency === 'CAD' &&
    item.observationType === 'LISTING_PRICE' && item.saleUnit === 'ONE_SEALED_BOX' &&
    item.provenance.verificationState === 'VERIFIED' && item.provenance.sourceUrl.startsWith('https://') &&
    Number.isSafeInteger(item.amountMinor) && item.amountMinor > 0 && isValidObservationDate(item.observedAt) &&
    Date.parse(item.observedAt) <= now.getTime()
  ).toSorted((a,b) => Date.parse(b.observedAt) - Date.parse(a.observedAt) || a.id.localeCompare(b.id));
  if (!valid.length) return { observation: null, conflict: false, history: valid };
  const latest = valid.filter(item => Date.parse(item.observedAt) === Date.parse(valid[0].observedAt));
  const signatures = new Set(latest.map(item => JSON.stringify([item.amountMinor,item.availability,item.taxIncluded,item.shippingIncluded])));
  return { observation: signatures.size > 1 ? null : latest[0], conflict: signatures.size > 1, history: valid };
}
export function formatCad(amountMinor: number): string {
  return 'CAD ' + new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol' }).format(amountMinor / 100);
}
export function formatObservedAt(value: string): string {
  return new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Toronto' }).format(new Date(value)) + ' (Toronto)';
}
