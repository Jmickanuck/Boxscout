import {connect,safeError} from './connection.ts';
import {fixtureSource} from './fixture-source.ts';
import {migrate,importCatalogue,approvePublication,readPublication,writeSnapshot,counts} from './operations.ts';
import {assertParity} from './records.ts';
import {postgresRepository} from './postgres-repository.ts';
const [command]=process.argv.slice(2);const local=process.argv.includes('--local');
const review=process.env.BOXSCOUT_REVIEWED_BY??'';
let c;
try{
 c=await connect(local);
 switch(command){
 case 'migrate':await migrate(c);console.log('Migrations applied/verified');break;
 case 'import':console.log(await importCatalogue(c,await fixtureSource.read(),review));break;
 case 'parity':{const data=await postgresRepository(c).read();assertParity(await fixtureSource.read(),data);console.log('Full domain/provenance parity passed',counts(data));break;}
 case 'approve':console.log('Approved revision',await approvePublication(c,await fixtureSource.read(),review));break;
 case 'publish':{const p=await readPublication(c);writeSnapshot(p);console.log('Published snapshot',p.revision,counts(p.data));break;}
 case 'size':console.log((await c.query("SELECT pg_database_size(current_database()) AS database_bytes, (SELECT sum(pg_total_relation_size(quote_ident(schemaname)||'.'||quote_ident(tablename))) FROM pg_tables WHERE schemaname='catalogue') AS catalogue_bytes")).rows);break;
 default:throw new Error('Use migrate, import, parity, approve, publish or size');
 }
}catch(e){console.error(safeError(e));process.exitCode=1;}finally{await c?.end();}
