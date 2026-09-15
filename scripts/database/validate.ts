import { validateVariantData } from '../checklists/variants.ts';
import type {CatalogueData} from '../../src/types/publication.ts';
export function validateCatalogue(data:CatalogueData){
 const base=data.entries.filter(e=>e.entryType==='BASE');
 validateVariantData({...data,entries:data.entries.filter(e=>e.entryType!=='BASE')},base);
 for(const e of data.entries){if(!e.id||!e.playerName.trim()||!e.provenance.length||e.provenance.some(p=>!p.sourceUrl||!p.checkedAt))throw new Error('Missing entry identity/provenance');}
 for(const p of data.products){if(!p.release||!p.configuration||p.configuration.releaseId!==p.release.id)throw new Error('Invalid product release');}
 for(const p of data.prices){if(!Number.isInteger(p.amountMinor)||p.amountMinor<0||!p.provenance.sourceUrl||!Number.isFinite(Date.parse(p.observedAt)))throw new Error('Invalid price observation');}
}
