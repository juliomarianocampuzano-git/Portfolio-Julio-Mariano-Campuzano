/* =====================================================================
   HABIB'S · UTILIDADES COMPARTIDAS (web + totem)
   - Íconos SVG propios (sin librerías externas, funcionan offline)
   - Lockup tipográfico oficial y fotos responsivas (AVIF/WebP)
   - Helpers: escape de HTML, almacenamiento seguro, toast
   ===================================================================== */
(function () {
  "use strict";

  // ---------- Íconos (trazo redondeado, 24x24, heredan color) ----------
  var ICONOS = {
    "i-lomito":
      '<path d="M3.5 12.5C3.5 7.8 7.3 4 12 4s8.5 3.8 8.5 8.5v.5a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 13z"/><path d="M6.5 11.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0"/><path d="M8 17.5 7 20M16 17.5l1 2.5"/>',
    "i-burger":
      '<path d="M4 10.5C4 6.9 7.6 4 12 4s8 2.9 8 6.5z"/><path d="M3 14h18"/><path d="M5 17.5h14a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17.5z"/><path d="M9 7.5h.01M12 6.5h.01M15 7.5h.01"/>',
    "i-kipe": '<path d="M3.5 16c2-6.5 8.5-11 17-10-2 6.5-8.5 11-17 10z"/><path d="M7.5 13.5 16 8.5"/><path d="M9 10.5l1.5 2M12.5 8.5 14 10.5"/>',
    "i-bebida": '<path d="M5 8h14"/><path d="M6.2 8h11.6l-1.3 11.2a2 2 0 0 1-2 1.8H9.5a2 2 0 0 1-2-1.8z"/><path d="M12 8l1.6-5h3"/><path d="M7 13h10"/>',
    "i-plus": '<path d="M12 5v14M5 12h14"/>',
    "i-minus": '<path d="M5 12h14"/>',
    "i-cerrar": '<path d="M6 6l12 12M18 6 6 18"/>',
    "i-flecha-der": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "i-flecha-izq": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    "i-bolsa": '<path d="M5 8h14l-1 11.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
    "i-basura": '<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4.5h6V7"/>',
    "i-check": '<path d="M5 12.5 9.5 17 19 7.5"/>',
    "i-estrella":
      '<path fill="currentColor" stroke="none" d="m12 3.2 2.7 5.4 6 .9-4.35 4.2 1.03 5.95L12 16.8l-5.38 2.85 1.03-5.95L3.3 9.5l6-.9z"/>',
    "i-chat": '<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.5z"/><path d="M9 10.5c.5 2 2 3.5 4.5 4.5l1.3-1.3"/>',
    "i-pin": '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    "i-camara": '<path d="M4 8h3.2l1.6-2.5h6.4L16.8 8H20a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 4 8z"/><circle cx="12" cy="13" r="3.5"/>',
    "i-reloj": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    "i-telefono":
      '<path d="M5.5 4h2.8l1.9 4.8-2.4 1.5a11 11 0 0 0 5.9 5.9l1.5-2.4 4.8 1.9v2.8A1.5 1.5 0 0 1 18.5 20 15.5 15.5 0 0 1 4 5.5 1.5 1.5 0 0 1 5.5 4z"/>',
    "i-instagram": '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8h.01"/>',
    "i-auto":
      '<path d="M3.5 13.5 5.4 8a2 2 0 0 1 1.9-1.3h9.4A2 2 0 0 1 18.6 8l1.9 5.5"/><rect x="3" y="13" width="18" height="5" rx="2"/><path d="M6 18v2M18 18v2M7 15.5h.01M17 15.5h.01"/>',
    "i-moto": '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h5l-2.5-6H8M14 6h2.5l3 8"/><path d="M11.5 11h4"/>',
    "i-plato": '<path d="M7 3v7a2 2 0 0 0 2 2m0 0a2 2 0 0 0 2-2V3M9 12v9M9 3v5"/><path d="M17 21V3c-2 1.5-3 4-3 7v3h3"/>',
    "i-llevar": '<path d="M6 8h12l1 12.5H5z"/><path d="M9 8a3 3 0 0 1 6 0"/><path d="M9.5 13.5h5"/>',
    "i-efectivo": '<rect x="2.5" y="6" width="19" height="12" rx="3"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
    "i-tarjeta": '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19M6.5 15h4"/>',
    "i-mano":
      '<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6.5 6.5 0 0 1-6.5 6.5h-.8a6 6 0 0 1-4.6-2.2L4.5 15a1.6 1.6 0 0 1 2.4-2.1L9 15"/>'
  };

  function montarIconos() {
    if (document.getElementById("habibs-iconos")) return;
    var simbolos = Object.keys(ICONOS)
      .map(function (id) {
        return (
          '<symbol id="' +
          id +
          '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          ICONOS[id] +
          "</symbol>"
        );
      })
      .join("");
    var holder = document.createElement("div");
    holder.innerHTML =
      '<svg id="habibs-iconos" xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">' +
      simbolos +
      "</svg>";
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  }

  // Devuelve el markup de un ícono: icono("i-plus")
  function icono(id, clase) {
    return '<svg class="' + (clase || "ico") + '" aria-hidden="true"><use href="#' + id + '"></use></svg>';
  }

  // ---------- Marca ----------
  // El logo oficial es el logotipo tipográfico "HABIB'S" (sin archivos de imagen).
  function marca() {
    return '<span class="brand__word">HABIB&#39;S</span> <span class="brand__tag">LOMITOS ÁRABES</span>';
  }

  // ---------- Fotos responsivas ----------
  // A partir de la ruta .webp de menu-data.js arma un <picture> con AVIF,
  // WebP y versión liviana (-sm) para pantallas chicas. La foto es la misma.
  function foto(src, alt, opciones) {
    opciones = opciones || {};
    var base = String(src).replace(/\.webp$/, "");
    var sizes = opciones.sizes || "(min-width: 1024px) 380px, (min-width: 560px) 50vw, 100vw";
    var extra = opciones.atributos || "";
    if (base === src) return '<img src="' + src + '" alt="' + esc(alt) + '" ' + extra + ">";
    return (
      "<picture>" +
      '<source type="image/avif" srcset="' + base + "-sm.avif 480w, " + base + '.avif 960w" sizes="' + sizes + '">' +
      '<source type="image/webp" srcset="' + base + "-sm.webp 480w, " + base + '.webp 960w" sizes="' + sizes + '">' +
      '<img src="' + src + '" alt="' + esc(alt) + '" ' + extra + ">" +
      "</picture>"
    );
  }

  // ---------- Abierto / cerrado (hora de Paraguay) ----------
  // Todos los días abre 18:00 y cierra 01:00; viernes y sábado cierra 02:00.
  // El turno cruza la medianoche: a la 01:30 de un sábado sigue el turno del viernes.
  function minutos(hhmm) {
    var p = String(hhmm).split(":");
    return +p[0] * 60 + (+p[1] || 0);
  }

  function ahoraEnParaguay(zona) {
    try {
      var partes = new Intl.DateTimeFormat("en-US", {
        timeZone: zona || "America/Asuncion",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }).formatToParts(new Date());
      var v = {};
      partes.forEach(function (x) {
        v[x.type] = x.value;
      });
      var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { dia: dias[v.weekday], min: (+v.hour % 24) * 60 + +v.minute };
    } catch (e) {
      // Sin soporte de zonas horarias: Paraguay usa UTC-3 todo el año
      var d = new Date(Date.now() - 3 * 3600 * 1000);
      return { dia: d.getUTCDay(), min: d.getUTCHours() * 60 + d.getUTCMinutes() };
    }
  }

  function estadoLocal() {
    var h = window.HABIBS.marca.horario;
    var a = ahoraEnParaguay(h.zona);
    var cierreDe = function (dia) {
      return h.diasFinde.indexOf(dia) >= 0 ? h.cierraFinde : h.cierra;
    };
    var ayer = (a.dia + 6) % 7;
    if (a.min >= minutos(h.abre)) return { abierto: true, cierra: cierreDe(a.dia) };
    if (a.min < minutos(cierreDe(ayer))) return { abierto: true, cierra: cierreDe(ayer) };
    return { abierto: false, abre: h.abre };
  }

  // ---------- Helpers ----------
  function esc(texto) {
    return String(texto == null ? "" : texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // localStorage puede fallar (modo privado, WebView sin DOM storage): nunca rompe la app
  function leer(clave, porDefecto) {
    try {
      var v = window.localStorage.getItem(clave);
      return v == null ? porDefecto : JSON.parse(v);
    } catch (e) {
      return porDefecto;
    }
  }

  function guardar(clave, valor) {
    try {
      window.localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) {
      /* sin almacenamiento: la app sigue funcionando en memoria */
    }
  }

  var toastEl = null;
  var toastTimer = null;
  function toast(mensaje) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = icono("i-check") + "<span>" + esc(mensaje) + "</span>";
    // forzar reflow para reiniciar la transición
    void toastEl.offsetWidth;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 1800);
  }

  // Reinicia una animación CSS (ej. rebote del carrito)
  function animar(el, clase) {
    if (!el) return;
    el.classList.remove(clase);
    void el.offsetWidth;
    el.classList.add(clase);
  }

  window.HUI = {
    icono: icono,
    marca: marca,
    foto: foto,
    estadoLocal: estadoLocal,
    esc: esc,
    leer: leer,
    guardar: guardar,
    toast: toast,
    animar: animar
  };

  function iniciar() {
    montarIconos();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
