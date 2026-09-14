import test from 'node:test';
import assert from 'node:assert/strict';
import { toggleCard, parseCollection } from '../src/domain/collection.ts';
import { createCollectionStateRepository, collectionStorageKey } from '../src/repositories/collection-state-repository.ts';
import { searchCards } from '../src/domain/catalog/search.ts';
import { displayableImage } from '../src/domain/catalog/images.ts';
import { goldenCards, goldenProduct, goldenEligibility } from '../src/data/fixtures/golden-product.ts';
import { catalogRepository } from '../src/repositories/catalog-repository.ts';

test('Owned and Watching are independent, immutable, and can both be true', () => {
  const original = Object.freeze({ card: Object.freeze({owned:false,watched:false}) });
  const owned = toggleCard(original, 'card', 'owned');
  const both = toggleCard(owned, 'card', 'watched');
  assert.deepEqual(both.card,{owned:true,watched:true});
  assert.deepEqual(toggleCard(both,'card','owned').card,{owned:false,watched:true});
  assert.deepEqual(original.card,{owned:false,watched:false});
});
test('repository persists across recreation, uses stable IDs and retains other cards', () => {
  const saved = new Map<string,string>();
  const storage = {getItem:(key:string)=>saved.get(key)??null,setItem:(key:string,value:string)=>{saved.set(key,value);}};
  const before = JSON.stringify(goldenCards);
  const first = createCollectionStateRepository(storage);
  first.toggle(goldenCards[0].id,'owned');
  first.toggle(goldenCards[1].id,'watched');
  const reloaded = createCollectionStateRepository(storage);
  assert.equal(reloaded.load()[goldenCards[0].id].owned,true);
  assert.equal(reloaded.load()[goldenCards[1].id].watched,true);
  reloaded.toggle(goldenCards[0].id,'watched');
  assert.deepEqual(first.load()[goldenCards[0].id],{owned:true,watched:true});
  assert.equal(JSON.stringify(goldenCards),before);
  assert.ok(saved.has(collectionStorageKey));
});
test('malformed or unsupported persistence is rejected without overwriting it', () => {
  for(const raw of ['invalid','null','[]','{"version":2,"cards":{}}','{"version":1,"cards":{"x":{"owned":"yes","watched":false}}}']) {
    assert.throws(()=>parseCollection(raw));
    let writes=0;
    const repo=createCollectionStateRepository({getItem:()=>raw,setItem:()=>{writes++;}});
    assert.throws(()=>repo.toggle('x','owned'));
    assert.equal(writes,0);
  }
  assert.deepEqual(parseCollection(null),{});
});
test('storage failures propagate instead of claiming a save succeeded', () => {
  const repo=createCollectionStateRepository({getItem:()=>null,setItem:()=>{throw new Error('Quota');}});
  assert.throws(()=>repo.toggle('x','owned'),/Quota/);
});
test('search handles case, whitespace, card number, no matches and reset', () => {
  assert.deepEqual(searchCards(goldenCards,'  mEsSi ').map(c=>c.cardNumber),['10']);
  assert.deepEqual(searchCards(goldenCards,'#24').map(c=>c.cardNumber),['24','124','224','240','241','242','243','244','245','246','247','248','249','324','424']);
  assert.equal(searchCards(goldenCards,'not-a-player').length,0);
  assert.equal(searchCards(goldenCards,'').length,500);
});
test('base identities have stable unique IDs, source scope, and honest unknowns', () => {
  assert.equal(goldenCards.length,500);
  assert.equal(new Set(goldenCards.map(c=>c.id)).size,500);
  for(const card of goldenCards) {
    assert.equal(card.releaseId,goldenProduct.release.id);
    assert.ok(card.provenance.length >= 2);
    for(const source of card.provenance) {
      assert.equal(source.verificationState,'VERIFIED');
      assert.ok(source.sourceUrl.startsWith('https://'));
      assert.equal(source.checkedAt,'2026-09-14');
      assert.ok(source.scope.includes('Excludes variations and configuration eligibility'));
    }
    assert.equal(displayableImage(card.image),null);
  }
  assert.ok(goldenEligibility.every(e=>e.status==='UNKNOWN' && e.provenance.length===0));
  assert.equal(goldenProduct.configuration.sku,null);
  assert.equal(goldenProduct.configuration.nppMappingStatus,'PROBABLE');
});
test('image publication requires both a verified match and allowed rights', () => {
  const image={assetUrl:'/approved.jpg',sourceUrl:null,matchStatus:'VERIFIED',usageStatus:'UNKNOWN_RIGHTS'} as const;
  assert.equal(displayableImage(image),null);
  assert.equal(displayableImage({...image,usageStatus:'PUBLIC_ALLOWED'}),null); // No explicit approval/identity projection.
  assert.equal(displayableImage({...image,usageStatus:'PUBLIC_ALLOWED',matchStatus:'CANDIDATE'}),null);
  assert.equal(displayableImage({...image,usageStatus:'USER_SUBMITTED'}),null);
});
test('unknown products and releases do not silently fall back to Golden Product', () => {
  assert.equal(catalogRepository.findProduct('not-real'),undefined);
  assert.deepEqual(catalogRepository.listReleaseCards('not-real'),[]);
});
