/* =====================================================================
   HABIB'S · MENÚ
   - Filtro de categorías con GSAP Flip: las tarjetas se reacomodan,
     las que salen se encogen y las que entran aparecen.
   - Entrada de tarjetas en ráfagas con ScrollTrigger.batch.
   - Inclinación 3D con vanilla-tilt solo en desktop con mouse
     (se carga bajo demanda: en celulares no se descarga).
   ===================================================================== */
(function () {
  "use strict";
  var HM = window.HM;
  if (!HM || !HM.activo) return;
  var g = HM.gsap;
  var ST = HM.ST;
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  // ---------- Entrada en ráfaga ----------
  function entrada(contenedor) {
    var cards = $$(".card", contenedor).filter(function (c) { return !c.hidden; });
    if (!cards.length) return;
    g.set(cards, { opacity: 0, y: HM.movil ? 40 : 70 });
    ST.batch(cards, {
      start: "top 92%",
      once: true,
      onEnter: function (lote) {
        g.to(lote, {
          opacity: 1,
          y: 0,
          duration: HM.movil ? 0.6 : 0.8,
          stagger: 0.08,
          ease: "power3.out",
          overwrite: true,
          onComplete: function () { inclinar(lote); }
        });
      }
    });
  }
  ["#grilla-favoritos", "#grilla-menu"].forEach(function (s) {
    var c = document.querySelector(s);
    if (c) entrada(c);
  });

  // ---------- Filtro con Flip ----------
  // 1) Las que se van se desvanecen. 2) Se aplica el filtro. 3) Flip lleva a las que
  // quedan a su nueva posición y las nuevas aparecen. Sin "absolute": la grilla nunca
  // se colapsa, así la página no salta durante la transición.
  if (window.Flip) {
    var Flip = window.Flip;
    var grilla = document.getElementById("grilla-menu");
    var turno = 0; // si llega otro clic a mitad de camino, la transición anterior se descarta

    HM.transicionMenu = function (aplicar) {
      var miTurno = ++turno;
      var cards = $$(".card", grilla);
      g.killTweensOf(cards);
      var previas = cards.filter(function (c) { return !c.hidden; });
      // Las que el batch todavía no había mostrado quedan listas para medirlas
      g.set(cards, { opacity: 1, y: 0, x: 0, scale: 1 });

      // Se aplica el filtro para saber qué cambia y se vuelve atrás sin que llegue a pintarse
      aplicar();
      var nuevas = cards.filter(function (c) { return !c.hidden; });
      cards.forEach(function (c) { c.hidden = previas.indexOf(c) < 0; });

      var seVan = previas.filter(function (c) { return nuevas.indexOf(c) < 0; });
      var quedan = previas.filter(function (c) { return nuevas.indexOf(c) >= 0; });
      var entran = nuevas.filter(function (c) { return previas.indexOf(c) < 0; });
      var estado = quedan.length ? Flip.getState(quedan) : null;

      function cierre() {
        if (miTurno === turno) HM.ST.refresh(); // cambió el alto del menú: recalcular pin y disparadores
      }
      function reacomodar() {
        if (miTurno !== turno) return;
        g.set(seVan, { opacity: 1, scale: 1 });
        aplicar();
        g.fromTo(entran, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.04, ease: "back.out(1.5)" });
        if (estado) Flip.from(estado, { duration: 0.5, ease: "power3.inOut", stagger: 0.02, onComplete: cierre });
        else g.delayedCall(0.5, cierre);
      }
      if (seVan.length) g.to(seVan, { opacity: 0, scale: 0.9, duration: 0.2, ease: "power2.in", onComplete: reacomodar });
      else reacomodar();
    };
  }

  // Chips: pequeño rebote al elegir
  document.addEventListener("click", function (e) {
    var chip = e.target.closest("#chips-menu [data-cat]");
    if (chip) g.fromTo(chip, { scale: 0.88 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
  });

  // ---------- vanilla-tilt (solo desktop con mouse) ----------
  var tiltCargado = null;
  function cargarTilt() {
    if (tiltCargado) return tiltCargado;
    tiltCargado = new Promise(function (ok) {
      if (window.VanillaTilt) return ok();
      var s = document.createElement("script");
      s.src = "js/vendor/vanilla-tilt.min.js";
      s.async = true;
      s.onload = function () { ok(); };
      s.onerror = function () { ok(); };
      document.head.appendChild(s);
    });
    return tiltCargado;
  }
  function inclinar(cards) {
    if (!HM.puntero || window.innerWidth < 1024) return;
    cargarTilt().then(function () {
      if (!window.VanillaTilt) return;
      cards.forEach(function (c) {
        if (c.vanillaTilt) return;
        g.set(c, { clearProps: "transform" }); // tilt maneja el transform desde acá
        window.VanillaTilt.init(c, { max: 8, speed: 500, scale: 1.02, glare: true, "max-glare": 0.18, gyroscope: false });
      });
    });
  }
})();
