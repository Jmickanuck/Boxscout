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
          <CardImage card={card} /><p className="card-number">#{card.cardNumber}</p><h3>{card.playerName}</h3><p className="country">{card.country}</p>
          <div className="card-controls">
            <button disabled={!ready} aria-label={'Owned: ' + card.playerName + ' #' + card.cardNumber} aria-pressed={state.owned} onClick={() => toggle(card.id, 'owned')}><span aria-hidden="true">{state.owned ? '✓' : '+'}</span> Owned</button>
            <button disabled={!ready} aria-label={'Watching: ' + card.playerName + ' #' + card.cardNumber} aria-pressed={state.watched} onClick={() => toggle(card.id, 'watched')}><span aria-hidden="true">{state.watched ? '★' : '☆'}</span> Watch</button>
          </div>
        </article>;
      })}</div>}
  </>;
}
