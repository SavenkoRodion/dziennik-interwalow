import {SCHEMA_VERSION, fresh, migrateState} from './migration.js';
import {EVENTS_KEY, clearMetrics, recordMetric, suspendMetrics} from './metrics.js';

// Klucz pozostaje stały; format danych określa schemaVersion.
import {KEY} from './recovery.js';
let loadedRaw=null;
let state = fresh(), broken = false, needsMigrationSave = false;
let effects;

let futureData = null;
function detectFutureData(raw) {
 if(raw===null)return false;
 const parsed=JSON.parse(raw);
 if(!(parsed?.schemaVersion>SCHEMA_VERSION))return false;
 const firstDetection=futureData===null;
 futureData={raw,parsed};
 broken=true;
 suspendMetrics(true);effects.onFutureData();
 if(firstDetection){
  state=fresh();state.filter='all';
 }
 effects.showError('Dane zapisała nowsza wersja dziennika. Zapis jest zablokowany. Możesz użyć „Kopiuj dane” w ustawieniach. Otwórz aktualną wersję aplikacji.');
 return true;
}
function initializeStorage(callbacks){
 effects=callbacks;
 try{
  const raw=localStorage.getItem(KEY);
  loadedRaw=raw;
  if(raw===null||detectFutureData(raw))return;
  const parsed=JSON.parse(raw);
  state=migrateState(parsed);
  needsMigrationSave=parsed.schemaVersion!==SCHEMA_VERSION;
 }catch(e){
  broken=true;
  effects.showError('Nie można odczytać zapisanych danych. Nie nadpisujemy ich. Spróbuj ponownie otworzyć stronę; "Wyczyść wszystko" pozwala świadomie zacząć od nowa.');
 }
}

function save(nextState=state, reset=false){
 if(broken&&!reset)return false;
 try{
  const raw=localStorage.getItem(KEY);
  let newer=false;
  try{newer=detectFutureData(raw);}catch(e){if(!reset)throw e;}
  if(newer||futureData){
   effects.onBlockedSave();return false;
  }
  if(raw!==loadedRaw){
   effects.showError('Dane zmieniły się w innej karcie. Odśwież widok przed zapisem.');return false;
  }
  const serialized=JSON.stringify(nextState);
  try{localStorage.setItem(KEY,serialized);}
  catch(error){
   if(error.name!=='QuotaExceededError'||localStorage.getItem(EVENTS_KEY)===null)throw error;
   // Zwolnij miejsce zajęte przez metryki przed ponowną próbą głównego zapisu.
   clearMetrics();
   localStorage.setItem(KEY,serialized);
  }
  loadedRaw=serialized;effects.clearError();return true;
 }
 catch(e){recordMetric('error','state_write');effects.showError('Nie udało się zapisać zmian w przeglądarce (np. brak miejsca lub zablokowany zapis). Bieżące dane są tylko w pamięci — skopiuj dane przed zamknięciem strony.');return false;}
}
function readStorageChange(){
 const raw=localStorage.getItem(KEY);
 if(detectFutureData(raw))return false;
 state=raw===null?fresh():migrateState(JSON.parse(raw));
 loadedRaw=raw;futureData=null;suspendMetrics(false);
 return true;
}

function replaceState(nextState){state=nextState;}
function setBroken(value){broken=value;}

export {KEY, state, broken, needsMigrationSave, futureData, initializeStorage, save,
 readStorageChange, replaceState, setBroken};

export async function withWriteLock(action){
 const run=()=>{
  try{
   if(localStorage.getItem(KEY)!==loadedRaw){
    if(readStorageChange())broken=false;
    effects.onBlockedSave();
    effects.showError('Wczytano zmianę z innej karty. Sprawdź dane i powtórz czynność.');
    return;
   }
   return action();
  }catch(error){effects.showError('Nie udało się wykonać zapisu. '+error.message);}
 };
 // Bez Web Locks pomiar nadal działa; spójność zapisu pilnuje porównanie z loadedRaw w save().
 return navigator.locks?navigator.locks.request(KEY,run):run();
}
