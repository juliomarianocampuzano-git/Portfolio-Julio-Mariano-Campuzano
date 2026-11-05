/* =====================================================================
   HABIB'S · EL ASADOR (sección fijada con scroll)
   El lomito se arma capa por capa mientras se scrollea (pin + scrub):
   cada ingrediente cae, se asienta y se marca en la lista. Al final el
   precio cae de golpe y la escena se sacude.
   Sin movimiento (reduced motion) el lomito se ve armado y estático.
   ===================================================================== */
(function () {
  "use strict";
  var HM = window.HM;
  if (!HM || !HM.activo) return;
  var g = HM.gsap;
  var seccion = document.querySelector(".asador");
  if (!seccion) return;
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  var capas = $$(".capa", seccion);
  var textos = $$("[data-capa-texto]", seccion);
  var svg = seccion.querySelector(".asador__svg");
  var brasa = seccion.querySelector(".asador__brasa");
  var precio = seccion.querySelector(".asador__precio");
  var boton = seccion.querySelector(".asador__pie .btn");
  if (!capas.length) return;

  // Estados iniciales: ingredientes arriba y transparentes
  g.set(capas, { y: -240, opacity: 0, transformOrigin: "50% 100%" });
  g.set(textos, { opacity: 0.28, x: -10 });
  g.set(precio, { y: -140, opacity: 0, scale: 1.8, transformOrigin: "0% 100%" });

  var tl = g.timeline({
    defaults: { ease: "power2.in" },
    scrollTrigger: {
      trigger: seccion,
      pin: ".asador__pin",
      start: "top top",
      end: "+=" + (HM.movil ? 1500 : 2200),
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  capas.forEach(function (capa, i) {
    // la tapa (última capa) vuelve a marcar "Pan pita"
    var texto = textos[i] || null;
    tl.to(capa, { y: 0, opacity: 1, duration: 1 })
      .to(capa, { scaleY: 0.86, scaleX: 1.04, duration: 0.14, ease: "power1.out" })
      .to(capa, { scaleY: 1, scaleX: 1, duration: 0.24, ease: "back.out(3)" });
    if (texto) tl.to(texto, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "<-0.3");
  });

  // El precio cae de golpe y la escena tiembla con el impacto
  tl.to(precio, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power4.in" })
    .to(svg, { x: 7, rotation: 1.2, duration: 0.05, repeat: 5, yoyo: true, ease: "none" })
    .to(svg, { x: 0, rotation: 0, duration: 0.1 })
    .fromTo(boton, { scale: 0.92 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, "<"); // el botón siempre está visible (foco con teclado)

  // La brasa se enciende de a poco a lo largo de toda la sección
  if (brasa) tl.fromTo(brasa, { opacity: 0.25, scale: 0.85 }, { opacity: 1, scale: 1.1, duration: tl.duration(), ease: "none" }, 0);
})();
