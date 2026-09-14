import type { ImageManifest, ImageAsset } from '../../src/types/images.ts';
import { approvedForPublication } from '../../src/domain/catalog/images.ts';
export type ImageTarget = Readonly<{ id: string; releaseId: string; variantIds?: readonly string[] }>;
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected image object');
  return value as Record<string, unknown>;
}
function text(value: unknown): string {
  if (typeof value !== 'string' || !value.trim() || value.includes('\uFFFD')) throw new Error('Missing image text');
  return value.normalize('NFC').trim();
}
function id(value: unknown): string { const v = text(value); if (!/^[a-z0-9][a-z0-9-]*$/.test(v)) throw new Error('Invalid image identifier'); return v; }
function date(value: unknown): string {
  const v = text(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || !Number.isFinite(Date.parse(v)) || new Date(v).toISOString().slice(0,10) !== v) throw new Error('Invalid image date');
  return v;
}
function url(value: unknown): string { const v = text(value); const u = new URL(v); if (u.protocol !== 'https:' || u.username || u.password) throw new Error('Expected public HTTPS provenance URL'); return v; }
function choice<T extends string>(value: unknown, choices: readonly T[]): T { if (!choices.includes(value as T)) throw new Error('Invalid image state'); return value as T; }
function bool(value: unknown): boolean { if (typeof value !== 'boolean') throw new Error('Expected explicit boolean'); return value; }
function nullable<T>(value: unknown, parse: (v: unknown) => T): T | null { return value === null ? null : parse(value); }
function dimension(value: unknown): number { if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1 || value > 8192) throw new Error('Invalid dimensions'); return value; }

// Parse an unknown JSON boundary explicitly; discard unrecognized fields from normalized output.
export function validateImageManifest(input: unknown, targets: readonly ImageTarget[]): ImageManifest {
  const m = object(input);
  if (m.schemaVersion !== 1 || !Array.isArray(m.assets)) throw new Error('Unsupported image manifest');
  const releaseId = id(m.releaseId);
  if (!targets.some(t => t.releaseId === releaseId)) throw new Error('Unknown image release');
  const ids = new Set<string>(); const primaries = new Set<string>();
  const assets: ImageAsset[] = m.assets.map(raw => {
    const a = object(raw); const rights = a.rights === null ? null : object(a.rights); const source = a.input === null ? null : object(a.input);
    const normalized: ImageAsset = {
      id: id(a.id), releaseId: id(a.releaseId), cardId: id(a.cardId), variantId: nullable(a.variantId,id),
      side: choice(a.side,['FRONT','BACK']), sourceName: text(a.sourceName), sourceUrl: url(a.sourceUrl), originalUrl: nullable(a.originalUrl,url), checkedAt: date(a.checkedAt),
      matchStatus: choice(a.matchStatus,['CANDIDATE','REVIEWED','VERIFIED','MISSING']), matchRationale: text(a.matchRationale),
      usageStatus: choice(a.usageStatus,['INTERNAL_REFERENCE','PUBLIC_ALLOWED','USER_SUBMITTED','OWNED_ASSET','UNKNOWN_RIGHTS']), rightsRationale: text(a.rightsRationale),
      approvalStatus: choice(a.approvalStatus,['PENDING','APPROVED','REJECTED','WITHDRAWN']), reviewedBy: nullable(a.reviewedBy,text), reviewedAt: nullable(a.reviewedAt,date), isPrimary: bool(a.isPrimary),
      rights: rights ? {evidenceUrl:url(rights.evidenceUrl),publicWeb:bool(rights.publicWeb),derivatives:bool(rights.derivatives),repositoryDistribution:bool(rights.repositoryDistribution),expiresAt:nullable(rights.expiresAt,date)} : null,
      credit: nullable(a.credit,text), input: source ? {file:text(source.file),sha256:text(source.sha256)} : null,
      width: nullable(a.width,dimension), height: nullable(a.height,dimension), format: nullable(a.format,v=>choice(v,['jpeg','png','webp','avif'])),
    };
    const target = targets.find(t => t.id === normalized.cardId && t.releaseId === releaseId);
    if (normalized.releaseId !== releaseId || !target || (normalized.variantId !== null && !target.variantIds?.includes(normalized.variantId))) throw new Error('Image target mismatch');
    if (ids.has(normalized.id)) throw new Error('Duplicate image ID'); ids.add(normalized.id);
    if (normalized.input && (!/^[a-f0-9]{64}$/.test(normalized.input.sha256) || !/^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp|avif)$/.test(normalized.input.file))) throw new Error('Unsafe image input');
    if (normalized.reviewedAt && normalized.reviewedAt < normalized.checkedAt) throw new Error('Review predates observation');
    if (normalized.approvalStatus === 'APPROVED' && (!approvedForPublication(normalized) || !normalized.input)) throw new Error('Approved image lacks match, rights or input');
    if (normalized.isPrimary) {
      if (!approvedForPublication(normalized)) throw new Error('Unapproved primary image');
      const key = JSON.stringify([normalized.cardId,normalized.variantId,normalized.side]);
      if (primaries.has(key)) throw new Error('Conflicting primary images'); primaries.add(key);
    }
    return normalized;
  });
  assets.sort((a,b)=>a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  return {schemaVersion:1,releaseId,assets};
}
