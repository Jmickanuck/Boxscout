import type pg from 'pg';
import type {CatalogueData} from '../../src/types/publication.ts';
import {digest,flatten,stable,assertParity,type Tables} from './records.ts';
import {tableNames} from './tables.ts';
import {postgresRepository} from './postgres-repository.ts';
import {validateCatalogue} from './validate.ts';
export function additions(before:CatalogueData,after:CatalogueData):Tables {
 validateCatalogue(after);const a=flatten(before),b=flatten(after),out:Tables={};
 for(const name of tableNames){
  const records=new Set(b[name].map(stable));
  if(a[name].some(row=>!records.has(stable(row))))throw new Error('Additive import cannot remove, reorder or modify '+name);
  const previous=new Set(a[name].map(stable));out[name]=b[name].filter(row=>!previous.has(stable(row)));
 }
 return out;
}
export async function appendCatalogue(c:pg.Client,data:CatalogueData,baseline:string,reviewedBy:string){
 if(!reviewedBy.trim()||!/^([a-f0-9]{64})$/.test(baseline))throw new Error('Explicit baseline digest and review attribution required');
 const revision=digest(data);await c.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
 try{
  await c.query('SELECT pg_advisory_xact_lock(6006001)');
  const current=await postgresRepository(c).read();
  if(digest(current)===revision){await c.query('ROLLBACK');return {revision,unchanged:true};}
  if(digest(current)!==baseline)throw new Error('Baseline changed; review current catalogue before import');
  const tables=additions(current,data);
  for(const name of tableNames)if(tables[name].length)await c.query('INSERT INTO catalogue.'+name+' SELECT * FROM jsonb_populate_recordset(NULL::catalogue.'+name+', $1::jsonb)',[JSON.stringify(tables[name])]);
  await c.query('SET CONSTRAINTS ALL IMMEDIATE');await c.query('SELECT catalogue.validate_graph()');
  assertParity(data,await postgresRepository(c).read());
  await c.query('INSERT INTO catalogue.imports(digest,"reviewedBy") VALUES($1,$2)',[revision,reviewedBy]);
  await c.query('COMMIT');return {revision,unchanged:false};
 }catch(e){await c.query('ROLLBACK');throw e;}
}
