import { publication } from '../data/published/catalogue.ts';
import type { BrowseData, ChecklistEntry } from '../types/variants.ts';
import { cardImageRepository } from './card-image-repository.ts';
import { buildCatalogueIndex } from './catalogue-index.ts';

const variantData = publication.data;
const index = buildCatalogueIndex(variantData);

export const releaseEntries: readonly ChecklistEntry[] = variantData.entries;

export const variantRepository = {
  listEntries: (releaseId: string) => index.entriesByRelease.get(releaseId) ?? [],

  browse(releaseId: string): BrowseData {
    const entries = (index.entriesByRelease.get(releaseId) ?? []).map(
      ({ id, releaseId: entryReleaseId, cardNumber, playerName, country, subset, entryType, sortOrder }) => ({
        id,
        releaseId: entryReleaseId,
        cardNumber,
        playerName,
        country,
        subset,
        entryType,
        sortOrder,
      }),
    );

    const variants = (index.variantsByRelease.get(releaseId) ?? []).map(
      ({ id, entryId, parallelName, isDefault, numbering, serialTotal }) => ({
        id,
        entryId,
        parallelName,
        isDefault,
        numbering,
        serialTotal,
      }),
    );

    const eligibility = (index.eligibilityByRelease.get(releaseId) ?? []).map(
      ({ configurationId, variantId, status, confidence }) => ({
        configurationId,
        variantId,
        status,
        confidence,
      }),
    );

    return {
      entries,
      variants,
      configurations: index.configurationsByRelease.get(releaseId) ?? [],
      eligibility,
    };
  },

  images(releaseId: string) {
    return Object.fromEntries(
      (index.variantsByRelease.get(releaseId) ?? []).flatMap((variant) => {
        const entry = index.entryById.get(variant.entryId);
        const image =
          cardImageRepository.findPrimary(variant.entryId, variant.id) ??
          (variant.isDefault && entry?.entryType === 'BASE'
            ? cardImageRepository.findPrimary(variant.entryId)
            : null);

        return image ? [[variant.id, image]] : [];
      }),
    );
  },

  sources: variantData.sources,
};
