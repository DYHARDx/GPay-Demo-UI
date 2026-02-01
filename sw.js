const CACHE_NAME = 'gp-redeem-v1';
const ASSETS = [
    './',
    './index.html',
    './balance.html',
    './redeem.html',
    './pin.html',
    './success.html',
    './style.css',
    './script.js',
    './images/slider_06.png',
    './images/termsandcondition.png',
    './images/popup_6.png',
    './images/icon.png',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
];

// Install Event - Cache Files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS);
            })
    );
});

// Fetch Event - Serve from Cache if Offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found, else fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
