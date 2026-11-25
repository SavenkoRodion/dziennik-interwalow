const pad = n => String(n).padStart(2,'0');
const date = ts => {const d = new Date(ts);return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;};
const time = ts => {const d = new Date(ts);return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;};
const duration = ms => {const s = Math.max(0,Math.floor(ms/1000)),m = Math.floor(s/60);return m < 60 ? `${pad(m)}:${pad(s%60)}` : `${Math.floor(m/60)}:${pad(m%60)}:${pad(s%60)}`;};
const validTime = n => Number.isFinite(n) && n >= 0 && n <= 8640000000000000;

function midnight(ts,offset=0){
 const d=new Date(ts);
 return new Date(d.getFullYear(),d.getMonth(),d.getDate()+offset).getTime();
}
function groupDays({entries, current}, now){
 const days=new Map();
 function split(entry,running){
  const end=running?Math.max(entry.start,now):entry.end;
  let start=entry.start, boundary;
  do {
   const key=midnight(start);
   boundary=midnight(start,1);
   const stop=Number.isFinite(boundary)?Math.min(end,boundary):end;
   if(!days.has(key))days.set(key,{key,total:0,parts:[]});
   const day=days.get(key);
   const part={entry,start,stop,end,running,live:running&&stop!==boundary};
   day.total+=stop-start;
   day.parts.push(part);
   start=stop;
  } while(start<end || (running&&start===boundary));
 }
 for(const entry of entries)split(entry,false);
 if(current)split(current,true);
 return [...days.values()].sort((a,b)=>b.key-a.key);
}

export {pad, date, time, duration, validTime, midnight, groupDays};
