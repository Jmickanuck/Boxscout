import test from 'node:test';
import assert from 'node:assert/strict';
import { configurationIntelligence as fixture, sealedPriceObservations as prices } from '../src/data/fixtures/golden-product-configuration.ts';
import { assessNppMapping, buildConfigurationOverview, claimText, rankSources, validUpc } from '../src/domain/catalog/configuration-intelligence.ts';
import { isValidObservationDate, selectSealedPrice, formatCad } from '../src/domain/market/sealed-price.ts';
import { goldenProduct, goldenEligibility } from '../src/data/fixtures/golden-product.ts';
import { catalogRepository } from '../src/repositories/catalog-repository.ts';
import type { ConfigurationIntelligence } from '../src/types/catalog.ts';
import type { SealedPriceObservation } from '../src/types/market.ts';

const intel = (changes: Partial<ConfigurationIntelligence> = {}): ConfigurationIntelligence => ({...fixture,...changes});
const now = new Date('2026-09-15T00:00:00Z');
const select = (observations: readonly SealedPriceObservation[]) => selectSealedPrice(observations,fixture.listing.id,fixture.listing.productId,now);

test('exact retailer identity is distinct from unverified canonical configuration', () => {
  assert.equal(fixture.listing.retailerSku.value,'256877');
  assert.equal(fixture.listing.reportedUpc.value,'746134202520');
  assert.equal(typeof fixture.listing.reportedUpc.value,'string');
  assert.ok(validUpc('746134202520'));
  assert.ok(validUpc('012345678905')); // Leading zero survives validation.
  assert.equal(validUpc('746134202521'),false);
  assert.equal(validUpc('74613420252'),false);
  assert.equal(goldenProduct.configuration.upc,null);
  assert.equal(goldenProduct.configuration.packsPerBox,null);
  assert.ok(goldenEligibility.every(item=>item.status==='UNKNOWN'));
  assert.equal(assessNppMapping(fixture),'PROBABLE');
});

test('source hierarchy prefers official authority without inventing an exact UPC bridge', () => {
  assert.deepEqual(rankSources([...fixture.evidence].reverse()).slice(0,2).map(source=>source.sourceKind),['PANINI_OFFICIAL','OFFICIAL_SELL_SHEET']);
  assert.equal(assessNppMapping(intel({assessment:{...fixture.assessment,reviewedStatus:'VERIFIED'}})),'PROBABLE');
  assert.equal(assessNppMapping(intel({links:fixture.links.filter(link=>link.linkKind!=='EXPLICIT_UPC_FAMILY')})),'UNKNOWN');
  assert.equal(assessNppMapping(intel({evidence:fixture.evidence.map(source=>source.id==='emporium-mega'?{...source,verificationState:'CANDIDATE'}:source)})),'UNKNOWN');
  assert.equal(assessNppMapping(intel({listing:{...fixture.listing,reportedUpc:{...fixture.listing.reportedUpc,value:'746134202521'}}})),'UNKNOWN');
});

test('verified mapping requires a reviewed decision and an authoritative exact linkage', () => {
  const linked = intel({links:[...fixture.links,{evidenceId:'panini-release',upc:fixture.listing.reportedUpc.value,family:'NPP Mega',linkKind:'EXPLICIT_UPC_FAMILY'}]});
  assert.equal(assessNppMapping(linked),'PROBABLE');
  assert.equal(assessNppMapping({...linked,assessment:{...linked.assessment,reviewedStatus:'VERIFIED'}}),'VERIFIED');
  assert.equal(assessNppMapping({...linked,links:[...linked.links,{evidenceId:'emporium-mega',upc:fixture.listing.reportedUpc.value,family:'Other Mega',linkKind:'EXPLICIT_UPC_FAMILY'}]}),'UNKNOWN');
});

test('conflicting guarantee and average semantics survive; conservative headline never guarantees', () => {
  const view=buildConfigurationOverview(fixture);
  assert.equal(view.hasClaimConflict,true);
  assert.equal(view.averages.length,5);
  assert.ok(view.averages.every(claim=>claim.claimSemantics==='PER_BOX_AVERAGE' && claim.subject.scope==='MATCHING_UPC'));
  assert.equal(view.claims.filter(claim=>claim.claimSemantics==='GUARANTEED').length,5);
  assert.equal(view.specification?.evidenceId,'panini-npp-sheet');
  const group=view.claims.find(claim=>claim.id==='scheels-group')!;
  assert.match(claimText(group),/8 Prizms \(including 6 Disco Prizms\)/);
  assert.ok(!view.averages.includes(group));
  assert.match(claimText({...group,claimSemantics:null,quantity:null,includes:[]}),/semantics unknown/);
  assert.match(claimText({...group,claimSemantics:'POSSIBLE'}),/possible, not promised/);
  assert.match(claimText({...group,claimSemantics:'PUBLISHED_ODDS',publishedOdds:'1:10'}),/published odds: 1:10/);
});

