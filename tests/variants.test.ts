import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {normalizeVariants,validateVariantData} from '../scripts/checklists/variants.ts';
import {variantData} from '../src/data/fixtures/generated/golden-product-variants.ts';
import {cards} from '../src/data/fixtures/generated/golden-product-base.ts';
import {defaultVariantFilters as defaults,filterVariants,eligibilityAssessment} from '../src/domain/catalog/variants.ts';
import {createCollectionStateRepository,collectionStorageKey} from '../src/repositories/collection-state-repository.ts';
const input=JSON.parse(readFileSync('data/imports/golden-product-variants/input.json','utf8'));
const data={...variantData,entries:[...cards.map(c=>({...c,entryType:'BASE' as const,variationOfEntryId:null})),...variantData.entries]};
const query=(changes:Partial<typeof defaults>)=>filterVariants(data,{...defaults,...changes}).results;
test('complete reviewed pilot replays with stable entry and variant identities',()=>{
 assert.deepEqual(normalizeVariants(input,cards),variantData);
 assert.equal(data.entries.length,559);assert.equal(data.variants.length,1643);
 assert.deepEqual(data.entries.filter(e=>e.entryType==='BASE').map(e=>e.id),cards.map(c=>c.id));
 for(const [name,count] of [['Base',500],['Base Variations',25],['Aces',25],['1994 Team USA Signatures',9]] as const)assert.equal(data.entries.filter(e=>e.subset===name).length,count);
 for(const card of cards)assert.equal(data.variants.filter(v=>v.entryId===card.id&&v.isDefault&&v.id===card.id).length,1);
 assert.equal(variantData.variants.filter(v=>v.parallelName==='Red Disco').length,500); // /99 does not create 49,500 physical-copy rows.
 assert.equal(variantData.variants.find(v=>v.entryId.endsWith('signatures-1')&&v.parallelName==='Silver')?.serialTotal,199);
 assert.equal(variantData.variants.find(v=>v.entryId.endsWith('signatures-2')&&v.parallelName==='Silver')?.serialTotal,75);
});
test('invalid totals, IDs, parents, classification and incomplete families fail closed',()=>{
 for(const mutate of [
  (d:typeof variantData)=>d.variants.push(d.variants[0]),
  (d:typeof variantData)=>{d.variants[0]={...d.variants[0],serialTotal:0,numbering:'NUMBERED'};},
  (d:typeof variantData)=>{d.variants[0]={...d.variants[0],entryId:'missing'};},
  (d:typeof variantData)=>{d.variants[0]={...d.variants[0],autograph:true};},
  (d:typeof variantData)=>{d.eligibility[0]={...d.eligibility[0],configurationId:'missing'};},
  (d:typeof variantData)=>{d.variants[0]={...d.variants[0],sourceIds:[]};},
 ]){const d=structuredClone(variantData);mutate(d);assert.throws(()=>validateVariantData(d,cards));}
 const unreviewed=structuredClone(input);unreviewed.review.approved=false;assert.throws(()=>normalizeVariants(unreviewed,cards),/review/);
 const broken=structuredClone(input);broken.rows.pop();assert.throws(()=>normalizeVariants(broken,cards));
 const conflict=structuredClone(input);conflict.corroboration[0].name='Conflicting subject';assert.throws(()=>normalizeVariants(conflict,cards),/discrepancy/);
});
test('search and facets preserve the default 500 while exposing exact editions',()=>{
 assert.equal(query({}).length,500);assert.equal(query({query:'Messi'}).length,1);assert.equal(query({query:'#500'}).length,1);
 assert.equal(query({query:'Red Disco'}).length,500);assert.equal(query({type:'ALL'}).length,559);
 assert.equal(query({type:'INSERT'}).length,25);assert.equal(query({type:'AUTOGRAPH'}).length,18);
 assert.equal(query({type:'ALL',edition:'PARALLEL'}).length,1084);
 assert.equal(query({type:'ALL',maximum:'99'}).length,1058);
 assert.equal(query({type:'ALL',maximum:'25'}).length,550);
 assert.equal(query({type:'ALL',maximum:'1'}).length,500);
 assert.equal(query({type:'ALL',subset:'Aces',maximum:'25'}).length,50);
 assert.equal(query({country:'Argentina',query:'Messi'}).length,1);
});
test('eligibility does not follow release membership and exact-box confidence is capped',()=>{
 const red=data.variants.find(v=>v.parallelName==='Red Disco')!;
 assert.deepEqual(eligibilityAssessment(data,red.id,'npp-mega'),{status:'INCLUDED',confidence:'VERIFIED'});
 assert.deepEqual(eligibilityAssessment(data,red.id,'mastermind'),{status:'INCLUDED',confidence:'PROBABLE'});
 assert.equal(query({edition:'ALL',configuration:'npp-mega'}).length,500);
 assert.equal(query({edition:'ALL',configuration:'mastermind'}).length,0);
 assert.equal(query({edition:'ALL',configuration:'mastermind',probable:true}).length,500);
 assert.equal(query({edition:'ALL',configuration:'hobby',probable:true}).length,0);
 const conflict={...data,eligibility:[...data.eligibility,{...data.eligibility[0],status:'EXCLUDED' as const}]};
 assert.equal(eligibilityAssessment(conflict,data.eligibility[0].variantId,'npp-mega').status,'CONFLICTING');
});
test('v1 ownership maps directly to Base variant without data rewrite or parallel fan-out',()=>{
 const id=cards[9].id;const original=JSON.stringify({version:1,cards:{[id]:{owned:true,watched:true}}});let raw=original;
 const repo=createCollectionStateRepository({getItem:key=>{assert.equal(key,collectionStorageKey);return raw;},setItem:(key,value)=>{assert.equal(key,collectionStorageKey);raw=value;}});
 let state=repo.load();assert.equal(raw,original);
 const owned=filterVariants(data,{...defaults,owned:true},state).results;assert.equal(owned.length,1);assert.equal(owned[0].variant.id,id);assert.equal(owned[0].variant.isDefault,true);
 const red=data.variants.find(v=>v.entryId===id&&v.parallelName==='Red Disco')!;
 state=repo.toggle(red.id,'watched');assert.deepEqual(state[id],{owned:true,watched:true});assert.deepEqual(state[red.id],{owned:false,watched:true});
 state=repo.toggle(red.id,'owned');assert.deepEqual(repo.load()[red.id],{owned:true,watched:true});assert.equal(filterVariants(data,{...defaults,owned:true,watched:true},state).results.length,2);
});
test('reusable adapter accepts a different synthetic release without publishing it',()=>{
 const d=structuredClone(input);d.releaseId='synthetic-release';d.subsets=d.subsets.filter((s:{type:string})=>s.type==='BASE');d.subsets[0].count=1;d.families=d.families.filter((f:{sourceLabel:string})=>f.sourceLabel==='Base');d.families[0].expectedCount=1;d.rows=d.rows.filter((r:{sourceLabel:string;number:string})=>r.sourceLabel==='Base'&&r.number==='1');d.corroboration=[];d.configurations=[];d.eligibilityRules=[];
 const base=[{...cards[0],id:'synthetic-release-base-1',releaseId:'synthetic-release'}];assert.equal(normalizeVariants(d,base).variants[0].id,base[0].id);
});
