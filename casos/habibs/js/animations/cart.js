/* =====================================================================
   HABIB'S · CARRITO
   - Al agregar: la foto del producto vuela en curva (bezier) hasta el
     ícono del carrito, el ícono se sacude y aparece un "+1".
   - Al enviar el pedido: chispas de confetti dorado y rojo (canvas-confetti,
     se descarga recién cuando se abre la hoja del pedido).
   ===================================================================== */
(function () {
  "use strict";
  var HM = window.HM;
  if (!HM || !HM.activo) return;
  var g = HM.gsap;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  // ---------- Destino visible: barra inferior (móvil) o botón del header ----------
  function destino() {
    var candidatos = [$(".fab-pedido.is-visible [data-icono-carrito]"), $(".cabecera__pedir"), $(".fab-pedido [data-icono-carrito]")];
    for (var i = 0; i < candidatos.length; i++) {
      var el = candidatos[i];
      if (!el) continue;
      var r = el.getBoundingClientRect();
      if (r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && getComputedStyle(el.closest(".fab-pedido") || el).opacity !== "0") return el;
    }
    return $(".cabecera__pedir");
  }

  // Punto de una curva bezier cuadrática
  function bezier(a, c, b, t) {
    var u = 1 - t;
    return u * u * a + 2 * u * t * c + t * t * b;
  }

  function sacudir(el) {
    g.fromTo(el, { rotation: -16, scale: 1.25 }, { rotation: 0, scale: 1, duration: 0.8, ease: "elastic.out(1.4, 0.3)", overwrite: "auto" });
    $$("[data-contador]").forEach(function (c) {
      g.fromTo(c, { scale: 1.9 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
    });
  }

  function masUno(x, y) {
    var m = document.createElement("span");
    m.className = "mas-uno";
    m.textContent = "+1";
    m.setAttribute("aria-hidden", "true");
    m.style.left = x - 14 + "px";
    m.style.top = y - 34 + "px";
    document.body.appendChild(m);
    g.fromTo(m, { y: 0, opacity: 1, scale: 0.6 }, { y: -64, opacity: 0, scale: 1.5, duration: 0.9, ease: "power2.out", onComplete: function () { m.remove(); } });
  }

  function chispas(x, y) {
    for (var i = 0; i < 10; i++) {
      var c = document.createElement("span");
      c.className = "chispa" + (i % 2 ? " chispa--oro" : "");
      c.setAttribute("aria-hidden", "true");
      c.style.left = x + "px";
      c.style.top = y + "px";
      document.body.appendChild(c);
      g.to(c, {
        x: g.utils.random(-80, 80),
        y: g.utils.random(-100, 20),
        scale: 0,
        duration: g.utils.random(0.45, 0.8),
        ease: "power3.out",
        onComplete: c.remove.bind(c)
      });
    }
  }

  // ---------- Vuelo al carrito ----------
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-agregar]");
    if (!b || b.closest(".hoja")) return;
    var rb = b.getBoundingClientRect();
    var bx = rb.left + rb.width / 2, by = rb.top + rb.height / 2;
    g.fromTo(b, { scale: 0.82 }, { scale: 1, duration: 0.55, ease: "elastic.out(1.3, 0.4)" });
    chispas(bx, by);
    masUno(bx, by);

    var dst = destino();
    if (!dst) return;
    var rd = dst.getBoundingClientRect();
    var x1 = rd.left + rd.width / 2, y1 = rd.top + rd.height / 2;

    var contenedor = b.closest(".card, .hero__destacado, .clasico, .asador");
    var img = contenedor && $(".card__media img, .hero__destacado-foto img, .clasico__foto img", contenedor);
    if (!img) {
      sacudir(dst);
      return;
    }
    var ri = img.getBoundingClientRect();
    var tam = Math.min(ri.width, ri.height, 120);
    var x0 = ri.left + ri.width / 2, y0 = ri.top + ri.height / 2;
    // punto de control: por encima de los dos extremos para que la curva "salte"
    var cx = (x0 + x1) / 2, cy = Math.min(y0, y1) - Math.max(120, Math.abs(x1 - x0) * 0.35);

    var v = document.createElement("img");
    v.src = img.currentSrc || img.src;
    v.alt = "";
    v.className = "vuela";
    v.style.width = v.style.height = tam + "px";
    v.style.left = x0 - tam / 2 + "px";
    v.style.top = y0 - tam / 2 + "px";
    document.body.appendChild(v);

    var p = { t: 0 };
    g.to(p, {
      t: 1,
      duration: 0.85,
      ease: "power1.inOut",
      onUpdate: function () {
        var t = p.t;
        g.set(v, {
          x: bezier(x0, cx, x1, t) - x0,
          y: bezier(y0, cy, y1, t) - y0,
          scale: 1 - 0.82 * t,
          rotation: 300 * t,
          opacity: 1 - 0.4 * t
        });
      },
      onComplete: function () {
        v.remove();
        sacudir(dst);
      }
    });
  });

  // ---------- Confetti al enviar el pedido ----------
  var confettiListo = null;
  function cargarConfetti() {
    if (confettiListo) return confettiListo;
    confettiListo = new Promise(function (ok) {
      var crear = function () {
        // Sin worker (compatible con CSP estricta) y respetando reduced motion
        ok(window.confetti ? window.confetti.create(null, { resize: true, useWorker: false, disableForReducedMotion: true }) : null);
      };
      if (window.confetti) return crear();
      var s = document.createElement("script");
      s.src = "js/vendor/confetti.browser.js";
      s.async = true;
      s.onload = crear;
      s.onerror = function () { ok(null); };
      document.head.appendChild(s);
    });
    return confettiListo;
  }

  // Se precarga al abrir la hoja, así el festejo sale sin demora
  document.addEventListener("habibs:hoja", function (e) {
    if (e.detail && e.detail.abierta) cargarConfetti();
  });

  document.addEventListener("habibs:pedido-enviado", function () {
    cargarConfetti().then(function (disparar) {
      if (!disparar) return;
      var colores = ["#a30d0d", "#e6a100", "#8b0000", "#ffd166", "#ffffff"];
      var base = { colors: colores, ticks: 180, gravity: 1.1, scalar: 1.05, zIndex: 9999 };
      disparar(Object.assign({}, base, { particleCount: 90, spread: 75, startVelocity: 48, origin: { x: 0.5, y: 0.75 } }));
      setTimeout(function () {
        disparar(Object.assign({}, base, { particleCount: 45, angle: 60, spread: 55, origin: { x: 0, y: 0.8 } }));
        disparar(Object.assign({}, base, { particleCount: 45, angle: 120, spread: 55, origin: { x: 1, y: 0.8 } }));
      }, 180);
    });
  });
})();
