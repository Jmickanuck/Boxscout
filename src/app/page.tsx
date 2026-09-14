import Link from 'next/link';
import { catalogRepository } from '@/repositories/catalog-repository';
export default function ProductsPage() {
  return <><section className="intro"><p className="eyebrow">SOCCER · SEALED PRODUCTS</p><h1>Know the box.<br /><span className="muted-heading">Find your next chase.</span></h1><p className="lede">A closer look at the cards inside. Start with the checklist, keep track of your picks, and see what still needs verifying.</p></section>
    <div className="section-heading"><h2>Products</h2><span>01 supported product</span></div>
    {catalogRepository.listProducts().map(product => <Link className="product-card" href={'/products/' + product.slug} key={product.id}>
      <div className="product-art" aria-label="Product image unavailable"><div className="pitch" aria-hidden="true"><span>BOX<br />SCOUT</span></div><span>PRODUCT IMAGE PENDING</span></div>
      <div className="product-card-copy"><p className="eyebrow">{product.release.manufacturer.toUpperCase()} · {product.release.year}</p><h2>{product.release.name}</h2><p className="configuration-name">{product.configuration.name}</p><span className="badge">Configuration unverified</span><p className="muted">A sourced base-checklist sample. Exact SKU and sealed price still to be verified.</p><span className="product-cta">Explore product <span aria-hidden="true">↗</span></span></div>
    </Link>)}
    <p className="scope-note">One product, carefully built. Catalogue coverage will grow after this first product is useful end to end.</p>
  </>;
}
