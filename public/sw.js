const CACHE_NAME = "maakolat-alsham-v1";
const PRECACHE_URLS = [
  "/logo-horizontal.webp",
  "/logo-mobile.webp",
  "/logo-emblem.png",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/_vercel/")
  ) {
    return;
  }

  event.respondWith(
    fetch(request, request.mode === "navigate" ? { cache: "no-cache" } : undefined)
      .then((response) => {
        if (
          response &&
          response.status === 200 &&
          (url.pathname.startsWith("/images/") || PRECACHE_URLS.includes(url.pathname))
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw new Error("Network error");
      })
  );
});
