import Link from 'next/link';
import { mappingLabel } from '@/domain/catalog/configuration-intelligence';
import type { Product } from '@/types/catalog';
export function ProductHeader({ product, active }: { product: Product; active: 'overview' | 'cards' }) {
  const base = '/products/' + product.slug;
  return <>
    <Link href="/" className="back-link">← Products</Link>
    <p className="eyebrow">GOLDEN PRODUCT 01 · SOCCER</p>
    <h1>{product.release.name}</h1>
    <div className="product-meta"><span>{product.configuration.name}</span><span className="badge">{mappingLabel(product.configuration.nppMappingStatus)}</span></div>
    <nav className="tabs" aria-label="Product navigation">
      <Link href={base} aria-current={active === 'overview' ? 'page' : undefined}>Overview</Link>
      <Link href={base + '/cards'} aria-current={active === 'cards' ? 'page' : undefined}>Cards</Link>
    </nav>
  </>;
}
