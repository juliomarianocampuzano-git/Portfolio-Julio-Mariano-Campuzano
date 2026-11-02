MARIANO CAMPUZANO - SITIO v4 (marca alegre + portfolio)
=======================================================
Sitio estatico de una pagina. La v1 sigue intacta en /workspace/mariano-web/.
Publicado en GitHub Pages (ver DONDE ESTA PUBLICADO).

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

DONDE ESTA PUBLICADO
  Web:  https://juliomarianocampuzano-git.github.io/Portfolio-Julio-Mariano-Campuzano/
  Repo: https://github.com/juliomarianocampuzano-git/Portfolio-Julio-Mariano-Campuzano (GitHub Pages, rama main)
  Cada push a main se publica solo en 1-2 minutos.
  _headers solo aplica en Netlify: GitHub Pages lo ignora.
  Si algun dia usas dominio propio: cambiar la URL en sitemap.xml, robots.txt y canonical/og de index.html y portfolio/.

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
  - WhatsApp unificado: +54 9 3764 148342 (web, portfolio y CV).
  - Confirmar tu ciudad/zona, idiomas, y la frase de ciudadania antes de publicar.
  - El formulario NO guarda nada: abre WhatsApp con el mensaje. Aviso de privacidad (Ley 25.326) en el pie.

MODOS DE PRUEBA
  index.html?nofx   apaga todos los efectos (igual que prefers-reduced-motion)
  Sin JavaScript    todo el contenido se ve y los formularios mandan a WhatsApp

LICENCIAS
  GSAP (gratis uso comercial), Lenis (MIT), canvas-confetti (ISC), base del portfolio bchiang7/v4 (MIT), fuentes SIL OFL. Ver DESIGN.md.
