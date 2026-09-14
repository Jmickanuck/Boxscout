import type { BrowseData, BrowseEntry, BrowseVariant, Confidence } from '../../types/variants.ts';
import type { CollectionState } from '../collection.ts';
export type VariantFilters = {query:string; type:string; edition:string; maximum:string; country:string; subset:string; configuration:string; probable:boolean; owned:boolean; watched:boolean};
export const defaultVariantFilters:VariantFilters={query:'',type:'BASE',edition:'DEFAULT',maximum:'',country:'',subset:'',configuration:'',probable:false,owned:false,watched:false};
export function eligibilityAssessment(data:BrowseData, variantId:string, configuration:string): {status:string;confidence:Confidence} {
 const claims=data.eligibility.filter(e=>e.variantId===variantId&&e.configurationId===(configuration==='mastermind'?'npp-mega':configuration));
 if(!claims.length)return {status:'UNKNOWN',confidence:'UNKNOWN'};
 const statuses=new Set(claims.map(c=>c.status));
 if(statuses.size!==1||statuses.has('CONFLICTING'))return {status:'CONFLICTING',confidence:'UNKNOWN'};
 let confidence:Confidence=claims.every(c=>c.confidence==='VERIFIED')?'VERIFIED':claims.some(c=>c.confidence==='UNKNOWN')?'UNKNOWN':'PROBABLE';
 const configured=data.configurations.find(c=>c.id===(configuration==='mastermind'?'npp-mega':configuration));
 if(!configured||configured.confidence==='UNKNOWN')confidence='UNKNOWN';else if(configured.confidence==='PROBABLE'&&confidence==='VERIFIED')confidence='PROBABLE';
 return {status:claims[0].status,confidence:configuration==='mastermind'&&confidence==='VERIFIED'?'PROBABLE':confidence};
}
export function filterVariants(data:BrowseData,f:VariantFilters,collection:CollectionState={}) {
 const q=f.query.trim().toLocaleLowerCase().replace(/^#/,'');
 const parallelSearch=!!q&&data.variants.some(v=>!v.isDefault&&v.parallelName.toLocaleLowerCase().includes(q));
 const exact=f.edition!=='DEFAULT'||!!f.maximum||parallelSearch||f.type==='AUTOGRAPH'||!!f.configuration||f.owned||f.watched;
 const entries=new Map(data.entries.map(e=>[e.id,e]));
 const results:{entry:BrowseEntry;variant:BrowseVariant;group:string}[]=[];
 for(const v of data.variants){
  const e=entries.get(v.entryId);if(!e)continue;
  if(!exact&&!v.isDefault||f.edition==='PARALLEL'&&v.isDefault)continue;
  if(f.type!=='ALL'&&e.entryType!==f.type)continue;
  if(f.country&&e.country!==f.country||f.subset&&e.subset!==f.subset)continue;
  if(f.maximum&&(v.numbering!=='NUMBERED'||v.serialTotal===null||v.serialTotal>Number(f.maximum)))continue;
  if(f.edition==='NUMBERED'&&v.numbering!=='NUMBERED')continue;
  if(q&&!`${e.playerName} ${e.cardNumber} ${e.country} ${e.subset} ${v.parallelName}`.toLocaleLowerCase().includes(q))continue;
  if(f.owned&&!collection[v.id]?.owned||f.watched&&!collection[v.id]?.watched)continue;
  if(f.configuration){const a=eligibilityAssessment(data,v.id,f.configuration);if(a.status!=='INCLUDED'||a.confidence!=='VERIFIED'&&!(f.probable&&a.confidence==='PROBABLE'))continue;}
  const group=e.subset+' · '+v.parallelName+(v.serialTotal!==null?' /'+v.serialTotal:'');
  results.push({entry:e,variant:v,group});
 }
 results.sort((a,b)=>a.group.localeCompare(b.group)||a.entry.sortOrder-b.entry.sortOrder||a.variant.id.localeCompare(b.variant.id));
 return {results,exact};
}
