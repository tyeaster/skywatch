/* SKYWATCH service worker — caches the app shell so the site installs as a
   PWA, loads instantly, and shows its last state offline. Live weather data
   (APIs, tiles, images) is never intercepted, so it always stays fresh. */
const CACHE = "skywatch-shell-v1";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
];

self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>Promise.allSettled(SHELL.map(u=>c.add(u))))   // tolerate any single asset failing
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys()
      .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", e=>{
  const req=e.request;
  if(req.method!=="GET") return;
  const url=new URL(req.url);

  // App navigations: network-first (fresh when online), cached shell offline.
  if(req.mode==="navigate"){
    e.respondWith(
      fetch(req)
        .then(resp=>{ const copy=resp.clone(); caches.open(CACHE).then(c=>c.put("./index.html",copy)); return resp; })
        .catch(()=>caches.match("./index.html"))
    );
    return;
  }

  // Same-origin static assets + Leaflet CDN: cache-first (they're URL-versioned).
  const isShell = url.origin===location.origin || url.host==="unpkg.com";
  if(isShell){
    e.respondWith(
      caches.match(req).then(hit=>hit || fetch(req).then(resp=>{
        const copy=resp.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return resp;
      }).catch(()=>caches.match(req)))
    );
    return;
  }
  // Everything else (weather APIs, map tiles, chart images): pass through — no caching.
});
