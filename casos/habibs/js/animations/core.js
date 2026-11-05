/* =====================================================================
   HABIB'S · NÚCLEO DE ANIMACIÓN
   - Decide si hay movimiento (prefers-reduced-motion lo apaga TODO:
     animaciones, Lenis y cursor).
   - Registra plugins de GSAP, crea Lenis sincronizado con ScrollTrigger
     y expone window.HM para el resto de los módulos.
   - Barra de progreso de scroll (rojo/dorado).
   Regla de rendimiento: solo se animan transform y opacity.
   ===================================================================== */
(function () {
  "use strict";

  var raiz = document.documentElement;
  var mqReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
  var g = window.gsap;
  var ST = window.ScrollTrigger;

  // Sin GSAP o con movimiento reducido: todo queda estático y visible
  if (mqReducido.matches || !g || !ST) {
    raiz.classList.remove("motion");
    raiz.classList.add("motion-listo");
    window.HM = { activo: false };
    return;
  }

  g.registerPlugin(ST);
  if (window.Flip) g.registerPlugin(window.Flip);

  var puntero = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var movil = window.matchMedia("(max-width: 767px)").matches;

  // ---------- Lenis (scroll suave) sincronizado con ScrollTrigger ----------
  var lenis = null;
  var velocidad = 0; // velocidad del scroll (px/frame aprox.), la usan las cintas
  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.1,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      // En táctil se respeta el scroll nativo (más natural y liviano en celulares)
      syncTouch: false
    });
    lenis.on("scroll", function (e) {
      velocidad = e.velocity || 0;
      ST.update();
    });
    g.ticker.add(function (t) {
      lenis.raf(t * 1000);
    });
    g.ticker.lagSmoothing(0);
    raiz.classList.add("con-lenis");

    // Anclas internas con Lenis (respeta el header flotante)
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var destino = document.querySelector(id);
      if (!destino) return;
      e.preventDefault();
      lenis.scrollTo(destino, {
        offset: id === "#inicio" ? 0 : -96,
        duration: 1.2,
        onComplete: function () {
          // Accesibilidad: el foco acompaña al salto (link "Saltar al menú", nav)
          if (!destino.hasAttribute("tabindex")) destino.setAttribute("tabindex", "-1");
          destino.focus({ preventScroll: true });
        }
      });
      if (history.replaceState) history.replaceState(null, "", id);
    });

    // La hoja del pedido bloquea el scroll de fondo
    document.addEventListener("habibs:hoja", function (e) {
      if (e.detail && e.detail.abierta) lenis.stop();
      else lenis.start();
    });
  }

  // Si el usuario activa "reducir movimiento" con la página abierta, se recarga estática
  if (mqReducido.addEventListener) {
    mqReducido.addEventListener("change", function () {
      location.reload();
    });
  }

  // ---------- Barra de progreso ----------
  var barra = document.querySelector(".progreso span");
  if (barra) {
    g.to(barra, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  }

  // ---------- Revelados genéricos (reemplazan al IntersectionObserver de web.js) ----------
  // fromTo con valores explícitos: un from() leería el estado CSS inicial de .revelar como destino
  g.utils.toArray(".revelar").forEach(function (el) {
    el.classList.add("is-visible");
    g.fromTo(
      el,
      { y: movil ? 40 : 70, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: movil ? 0.7 : 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      }
    );
  });

  // Recalcular posiciones cuando cargan fotos y tipografías
  window.addEventListener("load", function () {
    ST.refresh();
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      ST.refresh();
    });
  }

  window.HM = {
    activo: true,
    gsap: g,
    ST: ST,
    lenis: lenis,
    puntero: puntero, // mouse/trackpad: habilita tilt, cursor y magnetismo
    movil: movil,
    velocidad: function () {
      return velocidad;
    },
    transicionMenu: null // lo define animations/menu.js
  };
})();
