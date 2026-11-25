import {validTime} from './time.js';

const EVENTS_KEY = 'dziennik-interwalow-events-v1';
const MAX_EVENTS = 2000;
const MAX_EVENTS_BYTES = 300000;
const EVENT_KINDS = {
 visible:['open','resume'],
 action:['stop','edit','delete','copy','restore','update'],
 error:['state_write','clipboard','sw_register','future_schema']
};
const pendingMetrics = new Map();
let pendingImports = [];
let metricTimer = null, noteMetric = null;
let wasVisible = false, hasBeenVisible = false;

function newMetric(type){
 const at=Date.now();
 const id=globalThis.crypto?.randomUUID?.()??
  Array.from({length:32},()=>Math.floor(Math.random()*16).toString(16)).join('');
 return {id,type,at,offset:-new Date(at).getTimezoneOffset()};
}
function validMetric(event){
 if(!event||typeof event.id!=='string'||!(/^(?:[a-f0-9]{32}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/).test(event.id))return false;
 if(!Number.isSafeInteger(event.at)||!validTime(event.at)||!Number.isInteger(event.offset)||Math.abs(event.offset)>1440)return false;
 const base=['id','type','at','offset'];
 let fields;
 switch(event.type){
  case 'visible':
   fields=['kind','mode'];
   if(!['standalone','browser','other'].includes(event.mode))return false;
   break;
  case 'action':
  case 'error':
   fields=['kind'];
   break;
  case 'note':
   fields=['firstMs','lastMs','chars','end'];
   if(!Number.isSafeInteger(event.chars)||event.chars<0||
      !['done','replaced','hidden','pending'].includes(event.end))return false;
   if(event.firstMs===null){
    if(event.lastMs!==null||event.chars!==0)return false;
   }else if(!Number.isSafeInteger(event.firstMs)||!Number.isSafeInteger(event.lastMs)||
            event.firstMs<0||event.lastMs<event.firstMs)return false;
   break;
  default:return false;
 }
 if(event.type!=='note'&&!EVENT_KINDS[event.type].includes(event.kind))return false;
 return Object.keys(event).length===base.length+fields.length&&
  [...base,...fields].every(key=>Object.hasOwn(event,key));
}
function preferMetric(local,incoming){
 if(!local)return incoming;
 if(local.type!=='note'||incoming.type!=='note'||local.end!=='pending')return local;
 if(incoming.end!=='pending'||(incoming.lastMs??-1)>(local.lastMs??-1))return incoming;
 return local;
}
function readMetricArray(events){
 if(!Array.isArray(events))return [];
 const unique=new Map();
 for(const event of events){
  if(validMetric(event))unique.set(event.id,preferMetric(unique.get(event.id),event));
 }
 return [...unique.values()];
}
function storedMetrics(){
 try{return readMetricArray(JSON.parse(localStorage.getItem(EVENTS_KEY)));}
 catch(error){return [];}
}
function packMetrics(batch,stored){
 const merged=new Map(stored.map(event=>[event.id,event]));
 let hasImports=false;
 for(const {event,imported} of batch){
  const local=merged.get(event.id);
  const chosen=!imported&&local?.type==='note'&&local.end==='pending'
   ? event : preferMetric(local,event);
  merged.set(event.id,chosen);
  hasImports ||= imported&&chosen!==local;
 }
 const events=[...merged.values()];
 if(hasImports)events.sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id));
 let bytes=2;
 const parts=[];
 let first=events.length;
 while(first>0&&parts.length<MAX_EVENTS){
  const part=JSON.stringify(events[first-1]);
  // Walidowane rekordy zawierają wyłącznie ASCII. Długość to liczba bajtów UTF-8.
  const nextSize=bytes+part.length+(parts.length?1:0);
  if(nextSize>MAX_EVENTS_BYTES)break;
  parts.push(part);
  bytes=nextSize;
  first--;
 }
 return {events:events.slice(first),serialized:'['+parts.reverse().join(',')+']'};
}
function metricSnapshot(){
 return packMetrics(metricBatch(),storedMetrics()).events;
}
function metricBatch(){
 return [...pendingMetrics.values(),...pendingImports.map(event=>({event,imported:true}))];
}
function flushMetrics(){
 clearTimeout(metricTimer);
 metricTimer=null;
 if(!pendingMetrics.size&&!pendingImports.length)return;
 const batch=metricBatch();
 pendingMetrics.clear();
 pendingImports=[];
 try{localStorage.setItem(EVENTS_KEY,packMetrics(batch,storedMetrics()).serialized);}
 catch(error){
  if(noteMetric&&batch.some(({event})=>event.id===noteMetric.event.id))noteMetric=null;
 }
}
function queueMetric(event){
 pendingMetrics.set(event.id,{event,imported:false});
 if(pendingMetrics.size>MAX_EVENTS)pendingMetrics.delete(pendingMetrics.keys().next().value);
 if(metricTimer===null)metricTimer=setTimeout(flushMetrics,800);
}
function recordMetric(type,kind){
 queueMetric({...newMetric(type),kind});
}
function discardPendingMetrics(){
 clearTimeout(metricTimer);
 metricTimer=null;
 pendingMetrics.clear();
 pendingImports=[];
 noteMetric=null;
}
function clearMetrics(){
 discardPendingMetrics();
 try{localStorage.removeItem(EVENTS_KEY);}catch(error){}
}
function localStorageEventMatchesRemoval(){
 try{return localStorage.getItem(EVENTS_KEY)===null;}
 catch(error){return false;}
}
function finishNoteMetric(end){
 if(!noteMetric)return;
 queueMetric({...noteMetric.event,end});
 noteMetric=null;
}
function hideMetrics(){
 wasVisible=false;
 finishNoteMetric('hidden');
 flushMetrics();
}
function trackVisibility(){
 const visible=document.visibilityState==='visible';
 if(visible===wasVisible)return;
 if(!visible){hideMetrics();return;}
 const mode=matchMedia('(display-mode: standalone)').matches?'standalone':
  matchMedia('(display-mode: browser)').matches?'browser':'other';
 queueMetric({...newMetric('visible'),kind:hasBeenVisible?'resume':'open',mode});
 wasVisible=true;
 hasBeenVisible=true;
}

function beginNoteMetric(entryId, endedAt){
 finishNoteMetric('replaced');
 noteMetric={entryId,endedAt,event:{...newMetric('note'),firstMs:null,lastMs:null,chars:0,end:'pending'}};
 queueMetric(noteMetric.event);
}

function updateNoteMetric(entryId, note, inputAt){
 if(noteMetric?.entryId!==entryId)return;
 const elapsed=Math.round(inputAt-noteMetric.endedAt);
 let chars=0;
 for(const character of note)chars++;
 const event=noteMetric.event;
 noteMetric.event={...event,firstMs:event.firstMs??elapsed,lastMs:elapsed,chars};
 queueMetric(noteMetric.event);
}

function queueImportedMetrics(events){
 pendingImports=packMetrics(
  events.map(event=>({event,imported:true})),pendingImports
 ).events;
 if(pendingImports.length&&metricTimer===null)metricTimer=setTimeout(flushMetrics,800);
}

export {EVENTS_KEY, readMetricArray, metricSnapshot, recordMetric, clearMetrics,
 discardPendingMetrics, localStorageEventMatchesRemoval, noteMetric, beginNoteMetric,
 updateNoteMetric, finishNoteMetric, trackVisibility, hideMetrics, queueImportedMetrics};
