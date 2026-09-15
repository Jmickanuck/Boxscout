import {readFileSync,readdirSync,writeFileSync,mkdirSync,renameSync} from 'node:fs';
import {join} from 'node:path';
import type pg from 'pg';
import {digest,flatten,assertParity} from './records.ts';
import {tableNames} from './tables.ts';
import {postgresRepository} from './postgres-repository.ts';
import type {CatalogueData,Publication} from '../../src/types/publication.ts';
export async function migrate(c:pg.Client){
 await c.query('BEGIN');
 try{
  await c.query('SELECT pg_advisory_xact_lock(6006001)');
  await c.query('CREATE TABLE IF NOT EXISTS public.boxscout_migrations (name text PRIMARY KEY, hash text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())');
  await c.query('REVOKE ALL ON public.boxscout_migrations FROM PUBLIC');
  await c.query('ALTER TABLE public.boxscout_migrations ENABLE ROW LEVEL SECURITY');
  for(const name of readdirSync('db/migrations').filter(n=>n.endsWith('.sql')).sort()){
   const sql=readFileSync(join('db/migrations',name),'utf8');const hash=digest(sql.replaceAll('\r\n','\n'));
   const old=(await c.query('SELECT hash FROM public.boxscout_migrations WHERE name=$1',[name])).rows[0];
   if(old){if(old.hash!==hash)throw new Error('Previously applied migration changed: '+name);continue;}
   await c.query(sql);await c.query('INSERT INTO public.boxscout_migrations(name,hash) VALUES($1,$2)',[name,hash]);
  }
  await c.query('COMMIT');
 }catch(e){await c.query('ROLLBACK');throw e;}
}
export const counts=(d:CatalogueData)=>({releases:new Set(d.products.map(p=>p.release.id)).size,entries:d.entries.length,variants:d.variants.length,configurations:d.configurations.length,eligibility:d.eligibility.length,prices:d.prices.length});
export async function importCatalogue(c:pg.Client,data:CatalogueData,reviewedBy:string){
 if(!reviewedBy.trim())throw new Error('Explicit review attribution required');
 const revision=digest(data);await c.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
 try{
  await c.query('SELECT pg_advisory_xact_lock(6006001)');
  const existing=Number((await c.query('SELECT count(*) FROM catalogue.entries')).rows[0].count);
  if(existing){assertParity(data,await postgresRepository(c).read());await c.query('ROLLBACK');return {revision,unchanged:true};}
  const tables=flatten(data);
  for(const name of tableNames){if(tables[name].length)await c.query('INSERT INTO catalogue.'+name+' SELECT * FROM jsonb_populate_recordset(NULL::catalogue.'+name+', $1::jsonb)',[JSON.stringify(tables[name])]);}
  await c.query('SET CONSTRAINTS ALL IMMEDIATE');
  await c.query('SELECT catalogue.validate_graph()');
  assertParity(data,await postgresRepository(c).read());
  await c.query('INSERT INTO catalogue.imports(digest,"reviewedBy") VALUES($1,$2)',[revision,reviewedBy]);
  await c.query('COMMIT');return {revision,unchanged:false};
 }catch(e){await c.query('ROLLBACK');throw e;}
}
export async function approvePublication(c:pg.Client,expected:CatalogueData,reviewedBy:string){
 if(!reviewedBy.trim())throw new Error('Explicit review attribution required');
 await c.query('BEGIN ISOLATION LEVEL REPEATABLE READ');
 try{
  await c.query('SELECT pg_advisory_xact_lock(6006001)');await c.query('SELECT catalogue.validate_graph()');
  const data=await postgresRepository(c).read();assertParity(expected,data);const revision=digest(data);
  await c.query('INSERT INTO catalogue.publications(revision,counts,"reviewedBy") VALUES($1,$2,$3) ON CONFLICT(revision) DO NOTHING',[revision,counts(data),reviewedBy]);
  await c.query('COMMIT');return revision;
 }catch(e){await c.query('ROLLBACK');throw e;}
}
export async function readPublication(c:pg.Client):Promise<Publication>{
 await c.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 try{
  await c.query('SET LOCAL ROLE boxscout_catalogue_reader');
  const data=await postgresRepository(c).read();const revision=digest(data);
  if(!(await c.query('SELECT revision FROM catalogue.publications WHERE revision=$1',[revision])).rowCount)throw new Error('Current canonical data has not been approved for publication');
  await c.query('COMMIT');return {schemaVersion:1,revision,data};
 }catch(e){await c.query('ROLLBACK');throw e;}
}
export function snapshotText(p:Publication){return '// Generated from approved PostgreSQL publication. Do not edit.\nimport type { Publication } from \'../../types/publication.ts\';\nexport const publication:Publication = JSON.parse('+JSON.stringify(JSON.stringify(p))+');\n';}
export function writeSnapshot(p:Publication){
 const dir='src/data/published';mkdirSync(dir,{recursive:true});const dest=join(dir,'catalogue.ts');
 writeFileSync(dest+'.tmp',snapshotText(p));renameSync(dest+'.tmp',dest);
}
