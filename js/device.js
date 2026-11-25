const DEVICE_KEY='dziennik-interwalow-device-v1';
export function loadDevice(writable=true){
 const saved=JSON.parse(localStorage.getItem(DEVICE_KEY));
 if(saved && ['desktop','phone'].includes(saved.role))return saved;
 const role=localStorage.getItem('dziennik-interwalow-v1')!==null||/Android|iPhone|Mobile/i.test(navigator.userAgent)?'phone':'desktop';
 const device={deviceId:crypto.randomUUID(),role};
 if(writable)localStorage.setItem(DEVICE_KEY,JSON.stringify(device));
 return device;
}
export function changeRole(device,role){
 localStorage.setItem(DEVICE_KEY,JSON.stringify({...device,role}));
 location.reload();
}
