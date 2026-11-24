'use strict';

// tools/stamp_release.py owns these two lines.
const RELEASE = 'e4a05500a9f367f8';
const OFFLINE_INTEGRITY = {"index.html": "sha256-8vOQnj1P6lXW0nH4OXQ0Xm68hSlrdryCtfNgklkfcY8=", "manifest.webmanifest": "sha256-/Y6AZjzj8V9APXYtA7Hy65l49W5QWjggxF0DojYhYog=", "icons/icon-192.png": "sha256-1bF/NceCm17VrSqD4K1krKsPrQvxsP2zlc4iphOcmKc=", "icons/icon-512.png": "sha256-uFcbbVpMplhx5XznwBIEidVtR+2+l13npjlTpuvl1J8=", "icons/maskable-512.png": "sha256-0SID54QHlZ3js4BrIjsAKjTqD8OCdXCz9LhLkyWJbqM="};

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
