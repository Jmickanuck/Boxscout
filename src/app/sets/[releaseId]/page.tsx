import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalogRepository } from '@/repositories/catalog-repository';
import { mappingLabel } from '@/domain/catalog/configuration-intelligence';

export default async function SetPage({ params }: { params: Promise<{ releaseId: string }> }) {
  const { releaseId } = await params;
  const release = catalogRepository.findRelease(releaseId);
  if (!release) notFound();
  const products = catalogRepository.listReleaseProducts(releaseId);
  const formats = catalogRepository.listReleaseConfigurations(releaseId);
  const matchedIds = new Set(formats.flatMap(format => catalogRepository.listFormatProducts(releaseId, format.name).map(product => product.id)));
  const productLink = (product: typeof products[number]) => <div className="box-product" key={product.id}>
    <span className="badge">{mappingLabel(product.configuration.nppMappingStatus)}</span>
    <Link className="product-cta" href={'/products/' + product.slug}>Explore {product.configuration.name}<span aria-hidden="true">→</span></Link>
  </div>;
  return <>
    <Link href="/" className="back-link">← Products</Link>
    <p className="eyebrow">{release.manufacturer.toUpperCase()} · {release.year} · SOCCER</p>
    <h1>{release.name}</h1>
    <p className="lede">One set. Different boxes. Choose a format to explore what’s inside.</p>
    <div className="section-heading"><h2>Choose your box</h2><span>{formats.length} known formats</span></div>
    <p className="checklist-note">Mega Box details are ready to explore. We’re still adding the other formats. Card and parallel availability varies by box.</p>
    <div className="box-options">
      {formats.map(format => {
        const available = catalogRepository.listFormatProducts(releaseId, format.name);
        return <article className="box-option" key={format.id}>
          <div className="box-option-heading"><h3>{format.id === 'npp-mega' ? 'Retail Mega Box' : format.name}</h3>{format.confidence !== 'VERIFIED' && <span className="badge">Format {format.confidence.toLowerCase()}</span>}</div>
          {available.length ? available.map(productLink) : <p className="box-pending">Details coming soon</p>}
        </article>;
      })}
      {products.filter(product => !matchedIds.has(product.id)).map(product => <article className="box-option" key={product.id}><h3>{product.configuration.name}</h3>{productLink(product)}</article>)}
    </div>
    <p className="scope-note">These are the formats currently recorded for this set; coverage is still growing. The test Mega Box is probably NPP, with its exact mapping explained on the product page.</p>
  </>;
}
