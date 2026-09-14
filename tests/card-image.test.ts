import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Card } from '../src/types/catalog.ts';
import { goldenCards } from '../src/data/fixtures/golden-product.ts';

// Compile the actual TSX component in memory. No mock image renderer or added test runner.
const compiled = ts.transpileModule(readFileSync(new URL('../src/components/cards/card-image.tsx',import.meta.url),'utf8'),{
 compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}
}).outputText;
const require = createRequire(import.meta.url);
const exports: {CardImage?: ComponentType<{card:Card}>} = {};
new Function('require','exports',compiled)((name:string)=>require(name === '@/domain/catalog/images' ? '../src/domain/catalog/images.ts' : name),exports);
const component=exports.CardImage!;
test('actual image component emits responsive lazy image only for an approved matching projection',()=>{
 const card: Card={...goldenCards[0],image:{assetId:'synthetic',cardId:goldenCards[0].id,variantId:null,side:'FRONT',assetUrl:'/card-images/synthetic-'+ 'a'.repeat(64)+'.webp',sourceUrl:'https://example.com',matchStatus:'VERIFIED',usageStatus:'PUBLIC_ALLOWED',approvalStatus:'APPROVED',width:800,height:1120,format:'webp'}};
 const html=renderToStaticMarkup(createElement(component,{card}));
 assert.match(html,/<img /); assert.match(html,/loading="lazy"/); assert.match(html,/decoding="async"/);
 assert.match(html,/srcSet=/); assert.match(html,/sizes="/); assert.match(html,/_next\/image/);
 assert.ok(!html.includes('rel="preload"')); assert.ok(html.includes('card '+card.cardNumber));
 for(const image of [goldenCards[0].image,{...card.image,usageStatus:'UNKNOWN_RIGHTS' as const},{...card.image,matchStatus:'CANDIDATE' as const},{...card.image,cardId:'wrong-card'}]) {
   const fallback=renderToStaticMarkup(createElement(component,{card:{...card,image}}));
   assert.ok(!fallback.includes('<img ')); assert.match(fallback,/Image unavailable/); assert.match(fallback,/pending/);
 }
});
