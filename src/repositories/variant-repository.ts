import type { BrowseData, ChecklistEntry } from '../types/variants.ts';
import { cardImageRepository } from './card-image-repository.ts';
import { catalogueData, catalogueIndex } from './published-catalogue.ts';

export const releaseEntries: readonly ChecklistEntry[] = catalogueData.entries;

export const variantRepository = {
  listEntries: (releaseId: string) => catalogueIndex.entriesByRelease.get(releaseId) ?? [],

  browse(releaseId: string): BrowseData {
    const entries = (catalogueIndex.entriesByRelease.get(releaseId) ?? []).map(
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

    const variants = (catalogueIndex.variantsByRelease.get(releaseId) ?? []).map(
      ({ id, entryId, parallelName, isDefault, numbering, serialTotal }) => ({
        id,
        entryId,
        parallelName,
        isDefault,
        numbering,
        serialTotal,
      }),
    );

    const eligibility = (catalogueIndex.eligibilityByRelease.get(releaseId) ?? []).map(
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
      configurations: catalogueIndex.configurationsByRelease.get(releaseId) ?? [],
      eligibility,
    };
  },

  images(releaseId: string) {
    return Object.fromEntries(
      (catalogueIndex.variantsByRelease.get(releaseId) ?? []).flatMap((variant) => {
        const entry = catalogueIndex.entryById.get(variant.entryId);
        const image =
          cardImageRepository.findPrimary(variant.entryId, variant.id) ??
          (variant.isDefault && entry?.entryType === 'BASE'
            ? cardImageRepository.findPrimary(variant.entryId)
            : null);

        return image ? [[variant.id, image]] : [];
      }),
    );
  },

  sources: catalogueData.sources,
};
