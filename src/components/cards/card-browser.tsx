'use client';
import { useEffect, useState } from 'react';
import type { CardImage as ImageData } from '@/types/catalog';
import type { BrowseData } from '@/types/variants';
import {megaVersionIds,versionLabel} from '@/domain/catalog/box-families';
import { defaultVariantFilters, filterVariants } from '@/domain/catalog/variants';

import { emptyCardState, type CollectionFlag, type CollectionState } from '@/domain/collection';
import { browserCollectionRepository, collectionStorageKey } from '@/repositories/collection-state-repository';
import { CardImage } from './card-image';

export function CardBrowser({ data, images, mega = false }: { data: BrowseData; images: Record<string,ImageData>; mega?: boolean }) {
  const initialFilters={...defaultVariantFilters,...(mega?{configuration:'mega',probable:true}:{})};
  const [filters, setFilters] = useState(initialFilters);
  const [limit,setLimit]=useState(120);
  const update = (key: keyof typeof filters, value: string|boolean) => {setLimit(120);setFilters(f => ({...f,[key]:value}));};
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
  const groups = Map.groupBy(visible.slice(0,limit), item => item.group);
  const owned = data.variants.filter(v => collection[v.id]?.owned).length;
  const watched = data.variants.filter(v => collection[v.id]?.watched).length;
  return <>
    <div className="collection-summary"><span><strong>{owned}</strong> Owned</span><span><strong>{watched}</strong> Watching</span><span className="local-note">Saved in this browser</span></div>
    {error && <p role="alert" className="notice">{error}</p>}
    <label className="search-label" htmlFor="card-search">Search checklist</label>
    <div className="search-box"><span aria-hidden="true">⌕</span><input id="card-search" type="search" placeholder="Player, #, country or parallel" value={filters.query} onChange={event => update('query',event.target.value)} /></div>
    {mega && <label className="version-picker">Box version<select value={filters.configuration} onChange={e=>update('configuration',e.target.value)}><option value="mega">All Mega versions</option>{data.configurations.filter(c=>megaVersionIds.includes(c.id)).map(c=><option key={c.id} value={c.id}>{versionLabel(c.id)}</option>)}</select><span>Shared cards appear once. Exclusive parallels follow your selected version.</span></label>}
    <details className="card-filters"><summary>Filters</summary><div className="filter-fields">
      <label>Card type<select value={filters.type} onChange={e=>update('type',e.target.value)}>{[['ALL','All'],['BASE','Base'],['INSERT','Inserts'],['AUTOGRAPH','Autographs'],['VARIATION','Variations']].map(([v,n])=><option key={v} value={v}>{n}</option>)}</select></label>
      <label>Edition<select value={filters.edition} onChange={e=>update('edition',e.target.value)}><option value="DEFAULT">Default browsing</option><option value="ALL">All variants</option><option value="PARALLEL">Parallels</option><option value="NUMBERED">Numbered</option></select></label>
      <label>Serial total<select value={filters.maximum} onChange={e=>update('maximum',e.target.value)}><option value="">Any</option><option value="99">/99 or lower</option><option value="25">/25 or lower</option><option value="1">1/1</option></select></label>
      <label>Country / team<select value={filters.country} onChange={e=>update('country',e.target.value)}><option value="">All countries</option>{[...new Set(data.entries.map(e=>e.country))].sort().map(c=><option key={c}>{c}</option>)}</select></label>
      <label>Subset<select value={filters.subset} onChange={e=>update('subset',e.target.value)}><option value="">All subsets</option>{[...new Set(data.entries.map(e=>e.subset))].map(c=><option key={c}>{c}</option>)}</select></label>
      {!mega && <label>Eligibility<select value={filters.configuration} onChange={e=>update('configuration',e.target.value)}><option value="">Release catalogue</option><option value="mastermind">This Mastermind box (probable NPP)</option>{data.configurations.map(c=><option key={c.id} value={c.id}>{c.name} · {c.confidence.toLowerCase()}</option>)}</select></label>}
    </div><div className="filter-flags"><label><input type="checkbox" checked={filters.probable} onChange={e=>update('probable',e.target.checked)}/> Include probable eligibility</label><label><input type="checkbox" checked={filters.owned} onChange={e=>update('owned',e.target.checked)}/> Owned</label><label><input type="checkbox" checked={filters.watched} onChange={e=>update('watched',e.target.checked)}/> Watching</label></div></details>
    <div className="grid-heading"><p role="status">{visible.length} {exact?'exact variants':'cards'} · {data.entries.length} catalogue entries</p><button onClick={()=>setFilters(initialFilters)}>Reset filters</button></div>
    {filters.configuration && <p className="checklist-note">Showing documented matches, including probable links when enabled. Coverage varies by version and is still growing; missing cards are not proof of exclusion.</p>}
    {visible.length === 0 ? <div className="empty-state"><h3>No matching cards</h3><p>Check the filters. This version may still need more verified checklist coverage.</p><button className="button" onClick={() => setFilters(initialFilters)}>Reset filters</button></div> :
      [...groups].map(([group,items])=><section key={group} className="variant-group">{(exact||groups.size>1)&&<h3 className="variant-heading">{group}<small className="variant-versions">{[...new Set(data.eligibility.filter(e=>items.some(i=>i.variant.id===e.variantId)&&e.status==='INCLUDED'&&megaVersionIds.includes(e.configurationId)).map(e=>versionLabel(e.configurationId)))].join(' · ')}</small></h3>}<div className="card-grid">{items.map(({entry,variant}) => {
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
    {visible.length>limit && <button className="button load-more" onClick={()=>setLimit(n=>n+120)}>Show more cards ({visible.length-limit} remaining)</button>}
  </>;
}
