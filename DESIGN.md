# DESIGN.md — Mariano Campuzano · Web & Automatización IA (v2)

Sitio de una página, en español rioplatense (voseo). Identidad: **grafito + cobalto** (linaje M3DINA). La v1 queda intacta en `/workspace/mariano-web/`. Esta v2 sube el listón en tres frentes: **conversión**, **movimiento/oficio visual** y **endurecimiento** (UX, seguridad, SEO).

> Contenido de pago del curso *Imperio Agéntico* y F.R.A.M.E.: aplicado **solo en palabras propias** (método, no texto). Nada del curso se reproduce en el sitio.

---

## 1. Overview

**Argumento de la página** (regla taste-skill: un argumento por sección): *«Webs que venden. Bots que atienden.»* → primero diagnóstico gratis, después web o bot, después mantenimiento.

| # | Sección | Argumento | Cosa viva |
|---|---|---|---|
| 0 | Hero | Qué hago y cuál es el primer paso (diagnóstico gratis) | Campo topográfico WebGL (curvas de nivel animadas) + escena de wireframe → sitio → bot que agenda |
| 1 | Banda | Alcance en 4 palabras | Marquee ligada al scroll (scrub) |
| 2 | Servicios | Cuatro cosas, bien hechas | Revelado por clip-path, tarjetas con hover solo en puntero fino |
| 3 | Diagnóstico | El primer paso es gratis | **Armá tu consulta**: rubro, necesidad y extras → resumen que se envía por WhatsApp (sin precios) |
| 4 | Rubros | Armado para tu rubro | Pestañas con transición de contenido |
| 5 | Trabajos | Un caso real: M3DINA | **Antes/después interactivo** + capítulos fijados (pin) con parallax |
| 6 | Proceso | Tres pasos, en este orden | Capítulos fijados al scroll (≥901 px) |
| 7 | Propuestas | A tu medida (escalera de servicios, sin precios) | Tarjetas con «para quién es»; la propuesta formal llega después del diagnóstico |
| 8 | FAQ | Objeciones, respondidas | Acordeón accesible |
| 9 | Sobre mí | Quién está del otro lado | Monograma M animado |
| 10 | Contacto | Pedí tu diagnóstico | Topo WebGL (creado en diferido) + formulario con 4 estados |

Estado de clases en `<html>`: `js`, `ready`, `nofx`, `pinned`, `cursor-on`, `lenis`. `?nofx` apaga todos los efectos; `window.__fx.rm` = reduced-motion o nofx.

---

## 2. Colors

Tres capas de tokens (primitivos → semánticos → componentes).

| Capa | Tokens |
|---|---|
| Primitivos | `--g-950…100` (grafito), `--c-700 #245FC4`, `--c-500 #3E8BFF`, `--c-300 #8DBBFF`, `--c-950 #04101F` |
| Semánticos | `--bg`, `--surface(-2/-3)`, `--ink`, `--body`, `--muted`, `--action`, `--on-action`, `--ok`, `--error` |
| Componentes | `--btn-*` |

- Contraste ≥ 4.5:1 para texto (regla impeccable). Cobalto solo como acento de acción y foco; no hay degradé de relleno ni glow genérico.
- Verde WhatsApp solo en el botón flotante y el CTA de WhatsApp (es la marca del canal).
- Sin paletas violeta/magenta (las de las referencias de Instagram se descartaron a propósito).

## 3. Typography

- **Bricolage Grotesque** (display, eje de peso variable) + **Schibsted Grotesk** (texto). Dos familias (taste-skill: ≤ 2). Ambas SIL OFL, locales en `assets/fonts/` (sin Google Fonts → sin terceros, sin fuga de IP).
- **Tipografía cinética**: el peso (`wght`) de los títulos "viaja" como onda al entrar y al pasar el puntero; con reduced-motion queda estático.
- Medida de lectura 65–75ch en párrafos (impeccable). Títulos ≤ 2 líneas (taste-skill, verificado por `inspect`).
- Escala medida: 14 / 17 / 20 / 21 / 24 / 38 / 61 / 75 / 78 / 144 px. **Brecha conocida:** taste-skill pide ≤ 5 tamaños; tenemos 10 porque los cuatro mayores son tamaños de display fluidos (`clamp`) y los números de precio. Ver §10.

## 4. Layout

