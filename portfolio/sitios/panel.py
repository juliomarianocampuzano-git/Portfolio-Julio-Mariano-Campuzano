# panel.py · genera portfolio/sitios/panel-alba/index.html: el panel interno demo de Centro Medico Alba.
# La logica y los estilos estan en panel-alba/panel.js y panel.css; aca solo se arma el HTML con los iconos.
import os, hashlib

ICONS = ['calendar-days', 'users', 'file-text', 'message-circle', 'search', 'chevron-right', 'arrow-left', 'calendar-plus', 'triangle-alert',
         'plus', 'download', 'trash-2', 'globe', 'send', 'check', 'circle-check', 'x', 'rotate-ccw', 'external-link']
TABS = [('hoy', 'calendar-days', 'Hoy'), ('pacientes', 'users', 'Pacientes'), ('recetas', 'file-text', 'Recetas'), ('mensajes', 'message-circle', 'Mensajes')]
LOGO = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#0E7490"/><text x="20" y="21" text-anchor="middle" dominant-baseline="central" font-family="Figtree,sans-serif" font-weight="800" font-size="20" fill="#fff">A</text></svg>'

def build(here, icon_svg, base):
    d = os.path.join(here, 'panel-alba')
    v = lambda f: hashlib.md5(open(os.path.join(d, f), 'rb').read()).hexdigest()[:8]
    ico = lambda n: '<svg class="ico" aria-hidden="true"><use href="#i-%s"/></svg>' % n
    side = ''.join('<button class="tab" type="button" data-view="%s">%s%s</button>' % (k, ico(i), t) for k, i, t in TABS)
    bar = ''.join('<button type="button" data-view="%s">%s<span>%s</span></button>' % (k, ico(i), t) for k, i, t in TABS)
    sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">%s</svg>' % ''.join(icon_svg(n) for n in ICONS)
    url = base + 'portfolio/sitios/panel-alba/'
    doc = '''<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Panel de gestión · Centro Médico Alba (demo)</title>
<meta name="description" content="Demo de panel interno para un consultorio: agenda del día, estados de turnos, fichas de pacientes, recetas en PDF y recordatorios por WhatsApp. Pensado para usarse desde el celular.">
<meta name="theme-color" content="#082129">
<link rel="canonical" href="%(url)s">
<meta property="og:type" content="website"><meta property="og:url" content="%(url)s"><meta property="og:title" content="Panel de gestión para consultorios · demo">
<meta property="og:description" content="Lo que ve el consultorio detrás de la web: turnos, pacientes, recetas y recordatorios.">
<meta property="og:image" content="%(base)sassets/img/og.jpg">
<link rel="icon" href="data:image/svg+xml,%%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%%3E%%3Ccircle cx='20' cy='20' r='19' fill='%%230E7490'/%%3E%%3C/svg%%3E">
<link rel="stylesheet" href="panel.css?v=%(vc)s">
</head>
<body>
<a class="skip" href="#view">Saltar al contenido</a>
<div class="app">
<aside class="side" aria-label="Menú del panel">
<div class="brand">%(logo)s<span>Centro Médico Alba<small>Panel de gestión</small></span></div>
<nav aria-label="Secciones del panel" style="display:grid;gap:4px">%(side)s</nav>
<div class="foot"><a href="../centro-medico-alba/index.html">%(ext)sWeb pública del centro</a><button type="button" data-reset>%(rst)sRestablecer demo</button></div>
</aside>
<div class="main">
<div class="demo-ribbon"><span><b>Panel demo</b> con datos ficticios: todo queda en tu navegador.</span><a href="../centro-medico-alba/index.html">Ver la web del centro</a><a href="../index.html">Ver los sitios</a></div>
<header class="top"><div><p class="top-k" id="today"></p><h1 id="vtitle">Hoy</h1></div><div class="top-a"><button class="btn" type="button" data-new aria-label="Nuevo turno">%(plus)s<span class="lbl-l">Nuevo turno</span></button><span class="av" title="Dra. Paula Ríos">PR</span></div></header>
<main id="view" tabindex="-1" aria-live="polite"><noscript><p class="empty">Activá JavaScript para usar el panel.</p></noscript></main>
</div>
<nav class="tabbar" aria-label="Secciones del panel">%(bar)s</nav>
</div>
<dialog id="sheet" aria-labelledby="sheet-t"><div class="sheet-h"><h2 id="sheet-t">Nuevo turno</h2><button class="icon-btn" type="button" id="sheet-x" aria-label="Cerrar">%(x)s</button></div><div class="sheet-b" id="sheet-b"></div></dialog>
<div class="toast" role="status"></div>
%(sprite)s
<script defer src="../../../assets/libs/gsap.min.js"></script>
<script defer src="../../../assets/libs/jspdf.umd.min.js"></script>
<script defer src="panel.js?v=%(vj)s"></script>
</body>
</html>
''' % dict(url=url, base=base, vc=v('panel.css'), vj=v('panel.js'), logo=LOGO, side=side, bar=bar, ext=ico('external-link'), rst=ico('rotate-ccw'), plus=ico('plus'), x=ico('x'), sprite=sprite)
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(doc)
