import {validTime} from './time.js';

const SCHEMA_VERSION = 3;
const fresh = () => ({schemaVersion:SCHEMA_VERSION,session:null,current:null,entries:[],editor:null,wake:false,filter:'today',lastBackupAt:null});

function validateBase(s) {
 if (!s || typeof s!=='object' || Array.isArray(s) || !Array.isArray(s.entries) || typeof s.wake!=='boolean' || !['today','all'].includes(s.filter)) throw Error('Nieprawidłowa struktura stanu.');
 if (s.session!==null && (!s.session || !validTime(s.session.start) || (s.session.end!==null && (!validTime(s.session.end) || s.session.end<s.session.start)))) throw Error('Nieprawidłowy zakres pomiaru.');
 if (s.current!==null && (!s.current || !validTime(s.current.start) || !s.session || s.session.end!==null || s.current.start<s.session.start)) throw Error('Nieprawidłowy bieżący interwał.');
 if (s.session && s.session.end===null && s.current===null) throw Error('Brak bieżącego interwału w aktywnym pomiarze.');
 const ids = new Set();
 for (const e of s.entries) {if (!e || typeof e.id!=='string' || !e.id || ids.has(e.id) || !validTime(e.start) || !validTime(e.end) || e.end<e.start || typeof e.note!=='string' || typeof e.blocked!=='boolean') throw Error('Nieprawidłowy interwał lub powtórzony identyfikator.');ids.add(e.id);}
 if (s.editor!==null && (typeof s.editor!=='string' || !ids.has(s.editor))) throw Error('Nieprawidłowy edytowany wpis.');
 return s;
}
function validateV1(s) {validateBase(s);return s;}
// Każda kolejna migracja ma osobną funkcję i zachowuje pozostałe pola.
function migrateV1ToV2(s) {
 return {...s,schemaVersion:2,entries:s.entries.map(e=>({...e,tag:e.tag??''})),lastBackupAt:s.lastBackupAt??null};
}
function validateVersion(s, version) {
 validateBase(s);
 if(s.schemaVersion!==version || (s.lastBackupAt!==null&&!validTime(s.lastBackupAt)) || s.entries.some(e=>typeof e.tag!=='string')) throw Error('Nieprawidłowa struktura wersjonowanych danych.');
 return s;
}
function migrateState(s) {
 let version=s?.schemaVersion??s?.version;
 if(version===1){validateV1(s);s=migrateV1ToV2(s);version=2;}
 if(version===2){validateVersion(s,2);s={...s,schemaVersion:3};version=3;}
 if(version!==SCHEMA_VERSION)throw Error('Nieobsługiwana wersja danych. Nie zmieniono lokalnych danych.');
 const {events, ...mainState} = validateVersion(s,3);
 return mainState;
}
export {SCHEMA_VERSION, fresh, validateVersion, migrateState};