- Gutter escalonado `--gut`: 20 / 32 (≥640) / 48 (≥1080) / 64 (≥1500). `.sec` y `.band` usan px literales porque el detector de impeccable no resuelve `var()`.
- Composición **asimétrica** (F.R.A.M.E.): título a la izquierda, contenido a la derecha, columnas desiguales; sin grilla de 3 tarjetas idénticas.
- Secciones con ritmo alterno `deep` / base; banda cobalto para mantenimiento.
- Capítulos fijados (`html.pinned`, ≥ 901 px, `min-height 64svh`); en móvil se apilan sin pin.

## 5. Elevation & Depth

- Profundidad por **superficies** (`--surface`, `-2`, `-3`) y filetes de 1 px; sin sombras difusas ni vidrio esmerilado decorativo.
- Parallax sutil (transform) en imágenes del caso y en el topo; viñetas de `--c-950` en los capítulos.

## 6. Shapes

Radios: `16px` (tarjetas, paneles), `0` (bandas, separadores), `999px` (botones, pastillas). Tres radios, ninguno más.

## 7. Components

- **Botones**: `:active` con `scale(.97)`; magnéticos solo con puntero fino; foco visible.
- **Cursor propio** (solo `hover:hover`+`pointer:fine`): anillo con `transform: scale` (sin animar layout).
- **Armá tu consulta**: 3 preguntas → resumen de lo elegido → texto armado → botón a `wa.me`. No muestra precios: cada proyecto se presupuesta a medida. Sin necesidad elegida: estado vacío; «No sé todavía» → «Lo definimos juntos».
- **Formulario**: validación en JS con mensajes por campo (`aria-describedby`), 4 estados (vacío / enviando / error / éxito); sin servidor: el envío abre WhatsApp con el mensaje. Sin JS: `<form method="get" action="https://wa.me/…" target="_blank">`.
- **Antes/después M3DINA**: un `<input type="range">` nativo con etiqueta (arrastre, teclado y lector de pantalla).
- **Pestañas de rubro**: `role=tablist`, flechas, envuelven en ≤ 900 px.
- **FAQ**: 8 `<details name="faq">` nativos (funcionan sin JS, uno abierto a la vez).

## 8. Do's and Don'ts

**Do**: un solo movimiento focal por vista; ease-out propio; solo `transform`/`opacity`/`clip-path` animados; textos concretos; sin precios publicados (presupuesto a medida por escrito); mostrar qué NO hago.
**Don't**: contadores, testimonios, logos de clientes, «+N webs», promesas de posicionamiento o ventas, `transition: all`, ease-in, rebotes en UI, hover en táctil, íconos decorativos en círculos, 3 tarjetas iguales.

## 9. Responsive Behavior

- 1440 / 1024 / 768 / 390 px verificados; sin scroll horizontal en ninguno.
- Móvil: sin cursor propio, sin pin, topo con resolución adaptativa y 2D de respaldo; FAB de WhatsApp.
- `prefers-reduced-motion` o `?nofx`: sin Lenis, sin scrub, sin pin, topo estático (un cuadro), todo visible desde el inicio.
- **Sin JS**: todo el contenido es HTML; los reveals solo se ocultan cuando existe la clase `js`; los campos solo-JS se ocultan con `html:not(.js) .jsonly` (sin `<noscript>` en línea: respeta la CSP); formularios envían a WhatsApp.
- Adaptación de calidad: topo ajusta resolución según tiempo de cuadro, se pausa con `IntersectionObserver` y `visibilitychange`; sin WebGL → 2D de puntos.

---

## 10. Iteration Guide & Known Gaps

Cambiar marca y WhatsApp: solo `<script id="config">`. El sitio no publica precios; los servicios están en `#propuestas`.

**Brechas conocidas (honestas)**
1. 10 tamaños de fuente frente a ≤ 5 de taste-skill (display fluido). 
2. `inspect` solo recorre 11 pantallas; la página mide ~20, así que reporta `blank-gap` en el tramo inferior (los reveals no se disparan por scroll sintético). Verificado a mano con barrido completo (1440 y 390).
3. `inspect`: `mixed-font-headline` (falso positivo: encabezado + etiqueta contiguos), `card-rows`, `no-footage` (el caso M3DINA usa fotos reales fijas, no video) y la banda con medio vacío (es el marquee scrubbeado a propósito).
4. `@768` el chequeo de centrado marca 15–20 px por la barra de scroll clásica de Chrome headless.
5. Solo hay **un caso real** (M3DINA). Las demás demos están rotuladas «en preparación».

---

## 11. Anti-slop audit — antes / después

