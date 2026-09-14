import type { Card, Provenance } from '../../src/types/catalog.ts';

export type ImportRow = { cardNumber: string; playerName: string; country: string; subset: string; locator: string };
export type ImportSource = { id: string; sourceName: string; sourceUrl: string; checkedAt: string; retrievedAt: string; sha256: string | null; extract: string; extractSha256: string; complete: boolean; authority: string };
export type Resolution = { id: string; cardNumber: string; field: 'playerName' | 'country'; observed: Record<string, string>; value: string; status: 'RESOLVED' | 'UNRESOLVED'; rationale: string; evidenceSourceIds: string[]; checkedAt: string };
export type Manifest = { schemaVersion: 1; releaseId: string; subset: string; idPrefix: string; expectedCount: number; checkedAt: string; reviewStatus: 'REVIEWED' | 'CANDIDATE'; sources: ImportSource[]; output: string };
export type LegacyIdentity = { id: string; cardNumber: string; playerName: string; country: string };
export type ImportBundle = { manifest: Manifest; extracts: Record<string, ImportRow[]>; resolutions: Resolution[]; legacy: LegacyIdentity[] };

export function normalizeText(value: string): string {
  if (typeof value !== 'string') throw new Error('Expected text');
  return value.normalize('NFC').replace(/\s+/gu, ' ').trim();
}
function requireText(value: string, label: string): string {
  const text = normalizeText(value);
  if (!text || /\uFFFD/u.test(text)) throw new Error('Missing or damaged ' + label);
  return text;
}
function date(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().slice(0, 10) === value;
}
const fields = ['playerName', 'country'] as const;

