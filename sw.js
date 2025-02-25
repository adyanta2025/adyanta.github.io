self.addEventListener("install", (event) => {
    console.log("Service Worker Installed");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker Activated");
    self.clients.claim();
});

// Resume tracking when the browser is reopened
self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("index.html")) {
        event.waitUntil(clients.matchAll().then((clients) => {
            clients.forEach((client) => {
                client.postMessage("resumeTracking");
            });
        }));
    }
});
