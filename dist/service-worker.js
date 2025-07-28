self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('asbou3i-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/app-icon-512.png'
        // أضف هنا ملفات CSS أو JS أخرى إذا كانت داخل dist
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});