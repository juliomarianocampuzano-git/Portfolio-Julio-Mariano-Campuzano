/* =====================================================================
   HABIB'S · CINTAS (marquees inclinados)
   Loop infinito que acelera y se inclina según la velocidad del scroll
   que entrega Lenis. Se pausan cuando no están en pantalla.
   ===================================================================== */
(function () {
  "use strict";
  var HM = window.HM;
  if (!HM || !HM.activo) return;
  var g = HM.gsap;
  var ST = HM.ST;

  var cintas = g.utils.toArray("[data-marquee]").map(function (m) {
    var dir = +m.getAttribute("data-marquee");
    var pista = m.querySelector(".marquee__pista");
    pista.innerHTML += pista.innerHTML; // se duplica para que el loop no tenga cortes
    // la copia es decorativa: no la leen los lectores de pantalla ni entra en el orden de foco
    Array.prototype.forEach.call(pista.children, function (el, i, todos) {
      if (i >= todos.length / 2) el.setAttribute("aria-hidden", "true");
    });
    g.set(pista, { xPercent: dir > 0 ? -50 : 0 });
    var tw = g.to(pista, { xPercent: dir > 0 ? 0 : -50, duration: dir > 0 ? 42 : 28, ease: "none", repeat: -1 });
    ST.create({
      trigger: m,
      start: "top bottom",
      end: "bottom top",
      onToggle: function (s) {
        if (s.isActive) tw.play();
        else tw.pause();
      }
    });
    return { pista: pista, tw: tw, skew: g.quickTo(pista, "skewX", { duration: 0.4, ease: "power3.out" }) };
  });
  if (!cintas.length) return;

  // Velocidad de Lenis → timeScale y skew (si no hay Lenis, se usa la de ScrollTrigger)
  var suave = 0;
  var rastreo = HM.lenis ? null : ST.create({ start: 0, end: "max" });
  g.ticker.add(function () {
    var v = rastreo ? rastreo.getVelocity() / 60 : HM.velocidad();
    suave += (v - suave) * 0.12;
    var fuerza = Math.min(Math.abs(suave) / 8, 5); // 0 … 5
    var signo = suave < 0 ? -1 : 1;
    cintas.forEach(function (c) {
      c.tw.timeScale(1 + fuerza * 1.4);
      c.skew(-signo * Math.min(fuerza * 2.2, 9));
    });
  });

  // Entrada: las cintas cruzan la pantalla al aparecer
  g.from(".marquee--rojo", { xPercent: -20, opacity: 0, duration: 1, ease: "power4.out", scrollTrigger: { trigger: ".marquee-zona", start: "top 90%", once: true } });
  g.from(".marquee--tinta", { xPercent: 20, opacity: 0, duration: 1, ease: "power4.out", scrollTrigger: { trigger: ".marquee-zona", start: "top 90%", once: true } });
})();
