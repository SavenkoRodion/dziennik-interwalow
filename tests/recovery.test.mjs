import {test} from 'node:test';
import assert from 'node:assert/strict';
import {captureRecovery,KEY} from '../js/recovery.js';

const manifest=['notes','unknown-module'].map(name=>({name,version:7,key:'dziennik-interwalow-data:'+name+':g42'}));
const main=JSON.stringify({schemaVersion:10,revision:'r42',manifest,unknown:{x:12}},null,2);
function fixture(){
 const data=new Map([[KEY,main],[manifest[0].key,' {"x": 1} '],[manifest[1].key,'null'],['unrelated','secret']]);
 return {data,getItem:key=>data.get(key)??null};
}
test('zgodny odbiorca odtwarza surowe wartości z JSON, włącznie z nieznanym modułem',()=>{
 const storage=fixture();
 const archive=JSON.parse(JSON.stringify(captureRecovery(storage)));
 assert.equal(archive.complete,true);assert.equal(archive.collections.length,2);
 const restored=new Map(archive.collections.map(({key,raw})=>[key,raw]));
 restored.set(archive.main.key,archive.main.raw);
 const recovered=JSON.parse(restored.get(KEY));
 assert.deepEqual(recovered.manifest,manifest);
 for(const {key} of recovered.manifest)assert.equal(restored.get(key),storage.getItem(key));
 assert.equal(restored.get(KEY),main);assert.equal(restored.has('unrelated'),false);
});
test('braki, obce klucze i uszkodzony manifest oznaczają kopię jako niepełną',()=>{
 const storage=fixture();storage.data.delete(manifest[0].key);
 const missing=captureRecovery(storage);
 assert.equal(missing.complete,false);assert.match(missing.issues[0],/notes/);
 for(const invalid of [null,[...manifest,{name:'foreign',key:'unrelated',version:1}],manifest.concat(manifest)]){
  storage.data.set(KEY,JSON.stringify({schemaVersion:5,manifest:invalid}));
  const result=captureRecovery(storage);
  assert.equal(result.complete,false);assert.ok(!result.collections.some(item=>item.raw==='secret'));
 }
});
test('zmiana rewizji w trakcie odczytu wymaga ponowienia eksportu',()=>{
 const storage=fixture();let reads=0;
 assert.throws(()=>captureRecovery({getItem:key=>key===KEY&&++reads===2?'{}':storage.getItem(key)}),/Powtórz/);
});
