import type { Card, ConfigurationEligibility, Product, Provenance } from '../../types/catalog.ts';
import { configurationEvidence, configurationIntelligence } from './golden-product-configuration.ts';

export const checklistSources: readonly Provenance[] = [
  { sourceName: 'Trading Card Database', sourceUrl: 'https://www.tcdb.com/Checklist.cfm/sid/614170/2026-Panini-Prizm-FIFA-World-Cup', checkedAt: '2026-09-14', verificationState: 'VERIFIED', scope: 'Release identity and base checklist numbers 1–24: player and country. Excludes variations and configuration eligibility.' },
  { sourceName: 'Checklist Insider', sourceUrl: 'https://www.checklistinsider.com/2026-panini-prizm-fifa-world-cup-soccer', checkedAt: '2026-09-14', verificationState: 'VERIFIED', scope: 'Cross-check of release identity and base checklist numbers 1–24: player and country. Excludes variations and configuration eligibility.' },
];
const releaseId = 'panini-prizm-fifa-world-cup-2026';
export const goldenProduct: Product = {
  id: 'golden-product-1', slug: '2026-panini-prizm-world-cup-mega',
  release: { id: releaseId, name: '2026 Panini Prizm FIFA World Cup', year: 2026, manufacturer: 'Panini', provenance: [configurationEvidence[0]] },
  configuration: {
    id: 'mastermind-mega-unresolved', releaseId, name: 'Mega Box', sku: null, upc: null,
    identificationStatus: 'UNKNOWN', nppMappingStatus: configurationIntelligence.assessment.reviewedStatus, packsPerBox: null, cardsPerPack: null,
    provenance: [],
  },
};
// Manually reviewed base identities only. No variations, inferred eligibility or imagery.
const rows: readonly (readonly [number, string, string])[] = [
  [1, 'Julian Alvarez', 'Argentina'], [2, 'Emiliano Martinez', 'Argentina'],
  [3, 'Enzo Fernandez', 'Argentina'], [4, 'Nico Paz', 'Argentina'],
  [5, 'Cristian Romero', 'Argentina'], [6, 'Joaquin Panichelli', 'Argentina'],
  [7, 'Leandro Paredes', 'Argentina'], [8, 'Nahuel Molina', 'Argentina'],
  [9, 'Lautaro Martinez', 'Argentina'], [10, 'Lionel Messi', 'Argentina'],
  [11, 'Thiago Almada', 'Argentina'], [12, 'Nicolas Otamendi', 'Argentina'],
  [13, 'Giuliano Simeone', 'Argentina'], [14, 'Rodrigo de Paul', 'Argentina'],
  [15, 'Alexis Mac Allister', 'Argentina'], [16, 'Nico Gonzalez', 'Argentina'],
  [17, 'Gianluca Prestianni', 'Argentina'], [18, 'Nicolas Tagliafico', 'Argentina'],
  [19, 'Jose Manuel Lopez', 'Argentina'], [20, 'Franco Mastantuono', 'Argentina'],
  [21, 'Diego Maradona', 'Argentina'], [22, 'William Saliba', 'France'],
  [23, 'Eduardo Camavinga', 'France'], [24, 'Rayan Cherki', 'France'],
];
export const goldenCards: readonly Card[] = rows.map(([number, playerName, country]) => ({
  id: releaseId + '-base-' + number, releaseId, cardNumber: String(number), playerName, country,
  subset: 'Base', sortOrder: number, provenance: checklistSources,
  image: { assetUrl: null, sourceUrl: null, matchStatus: 'MISSING', usageStatus: 'UNKNOWN_RIGHTS' },
}));
export const goldenEligibility: readonly ConfigurationEligibility[] = goldenCards.map(card => ({
  configurationId: goldenProduct.configuration.id, cardId: card.id, status: 'UNKNOWN', provenance: [],
}));
