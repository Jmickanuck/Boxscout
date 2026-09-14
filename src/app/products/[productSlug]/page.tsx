import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalogRepository } from '@/repositories/catalog-repository';
import { ProductHeader } from '@/components/products/product-header';
export default async function ProductPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const product = catalogRepository.findProduct((await params).productSlug);
  if (!product) notFound();
  const cards = catalogRepository.listReleaseCards(product.release.id);
  return <><ProductHeader product={product} active="overview" />
    <section className="overview-panel"><p className="eyebrow">BEFORE YOU BUY</p><h2>The box, at a glance.</h2><p className="muted">This first version establishes the checklist. Purchase-critical box details still need source verification.</p>
      <dl className="facts"><div><dt>Current sealed price</dt><dd>Unknown</dd></div><div><dt>Exact configuration / SKU</dt><dd>Unverified</dd></div><div><dt>Packs and cards per box</dt><dd>Not yet verified</dd></div><div><dt>Pull rules and exclusives</dt><dd>Not yet verified</dd></div></dl>
      <p className="notice">The Mastermind Mega has not been verified as NPP Mega. Release checklist membership does not confirm that a card or parallel is pullable from this exact box.</p>
    </section>
    <section className="checklist-callout"><div><p className="eyebrow">EXPLORE THE RELEASE</p><h2>{cards.length} sourced base cards</h2><p>A small checklist sample with independent Owned and Watching controls.</p></div><Link className="button" href={'/products/' + product.slug + '/cards'}>Browse cards →</Link></section>
    <section className="sources"><h2>Sources & coverage</h2><p>Checklist identity checked on 14 September 2026. This sample excludes variations, inserts and parallels.</p>{product.release.provenance.map(source => <a key={source.sourceUrl} href={source.sourceUrl} target="_blank" rel="noreferrer">{source.sourceName} ↗</a>)}</section>
  </>;
}
