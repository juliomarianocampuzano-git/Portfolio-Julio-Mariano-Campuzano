/* =====================================================================
   HABIB'S · DATOS COMPARTIDOS (web + totem)
   ---------------------------------------------------------------------
   Para cambiar un precio, una foto o un texto del menú, se edita SOLO
   este archivo y se actualizan las dos interfaces a la vez.
   Precios en guaraníes (número entero, sin puntos).
   ===================================================================== */
(function () {
  "use strict";

  // ---------- Datos de la marca y del local ----------
  var marca = {
    nombre: "Habib's",
    // Slogan oficial (bio de Instagram @habibslomiteria). NO modificar.
    slogan: "Somos la lomitería más rica de Encarnación",
    descriptor: "Lomitos árabes",
    ciudad: "Encarnación",
    instagram: "habibslomiteria",
    whatsapp: "595983861560", // formato internacional para wa.me
    telefono: "0983 861 560",
    horario: {
      general: "Todos los días de 18:00 a 01:00",
      finde: "Viernes y sábado hasta las 02:00",
      corto: "18:00 – 01:00",
      // Versión para cálculos (badge "Abierto ahora" y datos para Google).
      // Hora de Paraguay (America/Asuncion). Días: 0 = domingo … 6 = sábado.
      zona: "America/Asuncion",
      abre: "18:00",
      cierra: "01:00",
      cierraFinde: "02:00",
      diasFinde: [5, 6]
    },
    // Reseñas reales del local (no inventar ni redondear)
    resenas: { nota: 4.4, cantidad: 1157 },
    locales: [
      {
        id: "central",
        nombre: "Casa Central",
        direccion: "Av. Irrazábal entre Monseñor Wiessen y Curupayty",
        zona: "Zona Baja · Encarnación",
        extra: "Lomitos, shawarmas y pizzas con borde relleno",
        mapa: "https://www.google.com/maps/search/?api=1&query=Av+Irrazabal+Monsenor+Wiessen+Curupayty+Encarnacion+Paraguay"
      },
      {
        id: "costanera",
        nombre: "Costanera",
        direccion: "Monseñor Wiessen esquina Antequera",
        zona: "Costanera · Encarnación",
        extra: "Pedí desde tu auto",
        mapa: "https://www.google.com/maps/search/?api=1&query=Monse%C3%B1or+Wiessen+y+Antequera+Encarnacion+Paraguay"
      }
    ]
  };

  // ---------- Grupos de personalización reutilizables ----------
  var pan = {
    id: "pan",
    nombre: "Tipo de pan",
    obligatorio: true,
    opciones: [
      { id: "pita", nombre: "Pan árabe / pita tradicional", precio: 0, porDefecto: true },
      { id: "baguette", nombre: "Pan baguette criollo", precio: 0 }
    ]
  };

  var sacarLomito = {
    id: "sacar",
    nombre: "¿Le sacamos algo?",
    multiple: true,
    esExclusion: true,
    opciones: [
      { id: "sin-cebolla", nombre: "Sin cebolla", precio: 0 },
      { id: "sin-repollo", nombre: "Sin repollo", precio: 0 },
      { id: "sin-tomate", nombre: "Sin tomate", precio: 0 },
      { id: "sin-salsa", nombre: "Sin salsa especial de ajo", precio: 0 }
    ]
  };

  var sacarBurger = {
    id: "sacar",
    nombre: "¿Le sacamos algo?",
    multiple: true,
    esExclusion: true,
    opciones: [
      { id: "sin-cebolla", nombre: "Sin cebolla", precio: 0 },
      { id: "sin-tomate", nombre: "Sin tomate", precio: 0 },
      { id: "sin-salsa", nombre: "Sin salsa especial de ajo", precio: 0 }
    ]
  };

  var extras = {
    id: "extras",
    nombre: "Sumale extras",
    multiple: true,
    opciones: [
      { id: "extra-queso", nombre: "Extra queso mozzarella", precio: 5000 },
      { id: "extra-carne", nombre: "Extra carne de res", precio: 8000 },
      { id: "papas-adentro", nombre: "Papas fritas adentro", precio: 4000 },
      { id: "huevo", nombre: "Huevo frito", precio: 3000 }
    ]
  };

  // ---------- Categorías ----------
  var categorias = [
    { id: "lomitos", nombre: "Lomitos & Shawarmas", corto: "Lomitos", icono: "i-lomito", foto: "assets/fotos/lomito-carne.webp" },
    { id: "hamburguesas", nombre: "Hamburguesas", corto: "Burgers", icono: "i-burger", foto: "assets/fotos/smash.webp" },
    { id: "kipes", nombre: "Kipes & Porciones", corto: "Kipes", icono: "i-kipe", foto: "assets/fotos/kibbe.webp" },
    { id: "bebidas", nombre: "Bebidas", corto: "Bebidas", icono: "i-bebida", foto: "assets/fotos/drinks.webp" }
  ];

  // ---------- Productos ----------
  var productos = [
    {
      id: "lomito-carne",
      categoria: "lomitos",
      nombre: "Lomito Árabe de Carne",
      etiqueta: "Especial",
      descripcion: "Jugoso lomo de res con especias árabes, lechuga, tomate, repollo morado, mozzarella y la salsa especial Habib's en pan pita.",
      corta: "Lomo, mozzarella, repollo y salsa Habib's.",
      precio: 28000,
      foto: "assets/fotos/lomito-carne.webp",
      masPedido: true,
      // Capas que se arman en la sección "El asador" (de abajo hacia arriba, según la descripción)
      capas: ["Pan pita", "Lomo de res con especias árabes", "Lechuga", "Tomate", "Repollo morado", "Mozzarella", "Salsa especial Habib's"],
      grupos: [pan, sacarLomito, extras]
    },
    {
      id: "lomito-pollo",
      categoria: "lomitos",
      nombre: "Lomito Árabe de Pollo",
      descripcion: "Tiras de pechuga doradas a la plancha con condimentos orientales, salsa de ajo, tomate y lechuga fresca.",
      corta: "Pechuga a la plancha, salsa de ajo y verduras.",
      precio: 25000,
      foto: "assets/fotos/lomito-pollo.webp",
      grupos: [pan, sacarLomito, extras]
    },
    {
      id: "shawarma-mixto",
      categoria: "lomitos",
      nombre: "Shawarma Mixto Habib",
      descripcion: "Carne de res y pechuga de pollo, hummus de garbanzo, salsa tahini y vegetales frescos.",
      corta: "Res y pollo, hummus, tahini y vegetales.",
      precio: 30000,
      foto: "assets/fotos/shawarma.webp",
      masPedido: true,
      grupos: [pan, sacarLomito, extras]
    },
    {
      id: "hamburguesa-arabe",
      categoria: "hamburguesas",
      nombre: "Hamburguesa Árabe Especial",
      descripcion: "Medallón 100% res sazonado al estilo kafta, doble queso, salsa de la casa y vegetales.",
      corta: "Estilo kafta, doble queso y salsa de la casa.",
      precio: 24000,
      foto: "assets/fotos/burger.webp",
      grupos: [sacarBurger, extras]
    },
    {
      id: "cheeseburger-doble",
      categoria: "hamburguesas",
      nombre: "Cheeseburger Doble con Papas",
      descripcion: "Doble medallón smash, doble cheddar, pepinillos y porción de papas fritas crocantes.",
      corta: "Doble smash, doble cheddar y papas.",
      precio: 29000,
      foto: "assets/fotos/smash.webp",
      masPedido: true,
      grupos: [sacarBurger, extras]
    },
    {
      id: "kipe-relleno",
      categoria: "kipes",
      nombre: "Kipe Relleno (2 u.)",
      descripcion: "Croquetas de trigo burgol y carne, rellenas con carne especiada y cebolla frita. Con salsa crema de ajo.",
      corta: "Burgol y carne, con crema de ajo.",
      precio: 16000,
      foto: "assets/fotos/kibbe.webp",
      masPedido: true
    },
    {
      id: "papas-fritas",
      categoria: "kipes",
      nombre: "Papas Fritas Habib's",
      descripcion: "Papas bastón doradas, crocantes y sazonadas con sal marina.",
      corta: "Bastón dorado y crocante.",
      precio: 15000,
      foto: "assets/fotos/fries.webp"
    },
    {
      id: "coca-500",
      categoria: "bebidas",
      nombre: "Coca-Cola 500 ml",
      descripcion: "Gaseosa bien fría en botella personal.",
      corta: "Bien fría.",
      precio: 7000,
      foto: "assets/fotos/drinks.webp",
      encuadre: "left center"
    },
    {
      id: "agua-500",
      categoria: "bebidas",
      nombre: "Agua Mineral 500 ml",
      descripcion: "Agua de manantial, con o sin gas.",
      corta: "Con o sin gas.",
      precio: 5000,
      foto: "assets/fotos/drinks.webp",
      encuadre: "right center",
      grupos: [
        {
          id: "gas",
          nombre: "¿Cómo la querés?",
          obligatorio: true,
          opciones: [
            { id: "sin-gas", nombre: "Sin gas", precio: 0, porDefecto: true },
            { id: "con-gas", nombre: "Con gas", precio: 0 }
          ]
        }
      ]
    }
  ];

  // ---------- Utilidades compartidas ----------

  // Formato guaraní: 28000 -> "Gs. 28.000" (sin depender de Intl/ICU del WebView)
  function gs(n) {
    var entero = Math.round(Number(n) || 0);
    return "Gs. " + String(entero).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function producto(id) {
    for (var i = 0; i < productos.length; i++) {
      if (productos[i].id === id) return productos[i];
    }
    return null;
  }

  function porCategoria(catId) {
    return productos.filter(function (p) {
      return p.categoria === catId;
    });
  }

  function masPedidos() {
    return productos.filter(function (p) {
      return p.masPedido;
    });
  }

  function linkWhatsApp(texto) {
    return "https://wa.me/" + marca.whatsapp + "?text=" + encodeURIComponent(texto || "Hola Habib's, quiero hacer un pedido.");
  }

  window.HABIBS = {
    marca: marca,
    categorias: categorias,
    productos: productos,
    gs: gs,
    producto: producto,
    porCategoria: porCategoria,
    masPedidos: masPedidos,
    linkWhatsApp: linkWhatsApp
  };
})();
