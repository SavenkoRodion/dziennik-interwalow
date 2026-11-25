import {$} from './presentation.js';
import {recordMetric} from './metrics.js';

export function registerUpdates(){
 $('appRelease').textContent=document.querySelector('meta[name="app-release"]').content;
 if('serviceWorker' in navigator){
  const serviceWorker=navigator.serviceWorker;
  serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(registration=>{
   let requestedWorker=null;
   function showUpdate(){
    $('appUpdate').hidden=!registration.waiting;
    $('applyUpdate').disabled=!!requestedWorker;
   }
   function watchInstallation(){
    registration.installing?.addEventListener('statechange',showUpdate);
   }
   const checkForUpdate=()=>registration.update().catch(()=>{});
   registration.addEventListener('updatefound',watchInstallation);
   watchInstallation();
   showUpdate();
   serviceWorker.addEventListener('controllerchange',()=>{
    if(requestedWorker&&serviceWorker.controller===requestedWorker)location.reload();
    else showUpdate();
   });
   $('applyUpdate').addEventListener('click',()=>{
    const waiting=registration.waiting;
    if(!waiting||requestedWorker)return;
    const controlled=!!serviceWorker.controller;
    requestedWorker=waiting;
    showUpdate();
    waiting.addEventListener('statechange',()=>{
     if(waiting.state==='activated'&&!controlled)location.reload();
     if(waiting.state==='redundant'){requestedWorker=null;showUpdate();}
    });
    waiting.postMessage('SKIP_WAITING');
    recordMetric('action','update');
   });
   document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible')checkForUpdate();
   });
   window.addEventListener('online',checkForUpdate);
   checkForUpdate();
  }).catch(error=>{
   recordMetric('error','sw_register');
   console.warn('Nie udało się uruchomić obsługi offline.',error);
  });
 }
}
