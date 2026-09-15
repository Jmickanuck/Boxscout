import type { Product, ConfigurationIntelligence } from './catalog.ts';
import type { ChecklistEntry, Variant, ReleaseConfiguration, VariantEligibility, CatalogueSource } from './variants.ts';
import type { SealedPriceObservation } from './market.ts';
export type CatalogueData = {
 products: Product[]; entries: ChecklistEntry[]; variants: Variant[];
 configurations: ReleaseConfiguration[]; eligibility: VariantEligibility[];
 sources: CatalogueSource[]; intelligence: {productId:string; data:ConfigurationIntelligence}[];
 prices: SealedPriceObservation[];
};
export interface CatalogueDataRepository { read(): Promise<CatalogueData> }
export type Publication = { schemaVersion:1; revision:string; data:CatalogueData };
