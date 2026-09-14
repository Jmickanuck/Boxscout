'use client';
import { useEffect, useState } from 'react';
import type { Card } from '@/types/catalog';
import { searchCards } from '@/domain/catalog/search';
import { emptyCardState, type CollectionFlag, type CollectionState } from '@/domain/collection';
import { browserCollectionRepository, collectionStorageKey } from '@/repositories/collection-state-repository';
import { CardImage } from './card-image';

export function CardBrowser({ cards }: { cards: readonly Card[] }) {
  const [query, setQuery] = useState('');
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
  const visible = searchCards(cards, query);
  const owned = cards.filter(card => collection[card.id]?.owned).length;
  const watched = cards.filter(card => collection[card.id]?.watched).length;
  return <>
    <div className="collection-summary"><span><strong>{owned}</strong> Owned</span><span><strong>{watched}</strong> Watching</span><span className="local-note">Saved in this browser</span></div>
    {error && <p role="alert" className="notice">{error}</p>}
    <label className="search-label" htmlFor="card-search">Search checklist</label>
    <div className="search-box"><span aria-hidden="true">⌕</span><input id="card-search" type="search" placeholder="Player or card number" value={query} onChange={event => setQuery(event.target.value)} /></div>
    <div className="grid-heading"><p role="status">{visible.length} of {cards.length} cards</p><span>BASE · SAMPLE</span></div>
    {visible.length === 0 ? <div className="empty-state"><h3>No matching cards</h3><p>Try another player or card number in this sample.</p><button className="button" onClick={() => setQuery('')}>Clear search</button></div> :
      <div className="card-grid">{visible.map(card => {
        const state = collection[card.id] ?? emptyCardState;
        return <article className="card-tile" key={card.id} aria-label={card.playerName + ' card ' + card.cardNumber}>
          <div className="card-visual">
            <CardImage card={card} />
            {/* Sibling controls leave the image/body free for future detail navigation. */}
            <button className="card-toggle card-owned" disabled={!ready} aria-label={'Mark ' + card.playerName + ' as owned'} aria-pressed={state.owned} onClick={event => { event.stopPropagation(); toggle(card.id, 'owned'); }}>
              <span aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </button>
            <button className="card-toggle card-watching" disabled={!ready} aria-label={'Watch ' + card.playerName} aria-pressed={state.watched} onClick={event => { event.stopPropagation(); toggle(card.id, 'watched'); }}>
              <span aria-hidden="true"><svg viewBox="0 0 20 20" fill={state.watched ? 'currentColor' : 'none'}><path d="m10 2 2.5 5.1 5.6.8-4.05 3.95.95 5.6-5-2.65-5 2.65.95-5.6L1.9 7.9l5.6-.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg></span>
            </button>
          </div>
          <h3 className="card-caption"><span className="card-number">#{card.cardNumber}</span> {card.playerName}</h3>
        </article>;
      })}</div>}
  </>;
}
