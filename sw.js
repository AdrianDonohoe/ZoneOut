'use strict';
const CACHE='zoneout-v11';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  if(e.request.mode==='navigate'){
    // network-first for pages so updates land immediately; cache fallback offline
    e.respondWith(
      fetch(e.request).then(res=>{
        const cl=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,cl));
        return res;
      }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
    );
    return;
  }
  // cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      if(res.ok&&new URL(e.request.url).origin===location.origin){
        const cl=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,cl));
      }
      return res;
    }))
  );
});