Compuertas ejecutadas: `impeccable detect`, `taste-skill lint.mjs` + `inspect.mjs`, `criterio gate` (contrato en `/workspace/mariano-web-v2-audit/`).

| Hallazgo (compuerta) | Antes | Después |
|---|---|---|
| impeccable: *cramped-padding* (falso positivo por `var()`) | 6 hallazgos | **0** — gutters escalonados en px literales |
| criterio: `animated_props_safe` | FAIL: transición de `top` (skip), `height` (header), `width/height/margin` (cursor) | **PASS 8/8** — `translate`, sin transición de altura, anillo con `transform: scale` |
| taste `inspect`: headline > 2 líneas | FAIL en 3 títulos | OK — títulos acortados («Diagnóstico gratis.», «M3DINA, capa por capa.», «Soy Mariano, de Posadas.») |
| taste `inspect`: eyebrow / etiquetas decorativas | WARN | Quitadas (también el figcaption del monograma) |
| taste `inspect`: demasiados tamaños | 14+ tamaños | 10 (display fluido restante, ver §10) |
| taste `inspect`: composición lopsided | WARN | Columnas rebalanceadas |
| taste `inspect`: scroll lateral @768 (pestañas) | FAIL | Las pestañas envuelven en ≤ 900 px |
| Viñetas fijadas escasas | Paneles vacíos | Fondo `--c-950`, capítulos de 64svh |
| Lighthouse: `color-contrast` (capítulos inactivos al 32 % de opacidad) | a11y 97 | Inactivos al 72 %: contraste legible, el foco sigue marcado | 
| Lighthouse: nombre accesible del logo no contenía el texto visible | falla | `aria-label` incluye «Web & Automatización IA» |
| Lighthouse móvil: LCP 4.0 s (el párrafo de entrada esperaba a que cargara JS) | Perf 87 | El párrafo `.lead` ya no se oculta antes de `ready`: LCP 3.0 s, Perf 94 |
| CSP: `<noscript><style>` en línea violaba `style-src 'self'` | error de consola sin JS | Regla `html:not(.js) .jsonly` en el CSS; 0 violaciones CSP en los 6 modos |
| Modo sin JS / reduced-motion: la banda gigante quedaba recortada a la izquierda | texto cortado | Filas con `flex-wrap`, sin margen negativo |
| impeccable (página renderizada): `line-length` en aviso de privacidad y notas de precio | ~90–103 caracteres/línea | `max-width` 64–68ch; 0 hallazgos |
| taste lint (patrones prohibidos en fuente) | — | **0 FAIL / 0 WARN** |
| Sombras genéricas, glow, íconos en círculo, ease-in, `transition: all` | ausentes | verificado ausente |

Estado final: **impeccable (HTML renderizado) 0 · taste lint 0/0 · criterio 8/8 · inspect 1 FAIL (artefacto de 11 pantallas, §10) + 6 WARN defendidos.**

---

## 12. What we applied from Imperio and from each repo

### 12.1 Imperio Agéntico (método de venta, en palabras propias)

| Idea del método | Dónde se ve | Efecto / decisión |
|---|---|---|
| Diagnóstico gratis como primera puerta | Hero (CTA primario), #diagnostico, nav | «Pedir mi diagnóstico gratis» arriba de todo; abre WhatsApp con un mensaje ya armado |
| Presupuesto a medida | Armá tu consulta | Arma el resumen de lo que necesita el cliente; el valor se define en la propuesta formal |
| Propuesta irresistible de 3 opciones (base / recomendada / completa) | #propuestas, nota de propuestas | Siempre se promete una propuesta por escrito con tres alcances; la tarjeta recomendada va en cobalto |
| Escalera de oferta: diagnóstico → web/bot → mantenimiento | #propuestas | Orden visual y de lectura; banda cobalto de mantenimiento |
| Ingreso recurrente | Mantenimiento mensual + bot/app con abono (valores en la propuesta) | Explicado como servicio opcional con revisión cada 3 meses |
| Manejo de objeciones | FAQ ×8, bloque «Qué hacemos / Qué no» | Respuestas concretas: precio, tiempo, dominio, «no entiendo de tecnología», resultados |
| Claridad de propiedad y costos | #precios, #proceso | Dominio y cuentas a tu nombre; costos de terceros separados; pago 50/50 |
| Garantía honesta | #proceso, FAQ | Garantía en horas de corrección, **nunca** promesa de ranking ni ventas |
| Privacidad | Pie + formulario | Aviso Ley 25.326, sin cookies, sin guardar lo escrito |
| F.R.A.M.E.: apertura fuerte | Hero con titular de 2 líneas y escena viva | `--t-h1` grande, escena de 15 s |
| F.R.A.M.E.: calmo, premium, editorial | Paleta contenida, mucho aire | un acento, una tipografía display |
| F.R.A.M.E.: composición asimétrica | Todas las secciones | columnas desiguales |
| F.R.A.M.E.: hero vivo + parallax sutil | topo WebGL, imágenes del caso | transform-only, adaptativo |

