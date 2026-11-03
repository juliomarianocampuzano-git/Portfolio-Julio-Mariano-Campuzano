#!/usr/bin/env python3
"""Genera los sitios demo del portfolio (portfolio/sitios/<slug>/) y la galeria (portfolio/sitios/index.html).
Datos de cada sitio: sitios_data.py. Estilos y motor comun: kit/. Uso: python portfolio/sitios/build-sitios.py
Los negocios son ficticios: cada pagina lo aclara en la cinta superior y en el pie."""
import os, re, json, html, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__))
import sys; sys.path.insert(0, HERE)
import sitios_data as SD
import arte as A

BASE = 'https://juliomarianocampuzano-git.github.io/Portfolio-Julio-Mariano-Campuzano/'
LIBS = '../../../assets/libs/'
LUCIDE = 'https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/%s.svg'
WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>'

esc = lambda s: html.escape(str(s), quote=True)
import hashlib
def ver(rel):
    """Version corta segun el contenido, para que el navegador no use copias viejas."""
    return hashlib.md5(open(os.path.join(HERE, rel), 'rb').read()).hexdigest()[:8]

# ---------- iconos Lucide (se descargan una vez y quedan en kit/icons) ----------
ICON_DIR = os.path.join(HERE, 'kit', 'icons')
os.makedirs(ICON_DIR, exist_ok=True)
def icon_svg(name):
    p = os.path.join(ICON_DIR, name + '.svg')
    if not os.path.exists(p):
        data = urllib.request.urlopen(urllib.request.Request(LUCIDE % name, headers={'User-Agent': 'portfolio-build'}), timeout=40).read().decode()
        open(p, 'w', encoding='utf-8').write(data)
    s = open(p, encoding='utf-8').read()
    inner = re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1)
    inner = re.sub(r'<!--.*?-->', '', inner, flags=re.S)
    return '<symbol id="i-%s" viewBox="0 0 24 24">%s</symbol>' % (name, re.sub(r'\s+', ' ', inner).strip())
MOD_ICONS = sorted(set(re.findall(r"I\('([a-z0-9-]+)'\)", open(os.path.join(HERE, 'kit', 'modules.js'), encoding='utf-8').read())))
def ico(n): return '<svg class="ico" aria-hidden="true"><use href="#i-%s"/></svg>' % n

def collect_icons(obj, out):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ('i', 'icon') and isinstance(v, str): out.add(v)
            elif k == 'meta' and isinstance(v, list):
                for m in v:
                    if isinstance(m, list) and m: out.add(m[0])
            else: collect_icons(v, out)
    elif isinstance(obj, list):
        for v in obj: collect_icons(v, out)

# ---------- piezas ----------
def logo(s):
    m = s['logo']; c1, c2 = m.get('c1', 'var(--primary)'), m.get('c2', 'var(--on-primary)')
    shapes = {
        'circle': '<circle cx="20" cy="20" r="19" fill="%s"/>' % c1,
        'square': '<rect x="1" y="1" width="38" height="38" rx="%s" fill="%s"/>' % (m.get('r', 10), c1),
        'hex': '<path d="M20 1 37 10.5v19L20 39 3 29.5v-19z" fill="%s"/>' % c1,
        'diamond': '<path d="M20 1 39 20 20 39 1 20z" fill="%s"/>' % c1,
        'shield': '<path d="M20 1 36 7v12c0 10-7 17-16 20C11 36 4 29 4 19V7z" fill="%s"/>' % c1,
        'arch': '<path d="M3 39V20a17 17 0 0 1 34 0v19z" fill="%s"/>' % c1,
    }[m.get('shape', 'circle')]
    glyph = ('<text x="20" y="21" text-anchor="middle" dominant-baseline="central" font-family="%s" font-weight="800" font-size="%s" fill="%s">%s</text>'
             % (s['fonts']['d'], m.get('size', 20), c2, esc(m['t'])))
    return '<a class="logo" href="#top" aria-label="%s, inicio"><svg viewBox="0 0 40 40" aria-hidden="true">%s%s</svg><span>%s</span></a>' % (esc(s['name']), shapes, glyph, esc(s['name']))

