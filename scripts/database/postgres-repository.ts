import type pg from 'pg';
import type {CatalogueDataRepository} from '../../src/types/publication.ts';
import {tableNames,orderedTables} from './tables.ts';
import {inflate,type Tables} from './records.ts';
// One batched query under the caller's consistent transaction; no per-card requests.
export async function readTables(client:pg.Client):Promise<Tables>{
 const query=tableNames.map(name=>
  "SELECT '"+name+"' AS name, COALESCE(jsonb_agg(to_jsonb(t) ORDER BY "+(orderedTables.has(name)?'position':'to_jsonb(t)::text')+"),'[]'::jsonb) AS rows FROM catalogue."+name+' t'
 ).join(' UNION ALL ');
 const result=await client.query(query);
 return Object.fromEntries(result.rows.map(({name,rows})=>[name,rows.map((r:Record<string,unknown>)=>{
  if(typeof r.observedAt==='string')r.observedAt=new Date(r.observedAt).toISOString();
  return r;
 })]));
}
export function postgresRepository(client:pg.Client):CatalogueDataRepository{return {async read(){return inflate(await readTables(client));}};}
