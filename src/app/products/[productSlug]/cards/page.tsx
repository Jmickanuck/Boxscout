import { notFound } from 'next/navigation';
import { catalogRepository } from '@/repositories/catalog-repository';
import { ProductHeader } from '@/components/products/product-header';
import { CardBrowser } from '@/components/cards/card-browser';
export default async function CardsPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const product = catalogRepository.findProduct((await params).productSlug);
  if (!product) notFound();
  const cards = catalogRepository.listReleaseCards(product.release.id);
  return <><ProductHeader product={product} active="cards" /><div className="section-heading"><h2>The checklist</h2><span>{cards.length} card sample</span></div>
    <p className="checklist-note">Verified release checklist identities. Eligibility for this exact Mega Box is unverified. Images are placeholders until approved imagery is available.</p>
    <CardBrowser cards={cards} />
    <section className="sources"><h2>Checklist sources</h2><p>Base cards #1–24 · Checked 14 September 2026 · Partial checklist</p>{(cards[0]?.provenance ?? []).map(source => <a key={source.sourceUrl} href={source.sourceUrl} target="_blank" rel="noreferrer">{source.sourceName} ↗</a>)}</section>
  </>;
}
