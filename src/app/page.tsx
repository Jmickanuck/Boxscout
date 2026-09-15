import Link from 'next/link';
import { catalogRepository } from '@/repositories/catalog-repository';
export default function ProductsPage() {
  const releases = catalogRepository.listReleases();
  return <><section className="intro"><p className="eyebrow">SOCCER · SEALED PRODUCTS</p><h1>Know the box.<br /><span className="muted-heading">Find your next chase.</span></h1><p className="lede">A closer look at the cards inside. Start with the checklist, keep track of your picks, and see what still needs verifying.</p></section>
    <div className="section-heading"><h2>Products</h2><span>{String(releases.length).padStart(2, '0')} supported {releases.length === 1 ? 'set' : 'sets'}</span></div>
    {releases.map(release => <Link className="product-card" href={'/sets/' + release.id} key={release.id}>
      <div className="product-art" aria-label="Product image unavailable"><div className="pitch" aria-hidden="true"><span>BOX<br />SCOUT</span></div><span>PRODUCT IMAGE PENDING</span></div>
      <div className="product-card-copy"><p className="eyebrow">{release.manufacturer.toUpperCase()} · {release.year}</p><h2>{release.name}</h2><p className="configuration-name">Explore the boxes</p><p className="muted">Choose a box format to explore its contents, checklist and sourced product details.</p><span className="product-cta">Choose a box <span aria-hidden="true">↗</span></span></div>
    </Link>)}
    <p className="scope-note">One set, carefully built. Start with the Mega Box while we add details for other formats.</p>
  </>;
}
