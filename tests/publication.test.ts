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

test('set navigation deduplicates releases and keeps box formats and products within their release',()=>{
 const data=structuredClone(publication.data);
 const first=data.products[0];
 data.products.push({...first,id:'test-second-box',slug:'test-second-box'});
 const other={...first.release,id:'test-other-release',name:'Synthetic test release'};
 data.products.push({...first,id:'test-other-product',slug:'test-other-product',release:other});
 const repo=createCatalogRepository(data);
 assert.equal(repo.listReleases().length,2);
 assert.equal(repo.findRelease(other.id)?.name,other.name);
 assert.equal(repo.listReleaseProducts(first.release.id).length,2);
 assert.equal(repo.listReleaseConfigurations(first.release.id).length,8);
 assert.deepEqual(repo.listReleaseConfigurations(other.id),[]);
 assert.equal(repo.findRelease('missing'),undefined);
 assert.deepEqual(repo.listReleaseProducts('missing'),[]);
 const mega=repo.listFormatProducts(first.release.id,'NPP Mega');
 assert.deepEqual(mega.map(p=>p.id),[first.id]);
 assert.equal(mega[0].configuration.nppMappingStatus,'PROBABLE');
 assert.deepEqual(repo.listFormatProducts(other.id,'NPP Mega'),[]);
 assert.deepEqual(repo.listFormatProducts(first.release.id,'Hobby'),[]);
});
