// Service Worker Installation
self.addEventListener('install', (event) => {
    console.log("Service Worker Installed.");
    self.skipWaiting(); // Forces the new service worker to activate immediately
});

// Activate the Service Worker
self.addEventListener('activate', (event) => {
    console.log("Service Worker Activated.");
    return self.clients.claim();
});

// Keep the service worker active in the background
self.addEventListener('fetch', () => {});

// Handle periodic background sync
self.addEventListener('periodicsync', async (event) => {
    if (event.tag === 'send-location') {
        event.waitUntil(sendLocationToGoogleForms());
    }
});

// Function to send location updates
async function sendLocationToGoogleForms() {
    const clients = await self.clients.matchAll({ includeUncontrolled: true, type: "window" });
    if (clients.length === 0) return; // No active windows, stop tracking

    clients.forEach(client => {
        client.postMessage({ action: "send-location" });
    });
}
