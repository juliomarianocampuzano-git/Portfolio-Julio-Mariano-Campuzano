/* =====================================================================
   HABIB'S · SERVICE WORKER (modo offline: web + totem)
   ---------------------------------------------------------------------
   - Precarga todo lo necesario para que el totem abra sin internet.
   - HTML: red primero (3 s) y si no hay conexión, la copia guardada.
   - CSS y JS: red primero (3 s), así nunca se mezclan con un HTML de otra versión.
   - Fotos e íconos: caché primero (carga instantánea).
   - Tipografías propias en assets/fonts (precacheadas).
   Al publicar cambios, subir la VERSION para que los totems se actualicen.
   ===================================================================== */
var VERSION = "habibs-v3.2.0";
var CACHE_APP = VERSION + "-app";

// Núcleo que se guarda al instalar (web + totem funcionan sin internet).
// Las versiones AVIF y -sm de las fotos se guardan la primera vez que se ven.
var PRECARGA = [
  "./",
  "./index.html",
  "./totem.html",
  "./manifest.webmanifest",
  "./css/brand.css",
  "./css/web.css",
  "./css/motion.css",
  "./css/totem.css",
  "./js/menu-data.js",
  "./js/shared.js",
  "./js/web.js",
  "./js/totem.js",
  "./js/animations/core.js",
  "./js/animations/hero.js",
  "./js/animations/cintas.js",
  "./js/animations/asador.js",
  "./js/animations/menu.js",
  "./js/animations/cart.js",
  "./js/animations/cursor.js",
  "./js/vendor/gsap.min.js",
  "./js/vendor/ScrollTrigger.min.js",
  "./js/vendor/Flip.min.js",
  "./js/vendor/lenis.min.js",
  "./js/vendor/splitting.min.js",
  "./js/vendor/vanilla-tilt.min.js",
  "./js/vendor/confetti.browser.js",
  "./assets/fonts/bebas-neue-latin-400-normal.woff2",
  "./assets/fonts/outfit-latin-400-normal.woff2",
  "./assets/fonts/outfit-latin-500-normal.woff2",
  "./assets/fonts/outfit-latin-600-normal.woff2",
  "./assets/fonts/outfit-latin-700-normal.woff2",
  "./assets/icons/favicon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/fotos/burger.webp",
  "./assets/fotos/drinks.webp",
  "./assets/fotos/fries.webp",
  "./assets/fotos/hero-cheese.webp",
  "./assets/fotos/hero-spit.webp",
  "./assets/fotos/kibbe.webp",
  "./assets/fotos/lomito-carne.webp",
  "./assets/fotos/lomito-noche.webp",
  "./assets/fotos/lomito-noche-movil.avif",
  "./assets/fotos/lomito-noche-movil.webp",
  "./assets/fotos/lomito-pollo.webp",
  "./assets/fotos/pizza-borde.webp",
  "./assets/fotos/shawarma.webp",
  "./assets/fotos/smash.webp"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_APP)
      .then(function (cache) {
        // "reload": no reutiliza copias viejas de la caché HTTP del navegador
        return cache.addAll(
          PRECARGA.map(function (ruta) {
            return new Request(ruta, { cache: "reload" });
          })
        );
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (claves) {
        return Promise.all(
          claves
            .filter(function (c) {
              return c !== CACHE_APP;
            })
            .map(function (c) {
              return caches.delete(c);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

// Red con límite de tiempo: si la red tarda, se usa la caché
function redConTimeout(request, ms) {
  return new Promise(function (resolve, reject) {
    var timer = setTimeout(reject, ms);
    fetch(request).then(
      function (res) {
        clearTimeout(timer);
        resolve(res);
      },
      function (err) {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  if (url.origin !== self.location.origin) return;

  // 1) Páginas: red primero (3 s), si no hay conexión la copia guardada
  if (req.mode === "navigate") {
    event.respondWith(
      redConTimeout(req, 3000)
        .then(function (res) {
          var copia = res.clone();
          caches.open(CACHE_APP).then(function (cache) {
            cache.put(req, copia);
          });
          return res;
        })
        .catch(function () {
          return caches.match(req, { ignoreSearch: true }).then(function (r) {
            return r || caches.match("./totem.html");
          });
        })
    );
    return;
  }

  function guardar(res) {
    if (res && res.ok) {
      var copia = res.clone();
      caches.open(CACHE_APP).then(function (cache) {
        cache.put(req, copia);
      });
    }
    return res;
  }

  // 2) Fotos e íconos: caché primero (no cambian; carga instantánea)
  if (req.destination === "image") {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then(function (guardada) {
        return (
          guardada ||
          fetch(req)
            .then(guardar)
            .catch(function () {
              // Sin internet y sin esa variante guardada: se usa la .webp precargada de la misma foto
              return caches.match(url.pathname.replace(/(-sm|-movil)?\.(avif|webp)$/, ".webp"));
            })
        );
      })
    );
    return;
  }

  // 3) CSS, JS y datos del menú: red primero (3 s), sin internet la copia guardada
  event.respondWith(
    redConTimeout(new Request(req, { cache: "no-cache" }), 3000)
      .then(guardar)
      .catch(function () {
        return caches.match(req, { ignoreSearch: true });
      })
  );
});
