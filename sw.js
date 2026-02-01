const CACHE_NAME = 'gp-redeem-v2';
const ASSETS = [
    './',
    './index.html',
    './balance.html',
    './redeem.html',
    './pin.html',
    './success.html',
    './add_money.html',
    './style.css',
    './script.js',
    './images/logo.png',
    './images/icon.png',
    './images/slider_06.png',
    './images/termsandcondition.png',
    './images/popup_6.png',
    'https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap'
];

// Install Event
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching Files');
            return cache.addAll(ASSETS).catch(err => {
                console.error('Service Worker: Cache addition failed', err);
                // Try caching files one by one if addAll fails
                return Promise.all(
                    ASSETS.map(url => {
                        return cache.add(url).catch(e => console.warn(`Failed to cache ${url}:`, e));
                    })
                );
            });
        })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return from cache or fetch from network
            return response || fetch(event.request).then(fetchRes => {
                return caches.open(CACHE_NAME).then(cache => {
                    // Optionally cache new requests on the fly
                    // cache.put(event.request.url, fetchRes.clone());
                    return fetchRes;
                });
            });
        }).catch(() => {
            // Fallback for offline if not found in cache
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});
