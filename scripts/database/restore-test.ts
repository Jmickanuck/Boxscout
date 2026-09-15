import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join,resolve} from 'node:path';
import {connect,safeError,connectOptions} from './connection.ts';
import {migrate,readPublication} from './operations.ts';
import {fixtureSource} from './fixture-source.ts';
import {assertParity,digest} from './records.ts';
const file=process.argv[2];
if(!file||!process.argv.includes('--local'))throw new Error('Usage: restore-test.ts path.dump --local (fresh disposable local database only)');
const bin=process.env.BOXSCOUT_PG_BIN;if(!bin)throw new Error('Set BOXSCOUT_PG_BIN');
const c=await connect(true);
try{
 const manifest=JSON.parse(readFileSync(file.replace(/\.dump$/,'.json'),'utf8'));
 if(createHash('sha256').update(readFileSync(file)).digest('hex')!==manifest.sha256)throw new Error('Backup checksum mismatch');
 for(const [name,hash] of Object.entries(manifest.migrations)){if(digest(readFileSync(join('db/migrations',name),'utf8').replaceAll('\r\n','\n'))!==hash)throw new Error('Use the migration revision recorded in this backup');}
 if(Number((await c.query("SELECT count(*) FROM pg_tables WHERE schemaname='catalogue'")).rows[0].count))throw new Error('Restore target must be fresh: catalogue schema already contains tables');
 await migrate(c);
 const opts=connectOptions(true);const env:NodeJS.ProcessEnv={...process.env,PGHOST:'127.0.0.1',PGPORT:String(opts.port),PGUSER:'postgres',PGDATABASE:String(opts.database)};
 delete env.PGPASSWORD;delete env.PGSSLMODE;delete env.PGSSLROOTCERT;
 const started=performance.now();
 const restored=spawnSync(join(bin,process.platform==='win32'?'pg_restore.exe':'pg_restore'),['--data-only','--single-transaction','--exit-on-error','--no-owner','--no-privileges','--dbname='+opts.database,resolve(file)],{env,encoding:'utf8',windowsHide:true});
 if(restored.status!==0)throw new Error(restored.stderr||'Restore failed');
 const p=await readPublication(c);assertParity(await fixtureSource.read(),p.data);
 console.log('Restore, reader-role publication and full parity passed',p.revision,'milliseconds',Math.round(performance.now()-started));
} catch(e){console.error(safeError(e));process.exitCode=1;}finally{await c.end();}
