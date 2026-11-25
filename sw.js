'use strict';

// tools/stamp_release.py owns these two lines.
const RELEASE = 'f2447e3da16e0ab8';
const OFFLINE_INTEGRITY = {"index.html": "sha256-KkSByBuOWU4UhEjA9XNhpfuvuT4lucjFY3priKKkEt0=", "manifest.webmanifest": "sha256-/Y6AZjzj8V9APXYtA7Hy65l49W5QWjggxF0DojYhYog=", "styles.css": "sha256-rF2PdswsRoy3gP5q4OJrVlULdKXdtGzRXsJlkrFT01A=", "icons/icon-192.png": "sha256-1bF/NceCm17VrSqD4K1krKsPrQvxsP2zlc4iphOcmKc=", "icons/icon-512.png": "sha256-uFcbbVpMplhx5XznwBIEidVtR+2+l13npjlTpuvl1J8=", "icons/maskable-512.png": "sha256-0SID54QHlZ3js4BrIjsAKjTqD8OCdXCz9LhLkyWJbqM=", "js/app.js": "sha256-NBacLBsju06TxAdk6QI3qf/Ht2mNcH2oOcDAlZKKMjw=", "js/device.js": "sha256-hVTowFiHce6dIZecJr1zHVQZvQsR1qdgg6ME4KuegJE=", "js/exchange.js": "sha256-p1Fj/+UocbItEQCrqh7AJpzR+KOqED+GeVA+/VXkb9Q=", "js/metrics.js": "sha256-5TffS8HuTxW2cmuCkIyWJLnE30XaKbIpgZMh6ZtiHw8=", "js/migration.js": "sha256-VXUzilNBAH78ghglx2Hk2du2S4+Xcu1H2TJLgUH7HNE=", "js/presentation.js": "sha256-ZYHB2RKO/NZqxHsBjf0KgIi2n75KEBcXDzBXIldQy7s=", "js/recovery.js": "sha256-hDIpsNFGKR/Kf6J9tSysWgv4pzPa1jhbO9Fw1kKytMo=", "js/storage.js": "sha256-4us61BNJ8E0rd4OZNxTujaLITOrcZfHoWVCG3b1+N14=", "js/time.js": "sha256-GnDSbkR0HrrX3uWHurEYcYaBuxWWjwihM9FKeWQBn5U=", "js/transfer-ui.js": "sha256-erEfiEkx5H6+zrKRbCUFKfhpe5kWdpML7MXe8KklyUs=", "js/update.js": "sha256-9TENwBsOWaagtgjAmYWleuHCyD+Njad1cBGU2s0BG0E="};

const scope = new URL(self.registration.scope);
const cachePrefix = 'dziennik-interwalow:' + scope.pathname + ':';
const cacheName = cachePrefix + RELEASE;
const index = new URL('index.html', scope);
const assets = new Map(Object.entries(OFFLINE_INTEGRITY).map(([path, integrity]) =>
  [new URL(path, scope).href, integrity]
));

function releaseRequest(url) {
  return new Request(url, {cache: 'reload', redirect: 'error', integrity: assets.get(url)});
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    if (!assets.has(index.href)) throw new Error('Offline files have not been stamped.');
    const requests = Array.from(assets.keys(), releaseRequest);
    const cache = await caches.open(cacheName);
    await cache.addAll(requests);
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith(cachePrefix) && name !== cacheName)
      .map(name => caches.delete(name)));
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') event.waitUntil(self.skipWaiting());
});

self.addEventListener('fetch', event => {
  const {request} = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const isAppPage = request.mode === 'navigate' && url.origin === scope.origin &&
    (url.pathname === scope.pathname || url.pathname === index.pathname);
  if (!isAppPage && !assets.has(url.href)) return;

  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const assetUrl = isAppPage ? index.href : url.href;
    return await cache.match(assetUrl) || fetch(releaseRequest(assetUrl));
  })());
});
