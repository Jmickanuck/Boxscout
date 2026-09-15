import test from 'node:test';
import assert from 'node:assert/strict';
import {connect} from './connection.ts';
import {fixtureSource} from './fixture-source.ts';
import {migrate,importCatalogue,readPublication} from './operations.ts';
import {assertParity} from './records.ts';
// Explicit --local connection only; never run destructive negative tests on Supabase.
test('local PostgreSQL import, repeatability, constraints, roles and publication gates',async()=>{
 const c=await connect(true);
 try{
  await migrate(c);const expected=await fixtureSource.read();assert.equal((await importCatalogue(c,expected,'Plan 006 test')).unchanged,true);
  assertParity(expected,(await readPublication(c)).data);
  const target=expected.variants[0];
  try{await c.query('UPDATE catalogue.variants SET "parallelName"=$1 WHERE id=$2',['Unapproved test edit',target.id]);await assert.rejects(readPublication(c),/not been approved/);}
  finally{await c.query('UPDATE catalogue.variants SET "parallelName"=$1 WHERE id=$2',[target.parallelName,target.id]);}
  const invalid=[
   `UPDATE catalogue.variants SET "serialTotal"=0,numbering='NUMBERED' WHERE id=(SELECT id FROM catalogue.variants LIMIT 1)`,
   `UPDATE catalogue.variants SET "entryId"='missing' WHERE id=(SELECT id FROM catalogue.variants LIMIT 1)`,
   `UPDATE catalogue.eligibility SET "releaseId"='wrong-release'`,
   `UPDATE catalogue.entries SET provenance='[]' WHERE id=(SELECT id FROM catalogue.entries LIMIT 1)`,
   `DELETE FROM catalogue.variants WHERE "isDefault" AND id=(SELECT id FROM catalogue.entries LIMIT 1)`,
  ];
  for(const sql of invalid){await c.query('BEGIN');try{await assert.rejects(async()=>{await c.query(sql);await c.query('SET CONSTRAINTS ALL IMMEDIATE');});}finally{await c.query('ROLLBACK');}}
  await c.query('BEGIN');await c.query('SET LOCAL ROLE boxscout_catalogue_reader');await assert.rejects(c.query('DELETE FROM catalogue.variants'));await c.query('ROLLBACK');
  await c.query('BEGIN');await c.query('SET LOCAL ROLE boxscout_catalogue_reader');await assert.rejects(c.query('SELECT * FROM catalogue.imports'));await c.query('ROLLBACK');
  // A canonical edit does not silently publish; rollback leaves test data intact.
  await c.query('BEGIN');await c.query(`UPDATE catalogue.variants SET "parallelName"='Unapproved' WHERE id=(SELECT id FROM catalogue.variants LIMIT 1)`);
  const {postgresRepository}=await import('./postgres-repository.ts');const {digest}=await import('./records.ts');const revision=digest(await postgresRepository(c).read());assert.equal((await c.query('SELECT * FROM catalogue.publications WHERE revision=$1',[revision])).rowCount,0);await c.query('ROLLBACK');
 }finally{await c.end();}
});