### 12.2 Repos de GitHub (regla → efecto)

| Repo | Regla que se aplicó | Efecto / decisión en el sitio |
|---|---|---|
| **impeccable** | Lista de patrones prohibidos (slop) | Sin degradé de texto, sin glow, sin tarjetas anidadas, sin íconos en círculo |
| impeccable | Contraste 4.5:1 | Tokens `--ink/--body/--muted` medidos; cobalto solo en botones/foco |
| impeccable | Medida 65–75ch | `max-width` en párrafos |
| impeccable | Un movimiento focal | Cada vista tiene un solo elemento que se mueve fuerte |
| impeccable | Ease-out; reduced-motion = más suave, no nada | Easings propios; con RM se muestra todo estático sin perder contenido |
| impeccable | `detect` como compuerta | §11 |
| **taste-skill** | Un argumento por sección | §1 |
| taste-skill | «Una cosa viva» por escena | topo WebGL + escena del hero |
| taste-skill | ≤ 2 tipografías | Bricolage + Schibsted |
| taste-skill | Titulares ≤ 2 líneas | H2 acortados |
| taste-skill | ≥ 8 elementos en movimiento | topo, escena hero, marquee, clip-reveals, kinetic wght, pins, parallax, magnético, cursor, contador, slider |
| taste-skill | Stagger 60–90 ms | Revelados de listas y tarjetas |
| taste-skill | Imágenes reales | Fotos reales de M3DINA, ninguna de stock |
| taste-skill | `lint` + `inspect` | §11 |
| **emilkowalski/skills** | Easings propios (`--out`, `--io`, `--drawer`) | Tokens de movimiento |
| Emil | UI < 300 ms | Duraciones 140 / 220 ms para UI; 420–800 ms solo para escenas |
| Emil | `:active scale` | Botones y pestañas |
| Emil | Nada de ease-in; solo transform/opacity | Auditado por criterio `animated_props_safe` |
| Emil | Reveals por clip-path | Títulos «wipe» y tarjetas |
| Emil | Hover solo en puntero fino | Todos los hover y el imán van tras `(hover:hover) and (pointer:fine)` |
| Emil | Sin `transition: all` | Auditado |
| Emil | Resortes | Overshoot corto (`back.out`) solo en la insignia «En línea» de la escena; el imán y el cursor siguen al puntero con `quickTo` |
| **ui-ux-pro-max** | Checklist previo a la entrega | Contraste, foco, targets táctiles, 4 estados, reduced-motion, sin scroll horizontal, `cursor:pointer`, rel=noopener |
| **awesome-design-md** | Estructura del DESIGN.md | Secciones 1–10 de este archivo |

---

## 13. Seguridad, privacidad y honestidad

- `_headers`: CSP estricta (`script-src 'self'`, `style-src 'self'`, `form-action https://wa.me`, `frame-ancestors 'none'`), `nosniff`, `Referrer-Policy`, `Permissions-Policy`. Sin scripts ni estilos en línea; sin secretos; sin terceros.
- Enlaces externos con `rel="noopener noreferrer"`.
- Nada se guarda ni se envía a un servidor propio: el mensaje viaja por WhatsApp.
- **Sin** testimonios, logos de clientes, cifras inventadas ni contadores. No se publican precios: cada proyecto se presupuesta a medida.
- SEO: `<title>`, descripción, canonical y og:url pendientes del dominio real (TODO, README), Open Graph + Twitter, JSON-LD (`ProfessionalService`, `Person`, `FAQPage`), `sitemap.xml`, `robots.txt`, jerarquía h1 → h2 → h3, fuentes con `font-display: swap` y precarga, imágenes con `width/height`.

## 14. Licencias

GSAP (licencia «no charge», redistribución incluida en `assets/libs`) · Lenis (MIT) · Bricolage Grotesque y Schibsted Grotesk (SIL OFL, texto en `assets/fonts/`). Contenido de Imperio Agéntico/F.R.A.M.E.: **no se redistribuye**.

