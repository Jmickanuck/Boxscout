import Link from 'next/link';
export default function NotFound() { return <section className="intro"><p className="eyebrow">NOT IN THE CATALOGUE</p><h1>Product not found.</h1><p>Return to the supported product list.</p><Link className="button" href="/">Browse products</Link></section>; }