def header(s):
    links = ''.join('<a class="l" href="#%s">%s</a>' % (a, esc(t)) for t, a in s['nav'])
    cart = ('<button class="btn ghost sm cart-btn" type="button" aria-label="Ver pedido">%s<span class="n" hidden>0</span></button>' % ico('shopping-bag')) if s.get('cart') else ''
    cta = '<a class="btn sm hdr-cta" href="#%s">%s</a>' % (s['hdrCta'][1], esc(s['hdrCta'][0]))
    return ('<header class="hdr"><div class="wrap hdr-in">%s<nav class="nav" aria-label="Principal">%s</nav>'
            '<div style="display:flex;gap:10px;align-items:center">%s%s<button class="burger" type="button" aria-label="Abrir menú" aria-expanded="false"><span></span></button></div></div></header>') % (logo(s), links, cart, cta)

def h1(lines, cls='', split='chars'):
    return '<h1 class="%s" data-split="%s">%s</h1>' % (cls, split, '<br>'.join(esc(x) for x in lines))

def cta_row(h):
    out = '<div class="cta" data-in>'
    if h.get('cta1'): out += '<a class="btn" href="#%s">%s%s</a>' % (h['cta1'][1], esc(h['cta1'][0]), ico(h.get('cta1i', 'arrow-down-right')))
    if h.get('cta2'): out += '<a class="btn ghost" href="#%s">%s</a>' % (h['cta2'][1], esc(h['cta2'][0]))
    return out + '</div>'

def points(h):
    out = '<ul class="hero-points" data-in>%s</ul>' % ''.join('<li>%s%s</li>' % (ico(i), esc(t)) for i, t in h['points']) if h.get('points') else ''
    return out + h.get('extra', '')

def hero(s):
    h = s['hero']; t = h['type']; vis = h.get('vis', '')
    eb = '<p class="eyebrow" data-in>%s</p>' % esc(h['eyebrow']) if h.get('eyebrow') else ''
    lead = '<p class="lead" data-in>%s</p>' % esc(h['lead'])
    if t == 'split':
        inner = ('<div class="wrap hero-grid"><div>%s%s%s%s%s</div><div class="stage">%s</div></div>'
                 % (eb, h1(h['h1'], split=h.get('split', 'chars')), lead, cta_row(h), points(h), vis))
    elif t == 'center':
        inner = '<div class="wrap">%s%s%s%s%s<div class="stage">%s</div></div>' % (eb, h1(h['h1'], split=h.get('split', 'words')), lead, cta_row(h), points(h), vis)
    elif t == 'full':
        inner = '%s<div class="wrap"><div class="hero-copy">%s%s%s%s%s</div></div>' % (vis, eb, h1(h['h1'], split=h.get('split', 'chars')), lead, cta_row(h), points(h))
    elif t == 'kinetic':
        rows = ''.join('<span class="k-row">%s</span>' % esc(x) for x in h['h1'])
        inner = ('%s<div class="wrap">%s<h1 data-split="chars">%s</h1><div class="k-sub"><div>%s%s</div>%s</div></div>'
                 % (h.get('bg', ''), eb, rows, lead, cta_row(h), vis))
    elif t == 'editorial':
        inner = ('<div class="wrap hero-grid"><div class="ed-title">%s%s</div><div class="ed-copy">%s%s%s</div><div class="ed-art stage">%s</div></div>'
                 % (eb, h1(h['h1'], split=h.get('split', 'lines')), lead, cta_row(h), points(h), vis))
    return '<section class="hero hero--%s" id="top" aria-label="Presentación"%s>%s</section>' % (t, ' data-out="%s"' % h['out'] if h.get('out') else '', inner)

def sec_head(x, center=False):
    if not x: return ''
    eb = '<p class="eyebrow">%s</p>' % esc(x['eb']) if x.get('eb') else ''
    lead = '<p class="lead">%s</p>' % esc(x['p']) if x.get('p') else ''
    return '<div class="sec-head%s">%s<h2 class="h-l" data-split="%s">%s</h2>%s</div>' % (' c' if center else '', eb, x.get('split', 'words'), esc(x['h']), lead)

