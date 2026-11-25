export const KEY='dziennik-interwalow-v1';
const PREFIX='dziennik-interwalow-data:';

// manifest: [{name, version, key}]. Only immutable generation keys belong here.
export function captureRecovery(storage){
 const raw=storage.getItem(KEY);
 const manifest=JSON.parse(raw)?.manifest;
 const collections=[],issues=[],names=new Set(),keys=new Set();
 if(!Array.isArray(manifest))issues.push('Brak poprawnej listy kolekcji.');
 else for(const item of manifest){
  if(!item || typeof item.name!=='string'||!item.name||!Number.isSafeInteger(item.version)||item.version<1||
     typeof item.key!=='string'||!item.key.startsWith(PREFIX)||keys.has(item.key)||names.has(item.name)){
   issues.push('Nieprawidłowa lub powtórzona pozycja manifestu.');continue;
  }
  names.add(item.name);keys.add(item.key);
  const value=storage.getItem(item.key);
  collections.push({...item,raw:value});
  if(value===null)issues.push('Brakuje kolekcji '+item.name+' ('+item.key+').');
 }
 if(storage.getItem(KEY)!==raw)throw Error('Zapis zmienił się podczas odczytu. Powtórz eksport.');
 return {format:'journal-recovery/v1',main:{key:KEY,raw},collections,complete:issues.length===0,issues};
}
