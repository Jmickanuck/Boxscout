import type { AssessmentStatus, BoxContentClaim, ClaimSubject, ConfigurationIntelligence, SourceEvidence, SourceKind } from '../../types/catalog.ts';

const sourcePriority: Record<SourceKind, number> = { PANINI_OFFICIAL: 1, OFFICIAL_SELL_SHEET: 2, EXACT_RETAILER: 3, SECONDARY: 4 };
const statusPriority: Record<AssessmentStatus, number> = { UNKNOWN: 0, PROBABLE: 1, VERIFIED: 2 };
export function rankSources(sources: readonly SourceEvidence[]): readonly SourceEvidence[] {
  return sources.toSorted((a,b) => sourcePriority[a.sourceKind] - sourcePriority[b.sourceKind]);
}
export function validUpc(value: string): boolean {
  if (!/^\d{12}$/.test(value)) return false;
  return [...value].reduce((sum,digit,index) => sum + Number(digit) * (index % 2 === 0 ? 3 : 1),0) % 10 === 0;
}
function reviewed(source: SourceEvidence | undefined): source is SourceEvidence {
  return !!source && ['REVIEWED','VERIFIED'].includes(source.verificationState);
}
function validListing(intel: ConfigurationIntelligence): boolean {
  return validUpc(intel.listing.reportedUpc.value) && intel.listing.reportedUpc.evidenceIds.some(id =>
    intel.evidence.some(source => source.id === id && source.sourceKind === 'EXACT_RETAILER' && source.verificationState === 'VERIFIED')
  );
}
export function assessNppMapping(intel: ConfigurationIntelligence): AssessmentStatus {
  if (!validListing(intel)) return 'UNKNOWN';
  const contradictoryLink = intel.links.some(link => link.upc === intel.listing.reportedUpc.value && link.family !== intel.assessment.family && link.linkKind === 'EXPLICIT_UPC_FAMILY' && reviewed(intel.evidence.find(source => source.id === link.evidenceId)));
  if (contradictoryLink) return 'UNKNOWN';
  const links = intel.links.filter(link => link.family === intel.assessment.family && link.upc === intel.listing.reportedUpc.value && link.linkKind === 'EXPLICIT_UPC_FAMILY');
  let ceiling: AssessmentStatus = 'UNKNOWN';
  for (const link of links) {
    const source = intel.evidence.find(item => item.id === link.evidenceId);
    if (!reviewed(source)) continue;
    const authoritative = ['PANINI_OFFICIAL','OFFICIAL_SELL_SHEET'].includes(source.sourceKind) && source.verificationState === 'VERIFIED';
    if (authoritative) ceiling = 'VERIFIED';
    else if (source.sourceKind === 'EXACT_RETAILER' && ceiling === 'UNKNOWN') ceiling = 'PROBABLE';
  }
  // Evidence sets a ceiling; only an explicit reviewed decision can promote the assessment.
  return statusPriority[intel.assessment.reviewedStatus] <= statusPriority[ceiling] ? intel.assessment.reviewedStatus : ceiling;
}
export function mappingLabel(status: AssessmentStatus): string {
  return status === 'VERIFIED' ? 'NPP mapping verified' : status === 'PROBABLE' ? 'NPP mapping probable' : 'Configuration unverified';
}
function matches(subject: ClaimSubject, intel: ConfigurationIntelligence): boolean {
  return subject.scope === 'MATCHING_UPC' ? validListing(intel) && subject.value === intel.listing.reportedUpc.value : subject.value === intel.assessment.family && assessNppMapping(intel) !== 'UNKNOWN';
}
export function claimText(claim: BoxContentClaim): string {
  const quantity = claim.quantity === null ? '' : claim.quantity + ' ';
  const included = claim.includes.length ? ' (including ' + claim.includes.map(item => item.quantity + ' ' + item.item).join(', ') + ')' : '';
  const wording = claim.claimSemantics === 'PER_BOX_AVERAGE' ? ' — per box, on average' :
    claim.claimSemantics === 'GUARANTEED' ? ' — source uses guarantee wording' :
    claim.claimSemantics === 'POSSIBLE' ? ' — possible, not promised' :
    claim.claimSemantics === 'PUBLISHED_ODDS' ? ' — published odds: ' + (claim.publishedOdds ?? 'unknown') : ' — semantics unknown';
  return quantity + claim.item + included + wording;
}
export function buildConfigurationOverview(intel: ConfigurationIntelligence) {
  const sources = rankSources(intel.evidence);
  const claims = intel.claims.filter(claim => matches(claim.subject,intel) && reviewed(sources.find(source => source.id === claim.evidenceId)));
  const specs = intel.specifications.filter(spec => matches(spec.subject,intel) && reviewed(sources.find(source => source.id === spec.evidenceId)) &&
    Number.isSafeInteger(spec.packsPerBox) && spec.packsPerBox > 0 && Number.isSafeInteger(spec.cardsPerPack) && spec.cardsPerPack > 0 &&
    (spec.statedCardsPerBox === null || spec.statedCardsPerBox === spec.packsPerBox * spec.cardsPerPack));
  const specConflict = new Set(specs.map(spec => spec.packsPerBox + ':' + spec.cardsPerPack)).size > 1;
  const specification = specConflict ? null : specs.toSorted((a,b) => sources.findIndex(source => source.id === a.evidenceId) - sources.findIndex(source => source.id === b.evidenceId))[0] ?? null;
  return {
    listing: intel.listing, status: assessNppMapping(intel), rationale: intel.assessment.rationale, gaps: intel.assessment.gaps,
    sources, specification, specConflict,
    // Conservative headline: source-specific retailer averages, never the stronger family promise.
    averages: claims.filter(claim => claim.subject.scope === 'MATCHING_UPC' && claim.claimSemantics === 'PER_BOX_AVERAGE' && claim.includes.length === 0),
    claims,
    hasClaimConflict: claims.some(claim => claim.conflictIds.some(id => claims.some(other => other.id === id && other.claimSemantics !== claim.claimSemantics))),
  };
}
