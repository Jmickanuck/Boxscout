import {goldenProduct, goldenCards} from '../../src/data/fixtures/golden-product.ts';
import {configurationIntelligence, sealedPriceObservations} from '../../src/data/fixtures/golden-product-configuration.ts';
import {variantData} from '../../src/data/fixtures/generated/golden-product-variants.ts';
import type {CatalogueDataRepository} from '../../src/types/publication.ts';
export const fixtureSource:CatalogueDataRepository={async read(){return structuredClone({
 products:[goldenProduct],entries:[...goldenCards.map(c=>({...c,entryType:'BASE' as const,variationOfEntryId:null})),...variantData.entries],
 variants:variantData.variants,configurations:variantData.configurations,eligibility:variantData.eligibility,
 sources:variantData.sources,intelligence:[{productId:goldenProduct.id,data:configurationIntelligence}],prices:[...sealedPriceObservations],
});}};
