MARIANO CAMPUZANO - SITIO v4 (marca alegre + portfolio)
=======================================================
Sitio estatico de una pagina. La v1 sigue intacta en /workspace/mariano-web/.
Nada de esto esta publicado: es un paquete listo para que lo revises.

QUE HAY
  index.html                       la pagina
  portfolio/  (y portfolio/en/)    67 proyectos con ficha y demo, ES/EN
  assets/brand                     LOGO e ICONO (SVG + PNG) y build-brand.py
  assets/css, assets/js, assets/libs   estilos, logica, GSAP/ScrollTrigger/Lenis (locales)
  assets/fonts                     Bricolage Grotesque + Schibsted Grotesk (SIL OFL)
  assets/img                       fotos reales de M3DINA + og.jpg
  _headers                         CSP estricta y cabeceras de seguridad (Netlify)
  robots.txt, sitemap.xml          SEO
  DESIGN.md                        decisiones, auditoria anti-slop y tabla "que aplicamos de Imperio y de cada repo"
  mariano-web-v4-standalone.html   TODO (sin el portfolio) en un solo archivo, para mirarlo o mandarlo por WhatsApp
                                   (no usar para publicar: tiene scripts en linea y la CSP no los permite)
  build-standalone.py              regenera el standalone: python build-standalone.py

COMO PUBLICARLO (cuando vos lo decidas)
  1. Crear un sitio NUEVO en Netlify (no tocar el de M3DINA) y arrastrar la CARPETA entera.
  2. Reemplazar TU-SITIO.netlify.app por tu dominio real en: sitemap.xml, robots.txt, y en index.html:
     agregar <link rel="canonical"> y <meta property="og:url">, y poner URL absoluta en og:image
     y en el "image" del JSON-LD (hoy son relativas: ver el comentario TODO arriba del <head>).
  3. Sin dominio propio aun, dejar los TODO como estan: no rompen nada.

QUE EDITAR
  - WhatsApp, marca y PRECIOS: bloque <script id="config"> en index.html.
    Los precios son HIPOTESIS tuyas. Los numeros visibles en #precios estan escritos a mano:
    si cambias el config, cambialos tambien ahi (hay un TODO).
  - Textos: directo en index.html (voseo).
  - Si editas CSS o JS: subi el numero ?v=6 en index.html (si no, quien ya visito ve la version vieja).

HONESTIDAD (revisar antes de publicar)
  - No hay testimonios, logos de clientes ni cifras inventadas. No agregar ninguno que no sea real.
  - Portfolio: 5 proyectos figuran "Entregado a cliente". Para sumar mas, agregar su id en CLIENTES_EXTRA
    (portfolio/contenido.py) y correr python portfolio/build-portfolio.py. Solo los que de verdad se entregaron.
  - 6 fichas sin definir (Recupera, Llavint, Clara, propuestas publicas/PyMEs, intermediacion) quedan ocultas: ver OCULTOS en contenido.py.
  - Las fichas muestran QUE resuelve cada proyecto, no COMO esta hecho (para que no copien la idea); el resto con su estado real (funcionando, MVP, piloto,
    prototipo, en desarrollo, concepto con demo). No cambiar conceptos a "entregado" si no lo fueron.
  - Telefono del portfolio (+54 9 3764 148342) y WhatsApp de la web (5493765306244) son distintos: unificar si corresponde.
  - Confirmar tu ciudad/zona, idiomas, y la frase de ciudadania antes de publicar.
  - El formulario NO guarda nada: abre WhatsApp con el mensaje. Aviso de privacidad (Ley 25.326) en el pie.

MODOS DE PRUEBA
  index.html?nofx   apaga todos los efectos (igual que prefers-reduced-motion)
  Sin JavaScript    todo el contenido se ve y los formularios mandan a WhatsApp

LICENCIAS
  GSAP (gratis uso comercial), Lenis (MIT), canvas-confetti (ISC), base del portfolio bchiang7/v4 (MIT), fuentes SIL OFL. Ver DESIGN.md.
