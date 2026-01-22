// Minimal service worker to prevent 404 errors
// This service worker does nothing but prevents browser errors

self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(clients.claim());
});

// No fetch handler - let requests pass through normally