def wrap_sec(x, inner, extra_cls=''):
    cls = 'sec' + (' ' + x['bg'] if x.get('bg') else '') + extra_cls
    return '<section class="%s" id="%s">%s</section>' % (cls, x.get('id', x['kind']), inner)

def S_marquee(s, x):
    words = ''.join('<span>%s</span>' % esc(w) for w in x['words'])
    return '<div class="marquee" aria-hidden="true"><div class="marquee-track" data-dir="%s" data-speed="%s"%s>%s</div></div>' % (x.get('dir', 'l'), x.get('speed', 30), ' data-skew' if x.get('skew') else '', words)

def S_features(s, x):
    kind = x.get('layout', 'grid3')
    if kind == 'list':
        body = '<ul class="feat-list" data-rv="up" data-kids>%s</ul>' % ''.join('<li><span class="n">%s</span><h3>%s</h3><p class="muted">%s</p></li>' % (ico(it['i']), esc(it['t']), esc(it['d'])) for it in x['items'])
    else:
        cards = ''.join('<article class="card"%s><span class="ic">%s</span><h3>%s</h3><p class="muted">%s</p></article>' % (' data-tilt' if x.get('tilt') else '', ico(it['i']), esc(it['t']), esc(it['d'])) for it in x['items'])
        body = '<div class="%s" data-rv="%s" data-kids>%s</div>' % (kind, x.get('rv', 'up'), cards)
    return wrap_sec(x, '<div class="wrap">%s%s</div>' % (sec_head(x.get('head'), x.get('center')), body))

def S_module(s, x):
    cfg = '<script type="application/json">%s</script>' % json.dumps(x['cfg'], ensure_ascii=False).replace('</', '<\\/')
    panel = ('<div class="panel" data-rv="%s"><div class="panel-h"><div class="dots"><i></i><i></i><i></i></div><b>%s</b><span class="badge info">Demo</span></div>'
             '<div class="panel-b" data-mod="%s">%s<div class="mod-ui"><noscript><p class="empty">Activá JavaScript para probar la demo.</p></noscript></div></div></div>') % (x.get('rv', 'up'), esc(x['panel']), x['mod'], cfg)
    hd = x['head']
    if x.get('layout') == 'full':
        inner = '<div class="wrap">%s%s</div>' % (sec_head(hd, x.get('center')), panel)
    else:
        bl = ''.join('<li>%s<span>%s</span></li>' % (ico(i), esc(t)) for i, t in hd.get('bullets', []))
        copy = ('<div class="mod-copy">%s<h2 class="h-l" data-split="words">%s</h2><p class="lead">%s</p>%s</div>'
                % ('<p class="eyebrow">%s</p>' % esc(hd['eb']) if hd.get('eb') else '', esc(hd['h']), esc(hd.get('p', '')), '<ul>%s</ul>' % bl if bl else ''))
        inner = '<div class="wrap mod-grid">%s%s</div>' % ((panel + copy) if x.get('flip') else (copy + panel), '')
    return wrap_sec(x, inner)

def S_hs(s, x):
    cards = ''.join('<article class="hs-card card" style="padding:0;overflow:hidden"><div style="aspect-ratio:4/3;display:grid;place-items:center;background:%s">%s</div><div style="padding:22px 24px 26px">%s<h3>%s</h3><p class="muted">%s</p></div></article>'
                    % (c.get('bg', 'var(--bg2)'), c.get('art', ''), '<span class="tag">%s</span>' % esc(c['tag']) if c.get('tag') else '', esc(c['t']), esc(c['d'])) for c in x['cards'])
    return '<section class="sec hs%s" id="%s" data-hs><div class="wrap">%s</div><div class="hs-track">%s</div></section>' % (' ' + x['bg'] if x.get('bg') else '', x['id'], sec_head(x.get('head')), cards)

