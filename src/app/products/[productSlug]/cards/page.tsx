import { variantRepository } from '@/repositories/variant-repository';
import { notFound } from 'next/navigation';
import { catalogRepository } from '@/repositories/catalog-repository';
import { ProductHeader } from '@/components/products/product-header';
import { CardBrowser } from '@/components/cards/card-browser';
export default async function CardsPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const product = catalogRepository.findProduct((await params).productSlug);
  if (!product) notFound();
  const cards = catalogRepository.listReleaseCards(product.release.id);
  const sources = [...new Map(cards.flatMap(card => card.provenance).map(source => [source.sourceUrl, source])).values()];
  const images = variantRepository.images(product.release.id);
  const credits = [...new Map(Object.values(images).filter(image => image.credit && image.assetId).map(image => [image.assetId, image])).values()];
  return <><ProductHeader product={product} active="cards" /><div className="section-heading"><h2>The checklist</h2><span>{cards.length} base cards</span></div>
    <p className="checklist-note">Browse cards and exact parallels documented for the Mega Box family. Choose a version to narrow the list. Coverage is incomplete, especially for some autograph families and retailer versions; uncertain links remain marked as probable.</p>
    <CardBrowser mega data={variantRepository.browse(product.release.id)} images={images} />
    {credits.length > 0 && <section className="sources"><h2>Image credits</h2>{credits.map(image => <p key={image.assetId}><a href={image.sourceUrl ?? undefined} target="_blank" rel="noreferrer">{image.credit}</a></p>)}</section>}
    <section className="sources"><h2>Checklist sources</h2><p>Base cards #1–500 · Checked 14 September 2026 · Complete base checklist</p>{variantRepository.sources.map(source=><a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>)}{sources.map(source => <a key={source.sourceUrl} href={source.sourceUrl} target="_blank" rel="noreferrer">{source.sourceName} ↗</a>)}</section>
  </>;
}
