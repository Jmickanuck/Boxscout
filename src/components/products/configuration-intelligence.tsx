import type { ConfigurationIntelligence as Intelligence } from '@/types/catalog';
import type { SealedPriceObservation } from '@/types/market';
import { buildConfigurationOverview, listBoxRetailers } from '@/domain/catalog/configuration-intelligence';
import { formatCad, selectSealedPrice } from '@/domain/market/sealed-price';

export function ConfigurationIntelligence({ intelligence, prices }: { intelligence: Intelligence; prices: readonly SealedPriceObservation[] }) {
  const view = buildConfigurationOverview(intelligence);
  const retailers = listBoxRetailers(intelligence);
  const specification = view.specification;
  return <div className="box-overview">
    <section className="overview-panel shopping-panel" aria-labelledby="retailers-heading">
      <p className="eyebrow">FIND YOUR BOX</p>
      <h2 id="retailers-heading">Where to buy</h2>
      <p className="checklist-note">Retailers listing this box. Check each website for current price, stock and delivery.</p>
      {retailers.length ? <ul className="retailer-list">{retailers.map(retailer => {
        const selection = retailer.listingId ? selectSealedPrice(prices, retailer.listingId, view.listing.productId, new Date()) : null;
        const price = selection?.observation;
        return <li key={retailer.id}>
          <div><h3>{retailer.name}</h3><p className="retailer-price">{price ? <><strong>{formatCad(price.amountMinor)}</strong><span>Recorded price</span></> : <span>See retailer for price</span>}</p></div>
          <a className="retailer-link" href={retailer.url} target="_blank" rel="noreferrer" aria-label={'View listing at ' + retailer.name}>View listing <span aria-hidden="true">↗</span></a>
        </li>;
      })}</ul> : <p>Retailer listings are not available yet.</p>}
    </section>
    <section className="overview-panel packaging-panel" aria-labelledby="packaging-heading">
      <h2 id="packaging-heading">Inside the box</h2>
      {specification ? <dl className="packaging-stats">
        <div><dt>Packs per box</dt><dd>{specification.packsPerBox}</dd></div>
        <div><dt>Cards per pack</dt><dd>{specification.cardsPerPack}</dd></div>
        <div><dt>Total cards</dt><dd>{specification.packsPerBox * specification.cardsPerPack}</dd></div>
      </dl> : <p>{view.specConflict ? 'Pack counts are conflicting and still need confirmation.' : 'Pack counts have not been confirmed.'}</p>}
      <h3 className="contents-heading">Average box contents</h3>
      <p className="checklist-note">These are per-box averages. Individual boxes can vary.</p>
      {view.averages.length ? <ul className="box-contents">{view.averages.map(claim => <li key={claim.id}><span>{claim.item}</span><strong>{claim.quantity ?? 'Unknown'}</strong></li>)}</ul> : <p>Average contents have not been confirmed.</p>}
      {(view.status !== 'VERIFIED' || view.hasClaimConflict) && <p className="fine-print box-qualification">{view.status === 'PROBABLE' ? 'This Mega Box is probably the NPP format; exact packaging is still being confirmed. ' : view.status === 'UNKNOWN' ? 'The exact box format is still being confirmed. ' : ''}{view.hasClaimConflict ? 'Guaranteed contents remain unconfirmed.' : ''}</p>}
    </section>
  </div>;
}
