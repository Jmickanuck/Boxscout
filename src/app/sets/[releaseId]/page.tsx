import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalogRepository } from '@/repositories/catalog-repository';
import { boxFamilies, versionLabel } from '@/domain/catalog/box-families';

export default async function SetPage({ params }: { params: Promise<{ releaseId: string }> }) {
  const { releaseId } = await params;
  const release = catalogRepository.findRelease(releaseId);
  if (!release) notFound();
  const products = catalogRepository.listReleaseProducts(releaseId);
  const formats = catalogRepository.listReleaseConfigurations(releaseId);
  const families = boxFamilies(formats);
  const matchedIds = new Set(formats.flatMap(format => catalogRepository.listFormatProducts(releaseId, format.name).map(product => product.id)));
  const productLink = (product: typeof products[number]) => <div className="box-product" key={product.id}>

    <Link className="product-cta" href={'/products/' + product.slug}>Explore {product.configuration.name}<span aria-hidden="true">→</span></Link>
  </div>;
  return <>
    <Link href="/" className="back-link">← Products</Link>
    <p className="eyebrow">{release.manufacturer.toUpperCase()} · {release.year} · SOCCER</p>
    <h1>{release.name}</h1>
    <p className="lede">One set. Different boxes. Choose a format to explore what’s inside.</p>
    <div className="section-heading"><h2>Choose your box</h2><span>{families.length} box types</span></div>
    <p className="checklist-note">Mega Box details are ready to explore. We’re still adding the other formats. Card and parallel availability varies by box.</p>
    <div className="box-options">
      {families.map(format => {
        const available = format.versions.flatMap(version => catalogRepository.listFormatProducts(releaseId, version.name));
        return <article className="box-option" key={format.id}>
          <div className="box-option-heading"><h3>{format.name}</h3>{format.versions.length > 1 && <span className="badge">{format.versions.length} versions</span>}</div>
          {format.id === 'mega' && <p className="checklist-note">6 packs · 7 cards per pack. Retail and hobby versions share this box format, with different exclusive parallels.</p>}
          {format.id === 'mega' && <ul className="box-contents">{format.versions.map(v=><li key={v.id}>{versionLabel(v.id)}</li>)}</ul>}
          {available.length ? available.map(productLink) : <p className="box-pending">Details coming soon</p>}
        </article>;
      })}
      {products.filter(product => !matchedIds.has(product.id)).map(product => <article className="box-option" key={product.id}><h3>{product.configuration.name}</h3>{productLink(product)}</article>)}
    </div>
    <p className="scope-note">These are the formats currently recorded for this set; coverage is still growing. Mega versions are grouped for browsing; card eligibility stays specific to each version.</p>
  </>;
}
