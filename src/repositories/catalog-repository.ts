import { cardImageRepository } from './card-image-repository.ts';
import { publication } from '../data/published/catalogue.ts';
import { assessNppMapping } from '../domain/catalog/configuration-intelligence.ts';
import type { SealedPriceObservation } from '../types/market.ts';
import type { Card, Product, Release, ConfigurationIntelligence } from '../types/catalog.ts';
import type { ReleaseConfiguration } from '../types/variants.ts';
import type {CatalogueData} from '../types/publication.ts';
export interface CatalogRepository {
  getConfigurationIntelligence(productId: string): ConfigurationIntelligence | undefined;
  listSealedPrices(productId: string): readonly SealedPriceObservation[];
  listProducts(): readonly Product[];
  listReleases(): readonly Release[];
  findRelease(id: string): Release | undefined;
  listReleaseProducts(releaseId: string): readonly Product[];
  listReleaseConfigurations(releaseId: string): readonly ReleaseConfiguration[];
  listFormatProducts(releaseId: string, familyName: string): readonly Product[];
  findProduct(slug: string): Product | undefined;
  listReleaseCards(releaseId: string): readonly Card[];
}
export function createCatalogRepository(data:CatalogueData):CatalogRepository {
 const intelligence=(id:string)=>data.intelligence.find(i=>i.productId===id)?.data;
 const reviewed=(p:Product):Product=>{const i=intelligence(p.id);return i?{...p,configuration:{...p.configuration,nppMappingStatus:assessNppMapping(i)}}:p;};
 return {
  getConfigurationIntelligence:intelligence,
  listSealedPrices:id=>data.prices.filter(p=>p.productId===id),
  listProducts:()=>data.products.map(reviewed),
  listReleases:()=>[...new Map(data.products.map(p=>[p.release.id,p.release])).values()],
  findRelease:id=>data.products.find(p=>p.release.id===id)?.release,
  listReleaseProducts:releaseId=>data.products.filter(p=>p.release.id===releaseId).map(reviewed),
  listReleaseConfigurations:releaseId=>data.configurations.filter(c=>c.releaseId===releaseId),
  // A presentation association only: callers must retain the product's mapping confidence.
  listFormatProducts:(releaseId,familyName)=>data.products.filter(p=>{
   const evidence=intelligence(p.id);
   return p.release.id===releaseId && evidence?.assessment.family===familyName && assessNppMapping(evidence)!=='UNKNOWN';
  }).map(reviewed),
  findProduct:slug=>{const p=data.products.find(p=>p.slug===slug);return p?reviewed(p):undefined;},
  listReleaseCards:releaseId=>data.entries.filter(e=>e.releaseId===releaseId&&e.entryType==='BASE').map(card=>{const image=cardImageRepository.findPrimary(card.id);return image?{...card,image}:card;}),
 };
}
export const catalogRepository=createCatalogRepository(publication.data);
