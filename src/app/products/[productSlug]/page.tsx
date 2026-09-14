import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalogRepository } from '@/repositories/catalog-repository';
import { ProductHeader } from '@/components/products/product-header';
import { ConfigurationIntelligence } from '@/components/products/configuration-intelligence';
export default async function ProductPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const product = catalogRepository.findProduct((await params).productSlug);
  if (!product) notFound();
  const cards = catalogRepository.listReleaseCards(product.release.id);
  const intelligence = catalogRepository.getConfigurationIntelligence(product.id);
  const prices = catalogRepository.listSealedPrices(product.id);
  return <><ProductHeader product={product} active="overview" />
    {intelligence ? <ConfigurationIntelligence intelligence={intelligence} prices={prices} /> : <p>Configuration intelligence unknown.</p>}
    <section className="checklist-callout"><div><p className="eyebrow">EXPLORE THE RELEASE</p><h2>{cards.length} sourced base cards</h2><p>The complete base checklist with independent Owned and Watching controls.</p></div><Link className="button" href={'/products/' + product.slug + '/cards'}>Browse cards →</Link></section>
    <section className="sources"><h2>Sources & coverage</h2><p>Official release identity source below. The Cards page retains its separate checklist sources; base coverage excludes variations, inserts and parallels.</p>{product.release.provenance.map(source => <a key={source.sourceUrl} href={source.sourceUrl} target="_blank" rel="noreferrer">{source.sourceName} ↗</a>)}</section>
  </>;
}
