import test from 'node:test';
import assert from 'node:assert/strict';
import {fixtureSource} from '../scripts/database/fixture-source.ts';
import {flatten,inflate,digest,assertParity} from '../scripts/database/records.ts';
import {publication} from '../src/data/published/catalogue.ts';
import {snapshotText} from '../scripts/database/operations.ts';
import {createCatalogRepository} from '../src/repositories/catalog-repository.ts';
test('publication preserves all domain fields, provenance and stable identities',async()=>{
 const expected=await fixtureSource.read();assertParity(expected,publication.data);assertParity(expected,inflate(flatten(expected)));
 assert.equal(digest(expected),publication.revision);assert.equal(publication.data.entries.length,559);assert.equal(publication.data.variants.length,1643);
 assert.deepEqual(createCatalogRepository(expected).listProducts(),createCatalogRepository(publication.data).listProducts());
});
test('snapshot serialization is deterministic and tampering changes the revision',()=>{
 assert.equal(snapshotText(publication),snapshotText(structuredClone(publication)));
 const changed=structuredClone(publication.data);changed.variants[0]={...changed.variants[0],parallelName:'Unreviewed change'};assert.notEqual(digest(changed),publication.revision);assert.throws(()=>assertParity(publication.data,changed));
});