test('unknown mapping suppresses family claims; candidate and wrong-UPC claims cannot surface', () => {
  const unknown=buildConfigurationOverview(intel({links:[]}));
  assert.ok(unknown.claims.every(claim=>claim.subject.scope==='MATCHING_UPC'));
  const changed=buildConfigurationOverview(intel({evidence:fixture.evidence.map(source=>source.id==='emporium-mega'?{...source,verificationState:'CANDIDATE'}:source)}));
  assert.equal(changed.averages.length,0);
  const wrong=buildConfigurationOverview(intel({claims:fixture.claims.map(claim=>({...claim,subject:{scope:'MATCHING_UPC',value:'012345678905'}}))}));
  assert.equal(wrong.claims.length,0);
});

test('pack disagreements show unknown; contradictory stated totals are not displayed', () => {
  const spec=fixture.specifications[1];
  const conflict=buildConfigurationOverview(intel({specifications:[spec,{...spec,id:'different',packsPerBox:5,statedCardsPerBox:35}]}));
  assert.equal(conflict.specConflict,true);
  assert.equal(conflict.specification,null);
  assert.equal(buildConfigurationOverview(intel({specifications:[{...spec,statedCardsPerBox:99}]})).specification,null);
});

test('fixture evidence references resolve and retain checked dates, scope and source URLs', () => {
  const ids=new Set(fixture.evidence.map(source=>source.id));
  assert.equal(ids.size,fixture.evidence.length);
  for(const source of fixture.evidence){assert.ok(source.sourceUrl.startsWith('https://'));assert.ok(source.scope);assert.match(source.checkedAt,/^2026-09-14$/);}
  for(const item of [...fixture.links,...fixture.claims,...fixture.specifications])assert.ok(ids.has(item.evidenceId));
  for(const claim of fixture.claims)for(const id of claim.conflictIds)assert.ok(fixture.claims.some(other=>other.id===id));
  assert.equal(catalogRepository.getConfigurationIntelligence('missing'),undefined);
  assert.deepEqual(catalogRepository.listSealedPrices('missing'),[]);
});

test('price selection is dated, CAD-only and retains repeated observations without mutation', () => {
  const before=JSON.stringify(prices);
  const result=select(prices);
  assert.equal(result.observation?.amountMinor,11999);
  assert.equal(result.observation?.observedAt,'2026-09-14T20:30:25.573Z');
  assert.equal(result.observation?.availability,'UNKNOWN');
  assert.equal(result.history.length,2);
  assert.equal(select([...prices].reverse()).observation?.id,result.observation?.id);
  assert.equal(formatCad(11999),'CAD $119.99');
  assert.equal(JSON.stringify(prices),before);
});

test('invalid, future, unverified and mismatched price evidence cannot become a quote', () => {
  const base=prices[0];
  const invalid: SealedPriceObservation[]=[
    {...base,currency:'USD'}, {...base,productId:'other'}, {...base,retailerListingId:'other'},
    {...base,observedAt:'2026-02-30T12:00:00Z'}, {...base,observedAt:'2026-09-16T00:00:00Z'},
    {...base,amountMinor:-1}, {...base,amountMinor:119.99}, {...base,observedAt:'2026-09-14'},
    {...base,provenance:{...base.provenance,verificationState:'CANDIDATE'}},
    {...base,provenance:{...base.provenance,sourceUrl:''}},
  ];
  for(const item of invalid)assert.equal(select([item]).observation,null);
  assert.equal(select([]).observation,null);
  assert.equal(isValidObservationDate('2026-02-30T12:00:00Z'),false);
  assert.equal(isValidObservationDate('2026-09-14T20:30:25Z'),true);
});

test('equal-timestamp conflicting quotes stay unresolved and retain both sources', () => {
  const base=prices[1];
  const result=select([base,{...base,id:'conflicting',amountMinor:12999}]);
  assert.equal(result.conflict,true);
  assert.equal(result.observation,null);
  assert.equal(result.history.length,2);
  assert.equal(select([base,{...base,id:'matching'}]).conflict,false);
});
