import { publication } from '../data/published/catalogue.ts';
const variantData=publication.data;
const cards=publication.data.entries.filter(e=>e.entryType==='BASE');
import { cardImageRepository } from './card-image-repository.ts';
import type { BrowseData, ChecklistEntry } from '../types/variants.ts';
export const releaseEntries:readonly ChecklistEntry[]=publication.data.entries;
export const variantRepository={
 listEntries:(releaseId:string)=>releaseEntries.filter(e=>e.releaseId===releaseId),
 browse(releaseId:string):BrowseData {
 const entries=releaseEntries.filter(e=>e.releaseId===releaseId).map(({id,releaseId,cardNumber,playerName,country,subset,entryType,sortOrder})=>({id,releaseId,cardNumber,playerName,country,subset,entryType,sortOrder}));
 const ids=new Set(entries.map(e=>e.id));
 return {entries,variants:variantData.variants.filter(v=>ids.has(v.entryId)).map(({id,entryId,parallelName,isDefault,numbering,serialTotal})=>({id,entryId,parallelName,isDefault,numbering,serialTotal})),configurations:variantData.configurations.filter(c=>c.releaseId===releaseId),eligibility:variantData.eligibility.filter(e=>variantData.configurations.some(c=>c.id===e.configurationId&&c.releaseId===releaseId)).map(({configurationId,variantId,status,confidence})=>({configurationId,variantId,status,confidence}))};
 },
 images(releaseId:string){return Object.fromEntries(variantData.variants.filter(v=>releaseEntries.some(e=>e.id===v.entryId&&e.releaseId===releaseId)).flatMap(v=>{
 // Legacy null-variant imagery belongs only to the approved Base/default edition.
 const image=cardImageRepository.findPrimary(v.entryId,v.id)??(v.isDefault&&cards.some(c=>c.id===v.entryId)?cardImageRepository.findPrimary(v.entryId):null);
 return image?[[v.id,image]]:[];
 }));},
 sources:variantData.sources,
};
