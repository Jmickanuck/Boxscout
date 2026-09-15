import pg from 'pg';
import {readFileSync} from 'node:fs';
export function connectOptions(local=false):pg.ClientConfig {
 if(local){
  const port=Number(process.env.BOXSCOUT_TEST_PORT??55432);
  if(!Number.isInteger(port)||port<1024)throw new Error('Invalid local test port');
  return {host:'127.0.0.1',port,database:process.env.BOXSCOUT_TEST_DATABASE??'boxscout_test',user:'postgres',connectionTimeoutMillis:10000};
 }
 if(!process.env.BOXSCOUT_DB_PASSWORD)throw new Error('Set BOXSCOUT_DB_PASSWORD in the ignored local environment file');
 return {host:process.env.BOXSCOUT_DB_HOST??'aws-0-ca-central-1.pooler.supabase.com',port:5432,user:process.env.BOXSCOUT_DB_USER??'postgres.abkbniwtvojtjogxscap',database:'postgres',password:process.env.BOXSCOUT_DB_PASSWORD,ssl:{rejectUnauthorized:true,ca:readFileSync(process.env.BOXSCOUT_DB_CA??'.env.database-ca.crt','utf8')},connectionTimeoutMillis:15000};
}
export async function connect(local=false){const client=new pg.Client(connectOptions(local));await client.connect();return client;}
export function safeError(e:unknown){const message=e instanceof Error?e.message:String(e);return process.env.BOXSCOUT_DB_PASSWORD?message.replaceAll(process.env.BOXSCOUT_DB_PASSWORD,'[redacted]'):message;}
