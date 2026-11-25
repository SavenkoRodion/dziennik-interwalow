import {encodeBackup,decodeBackup,importPlan,resolveImport} from './exchange.js';
import {captureRecovery} from './recovery.js';
import {state,broken,futureData,save,replaceState,withWriteLock} from './storage.js';
import {metricSnapshot,queueImportedMetrics} from './metrics.js';
import {$,desktop,span} from './presentation.js';

export function backupText(at=Date.now()){
 if(futureData){
  const archive=captureRecovery(localStorage);
  return {text:JSON.stringify(archive,null,2),warning:archive.issues.join(' ')};
 }
 const snapshot=desktop && state.localTransfer?.snapshot;
 const journal=snapshot?{...state,current:snapshot.current,session:snapshot.session,editor:null}:state;
 return {text:encodeBackup(journal,at,metricSnapshot()),warning:''};
}
function download(file){
 const link=document.createElement('a');
 link.href=URL.createObjectURL(file);link.download=file.name;
 link.click();setTimeout(()=>URL.revokeObjectURL(link.href),30000);
}
function jsonFile(text,label){
 return new File([text],label+'-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json',{type:'application/json'});
}
export function setupTransfer(onImported){
 let packet=null,baseline=null,session=null,sessionBaseline=null,readId=0;
 const choices=new Map();
 const status=message=>{$('importStatus').textContent=message;};
 function closeReview(){
  ++readId;packet=null;choices.clear();$('review').hidden=true;$('differences').replaceChildren();
 }
 function openReview(data){
  packet=data;baseline=JSON.stringify(state);choices.clear();
  const plan=importPlan(state,packet);
  $('review').hidden=false;
  $('reviewSummary').textContent=plan.repeated?'Ten plik został już przyjęty.':
   'W pliku: '+data.incoming.entries.length+' · nowe: '+plan.added.length+' · konflikty: '+plan.conflicts.length+' · wcześniej usunięte: '+plan.skipped;
  $('recover').checked=false;
  $('recoverLabel').hidden=desktop||plan.repeated||!!state.entries.length||!!state.session;
  $('sessionOpen').hidden=!desktop;
  $('persistImport').disabled=plan.repeated||plan.conflicts.length>0;
  $('differences').replaceChildren();
  for(const [index,conflict] of plan.conflicts.entries()){
   const group=document.createElement('fieldset'),legend=document.createElement('legend');
   legend.textContent='Wybierz wpis · '+conflict.local.id;group.append(legend);
   for(const [side,title] of [['local','Na urządzeniu'],['incoming','Z pliku']]){
    const label=document.createElement('label'),radio=document.createElement('input'),detail=document.createElement('pre');
    radio.type='radio';radio.name='difference-'+index;
    radio.onchange=()=>{choices.set(conflict.local.id,side);$('persistImport').disabled=choices.size!==plan.conflicts.length;};
    const entry=conflict[side];
    detail.textContent=[span(entry),entry.note||'Bez notatki','Tag: '+(entry.tag||'brak'),'Blokada: '+(entry.blocked?'tak':'nie')].join('\n');
    const extra=Object.entries(entry).filter(([key])=>!['id','start','end','tag','note','blocked'].includes(key));
    if(extra.length)detail.textContent+='\n'+JSON.stringify(Object.fromEntries(extra));
    detail.title=JSON.stringify(entry);
    label.append(radio,title,detail);group.append(label);
   }
   $('differences').append(group);
  }
  $('reviewTitle').focus();
 }
 async function preview(read){
  if(broken)return;
  closeReview();const id=readId;
  $('backupPanel').open=$('restorePanel').open=true;
  try{
   const data=await decodeBackup(await read());
   if(id!==readId||broken)return;
   status('');openReview(data);
  }catch(error){if(id===readId)status('Nie można otworzyć kopii. '+error.message);}
 }
 $('importFile').onchange=event=>{
  const file=event.target.files[0];event.target.value='';
  if(file)preview(()=>file.text());
 };
 $('importBackup').onclick=()=>preview(()=>$('importJson').value);
 window.addEventListener('dragover',event=>{if(event.dataTransfer.types.includes('Files'))event.preventDefault();});
 window.addEventListener('drop',event=>{
  if(!event.dataTransfer.files.length)return;
  event.preventDefault();if($('sessionView').open)return;
  const file=event.dataTransfer.files[0];preview(()=>file.text());
 });
 $('cancelReview').onclick=()=>{closeReview();status('Anulowano import.');};
 $('persistImport').onclick=()=>withWriteLock(()=>{
  if(broken||!packet)return;
  if(JSON.stringify(state)!==baseline){
   status('Dane zmieniły się. Sprawdź ponownie podgląd.');openReview(packet);return;
  }
  try{
   const next=resolveImport(state,packet,choices,{desktop,recover:!$('recoverLabel').hidden&&$('recover').checked});
   if(next===state)return;
   if(!save(next)){status('Nie udało się zatwierdzić importu.');return;}
   replaceState(next);queueImportedMetrics(packet.events);closeReview();onImported();status('Zapisano import.');
  }catch(error){status(error.message);}
 });
 $('sessionOpen').onclick=()=>{
  if(!packet||broken)return;
  sessionBaseline=baseline;
  session={...packet,incoming:{...packet.incoming,entries:[...packet.incoming.entries]}};
  const alternatives=new Map(importPlan(state,packet).conflicts.map(pair=>[pair.local.id,pair]));
  $('sessionEntries').replaceChildren();
  for(const [index,entry] of session.incoming.entries.entries()){
   const card=document.createElement('article'),note=document.createElement('p');
   card.className='entry';card.append(span(entry));note.className='entry-note';
   const pair=alternatives.get(entry.id);
   const display=version=>{
    session.incoming.entries[index]=version;
    card.firstChild.textContent=span(version);
    note.textContent=[version.note,version.tag,version.blocked?'! blokada':''].filter(Boolean).join(' · ');
   };
   display(pair&&choices.get(entry.id)==='local'?pair.local:entry);
   card.append(note);
   if(pair){
    const select=document.createElement('select');
    select.setAttribute('aria-label','Wersja wpisu '+entry.id);
    select.add(new Option('Z pliku','incoming'));select.add(new Option('Na urządzeniu','local'));
    select.value=choices.get(entry.id)??'incoming';
    select.onchange=()=>{display(pair[select.value]);choices.set(entry.id,select.value);};
    card.append(select);
   }
   $('sessionEntries').append(card);
  }
  $('sessionSummary').textContent='Wpisy z pliku: '+session.incoming.entries.length+
   (session.incoming.current?' · pomiar w chwili eksportu był aktywny.':'.');
  $('sessionView').showModal();
 };
 $('sessionView').addEventListener('close',()=>{session=null;$('sessionEntries').replaceChildren();});
 $('sessionClose').onclick=()=>{$('sessionView').close();closeReview();status('Zamknięto sesję.');};
 $('sessionView').addEventListener('cancel',closeReview);
 $('sessionPersist').onclick=()=>{const preserved=new Map(choices);
  $('sessionView').close();openReview(packet);
  if(JSON.stringify(state)===sessionBaseline){
   for(const [index,pair] of importPlan(state,packet).conflicts.entries()){
    const side=preserved.get(pair.local.id);
    if(side)document.getElementsByName('difference-'+index)[side==='local'?0:1].click();
   }
  }};
 $('sessionExport').onclick=()=>download(jsonFile(encodeBackup(session.incoming,session.incoming.lastBackupAt,session.events),'sesja'));
 async function exportFile(share){
  try{
   if(broken&&!futureData)return;
   const {text,warning}=backupText();
   const file=jsonFile(text,futureData?(warning?'ratunkowa-niepelna':'ratunkowa'):'dziennik');
   let message;
   if(share && navigator.canShare?.({files:[file]})){
    await navigator.share({files:[file]});message='Przekazano plik do udostępnienia.';
   }else{download(file);message='Pobrany plik możesz wysłać przez LocalSend.';}
   $('backupStatus').textContent=[warning&&'Kopia niepełna.',warning,message].filter(Boolean).join(' ');
  }catch(error){
   if(error.name!=='AbortError')$('backupStatus').textContent='Eksport nie powiódł się. '+error.message+' Możesz wybrać „Pobierz JSON”.';
  }
 }
 $('sendFile').onclick=()=>exportFile(true);
 $('downloadFile').onclick=()=>exportFile(false);
 return closeReview;
}