def S_stack(s, x):
    cards = ''.join('<article class="stack-card card" style="background:%s;color:%s"><div><span class="tag">%s</span><h3 class="h-m" style="margin:16px 0 12px;color:inherit">%s</h3><p style="opacity:.8">%s</p></div><div style="display:grid;place-items:center">%s</div></article>'
                    % (c.get('bg', 'var(--card)'), c.get('fg', 'var(--fg)'), esc(c['tag']), esc(c['t']), esc(c['d']), c.get('art', '')) for c in x['cards'])
    return wrap_sec(x, '<div class="wrap">%s<div class="stack">%s</div></div>' % (sec_head(x.get('head')), cards))

def S_steps(s, x):
    items = ''.join('<li><h3>%s</h3><p class="muted">%s</p></li>' % (esc(i['t']), esc(i['d'])) for i in x['items'])
    return wrap_sec(x, '<div class="wrap">%s<ol class="steps" style="padding:0;margin:0;list-style:none" data-rv="up" data-kids>%s</ol></div>' % (sec_head(x.get('head'), x.get('center')), items))

def S_plans(s, x):
    tog = ''
    if x.get('toggle'):
        tog = '<div class="plans-toggle" role="group" aria-label="Período"><button type="button" data-mode="m" aria-pressed="true">%s</button><button type="button" data-mode="y" aria-pressed="false">%s</button></div>' % tuple(esc(t) for t in x['toggle'])
    def plan(p):
        price = ('<p class="price"><span data-m="%s" data-y="%s">%s</span> <small data-per data-ml="%s" data-yl="%s">%s</small></p>'
                 % (p['m'], p.get('y', p['m']), '$ ' + format(p['m'], ',').replace(',', '.'), esc(x.get('per', ['/mes', '/mes'])[0]), esc(x.get('per', ['/mes', '/mes'])[1]), esc(x.get('per', ['/mes'])[0])))
        feats = ''.join('<li>%s<span>%s</span></li>' % (ico('check'), esc(f)) for f in p['f'])
        return ('<article class="card plan%s">%s<h3 style="margin:0">%s</h3><p class="muted">%s</p>%s<ul>%s</ul><a class="btn" href="#%s">%s</a></article>'
                % (' hot' if p.get('hot') else '', '<span class="tag">%s</span>' % esc(p['tag']) if p.get('tag') else '', esc(p['n']), esc(p['d']), price, feats, x.get('ctaHref', 'contacto'), esc(p.get('cta', 'Elegir plan'))))
    note = '<p class="note" style="margin-top:18px">%s</p>' % esc(x.get('note', 'Precios de ejemplo para la demo.'))
    center = ' style="text-align:center"' if x.get('center') else ''
    return wrap_sec(x, '<div class="wrap" data-plans>%s<div%s>%s</div><div class="plans" data-rv="up" data-kids>%s</div>%s</div>' % (sec_head(x.get('head'), x.get('center')), center, tog, ''.join(plan(p) for p in x['plans']), note))

def S_faq(s, x):
    qa = ''.join('<details><summary>%s</summary><div class="a"><p>%s</p></div></details>' % (esc(q), esc(a)) for q, a in x['qa'])
    return wrap_sec(x, '<div class="wrap">%s<div class="faq" style="%s">%s</div></div>' % (sec_head(x.get('head'), x.get('center')), 'margin-inline:auto' if x.get('center') else '', qa))

def S_cta(s, x):
    vis = x.get('art', '')
    return wrap_sec(x, '<div class="wrap"><div class="cta-big" data-rv="scale"><div style="position:relative;z-index:1;max-width:760px"><h2 data-split="words">%s</h2><p>%s</p><a class="btn" href="#%s">%s</a></div>%s</div></div>'
                    % (esc(x['h']), esc(x['p']), x.get('href', 'contacto'), esc(x['btn']), vis), ' cta-sec')

def S_fill(s, x):
    return wrap_sec(x, '<div class="wrap"><p class="h-l" data-fill style="max-width:24ch;font-family:var(--fd);font-weight:var(--fdw);letter-spacing:var(--track);line-height:1.08;text-transform:var(--case)">%s</p></div>' % esc(x['text']))

