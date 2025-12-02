// Dr. Maycon App - Service Worker
const CACHE_NAME = 'dr-maycon-app-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icon.png',
  '/assets/favicon.png',
  '/assets/doctor.png',
  '/assets/maria.png',
];

// Install event - precache assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response and update cache in background
          event.waitUntil(
            fetch(event.request)
              .then((response) => {
                if (response && response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(CACHE_NAME)
                    .then((cache) => {
                      cache.put(event.request, responseClone);
                    });
                }
              })
              .catch(() => {
                // Network failed, that's ok - we have the cached version
              })
          );
          return cachedResponse;
        }
        
        // No cache - fetch from network
        return fetch(event.request)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response and cache it
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Network failed and no cache - show offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');
  
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  
  const title = data.title || 'Dr. Maycon App';
  const options = {
    body: data.body || 'Você tem uma nova notificação',
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click');
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Sync event:', event.tag);
  
  if (event.tag === 'sync-appointments') {
    event.waitUntil(syncAppointments());
  }
  
  if (event.tag === 'sync-symptoms') {
    event.waitUntil(syncSymptoms());
  }
});

// Sync appointments function
async function syncAppointments() {
  try {
    const pendingAppointments = await getPendingData('appointments');
    for (const appointment of pendingAppointments) {
      // TODO: Send to server when API is available
      console.log('[ServiceWorker] Syncing appointment:', appointment);
    }
    await clearPendingData('appointments');
  } catch (error) {
    console.error('[ServiceWorker] Sync appointments failed:', error);
  }
}

// Sync symptoms function
async function syncSymptoms() {
  try {
    const pendingSymptoms = await getPendingData('symptoms');
    for (const symptom of pendingSymptoms) {
      // TODO: Send to server when API is available
      console.log('[ServiceWorker] Syncing symptom:', symptom);
    }
    await clearPendingData('symptoms');
  } catch (error) {
    console.error('[ServiceWorker] Sync symptoms failed:', error);
  }
}

// Helper functions for IndexedDB
async function getPendingData(storeName) {
  // Placeholder - implement with IndexedDB
  return [];
}

async function clearPendingData(storeName) {
  // Placeholder - implement with IndexedDB
}

console.log('[ServiceWorker] Loaded successfully');


