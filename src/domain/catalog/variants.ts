import type { BrowseData, BrowseEntry, BrowseVariant, Confidence } from '../../types/variants.ts';
import type { CollectionState } from '../collection.ts';
import { megaVersionIds } from './box-families.ts';

export type VariantFilters = {
  query: string;
  type: string;
  edition: string;
  maximum: string;
  country: string;
  subset: string;
  configuration: string;
  probable: boolean;
  owned: boolean;
  watched: boolean;
};

export const defaultVariantFilters: VariantFilters = {
  query: '',
  type: 'BASE',
  edition: 'DEFAULT',
  maximum: '',
  country: '',
  subset: '',
  configuration: '',
  probable: false,
  owned: false,
  watched: false,
};

type EligibilityClaim = BrowseData['eligibility'][number];

type FilterIndex = {
  entries: Map<string, BrowseEntry>;
  eligibilityByVariant: Map<string, EligibilityClaim[]>;
  configurationById: Map<string, BrowseData['configurations'][number]>;
  parallelSearchNames: readonly string[];
};

const filterIndexCache = new WeakMap<BrowseData, FilterIndex>();

function filterIndex(data: BrowseData): FilterIndex {
  const cached = filterIndexCache.get(data);
  if (cached) return cached;

  const eligibilityByVariant = new Map<string, EligibilityClaim[]>();
  for (const claim of data.eligibility) {
    const current = eligibilityByVariant.get(claim.variantId);
    if (current) current.push(claim);
    else eligibilityByVariant.set(claim.variantId, [claim]);
  }

  const index: FilterIndex = {
    entries: new Map(data.entries.map((entry) => [entry.id, entry])),
    eligibilityByVariant,
    configurationById: new Map(data.configurations.map((configuration) => [configuration.id, configuration])),
    parallelSearchNames: data.variants
      .filter((variant) => !variant.isDefault)
      .map((variant) => variant.parallelName.toLocaleLowerCase()),
  };

  filterIndexCache.set(data, index);
  return index;
}

function assessEligibilityClaims(
  claims: readonly EligibilityClaim[],
  configured: BrowseData['configurations'][number] | undefined,
  isMastermind: boolean,
): { status: string; confidence: Confidence } {
  if (!claims.length) return { status: 'UNKNOWN', confidence: 'UNKNOWN' };

  const statuses = new Set(claims.map((claim) => claim.status));
  if (statuses.size !== 1 || statuses.has('CONFLICTING')) {
    return { status: 'CONFLICTING', confidence: 'UNKNOWN' };
  }

  let confidence: Confidence = claims.every((claim) => claim.confidence === 'VERIFIED')
    ? 'VERIFIED'
    : claims.some((claim) => claim.confidence === 'UNKNOWN')
      ? 'UNKNOWN'
      : 'PROBABLE';

  if (!configured || configured.confidence === 'UNKNOWN') confidence = 'UNKNOWN';
  else if (configured.confidence === 'PROBABLE' && confidence === 'VERIFIED') confidence = 'PROBABLE';

  if (isMastermind && confidence === 'VERIFIED') confidence = 'PROBABLE';
  return { status: claims[0].status, confidence };
}

export function eligibilityAssessment(
  data: BrowseData,
  variantId: string,
  configuration: string,
): { status: string; confidence: Confidence } {
  const resolvedConfiguration = configuration === 'mastermind' ? 'npp-mega' : configuration;
  const index = filterIndex(data);
  const claims = (index.eligibilityByVariant.get(variantId) ?? []).filter(
    (claim) => claim.configurationId === resolvedConfiguration,
  );

  return assessEligibilityClaims(
    claims,
    index.configurationById.get(resolvedConfiguration),
    configuration === 'mastermind',
  );
}

export function filterVariants(
  data: BrowseData,
  filters: VariantFilters,
  collection: CollectionState = {},
) {
  const index = filterIndex(data);
  const q = filters.query.trim().toLocaleLowerCase().replace(/^#/, '');
  const parallelSearch = !!q && index.parallelSearchNames.some((name) => name.includes(q));
  const exact =
    filters.edition !== 'DEFAULT' ||
    !!filters.maximum ||
    parallelSearch ||
    filters.type === 'AUTOGRAPH' ||
    filters.owned ||
    filters.watched;

  const allowed = new Set<string>();
  if (filters.configuration) {
    const configurations = filters.configuration === 'mega' ? megaVersionIds : [filters.configuration];

    for (const [variantId, allClaims] of index.eligibilityByVariant) {
      if (
        configurations.some((configuration) => {
          const resolvedConfiguration = configuration === 'mastermind' ? 'npp-mega' : configuration;
          const claims = allClaims.filter((claim) => claim.configurationId === resolvedConfiguration);
          const assessment = assessEligibilityClaims(
            claims,
            index.configurationById.get(resolvedConfiguration),
            configuration === 'mastermind',
          );
          return (
            assessment.status === 'INCLUDED' &&
            (assessment.confidence === 'VERIFIED' ||
              (filters.probable && assessment.confidence === 'PROBABLE'))
          );
        })
      ) {
        allowed.add(variantId);
      }
    }
  }

  const results: { entry: BrowseEntry; variant: BrowseVariant; group: string }[] = [];

  for (const variant of data.variants) {
    const entry = index.entries.get(variant.entryId);
    if (!entry) continue;
    if ((!exact && !variant.isDefault) || (filters.edition === 'PARALLEL' && variant.isDefault)) continue;
    if (filters.type !== 'ALL' && entry.entryType !== filters.type) continue;
    if (filters.country && entry.country !== filters.country) continue;
    if (filters.subset && entry.subset !== filters.subset) continue;
    if (
      filters.maximum &&
      (variant.numbering !== 'NUMBERED' ||
        variant.serialTotal === null ||
        variant.serialTotal > Number(filters.maximum))
    ) {
      continue;
    }
    if (filters.edition === 'NUMBERED' && variant.numbering !== 'NUMBERED') continue;
    if (
      q &&
      !`${entry.playerName} ${entry.cardNumber} ${entry.country} ${entry.subset} ${variant.parallelName}`
        .toLocaleLowerCase()
        .includes(q)
    ) {
      continue;
    }
    if (filters.owned && !collection[variant.id]?.owned) continue;
    if (filters.watched && !collection[variant.id]?.watched) continue;
    if (filters.configuration && !allowed.has(variant.id)) continue;

    const group =
      entry.subset +
      ' · ' +
      variant.parallelName +
      (variant.serialTotal !== null ? ' /' + variant.serialTotal : '');
    results.push({ entry, variant, group });
  }

  results.sort(
    (a, b) =>
      a.group.localeCompare(b.group) ||
      a.entry.sortOrder - b.entry.sortOrder ||
      a.variant.id.localeCompare(b.variant.id),
  );

  return { results, exact };
}
