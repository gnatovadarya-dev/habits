const CACHE="habits-v3";
const SHELL=["./","index.html","app.js","content.js","photos.js","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;const url=new URL(req.url);
  if(url.origin===location.origin){
    // own files: network first so updates arrive, cache as offline fallback
    e.respondWith(fetch(req).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(req,c))}return r})
      .catch(()=>caches.match(req).then(hit=>hit||caches.match("index.html"))));
    return;
  }
  // fonts etc.: cache first
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok||r.type==="opaque"){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(req,c))}return r})));
});
