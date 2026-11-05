/* =====================================================================
   HABIB'S · LÓGICA DEL TOTEM (totem.html)
   Flujo: Bienvenida → Categorías → Menú → (Producto) → Tu pedido → Listo
   - Modo kiosco: sin zoom, sin menú contextual, sin scroll accidental,
     pantalla completa, pantalla siempre encendida.
   - Inactividad: aviso a los 60 s y reinicio automático.
   - Offline: service worker (sw.js) cuando se sirve por http(s).
   ===================================================================== */
(function () {
  "use strict";

  var H = window.HABIBS;
  var U = window.HUI;

  // ---------- Configuración (ajustable sin tocar el resto) ----------
  var CONFIG = {
    inactividadMs: 60000, // sin tocar la pantalla → aparece "¿Seguís ahí?"
    avisoSeg: 15, // cuenta regresiva del aviso antes de reiniciar
    volverSeg: 20, // pantalla "Listo" → vuelve sola a la bienvenida
    cambioFotoMs: 6000, // cambio de foto en la bienvenida
    staffMs: 3000, // mantener presionado el logo para abrir el panel del personal
    clavePedidos: "habibs-totem-pedidos-v1",
    claveNumero: "habibs-totem-numero-v1",
    numeroInicial: 100,
    maxPedidosGuardados: 60
  };

  var ESTADOS_COCINA = ["Pendiente", "En preparación", "Listo"];

  var app = document.getElementById("app");

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  // ---------- Estado de la sesión del cliente ----------
  function nuevoEstado() {
    return {
      pantalla: "bienvenida",
      categoria: H.categorias[0].id,
      lineas: [], // [{clave, id, sel:{grupo:[opciones]}, cant, unit}]
      dondeCome: null, // "aqui" | "llevar"
      pago: null, // "efectivo" | "tarjeta"
      edicion: null, // producto abierto en la hoja
      ultimoPedido: null
    };
  }

  var estado = nuevoEstado();

  // =====================================================================
  // VISTA PREVIA: en una pantalla horizontal (notebook para la
  // presentación) el totem se dibuja a 1080x1920 y se escala para caber.
  // Forzar con ?vista=previa o ?vista=kiosco
  // =====================================================================
  function esVistaPrevia() {
    return document.documentElement.classList.contains("vista-previa");
  }

  function ajustarVista() {
    var forzar = null;
    try {
      forzar = new URLSearchParams(window.location.search).get("vista");
    } catch (e) {
      /* navegador sin URLSearchParams: decide por orientación */
    }
    var horizontal = window.innerWidth > window.innerHeight * 0.8;
    // En Fully Kiosk siempre es el equipo real, aunque Android arranque en horizontal
    var previa = forzar === "previa" || (forzar !== "kiosco" && !window.HABIBS_FULLY && horizontal);
    document.documentElement.classList.toggle("vista-previa", previa);
    if (previa) {
      var escala = Math.min((window.innerHeight - 48) / 1920, (window.innerWidth - 48) / 1080);
      app.style.setProperty("--escala", Math.max(0.1, escala).toFixed(4));
    } else {
      app.style.removeProperty("--escala");
    }
  }

  // =====================================================================
  // CÁLCULOS DEL PEDIDO
  // =====================================================================
  function buscarOpcion(grupo, id) {
    for (var i = 0; i < grupo.opciones.length; i++) {
      if (grupo.opciones[i].id === id) return grupo.opciones[i];
    }
    return null;
  }

  function precioUnitario(producto, sel) {
    var extra = 0;
    (producto.grupos || []).forEach(function (g) {
      (sel[g.id] || []).forEach(function (oid) {
        var o = buscarOpcion(g, oid);
        if (o) extra += o.precio;
      });
    });
    return producto.precio + extra;
  }

  // Notas legibles para cliente y cocina ("SIN CEBOLLA", "+ Extra queso"…)
  function notasLinea(linea) {
    var p = H.producto(linea.id);
    var notas = [];
    (p.grupos || []).forEach(function (g) {
      (linea.sel[g.id] || []).forEach(function (oid) {
        var o = buscarOpcion(g, oid);
        if (!o) return;
        if (g.esExclusion) notas.push({ texto: o.nombre.toUpperCase(), sin: true });
        else notas.push({ texto: o.precio ? "+ " + o.nombre : o.nombre, sin: false });
      });
    });
    return notas;
  }

  function cantidadTotal() {
    return estado.lineas.reduce(function (s, l) {
      return s + l.cant;
    }, 0);
  }

  function montoTotal() {
    return estado.lineas.reduce(function (s, l) {
      return s + l.unit * l.cant;
    }, 0);
  }

  function claveLinea(id, sel) {
    var partes = Object.keys(sel)
      .sort()
      .map(function (g) {
        return g + ":" + sel[g].slice().sort().join(",");
      });
    return id + "|" + partes.join(";");
  }

  // =====================================================================
  // NAVEGACIÓN ENTRE PANTALLAS
  // =====================================================================
  function ir(pantalla) {
    estado.pantalla = pantalla;
    ocultarToast();
    app.setAttribute("data-pantalla", pantalla);
    render(pantalla, true);
    $$(".pantalla", app).forEach(function (s) {
      s.classList.toggle("is-activa", s.getAttribute("data-pantalla") === pantalla);
    });
    if (pantalla === "bienvenida") iniciarFotos();
    else detenerFotos();
    if (pantalla === "listo") iniciarCuentaListo();
    else detenerCuentaListo();
    actualizarBarra(false);
  }

  function render(pantalla, entrando) {
    if (pantalla === "inicio") renderInicio();
    else if (pantalla === "menu") renderMenu(entrando);
    else if (pantalla === "pedido") renderPedido(entrando);
    else if (pantalla === "listo") renderListo();
  }

  // Barra superior compartida
  function barraSup(pasoActivo) {
    var pasos = ["Elegí", "Confirmá", "Retirá"];
    return (
      '<header class="barra-sup">' +
      '<button class="brand brand--claro" type="button" data-brand="claro" data-ir="inicio" aria-label="Volver a las categorías">' +
      U.marca("claro") +
      "</button>" +
      '<div class="barra-sup__pasos" aria-hidden="true">' +
      pasos
        .map(function (p, i) {
          return (
            '<span class="paso' + (i + 1 === pasoActivo ? " is-activo" : "") + '"><span class="paso__n">' + (i + 1) + "</span>" + p + "</span>"
          );
        })
        .join("") +
      "</div>" +
      '<button class="btn btn--vidrio barra-sup__cancelar" type="button" data-accion="cancelar">' +
      U.icono("i-cerrar") +
      "Cancelar</button>" +
      "</header>"
    );
  }

  function ponerBarraSup(seccionId, paso) {
    var slot = $("#" + seccionId + " .barra-sup-slot");
    if (slot) slot.outerHTML = barraSup(paso);
    else {
      var actual = $("#" + seccionId + " .barra-sup");
      if (actual) actual.outerHTML = barraSup(paso);
    }
  }

  // =====================================================================
  // 2. CATEGORÍAS
  // =====================================================================
  function renderInicio() {
    ponerBarraSup("s-inicio", 1);
    var cats = H.categorias
      .map(function (c, i) {
        var n = H.porCategoria(c.id).length;
        return (
          '<button class="cat" type="button" data-cat="' + c.id + '" style="animation-delay:' + i * 70 + 'ms">' +
          '<img src="' + c.foto + '" alt="">' +
          '<span class="cat__icono">' + U.icono(c.icono) + "</span>" +
          '<span class="cat__nombre">' + U.esc(c.nombre) + "</span>" +
          '<span class="cat__meta"><span>' + n + (n === 1 ? " opción" : " opciones") + "</span>" +
          '<span class="cat__flecha">' + U.icono("i-flecha-der") + "</span></span>" +
          "</button>"
        );
      })
      .join("");

    var favs = H.masPedidos()
      .slice(0, 3)
      .map(function (p) {
        return (
          '<button class="fav" type="button" data-producto="' + p.id + '">' +
          '<img src="' + p.foto + '" alt="">' +
          '<span class="fav__nombre">' + U.esc(p.nombre) + "</span>" +
          '<span class="fav__pie"><span class="precio">' + H.gs(p.precio) + "</span>" +
          '<span class="fav__mas">' + U.icono("i-plus") + "</span></span>" +
          "</button>"
        );
      })
      .join("");

    $("#inicio-cuerpo").innerHTML =
      '<div class="inicio__saludo"><span class="kicker kicker--rojo">¡Hola! Empezá tu pedido</span>' +
      '<h1 class="display inicio__titulo">¿Qué se te antoja hoy?</h1></div>' +
      '<div class="cats">' + cats + "</div>" +
      '<div class="favs"><p class="favs__titulo">' + U.icono("i-estrella") + "Los más pedidos</p>" +
      '<div class="favs__grilla">' + favs + "</div></div>";
  }

  // =====================================================================
  // 3. MENÚ POR CATEGORÍA
  // =====================================================================
  function renderMenu(entrando) {
    ponerBarraSup("s-menu", 1);
    var cat = H.categorias.filter(function (c) {
      return c.id === estado.categoria;
    })[0];
    var productos = H.porCategoria(cat.id);

    $("#riel").innerHTML =
      '<button class="riel__btn riel__btn--volver" type="button" data-ir="inicio">' + U.icono("i-flecha-izq") + "Inicio</button>" +
      H.categorias
        .map(function (c) {
          var activo = c.id === cat.id;
          return (
            '<button class="riel__btn' + (activo ? " is-activo" : "") + '" type="button" data-cat="' + c.id + '" aria-pressed="' + activo + '">' +
            '<span class="riel__icono">' + U.icono(c.icono) + "</span>" + U.esc(c.corto) + "</button>"
          );
        })
        .join("");

    $("#menu-cabeza").innerHTML =
      '<span class="kicker kicker--rojo">Nuestro menú</span>' +
      '<h1 class="display menu__titulo">' + U.esc(cat.nombre) + "</h1>" +
      '<p class="menu__sub">' + productos.length + (productos.length === 1 ? " opción" : " opciones") + " · " + (productos.some(function (p) { return p.grupos; }) ? "Tocá para personalizar" : "Tocá para agregar") + "</p>";

    var grilla = $("#menu-grilla");
    grilla.innerHTML = productos
      .map(function (p, i) {
        var encuadre = p.encuadre ? ' style="object-position:' + p.encuadre + '"' : "";
        return (
          '<article class="card card--t" role="button" tabindex="0" data-producto="' + p.id + '" style="animation-delay:' + i * 60 + 'ms">' +
          '<div class="card__media"><img src="' + p.foto + '" alt=""' + encuadre + ">" +
          (p.masPedido ? '<span class="badge">' + U.icono("i-estrella") + "Más pedido</span>" : "") +
          "</div>" +
          '<div class="card__body">' +
          '<h3 class="card__titulo">' + U.esc(p.nombre) + "</h3>" +
          '<p class="card__desc">' + U.esc(p.descripcion) + "</p>" +
          '<div class="card__pie"><span class="precio">' + H.gs(p.precio) + "</span>" +
          '<span class="btn-redondo btn-mas" aria-hidden="true">' + U.icono("i-plus") + "</span></div>" +
          "</div></article>"
        );
      })
      .join("");
    if (entrando !== false) grilla.scrollTop = 0;
  }

  // =====================================================================
  // HOJA DE PRODUCTO (personalización)
  // =====================================================================
  function abrirProducto(id) {
    var p = H.producto(id);
    if (!p) return;
    var sel = {};
    (p.grupos || []).forEach(function (g) {
      sel[g.id] = g.opciones
        .filter(function (o) {
          return o.porDefecto;
        })
        .map(function (o) {
          return o.id;
        });
    });
    estado.edicion = { id: id, sel: sel, cant: 1 };
    renderHoja();
    $("#velo-producto").classList.add("is-abierto");
    requestAnimationFrame(function () {
      // Si ya se cerró (toque muy rápido), no la vuelve a abrir
      if (estado.edicion) $("#hoja-producto").classList.add("is-abierta");
    });
  }

  function cerrarProducto() {
    $("#velo-producto").classList.remove("is-abierto");
    $("#hoja-producto").classList.remove("is-abierta");
    estado.edicion = null;
  }

  function renderHoja() {
    var ed = estado.edicion;
    var p = H.producto(ed.id);
    var encuadre = p.encuadre ? ' style="object-position:' + p.encuadre + '"' : "";

    var grupos = (p.grupos || [])
      .map(function (g) {
        var opciones = g.opciones
          .map(function (o) {
            var activo = ed.sel[g.id].indexOf(o.id) >= 0;
            return (
              '<button class="opt' + (g.multiple ? " opt--multi" : "") + (g.esExclusion ? " opt--sin" : "") + (activo ? " is-activo" : "") +
              '" type="button" data-grupo="' + g.id + '" data-opcion="' + o.id + '" aria-pressed="' + activo + '">' +
              '<span class="opt__marca">' + U.icono("i-check") + "</span>" +
              '<span class="opt__texto">' + U.esc(o.nombre) + "</span>" +
              (o.precio ? '<span class="opt__precio">+ ' + H.gs(o.precio) + "</span>" : "") +
              "</button>"
            );
          })
          .join("");
        return (
          '<div class="grupo"><div class="grupo__cabeza"><h3 class="grupo__titulo">' + U.esc(g.nombre) + "</h3>" +
          '<span class="grupo__tipo' + (g.obligatorio ? " grupo__tipo--req" : "") + '">' +
          (g.obligatorio ? "Elegí 1" : g.multiple ? "Opcional · podés elegir varios" : "Opcional") +
          "</span></div>" +
          '<div class="grupo__opciones">' + opciones + "</div></div>"
        );
      })
      .join("");

    $("#hoja-producto").innerHTML =
      '<div class="hoja-t__foto"><img src="' + p.foto + '" alt=""' + encuadre + ">" +
      (p.masPedido ? '<span class="badge">' + U.icono("i-estrella") + "Más pedido</span>" : "") +
      '<button class="btn-redondo hoja-t__cerrar" type="button" data-accion="cerrar-producto" aria-label="Cerrar">' + U.icono("i-cerrar") + "</button>" +
      "</div>" +
      '<div class="hoja-t__cuerpo desliza">' +
      '<h2 class="display hoja-t__nombre">' + U.esc(p.nombre) + "</h2>" +
      '<p class="hoja-t__desc">' + U.esc(p.descripcion) + "</p>" +
      '<p class="precio hoja-t__base">' + H.gs(p.precio) + "</p>" +
      grupos +
      "</div>" +
      '<div class="hoja-t__pie">' +
      '<div class="stepper">' +
      '<button class="btn-redondo" type="button" data-accion="menos-edicion" aria-label="Uno menos">' + U.icono("i-minus") + "</button>" +
      '<span class="stepper__n" id="edicion-cant">' + ed.cant + "</span>" +
      '<button class="btn-redondo" type="button" data-accion="mas-edicion" aria-label="Uno más">' + U.icono("i-plus") + "</button>" +
      "</div>" +
      '<button class="btn btn--rojo btn--grande" type="button" data-accion="agregar-edicion">' +
      U.icono("i-bolsa") + 'Agregar · <span id="edicion-total">' + H.gs(precioUnitario(p, ed.sel) * ed.cant) + "</span></button>" +
      "</div>";
  }

  // Actualiza solo lo necesario (no re-renderiza: conserva el scroll)
  function refrescarHoja() {
    var ed = estado.edicion;
    if (!ed) return;
    var p = H.producto(ed.id);
    $$("#hoja-producto .opt").forEach(function (b) {
      var activo = (ed.sel[b.getAttribute("data-grupo")] || []).indexOf(b.getAttribute("data-opcion")) >= 0;
      b.classList.toggle("is-activo", activo);
      b.setAttribute("aria-pressed", String(activo));
    });
    $("#edicion-cant").textContent = ed.cant;
    $("#edicion-total").textContent = H.gs(precioUnitario(p, ed.sel) * ed.cant);
  }

  function tocarOpcion(grupoId, opcionId) {
    var ed = estado.edicion;
    var p = H.producto(ed.id);
    var g = (p.grupos || []).filter(function (x) {
      return x.id === grupoId;
    })[0];
    if (!g) return;
    var actual = ed.sel[g.id] || [];
    if (g.multiple) {
      var i = actual.indexOf(opcionId);
      if (i >= 0) actual.splice(i, 1);
      else actual.push(opcionId);
      ed.sel[g.id] = actual;
    } else {
      ed.sel[g.id] = [opcionId]; // una sola opción (obligatoria)
    }
    refrescarHoja();
  }

  function agregarEdicion() {
    var ed = estado.edicion;
    var p = H.producto(ed.id);
    var sel = {};
    Object.keys(ed.sel).forEach(function (k) {
      sel[k] = ed.sel[k].slice();
    });
    var clave = claveLinea(ed.id, sel);
    var existente = estado.lineas.filter(function (l) {
      return l.clave === clave;
    })[0];
    if (existente) existente.cant = Math.min(existente.cant + ed.cant, 20);
    else estado.lineas.push({ clave: clave, id: ed.id, sel: sel, cant: ed.cant, unit: precioUnitario(p, sel) });
    cerrarProducto();
    actualizarBarra(true);
    toast(ed.cant > 1 ? ed.cant + " × " + p.nombre + " al pedido" : "¡" + p.nombre + " al pedido!");
    if (estado.pantalla === "pedido") renderPedido(false);
  }

  // =====================================================================
  // BARRA DEL PEDIDO
  // =====================================================================
  function actualizarBarra(rebotar) {
    var barra = $("#barra-pedido");
    var n = cantidadTotal();
    barra.classList.toggle("is-llena", n > 0);
    barra.setAttribute("aria-hidden", String(!(estado.pantalla === "inicio" || estado.pantalla === "menu")));
    $("#barra-n").textContent = n;
    $(".barra-pedido__texto span", barra).textContent = n > 0 ? "Tu pedido · " + n + (n === 1 ? " producto" : " productos") : "Tu pedido está vacío";
    $("#barra-total").textContent = n > 0 ? H.gs(montoTotal()) : "Elegí algo rico";
    if (rebotar) U.animar($(".barra-pedido__icono", barra), "anim-rebote");
  }

  // =====================================================================
  // 4. TU PEDIDO
  // =====================================================================
  function sugerencia() {
    var ids = estado.lineas.map(function (l) {
      return l.id;
    });
    var tieneBebida = estado.lineas.some(function (l) {
      return H.producto(l.id).categoria === "bebidas";
    });
    if (ids.indexOf("papas-fritas") < 0) return { id: "papas-fritas", titulo: "¿Le sumamos unas papas?", texto: "Crocantes, para compartir." };
    if (!tieneBebida) return { id: "coca-500", titulo: "¿Algo bien frío para tomar?", texto: "Coca-Cola 500 ml." };
    return null;
  }

  function renderPedido(entrando) {
    ponerBarraSup("s-pedido", 2);
    var cuerpo = $("#pedido-cuerpo");

    if (!estado.lineas.length) {
      cuerpo.innerHTML =
        '<div class="pedido-vacio">' +
        '<span class="pedido-vacio__icono">' + U.icono("i-bolsa") + "</span>" +
        '<h2 class="display">Tu pedido está vacío</h2>' +
        "<p>Elegí algo rico para empezar.</p>" +
        '<button class="btn btn--rojo btn--grande" type="button" data-ir="inicio">Ver el menú ' + U.icono("i-flecha-der") + "</button>" +
        "</div>";
      return;
    }

    // Conserva el scroll de la lista al actualizar cantidades
    var listaPrevia = $(".pedido__lista", cuerpo);
    var scrollPrevio = listaPrevia && entrando === false ? listaPrevia.scrollTop : 0;
    cuerpo.classList.toggle("sin-anim", entrando === false);

    var lineas = estado.lineas
      .map(function (l) {
        var p = H.producto(l.id);
        var notas = notasLinea(l)
          .map(function (n) {
            return n.sin ? '<span class="nota--sin">' + U.esc(n.texto) + "</span>" : U.esc(n.texto);
          })
          .join(" · ");
        return (
          '<div class="linea-t">' +
          '<img src="' + p.foto + '" alt=""' + (p.encuadre ? ' style="object-position:' + p.encuadre + '"' : "") + ">" +
          "<div>" +
          '<div class="linea-t__nombre">' + U.esc(p.nombre) + "</div>" +
          (notas ? '<div class="linea-t__notas">' + notas + "</div>" : "") +
          '<div class="precio linea-t__precio">' + H.gs(l.unit * l.cant) + "</div>" +
          "</div>" +
          '<div class="stepper">' +
          '<button class="btn-redondo" type="button" data-menos="' + U.esc(l.clave) + '" aria-label="Uno menos">' +
          U.icono(l.cant === 1 ? "i-basura" : "i-minus") + "</button>" +
          '<span class="stepper__n">' + l.cant + "</span>" +
          '<button class="btn-redondo" type="button" data-mas="' + U.esc(l.clave) + '" aria-label="Uno más">' + U.icono("i-plus") + "</button>" +
          "</div></div>"
        );
      })
      .join("");

    var sug = sugerencia();
    var sugHtml = "";
    if (sug) {
      var ps = H.producto(sug.id);
      sugHtml =
        '<div class="sugerido">' +
        '<img src="' + ps.foto + '" alt=""' + (ps.encuadre ? ' style="object-position:' + ps.encuadre + '"' : "") + ">" +
        '<div class="sugerido__texto"><strong>' + sug.titulo + "</strong><span>" + sug.texto + " " + H.gs(ps.precio) + "</span></div>" +
        '<button class="btn btn--rojo" type="button" data-sugerido="' + ps.id + '">' + U.icono("i-plus") + "Sumar</button>" +
        "</div>";
    }

    function opcion(tipo, valor, icono, titulo, sub) {
      var activo = estado[tipo] === valor;
      return (
        '<button class="opcion-grande' + (activo ? " is-activo" : "") + '" type="button" data-' + (tipo === "dondeCome" ? "donde" : "pago") + '="' + valor + '" aria-pressed="' + activo + '">' +
        '<span class="opcion-grande__icono">' + U.icono(icono) + "</span>" +
        "<span>" + titulo + "<small>" + sub + "</small></span></button>"
      );
    }

    var completo = !!(estado.dondeCome && estado.pago);

    cuerpo.innerHTML =
      '<div class="pedido__cabeza">' +
      '<h1 class="display pedido__titulo">Tu pedido</h1>' +
      '<button class="btn btn--blanco" type="button" data-ir="menu">' + U.icono("i-flecha-izq") + "Seguir pidiendo</button>" +
      "</div>" +
      '<div class="pedido__lista desliza">' + lineas + "</div>" +
      sugHtml +
      '<div class="elecciones">' +
      '<div class="eleccion' + (estado.dondeCome ? " is-lista" : "") + '"><p class="eleccion__titulo"><span class="eleccion__n">1</span>¿Dónde lo comés?</p>' +
      '<div class="opciones-2">' +
      opcion("dondeCome", "aqui", "i-plato", "Para comer aquí", "En el local") +
      opcion("dondeCome", "llevar", "i-llevar", "Para llevar", "Bien empaquetado") +
      "</div></div>" +
      '<div class="eleccion' + (estado.pago ? " is-lista" : "") + '"><p class="eleccion__titulo"><span class="eleccion__n">2</span>¿Cómo pagás en caja?</p>' +
      '<div class="opciones-2">' +
      opcion("pago", "efectivo", "i-efectivo", "Efectivo", "Guaraníes en caja") +
      opcion("pago", "tarjeta", "i-tarjeta", "Tarjeta o QR", "Débito, crédito o QR") +
      "</div></div>" +
      "</div>" +
      (completo ? "" : '<p class="pedido__aviso">Elegí dónde lo comés y cómo pagás para confirmar.</p>') +
      '<div class="pedido__pie">' +
      '<div class="pedido__total"><span>Total</span><strong class="precio">' + H.gs(montoTotal()) + "</strong></div>" +
      '<button class="btn btn--rojo btn--grande" type="button" data-accion="confirmar"' + (completo ? "" : " disabled") + ">" +
      U.icono("i-check") + "Confirmar pedido</button>" +
      "</div>";

    var lista = $(".pedido__lista", cuerpo);
    if (scrollPrevio) lista.scrollTop = scrollPrevio;
    lista.addEventListener("scroll", marcarLista, { passive: true });
    marcarLista();
    setTimeout(marcarLista, 450); // la animación de entrada infla la medida al principio
  }

  // Difumina el borde inferior mientras queden productos por ver en la lista
  function marcarLista() {
    var lista = $(".pedido__lista");
    if (lista) lista.classList.toggle("hay-mas", lista.scrollTop + lista.clientHeight < lista.scrollHeight - 4);
  }

  function cambiarCantidad(clave, delta) {
    estado.lineas = estado.lineas
      .map(function (l) {
        if (l.clave === clave) l.cant = Math.max(0, Math.min(20, l.cant + delta));
        return l;
      })
      .filter(function (l) {
        return l.cant > 0;
      });
    actualizarBarra(false);
    renderPedido(false);
  }

  function sumarSugerido(id) {
    var p = H.producto(id);
    var sel = {};
    (p.grupos || []).forEach(function (g) {
      sel[g.id] = g.opciones
        .filter(function (o) {
          return o.porDefecto;
        })
        .map(function (o) {
          return o.id;
        });
    });
    var clave = claveLinea(id, sel);
    var existente = estado.lineas.filter(function (l) {
      return l.clave === clave;
    })[0];
    if (existente) existente.cant += 1;
    else estado.lineas.push({ clave: clave, id: id, sel: sel, cant: 1, unit: precioUnitario(p, sel) });
    actualizarBarra(true);
    renderPedido(false);
    var lista = $(".pedido__lista");
    if (lista) lista.scrollTop = lista.scrollHeight;
    marcarLista();
  }

  // =====================================================================
  // CONFIRMAR → COCINA
  // =====================================================================
  function dosDigitos(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function confirmar() {
    if (!estado.lineas.length || !estado.dondeCome || !estado.pago) return;

    var n = Number(U.leer(CONFIG.claveNumero, CONFIG.numeroInicial)) + 1;
    if (!isFinite(n) || n > 999) n = CONFIG.numeroInicial + 1;
    U.guardar(CONFIG.claveNumero, n);

    var ahora = new Date();
    var pedido = {
      numero: "H-" + String(n),
      hora: dosDigitos(ahora.getHours()) + ":" + dosDigitos(ahora.getMinutes()),
      fecha: ahora.toISOString(),
      dondeCome: estado.dondeCome,
      pago: estado.pago,
      total: montoTotal(),
      cantidad: cantidadTotal(),
      estadoCocina: 0,
      lineas: estado.lineas.map(function (l) {
        return {
          cant: l.cant,
          nombre: H.producto(l.id).nombre,
          notas: notasLinea(l).map(function (x) {
            return x.texto;
          }),
          total: l.unit * l.cant
        };
      })
    };

    enviarACocina(pedido);

    estado.ultimoPedido = pedido;
    estado.lineas = [];
    estado.dondeCome = null;
    estado.pago = null;
    ir("listo");
  }

  /* PUNTO DE INTEGRACIÓN: hoy el pedido se guarda en el propio totem
     (panel del personal). Para mandarlo a una impresora de comandas,
     a un POS o a una pantalla de cocina, agregar acá la llamada
     (ej. fetch POST a la API del local) con reintento si no hay red. */
  function enviarACocina(pedido) {
    var lista = U.leer(CONFIG.clavePedidos, []);
    if (!Array.isArray(lista)) lista = [];
    lista.unshift(pedido);
    U.guardar(CONFIG.clavePedidos, lista.slice(0, CONFIG.maxPedidosGuardados));
  }

  // =====================================================================
  // 5. LISTO
  // =====================================================================
  var cuentaListo = null;

  function renderListo() {
    var p = estado.ultimoPedido;
    if (!p) return;
    var pagoTxt = p.pago === "efectivo" ? "en efectivo" : "con tarjeta o QR";
    $("#listo-cuerpo").innerHTML =
      '<span class="listo__check">' + U.icono("i-check") + "</span>" +
      '<h1 class="display listo__titulo">¡Pedido confirmado!</h1>' +
      '<div class="listo__tarjeta">' +
      '<span class="kicker kicker--rojo">Tu número de pedido</span>' +
      '<p class="display listo__numero">' + U.esc(p.numero) + "</p>" +
      '<div class="listo__chips">' +
      '<span class="badge">' + U.icono(p.dondeCome === "aqui" ? "i-plato" : "i-llevar") + (p.dondeCome === "aqui" ? "Para comer aquí" : "Para llevar") + "</span>" +
      '<span class="badge">' + U.icono(p.pago === "efectivo" ? "i-efectivo" : "i-tarjeta") + (p.pago === "efectivo" ? "Efectivo" : "Tarjeta o QR") + "</span>" +
      '<span class="badge">' + U.icono("i-bolsa") + p.cantidad + (p.cantidad === 1 ? " producto" : " productos") + "</span>" +
      "</div>" +
      '<div class="listo__paso"><span class="listo__paso-icono">' + U.icono(p.pago === "efectivo" ? "i-efectivo" : "i-tarjeta") + "</span>" +
      "<span>Pasá por caja con tu número y pagá " + pagoTxt + ". Te llamamos cuando esté listo.</span></div>" +
      '<p class="listo__total">Total<strong>' + H.gs(p.total) + "</strong></p>" +
      "</div>" +
      '<p class="listo__foto">' + U.icono("i-camara") + 'Sacale una foto a tu número</p>' +
      '<div class="listo__pie">' +
      '<button class="btn btn--blanco btn--grande" type="button" data-accion="nuevo">Hacer un nuevo pedido</button>' +
      '<p class="listo__cuenta">Volvemos al inicio en <strong id="listo-seg">' + CONFIG.volverSeg + "</strong> s</p>" +
      "</div>";
  }

  function iniciarCuentaListo() {
    detenerCuentaListo();
    var restante = CONFIG.volverSeg;
    cuentaListo = setInterval(function () {
      restante -= 1;
      var el = $("#listo-seg");
      if (el) el.textContent = restante;
      if (restante <= 0) reiniciar();
    }, 1000);
  }

  function detenerCuentaListo() {
    clearInterval(cuentaListo);
    cuentaListo = null;
  }

  // =====================================================================
  // 1. BIENVENIDA: fotos que se van alternando
  // =====================================================================
  var timerFotos = null;

  function siguienteFoto() {
    var fotos = $$(".bienvenida__fotos img");
    var i = 0;
    fotos.forEach(function (f, idx) {
      if (f.classList.contains("is-activa")) i = idx;
    });
    var actual = fotos[i];
    var sig = fotos[(i + 1) % fotos.length];
    // La saliente mantiene su animación mientras se desvanece (sin saltos)
    actual.classList.add("is-saliendo");
    actual.classList.remove("is-activa");
    sig.classList.remove("is-saliendo");
    sig.classList.add("is-activa");
    setTimeout(function () {
      actual.classList.remove("is-saliendo");
    }, 1600);
  }

  function iniciarFotos() {
    detenerFotos();
    timerFotos = setInterval(siguienteFoto, CONFIG.cambioFotoMs);
  }

  function detenerFotos() {
    clearInterval(timerFotos);
    timerFotos = null;
  }

  // Badge de la bienvenida con el horario real (no dice "Abierto" si está cerrado)
  function pintarEstado() {
    var e = U.estadoLocal();
    $("#bienvenida-estado").textContent = e.abierto ? "Abierto ahora · hasta las " + e.cierra : "Cerrado · abrimos a las " + e.abre;
  }

  // =====================================================================
  // CANCELAR / REINICIAR
  // =====================================================================
  function abrirModal(id) {
    $("#" + id).classList.add("is-abierto");
  }

  function cerrarModal(id) {
    $("#" + id).classList.remove("is-abierto");
  }

  function pedirCancelar() {
    if (!estado.lineas.length) {
      reiniciar();
      return;
    }
    abrirModal("modal-cancelar");
  }

  function reiniciar() {
    cerrarProducto();
    cerrarAviso();
    cerrarModal("modal-cancelar");
    estado = nuevoEstado();
    ir("bienvenida");
    actualizarBarra(false);
  }

  // =====================================================================
  // INACTIVIDAD
  // =====================================================================
  var ultimoToque = Date.now();
  var avisoAbierto = false;
  var timerAviso = null;
  var staffAbierto = false;

  function vigilarInactividad() {
    if (estado.pantalla === "bienvenida" || estado.pantalla === "listo" || staffAbierto || avisoAbierto) return;
    if (Date.now() - ultimoToque > CONFIG.inactividadMs) abrirAviso();
  }

  function abrirAviso() {
    avisoAbierto = true;
    var restante = CONFIG.avisoSeg;
    var circulo = $("#anillo-inactivo .anillo__progreso");
    var largo = 276.46;
    $("#inactivo-n").textContent = restante;
    circulo.style.transition = "none";
    circulo.style.strokeDashoffset = "0";
    void circulo.getBoundingClientRect();
    circulo.style.transition = "";
    abrirModal("modal-inactivo");
    timerAviso = setInterval(function () {
      restante -= 1;
      $("#inactivo-n").textContent = Math.max(0, restante);
      circulo.style.strokeDashoffset = String(largo * (1 - restante / CONFIG.avisoSeg));
      if (restante <= 0) reiniciar();
    }, 1000);
  }

  function cerrarAviso() {
    clearInterval(timerAviso);
    timerAviso = null;
    avisoAbierto = false;
    cerrarModal("modal-inactivo");
    ultimoToque = Date.now();
  }

  // =====================================================================
  // PANEL DEL PERSONAL (mantener presionado el logo de la bienvenida)
  // =====================================================================
  var timerStaff = null;

  function renderStaff() {
    var lista = U.leer(CONFIG.clavePedidos, []);
    if (!Array.isArray(lista)) lista = [];
    $("#staff-lista").innerHTML = lista.length
      ? lista
          .map(function (p, i) {
            var est = ESTADOS_COCINA[p.estadoCocina || 0];
            var items = (p.lineas || [])
              .map(function (l) {
                return l.cant + "× " + U.esc(l.nombre) + (l.notas && l.notas.length ? " (" + U.esc(l.notas.join(", ")) + ")" : "");
              })
              .join("<br>");
            return (
              '<div class="ticket" data-estado="' + (p.estadoCocina === 2 ? "listo" : "") + '">' +
              '<span class="ticket__n">' + U.esc(p.numero) + "</span>" +
              '<div class="ticket__detalle"><strong>' + U.esc(p.hora) + " · " + (p.dondeCome === "aqui" ? "Comer aquí" : "Para llevar") +
              " · " + (p.pago === "efectivo" ? "Efectivo" : "Tarjeta/QR") + " · " + H.gs(p.total) + "</strong>" + items + "</div>" +
              '<button class="btn btn--tinta" type="button" data-ticket="' + i + '">' + est + "</button>" +
              "</div>"
            );
          })
          .join("")
      : '<p class="staff__vacio">Todavía no hay pedidos en este totem.</p>';
    actualizarRed();
  }

  function abrirStaff() {
    staffAbierto = true;
    renderStaff();
    abrirModal("panel-staff");
  }

  function cerrarStaff() {
    staffAbierto = false;
    cerrarModal("panel-staff");
  }

  function actualizarRed() {
    var el = $("#staff-red");
    var online = navigator.onLine !== false;
    el.textContent = online ? "En línea" : "Sin conexión";
    el.classList.toggle("is-offline", !online);
  }

  var confirmandoBorrado = null;
  function borrarPedidos(boton) {
    if (!confirmandoBorrado) {
      boton.textContent = "Tocá de nuevo para borrar";
      confirmandoBorrado = setTimeout(function () {
        boton.textContent = "Borrar pedidos de prueba";
        confirmandoBorrado = null;
      }, 3000);
      return;
    }
    clearTimeout(confirmandoBorrado);
    confirmandoBorrado = null;
    boton.textContent = "Borrar pedidos de prueba";
    U.guardar(CONFIG.clavePedidos, []);
    U.guardar(CONFIG.claveNumero, CONFIG.numeroInicial);
    renderStaff();
  }

  function ciclarTicket(i) {
    var lista = U.leer(CONFIG.clavePedidos, []);
    if (!lista[i]) return;
    lista[i].estadoCocina = ((lista[i].estadoCocina || 0) + 1) % ESTADOS_COCINA.length;
    U.guardar(CONFIG.clavePedidos, lista);
    renderStaff();
  }

  // =====================================================================
  // MODO KIOSCO: pantalla completa, pantalla encendida, sin gestos raros
  // =====================================================================
  function pedirPantallaCompleta() {
    var el = document.documentElement;
    // Fully Kiosk ya maneja la pantalla completa desde su configuración
    if (window.HABIBS_FULLY || document.fullscreenElement || !el.requestFullscreen) return;
    try {
      el.requestFullscreen({ navigationUI: "hide" })
        .then(function () {
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("portrait").catch(function () {});
          }
        })
        .catch(function () {});
    } catch (e) {
      /* navegador sin soporte: se sigue igual */
    }
  }

  function mantenerPantallaEncendida() {
    if (!("wakeLock" in navigator)) return;
    navigator.wakeLock.request("screen").catch(function () {});
  }

  function blindarKiosco() {
    // Sin menú contextual, sin arrastrar, sin seleccionar texto
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
    document.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });
    document.addEventListener("selectstart", function (e) {
      if (!e.target.closest || !e.target.closest("input, textarea")) e.preventDefault();
    });
    // Sin pinch-zoom ni scroll fuera de las listas
    document.addEventListener(
      "touchmove",
      function (e) {
        if (e.touches && e.touches.length > 1) {
          e.preventDefault();
          return;
        }
        if (!e.target.closest || !e.target.closest(".desliza")) e.preventDefault();
      },
      { passive: false }
    );
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
    });
    // Sin zoom con Ctrl + rueda / teclado (por si conectan teclado)
    document.addEventListener(
      "wheel",
      function (e) {
        if (e.ctrlKey) e.preventDefault();
      },
      { passive: false }
    );
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && ["+", "-", "=", "0"].indexOf(e.key) >= 0) e.preventDefault();
    });
    // Pantalla encendida siempre (se re-pide al volver a primer plano)
    mantenerPantallaEncendida();
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") mantenerPantallaEncendida();
    });
  }

  // =====================================================================
  // TOAST
  // =====================================================================
  var timerToast = null;

  function ocultarToast() {
    clearTimeout(timerToast);
    $("#toast-t").classList.remove("is-visible");
  }

  function toast(msg) {
    var el = $("#toast-t");
    el.innerHTML = U.icono("i-check") + "<span>" + U.esc(msg) + "</span>";
    void el.offsetWidth;
    el.classList.add("is-visible");
    clearTimeout(timerToast);
    timerToast = setTimeout(function () {
      el.classList.remove("is-visible");
    }, 1800);
  }

  // =====================================================================
  // EVENTOS
  // =====================================================================
  function registrarEventos() {
    // Cualquier toque cuenta como actividad (y en el equipo activa pantalla completa)
    document.addEventListener(
      "pointerdown",
      function () {
        ultimoToque = Date.now();
        if (!esVistaPrevia()) pedirPantallaCompleta();
      },
      true
    );

    // Bienvenida: toda la pantalla es el botón
    $("#s-bienvenida").addEventListener("click", function () {
      if (staffAbierto) return; // el toque venía del acceso del personal
      ir("inicio");
    });

    // Acceso del personal: mantener presionado el logo
    var marca = $("#marca-staff");
    marca.addEventListener("pointerdown", function () {
      clearTimeout(timerStaff);
      timerStaff = setTimeout(abrirStaff, CONFIG.staffMs);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) {
      marca.addEventListener(ev, function () {
        clearTimeout(timerStaff);
      });
    });

    // Barra del pedido: toda la barra lleva al pedido
    $("#barra-pedido").addEventListener("click", function (e) {
      if (cantidadTotal() > 0 && !e.target.closest("[data-ir]")) ir("pedido");
    });

    // Tarjetas: también responden a Enter y Espacio (por si conectan un teclado)
    app.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target.getAttribute("role") === "button") {
        e.preventDefault();
        e.target.click();
      }
    });

    $("#velo-producto").addEventListener("click", cerrarProducto);

    // Delegación de todos los botones de la app
    app.addEventListener("click", function (e) {
      var t = e.target.closest(
        "[data-ir],[data-cat],[data-producto],[data-accion],[data-grupo],[data-mas],[data-menos],[data-donde],[data-pago],[data-sugerido],[data-ticket]"
      );
      if (!t || t.disabled) return;
      e.stopPropagation();

      if (t.hasAttribute("data-grupo")) {
        tocarOpcion(t.getAttribute("data-grupo"), t.getAttribute("data-opcion"));
      } else if (t.hasAttribute("data-ir")) {
        ir(t.getAttribute("data-ir"));
      } else if (t.hasAttribute("data-cat")) {
        estado.categoria = t.getAttribute("data-cat");
        if (estado.pantalla === "menu") renderMenu(true);
        else ir("menu");
      } else if (t.hasAttribute("data-producto")) {
        abrirProducto(t.getAttribute("data-producto"));
      } else if (t.hasAttribute("data-mas")) {
        cambiarCantidad(t.getAttribute("data-mas"), 1);
      } else if (t.hasAttribute("data-menos")) {
        cambiarCantidad(t.getAttribute("data-menos"), -1);
      } else if (t.hasAttribute("data-donde")) {
        estado.dondeCome = t.getAttribute("data-donde");
        renderPedido(false);
      } else if (t.hasAttribute("data-pago")) {
        estado.pago = t.getAttribute("data-pago");
        renderPedido(false);
      } else if (t.hasAttribute("data-sugerido")) {
        sumarSugerido(t.getAttribute("data-sugerido"));
      } else if (t.hasAttribute("data-ticket")) {
        ciclarTicket(Number(t.getAttribute("data-ticket")));
      } else {
        accion(t.getAttribute("data-accion"), t);
      }
    });
  }

  function accion(nombre, boton) {
    switch (nombre) {
      case "cancelar":
        pedirCancelar();
        break;
      case "cancelar-si":
        reiniciar();
        break;
      case "cancelar-no":
        cerrarModal("modal-cancelar");
        break;
      case "cerrar-producto":
        cerrarProducto();
        break;
      case "mas-edicion":
        estado.edicion.cant = Math.min(estado.edicion.cant + 1, 20);
        refrescarHoja();
        break;
      case "menos-edicion":
        estado.edicion.cant = Math.max(estado.edicion.cant - 1, 1);
        refrescarHoja();
        break;
      case "agregar-edicion":
        agregarEdicion();
        break;
      case "confirmar":
        confirmar();
        break;
      case "nuevo":
        reiniciar();
        break;
      case "seguir":
        cerrarAviso();
        break;
      case "reiniciar":
        reiniciar();
        break;
      case "pantalla-completa":
        pedirPantallaCompleta();
        break;
      case "recargar":
        window.location.reload();
        break;
      case "borrar-pedidos":
        borrarPedidos(boton);
        break;
      case "cerrar-staff":
        cerrarStaff();
        break;
    }
  }

  // =====================================================================
  // OFFLINE: service worker (solo funciona servido por http/https)
  // =====================================================================
  function registrarOffline() {
    // ?sw=0 desactiva el modo offline (útil mientras se edita el diseño)
    var sinSW = /[?&]sw=0\b/.test(window.location.search);
    if (!sinSW && "serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () {});
      });
    }
    window.addEventListener("online", actualizarRed);
    window.addEventListener("offline", actualizarRed);
  }

  // Precarga de fotos para que todo abra instantáneo
  function precargarFotos() {
    var vistas = {};
    H.productos.concat(H.categorias).forEach(function (x) {
      if (vistas[x.foto]) return;
      vistas[x.foto] = true;
      var img = new Image();
      img.decoding = "async";
      img.src = x.foto;
    });
  }

  // =====================================================================
  // INICIO
  // =====================================================================
  function iniciar() {
    if (window.HABIBS_FULLY) {
      // La pantalla completa la maneja Fully: el botón del panel no haría nada
      var btnCompleta = $('[data-accion="pantalla-completa"]');
      if (btnCompleta) btnCompleta.remove();
    }
    ajustarVista();
    window.addEventListener("resize", ajustarVista);
    blindarKiosco();
    registrarEventos();
    registrarOffline();
    app.setAttribute("data-pantalla", "bienvenida");
    actualizarBarra(false);
    iniciarFotos();
    pintarEstado();
    setInterval(pintarEstado, 60000);
    setInterval(vigilarInactividad, 1000);
    setTimeout(precargarFotos, 1200);
  }

  iniciar();
})();