## 15. Resultados Lighthouse (final)

Lighthouse 12.8.2, Chrome headless, servido con la CSP de `_headers` (puerto local; sin red real, así que son cifras de laboratorio, no de producción).

| Perfil | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Escritorio | **100** | **100** | **100** | **100** | 0,3 s | 0,7 s | 0 ms | 0 |
| Móvil (4× CPU, red lenta simulada) | **94** | **100** | **100** | **100** | 1,4 s | 3,0 s | 40 ms | 0 |

Límite honesto: en móvil la nota de Performance depende del WebGL del hero y de ~110 KB de JS (GSAP + ScrollTrigger + Lenis); sube con compresión gzip/brotli en el hosting real (Netlify la aplica).

## 16. v3 — correcciones, pre-mortem y movimiento agresivo

**Errores corregidos**
- 4 reglas CSS invalidas (un `)` de mas) en pestanas de rubros, preguntas del FAQ, titulos de precios y "Demos en preparacion": perdian la tipografia display.
- El H1 y los H2 partidos en letras/palabras no tenian nombre accesible fiable: ahora llevan un texto oculto `.sr`.
- El trazo del monograma media 426 y el dash 420 (la punta quedaba cortada): ahora `pathLength="1"`.
- La palabra gigante del pie cortaba la "p" y desbordaba 2 px.

**Pre-mortem (uso intensivo simulado) → arreglos**
| Escenario | Antes | Ahora |
|---|---|---|
| app.js falla o no carga | todo el contenido quedaba invisible (opacity 0) | `boot.js` pone `.nofx` a los 4 s si `__appOk` no llego: todo visible |
| `tz` mal escrito en el config | RangeError que cortaba el resto del JS | try/catch con zona por defecto |
| config JSON roto | cotizador mostraba "USD 0" | precios por defecto en el JS |
| 10 clics en "Enviar" / "Pedir diagnostico" | 10 pestanas de WhatsApp | 1 (bloqueo de 1,5 s) |
| Safari/iOS | WhatsApp se abria tras un `setTimeout` (bloqueable) | se abre dentro del mismo clic |
| 200 clics al azar en el cotizador | tweens superpuestos | se cancelan los anteriores |
| Saltar de seccion con el menu | lo salteado quedaba oculto | el observador revela todo lo que quedo arriba |
| Menu movil | foco suelto, fondo navegable, quedaba trabado al rotar a escritorio | foco al primer link, `inert` al fondo, Escape devuelve el foco, se cierra a >1080 px |
| Cursor propio | bucle rAF infinito aun quieto | se duerme cuando llega |
| WebGL perdido (celular con muchas pestanas) | fondo negro | pasa al fondo 2D |
| Cache `/assets/*` inmutable 1 ano | un cambio de CSS/JS no llegaba a quien ya visito | CSS/JS versionados con `?v=3`; cache larga solo en libs, fuentes y fotos |
| Mensaje gigante | URL de wa.me sin limite | `maxlength` 1200 (nombre 60) |

**Movimiento agresivo** (`assets/js/fx.js`, misma regla: transform/opacity/clip-path, ease-out, apagado con reduced-motion y `?nofx`)
Telon cobalto con la M dibujandose (solo primera visita de la sesion) · letras del hero que saltan girando · al bajar, las dos lineas del hero se abren y la escena se va inclinada · inclinacion por velocidad de scroll en titulos, banda y capturas · banda con palabras en contorno y recorrido mas largo · titulos que suben girando · tarjetas de precio que se levantan en 3D · escalones del proceso que se expanden de recortados a ancho completo · zoom de camara en el antes/despues · monograma que gira en 3D · palabra final que sube letra por letra · onda en cada boton · texto que se "decodifica" en el menu · inclinacion 3D de tarjetas al puntero · punto final de cada titulo en cobalto.

## 17. v4 — marca alegre, logo e integracion del portfolio

**Marca.** Estilo "sticker": fondo crema, contornos tinta, sombras duras desplazadas, colores saturados (nada apagado).
Paleta: mango `#FF6B2C` (principal) · sol `#FFC53D` · rosa `#FF3E8A` · menta `#14C89A` · cielo `#2F7BFF` · uva `#6A3DF0` · tinta `#1C1433` · crema `#FFF8EF`.
Icono: globo de chat mango con una "M" blanca y un punto sol (= "te escribo / te atiendo"). Funciona a 16 px.
Archivos en `assets/brand/` (SVG + PNG 192/512/1024, logo horizontal claro/oscuro, vertical). Se regeneran con `python assets/brand/build-brand.py`.

