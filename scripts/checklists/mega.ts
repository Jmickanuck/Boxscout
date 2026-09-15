import {readFileSync} from 'node:fs';
import {normalizeVariants,validateVariantData} from './variants.ts';
import {cards} from '../../src/data/fixtures/generated/golden-product-base.ts';
import {variantData} from '../../src/data/fixtures/generated/golden-product-variants.ts';
import type {VariantData} from '../../src/types/variants.ts';
export function expandedVariants():VariantData {
 const extra=normalizeVariants(JSON.parse(readFileSync('data/imports/mega-expansion/reviewed.json','utf8')),cards);
 const merged=structuredClone(variantData);
 for(const key of ['entries','variants','configurations','eligibility','sources'] as const){
  const ids=new Set(merged[key].map(x=>x.id));
  if(key==='eligibility'){
   const pairs=new Set(merged.eligibility.map(e=>e.configurationId+'|'+e.variantId));
   merged.eligibility.push(...extra.eligibility.filter(e=>!ids.has(e.id)&&!pairs.has(e.configurationId+'|'+e.variantId)));
  }else (merged[key] as {id:string}[]).push(...extra[key].filter(x=>!ids.has(x.id)));
 }
 validateVariantData(merged,cards);return merged;
}
