import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { readImport, generate } from '../scripts/checklists/generate.ts';
import { normalizeChecklist, normalizeText, serializeChecklist } from '../scripts/checklists/normalize.ts';
import { goldenCards } from '../src/data/fixtures/golden-product.ts';
import { createCollectionStateRepository, collectionStorageKey } from '../src/repositories/collection-state-repository.ts';
import { searchCards } from '../src/domain/catalog/search.ts';

const manifest = resolve('data/imports/golden-product-base/manifest.json');
const fresh = () => readImport(manifest);

test('reviewed import yields exactly base 1–500, in order, with per-record provenance', () => {
  const cards = normalizeChecklist(fresh());
  assert.deepEqual(cards, goldenCards);
  assert.deepEqual(cards.map(c => c.cardNumber), Array.from({length:500}, (_,i) => String(i+1)));
  assert.equal(new Set(cards.map(c => c.id)).size, 500);
  for (const [i,c] of cards.entries()) {
    assert.equal(c.sortOrder,i+1); assert.equal(c.subset,'Base');
    assert.ok(c.playerName && c.country && c.checkedAt);
    assert.equal(c.verificationState,'VERIFIED');
    assert.ok(c.provenance.every(p => p.sourceId && p.locator && p.sourceUrl && p.checkedAt));
    assert.equal(c.image.assetUrl,null);
  }
});
test('generation is byte reproducible, independent of source row order', () => {
  const b = fresh(); const expected = readFileSync(resolve('src/data/fixtures/generated/golden-product-base.ts'),'utf8');
  assert.equal(serializeChecklist(normalizeChecklist(b)), expected);
  for(const rows of Object.values(b.extracts)) rows.reverse();
  assert.equal(serializeChecklist(normalizeChecklist(b)), expected);
});
test('normalization is conservative about accents, punctuation and names', () => {
  assert.equal(normalizeText('  Rene\u0301   O’Neill '),'René O’Neill');
  assert.equal(normalizeText('Marquinhos (D)'), 'Marquinhos (D)');
  assert.equal(normalizeText('Anthony rdon'), 'Anthony rdon');
});
test('missing, duplicate, non-base, malformed and unsourced rows cannot promote', () => {
  const mutations = [
    (b: ReturnType<typeof fresh>) => { b.extracts.gts.pop(); },
    (b: ReturnType<typeof fresh>) => { b.extracts.gts[1] = {...b.extracts.gts[0]}; },
    (b: ReturnType<typeof fresh>) => { b.extracts.gts[0].subset='Base Variations'; },
    (b: ReturnType<typeof fresh>) => { b.extracts.gts[0].cardNumber='1b'; },
    (b: ReturnType<typeof fresh>) => { b.extracts.gts[0].cardNumber='501'; },
    (b: ReturnType<typeof fresh>) => { b.extracts.gts[0].playerName=' '; },
    (b: ReturnType<typeof fresh>) => { b.extracts.gts[0].country=''; },
    (b: ReturnType<typeof fresh>) => { b.extracts.gts[0].locator=''; },
    (b: ReturnType<typeof fresh>) => { b.manifest.sources[0].sourceUrl=''; },
    (b: ReturnType<typeof fresh>) => { b.manifest.sources[0].checkedAt='not-a-date'; },
    (b: ReturnType<typeof fresh>) => { b.manifest.reviewStatus='CANDIDATE'; },
    (b: ReturnType<typeof fresh>) => { b.manifest.sources.pop(); b.manifest.sources.pop(); },
  ];
  for(const change of mutations){const b=fresh();change(b);assert.throws(()=>normalizeChecklist(b));}
});
test('unresolved, new, stale or changed evidence cannot silently promote', () => {
  let b=fresh(); b.resolutions=[]; assert.throws(()=>normalizeChecklist(b),/Unresolved/);
  b=fresh(); b.resolutions[0].status='UNRESOLVED'; assert.throws(()=>normalizeChecklist(b),/Unresolved/);
  b=fresh(); b.extracts.ci[0].playerName='Different person'; assert.throws(()=>normalizeChecklist(b),/Unresolved/);
  b=fresh(); b.extracts.gts[104].playerName='Anthony typo'; assert.throws(()=>normalizeChecklist(b),/evidence changed/);
  b=fresh(); b.resolutions[0].value='Invented player'; assert.throws(()=>normalizeChecklist(b),/Unsupported/);
  b=fresh(); b.resolutions[0].evidenceSourceIds=['missing']; assert.throws(()=>normalizeChecklist(b),/corroboration/);
});
test('all 24 existing identities and their v1 flags survive full-dataset use', () => {
  const b=fresh(); assert.equal(b.legacy.length,24);
  const original = Object.fromEntries(b.legacy.map((c,i)=>[c.id,{owned:i%2===0,watched:i%3===0}]));
  const saved=new Map([[collectionStorageKey,JSON.stringify({version:1,cards:original})]]);
  const storage={getItem:(k:string)=>saved.get(k)??null,setItem:(k:string,v:string)=>{saved.set(k,v);}};
  let repo=createCollectionStateRepository(storage);
  const cards=normalizeChecklist(b);
  for(const old of b.legacy) assert.equal(cards.find(c=>c.id===old.id)?.playerName,old.playerName);
  repo.toggle(cards[499].id,'owned'); repo.toggle(cards[499].id,'watched');
  repo=createCollectionStateRepository(storage);
  for(const [id,flags] of Object.entries(original)) assert.deepEqual(repo.load()[id],flags);
  assert.deepEqual(repo.load()[cards[499].id],{owned:true,watched:true});
  assert.equal(collectionStorageKey,'boxscout:collection:v1');
  b.manifest.idPrefix='changed-'; assert.throws(()=>normalizeChecklist(b),/Legacy/);
});
test('full-dataset search includes middle and last records and reviewed names', () => {
  for(const [query,number] of [['messi','10'],['ANTHONY GORDON','105'],['Cristiano Ronaldo','367'],['#500','500']]) {
    assert.deepEqual(searchCards(goldenCards,query).map(c=>c.cardNumber),[number]);
  }
  assert.equal(searchCards(goldenCards,'   ').length,500);
});
test('workflow also handles a different release without product-specific normalization', () => {
  const b=fresh(); b.manifest.releaseId='test-release'; b.manifest.idPrefix='test-release-base-'; b.manifest.expectedCount=2;
  b.manifest.sources=b.manifest.sources.slice(0,2); b.extracts={gts:b.extracts.gts.slice(0,2),ci:b.extracts.ci.slice(0,2)};
  b.legacy=[];b.resolutions=[];
  const cards=normalizeChecklist(b); assert.equal(cards.length,2); assert.equal(cards[1].id,'test-release-base-2');
});
test('tampered extracts fail closed before touching canonical output', () => {
  const temp=mkdtempSync(resolve(tmpdir(),'boxscout-import-'));
  try {
    cpSync(resolve('data/imports/golden-product-base'),temp,{recursive:true});
    const m=JSON.parse(readFileSync(resolve(temp,'manifest.json'),'utf8'));
    m.output='canonical.ts'; writeFileSync(resolve(temp,'manifest.json'),JSON.stringify(m));
    writeFileSync(resolve(temp,'canonical.ts'),'keep current fixture');
    writeFileSync(resolve(temp,'raw/gts.json'),'[]');
    assert.throws(()=>generate(resolve(temp,'manifest.json'),false),/hash changed/);
    assert.equal(readFileSync(resolve(temp,'canonical.ts'),'utf8'),'keep current fixture');
  } finally { assert.equal(dirname(temp),resolve(tmpdir())); rmSync(temp,{recursive:true,force:true}); }
});
