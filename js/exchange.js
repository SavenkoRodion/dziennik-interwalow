import {fresh, migrateState} from './migration.js';
import {readMetricArray} from './metrics.js';

export function encodeBackup(state, at, events){
 const {localTransfer, ...journal}=state;
 return JSON.stringify({...journal,lastBackupAt:at,events},null,2);
}

export async function decodeBackup(text){
 const backup=JSON.parse(text);
 const {localTransfer, ...incoming}=migrateState(backup);
 const events=readMetricArray(backup.schemaVersion===3 ? backup.events : []);
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical({incoming,events})));
 const digest=Array.from(new Uint8Array(hash),byte=>byte.toString(16).padStart(2,'0')).join('');
 return {incoming,events,digest};
}

function canonical(value){
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 if(value && typeof value==='object')return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical(value[key])).join(',')+'}';
 return JSON.stringify(value);
}

export function importPlan(state,{incoming,digest}){
 const local=new Map(state.entries.map(entry=>[entry.id,entry]));
 const deleted=new Set(state.localTransfer?.deleted??[]);
 const repeated=(state.localTransfer?.receipts??[]).includes(digest);
 const added=[], conflicts=[];
 let skipped=0;
 if(!repeated)for(const entry of incoming.entries){
  const current=local.get(entry.id);
  if(deleted.has(entry.id)){skipped++;continue;}
  if(!current)added.push(entry);
  else if(canonical(current)!==canonical(entry))conflicts.push({local:current,incoming:entry});
 }
 return {repeated,added,conflicts,skipped};
}

export function resolveImport(state,packet,choices,{desktop=false,recover=false,at=Date.now()}={}){
 const plan=importPlan(state,packet);
 if(plan.repeated)return state;
 const replacements=new Map();
 for(const conflict of plan.conflicts){
  const id=conflict.local.id, choice=choices.get(id);
  if(!['local','incoming'].includes(choice))throw Error('Wybierz wersję każdego spornego wpisu.');
  if(choice==='incoming')replacements.set(id,conflict.incoming);
 }
 const entries=[...state.entries.map(entry=>replacements.get(entry.id)??entry),...plan.added]
  .sort((a,b)=>b.start-a.start||b.end-a.end||a.id.localeCompare(b.id));
 const localTransfer={...state.localTransfer,receipts:[...(state.localTransfer?.receipts??[]),packet.digest],lastImportAt:at};
 const source=packet.incoming;
 if(desktop)localTransfer.snapshot={current:source.current,session:source.session,at:source.lastBackupAt};
 const next={...state,entries,localTransfer};
 if(recover){
  if(desktop||state.current||state.entries.length||state.session)throw Error('Pomiar można odtworzyć na pustym telefonie.');
  for(const key of Object.keys(fresh()))if(key!=='entries')next[key]=source[key];
 }
 return next;
}