def S_split(s, x):
    copy = '<div>%s<div class="lead" style="display:grid;gap:14px">%s</div>%s</div>' % (sec_head(x['head']).replace('sec-head', 'sec-head" style="margin-bottom:22px'), ''.join('<p>%s</p>' % esc(p) for p in x['text']),
            '<ul style="display:grid;gap:12px;margin-top:22px">%s</ul>' % ''.join('<li style="display:flex;gap:12px">%s<span>%s</span></li>' % (ico(i), esc(t)) for i, t in x.get('bullets', [])) if x.get('bullets') else '')
    art = '<div data-rv="%s" data-par="%s">%s</div>' % (x.get('rv', 'scale'), x.get('par', 0), x['art'])
    return wrap_sec(x, '<div class="wrap grid2" style="align-items:center;gap:clamp(32px,6vw,90px)">%s</div>' % ((art + copy) if x.get('flip') else (copy + art)))

def S_ba(s, x):
    return wrap_sec(x, '<div class="wrap">%s<div class="ba" data-rv="scale"><div class="before" style="background:%s">%s</div><div class="after" style="background:%s">%s</div><span class="lab" style="left:14px">Antes</span><span class="lab" style="right:14px">Después</span><span class="knob"></span><label class="sr" for="ba-%s">Comparar antes y después</label><input id="ba-%s" type="range" min="0" max="100" value="50"></div><p class="note">%s</p></div>'
                    % (sec_head(x['head'], True), x['bgA'], x['a'], x['bgB'], x['b'], x['id'], x['id'], esc(x['note'])))

def S_gallery(s, x):
    tiles = ''.join('<figure class="card" style="margin:0;padding:0;overflow:hidden;%s"><div style="aspect-ratio:%s;display:grid;place-items:center;background:%s">%s</div><figcaption style="padding:14px 18px;display:flex;justify-content:space-between;gap:10px"><b>%s</b><span class="muted">%s</span></figcaption></figure>'
                    % (t.get('span', ''), t.get('ratio', '4/5'), t['bg'], t.get('art', ''), esc(t['t']), esc(t.get('m', ''))) for t in x['tiles'])
    return wrap_sec(x, '<div class="wrap">%s<div class="%s" data-rv="up" data-kids>%s</div></div>' % (sec_head(x.get('head')), x.get('layout', 'grid3'), tiles))

def S_contact(s, x):
    rows = ''.join('<div class="kv"><span class="muted" style="display:flex;gap:8px;align-items:center">%s%s</span><b style="text-align:right">%s</b></div>' % (ico(i), esc(k), esc(v)) for i, k, v in x['info'])
    form = ('<form class="card" data-demo-form novalidate><h3 style="margin-top:0">%s</h3><div class="field"><label for="c-n">Nombre</label><input class="inp" id="c-n" required autocomplete="name"></div>'
            '<div class="field"><label for="c-t">Celular</label><input class="inp" id="c-t" type="tel" required autocomplete="tel"></div><div class="field"><label for="c-m">%s</label><textarea class="inp" id="c-m" required></textarea></div>'
            '<p class="note" role="alert" data-err></p><button class="btn" style="width:100%%">%s</button><p class="note">Formulario de demostración: no se envía a ningún lado.</p></form>') % (esc(x.get('formT', 'Escribinos')), esc(x.get('msgL', 'Mensaje')), esc(x.get('btn', 'Enviar consulta')))
    return wrap_sec(x, '<div class="wrap grid2" style="align-items:start;gap:clamp(24px,5vw,72px)"><div>%s<div class="card" style="margin-top:8px">%s</div><div style="margin-top:20px;border-radius:var(--r-lg);overflow:hidden" aria-hidden="true">%s</div></div>%s</div>'
                    % (sec_head(x['head']), rows, A.mapa(s['tokens']['--primary'], s['tokens'].get('--bg2', '#eee')), form))

SECTIONS = {k[2:]: v for k, v in globals().items() if k.startswith('S_')}