// Pure, release-independent validation/promotion. No network, storage or UI access.
export function normalizeChecklist({ manifest: m, extracts, resolutions, legacy }: ImportBundle): readonly Card[] {
  if (m.schemaVersion !== 1 || m.reviewStatus !== 'REVIEWED') throw new Error('Import requires explicit review');
  if (!Number.isSafeInteger(m.expectedCount) || m.expectedCount < 1 || !date(m.checkedAt)) throw new Error('Invalid coverage/date');
  requireText(m.releaseId, 'release'); requireText(m.idPrefix, 'identity prefix'); requireText(m.subset, 'subset');
  if (new Set(m.sources.map(s => s.id)).size !== m.sources.length) throw new Error('Duplicate source ID');
  if (m.sources.filter(s => s.complete).length < 2) throw new Error('Two complete sources required');
  const sourceRows = new Map<string, Map<string, ImportRow>>();
  for (const source of m.sources) {
    if (!date(source.checkedAt) || !Number.isFinite(Date.parse(source.retrievedAt)) || !/^https:\/\//.test(source.sourceUrl)) throw new Error('Invalid source provenance');
    requireText(source.sourceName, 'source name'); requireText(source.id, 'source ID');
    const rows = extracts[source.id];
    if (!Array.isArray(rows) || !rows.length) throw new Error('Missing source extract');
    const indexed = new Map<string, ImportRow>();
    for (const raw of rows) {
      const row = { ...raw, cardNumber: normalizeText(raw.cardNumber), subset: normalizeText(raw.subset), playerName: requireText(raw.playerName, 'player name'), country: requireText(raw.country, 'country'), locator: requireText(raw.locator, 'locator') };
      if (!/^[1-9]\d*$/.test(row.cardNumber) || Number(row.cardNumber) > m.expectedCount) throw new Error('Invalid base card number');
      if (row.subset !== m.subset) throw new Error('Non-base subset in extract');
      if (indexed.has(row.cardNumber)) throw new Error('Duplicate card number');
      indexed.set(row.cardNumber, row);
    }
    if (source.complete && indexed.size !== m.expectedCount) throw new Error('Incomplete base source');
    sourceRows.set(source.id, indexed);
  }
  if (new Set(resolutions.map(r => r.id)).size !== resolutions.length) throw new Error('Duplicate resolution ID');
  const used = new Set<string>();
  const cards: Card[] = [];
  for (let n = 1; n <= m.expectedCount; n++) {
    const number = String(n);
    const observations = m.sources.flatMap(source => { const row = sourceRows.get(source.id)!.get(number); return row ? [{ source, row }] : []; });
    const values: Record<string, string> = {};
    const discrepancyIds: string[] = [];
    for (const field of fields) {
      const observed = Object.fromEntries(observations.map(o => [o.source.id, o.row[field]]));
      const different = new Set(Object.values(observed)).size > 1;
      const matches = resolutions.filter(r => r.cardNumber === number && r.field === field);
      if (!different && matches.length) throw new Error('Stale resolution');
      if (different) {
        if (matches.length !== 1) throw new Error('Unresolved discrepancy: #' + number + ' ' + field);
        const r = matches[0];
        if (r.status !== 'RESOLVED' || !date(r.checkedAt) || !normalizeText(r.rationale)) throw new Error('Unresolved discrepancy');
        if (JSON.stringify(Object.entries(observed).sort()) !== JSON.stringify(Object.entries(r.observed).sort())) throw new Error('Resolution evidence changed');
        if (r.evidenceSourceIds.length < 2 || new Set(r.evidenceSourceIds).size !== r.evidenceSourceIds.length || r.evidenceSourceIds.some(id => !(id in observed))) throw new Error('Resolution missing corroboration');
        if (!Object.values(observed).includes(r.value)) throw new Error('Unsupported resolution value');
        values[field] = requireText(r.value, field); used.add(r.id); discrepancyIds.push(r.id);
      } else values[field] = observations[0].row[field];
    }
    const provenance: Provenance[] = observations.map(({ source, row }) => ({
      sourceId: source.id, sourceName: source.sourceName, sourceUrl: source.sourceUrl, checkedAt: source.checkedAt,
      verificationState: 'VERIFIED', locator: row.locator,
      scope: 'Base checklist identity; source wording and reviewed differences retained in import ledger. Excludes variations and configuration eligibility.',
    }));
    cards.push({ id: m.idPrefix + number, releaseId: m.releaseId, cardNumber: number, playerName: values.playerName, country: values.country, subset: m.subset, sortOrder: n,
      verificationState: 'VERIFIED', checkedAt: m.checkedAt, discrepancyIds, provenance,
      image: { assetUrl: null, sourceUrl: null, matchStatus: 'MISSING', usageStatus: 'UNKNOWN_RIGHTS' } });
  }
  if (used.size !== resolutions.length) throw new Error('Unused resolution');
  if (new Set(cards.map(c => c.id)).size !== m.expectedCount) throw new Error('Duplicate stable IDs');
  for (const old of legacy) {
    const card = cards.find(c => c.cardNumber === old.cardNumber);
    if (!card || card.id !== old.id || card.playerName !== old.playerName || card.country !== old.country) throw new Error('Legacy identity changed');
  }
  return cards;
}

export function serializeChecklist(cards: readonly Card[]): string {
  // Shared provenance objects avoid repeating long source descriptions in the fixture.
  const sources: Record<string, Omit<Provenance, 'locator'>> = {};
  for (const card of cards) for (const { locator, ...source } of card.provenance) { void locator; sources[source.sourceId!] = source; }
  const rows = cards.map(({ provenance, image, ...card }) => { void image; return { ...card, references: provenance.map(p => [p.sourceId, p.locator]) }; });
  return `// Generated by scripts/checklists/generate.ts. Do not edit; replay the reviewed import.\nimport type { Card, Provenance } from '../../../types/catalog.ts';\nconst sources: Record<string, Provenance> = ${JSON.stringify(sources, null, 2)};\nconst rows = [\n${rows.map(r => '  ' + JSON.stringify(r) + ',').join('\n')}\n] as const;\nexport const cards: readonly Card[] = rows.map(({ references, ...card }) => ({ ...card,\n  provenance: references.map(([id, locator]) => ({ ...sources[id], locator })),\n  image: { assetUrl: null, sourceUrl: null, matchStatus: 'MISSING', usageStatus: 'UNKNOWN_RIGHTS' },\n}));\n`;
}
