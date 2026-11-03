# galeria.py · pagina portfolio/sitios/index.html con los 20 sitios demo.
import os, re

ESTILOS = {'dark': 'Oscuro', 'clay': 'Claymorphism', 'soft': 'Soft UI', 'brutal': 'Neubrutalismo', 'swiss': 'Suizo', 'glass': 'Glassmorphism', 'luxe': 'Editorial de lujo'}
MODS = {'agenda': 'Turnos online', 'receta': 'Recetas en PDF', 'ficha': 'Fichas clínicas', 'cuotas': 'Simulador de cuotas', 'catalogo': 'Catálogo con filtros',
        'menu': 'Carta con pedido', 'reserva': 'Reservas por calendario', 'mesa': 'Reserva de mesa', 'horario': 'Grilla de clases', 'wizard': 'Cotizador por pasos',
        'quiz': 'Test interactivo', 'solar': 'Calculadora de ahorro', 'breath': 'Respiración guiada', 'pizza': 'Armador de pizza', 'venc': 'Vencimientos por CUIT',
        'sellos': 'Tarjeta de sellos', 'track': 'Seguimiento de pedido'}
CATS = {'Salud': ['patita-vet', 'centro-medico-alba', 'sonrie-dental', 'espacio-calma', 'pulso-training'],
        'Gastronomía': ['brasa-parrilla', 'grano-cafe', 'fuego-pizza'],
        'Comercio': ['austral-motors', 'habitar-propiedades', 'telar-moda', 'solaria-energia'],
        'Servicios': ['monolito-arquitectura', 'lex-norte-abogados', 'balance-contable', 'escudo-seguros', 'kairos-idiomas', 'navaja-barber-club'],
        'Turismo': ['selva-lodge', 'ruta-norte-viajes']}

def cat_of(slug):
    return next(c for c, l in CATS.items() if slug in l)

