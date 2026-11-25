import {SCHEMA_VERSION, migrateState, validateVersion} from './migration.js';
import {readMetricArray} from './metrics.js';
import {date, time} from './time.js';

function encodeBackup(state, at, events){
 return JSON.stringify({...state,lastBackupAt:at,events},null,2);
}

function decodeBackup(text){
 const backup=JSON.parse(text);
 const incoming=migrateState(backup);
 const events=backup.schemaVersion===SCHEMA_VERSION?readMetricArray(backup.events):[];
 return {incoming,events};
}

function importPlan(state, incoming){
 const restore=state.entries.length===0&&state.session===null&&state.current===null;
 const existing=new Map(state.entries.map(e=>[e.id,e]));
 let added=0,common=0,conflicts=0;
 for(const e of incoming.entries){const local=existing.get(e.id);if(!local)added++;else{common++;if(JSON.stringify(local)!==JSON.stringify(e))conflicts++;}}
 const merged=restore?incoming:{...state,entries:[...state.entries,...incoming.entries.filter(e=>!existing.has(e.id))].sort((a,b)=>b.start-a.start||b.end-a.end||a.id.localeCompare(b.id))};
 const timestamps=[];for(const e of incoming.entries)timestamps.push(e.start,e.end);if(incoming.session)timestamps.push(incoming.session.start,incoming.session.end??incoming.current.start);
 let first=null,last=null;for(const ts of timestamps){first=first===null?ts:Math.min(first,ts);last=last===null?ts:Math.max(last,ts);}
 const range=first===null?'brak dat':date(first)+' '+time(first)+' — '+date(last)+' '+time(last);
 const summary='Interwały w kopii: '+incoming.entries.length+'. Nowe: '+added+'. Wspólne ID: '+common+'.'+
  '\nZakres dat: '+range+'.'+
  (conflicts?'\nRóżniące się wpisy ze wspólnym ID: '+conflicts+'. Zachowamy lokalną wersję.':'')+
  (restore?'\nPusta aplikacja: przywrócimy cały stan, także ustawienia i trwający pomiar.':'\nScalimy zakończone interwały. Bieżący pomiar, ustawienia i edytowana notatka pozostaną lokalne.')+
  (!restore&&incoming.current?'\nKopia zawiera trwający pomiar, który można przywrócić w pustym dzienniku.':'');
 return {next:validateVersion(merged,SCHEMA_VERSION),summary,added};
}
export {encodeBackup, decodeBackup, importPlan};
