"use strict"; // Strikte syntax volgens protocol

// Constante met een Array van alle files die ik wil cachen.
const urlsToCache = [
	"/",
	"/index.html",
	"/assets/css/main.min.css",
	"/assets/js/main.js",
	"/assets/js/sw.js",
	"/manifest.json",
	"/favicon.ico",
	"/assets/icons/icon_48x48.png",
	"/assets/icons/icon_128x128.png",
	"/assets/icons/icon_192x192.png",
	"/assets/icons/icon_512x512.png"
];

// Installeren Service Worker.
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open("todo-cache") // Naam van cache
			.then((cache) => cache.addAll(urlsToCache))
	);
});

// Fetchen van events.
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request)
			.then((response) => response || fetch(event.request))
	);
});