def render(sites, esc, BASE):
    here = os.path.dirname(os.path.abspath(__file__))
    files = os.listdir(os.path.join(here, 'kit', 'fonts'))
    faces, seen = [], set()
    for s in sites:
        fam, w = s['fonts']['d'], s['fonts'].get('dw', '700')
        fid = fam.lower().replace(' ', '-')
        f = '%s-%s-normal.woff2' % (fid, w)
        if fam in seen or f not in files: continue
        seen.add(fam)
        faces.append("@font-face{font-family:'%s';font-weight:%s;font-display:swap;src:url(kit/fonts/%s) format('woff2')}" % (fam, w, f))
    for f in ('plus-jakarta-sans-400-normal.woff2', 'plus-jakarta-sans-800-normal.woff2'):
        faces.append("@font-face{font-family:'PJS';font-weight:%s;font-display:swap;src:url(kit/fonts/%s) format('woff2')}" % (f.split('-')[3], f))
    cards = []
    for i, s in enumerate(sites):
        t = s['tokens']
        mods = []
        for x in s['sections']:
            if x['kind'] == 'module' and MODS[x['mod']] not in mods: mods.append(MODS[x['mod']])
        h1 = ' '.join(s['hero']['h1'])
        cards.append('''<article class="g-card" data-cat="%(cat)s" style="--b:%(bg)s;--f:%(fg)s;--p:%(p)s;--op:%(op)s;--fd:'%(fd)s',serif;--fw:%(fw)s">
<a href="%(slug)s/index.html" aria-label="Abrir la demo de %(name)s, %(rubro)s">
<div class="g-shot" aria-hidden="true"><div class="g-bar"><i></i><i></i><i></i><span>%(slug)s</span></div>
<div class="g-page"><div class="g-nav"><b>%(name)s</b><span class="g-btn">%(cta)s</span></div><p class="g-h1">%(h1)s</p><div class="g-row"><span class="g-btn">%(cta1)s</span><span class="g-btn ghost">%(cta2)s</span></div></div>
<span class="g-num">%(num)02d</span></div>
<div class="g-body"><p class="g-rubro">%(rubro)s</p><h2>%(name)s</h2><p class="g-desc">%(desc)s</p>
<ul class="g-tags"><li>%(estilo)s</li><li>%(fonts)s</li>%(mods)s</ul><span class="g-go">Ver sitio <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span></div></a></article>'''
            % dict(cat=cat_of(s['slug']), bg=t.get('--bg', '#fff'), fg=t.get('--fg', '#111'), p=t['--primary'], op=t['--on-primary'], fd=s['fonts']['d'], fw=s['fonts'].get('dw', '700'),
                   slug=s['slug'], name=esc(s['name']), rubro=esc(s['rubro']), cta=esc(s['hdrCta'][0]), h1=esc(h1), cta1=esc(s['hero']['cta1'][0]), cta2=esc((s['hero'].get('cta2') or ('Más', ''))[0]),
                   num=i + 1, desc=esc(s['desc']), estilo=ESTILOS[s['style']], fonts=esc(s['fonts']['d'] if s['fonts']['d'] == s['fonts']['b'] else s['fonts']['d'] + ' + ' + s['fonts']['b']),
                   mods=''.join('<li>%s</li>' % esc(m) for m in mods)))
    chips = ''.join('<button type="button" data-f="%s" aria-pressed="false">%s <small>%d</small></button>' % (c, c, len(l)) for c, l in CATS.items())
    return '''<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>20 sitios web demo por rubro | Mariano Campuzano</title>
<meta name="description" content="Veinte sitios web demo de rubros distintos (concesionaria, veterinaria, centro médico, gimnasio, inmobiliaria y más), cada uno con diseño propio y funciones reales: turnos, recetas en PDF, catálogos, carrito y cotizadores.">
<meta name="theme-color" content="#0B0B0F">
<link rel="canonical" href="%(base)sportfolio/sitios/">
<meta property="og:type" content="website"><meta property="og:url" content="%(base)sportfolio/sitios/"><meta property="og:title" content="20 sitios web demo por rubro · Mariano Campuzano">
<meta property="og:description" content="Cada sitio con diseño, colores y funciones distintas. Negocios ficticios para mostrar lo que puedo hacer por tu negocio.">
<meta property="og:image" content="%(base)sassets/img/og.jpg">
<link rel="icon" href="data:image/svg+xml,%%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%%3E%%3Crect width='40' height='40' rx='10' fill='%%23FF5A1F'/%%3E%%3Ctext x='20' y='27' text-anchor='middle' font-family='system-ui' font-weight='800' font-size='18' fill='%%23fff'%%3E20%%3C/text%%3E%%3C/svg%%3E">
<style>
%(faces)s
:root{--bg:#0B0B0F;--fg:#F4F4F5;--mu:#A1A1AA;--ac:#FF5A1F;--line:rgba(255,255,255,.1)}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%%}body{margin:0;background:var(--bg);color:var(--fg);font:400 1rem/1.6 'PJS',system-ui,sans-serif;overflow-x:clip}
a{color:inherit}.wrap{width:min(1320px,100%%);margin:0 auto;padding:0 clamp(16px,4vw,40px)}
.skip{position:absolute;left:-999px}.skip:focus{left:16px;top:16px;z-index:9;background:#fff;color:#000;padding:8px 12px}
.top{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 0}
.top a{text-decoration:none;font-weight:700;font-size:.92rem;display:inline-flex;gap:8px;align-items:center;padding:10px 16px;border:1px solid var(--line);border-radius:999px;transition:background .25s,border-color .25s}
.top a:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.3)}
.hero{padding:clamp(48px,9vw,120px) 0 clamp(32px,5vw,56px)}
.eb{display:inline-flex;gap:10px;align-items:center;font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;color:var(--mu);font-weight:700}
.eb::before{content:"";width:28px;height:2px;background:var(--ac)}
h1{font:800 clamp(2.6rem,8.6vw,8.4rem)/.92 'PJS',sans-serif;letter-spacing:-.055em;margin:18px 0 0}
h1 em{font-style:normal;color:var(--ac)}h1 .ln{display:block;overflow:hidden;padding-bottom:.06em}h1 .ln>span{display:inline-block}
.lead{max-width:62ch;color:var(--mu);font-size:clamp(1.05rem,1.6vw,1.25rem);margin:26px 0 0}
.note{margin-top:14px;font-size:.88rem;color:var(--mu)}
.filters{display:flex;flex-wrap:wrap;gap:10px;margin:36px 0 28px}
.filters button{font:600 .92rem 'PJS',sans-serif;color:var(--fg);background:transparent;border:1px solid var(--line);border-radius:999px;padding:10px 16px;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
.filters button small{opacity:.6;margin-left:4px}.filters button[aria-pressed="true"]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.filters button:hover{border-color:rgba(255,255,255,.4)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%%,360px),1fr));gap:22px;padding-bottom:80px}
.g-card{border-radius:22px;overflow:hidden;background:#141419;border:1px solid var(--line);transition:transform .45s cubic-bezier(.2,.8,.2,1),border-color .3s,box-shadow .45s}
.g-card:hover{transform:translateY(-6px);border-color:color-mix(in srgb,var(--p) 70%%,transparent);box-shadow:0 30px 60px -30px var(--p)}
.g-card>a{display:block;text-decoration:none;height:100%%}.g-card>a:focus-visible{outline:3px solid var(--ac);outline-offset:-3px}
.g-shot{position:relative;aspect-ratio:16/10;background:var(--b);color:var(--f);overflow:hidden}
.g-bar{display:flex;gap:6px;align-items:center;padding:10px 14px;background:color-mix(in srgb,var(--f) 8%%,var(--b))}
.g-bar i{width:9px;height:9px;border-radius:50%%;background:color-mix(in srgb,var(--f) 30%%,transparent)}.g-bar span{margin-left:8px;font-size:.7rem;opacity:.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.g-page{padding:16px 20px;transition:transform .6s cubic-bezier(.2,.8,.2,1)}.g-card:hover .g-page{transform:scale(1.04)}
.g-nav{display:flex;justify-content:space-between;align-items:center;gap:10px;font:var(--fw) .95rem var(--fd)}
.g-h1{font:var(--fw) clamp(1.5rem,2.6vw,2.1rem)/1.02 var(--fd);letter-spacing:-.02em;margin:18px 0 14px;max-width:14ch}
.g-row{display:flex;gap:8px;flex-wrap:wrap}
.g-btn{display:inline-block;font:700 .68rem 'PJS',sans-serif;padding:7px 11px;border-radius:999px;background:var(--p);color:var(--op);white-space:nowrap}
.g-btn.ghost{background:transparent;color:var(--f);border:1px solid color-mix(in srgb,var(--f) 35%%,transparent)}
.g-num{position:absolute;right:14px;bottom:6px;font:800 3.4rem/1 'PJS',sans-serif;color:var(--p);opacity:.22;letter-spacing:-.06em}
.g-body{padding:20px 22px 24px}
.g-rubro{margin:0;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mu);font-weight:700}
.g-body h2{margin:4px 0 8px;font:800 1.5rem/1.15 'PJS',sans-serif;letter-spacing:-.03em}
.g-desc{margin:0;color:#C9C9D1;font-size:.94rem}
.g-tags{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:16px 0 0;padding:0}
.g-tags li{font-size:.74rem;font-weight:600;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.06);color:#D4D4D8}
.g-tags li:first-child{background:color-mix(in srgb,var(--p) 26%%,transparent);color:#fff}
.g-go{display:inline-flex;align-items:center;gap:6px;margin-top:18px;font-weight:700;color:#fff}.g-go svg{width:18px;height:18px;transition:transform .3s}.g-card:hover .g-go svg{transform:translate(3px,-3px)}
.g-card[hidden]{display:none}
.how{border-top:1px solid var(--line);padding:56px 0 40px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%%,260px),1fr));gap:28px}
.how h3{margin:0 0 6px;font-size:1.1rem}.how p{margin:0;color:var(--mu);font-size:.95rem}
.cta{margin:20px 0 60px;padding:clamp(28px,5vw,56px);border-radius:28px;background:linear-gradient(120deg,#FF5A1F,#E11D48);color:#fff;display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between}
.cta h2{margin:0;font:800 clamp(1.6rem,3.6vw,2.8rem)/1.05 'PJS',sans-serif;letter-spacing:-.04em;max-width:20ch}
.cta a{background:#fff;color:#111;text-decoration:none;font-weight:800;padding:16px 24px;border-radius:999px;white-space:nowrap}
footer{border-top:1px solid var(--line);padding:26px 0 40px;color:var(--mu);font-size:.86rem;display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between}
html.fx .g-card{opacity:0}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}html.fx .g-card{opacity:1}}
</style>
<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&location.search.indexOf('nofx')<0)document.documentElement.classList.add('fx')</script>
</head>
<body>
<a class="skip" href="#sitios">Saltar a los sitios</a>
<div class="wrap">
<nav class="top" aria-label="Volver"><a href="../index.html"><span aria-hidden="true">←</span> Portfolio completo</a><a href="../../index.html">Mariano Campuzano</a></nav>
<header class="hero">
<p class="eb">Sitios web demo · %(n)d rubros</p>
<h1><span class="ln"><span>Una web distinta</span></span><span class="ln"><span>para cada <em>negocio.</em></span></span></h1>
<p class="lead">%(n)d sitios completos, cada uno con su diseño, colores, tipografías y animaciones, y con funciones que se pueden probar: turnos online, recetas en PDF, fichas de pacientes, catálogos con filtros, carrito con pedido por WhatsApp, cotizadores y reservas.</p>
<p class="note">Los negocios son ficticios: nombres, precios y datos son de ejemplo. Los formularios no envían nada.</p>
</header>
<div class="filters" role="group" aria-label="Filtrar por rubro"><button type="button" data-f="" aria-pressed="true">Todos <small>%(n)d</small></button>%(chips)s</div>
<main class="grid" id="sitios">
%(cards)s
</main>
<section class="how" aria-label="Cómo están hechos">
<div><h3>Diseño por rubro</h3><p>Paletas, tipografías y estilos elegidos con la base de datos de diseño ui-ux-pro-max según el tipo de negocio.</p></div>
<div><h3>Animaciones con GSAP</h3><p>Textos que se arman letra por letra, scroll suave con Lenis, secciones fijadas, contadores y escenas 3D con three.js.</p></div>
<div><h3>Funciones reales</h3><p>Turnos con archivo de calendario, recetas en PDF con jsPDF, carrito, simuladores y calendarios hechos a medida.</p></div>
<div><h3>Rápidos y accesibles</h3><p>Sin frameworks pesados, respetan “reducir movimiento”, se usan con teclado y se adaptan al celular.</p></div>
</section>
<section class="cta"><h2>¿Querés una web así para tu negocio?</h2><a href="https://wa.me/5493764148342?text=%(wa)s">Escribime por WhatsApp</a></section>
<footer><span>© Mariano Campuzano · Diseño y desarrollo web</span><span>Créditos y licencias: <a href="CREDITOS.txt">CREDITOS.txt</a></span></footer>
</div>
<script src="../../assets/libs/gsap.min.js" defer></script>
<script src="../../assets/libs/ScrollTrigger.min.js" defer></script>
<script>
addEventListener('DOMContentLoaded',function(){
  var cards=[].slice.call(document.querySelectorAll('.g-card')),fx=document.documentElement.classList.contains('fx')&&window.gsap;
  if(fx){gsap.registerPlugin(ScrollTrigger);
    gsap.from('h1 .ln>span',{yPercent:110,duration:1.1,ease:'expo.out',stagger:.12});
    gsap.from('.eb,.lead,.note,.filters',{y:24,opacity:0,duration:.9,ease:'power3.out',stagger:.08,delay:.3});
    ScrollTrigger.batch(cards,{start:'top 92%%',once:true,onEnter:function(b){gsap.fromTo(b,{opacity:0,y:60,rotate:1.5},{opacity:1,y:0,rotate:0,duration:.9,ease:'power3.out',stagger:.08})}});
  }else cards.forEach(function(c){c.style.opacity=1});
  document.querySelector('.filters').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    [].forEach.call(this.children,function(x){x.setAttribute('aria-pressed',x===b)});
    cards.forEach(function(c){c.hidden=!!b.dataset.f&&c.dataset.cat!==b.dataset.f;c.style.opacity=1});
    if(fx){gsap.fromTo(cards.filter(function(c){return !c.hidden}),{opacity:0,y:30},{opacity:1,y:0,duration:.5,stagger:.04,ease:'power2.out'});ScrollTrigger.refresh()}});
});
</script>
</body>
</html>
''' % dict(base=BASE, faces='\n'.join(faces), n=len(sites), chips=chips, cards='\n'.join(cards),
           wa='Hola%20Mariano%2C%20vi%20tus%20sitios%20demo%20y%20quiero%20una%20web%20para%20mi%20negocio.')
