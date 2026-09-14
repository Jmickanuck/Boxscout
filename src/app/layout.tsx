import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
export const metadata: Metadata = { title: 'BoxScout — Soccer card intelligence', description: 'Explore sealed soccer products with sourced checklist information.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="header-inner"><Link className="brand" href="/" aria-label="BoxScout home"><span className="brand-symbol" aria-hidden="true">▣</span>BoxScout<span className="brand-dot">.</span></Link><Link className="header-nav" href="/">Products</Link></div></header>
    <main id="main" className="shell">{children}</main><footer className="shell site-footer"><span>BOXSCOUT / EARLY ACCESS</span><span>Know the box before you buy.</span></footer>
  </body></html>;
}
