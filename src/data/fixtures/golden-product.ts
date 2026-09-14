import type { ConfigurationEligibility, Product } from '../../types/catalog.ts';
import { configurationEvidence, configurationIntelligence } from './golden-product-configuration.ts';

import { cards as goldenCards } from './generated/golden-product-base.ts';
export { goldenCards };
export const checklistSources = goldenCards[0].provenance;
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
export const goldenEligibility: readonly ConfigurationEligibility[] = goldenCards.map(card => ({
  configurationId: goldenProduct.configuration.id, cardId: card.id, status: 'UNKNOWN', provenance: [],
}));
