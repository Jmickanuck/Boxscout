import type {ReleaseConfiguration} from '../../types/variants.ts';
export const megaVersionIds=['npp-mega','excell-mega','dsg-mega','hobby-mega'];
export const versionLabel=(id:string)=>({'npp-mega':'Retail · Red Disco','excell-mega':'Target · Teal / White Disco','dsg-mega':"Dick’s · Bronze / Green & White Disco",'hobby-mega':'Hobby · Blue / Pink Disco'}[id]??id);
export function boxFamilies(configurations:readonly ReleaseConfiguration[]){
 const mega=configurations.filter(c=>megaVersionIds.includes(c.id));
 return [...(mega.length?[{id:'mega',name:'Mega Box',versions:mega}]:[]),...configurations.filter(c=>!megaVersionIds.includes(c.id)).map(c=>({id:c.id,name:c.name,versions:[c]}))];
}

// Reviewed comparison: Collectosk product guide; retailer URLs verified during Plan 009.
export const megaComparison=[['npp-mega','Purple /355 · Orange /299 · Fuchsia /199 · Red /99 · Green /5',null],['excell-mega','Teal /149 · White /20','https://www.target.com/p/panini-prizm-fifa-world-cup-2026-soccer-trading-card-mega-box/-/A-95267129'],['dsg-mega','Bronze /175 · Green & White /70','https://www.dickssportinggoods.com/p/panini-america-2026-prizm-fifa-world-cup-mega-box-26panufangfflg26prdco/26panufangfflg26prdco'],['hobby-mega','Blue /49 · Pink /25','https://jpsports.net/products/2026-panini-prizm-fifa-world-cup-soccer-hobby-mega-box']];
