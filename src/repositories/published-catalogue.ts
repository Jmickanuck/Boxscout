import { publication } from '../data/published/catalogue.ts';
import { buildCatalogueIndex } from './catalogue-index.ts';

/** Shared server-side publication projection and indexes. */
export const catalogueData = publication.data;
export const catalogueIndex = buildCatalogueIndex(catalogueData);
