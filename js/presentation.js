import {state, broken, futureData} from './storage.js';
import {pad, date, time, duration, midnight, groupDays} from './time.js';

const BACKUP_AGE = 7 * 24 * 60 * 60 * 1000;
const $ = id => document.getElementById(id);
let confirmation = null, lastDay = '';

function storageError(text) {$('storageError').textContent=text;$('storageError').hidden=false;}
function say(text){$('message').textContent=text;}
function edited(){return state.entries.find(e=>e.id===state.editor);}
function span(e){return `${date(e.start)} · ${time(e.start)} – ${date(e.start)!==date(e.end)?date(e.end)+' ':''}${time(e.end)} · ${duration(e.end-e.start)}`;}
function tick(){
 const now=Date.now();
 $('timer').textContent=duration(state.current?now-state.current.start:0);
 const day=date(now);
 if(day!==lastDay){lastDay=day;renderList(now);}
 if(liveDay){
  const {part,total,totalLabel,durationLabel,longLabel}=liveDay;
  const stop=Math.max(part.start,now);
  totalLabel.textContent='Zapisano '+minutesText(Math.round((total+stop-part.stop)/60000));
  if(durationLabel)durationLabel.textContent=duration(stop-part.start);
  if(longLabel)longLabel.hidden=stop-part.entry.start<LONG_INTERVAL;
 }
 renderBackupReminder(now);
}
const dayFormat=new Intl.DateTimeFormat('pl-PL',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
const dayChoices=new Map();
const visibleParts=new WeakMap();
const LONG_INTERVAL=8*60*60*1000;
let liveDay=null;
function element(type,content,className){
 const node=document.createElement(type);
 if(content!=null)node.textContent=content;
 if(className)node.className=className;
 return node;
}
function minutesText(minutes){
 return minutes<60?minutes+' min':Math.floor(minutes/60)+' godz. '+pad(minutes%60)+' min';
}
function entryRow(part){
 const {entry,start,stop,end,running,live}=part;
 const row=element(running?'div':'button',null,'entry');
 if(!running){
  row.type='button';row.dataset.id=entry.id;row.disabled=broken;
  visibleParts.set(row,part);
  row.setAttribute('aria-current',String(entry.id===state.editor));
 }
 const head=element('span',null,'entry-head');
 const until=live?'teraz':stop>start&&stop===midnight(start,1)?'24:00':time(stop).slice(0,5);
 const length=element('strong',duration(stop-start));
 head.append(element('span',time(start).slice(0,5)+' – '+until),length);
 row.append(head);
 if(!running&&(entry.note!==entry.tag||!entry.tag)){
  row.append(element('span',entry.note||'Dotknij, aby dodać notatkę',entry.note?'entry-note':'entry-note muted'));
 }
 const meta=element('span',null,'entry-meta');
 if(running)meta.append(element('span','Trwa','run-state'));
 else if(entry.tag)meta.append(element('span',entry.tag,'tag'));
 if(start>entry.start)meta.append(element('span','od wczoraj'));
 if(stop<end || (running&&!live))meta.append(element('span','ciąg dalszy jutro'));
 if(running||end-entry.start>=LONG_INTERVAL){
  const marker=element('span','długi interwał');
  marker.hidden=end-entry.start<LONG_INTERVAL;
  meta.append(marker);
  if(live&&part===liveDay?.part){liveDay.durationLabel=length;liveDay.longLabel=marker;}
 }
 if(entry.blocked)meta.append(element('span','! blokada','badge'));
 if(meta.childElementCount)row.append(meta);
 return row;
}
function dayContents(day){
 const cards=element('div',null,'day-entries');
 day.parts.sort((a,b)=>b.start-a.start || b.stop-a.stop);
 for(const part of day.parts)cards.append(entryRow(part));
 return cards;
}
function renderList(now=Date.now()){
 for(const old of $('entries').querySelectorAll('details[data-day]'))dayChoices.set(Number(old.dataset.day),old.open);
 const days=groupDays(state, now), fragment=document.createDocumentFragment();
 const today=midnight(now);
 const defaultDay=days.some(d=>d.key===today)?today:days[0]?.key;
 let newer=null;
 liveDay=null;
 for(const day of days){
  if(newer!==null&&midnight(day.key,1)<newer){
   const first=midnight(day.key,1),last=midnight(newer,-1);
   const range=dayFormat.format(first)+(first===last?'':' – '+dayFormat.format(last));
   fragment.append(element('p',range+' · brak zapisów','gap'));
  }
  newer=day.key;
  const section=element('details',null,'history-day');
  section.dataset.day=day.key;
  const summary=element('summary'), line=element('span',null,'day-line');
  const totalLabel=element('span','Zapisano '+minutesText(Math.round(day.total/60000)));
  line.append(element('span',day.key===today?'Dzisiaj · '+dayFormat.format(day.key):dayFormat.format(day.key)),totalLabel);
  summary.append(line);section.append(summary);
  const part=day.parts.find(part=>part.live);
  if(part)liveDay={part,total:day.total,totalLabel};
  section.open=dayChoices.get(day.key)??(day.key===defaultDay);
  const fill=()=>{if(section.open&&!summary.nextElementSibling)section.append(dayContents(day));};
  fill();
  section.addEventListener('toggle',()=>{
   if(!section.isConnected)return;
   dayChoices.set(day.key,section.open);
   fill();
   if(section.open&&part)tick();
  });
  fragment.append(section);
 }
 $('entries').replaceChildren(fragment);
 $('empty').hidden=days.length>0;
}
function renderEditor(focus=false){const e=edited();$('editor').hidden=!e;if(!e)return;$('editorTime').textContent=span(e);$('note').value=e.note;$('blocked').checked=e.blocked;if(focus){$('note').focus();$('editor').scrollIntoView({block:'nearest'});}}
function render(focus=false){
 const running=!!state.current;
 $('measure').disabled=broken;
 $('measure').textContent=running?'Koniec interwału':'Start';
 $('stop').hidden=!running||broken;
 $('runState').hidden=!running;
 $('backup').disabled=broken&&!futureData;
 $('restorePanel').hidden=broken;
 $('importBackup').disabled=broken;
 $('clear').disabled=!!futureData;
 $('importJson').disabled=broken;
 for(const id of ['note','blocked','done','delete'])$(id).disabled=broken;
 lastDay=date(Date.now());
 renderList();renderEditor(focus&&!broken);tick();
}
function renderBackupReminder(now=Date.now()){
 const last=state.lastBackupAt;
 const reminder=$('backupReminder');
 reminder.hidden=broken||(last!==null&&now-last<=BACKUP_AGE);
 reminder.textContent=last===null?'Brak kopii danych':'Ostatnia kopia ma ponad 7 dni';
 $('lastBackupStatus').textContent=last===null?'Ostatnia kopia: brak.':'Ostatnia kopia: '+date(last)+' '+time(last);
}
function ask(title,text,button,action){$('dialogTitle').textContent=title;$('dialogText').textContent=text;$('confirmDialog').textContent=button;confirmation=action;if(!$('dialog').open)$('dialog').showModal();else $('cancelDialog').focus();}
$('cancelDialog').addEventListener('click',()=>{$('dialog').close();confirmation=null;});
$('dialog').addEventListener('cancel',()=>{confirmation=null;});
$('confirmDialog').addEventListener('click',()=>{const action=confirmation;confirmation=null;$('dialog').close();action?.();});

function updateEntryRows(entry){
 for(const row of $('entries').querySelectorAll('button[data-id]')){
  if(row.dataset.id===entry.id)row.replaceWith(entryRow(visibleParts.get(row)));
 }
}

function clearStorageError(){$('storageError').hidden=true;}

export {$, storageError, clearStorageError, say, edited, span, tick, renderList,
 renderEditor, render, renderBackupReminder, ask, updateEntryRows};
