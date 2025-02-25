// Install Service Worker
self.addEventListener('install', (event) => {
    console.log("Service Worker Installed.");
    self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    console.log("Service Worker Activated.");
    return self.clients.claim();
});

// Keep Service Worker active
self.addEventListener('fetch', () => {});

// Ensure tracking continues in the background
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

// Restart tracking when browser reopens
self.addEventListener('message', (event) => {
    if (event.data.action === "send-location") {
        sendLocationToGoogleForms();
    }
});
