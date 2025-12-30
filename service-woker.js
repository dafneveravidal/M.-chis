const CACHE_NAME = "study-app-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./estilo.css",
  "./app.js",
  "./manifest.json",
  "./relojj.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
