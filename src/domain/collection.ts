export type CardState = Readonly<{ owned: boolean; watched: boolean }>;
export type CollectionState = Readonly<Record<string, CardState>>;
export type CollectionFlag = keyof CardState;
export const emptyCardState: CardState = Object.freeze({ owned: false, watched: false });
export function toggleCard(state: CollectionState, cardId: string, flag: CollectionFlag): CollectionState {
  const current = state[cardId] ?? emptyCardState;
  return { ...state, [cardId]: { ...current, [flag]: !current[flag] } };
}
export function parseCollection(raw: string | null): CollectionState {
  if (raw === null) return {};
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || !('version' in parsed) || parsed.version !== 1 || !('cards' in parsed) || !parsed.cards || typeof parsed.cards !== 'object' || Array.isArray(parsed.cards)) throw new Error('Unsupported saved collection');
  const cards: Record<string, CardState> = Object.create(null);
  for (const [id, value] of Object.entries(parsed.cards)) {
    if (!id || !value || typeof value !== 'object' || typeof value.owned !== 'boolean' || typeof value.watched !== 'boolean') throw new Error('Invalid saved collection');
    cards[id] = { owned: value.owned, watched: value.watched };
  }
  return cards;
}