**Portfolio** (`/portfolio/`, ES y `/portfolio/en/`): 67 proyectos con ficha y demo en el navegador.
- Base original: bchiang7/v4 (MIT, credito conservado en `portfolio/licenses/`).
- Se regenera desde el zip original con `python portfolio/build-portfolio.py`.
- Sin scripts ni estilos en linea (la CSP de `_headers` aplica tambien al portfolio); la config de cada demo va en `data-config`.
- Estados con rotulos positivos pero verdaderos: Entregado a cliente (5) · Herramienta funcionando · MVP funcionando · En piloto · Prototipo funcional · En desarrollo · Concepto con demo. **No** se presentan ideas como trabajos entregados.

**Repos elegidos y por que**
| Repo | Para que | Por que este |
|---|---|---|
| greensock/GSAP 3.15 (Flip, SplitText, ScrollTrigger) | filtro animado del catalogo, letras que caen, entradas 3D | desde 2025 todos los plugins son gratis para uso comercial; ya estaba en la web |
| darkroomengineering/lenis | scroll suave | ya estaba; liviano, MIT |
| catdad/canvas-confetti | confeti en CTAs, WhatsApp y cotizador | ISC, 5 KB, respeta reduced-motion |

**Animaciones nuevas:** confeti al contactar o cotizar · catalogo que se reordena con Flip · titulares que caen rebotando · figuras flotantes que se dispersan con el scroll · mosaico de destacados que se levanta en 3D · inclinacion 3D al puntero.

## 18. v5 — titulos, cursor y fichas sin pistas internas

- Titulos como stickers en el hero (web y portfolio): Data Analyst (Coderhouse) · AI Automation (egresado, Coderhouse) · Diseñador web · Ingeniería en IA (proximo a recibirme).
- Cursor propio: sobre links y botones se encoge y desaparece; ya no tapa el texto.
- Fichas del portfolio: "Trabajo documentado" y "Alcance" (detallaban herramientas, modelos y APIs) pasan a "Que resuelve" + "Estado del proyecto". Etiquetas reducidas a areas generales (IA, Datos, Automatizacion, Web, Python…). Contenido editable en `portfolio/contenido.py`.
- 6 fichas sin descripcion suficiente quedan ocultas (61 publicas). Clientes: solo los 5 reales; se suman con `CLIENTES_EXTRA`.

## 19. v6 — posicionamiento: automatizacion con IA

- Hero: "Automatizá tu negocio con IA." (antes "Webs que venden. Bots que atienden."). Title, description, og:image, logo y cabecera dicen "Automatización con IA".
- Titulos fuera del hero: van en "Sobre mí" (web) y en "Perfil" (portfolio), despues del relato, como respaldo. Sin institucion; AI Automation primero.
- Portfolio: hero y ticker centrados en automatizacion con IA.

## 20. v7 — demo en vivo del asistente y servicios con IA primero

- Hero: el boceto animado se reemplazo por un chat de WhatsApp que el visitante puede usar (`assets/js/botdemo.js`). Tres negocios de ejemplo (rotiseria, turnos, tienda) con pedidos, turnos, stock y seguimiento. Corre en el navegador con reglas y datos ficticios; no envia nada. Lo escrito se muestra con textContent (sin riesgo de XSS).
- Servicios, precios, cotizador y formulario: primero el asistente de WhatsApp y la automatizacion; la web despues. "App web a medida" pasa a "Automatización y panel a medida" (mismo precio).
- Titulos sin "Egresado" ni "Próximo a recibirme"; "AI Automation" pasa a "Automatización con IA".
- Confeti sin worker (la CSP bloqueaba el worker creado desde un blob).

## 21. v8 — calculadora de horas ahorradas

- Seccion `#ahorro` entre Servicios y Diagnostico (`assets/js/ahorro.js`): mensajes por dia, minutos por respuesta, % de preguntas repetidas, horas semanales de tareas manuales y valor de la hora (opcional).
- Supuestos visibles en la pagina: el asistente resuelve el 80 % de lo repetido, la automatizacion ahorra el 60 % de lo manual, 26 dias habiles y 4,33 semanas por mes.
- El boton abre WhatsApp con los numeros del visitante ya escritos.
