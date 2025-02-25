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

// Background sync for location updates
self.addEventListener("sync", (event) => {
    if (event.tag === "syncLocation") {
        event.waitUntil(
            fetch("https://docs.google.com/forms/d/e/1FAIpQLScQpsQr3scRzvEtZJhZQ9fbJ3e-0DiCxQjLotqM6fEst-f-9w/formResponse", {
                method: "POST",
                body: localStorage.getItem("lastLocation"),
                mode: "no-cors",
            }).then(() => {
                console.log("Location data sent from sync event.");
            }).catch((err) => console.error("Sync failed:", err))
        );
    }
});
