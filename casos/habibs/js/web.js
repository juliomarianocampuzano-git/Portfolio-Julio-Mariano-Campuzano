/* =====================================================================
   HABIB'S · LÓGICA DE LA WEB (index.html)
   - Render del menú desde menu-data.js
   - Pedido (carrito) persistente y envío por WhatsApp
   - Microinteracciones: header, revelado al scroll, nav activa
   - Badge "Abierto ahora / Cerrado" con el horario real (America/Asuncion)
   - Avisa a la capa de animación con eventos "habibs:*" (sin depender de ella)
   ===================================================================== */
(function () {
  "use strict";

  var H = window.HABIBS;
  var U = window.HUI;
  var CLAVE = "habibs-web-pedido-v1";

  document.documentElement.classList.add("js");

  // ---------- Estado ----------
  var estado = U.leer(CLAVE, null) || {};
  estado.lineas = Array.isArray(estado.lineas) ? estado.lineas : []; // [{id, cant}]
  estado.modalidad = estado.modalidad || "delivery";
  var categoriaActiva = "todo";

  function guardarEstado() {
    U.guardar(CLAVE, { lineas: estado.lineas, modalidad: estado.modalidad });
  }

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  // ---------- Tarjeta de producto (mismo componente que el totem) ----------
  function tarjeta(p, i) {
    var encuadre = p.encuadre ? ' style="object-position:' + p.encuadre + '"' : "";
    return (
      '<article class="card card--entra" data-cat="' + p.categoria + '" data-producto="' + p.id + '" style="animation-delay:' + (i || 0) * 60 + 'ms">' +
      '<div class="card__media">' +
      U.foto(p.foto, p.nombre, { atributos: 'width="960" height="720" loading="lazy" decoding="async"' + encuadre }) +
      (p.masPedido ? '<span class="badge">' + U.icono("i-estrella") + "Más pedido</span>" : "") +
      "</div>" +
      '<div class="card__body">' +
      '<h3 class="card__titulo">' + U.esc(p.nombre) + "</h3>" +
      '<p class="card__desc">' + U.esc(p.descripcion) + "</p>" +
      '<div class="card__pie">' +
      '<span class="precio">' + H.gs(p.precio) + "</span>" +
      '<a class="btn btn--contorno card__pedir" href="' + U.esc(H.linkWhatsApp("Hola Habib’s, quiero pedir " + p.nombre + ".")) +
      '" target="_blank" rel="noopener" aria-label="Pedir ' + U.esc(p.nombre) + ' por WhatsApp">Pedir</a>' +
      '<button class="btn btn--rojo btn-agregar" type="button" data-agregar="' + p.id + '" aria-label="Agregar ' + U.esc(p.nombre) + ' al pedido">' +
      U.icono("i-plus") + "<span>Agregar</span></button>" +
      "</div></div></article>"
    );
  }

  function renderFavoritos() {
    var cont = $("#grilla-favoritos");
    if (!cont) return;
    cont.innerHTML = H.masPedidos().map(tarjeta).join("");
  }

  function renderChips() {
    var cont = $("#chips-menu");
    if (!cont) return;
    var chips = [{ id: "todo", corto: "Todo", icono: "i-estrella" }].concat(H.categorias);
    cont.innerHTML = chips
      .map(function (c) {
        var activo = c.id === categoriaActiva;
        return (
          '<button class="chip' + (activo ? " is-activo" : "") + '" type="button" role="tab" id="chip-' + c.id + '" aria-controls="grilla-menu" aria-selected="' + activo + '" tabindex="' + (activo ? "0" : "-1") + '" data-cat="' + c.id + '">' +
          U.icono(c.icono) + U.esc(c.nombre || c.corto) + "</button>"
        );
      })
      .join("") + '<span class="chips__indicador" aria-hidden="true"></span>';
    function posicionarIndicador() {
      var chip = $(".is-activo", cont);
      var indicador = $(".chips__indicador", cont);
      indicador.style.width = chip.offsetWidth + "px";
      indicador.style.height = chip.offsetHeight + "px";
      indicador.style.transform = "translate(" + chip.offsetLeft + "px," + chip.offsetTop + "px)";
    }
    cont.addEventListener("habibs:tab", posicionarIndicador);
    if ("ResizeObserver" in window) {
      var observador = new ResizeObserver(posicionarIndicador);
      $$(".chip", cont).forEach(function (chip) { observador.observe(chip); });
      observador.observe(cont);
    }
    posicionarIndicador();
  }

  // Se renderizan las tarjetas una vez para conservar las imágenes al filtrar.
  function renderMenu() {
    var cont = $("#grilla-menu");
    if (!cont) return;
    cont.innerHTML = H.productos.map(tarjeta).join("");
    aplicarFiltro();
  }

  function aplicarFiltro() {
    $$("#grilla-menu .card").forEach(function (c) {
      c.hidden = categoriaActiva !== "todo" && c.getAttribute("data-cat") !== categoriaActiva;
    });
    var panel = $("#grilla-menu");
    if (panel) panel.setAttribute("aria-labelledby", "chip-" + categoriaActiva);
  }

  function filtrar(cat) {
    if (cat === categoriaActiva) return;
    categoriaActiva = cat;
    // Animated Tabs (21st, educalvolpz): un indicador compartido sigue a la selección.
    $$("#chips-menu .chip").forEach(function (chip) {
      var activo = chip.dataset.cat === cat;
      chip.classList.toggle("is-activo", activo);
      chip.setAttribute("aria-selected", String(activo));
      chip.tabIndex = activo ? 0 : -1;
    });
    $("#chips-menu").dispatchEvent(new Event("habibs:tab"));
    aplicarFiltro();
    var panel = $("#grilla-menu");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      panel.getAnimations().forEach(function (animacion) { animacion.cancel(); });
      panel.animate([{ opacity: 0.45, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
        { duration: 250, easing: "ease-out" });
    }
  }

  function renderLocales() {
    var cont = $("#locales-grilla");
    if (!cont) return;
    cont.innerHTML = H.marca.locales
      .map(function (l) {
        return (
          '<article class="local revelar">' +
          '<span class="local__icono">' + U.icono(l.id === "costanera" ? "i-auto" : "i-pin") + "</span>" +
          '<h3 class="display local__nombre">' + U.esc(l.nombre) + "</h3>" +
          '<p class="local__direccion">' + U.esc(l.direccion) + "</p>" +
          '<span class="badge">' + U.esc(l.zona) + "</span>" +
          '<p class="local__extra">' + U.esc(l.extra) + "</p>" +
          '<p class="local__horario">' + U.esc(H.marca.horario.general) + '<br>' + U.esc(H.marca.horario.finde) + "</p>" +
          '<details class="local__mapa" data-mapa="' + U.esc(l.mapa) + '">' +
          '<summary>Ver mapa de ' + U.esc(l.nombre) + '</summary></details>' +
          '<a class="btn btn--contorno" href="' + l.mapa + '" target="_blank" rel="noopener">' +
          U.icono("i-pin") + "Cómo llegar</a>" +
          "</article>"
        );
      })
      .join("");
    $$(".local__mapa", cont).forEach(function (mapa) {
      mapa.addEventListener("toggle", function () {
        if (!mapa.open || $("iframe", mapa)) return;
        var consulta = new URL(mapa.dataset.mapa).searchParams.get("query");
        var marco = document.createElement("iframe");
        marco.title = $("summary", mapa).textContent;
        marco.loading = "lazy";
        marco.src = "https://maps.google.com/maps?output=embed&q=" + encodeURIComponent(consulta);
        mapa.appendChild(marco);
      });
    });
  }

  function renderGaleria() {
    $("#galeria-fotos").innerHTML = H.productos.filter(function (p) { return p.foto; }).slice(0, 6)
      .map(function (p) {
        return '<figure><a href="' + U.esc(p.foto) + '">' +
          U.foto(p.foto, p.nombre, { atributos: 'width="960" height="720" loading="lazy" decoding="async"' }) +
          '</a><figcaption>' + U.esc(p.nombre) + '</figcaption></figure>';
      }).join("");
  }

  function renderTestimonios() {
    var resenas = H.marca.resenas;
    var testimonios = H.marca.testimonios || [];
    var tarjetas = testimonios.length ? testimonios.map(function (t) {
      return '<figure><blockquote>' + U.esc(t.texto) + '</blockquote><figcaption>' + U.esc(t.autor) + '</figcaption></figure>';
    }).join("") : '<p>Testimonios individuales · <strong>A CONFIRMAR</strong></p>' +
      '<p><strong>' + resenas.nota.toLocaleString("es-PY") + '/5</strong> · Calificación general</p>' +
      '<p><strong>' + resenas.cantidad.toLocaleString("es-PY") + '</strong> reseñas</p>';
    var cinta = $("#testimonios-cinta");
    cinta.innerHTML = '<button class="btn btn--contorno cinta-pausa" type="button" aria-pressed="false">Pausar movimiento</button>' +
      '<div class="cinta-ventana"><div class="cinta-pista"><div class="cinta-grupo">' + tarjetas +
      '</div><div class="cinta-grupo" aria-hidden="true">' + tarjetas + '</div></div></div>';
    var pausa = $(".cinta-pausa", cinta);
    pausa.addEventListener("click", function () {
      var pausado = cinta.classList.toggle("is-pausada");
      pausa.setAttribute("aria-pressed", String(pausado));
    });
  }

  // ---------- El asador: capas, nombre y precio desde menu-data.js ----------
  function renderAsador() {
    var p = H.producto("lomito-carne");
    var lista = $("[data-asador-capas]");
    if (!p || !lista) return;
    lista.innerHTML = (p.capas || [])
      .map(function (c, i) {
        return '<li class="asador__capa" data-capa-texto="' + i + '"><span class="asador__num" aria-hidden="true">' + (i + 1) + "</span>" + U.esc(c) + "</li>";
      })
      .join("");
    $$("[data-asador-nombre]").forEach(function (el) {
      el.textContent = p.nombre;
    });
    $$("[data-asador-precio]").forEach(function (el) {
      el.textContent = H.gs(p.precio);
    });
  }

  // ---------- Cinta de productos (decorativa, contenido real del menú) ----------
  function renderCinta() {
    var pista = $("#marquee-productos");
    if (!pista) return;
    var productos = H.productos
      .filter(function (p) {
        return p.foto;
      })
      .map(function (p) {
        var chica = p.foto.replace(/\.webp$/, "-sm.webp");
        return '<span class="mq-prod"><img src="' + chica + '" alt="" width="52" height="52" loading="lazy" decoding="async"><b>' +
          U.esc(p.nombre) + "</b><em>" + H.gs(p.precio) + "</em></span>";
      })
      .join("");
    pista.innerHTML = '<div class="cinta-grupo">' + productos + '</div><div class="cinta-grupo" aria-hidden="true">' +
      productos + '</div>';
  }

  // ---------- Reseñas (prueba social) desde menu-data.js ----------
  function renderResenas() {
    var r = H.marca.resenas;
    var el = $("[data-resenas]");
    if (!r || !el) return;
    var nota = String(r.nota).replace(".", ",");
    var cant = String(r.cantidad).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    $(".resenas__nota", el).textContent = nota;
    $(".resenas__cantidad", el).textContent = cant + " reseñas";
    var est = $(".resenas__estrellas", el);
    est.style.setProperty("--nota", (r.nota / 5) * 100 + "%");
    est.setAttribute("aria-label", nota + " de 5 estrellas");
  }

  // ---------- Pedido ----------
  function cantidadTotal() {
    return estado.lineas.reduce(function (s, l) {
      return s + l.cant;
    }, 0);
  }

  function montoTotal() {
    return estado.lineas.reduce(function (s, l) {
      var p = H.producto(l.id);
      return s + (p ? p.precio * l.cant : 0);
    }, 0);
  }

  function agregar(id, boton) {
    var p = H.producto(id);
    if (!p) return;
    var linea = estado.lineas.filter(function (l) {
      return l.id === id;
    })[0];
    if (linea) linea.cant = Math.min(linea.cant + 1, 20);
    else estado.lineas.push({ id: id, cant: 1 });
    guardarEstado();
    actualizarResumen(true);
    var cuerpo = boton && boton.closest(".hoja__cuerpo");
    var antes = cuerpo && boton.getBoundingClientRect().top;
    renderLineas();
    if (cuerpo) cuerpo.scrollTop += boton.getBoundingClientRect().top - antes;
    U.toast(p.nombre + " agregado");
    anunciar(p.nombre + " agregado. Total " + H.gs(montoTotal()));

    // Feedback en el propio botón
    if (boton && boton.classList.contains("btn-agregar")) {
      var span = boton.querySelector("span");
      boton.classList.add("is-listo");
      if (span) span.textContent = "¡Listo!";
      setTimeout(function () {
        boton.classList.remove("is-listo");
        if (span) span.textContent = "Agregar";
      }, 1200);
    }
  }

  function cambiarCantidad(id, delta) {
    estado.lineas = estado.lineas
      .map(function (l) {
        return l.id === id ? { id: l.id, cant: Math.max(0, Math.min(20, l.cant + delta)) } : l;
      })
      .filter(function (l) {
        return l.cant > 0;
      });
    guardarEstado();
    actualizarResumen(false);
    renderLineas();
    var p = H.producto(id);
    anunciar((p ? p.nombre + ": " : "") + "cantidad actualizada. Total " + H.gs(montoTotal()));
    // Mantener el foco dentro de la hoja tras re-renderizar
    var mismo = $("[data-" + (delta > 0 ? "mas" : "menos") + '="' + id + '"]') || $("#hoja-pedido [data-cerrar-pedido]");
    if (mismo) mismo.focus({ preventScroll: true });
  }

  function actualizarResumen(rebotar) {
    var n = cantidadTotal();
    var total = H.gs(montoTotal());
    // Cada etiqueta empieza con el texto visible del botón (lo exige WCAG 2.5.3)
    var detalle = n
      ? "ver tu pedido, " + n + (n === 1 ? " producto" : " productos") + ", total " + total
      : "ver tu pedido, está vacío";
    var cab = $(".cabecera__pedir");
    var barra = $(".fab-pedido");
    if (cab) cab.setAttribute("aria-label", "Pedir: " + detalle);
    if (barra) barra.setAttribute("aria-label", "Pedir " + total + ": " + detalle);
    $$("[data-contador]").forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
    $$("[data-total]").forEach(function (el) {
      el.textContent = total;
    });
    var fab = $(".fab-pedido");
    if (fab) {
      fab.classList.toggle("is-visible", n > 0);
      if (rebotar) U.animar(fab.querySelector(".fab-pedido__icono"), "anim-rebote");
    }
    if (rebotar) U.animar($(".cabecera__pedir"), "anim-rebote");
  }

  // Mensaje para lectores de pantalla (región aria-live)
  function anunciar(texto) {
    var el = $("#anuncio-carrito");
    if (!el) return;
    el.textContent = "";
    setTimeout(function () {
      el.textContent = texto;
    }, 50);
  }

  function renderLineas() {
    var cont = $("#lineas-pedido");
    if (!cont) return;
    if (!estado.lineas.length) {
      cont.innerHTML =
        '<div class="vacio">' +
        '<span class="vacio__icono">' + U.icono("i-bolsa") + "</span>" +
        '<p class="display vacio__titulo">Tu pedido está vacío</p>' +
        '<p class="vacio__texto">Elegí lo que quieras del menú.</p>' +
        "</div>";
      pintarCantidadesHoja();
      return;
    }
    cont.innerHTML = estado.lineas
      .map(function (l) {
        var p = H.producto(l.id);
        if (!p) return "";
        return (
          '<div class="linea">' +
          '<img src="' + p.foto + '" alt="">' +
          '<div><div class="linea__nombre">' + U.esc(p.nombre) + "</div>" +
          '<div class="linea__precio">' + H.gs(p.precio * l.cant) + "</div></div>" +
          '<div class="stepper">' +
          '<button class="btn-redondo" type="button" data-menos="' + p.id + '" aria-label="Quitar un ' + U.esc(p.nombre) + '">' +
          U.icono(l.cant === 1 ? "i-basura" : "i-minus") + "</button>" +
          '<span class="stepper__n" aria-live="polite">' + l.cant + "</span>" +
          '<button class="btn-redondo" type="button" data-mas="' + p.id + '" aria-label="Sumar un ' + U.esc(p.nombre) + '">' + U.icono("i-plus") + "</button>" +
          "</div></div>"
        );
      })
      .join("");
    pintarCantidadesHoja();
  }

  // ---------- Menú completo dentro de la hoja ----------
  // Se arma una sola vez: las fotos (lazy) se descargan recién al abrir la hoja.
  function renderMenuHoja() {
    var cont = $("#hoja-menu-lista");
    if (!cont) return;
    cont.innerHTML = H.categorias
      .map(function (c) {
        return (
          '<h4 class="hoja-menu__categoria">' + U.icono(c.icono) + U.esc(c.nombre) + "</h4>" +
          '<div class="sugerencias">' +
          H.porCategoria(c.id)
            .map(function (p) {
              var encuadre = p.encuadre ? ' style="object-position:' + p.encuadre + '"' : "";
              return (
                '<div class="sugerencia">' +
                U.foto(p.foto, "", { sizes: "56px", atributos: 'width="56" height="56" loading="lazy" decoding="async"' + encuadre }) +
                '<div><div class="linea__nombre">' + U.esc(p.nombre) + "</div>" +
                '<div class="sugerencia__desc">' + U.esc(p.corta) + "</div>" +
                '<div class="linea__precio">' + H.gs(p.precio) + "</div></div>" +
                '<div class="sugerencia__accion">' +
                '<span class="sugerencia__cant" data-cant-hoja="' + p.id + '" aria-hidden="true" hidden></span>' +
                '<button class="btn-redondo btn-mas" type="button" data-agregar="' + p.id + '" aria-label="Agregar ' + U.esc(p.nombre) + '">' +
                U.icono("i-plus") + "</button></div></div>"
              );
            })
            .join("") +
          "</div>"
        );
      })
      .join("");
  }

  // Muestra en cada fila del menú cuántos hay en el pedido
  function pintarCantidadesHoja() {
    H.productos.forEach(function (p) {
      var el = $('[data-cant-hoja="' + p.id + '"]');
      if (!el) return;
      var linea = estado.lineas.filter(function (l) {
        return l.id === p.id;
      })[0];
      el.hidden = !linea;
      el.textContent = linea ? "×" + linea.cant : "";
      el.nextElementSibling.setAttribute("aria-label", "Agregar " + p.nombre + (linea ? ", " + linea.cant + " en tu pedido" : ""));
    });
  }

  function renderModalidad() {
    $$("#seg-modalidad [data-modalidad]").forEach(function (b) {
      var activo = b.getAttribute("data-modalidad") === estado.modalidad;
      b.classList.toggle("is-activo", activo);
      b.setAttribute("aria-checked", String(activo));
      b.tabIndex = activo ? 0 : -1;
    });
    var dir = $("#campo-direccion");
    if (dir) dir.hidden = estado.modalidad !== "delivery";
  }

  // Evento para la capa de animación (Lenis, confetti). Si nadie escucha, no pasa nada.
  function avisar(nombre, detalle) {
    var ev;
    try {
      ev = new CustomEvent(nombre, { detail: detalle });
    } catch (e) {
      ev = document.createEvent("CustomEvent");
      ev.initCustomEvent(nombre, false, false, detalle);
    }
    document.dispatchEvent(ev);
  }

  // ---------- Hoja (drawer) con manejo de foco ----------
  var ultimoFoco = null;

  function abrirHoja() {
    var hoja = $("#hoja-pedido");
    var velo = $("#velo");
    ultimoFoco = document.activeElement;
    renderLineas();
    renderModalidad();
    ocultarError();
    hoja.hidden = false;
    velo.hidden = false;
    $(".hoja__cuerpo", hoja).scrollTop = 0;
    document.body.style.overflow = "hidden";
    avisar("habibs:hoja", { abierta: true });
    requestAnimationFrame(function () {
      hoja.classList.add("is-abierta");
      velo.classList.add("is-abierto");
      var cerrar = hoja.querySelector("[data-cerrar-pedido]");
      if (cerrar) cerrar.focus({ preventScroll: true });
    });
  }

  function cerrarHoja() {
    var hoja = $("#hoja-pedido");
    var velo = $("#velo");
    if (hoja.hidden) return;
    hoja.classList.remove("is-abierta");
    velo.classList.remove("is-abierto");
    document.body.style.overflow = "";
    avisar("habibs:hoja", { abierta: false });
    setTimeout(function () {
      hoja.hidden = true;
      velo.hidden = true;
    }, 420);
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
  }

  function mostrarError(msg, campo) {
    var el = $("#hoja-error");
    el.textContent = msg;
    el.hidden = false;
    U.animar(el, "sacudir");
    if (campo) campo.focus();
  }

  function ocultarError() {
    var el = $("#hoja-error");
    if (el) el.hidden = true;
  }

  function enviarPedido() {
    if (!estado.lineas.length) {
      mostrarError("Sumá al menos un producto a tu pedido.");
      return;
    }
    var nombre = $("#f-nombre").value.trim();
    var direccion = $("#f-direccion").value.trim();
    var notas = $("#f-notas").value.trim();
    if (!nombre) {
      mostrarError("Contanos tu nombre para el pedido.", $("#f-nombre"));
      return;
    }
    if (estado.modalidad === "delivery" && !direccion) {
      mostrarError("Necesitamos la dirección para el delivery.", $("#f-direccion"));
      return;
    }
    ocultarError();

    var modalidades = {
      delivery: "Delivery",
      retiro: "Retiro en Casa Central (Av. Irrazábal)",
      auto: "Desde el auto · Costanera"
    };
    var renglones = estado.lineas.map(function (l) {
      var p = H.producto(l.id);
      return "• " + l.cant + "× " + p.nombre + " — " + H.gs(p.precio * l.cant);
    });
    var texto =
      "¡Hola Habib's! Quiero hacer un pedido:\n\n" +
      renglones.join("\n") +
      "\n\nTotal estimado: " + H.gs(montoTotal()) +
      "\nModalidad: " + modalidades[estado.modalidad] +
      "\nNombre: " + nombre +
      (estado.modalidad === "delivery" ? "\nDirección: " + direccion : "") +
      (notas ? "\nNotas: " + notas : "");

    window.open(H.linkWhatsApp(texto), "_blank", "noopener");
    U.toast("¡Listo! Terminá de enviarlo en WhatsApp");
    anunciar("Pedido listo. Se abrió WhatsApp para enviarlo.");
    avisar("habibs:pedido-enviado", { total: montoTotal() });
  }

  // ---------- Eventos (delegación) ----------
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-agregar],[data-abrir-pedido],[data-cerrar-pedido],[data-cat],[data-mas],[data-menos],[data-modalidad]");
    if (!t) return;
    if (t.hasAttribute("data-agregar")) {
      agregar(t.getAttribute("data-agregar"), t);
    } else if (t.hasAttribute("data-abrir-pedido")) {
      abrirHoja();
    } else if (t.hasAttribute("data-cerrar-pedido")) {
      cerrarHoja();
    } else if (t.hasAttribute("data-cat")) {
      if (t.closest("#chips-menu")) filtrar(t.getAttribute("data-cat"));
    } else if (t.hasAttribute("data-mas")) {
      cambiarCantidad(t.getAttribute("data-mas"), 1);
    } else if (t.hasAttribute("data-menos")) {
      cambiarCantidad(t.getAttribute("data-menos"), -1);
    } else if (t.hasAttribute("data-modalidad")) {
      estado.modalidad = t.getAttribute("data-modalidad");
      guardarEstado();
      renderModalidad();
    }
  });

  $("#velo").addEventListener("click", cerrarHoja);
  $("#enviar-pedido").addEventListener("click", enviarPedido);

  // Teclado en las categorías (patrón tablist): flechas, Inicio y Fin
  var chipsCont = $("#chips-menu");
  if (chipsCont) {
    chipsCont.addEventListener("keydown", function (e) {
      var teclas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1, Home: "ini", End: "fin" };
      if (!(e.key in teclas)) return;
      e.preventDefault();
      var chips = $$("[data-cat]", chipsCont);
      var i = chips.indexOf(document.activeElement);
      var paso = teclas[e.key];
      var sig = paso === "ini" ? 0 : paso === "fin" ? chips.length - 1 : (i + paso + chips.length) % chips.length;
      chips[sig].focus();
      filtrar(chips[sig].getAttribute("data-cat"));
    });
  }

  // Teclado en la modalidad (patrón radiogroup)
  var seg = $("#seg-modalidad");
  if (seg) {
    seg.addEventListener("keydown", function (e) {
      var d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      var ops = $$("[data-modalidad]", seg);
      var i = ops.indexOf(document.activeElement);
      var sig = ops[(i + d + ops.length) % ops.length];
      estado.modalidad = sig.getAttribute("data-modalidad");
      guardarEstado();
      renderModalidad();
      sig.focus();
    });
  }

  document.addEventListener("keydown", function (e) {
    var hoja = $("#hoja-pedido");
    if (hoja.hidden) return;
    if (e.key === "Escape") cerrarHoja();
    // Trampa de foco simple dentro de la hoja
    if (e.key === "Tab") {
      var focables = $$("button, a[href], input, textarea", hoja).filter(function (el) {
        return !el.disabled && el.offsetParent !== null;
      });
      if (!focables.length) return;
      var primero = focables[0];
      var ultimo = focables[focables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
  });

  // Links de WhatsApp con mensaje prearmado
  $$("[data-wa]").forEach(function (a) {
    a.href = H.linkWhatsApp(a.getAttribute("data-wa"));
  });

  // Año del footer
  $$("[data-anio]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---------- Abierto ahora / Cerrado (hora de Paraguay) ----------
  function pintarEstado() {
    var e = U.estadoLocal();
    $$("[data-estado]").forEach(function (el) {
      el.classList.remove("estado--pendiente");
      el.classList.toggle("estado--abierto", e.abierto);
      el.classList.toggle("estado--cerrado", !e.abierto);
      el.innerHTML =
        '<span class="estado__punto" aria-hidden="true"></span>' +
        (e.abierto ? "Abierto ahora · hasta las " + e.cierra : "Cerrado · abrimos a las " + e.abre);
    });
  }

  // ---------- Header al hacer scroll ----------
  var cabecera = $("#cabecera");
  function alScroll() {
    cabecera.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", alScroll, { passive: true });
  alScroll();

  var navMovil = $("#nav-movil");
  var navToggle = $(".nav-toggle");
  function abrirNav(abierta) {
    navToggle.setAttribute("aria-expanded", String(abierta));
    navMovil.inert = !abierta;
    cabecera.classList.toggle("is-menu-open", abierta);
  }
  navToggle.addEventListener("click", function () { abrirNav(navMovil.inert); });
  document.addEventListener("click", function (e) {
    if (!cabecera.contains(e.target) || e.target.closest("#nav-movil a")) {
      if (e.target.closest("#nav-movil a")) navToggle.focus({ preventScroll: true });
      abrirNav(false);
    }
  });
  cabecera.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !navMovil.inert) {
      abrirNav(false);
      navToggle.focus();
    }
  });
  window.matchMedia("(min-width: 860px)").addEventListener("change", function () { abrirNav(false); });

  // ---------- Revelado al scroll + nav activa ----------
  function observarRevelado() {
    var elementos = $$(".revelar:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      elementos.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    elementos.forEach(function (el) {
      io.observe(el);
    });
  }

  function observarNav() {
    if (!("IntersectionObserver" in window)) return;
    var links = $$(".nav a");
    var io = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle("is-activo", a.getAttribute("href") === "#" + en.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["favoritos", "menu", "promos", "galeria", "locales"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }

  // ---------- Modo offline (service worker compartido con el totem) ----------
  // ?sw=0 lo desactiva (útil mientras se edita el diseño)
  if (!/[?&]sw=0\b/.test(location.search) && "serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  // ---------- Inicio ----------
  pintarEstado();
  setInterval(pintarEstado, 60000);
  renderFavoritos();
  renderCinta();
  renderAsador();
  renderResenas();
  renderGaleria();
  renderTestimonios();
  renderChips();
  renderMenu();
  renderLocales();
  renderMenuHoja();
  renderModalidad();
  actualizarResumen(false);
  observarRevelado();
  observarNav();
})();
