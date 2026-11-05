/* =====================================================================
   HABIB'S · HERO
   - Timeline maestro de 2,2 s o menos: telón de marca (solo la primera
     visita de la sesión) → foto → titular letra por letra → CTAs.
   - En celulares no corre el timeline: el hero entra con CSS (motion.css)
     y se pinta sin esperar al JS, que llega después del "load".
   - "rica" y "Encarnación" en dorado con glow.
   - Brasas en canvas que se pausan fuera de pantalla o con la pestaña oculta.
   - Botón "Pedir por WhatsApp" magnético (solo mouse) con pulso.
   ===================================================================== */
(function () {
  "use strict";
  var HM = window.HM;
  if (!HM || !HM.activo) return;
  var g = HM.gsap;
  var raiz = document.documentElement;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  // ---------- Titular letra por letra (Splitting), solo desktop ----------
  var h1 = $(".hero__titulo");
  var letras = [];
  if (h1 && !HM.movil) {
    var texto = h1.textContent.trim();
    h1.setAttribute("aria-label", texto);
    if (window.Splitting) {
      window.Splitting({ target: h1, by: "chars" });
      $$(".word", h1).forEach(function (w) {
        w.setAttribute("aria-hidden", "true");
      });
      letras = $$(".char", h1);
    }
  }

  // ---------- Timeline maestro (≤ 2,2 s), solo desktop ----------
  // En celulares no se construye: leería como destino los valores a mitad de la animación CSS.
  var intro = $("#intro");
  if (HM.movil) {
    if (intro) intro.classList.add("is-fuera");
  } else {
    var conIntro = false;
    try {
      conIntro = !!intro && !sessionStorage.getItem("habibs-intro");
      sessionStorage.setItem("habibs-intro", "1");
    } catch (e) {
      conIntro = false;
    }

    var tl = g.timeline({ defaults: { ease: "expo.out" } });
    var t0 = 0; // momento en que arranca el hero

    if (conIntro) {
      tl.from(".intro__marca span", { yPercent: 110, duration: 0.45, stagger: 0.04, ease: "power3.out" }, 0)
        .from(".intro__tag", { opacity: 0, y: 12, duration: 0.3 }, 0.2)
        .to(".intro__marca, .intro__tag", { yPercent: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, 0.62)
        .to(".intro__panel--a", { yPercent: -101, duration: 0.6, ease: "expo.inOut" }, 0.7)
        .to(".intro__panel--b", { yPercent: 101, duration: 0.6, ease: "expo.inOut" }, 0.7)
        .add(function () { intro.classList.add("is-fuera"); }, 1.3);
      t0 = 0.8;
    } else if (intro) {
      intro.classList.add("is-fuera");
    }

    tl.fromTo(".hero__foto", { scale: 1.18 }, { scale: 1, duration: 1.3, ease: "power3.out" }, Math.max(0, t0 - 0.1))
      .from(".hero__badges > *", { y: -18, opacity: 0, duration: 0.45, stagger: 0.08 }, t0 + 0.05)
      .from(".cabecera__pill", { y: -80, duration: 0.6, ease: "back.out(1.6)" }, t0 + 0.1);
    if (letras.length) {
      tl.from(letras, { yPercent: 110, opacity: 0, duration: 0.6, stagger: 0.012, ease: "power4.out" }, t0 + 0.1);
    }
    tl.from(".hero__lead", { y: 24, opacity: 0, duration: 0.5 }, t0 + 0.5)
      .fromTo(".hero__ctas .btn", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(2)" }, t0 + 0.6)
      .from(".hero__datos li", { y: 20, opacity: 0, duration: 0.45, stagger: 0.06 }, t0 + 0.7)
      .from(".hero__destacado", { x: 80, opacity: 0, duration: 0.55, ease: "power3.out" }, t0 + 0.8)
      .add(contadores, t0 + 0.7);
  }

  // Los estados iniciales ya están puestos: se destapa el hero (estaba oculto por CSS para evitar parpadeo)
  raiz.classList.add("motion-listo");

  // ---------- Contadores (terminan dentro del timeline) ----------
  function contadores() {
    $$("[data-count]").forEach(function (el) {
      var fin = parseFloat(el.getAttribute("data-count"));
      var dec = +el.getAttribute("data-dec") || 0;
      var o = { v: 0 };
      g.to(o, {
        v: fin,
        duration: 0.65,
        ease: "power2.out",
        onUpdate: function () {
          el.textContent = dec
            ? o.v.toFixed(dec).replace(".", ",")
            : Math.round(o.v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
      });
    });
  }

  // ---------- Parallax suave al salir del hero (solo desktop) ----------
  if (!HM.movil) {
    g.to(".hero__foto", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    g.to(".hero__contenido", { yPercent: -12, opacity: 0.3, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    g.to(".hero__destacado", { y: -12, duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.4 });
  }

  // ---------- Brasas (canvas) ----------
  var cv = $(".hero__brasas");
  if (cv && cv.getContext) {
    var ctx = cv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, HM.movil ? 1.5 : 2);
    var N = HM.movil ? 18 : 48;
    var W = 0, Hh = 0, parts = [], visible = true, corriendo = false;

    // Sprite pre-renderizado: dibujar con drawImage es mucho más barato que shadowBlur por partícula
    var sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    var sc = sprite.getContext("2d");
    var grad = sc.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,236,170,1)");
    grad.addColorStop(0.25, "rgba(255,170,40,0.9)");
    grad.addColorStop(0.6, "rgba(230,120,0,0.35)");
    grad.addColorStop(1, "rgba(230,90,0,0)");
    sc.fillStyle = grad;
    sc.fillRect(0, 0, 32, 32);

    var medir = function () {
      W = cv.offsetWidth;
      Hh = cv.offsetHeight;
      cv.width = W * dpr;
      cv.height = Hh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    var nueva = function (p, alAzar) {
      p = p || {};
      p.x = Math.random() * W;
      p.y = alAzar ? Math.random() * Hh : Hh + Math.random() * 40;
      p.s = Math.random() * 10 + 6;
      p.vy = Math.random() * 0.9 + 0.35;
      p.vx = (Math.random() - 0.5) * 0.5;
      p.f = Math.random() * 6.28;
      return p;
    };
    medir();
    for (var i = 0; i < N; i++) parts.push(nueva(null, true));
    window.addEventListener("resize", medir, { passive: true });

    var cuadro = function (t) {
      if (!visible || document.hidden) {
        corriendo = false;
        return;
      }
      ctx.clearRect(0, 0, W, Hh);
      for (var j = 0; j < parts.length; j++) {
        var p = parts[j];
        p.y -= p.vy;
        p.x += p.vx + Math.sin(t / 700 + p.f) * 0.3;
        if (p.y < -20) nueva(p, false);
        ctx.globalAlpha = Math.max(0, Math.min(1, (p.y / Hh) * 1.5));
        ctx.drawImage(sprite, p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
      }
      requestAnimationFrame(cuadro);
    };
    var arrancar = function () {
      if (corriendo || !visible || document.hidden) return;
      corriendo = true;
      requestAnimationFrame(cuadro);
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        arrancar();
      }).observe(cv);
    }
    document.addEventListener("visibilitychange", arrancar);
    arrancar();
  }

  // ---------- CTA magnético (solo mouse/trackpad) ----------
  if (HM.puntero) {
    $$(".btn-wa-hero, .cabecera__pedir").forEach(function (b) {
      var x = g.quickTo(b, "x", { duration: 0.35, ease: "power3.out" });
      var y = g.quickTo(b, "y", { duration: 0.35, ease: "power3.out" });
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.3);
        y((e.clientY - r.top - r.height / 2) * 0.4);
      });
      b.addEventListener("pointerleave", function () {
        g.to(b, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.35)" });
      });
    });
  }
})();
