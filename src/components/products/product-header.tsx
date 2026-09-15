import Link from 'next/link';
import type { Product } from '@/types/catalog';
export function ProductHeader({ product, active }: { product: Product; active: 'overview' | 'cards' }) {
  const base = '/products/' + product.slug;
  return <>
    <Link href={'/sets/' + product.release.id} className="back-link">← All boxes in this set</Link>
    <p className="eyebrow">MEGA BOX FAMILY · SOCCER</p>
    <h1>{product.release.name}</h1>
    <div className="product-meta"><span>{product.configuration.name}</span></div>
    <nav className="tabs" aria-label="Product navigation">
      <Link href={base} aria-current={active === 'overview' ? 'page' : undefined}>Overview</Link>
      <Link href={base + '/cards'} aria-current={active === 'cards' ? 'page' : undefined}>Cards</Link>
    </nav>
  </>;
}
