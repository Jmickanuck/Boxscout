import { parseCollection, toggleCard, type CollectionFlag, type CollectionState } from '../domain/collection.ts';
export const collectionStorageKey = 'boxscout:collection:v1';
export interface CollectionStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export interface CollectionStateRepository { load(): CollectionState; toggle(cardId: string, flag: CollectionFlag): CollectionState }
export function createCollectionStateRepository(storage: CollectionStorage): CollectionStateRepository {
  return {
    load: () => parseCollection(storage.getItem(collectionStorageKey)),
    toggle(cardId, flag) {
      // Read before each change so another tab's most recent state is retained.
      const next = toggleCard(parseCollection(storage.getItem(collectionStorageKey)), cardId, flag);
      storage.setItem(collectionStorageKey, JSON.stringify({ version: 1, cards: next }));
      return next;
    },
  };
}
export function browserCollectionRepository(): CollectionStateRepository {
  return createCollectionStateRepository(window.localStorage);
}
