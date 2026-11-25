import {encodeBackup, decodeBackup, importPlan} from './exchange.js';
import {fresh} from './migration.js';
import {EVENTS_KEY, metricSnapshot, recordMetric, clearMetrics, discardPendingMetrics,
 localStorageEventMatchesRemoval, noteMetric, beginNoteMetric, updateNoteMetric, finishNoteMetric,
 trackVisibility, hideMetrics, queueImportedMetrics} from './metrics.js';
import {$, storageError, clearStorageError, say, edited, span, tick, renderList,
 renderEditor, render, renderBackupReminder, ask, updateEntryRows} from './presentation.js';
import {KEY, state, broken, needsMigrationSave, futureData, initializeStorage, save,
 readStorageChange, replaceState, setBroken} from './storage.js';
import {registerUpdates} from './update.js';

let wakeLock = null, wakePending = false, pendingBackupAt = null;

initializeStorage({
 showError:storageError,
 clearError:clearStorageError,
 onFutureData(){pendingBackupAt=null;$('backupSaved').hidden=true;},
 onBlockedSave(){render();syncWake();}
});

function boundary(keepRunning){
 if(!state.current||broken)return;
 const endedAt=performance.now();
 const now=Math.max(Date.now(),state.current.start);
 const id=globalThis.crypto?.randomUUID?.()??now+'-'+Math.random().toString(36).slice(2);
 state.entries.unshift({id,start:state.current.start,end:now,note:'',blocked:false,tag:''});state.editor=id;
 state.current=keepRunning?{start:now}:null;if(!keepRunning)state.session.end=now;
 save();render(true);syncWake();
 if(!broken)beginNoteMetric(id,endedAt);
}
$('measure').addEventListener('click',()=>{
 if(broken)return;
 if(state.current){boundary(true);return;}
 const now=Date.now();
 state.session={start:now,end:null};state.current={start:now};
 save();render();syncWake();
});
$('stop').addEventListener('click',()=>{if(state.current&&!broken){boundary(false);recordMetric('action','stop');}});
$('note').addEventListener('input',()=>{
 const e=edited();if(!e||broken)return;
 const inputAt=performance.now();
 e.note=$('note').value;save();
 if(!broken)updateNoteMetric(e.id,e.note,inputAt);
 updateEntryRows(e);
});
$('blocked').addEventListener('change',()=>{const e=edited();if(!e||broken)return;e.blocked=$('blocked').checked;save();renderList();});
$('done').addEventListener('click',()=>{
 if(broken)return;
 finishNoteMetric('done');
 state.editor=null;save();renderEditor();renderList();
 $('measure').focus({preventScroll:true});
});
$('entries').addEventListener('click',event=>{
 const b=event.target.closest('button[data-id]');if(!b||broken)return;
 finishNoteMetric('replaced');
 recordMetric('action','edit');
 state.editor=b.dataset.id;save();renderList();renderEditor(true);
});
$('backupReminder').addEventListener('click',event=>{
 event.preventDefault();
 $('backupPanel').open=true;
 $('backup').focus({preventScroll:true});
 $('backup').scrollIntoView({block:'nearest'});
});
async function requestPersistentStorage(){
 try{
  if(!navigator.storage?.persist){$('persistenceStatus').textContent='Trwała pamięć: przeglądarka nie obsługuje tej funkcji.';return;}
  const granted=await navigator.storage.persist();
  const persistent=navigator.storage.persisted?await navigator.storage.persisted():granted;
  $('persistenceStatus').textContent=persistent?'Trwała pamięć: tak.':'Trwała pamięć: nie — przeglądarka nie przyznała ochrony. Regularnie kopiuj dane.';
 }catch(e){$('persistenceStatus').textContent='Trwała pamięć: nie udało się sprawdzić ani uzyskać ochrony. Dane nadal zapisują się w localStorage.';}
}
function selectBackup(){
 $('backupPanel').open=true;$('manualBackup').hidden=false;
 const field=$('backupJson');field.focus();field.select();field.setSelectionRange(0,field.value.length);
}
function markBackupSaved(at){state.lastBackupAt=Math.max(state.lastBackupAt??0,at);save();renderBackupReminder();}
async function copyBackup(){
 const status=$('backupStatus');
 $('manualBackup').hidden=true;
 if(futureData||!broken)recordMetric('action','copy');
 if(futureData){
  $('backupJson').value=futureData.raw;
  try{await navigator.clipboard.writeText($('backupJson').value);status.textContent='Dane skopiowane. Zachowaj kopię poza aplikacją.';}
  catch(e){recordMetric('error','clipboard');selectBackup();status.textContent='Skopiuj ręcznie zaznaczoną kopię.';}
  return;
 }
 if(broken)return;
 const at=Date.now(),source=state;
 // Data w kopii opisuje wykonanie tej kopii. Lokalnie uznajemy ją za zapisaną
 // dopiero po sukcesie schowka lub ręcznym potwierdzeniu użytkownika.
 $('backupJson').value=encodeBackup(state,at,metricSnapshot());pendingBackupAt=at;
 $('backupSaved').hidden=true;
 try{
  await navigator.clipboard.writeText($('backupJson').value);
  // Nie oznaczaj innego stanu, np. wyczyszczonego podczas oczekiwania na schowek.
  if(state===source){markBackupSaved(at);pendingBackupAt=null;}
  status.textContent='Dane skopiowane. Zachowaj kopię poza aplikacją.';
 }catch(e){
  recordMetric('error','clipboard');
  if(state===source){$('backupSaved').hidden=false;selectBackup();}
  status.textContent='Skopiuj zaznaczony tekst i potwierdź zapisanie kopii.';
 }
}
$('backup').addEventListener('click',copyBackup);
$('backupSaved').addEventListener('click',()=>{if(pendingBackupAt===null)return;markBackupSaved(pendingBackupAt);pendingBackupAt=null;$('backupSaved').hidden=true;$('manualBackup').hidden=true;$('backupStatus').textContent='Zapisanie kopii potwierdzone.';});
function previewImport(incoming, events){
 const plan=importPlan(state,incoming),baseline=JSON.stringify(state);
 $('importStatus').textContent=plan.summary;
 ask('Przywrócić dane z kopii?',plan.summary,'Potwierdź przywrócenie',()=>{
  if(JSON.stringify(state)!==baseline){$('importStatus').textContent='Dane zmieniły się podczas podglądu. Sprawdź aktualne podsumowanie.';previewImport(incoming,events);return;}
  // Najpierw trwały zapis, dopiero potem podmiana stanu w pamięci.
  recordMetric('action','restore');
  if(!save(plan.next)){$('importStatus').textContent='Import nie został zapisany. Dotychczasowy stan pozostaje bez zmian.';return;}
  finishNoteMetric('replaced');
  queueImportedMetrics(events);
  replaceState(plan.next);pendingBackupAt=null;$('backupSaved').hidden=true;$('manualBackup').hidden=true;
  render();syncWake();$('importStatus').textContent='Import zakończony. Dodano interwałów: '+plan.added+'. Łącznie: '+state.entries.length+'.';
 });
}
$('importBackup').addEventListener('click',()=>{
 if(broken)return;
 try{
  const {incoming,events}=decodeBackup($('importJson').value);
  previewImport(incoming,events);
 }
 catch(e){$('importStatus').textContent='Nie można przywrócić kopii: '+e.message;}
});
$('delete').addEventListener('click',()=>{const e=edited();if(!e)return;ask('Usunąć ten wpis?',span(e)+'\nNotatka zostanie usunięta. Pomiar trwającego interwału będzie kontynuowany.','Usuń wpis',()=>{finishNoteMetric('replaced');recordMetric('action','delete');state.entries=state.entries.filter(x=>x.id!==e.id);state.editor=null;save();render();say('Wpis usunięty.');});});
$('clear').addEventListener('click',()=>ask('Wyczyścić wszystko?','Krok 1 z 2. Usuniesz wszystkie interwały i notatki oraz zatrzymasz pomiar. Najpierw możesz anulować i skopiować dane.','Dalej',()=>ask('Ostateczne potwierdzenie','Krok 2 z 2. Tego usunięcia nie można cofnąć.','Tak, usuń wszystko',()=>{
 const empty=fresh();
 if(!save(empty,true))return;
 clearMetrics();
 replaceState(empty);setBroken(false);pendingBackupAt=null;$('backupSaved').hidden=true;$('manualBackup').hidden=true;
 render();syncWake();$('backupStatus').textContent='Wszystkie dane wyczyszczone.';
})));
async function syncWake(){
 if(!('wakeLock' in navigator))return;
 if(!state.wake||!state.current||document.visibilityState!=='visible'){
  if(wakeLock){const old=wakeLock;wakeLock=null;try{await old.release();}catch(e){}}
  return;
 }
 if(wakeLock||wakePending)return;wakePending=true;
 try{const lock=await navigator.wakeLock.request('screen');wakeLock=lock;lock.addEventListener('release',()=>{if(wakeLock===lock)wakeLock=null;});}
 catch(e){}
 finally{wakePending=false;if(wakeLock&&(!state.wake||!state.current||document.visibilityState!=='visible'))syncWake();}
}
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='visible' && state.current)renderList();
 tick();syncWake();
});
window.addEventListener('pageshow',event=>{if(event.persisted && state.current)renderList();tick();syncWake();});
window.addEventListener('storage',event=>{
 if(event.key===EVENTS_KEY||event.key===null){
  if(event.newValue===null&&localStorageEventMatchesRemoval())discardPendingMetrics();
  if(event.key===EVENTS_KEY)return;
 }
 if(event.key!==KEY&&event.key!==null)return;
 try{
  if(!readStorageChange()){render();syncWake();return;}
  pendingBackupAt=null;$('backupSaved').hidden=true;$('manualBackup').hidden=true;setBroken(false);clearStorageError();
  if(noteMetric?.entryId!==state.editor)finishNoteMetric('replaced');
  render();syncWake();say('Wczytano zmianę z drugiej karty. Używaj jednej karty do pomiaru.');
 }catch(e){setBroken(true);render();storageError('Dane zmieniły się w innej karcie i nie można ich odczytać. Otwórz stronę ponownie.');}
});
document.addEventListener('visibilitychange',trackVisibility);
window.addEventListener('pageshow',trackVisibility);
window.addEventListener('pagehide',hideMetrics);
if(needsMigrationSave)save();
trackVisibility();
render();syncWake();requestPersistentStorage();setInterval(tick,500);

registerUpdates();
