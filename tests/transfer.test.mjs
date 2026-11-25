import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh} from '../js/migration.js';
import {encodeBackup,decodeBackup,importPlan,resolveImport} from '../js/exchange.js';

const entry=(id,note)=>({id,note,start:10,end:20,blocked:false,tag:''});
const local={...fresh(),entries:[entry('a','stara')],editor:'a',session:{start:1,end:null},current:{start:3}};
const source={...fresh(),entries:[entry('a','nowa'),entry('b','dodana')],session:{start:5,end:null},current:{start:9}};
const packet=await decodeBackup(encodeBackup(source,100,[]));

for(const side of ['local','incoming']){
 test('konflikt, potwierdzenie i powtórzenie po restarcie: '+side,()=>{
  const original=structuredClone(local);
  const choices=new Map([['a',side]]);
  assert.equal(importPlan(local,packet).conflicts.length,1);
  assert.throws(()=>resolveImport(local,packet,new Map()),/Wybierz/);
  assert.deepEqual(local,original);
  const next=resolveImport(local,packet,choices);
  assert.equal(next.entries.length,2);
  assert.equal(next.entries.find(e=>e.id==='a').note,side==='local'?'stara':'nowa');
  assert.equal(next.editor,local.editor);assert.deepEqual(next.current,local.current);
  const later=JSON.parse(JSON.stringify(next));later.entries[0].note='następna poprawka';
  assert.equal(resolveImport(later,packet,new Map()),later);
 });
}
test('ponowna serializacja i zmiana kolejności pól nie tworzą nowego konfliktu',async()=>{
 const obj=JSON.parse(encodeBackup(source,100,[]));
 obj.entries=obj.entries.map(e=>Object.fromEntries(Object.entries(e).reverse()));
 const again=await decodeBackup(JSON.stringify(obj));
 assert.equal(again.digest,packet.digest);
 assert.equal(importPlan(source,again).conflicts.length,0);
});
test('usunięty wpis, ustawienia urządzenia i lokalny rejestr decyzji',async()=>{
 const state={...fresh(),localTransfer:{deleted:['b']}};
 const next=resolveImport(state,packet,new Map(),{desktop:true,at:200});
 assert.deepEqual(next.entries.map(e=>e.id),['a']);assert.equal(next.current,null);
 assert.deepEqual(next.localTransfer.snapshot.current,source.current);
 assert.equal(next.localTransfer.lastImportAt,200);
 assert.equal(JSON.parse(encodeBackup(next,300,[])).localTransfer,undefined);
 const untrusted=await decodeBackup(JSON.stringify({...source,localTransfer:{receipts:[packet.digest]}}));
 assert.equal(untrusted.incoming.localTransfer,undefined);
});
test('przejęcie pomiaru wymaga jawnego wyboru na pustym telefonie',()=>{
 assert.equal(resolveImport(fresh(),packet,new Map()).current,null);
 assert.deepEqual(resolveImport(fresh(),packet,new Map(),{recover:true}).current,source.current);
 assert.throws(()=>resolveImport(fresh(),packet,new Map(),{desktop:true,recover:true}));
});
test('kopie v1 i v2 zachowują historyczne identyfikatory, schemaVersion ma pierwszeństwo',async()=>{
 const legacy={...source,version:1};delete legacy.schemaVersion;
 legacy.entries=legacy.entries.map(({tag,...rest})=>rest);
 const data=await decodeBackup(JSON.stringify(legacy));
 assert.deepEqual(data.incoming.entries.map(e=>e.id),['a','b']);
 await assert.rejects(decodeBackup(JSON.stringify({...legacy,schemaVersion:8})));
});
