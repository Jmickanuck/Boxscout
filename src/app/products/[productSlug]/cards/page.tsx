import { notFound } from 'next/navigation';
import { catalogRepository } from '@/repositories/catalog-repository';
import { ProductHeader } from '@/components/products/product-header';
import { CardBrowser } from '@/components/cards/card-browser';
export default async function CardsPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const product = catalogRepository.findProduct((await params).productSlug);
  if (!product) notFound();
  const cards = catalogRepository.listReleaseCards(product.release.id);
  const sources = [...new Map(cards.flatMap(card => card.provenance).map(source => [source.sourceUrl, source])).values()];
  const credits = [...new Map(cards.filter(card => card.image.credit && card.image.assetId).map(card => [card.image.assetId, card.image])).values()];
  return <><ProductHeader product={product} active="cards" /><div className="section-heading"><h2>The checklist</h2><span>{cards.length} base cards</span></div>
    <p className="checklist-note">Verified release checklist identities. Eligibility for this exact Mega Box is unverified. Images display only when matching and publication rights are approved; otherwise placeholders remain.</p>
    <CardBrowser cards={cards} />
    {credits.length > 0 && <section className="sources"><h2>Image credits</h2>{credits.map(image => <p key={image.assetId}><a href={image.sourceUrl ?? undefined} target="_blank" rel="noreferrer">{image.credit}</a></p>)}</section>}
    <section className="sources"><h2>Checklist sources</h2><p>Base cards #1–500 · Checked 14 September 2026 · Complete base checklist</p>{sources.map(source => <a key={source.sourceUrl} href={source.sourceUrl} target="_blank" rel="noreferrer">{source.sourceName} ↗</a>)}</section>
  </>;
}