def footer(s):
    cols = ''.join('<div><h4>%s</h4><ul>%s</ul></div>' % (esc(t), ''.join('<li><a href="#%s">%s</a></li>' % (a, esc(l)) for l, a in links)) for t, links in s['footer'])
    return ('<footer class="ftr"><div class="wrap"><div class="ftr-grid"><div>%s<p class="muted" style="margin-top:14px;max-width:38ch">%s</p></div>%s</div>'
            '<div class="ftr-bottom"><span>%s es un negocio ficticio. Textos, precios y datos son de ejemplo.</span><span>Sitio demo diseñado y desarrollado por <a href="../../index.html">Mariano Campuzano</a> · <a href="../index.html">Ver los 20 sitios</a></span></div></div></footer>'
            % (logo(s).replace('href="#top"', 'href="#top" style="font-size:1.4rem"'), esc(s['tagline']), cols, esc(s['name'])))

def css_tokens(s):
    t = dict(s['tokens'])
    t['--fd'] = "'%s',%s" % (s['fonts']['d'], s['fonts'].get('dfb', 'system-ui,sans-serif'))
    t['--fb'] = "'%s',system-ui,-apple-system,sans-serif" % s['fonts']['b']
    t.setdefault('--fdw', s['fonts'].get('dw', '700'))
    return ':root{%s}' % ';'.join('%s:%s' % kv for kv in t.items())

FONT_FILES = sorted(os.listdir(os.path.join(HERE, 'kit', 'fonts')))
def font_faces(s):
    out = []
    for fam in dict.fromkeys([s['fonts']['d'], s['fonts']['b']]):
        fid = fam.lower().replace(' ', '-')
        for f in FONT_FILES:
            m = re.match(r'%s-(\d+)-(normal|italic)\.woff2$' % re.escape(fid), f)
            if m: out.append("@font-face{font-family:'%s';font-style:%s;font-weight:%s;font-display:swap;src:url(../kit/fonts/%s) format('woff2')}" % (fam, m.group(2), m.group(1), f))
    assert out, 'faltan fuentes para ' + s['slug']
    return '\n'.join(out)

def page(s):
    used = set(['arrow-down-right', 'check', 'shopping-bag', 'arrow-up-right']) | set(MOD_ICONS)
    collect_icons(s, used)
    for m in re.finditer(r'#i-([a-z0-9-]+)', json.dumps(s, ensure_ascii=False)): used.add(m.group(1))
    body_sections = ''.join(SECTIONS[x['kind']](s, x) for x in s['sections'])
    hero_html = hero(s)
    for m in re.finditer(r'#i-([a-z0-9-]+)', hero_html + body_sections): used.add(m.group(1))
    sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">%s</svg>' % ''.join(icon_svg(n) for n in sorted(used))
    need = s.get('libs', [])
    libs = ['gsap.min.js', 'ScrollTrigger.min.js', 'Flip.min.js', 'SplitText.min.js', 'lenis.min.js', 'confetti.min.js']
    if 'three' in need: libs.append('three.min.js')
    if 'tilt' in need: libs.append('vanilla-tilt.min.js')
    if 'pdf' in need: libs.append('jspdf.umd.min.js')
    scripts = ''.join('<script defer src="%s%s"></script>' % (LIBS, l) for l in libs)
    scripts += '<script defer src="../kit/kit.js?v=%s"></script><script defer src="../kit/modules.js?v=%s"></script>' % (ver('kit/kit.js'), ver('kit/modules.js'))
    if s.get('vis'): scripts += '<script defer src="../kit/visuals.js?v=%s"></script>' % ver('kit/visuals.js')
    cfg = {'wa': '5493764148342', 'cur': '$', 'loader': bool(s.get('loader')), 'cursor': bool(s.get('cursor')), 'split': s.get('split', 'rise')}
    cfg.update(s.get('cfg', {}))
    url = BASE + 'portfolio/sitios/%s/' % s['slug']
    loader = '<div class="loader" aria-hidden="true"><b>0</b></div>' if s.get('loader') else ''
    hire_txt = 'Hola Mariano, vi la demo de %s (%s) en tu portfolio y quiero una web así para mi negocio.' % (s['name'], s['rubro'])
    doc = '''<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<meta name="theme-color" content="%(theme)s">
<link rel="canonical" href="%(url)s">
<meta property="og:type" content="website"><meta property="og:url" content="%(url)s"><meta property="og:title" content="%(title)s"><meta property="og:description" content="%(desc)s">
<meta property="og:image" content="%(base)sassets/img/og.jpg">
<link rel="icon" href="data:image/svg+xml,%(fav)s">
<link rel="stylesheet" href="../kit/kit.css?v=%(vcss)s">
<link rel="stylesheet" href="site.css?v=%(vsite)s">
<script type="application/json" id="site-cfg">%(cfg)s</script>
</head>
<body class="s-%(style)s">
<a class="skip" href="#main">Saltar al contenido</a>
<div class="demo-ribbon"><span><b>Sitio demo</b> de un negocio ficticio, hecho por Mariano Campuzano.</span><a href="../index.html">Ver los 20 sitios</a></div>
%(loader)s<div class="progress" aria-hidden="true"></div>
%(header)s
<main id="main">
%(hero)s
%(sections)s
</main>
%(footer)s
<div class="mbar off"><a class="btn mbar-cta" href="#%(mcta)s">%(mctal)s</a></div>
<a class="hire" data-hire="%(hire)s" href="https://wa.me/5493764148342">%(wa)s<span>Quiero una web así</span></a>
%(sprite)s
%(scripts)s<script defer src="site.js?v=1"></script>
</body>
</html>
''' % dict(title=esc(s['title']), desc=esc(s['desc']), theme=s['tokens']['--primary'], url=url, base=BASE, cfg=json.dumps(cfg, ensure_ascii=False),
           fav=urllib.parse.quote(re.sub(r'<a[^>]*>|</a>|<span>.*?</span>', '', logo(s)).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace('var(--primary)', s['tokens']['--primary']).replace('var(--on-primary)', s['tokens']['--on-primary'])),
           style=s['style'], loader=loader, header=header(s), hero=hero_html, sections=body_sections, footer=footer(s), hire=esc(hire_txt), mcta=s['hdrCta'][1], mctal=esc(s['hdrCta'][0]), wa=WA_ICON, vcss=ver('kit/kit.css'), vsite=hashlib.md5((site_css(s)).encode()).hexdigest()[:8], sprite=sprite, scripts=scripts)
    return doc

