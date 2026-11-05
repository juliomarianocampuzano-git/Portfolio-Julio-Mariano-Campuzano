/* =====================================================================
   HABIB'S · CURSOR (solo desktop con mouse)
   Punto dorado que sigue al puntero y crece sobre los productos.
   El cursor del sistema se mantiene (accesibilidad): el punto es un acento.
   ===================================================================== */
(function () {
  "use strict";
  var HM = window.HM;
  if (!HM || !HM.activo || !HM.puntero) return;
  var g = HM.gsap;

  var punto = document.createElement("div");
  punto.className = "cursor";
  punto.setAttribute("aria-hidden", "true");
  document.body.appendChild(punto);

  g.set(punto, { xPercent: -50, yPercent: -50, opacity: 0 });
  var x = g.quickTo(punto, "x", { duration: 0.18, ease: "power3.out" });
  var y = g.quickTo(punto, "y", { duration: 0.18, ease: "power3.out" });
  var visible = false;

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    x(e.clientX);
    y(e.clientY);
    if (!visible) {
      visible = true;
      g.to(punto, { opacity: 1, duration: 0.2 });
    }
  }, { passive: true });

  document.documentElement.addEventListener("pointerleave", function () {
    visible = false;
    g.to(punto, { opacity: 0, duration: 0.2 });
  });

  // Crece sobre productos; se achica sobre otros elementos clickeables
  var PRODUCTO = ".card, .hero__destacado, .clasico, .asador__escena, .mq-prod";
  var CLICK = "a, button, input, textarea, [role='tab']";
  document.addEventListener("pointerover", function (e) {
    var t = e.target;
    if (t.closest(PRODUCTO)) {
      punto.classList.add("cursor--producto");
      g.to(punto, { scale: 4.2, duration: 0.35, ease: "power3.out", overwrite: "auto" });
    } else if (t.closest(CLICK)) {
      punto.classList.remove("cursor--producto");
      g.to(punto, { scale: 1.8, duration: 0.25, ease: "power3.out", overwrite: "auto" });
    } else {
      punto.classList.remove("cursor--producto");
      g.to(punto, { scale: 1, duration: 0.25, ease: "power3.out", overwrite: "auto" });
    }
  });
})();
