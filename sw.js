'use strict';

// tools/stamp_release.py owns these two lines.
const RELEASE = '70966858f49d4fbb';
const OFFLINE_INTEGRITY = {"index.html": "sha256-B9JtbgmXbhfEoR1zd9DhjNkbgrcL7bqn3rSzPKnVZQI=", "manifest.webmanifest": "sha256-/Y6AZjzj8V9APXYtA7Hy65l49W5QWjggxF0DojYhYog=", "styles.css": "sha256-Q1z1e39JYdAqnvssgTCIXwUilbH0comoOqFx2v5gDfc=", "icons/icon-192.png": "sha256-1bF/NceCm17VrSqD4K1krKsPrQvxsP2zlc4iphOcmKc=", "icons/icon-512.png": "sha256-uFcbbVpMplhx5XznwBIEidVtR+2+l13npjlTpuvl1J8=", "icons/maskable-512.png": "sha256-0SID54QHlZ3js4BrIjsAKjTqD8OCdXCz9LhLkyWJbqM=", "js/app.js": "sha256-sJ+3ouWCy8OJsEG+55HAlQeJSQiNqHn03+O+LW7IRKw=", "js/exchange.js": "sha256-izZfxhcMISGV/u2gmCnnBLdF226vBhdDfwaPcp8NeKc=", "js/metrics.js": "sha256-sltkBJV4My0pJTkfwpK6JxwXne/yyyxH3dsdbAgHL2M=", "js/migration.js": "sha256-VXUzilNBAH78ghglx2Hk2du2S4+Xcu1H2TJLgUH7HNE=", "js/presentation.js": "sha256-q+9iUu64nsMcHJCGRzQ1uaAyIavrj/nLZ3ZAkJ9qKt0=", "js/storage.js": "sha256-am0cr4f1HupUpEbKadtcI6u6eOgONY2La8kyNHHUC64=", "js/time.js": "sha256-GnDSbkR0HrrX3uWHurEYcYaBuxWWjwihM9FKeWQBn5U=", "js/update.js": "sha256-9TENwBsOWaagtgjAmYWleuHCyD+Njad1cBGU2s0BG0E="};

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
