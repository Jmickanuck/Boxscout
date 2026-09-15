import type { Card } from '../../src/types/catalog.ts';
import { entryTypes, type VariantData, type EntryType, type Variant } from '../../src/types/variants.ts';
const text = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;
function requireValue(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(message); }
const norm = (s:string) => s.normalize('NFC').trim().replace(/\s+/g,' ');
const slug = (s:string) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function normalizeVariants(input: unknown, base: readonly Card[]): VariantData {
  requireValue(input && typeof input === 'object', 'Invalid import');
  const d = input as Record<string, unknown>;
  requireValue(text(d.releaseId) && text(d.checkedAt) && Number.isFinite(Date.parse(d.checkedAt)), 'Invalid release/date');
  for (const key of ['subsets','families','rows','corroboration','sources','configurations','eligibilityRules']) requireValue(Array.isArray(d[key]), 'Missing '+key);
  const review=d.review as {approved?:boolean;conflicts?:unknown[];reviewedAt?:string;rationale?:string}|undefined;
  requireValue(review?.approved===true && Array.isArray(review.conflicts) && review.conflicts.length===0 && text(review.reviewedAt) && Number.isFinite(Date.parse(review.reviewedAt)) && text(review.rationale),'Unapproved or conflicting review');
  // Shape validation precedes typed processing, including every imported row.
  type Row = {sourceLabel:string;number:string;name:string;country:string;sequence:number|string;locator:string};
  const rows = d.rows as Row[];
  const identityRows = (d.identityRows ?? d.rows) as Row[];
  requireValue(Array.isArray(identityRows),'Invalid identity rows');
  for(const r of [...rows,...identityRows]) requireValue(r && [r.sourceLabel,r.number,r.name,r.country,r.locator].every(text) && (r.sequence === '' || Number.isInteger(r.sequence) && Number(r.sequence)>0), 'Invalid source row');
  type Subset = {name:string;slug:string;type:EntryType;count:number};
  const subsets=d.subsets as Subset[];
  for(const s of subsets) requireValue(s && text(s.name) && /^[a-z0-9-]+$/.test(s.slug) && entryTypes.includes(s.type) && Number.isInteger(s.count) && s.count>0,'Invalid subset');
  const sources=d.sources as VariantData['sources'];
  for(const s of sources) requireValue(s && text(s.id) && text(s.name) && /^https:\/\//.test(s.url) && Number.isFinite(Date.parse(s.checkedAt)),'Invalid source');
  const sourceIds=new Set(sources.map(s=>s.id));
  requireValue(text(d.primarySourceId)&&text(d.corroboratingSourceId)&&sourceIds.has(d.primarySourceId)&&sourceIds.has(d.corroboratingSourceId),'Missing review sources');
  const reviewSources=[d.primarySourceId,d.corroboratingSourceId];
  const result:VariantData={entries:[],variants:[],configurations:[],eligibility:[],sources};
  const getSubset=(name:string)=>{const s=subsets.find(s=>s.name===name);requireValue(s,'Unknown subset');return s;};
  const entryId=(subset:Subset,number:string)=>d.releaseId+'-'+subset.slug+'-'+number;
  const corroboration=d.corroboration as {subset:string;number:string;name:string;country:string}[];
  for(const s of subsets) {
    const standard=identityRows.filter(r=>r.sourceLabel===s.name);
    requireValue(standard.length===s.count,'Incomplete subset '+s.name);
    for(const r of standard) {
      const id=entryId(s,r.number); const existing=base.find(b=>b.id===id);
      if(s.type==='BASE') {requireValue(existing && existing.releaseId===d.releaseId,'Base identity changed');continue;}
      const other=corroboration.filter(c=>c.subset===s.name && c.number===r.number);
      requireValue(other.length===1 && norm(other[0].name)===norm(r.name) && norm(other[0].country)===norm(r.country),'Unresolved entry discrepancy '+id);
      result.entries.push({id,releaseId:d.releaseId,cardNumber:r.number,playerName:norm(r.name),country:norm(r.country),subset:s.name,sortOrder:Number(r.number),entryType:s.type,variationOfEntryId:s.type==='VARIATION'?base.find(b=>b.cardNumber===r.number)?.id??null:null,verificationState:'VERIFIED',checkedAt:d.checkedAt,discrepancyIds:[],provenance:reviewSources.map(sourceId=>{const source=sources.find(s=>s.id===sourceId);requireValue(source,'Missing evidence');return {sourceId,sourceName:source.name,sourceUrl:source.url,checkedAt:source.checkedAt,verificationState:'VERIFIED' as const,locator:sourceId===d.primarySourceId?r.locator:s.name+' #'+r.number,scope:'Checklist identity'};}),image:{assetUrl:null,sourceUrl:null,matchStatus:'MISSING',usageStatus:'UNKNOWN_RIGHTS'}});
    }
  }
  type Family={sourceLabel:string;subset:string;parallel:string;expectedCount:number;serialTotal:number|null|'per-entry'};
  const families=d.families as Family[];
  const variantsByLabel=new Map<string,Variant[]>();
  for(const f of families){
    requireValue(f && [f.sourceLabel,f.subset,f.parallel].every(text) && Number.isInteger(f.expectedCount) && f.expectedCount>0,'Invalid family');
    const s=getSubset(f.subset); const selected=rows.filter(r=>r.sourceLabel===f.sourceLabel);
    requireValue(selected.length===f.expectedCount,'Incomplete family '+f.sourceLabel);
    requireValue(new Set(selected.map(r=>r.number)).size===selected.length,'Duplicate family number');
    const standardNumbers=new Set(identityRows.filter(r=>r.sourceLabel===s.name).map(r=>r.number));
    requireValue(selected.every(r=>standardNumbers.has(r.number)),'Variant outside subset');
    const generated:Variant[]=[];
    for(const r of selected){
      const parent=entryId(s,r.number); const total=r.sequence===''?null:Number(r.sequence);
      requireValue(f.serialTotal==='per-entry'||total===f.serialTotal,'Serial conflict '+r.locator);
      const v:Variant={id:f.parallel==='default'?parent:parent+'::'+slug(f.parallel),entryId:parent,parallelName:f.parallel==='default'?'Base':f.parallel,isDefault:f.parallel==='default',numbering:total===null?'UNNUMBERED':'NUMBERED',serialTotal:total,autograph:s.type==='AUTOGRAPH',relic:null,verificationState:'VERIFIED',sourceIds:reviewSources,locator:r.locator+'; '+f.subset+' parallel list',checkedAt:d.checkedAt};
      generated.push(v);result.variants.push(v);
    }
    variantsByLabel.set(f.sourceLabel,generated);
  }
  for(const r of rows) requireValue(families.some(f=>f.sourceLabel===r.sourceLabel),'Unmapped source row');
  for(const c of d.configurations as VariantData['configurations']) {
    requireValue(c && text(c.id) && text(c.name) && ['VERIFIED','PROBABLE','UNKNOWN'].includes(c.confidence) && Array.isArray(c.sourceIds) && c.sourceIds.length && c.sourceIds.every(id=>sourceIds.has(id)),'Invalid configuration');
    result.configurations.push({...c,releaseId:d.releaseId});
  }
  type Rule=Omit<VariantData['eligibility'][number],'variantId'|'checkedAt'> & {sourceLabel:string};
  for(const rule of d.eligibilityRules as Rule[]){
    requireValue(rule && text(rule.id) && text(rule.locator) && text(rule.rationale) && ['INCLUDED','EXCLUDED','UNKNOWN','CONFLICTING'].includes(rule.status) && ['VERIFIED','PROBABLE','UNKNOWN'].includes(rule.confidence) && Array.isArray(rule.sourceIds) && rule.sourceIds.length && rule.sourceIds.every(id=>sourceIds.has(id)),'Invalid eligibility rule');
    const matched=variantsByLabel.get(rule.sourceLabel);requireValue(matched,'Unknown rule family');
    for(const v of matched) result.eligibility.push({id:rule.id+':'+v.id,configurationId:rule.configurationId,variantId:v.id,status:rule.status,confidence:rule.confidence,sourceIds:rule.sourceIds,locator:rule.locator,rationale:rule.rationale,checkedAt:d.checkedAt});
  }
  validateVariantData(result,base);
  return result;
}
export function validateVariantData(d:VariantData,base:readonly Card[]) {
 const unique=(ids:readonly string[],label:string)=>requireValue(new Set(ids).size===ids.length,'Duplicate '+label);
 const entries=[...base.map(b=>({...b,entryType:'BASE' as const,variationOfEntryId:null})),...d.entries];
 unique(entries.map(e=>e.id),'entry');unique(d.variants.map(v=>v.id),'variant');unique(d.configurations.map(c=>c.id),'configuration');unique(d.sources.map(s=>s.id),'source');unique(d.variants.map(v=>v.entryId+'|'+v.parallelName),'edition identity');unique(d.eligibility.map(e=>e.id),'claim');
 const byId=new Map(entries.map(e=>[e.id,e]));
 for(const v of d.variants){const e=byId.get(v.entryId);requireValue(e,'Invalid variant parent');requireValue(v.sourceIds.length && v.sourceIds.every(id=>d.sources.some(s=>s.id===id)) && text(v.locator),'Missing provenance');requireValue(v.numbering==='NUMBERED'?Number.isInteger(v.serialTotal)&&Number(v.serialTotal)>0:v.serialTotal===null,'Invalid serial total');requireValue(v.autograph===(e.entryType==='AUTOGRAPH'),'Invalid card type');}
 for(const e of entries){requireValue(d.variants.some(v=>v.entryId===e.id),'Entry missing collectible variant');const defaults=d.variants.filter(v=>v.entryId===e.id&&v.isDefault);requireValue(defaults.length<=1 && (e.entryType!=='BASE'||defaults.length===1),'Missing/duplicate default');requireValue(defaults.every(v=>v.id===e.id),'Default identity changed');if(e.variationOfEntryId)requireValue(byId.get(e.variationOfEntryId)?.entryType==='BASE','Invalid variation parent');}
 for(const claim of d.eligibility){const c=d.configurations.find(c=>c.id===claim.configurationId);const v=d.variants.find(v=>v.id===claim.variantId);requireValue(c&&v&&byId.get(v.entryId)?.releaseId===c.releaseId,'Invalid eligibility target');}
}