import urllib.parse
SITE_JS = '''/* site.js · comportamiento comun del formulario de contacto de la demo */
(function(){var f=document.querySelector('[data-demo-form]');if(!f)return;f.addEventListener('submit',function(e){e.preventDefault();var err=f.querySelector('[data-err]'),bad=[].slice.call(f.querySelectorAll('[required]')).filter(function(i){return !i.value.trim()});
if(bad.length){err.textContent='Completá: '+bad.map(function(i){return f.querySelector('label[for="'+i.id+'"]').textContent}).join(', ')+'.';bad[0].focus();return}
err.textContent='';f.reset();window.KIT&&KIT.toast('Consulta enviada: te respondemos en el día (demo).');window.KIT&&KIT.burst()})})();
'''

def site_css(s):
    return '/* %s · %s. Tokens basados en ui-ux-pro-max (%s). */\n%s\n%s\n%s\n' % (s['name'], s['rubro'], s['ref'], font_faces(s), css_tokens(s), s.get('css', ''))

# ---------- seccion "Sitios web por rubro" dentro del portfolio (ES y EN) ----------
RUBRO_EN = {'austral-motors': 'Car dealership', 'patita-vet': 'Veterinary software', 'centro-medico-alba': 'Medical clinic', 'sonrie-dental': 'Dental practice',
            'pulso-training': 'Gym', 'brasa-parrilla': 'Steakhouse', 'grano-cafe': 'Specialty coffee', 'monolito-arquitectura': 'Architecture studio',
            'habitar-propiedades': 'Real estate', 'lex-norte-abogados': 'Law firm', 'balance-contable': 'Accounting firm', 'navaja-barber-club': 'Barbershop',
            'selva-lodge': 'Boutique lodge', 'ruta-norte-viajes': 'Travel agency', 'telar-moda': 'Fashion store', 'kairos-idiomas': 'Language school',
            'escudo-seguros': 'Insurance broker', 'solaria-energia': 'Solar energy', 'espacio-calma': 'Psychology practice', 'fuego-pizza': 'Pizzeria & delivery'}
