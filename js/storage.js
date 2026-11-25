import {SCHEMA_VERSION, fresh, migrateState} from './migration.js';
import {EVENTS_KEY, clearMetrics, recordMetric} from './metrics.js';

// Klucz pozostaje stały; format danych określa schemaVersion.
const KEY = 'dziennik-interwalow-v1';
let state = fresh(), broken = false, needsMigrationSave = false, reportedFutureSchema = false;
let effects;

let futureData = null;
function detectFutureData(raw) {
 if(raw===null)return false;
 const parsed=JSON.parse(raw);
 if(!(parsed?.schemaVersion>SCHEMA_VERSION))return false;
 const firstDetection=futureData===null;
 futureData={raw,parsed};
 broken=true;
 effects.onFutureData();
 if(firstDetection){
  state=fresh();state.filter='all';
  if(!reportedFutureSchema){reportedFutureSchema=true;recordMetric('error','future_schema');}
 }
 effects.showError('Dane zapisała nowsza wersja dziennika. Zapis jest zablokowany. Możesz użyć „Kopiuj dane” w ustawieniach. Otwórz aktualną wersję aplikacji.');
 return true;
}
function initializeStorage(callbacks){
 effects=callbacks;
 try{
  const raw=localStorage.getItem(KEY);
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
  const serialized=JSON.stringify(nextState);
  try{localStorage.setItem(KEY,serialized);}
  catch(error){
   if(error.name!=='QuotaExceededError'||localStorage.getItem(EVENTS_KEY)===null)throw error;
   // Zwolnij miejsce zajęte przez metryki przed ponowną próbą głównego zapisu.
   clearMetrics();
   localStorage.setItem(KEY,serialized);
  }
  effects.clearError();return true;
 }
 catch(e){recordMetric('error','state_write');effects.showError('Nie udało się zapisać zmian w przeglądarce (np. brak miejsca lub zablokowany zapis). Bieżące dane są tylko w pamięci — skopiuj dane przed zamknięciem strony.');return false;}
}
function readStorageChange(){
 const raw=localStorage.getItem(KEY);
 if(detectFutureData(raw))return false;
 state=raw===null?fresh():migrateState(JSON.parse(raw));
 futureData=null;
 return true;
}

function replaceState(nextState){state=nextState;}
function setBroken(value){broken=value;}

export {KEY, state, broken, needsMigrationSave, futureData, initializeStorage, save,
 readStorageChange, replaceState, setBroken};
