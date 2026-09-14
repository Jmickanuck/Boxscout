'use client';
import { useEffect, useState } from 'react';
import type { CardImage as ImageData } from '@/types/catalog';
import type { BrowseData } from '@/types/variants';
import { defaultVariantFilters, filterVariants } from '@/domain/catalog/variants';

import { emptyCardState, type CollectionFlag, type CollectionState } from '@/domain/collection';
import { browserCollectionRepository, collectionStorageKey } from '@/repositories/collection-state-repository';
import { CardImage } from './card-image';

export function CardBrowser({ data, images }: { data: BrowseData; images: Record<string,ImageData> }) {
  const [filters, setFilters] = useState(defaultVariantFilters);
  const update = (key: keyof typeof filters, value: string|boolean) => setFilters(f => ({...f,[key]:value}));
  const [collection, setCollection] = useState<CollectionState>({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    function load() {
      try { setCollection(browserCollectionRepository().load()); setError(''); setReady(true); }
      catch { setReady(false); setError('Saved card state could not be read. Check browser storage access; your saved data has not been replaced.'); }
    }
    // Subscribe and hydrate browser state after the server-rendered first frame.
    const timer = window.setTimeout(load, 0);
    const onStorage = (event: StorageEvent) => { if (event.key === collectionStorageKey || event.key === null) load(); };
    window.addEventListener('storage', onStorage);
    return () => { window.clearTimeout(timer); window.removeEventListener('storage', onStorage); };
  }, []);
  function toggle(cardId: string, flag: CollectionFlag) {
    try { setCollection(browserCollectionRepository().toggle(cardId, flag)); setError(''); }
    catch { setError('This change could not be saved. Check browser storage access and try again.'); }
  }
  const {results:visible,exact} = filterVariants(data,filters,collection);
  const groups = Map.groupBy(visible, item => item.group);
  const owned = data.variants.filter(v => collection[v.id]?.owned).length;
  const watched = data.variants.filter(v => collection[v.id]?.watched).length;
  return <>
    <div className="collection-summary"><span><strong>{owned}</strong> Owned</span><span><strong>{watched}</strong> Watching</span><span className="local-note">Saved in this browser</span></div>
    {error && <p role="alert" className="notice">{error}</p>}
    <label className="search-label" htmlFor="card-search">Search checklist</label>
    <div className="search-box"><span aria-hidden="true">⌕</span><input id="card-search" type="search" placeholder="Player, #, country or parallel" value={filters.query} onChange={event => update('query',event.target.value)} /></div>
    <details className="card-filters"><summary>Filters</summary><div className="filter-fields">
      <label>Card type<select value={filters.type} onChange={e=>update('type',e.target.value)}>{[['ALL','All'],['BASE','Base'],['INSERT','Inserts'],['AUTOGRAPH','Autographs'],['VARIATION','Variations']].map(([v,n])=><option key={v} value={v}>{n}</option>)}</select></label>
      <label>Edition<select value={filters.edition} onChange={e=>update('edition',e.target.value)}><option value="DEFAULT">Default browsing</option><option value="ALL">All variants</option><option value="PARALLEL">Parallels</option><option value="NUMBERED">Numbered</option></select></label>
      <label>Serial total<select value={filters.maximum} onChange={e=>update('maximum',e.target.value)}><option value="">Any</option><option value="99">/99 or lower</option><option value="25">/25 or lower</option><option value="1">1/1</option></select></label>
      <label>Country / team<select value={filters.country} onChange={e=>update('country',e.target.value)}><option value="">All countries</option>{[...new Set(data.entries.map(e=>e.country))].sort().map(c=><option key={c}>{c}</option>)}</select></label>
      <label>Subset<select value={filters.subset} onChange={e=>update('subset',e.target.value)}><option value="">All subsets</option>{[...new Set(data.entries.map(e=>e.subset))].map(c=><option key={c}>{c}</option>)}</select></label>
      <label>Eligibility<select value={filters.configuration} onChange={e=>update('configuration',e.target.value)}><option value="">Release catalogue</option><option value="mastermind">This Mastermind box (probable NPP)</option>{data.configurations.map(c=><option key={c.id} value={c.id}>{c.name} · {c.confidence.toLowerCase()}</option>)}</select></label>
    </div><div className="filter-flags"><label><input type="checkbox" checked={filters.probable} onChange={e=>update('probable',e.target.checked)}/> Include probable eligibility</label><label><input type="checkbox" checked={filters.owned} onChange={e=>update('owned',e.target.checked)}/> Owned</label><label><input type="checkbox" checked={filters.watched} onChange={e=>update('watched',e.target.checked)}/> Watching</label></div></details>
    <div className="grid-heading"><p role="status">{visible.length} {exact?'exact variants':'cards'} · {data.entries.length} entries in pilot</p><button onClick={()=>setFilters(defaultVariantFilters)}>Reset filters</button></div>
    {filters.configuration && <p className="checklist-note">Only supported eligibility is shown. Unknown or conflicting mappings are excluded. This Mastermind box remains probable NPP; enable probable eligibility to see its supported matches. No matches does not mean a box contains no cards.</p>}
    {visible.length === 0 ? <div className="empty-state"><h3>No matching cards</h3><p>Check the active filters and the pilot coverage.</p><button className="button" onClick={() => setFilters(defaultVariantFilters)}>Reset filters</button></div> :
      [...groups].map(([group,items])=><section key={group} className="variant-group">{(exact||groups.size>1)&&<h3 className="variant-heading">{group}</h3>}<div className="card-grid">{items.map(({entry,variant}) => {
        const image=images[variant.id]??{assetUrl:null,sourceUrl:null,matchStatus:'MISSING' as const,usageStatus:'UNKNOWN_RIGHTS' as const};
        const card={...entry,image};
        const state = collection[variant.id] ?? emptyCardState;
        const identity=card.playerName+(exact?' '+group:'');
        return <article className="card-tile" key={variant.id} aria-label={identity + ' card ' + card.cardNumber}>
          <div className="card-visual">
            <CardImage card={card} variantId={variant.isDefault && entry.entryType==='BASE' && image.variantId===null ? null : variant.id} />
            {/* Sibling controls leave the image/body free for future detail navigation. */}
            <button className="card-toggle card-owned" disabled={!ready} aria-label={'Mark ' + identity + ' as owned'} aria-pressed={state.owned} onClick={event => { event.stopPropagation(); toggle(variant.id, 'owned'); }}>
              <span aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </button>
            <button className="card-toggle card-watching" disabled={!ready} aria-label={'Watch ' + identity} aria-pressed={state.watched} onClick={event => { event.stopPropagation(); toggle(variant.id, 'watched'); }}>
              <span aria-hidden="true"><svg viewBox="0 0 20 20" fill={state.watched ? 'currentColor' : 'none'}><path d="m10 2 2.5 5.1 5.6.8-4.05 3.95.95 5.6-5-2.65-5 2.65.95-5.6L1.9 7.9l5.6-.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg></span>
            </button>
          </div>
          <h3 className="card-caption"><span className="card-number">#{card.cardNumber}</span> {card.playerName}</h3>
        </article>;
      })}</div></section>)}
  </>;
}
