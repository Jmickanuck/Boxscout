import type { ConfigurationIntelligence as Intelligence } from '@/types/catalog';
import type { SealedPriceObservation } from '@/types/market';
import { buildConfigurationOverview, claimText, mappingLabel } from '@/domain/catalog/configuration-intelligence';
import { formatCad, formatObservedAt, selectSealedPrice } from '@/domain/market/sealed-price';

export function ConfigurationIntelligence({ intelligence, prices }: { intelligence: Intelligence; prices: readonly SealedPriceObservation[] }) {
  const view = buildConfigurationOverview(intelligence);
  const selection = selectSealedPrice(prices, view.listing.id, view.listing.productId, new Date());
  const price = selection.observation;
  const sourceFor = (id: string) => view.sources.find(source => source.id === id)!;
  return <section className="overview-panel intelligence">
    <p className="eyebrow">BEFORE YOU BUY</p>
    <h2>The box, with the evidence.</h2>
    <div className="price-observation">
      <p className="muted">Last checked listing price · one sealed box</p>
      <p className="price-amount">{price ? formatCad(price.amountMinor) : 'Unknown'}</p>
      {price ? <>
        <p><a href={price.provenance.sourceUrl} target="_blank" rel="noreferrer">{price.provenance.sourceName} ↗</a></p>
        <p>Observed <time dateTime={price.observedAt}>{formatObservedAt(price.observedAt)}</time></p>
        <p className="muted">Availability {price.availability === 'UNKNOWN' ? 'unconfirmed' : price.availability === 'IN_STOCK' ? 'reported in stock at observation' : 'reported out of stock at observation'}. Shipping {price.shippingIncluded === 'YES' ? 'included in the observed price' : price.shippingIncluded === 'NO' ? 'calculated separately' : 'treatment unknown'}; tax {price.taxIncluded === 'UNKNOWN' ? 'treatment unverified' : price.taxIncluded === 'YES' ? 'included' : 'excluded'}.</p>
      </> : <p>{selection.conflict ? 'Conflicting observations at the latest timestamp; no single price selected.' : 'No verified dated CAD observation available for this listing.'}</p>}
      <p className="fine-print">A dated retailer quote, not live pricing or a completed sale.</p>
    </div>
    <h3>Retailer identity</h3>
    <dl className="facts">
      <div><dt>Mastermind SKU</dt><dd>{view.listing.retailerSku.value}</dd></div>
      <div><dt>Retailer-reported UPC</dt><dd>{view.listing.reportedUpc.value}</dd></div>
      <div><dt>Configuration assessment</dt><dd><span className="badge">{mappingLabel(view.status)}</span></dd></div>
    </dl>
    <p className="fine-print"><a href={view.listing.listingUrl} target="_blank" rel="noreferrer">Identifier source: Mastermind Toys ↗</a> · Checked {sourceFor(view.listing.reportedUpc.evidenceIds[0]).checkedAt}. UPC check-digit validity does not prove configuration identity.</p>
    <p>{view.rationale}</p>
    <p className="notice">{view.gaps.join(' ')}</p>
    <h3>Packaging specification</h3>
    {view.specification ? <>
      <p className="pack-counts">{view.specification.packsPerBox} packs × {view.specification.cardsPerPack} cards = <strong>{view.specification.packsPerBox * view.specification.cardsPerPack} cards</strong></p>
      <p className="fine-print">{view.status === 'VERIFIED' ? 'Verified mapping' : view.status === 'PROBABLE' ? 'Probable applicability to this exact box' : 'Retailer-reported counts; configuration mapping unknown'}. <a href={sourceFor(view.specification.evidenceId).sourceUrl} target="_blank" rel="noreferrer">{sourceFor(view.specification.evidenceId).sourceName} ↗</a> · Checked {sourceFor(view.specification.evidenceId).checkedAt}. Matching-UPC retailers corroborate these counts.</p>
    </> : <p>{view.specConflict ? 'Conflicting pack specifications; exact counts unresolved.' : 'Exact pack specification unknown.'}</p>}
    <h3>Reported contents — per box, on average</h3>
    <p className="muted">Matching-UPC retailer claims. These are averages, not promises for an individual box; applicability to Mastermind is {view.status.toLowerCase()}.</p>
    {view.averages.length ? <ul className="claim-list">{view.averages.map(claim => <li key={claim.id}>{claimText(claim)}<small><a href={sourceFor(claim.evidenceId).sourceUrl} target="_blank" rel="noreferrer">{sourceFor(claim.evidenceId).sourceName} ↗</a> · Checked {sourceFor(claim.evidenceId).checkedAt}</small></li>)}</ul> : <p>No reviewed average claims for this UPC.</p>}
    {view.hasClaimConflict && <p className="notice">Wording conflict: the NPP sell sheet uses guarantee language; matching-UPC retailer descriptions use averages. We show the conservative average interpretation. Guarantees for this exact box remain unresolved.</p>}
    <details className="evidence-disclosure"><summary>Source wording & evidence</summary>
      <p className="fine-print">Source priority: Panini official → official sell sheets → matching-identifier retailers → secondary sources. Priority never erases conflicting wording.</p>
      {view.sources.map(source => <section className="source-record" key={source.id}>
        <h4><a href={source.sourceUrl} target="_blank" rel="noreferrer">{source.sourceName} ↗</a></h4>
        <p className="fine-print">Checked {source.checkedAt} · {source.verificationState.toLowerCase()} observation · {source.locator}</p>
        <p>{source.statement}</p><p className="muted">{source.qualification}</p>
        {view.claims.some(claim => claim.evidenceId === source.id) && <ul>{view.claims.filter(claim => claim.evidenceId === source.id).map(claim => <li key={claim.id}>{claimText(claim)}<small>{claim.qualification}</small></li>)}</ul>}
      </section>)}
    </details>
    <details className="evidence-disclosure"><summary>Dated price observations ({selection.history.length})</summary>
      <p className="fine-print">Separate checks are retained even when the price is unchanged.</p>
      <ul>{selection.history.map(item => <li key={item.id}>{formatCad(item.amountMinor)} · <time dateTime={item.observedAt}>{formatObservedAt(item.observedAt)}</time><small>{item.availabilityNote} <a href={item.provenance.sourceUrl} target="_blank" rel="noreferrer">Listing source ↗</a></small></li>)}</ul>
    </details>
    <p className="fine-print">This assessment does not verify individual checklist-card or parallel eligibility.</p>
  </section>;
}
