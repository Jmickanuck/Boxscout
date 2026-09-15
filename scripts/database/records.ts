import {validateCatalogue} from './validate.ts';
import {createHash} from 'node:crypto';
import type {CatalogueData} from '../../src/types/publication.ts';
export type Row=Record<string,unknown>;
export type Tables=Record<string,Row[]>;
export function stable(value:unknown):string {
 if(Array.isArray(value))return '['+value.map(stable).join(',')+']';
 if(value!==null&&typeof value==='object')return '{'+Object.entries(value).filter(([,v])=>v!==undefined).sort(([a],[b])=>a.localeCompare(b,'en')).map(([k,v])=>JSON.stringify(k)+':'+stable(v)).join(',')+'}';
 return JSON.stringify(value);
}
export const digest=(value:unknown)=>createHash('sha256').update(stable(value)).digest('hex');
const ordered=(rows:readonly unknown[])=>rows.map((row,position)=>({...row as Row,position}));
export function flatten(d:CatalogueData):Tables {
 const t:Tables={releases:[],retailer_configurations:[],products:[],entries:ordered(d.entries),variants:ordered(d.variants),configurations:ordered(d.configurations),eligibility:ordered(d.eligibility),sources:ordered(d.sources),evidence:[],listings:[],assessments:[],configuration_links:[],specifications:[],claims:[],prices:ordered(d.prices),source_links:[],entry_sources:[],variant_sources:[],configuration_sources:[],eligibility_sources:[],claim_conflicts:[],identifier_evidence:[]};
 for(const [position,p] of d.products.entries()){
  if(!t.releases.some(r=>r.id===p.release.id))t.releases.push({...p.release,position:t.releases.length});
  t.retailer_configurations.push({...p.configuration,position});
  t.products.push({id:p.id,slug:p.slug,releaseId:p.release.id,configurationId:p.configuration.id,position});
 }
 for(const {productId,data:i} of d.intelligence){
  t.listings.push({...i.listing,position:t.listings.length});
  t.assessments.push({...i.assessment,productId,position:t.assessments.length});
  for(const e of i.evidence){if(!t.evidence.some(r=>r.id===e.id))t.evidence.push({...e,position:t.evidence.length});}
  for(const [position,x] of i.links.entries())t.configuration_links.push({...x,productId,position});
  for(const x of i.specifications)t.specifications.push({...x,productId,position:t.specifications.length});
  for(const x of i.claims){t.claims.push({...x,productId,position:t.claims.length});for(const other of x.conflictIds)t.claim_conflicts.push({claimId:x.id,otherId:other});}
  for(const kind of ['retailerSku','reportedUpc'] as const)for(const evidenceId of i.listing[kind].evidenceIds)t.identifier_evidence.push({listingId:i.listing.id,kind,evidenceId});
 }
 // Every referenced source ID is a foreign key; ordered joins retain original arrays.
 for(const [parent,links,key] of [['variants','variant_sources','variantId'],['configurations','configuration_sources','configurationId'],['eligibility','eligibility_sources','eligibilityId']] as const){
  for(const row of t[parent]){for(const [position,sourceId] of (row.sourceIds as string[]).entries())t[links].push({[key]:row.id,sourceId,position});delete row.sourceIds;}
 }
 // Provenance records retain exact wording and dates; source identity is also relational.
 for(const entry of d.entries)for(const [position,p] of entry.provenance.entries()){
  const sourceId=p.sourceId??'source-'+digest({name:p.sourceName,url:p.sourceUrl}).slice(0,24);
  if(!t.source_links.some(s=>s.id===sourceId))t.source_links.push({id:sourceId,name:p.sourceName,url:p.sourceUrl});
  t.entry_sources.push({entryId:entry.id,sourceId,position});
 }
 const entryRelease=new Map(d.entries.map(e=>[e.id,e.releaseId]));
 for(const r of t.variants)r.releaseId=entryRelease.get(r.entryId as string);
 for(const r of t.eligibility)r.releaseId=d.configurations.find(c=>c.id===r.configurationId)?.releaseId;
 return t;
}
const strip=(r:Row,keys:string[]=[])=>Object.fromEntries(Object.entries(r).filter(([k,v])=>k!=='position'&&!keys.includes(k)&&v!==undefined));
export function inflate(t:Tables):CatalogueData {
 const rows=(name:string,keys:string[]=[])=>t[name].map(r=>strip(r,keys));
 const joined=(name:string,links:string,key:string,keys:string[]=[])=>rows(name,keys).map(r=>({...r,sourceIds:t[links].filter(x=>x[key]===r.id).sort((a,b)=>Number(a.position)-Number(b.position)).map(x=>x.sourceId)}));
 const data={products:rows('products').map(p=>({id:p.id,slug:p.slug,release:rows('releases').find(r=>r.id===p.releaseId),configuration:rows('retailer_configurations').find(r=>r.id===p.configurationId)})),entries:rows('entries'),variants:joined('variants','variant_sources','variantId',['releaseId']),configurations:joined('configurations','configuration_sources','configurationId'),eligibility:joined('eligibility','eligibility_sources','eligibilityId',['releaseId']),sources:rows('sources').map(s=>Object.fromEntries(Object.entries(s).filter(([k,v])=>k!=='sha256'||v!==null))),prices:rows('prices'),intelligence:rows('assessments').map(a=>({productId:a.productId,data:{listing:rows('listings').find(l=>l.productId===a.productId),assessment:strip(a,['productId']),evidence:rows('evidence').map(e=>Object.fromEntries(Object.entries(e).filter(([k,v])=>v!==null||!['observedAt','sourceId'].includes(k)))),links:rows('configuration_links').filter(x=>x.productId===a.productId).map(x=>strip(x,['productId'])),specifications:rows('specifications').filter(x=>x.productId===a.productId).map(x=>strip(x,['productId'])),claims:rows('claims').filter(x=>x.productId===a.productId).map(x=>strip(x,['productId']))}}))};
 const result=data as unknown as CatalogueData; validateCatalogue(result); return result;
}
export function assertParity(a:CatalogueData,b:CatalogueData){if(stable(a)!==stable(b))throw new Error('Catalogue parity failed: domain fields, identities or provenance differ');}
