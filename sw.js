/* BK Snooker Club POS V4 — Service Worker
   ໃຊ້ຍຸດທະສາດ "stale-while-revalidate": ສະແດງແຄສທັນທີ (ຖ້າມີ) ພ້ອມກັບໂຫຼດອັນໃໝ່ຈາກເນັດເວີກ
   ໃນພື້ນຫຼັງເພື່ອອັບເດດແຄສ — ເຮັດໃຫ້ແອັບໃຊ້ໄດ້ແບບ offline / ຢູ່ໜ້າຈໍ Home Screen (PWA) */
const CACHE_NAME = "bk-pos-v4";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(e.request).then((cached) => {
        const network = fetch(e.request)
          .then((res) => {
            if (res && res.status === 200) cache.put(e.request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