TXT = {'es': dict(eb='Diseño web', h='Sitios web por rubro', p='%d sitios demo completos, cada uno con su propio diseño, colores y funciones: turnos, recetas en PDF, catálogos, carrito y cotizadores. Todos hechos primero para celular.',
                  note='Negocios ficticios creados para mostrar diseño y funciones. Los formularios no envían datos.', btn='Ver los %d sitios', panel='Panel de gestión (demo)', open='Abrir la demo de'),
       'en': dict(eb='Web design', h='Websites by industry', p='%d complete demo websites, each with its own design, colors and features: bookings, PDF prescriptions, catalogs, cart and quote builders. All built mobile-first.',
                  note='Fictional businesses built to showcase design and features. Forms do not send any data.', btn='See all %d websites', panel='Management dashboard (demo)', open='Open the demo of')}

def portfolio_block(lang, pre):
    t = TXT[lang]
    tiles = ''.join(
        '<a class="site-tile" href="%(pre)ssitios/%(slug)s/index.html" style="--sb:%(bg)s;--sf:%(fg)s;--sp:%(p)s;--sa:%(a)s" aria-label="%(open)s %(name)s">'
        '<span class="st-top"><span class="st-n">%(n)02d</span><span class="st-dots" aria-hidden="true"><i></i><i></i><i></i></span></span>'
        '<b>%(name)s</b><small>%(rubro)s</small></a>'
        % dict(pre=pre, slug=s['slug'], bg=s['tokens'].get('--bg', '#fff'), fg=s['tokens'].get('--fg', '#111'), p=s['tokens']['--primary'], a=s['tokens'].get('--accent', s['tokens']['--primary']),
               open=t['open'], name=esc(s['name']), n=i + 1, rubro=esc(s['rubro'] if lang == 'es' else RUBRO_EN[s['slug']])) for i, s in enumerate(SD.SITES))
    n = len(SD.SITES)
    return ('<!--sitios:start--><section class="section wrap" id="sitios-demo"><div class="section-heading"><div><p class="eyebrow">%s</p><h2>%s<span>.</span></h2></div><p>%s</p></div>'
            '<div class="site-strip">%s</div><div class="site-cta"><a class="btn primary" href="%ssitios/index.html">%s &#8599;</a><a class="btn" href="%ssitios/panel-alba/index.html">%s &#8599;</a><p>%s</p></div></section><!--sitios:end-->'
            % (t['eb'], t['h'], t['p'] % n, tiles, pre, t['btn'] % n, pre, t['panel'], t['note']))

def inject_portfolio():
    for lang, rel, pre, label in (('es', '../index.html', '', 'Sitios web'), ('en', '../en/index.html', '../', 'Websites')):
        f = os.path.join(HERE, rel); h = open(f, encoding='utf-8').read()
        b = portfolio_block(lang, pre)
        if '<!--sitios:start-->' in h:
            h = re.sub(r'<!--sitios:start-->.*?<!--sitios:end-->', lambda m: b, h, flags=re.S)
        else:
            h = h.replace('<section class="section wrap" id="catalogo">', b + '\n<section class="section wrap" id="catalogo">', 1)
        if 'href="#sitios-demo"' not in h:
            h = re.sub(r'(<nav aria-label="[^"]+"><a href="#destacados">[^<]+</a>)', r'\1<a href="#sitios-demo">%s</a>' % label, h, count=1)
        open(f, 'w', encoding='utf-8').write(h)

def build():
    for s in SD.SITES:
        d = os.path.join(HERE, s['slug']); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(page(s))
        open(os.path.join(d, 'site.css'), 'w', encoding='utf-8').write(site_css(s))
        open(os.path.join(d, 'site.js'), 'w', encoding='utf-8').write(SITE_JS)
    open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(gallery())
    import panel; panel.build(HERE, icon_svg, BASE)
    inject_portfolio()
    print('ok', len(SD.SITES), 'sitios + panel')

def gallery():
    import galeria
    return galeria.render(SD.SITES, esc, BASE)

if __name__ == '__main__':
    build()
