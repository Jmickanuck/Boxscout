import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync,readdirSync} from 'node:fs';
import {resolve,join,relative,isAbsolute} from 'node:path';
import {homedir} from 'node:os';
import {connectOptions,safeError} from './connection.ts';
import {digest} from './records.ts';
const dir=resolve(process.env.BOXSCOUT_BACKUP_DIR??join(homedir(),'Documents','BoxScout-backups'));
const relation=relative(process.cwd(),dir);
if(!relation||(!relation.startsWith('..')&&!isAbsolute(relation)))throw new Error('Backups must be outside the repository');
const bin=process.env.BOXSCOUT_PG_BIN;
if(!bin)throw new Error('Set BOXSCOUT_PG_BIN to a PostgreSQL 17+ bin directory');
const options=connectOptions(false);
const env={...process.env,PGHOST:String(options.host),PGPORT:String(options.port),PGUSER:String(options.user),PGPASSWORD:process.env.BOXSCOUT_DB_PASSWORD,PGDATABASE:'postgres',PGSSLMODE:'verify-full',PGSSLROOTCERT:resolve(process.env.BOXSCOUT_DB_CA??'.env.database-ca.crt')};
try{
 mkdirSync(dir,{recursive:true});const stem=join(dir,'boxscout-'+new Date().toISOString().replaceAll(':','-'));
 const result=spawnSync(join(bin,process.platform==='win32'?'pg_dump.exe':'pg_dump'),['--format=custom','--no-owner','--no-privileges','--schema=catalogue','--file='+stem+'.dump'],{env,encoding:'utf8',windowsHide:true});
 if(result.status!==0)throw new Error(result.stderr||'pg_dump failed');
 const manifest={createdAt:new Date().toISOString(),file:stem+'.dump',sha256:createHash('sha256').update(readFileSync(stem+'.dump')).digest('hex'),hashEncoding:'sha256 of dump bytes',migrations:Object.fromEntries(readdirSync('db/migrations').filter(n=>n.endsWith('.sql')).map(n=>[n,digest(readFileSync(join('db/migrations',n),'utf8').replaceAll('\r\n','\n'))]))};
 writeFileSync(stem+'.json',JSON.stringify(manifest,null,2)+'\n');console.log('Backup saved outside repository:',stem+'.dump');
}catch(e){console.error(safeError(e));process.exitCode=1;}
