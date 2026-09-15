import { cardImageRepository } from './card-image-repository.ts';
import { publication } from '../data/published/catalogue.ts';
import { assessNppMapping } from '../domain/catalog/configuration-intelligence.ts';
import type { SealedPriceObservation } from '../types/market.ts';
import type { Card, Product, ConfigurationIntelligence } from '../types/catalog.ts';
import type {CatalogueData} from '../types/publication.ts';
export interface CatalogRepository {
  getConfigurationIntelligence(productId: string): ConfigurationIntelligence | undefined;
  listSealedPrices(productId: string): readonly SealedPriceObservation[];
  listProducts(): readonly Product[];
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
  findProduct:slug=>{const p=data.products.find(p=>p.slug===slug);return p?reviewed(p):undefined;},
  listReleaseCards:releaseId=>data.entries.filter(e=>e.releaseId===releaseId&&e.entryType==='BASE').map(card=>{const image=cardImageRepository.findPrimary(card.id);return image?{...card,image}:card;}),
 };
}
export const catalogRepository=createCatalogRepository(publication.data);
