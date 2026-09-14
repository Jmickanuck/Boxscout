import type { Card } from '../../types/catalog.ts';
export function searchCards(cards: readonly Card[], query: string): readonly Card[] {
  const term = query.trim().toLocaleLowerCase().replace(/^#/, '');
  return cards.filter(card => card.playerName.toLocaleLowerCase().includes(term) || card.cardNumber.includes(term));
}
