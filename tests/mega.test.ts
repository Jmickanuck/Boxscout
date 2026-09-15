import test from 'node:test';
import assert from 'node:assert/strict';
import {expandedVariants} from '../scripts/checklists/mega.ts';
import {variantData} from '../src/data/fixtures/generated/golden-product-variants.ts';
import {cards} from '../src/data/fixtures/generated/golden-product-base.ts';
import {boxFamilies,megaVersionIds} from '../src/domain/catalog/box-families.ts';
import {defaultVariantFilters,filterVariants} from '../src/domain/catalog/variants.ts';
import {additions} from '../scripts/database/additive.ts';
import {fixtureSource} from '../scripts/database/fixture-source.ts';
const expanded=expandedVariants();
const data={...expanded,entries:[...cards.map(c=>({...c,entryType:'BASE' as const,variationOfEntryId:null})),...expanded.entries]};
const query=(configuration:string,changes={})=>filterVariants(data,{...defaultVariantFilters,configuration,probable:true,...changes}).results;
test('Mega family groups versions without duplicating identities or rewriting the pilot',()=>{
 const groups=boxFamilies(data.configurations);assert.equal(groups.length,6);assert.deepEqual(groups[0].versions.map(c=>c.id).sort(),[...megaVersionIds].sort());
 for(const key of ['entries','variants','eligibility','configurations','sources'] as const)for(const old of variantData[key])assert.deepEqual(expanded[key].find(x=>x.id===old.id),old);
 assert.equal(query('mega').length,500);assert.equal(new Set(query('mega').map(x=>x.variant.id)).size,500);
});
test('box version tags separate exclusive colours and actual autograph editions',()=>{
 const red={query:'Red Disco',edition:'ALL'};assert.equal(query('npp-mega',red).length,500);assert.equal(query('excell-mega',red).length,0);
 assert.equal(query('excell-mega',{query:'Teal Disco',edition:'ALL'}).length,500);
 const usa=query('npp-mega',{type:'AUTOGRAPH',subset:'1994 Team USA Signatures',edition:'ALL'});
 assert.equal(usa.filter(x=>x.variant.parallelName==='Wave').length,5);
 assert.equal(usa.filter(x=>x.variant.parallelName==='Gold Wave').length,8);
 assert.equal(usa.filter(x=>x.variant.parallelName==='Gold Power').length,8);
 assert.ok(usa.every(x=>x.variant.parallelName!=='Silver'&&!x.variant.isDefault));
 assert.equal(query('excell-mega',{type:'AUTOGRAPH'}).length,0);
});
test('unresolved families remain outside the approved expansion',()=>{
 for(const name of ['Connections','Dual Signatures','New Era','World Cup Posters'])assert.equal(expanded.entries.filter(e=>e.subset===name).length,0);
});
test('additive planner refuses edits/removals and accepts unchanged input',async()=>{
 const d=await fixtureSource.read();assert.ok(Object.values(additions(d,d)).every(rows=>rows.length===0));
 const changed=structuredClone(d);changed.entries[0]={...changed.entries[0],playerName:'Changed'};assert.throws(()=>additions(d,changed),/cannot remove/);
 const removed=structuredClone(d);removed.eligibility.pop();assert.throws(()=>additions(d,removed),/cannot remove/);
});
