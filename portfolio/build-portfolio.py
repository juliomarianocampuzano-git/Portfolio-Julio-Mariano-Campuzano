#!/usr/bin/env python3
"""Arma /portfolio dentro de la web a partir del portfolio original (carpeta ../../portfolio-original).
- Copia fichas, demos, CV y licencias.
- Aplica la marca nueva a las 134 fichas (logo, estados, scripts sin codigo en linea para respetar la CSP).
- Genera las portadas index.html (ES) y en/index.html (EN) con el diseno nuevo.
Uso: python portfolio/build-portfolio.py"""
import os,re,shutil,json,html
here=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.normpath(os.path.join(here,'..','..','portfolio-original'))
KEEP={'styles.css','portfolio.js','build-portfolio.py','contenido.py','__pycache__'}
import sys;sys.path.insert(0,here);import contenido as C

ICON='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M16 8h34a9 9 0 0 1 9 9v25a9 9 0 0 1-9 9H30l-11 9v-9h-3a9 9 0 0 1-9-9V17a9 9 0 0 1 9-9z" fill="#1C1433"/><path d="M13 5h34a9 9 0 0 1 9 9v25a9 9 0 0 1-9 9H27l-11 9v-9h-3a9 9 0 0 1-9-9V14a9 9 0 0 1 9-9z" fill="#FF6B2C" stroke="#1C1433" stroke-width="3" stroke-linejoin="round"/><path d="M18 39V20l12 13 12-13v19" fill="none" stroke="#fff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="52" cy="11" r="7" fill="#FFC53D" stroke="#1C1433" stroke-width="3"/></svg>'
def brand(href,en):return '<a class="brand" href="%s">%s<b>Mariano Campuzano<small>%s</small></b></a>'%(href,ICON,'Portfolio')

# estados: mismo dato, etiqueta en positivo y verdadera (todas las fichas tienen demo funcionando en el navegador)
ST={'es':{'cliente':'Entregado a cliente','local':'Herramienta funcionando','mvp':'MVP funcionando','piloto':'En piloto','prototipo':'Prototipo funcional','desarrollo':'En desarrollo','idea':'Concepto con demo'},
    'en':{'cliente':'Delivered to client','local':'Working tool','mvp':'Working MVP','piloto':'In pilot','prototipo':'Working prototype','desarrollo':'In development','idea':'Concept with demo'}}
ST_ORDER=['cliente','mvp','local','piloto','prototipo','desarrollo','idea']
CAT_REN={'Ideas por documentar':'Laboratorio','Ideas to define':'Lab'}

def libs(prefix):
    return ''.join('<script defer src="%sassets/libs/%s"></script>'%(prefix,f) for f in ('gsap.min.js','ScrollTrigger.min.js','Flip.min.js','SplitText.min.js','lenis.min.js','confetti.min.js'))

def copy_tree():
    for name in os.listdir(here):
        if name in KEEP:continue
        p=os.path.join(here,name)
        shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    for r,ds,fs in os.walk(SRC):
        rel=os.path.relpath(r,SRC)
        os.makedirs(os.path.join(here,rel),exist_ok=True)
        for f in fs:
            if rel=='.' and f in ('styles.css','foundation.css','app.js','index.html','favicon.svg','DEPLOY-CLOUDFLARE.txt'):continue
            if rel=='en' and f=='index.html':continue
            shutil.copy2(os.path.join(r,f),os.path.join(here,rel,f))
    shutil.copy2(os.path.join(here,'..','favicon.svg'),os.path.join(here,'favicon.svg'))

def patch_demo():
    p=os.path.join(here,'demo.js');s=open(p,encoding='utf-8').read()
    s=s.replace("const cfg=window.DEMO_CONFIG,","const cfg=window.DEMO_CONFIG||(()=>{try{return JSON.parse(document.getElementById('demo-app').dataset.config)}catch(e){return null}})(),",1)
    s=s.replace('<h4 style="margin-top:25px">','<h4 class="mt-25">').replace('<p style="white-space:pre-wrap">','<p class="pre-wrap">')
    assert 'style=' not in s and 'dataset.config' in s
    open(p,'w',encoding='utf-8').write(s)

def patch_details(lang):
    d=os.path.join(here,'projects') if lang=='es' else os.path.join(here,'en','projects')
    up='../../' if lang=='es' else '../../../'
    E=lang=='en';k=1 if E else 0
    for f in os.listdir(d):
        p=os.path.join(d,f);pid=f[:-5]
        if pid in C.OCULTOS:os.remove(p);continue
        s=open(p,encoding='utf-8').read()
        if pid in C.CLIENTES_EXTRA:s=re.sub(r'<span class="status \w+">','<span class="status cliente">',s,count=1)
        st=re.search(r'<span class="status (\w+)">',s).group(1)
        if pid in C.DESC:
            dd=html.escape(C.DESC[pid][k],quote=True)
            s=re.sub(r'(<meta (?:name|property)="(?:og:)?description" content=")[^"]*"',lambda m:m.group(1)+dd+'"',s)
            s=re.sub(r'(<section class="detail-hero.*?)<p class="lead">.*?</p>',lambda m:m.group(1)+'<p class="lead">%s</p>'%C.DESC[pid][k],s,count=1,flags=re.S)
        def retag(m):
            raw=[html.unescape(t) for t in re.findall(r'<span>(.*?)</span>',m.group(0))]
            return '<div class="tags">%s</div>'%''.join('<span>%s</span>'%html.escape(t) for t in C.tags(raw,E,eng))
        cfg0=re.search(r'"engine":\s*"(\w+)"',s);eng=cfg0.group(1) if cfg0 else ''
        s=re.sub(r'<div class="tags">.*?</div>',retag,s,count=1,flags=re.S)
        g=re.search(r'<section class="wrap detail-grid">.*?</section>',s,re.S)
        hint=re.search(r'<h2>(?:Qué podés probar aquí|What you can try here)</h2><p>(.*?)</p>',g.group(0)).group(1)
        res=C.RESUELVE.get(eng,C.RESUELVE['brief'])[k]
        grid=('<section class="wrap detail-grid"><div><h2>%s</h2><ul>%s</ul><p class="small reserva">%s</p></div><aside><h2>%s</h2><p>%s</p><h2>%s</h2><p>%s</p></aside></section>')%(
            'What it solves' if E else 'Qué resuelve',''.join('<li>%s</li>'%x for x in res),C.RESERVA[k],
            'Project status' if E else 'Estado del proyecto',C.ESTADO[st][k],'What you can try here' if E else 'Qué podés probar aquí',hint)
        s=s.replace(g.group(0),grid)
        s=re.sub(r'<p class="scope-note">.*?</p>','<p class="scope-note">%s</p>'%('Demo with sample data: it shows the result, not the internal implementation.' if E else 'Demo con datos de ejemplo: muestra el resultado, no la implementación interna.'),s,count=1)
        for h in C.OCULTOS:s=re.sub(r'<a class="btn" href="%s\.html">[^<]*</a>'%re.escape(h),'',s)
        s=s.replace('<meta name="theme-color" content="#0a192f">','<meta name="theme-color" content="#FF6B2C">').replace('href="../styles.css">','href="../styles.css?v=7">').replace('href="../../styles.css">','href="../../styles.css?v=7">')
        s=re.sub(r'<a class="brand" href="([^"]+)">JMC<span>\.</span></a>',lambda m:brand(m.group(1),lang=='en'),s)
        home='<a class="home-link" href="%sindex.html">%s</a>'%(up,'Web principal' if lang=='es' else 'Main site')
        s=s.replace('<nav aria-label="Navegación">','<nav aria-label="Navegación">'+home).replace('<nav aria-label="Navigation">','<nav aria-label="Navigation">'+home)
        s=re.sub(r'<span class="status (\w+)">[^<]*</span>',lambda m:'<span class="status %s">%s</span>'%(m.group(1),ST[lang][m.group(1)]),s)
        for a,b in CAT_REN.items():s=s.replace('<p class="eyebrow">%s</p>'%a,'<p class="eyebrow">%s</p>'%b)
        m=re.search(r'<script>window\.DEMO_CONFIG=(\{.*?\});</script>',s)
        if m:
            cfg=json.loads(m.group(1));s=s.replace(m.group(0),'')
            s=s.replace('<div id="demo-app"','<div id="demo-app" data-config="%s"'%html.escape(json.dumps(cfg,ensure_ascii=False),quote=True),1)
        s=s.replace('<script defer src="../app.js"></script>','').replace('<script defer src="../../app.js"></script>','')
        s=s.replace('</body>',libs(up)+'<script defer src="%sportfolio.js?v=7"></script></body>'%('../' if lang=='es' else '../../'))
        s=s.replace('<footer class="wrap"><span>Julio Mariano Campuzano</span>','<footer class="wrap"><span>Julio Mariano Campuzano · Posadas, Misiones</span><span>Animaciones: GSAP, Lenis y canvas-confetti</span>')
        assert '<script>' not in s and 'style="' not in s,(f,'inline')
        open(p,'w',encoding='utf-8').write(s)

def load(lang):
    data=json.load(open(os.path.join(here,'..','..','proj-%s.json'%lang),encoding='utf-8'))
    k=1 if lang=='en' else 0;out=[]
    for x in data:
        if x['id'] in C.OCULTOS:continue
        x['cat']=CAT_REN.get(html.unescape(x['cat']),html.unescape(x['cat']))
        if x['id'] in C.CLIENTES_EXTRA:x['st']='cliente'
        if x['id'] in C.DESC:x['desc']=C.DESC[x['id']][k]
        x['tags']=[html.escape(t) for t in C.tags([html.unescape(t) for t in x['tags']],lang=='en',x['engine'])]
        out.append(x)
    return out

CREDS=[('c2','<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>','Automatización con IA','','AI automation',''),
       ('c1','<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>','Data Analyst','','Data Analyst',''),
       ('c3','<path d="M3 21l4-1 12-12-3-3L4 17zM14 6l3 3"/>','Diseñador web','','Web designer',''),
       ('c4','<path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6"/>','Ingeniería en Inteligencia Artificial','','Artificial Intelligence Engineering','')]
def creds(E):
    li=''
    for c,ic,t,sm,te,se in CREDS:
        t,sm=(te,se) if E else (t,sm)
        li+='<li class="%s"><i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">%s</svg></i><span><b>%s</b>%s</span></li>'%(c,ic,t,'<small>%s</small>'%sm if sm else '')
    return '<ul class="creds" aria-label="%s">%s</ul>'%('Education' if E else 'Formación',li)

def build_index(lang):
    E=lang=='en';src=open(os.path.join(SRC,'index.html' if not E else 'en/index.html'),encoding='utf-8').read()
    data=load(lang);cats=[];[cats.append(x['cat']) for x in data if x['cat'] not in cats]
    T=(lambda a,b:b if E else a)
    up='../' if not E else '../../'
    pre='' if not E else ''
    tail=src[src.index('<section class="profile-block"'):src.index('</main>')]
    for a,b in [('Combino desarrollo junior en Python, SQL y automatización con experiencia','Combino análisis de datos, automatización con IA y diseño web con experiencia'),
                ('I combine junior Python, SQL and automation development with experience','I combine data analysis, AI automation and web design with experience'),
                ('<li>Ingeniería en Inteligencia Artificial · En curso</li>','<li>Ingeniería en Inteligencia Artificial</li>'),
                ('<li>Artificial Intelligence Engineering · In progress</li>','<li>Artificial Intelligence Engineering</li>'),
                ('Busco oportunidades junior en automatización, IA y análisis de datos','Busco oportunidades en análisis de datos, automatización con IA y diseño web'),
                ('Seeking junior opportunities in automation, AI and data analysis','Seeking opportunities in data analysis, AI automation and web design'),
                ('<span>n8n</span><span>RAG</span><span>APIs REST</span><span>PostgreSQL</span><span>Supabase</span>','<span>Automatización con IA</span><span>Diseño web</span><span>Dashboards</span>')]:
        tail=tail.replace(a,b)
    tail=tail.replace('<li>Coderhouse: Data Analyst y AI Automation · Finalizados</li>','<li>Data Analyst y Automatización con IA</li>').replace('<li>Coderhouse: Data Analyst &amp; AI Automation · Completed</li>','<li>Data Analyst &amp; AI automation</li>')
    tail=tail.replace('<h2>Automatización con criterio<br>y contexto de negocio.</h2>','<h2>Automatización con IA,<br>con criterio de negocio.</h2>').replace('<h2>Automation with context<br>and business understanding.</h2>','<h2>AI automation<br>with business sense.</h2>')
    i=tail.index('<div class="tags">');tail=tail[:i]+'<p class="creds-h">%s</p>'%T('Formación','Education')+creds(E)+tail[i:]
    feat_ids=['casa-amin','knowbase','habibs','dataflow','hotel1609','whatsapp-crm']
    byid={x['id']:x for x in data}
    def esc(s):return s  # los textos vienen del HTML original ya escapados
    def card(x,i):
        c=cats.index(x['cat'])%8
        search=html.escape(html.unescape(' '.join([x['name'],x['desc'],x['cat'],ST[lang][x['st']],' '.join(x['tags']),x['hint']])),quote=True)
        tags=''.join('<span>%s</span>'%t for t in x['tags'][:4])
        return ('<article class="p-card" id="%s" data-c="%d" data-cat="%s" data-st="%s" data-search="%s"><div class="top"><span class="cat">%s</span><span class="status %s">%s</span></div>'
                '<h3>%s</h3><p>%s</p><div class="tags">%s</div><div class="row"><a href="projects/%s.html">%s</a><a class="demo" href="projects/%s.html#demo">%s</a></div></article>')%(
                x['id'],c,html.escape(x['cat'],quote=True),x['st'],search,html.escape(x['cat']),x['st'],ST[lang][x['st']],x['name'],x['desc'],tags,x['id'],T('Ver ficha','Case study'),x['id'],T('Probar demo','Try demo'))
    def bento(x,i):
        tags=''.join('<span>%s</span>'%t for t in x['tags'][:4])
        return '<a href="projects/%s.html"><span class="st">%s</span><h3>%s</h3><p>%s</p><div class="tags">%s</div><span class="go" aria-hidden="true">&#8599;</span><span class="big-n" aria-hidden="true">0%d</span></a>'%(x['id'],ST[lang][x['st']],x['name'],x['desc'],tags,i+1)
    n_cli=sum(1 for x in data if x['st']=='cliente')
    sts=[s for s in ST_ORDER if any(x['st']==s for x in data)]
    tick=T(['Automatización con IA','Asistentes de WhatsApp','Análisis de datos','Python','SQL','Power BI','Dashboards','WhatsApp','Datos limpios','JavaScript'],['AI automation','WhatsApp assistants','Data analysis','Python','SQL','Power BI','Dashboards','WhatsApp','Clean data','JavaScript'])
    ticker=''.join('<span>%s</span>'%w for w in tick*2)
    doc='''<!doctype html><html lang="%(lang)s"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#FF6B2C">
<title>%(title)s</title><meta name="description" content="%(desc)s"><meta property="og:title" content="%(title)s"><meta property="og:description" content="%(desc)s"><meta property="og:type" content="website"><meta property="og:image" content="%(up)sassets/img/og.jpg">
<link rel="icon" href="%(fav)sfavicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="%(up)sapple-touch-icon.png"><link rel="preload" href="%(up)sassets/fonts/bricolage.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="%(fav)sstyles.css?v=7"></head>
<body data-lang="%(lang)s"><a class="skip" href="#main">%(skip)s</a>
<header><div class="nav">%(brand)s<nav aria-label="%(navl)s"><a href="#destacados">%(n1)s</a><a href="#catalogo">%(n2)s</a><a href="#perfil">%(n3)s</a><a class="home-link" href="%(up)sindex.html">%(n5)s</a><a class="nav-contact" href="#contacto">%(n4)s</a></nav><a class="language" href="%(other)s" lang="%(olang)s">%(olab)s<span>%(oname)s</span></a></div></header>
<main id="main">
<section class="p-hero"><div class="shapes" aria-hidden="true"><i class="s1"></i><i class="s2"></i><i class="s3"></i><i class="s4"></i><i class="s5"></i></div><div class="wrap">
<div><p class="role">%(role)s</p><h1>%(h1)s</h1><p class="lead">%(lead)s</p>
<div class="actions"><a class="btn primary" href="#catalogo">%(cta1)s</a><a class="btn" href="%(cv)s" download>%(cta2)s</a></div>
<div class="social"><a href="https://github.com/juliomarianocampuzano-git" target="_blank" rel="noopener">GitHub</a><a href="https://www.linkedin.com/in/juliomcampuzano" target="_blank" rel="noopener">LinkedIn</a><a href="mailto:juliomarianocampuzano@gmail.com">Email</a></div></div>
<aside class="p-board"><div class="num"><div><b>%(n)d</b><span>%(s1)s</span></div><div><b>%(ncli)d</b><span>%(s2)s</span></div><div><b>ES/EN</b><span>%(s3)s</span></div></div>
<ol aria-label="%(pl)s">%(probs)s</ol>
<a class="p-case" href="projects/knowbase.html#demo"><div><b>KnowBase</b><small>%(kbs)s</small></div><span>%(try)s</span></a></aside>
</div></section>
<div class="ticker" aria-hidden="true"><div class="ticker-row">%(ticker)s</div></div>
<section class="section wrap" id="destacados"><div class="section-heading"><div><p class="eyebrow">%(e1)s</p><h2>%(h2a)s</h2></div><p>%(p2a)s</p></div><div class="bento">%(bento)s</div></section>
<section class="section wrap" id="catalogo"><div class="section-heading"><div><p class="eyebrow">%(e2)s</p><h2>%(h2b)s</h2></div><p>%(p2b)s</p></div>
<div class="p-tools"><label class="p-search"><span class="sr">%(sl)s</span><input id="search" type="search" placeholder="%(sph)s" autocomplete="off"></label><p class="p-count" id="count" aria-live="polite">%(n)d / %(n)d</p></div>
<div class="chips" id="cats" role="group" aria-label="%(cl)s"><button type="button" aria-pressed="true" data-v="">%(all)s</button>%(catb)s</div>
<div class="chips st" id="states" role="group" aria-label="%(stl)s"><button type="button" aria-pressed="true" data-v="">%(alls)s</button>%(stb)s</div>
<div class="p-grid" id="grid">%(cards)s</div>
<div class="empty" id="empty" hidden><p>%(none)s</p><button class="btn" type="button" data-clear>%(clear)s</button></div>
<p class="small">%(note)s</p></section>
%(tail)s</main>
<footer class="wrap"><span>Julio Mariano Campuzano · Posadas, Misiones</span><span>%(credits)s</span><a href="https://brittanychiang.com" target="_blank" rel="noopener">%(bc)s</a><a href="%(up)sindex.html">%(n5)s</a></footer><div class="toast" role="status" aria-live="polite" hidden></div>
%(libs)s<script defer src="%(fav)sportfolio.js?v=7"></script></body></html>'''
    probs=re.findall(r'<li><span>\d+</span>([^<]+)</li>',src)
    v=dict(lang=lang,up=up,fav='' if not E else '../',brand=brand('index.html',E),libs=libs(up),n=len(data),ncli=n_cli,ticker=ticker,tail=tail,
      title=T('Julio Mariano Campuzano | Portfolio de automatización, IA y datos','Julio Mariano Campuzano | Automation, AI and data portfolio'),
      desc=T('%d proyectos de datos, automatización con IA y diseño web, cada uno con su ficha y una demo interactiva.'%len(data),'%d data, AI automation and web design projects, each with a case study and an interactive demo.'%len(data)),
      skip=T('Ir al contenido','Skip to content'),navl=T('Navegación','Navigation'),n1=T('Destacados','Featured'),n2=T('Proyectos','Projects'),n3=T('Perfil','Profile'),n4=T('Contacto','Contact'),n5=T('← Web principal','← Main site'),
      other='en/index.html' if not E else '../index.html',olang='en' if not E else 'es',olab='EN' if not E else 'ES',oname='English' if not E else 'Español',
      role=T('Julio Mariano Campuzano · Automatización con IA','Julio Mariano Campuzano · AI automation'),kbs=T('Respuestas con fuentes verificables','Answers with verifiable sources'),
      h1=T('Menos trabajo manual. <span class="hl">Más información</span> <span class="hl2">útil.</span>','Less manual work. <span class="hl">More useful</span> <span class="hl2">information.</span>'),
      lead=T('Automatizo procesos con inteligencia artificial: datos ordenados, tareas que se hacen solas y atención comercial más rápida.','I automate processes with artificial intelligence: organized data, tasks that run themselves and faster customer service.'),qual=re.search(r'<p class="qualification">(.*?)</p>',src).group(1),
      cta1=T('Explorar proyectos','Explore projects'),cta2=T('Descargar CV','Download resume'),cv='CV_Julio_Campuzano_ES.pdf' if not E else '../Resume_Julio_Campuzano_EN.pdf',
      s1=T('proyectos con demo','projects with demo'),s2=T('entregados a clientes','delivered to clients'),s3=T('fichas bilingües','bilingual case studies'),
      pl=T('Problemas que resuelvo','Problems I solve'),probs=''.join('<li>%s</li>'%x for x in probs),try_=None,
      e1=T('Para empezar','Start here'),h2a=T('Destacados<span>.</span>','Featured<span>.</span>'),p2a=T('Proyectos para clientes, herramientas en funcionamiento y demos para probar ahora.','Client projects, working tools and demos you can try right now.'),
      bento=''.join(bento(byid[i],k) for k,i in enumerate(feat_ids)),
      e2=T('El catálogo completo','The full catalog'),h2b=T('Todos los proyectos<span>.</span>','All projects<span>.</span>'),p2b=T('Filtrá por área o estado, o buscá por tecnología o problema.','Filter by area or status, or search by technology or problem.'),
      sl=T('Buscar proyectos','Search projects'),sph=T('Buscá: WhatsApp, Power BI, inmobiliaria…','Search: WhatsApp, Power BI, real estate…'),
      cl=T('Áreas','Areas'),all=T('Todas','All'),catb=''.join('<button type="button" aria-pressed="false" data-v="%s">%s</button>'%(html.escape(c,quote=True),html.escape(c)) for c in cats),
      stl=T('Estado','Status'),alls=T('Todos los estados','All statuses'),stb=''.join('<button type="button" aria-pressed="false" data-v="%s">%s</button>'%(s,ST[lang][s]) for s in sts),
      cards=''.join(card(x,i) for i,x in enumerate(data)),none=T('No hay proyectos con esa combinación.','No projects match that combination.'),clear=T('Limpiar filtros','Clear filters'),
      note=T('Cada ficha tiene una demo que funciona en el navegador con datos de ejemplo. El estado indica en qué punto está el proyecto original.','Every case study includes a demo that runs in the browser with sample data. The status shows where the original project stands.'),
      credits=T('Animaciones: GSAP, Lenis y canvas-confetti','Motion: GSAP, Lenis and canvas-confetti'),bc=T('Estructura base adaptada de Brittany Chiang (MIT)','Base structure adapted from Brittany Chiang (MIT)'))
    v['try']=T('Probar demo','Try demo')
    out=doc%v
    if E:out=out.replace('href="projects/','href="projects/')
    assert '<script>' not in out and 'style="' not in out
    open(os.path.join(here,'index.html' if not E else 'en/index.html'),'w',encoding='utf-8').write(out)

copy_tree();patch_demo();patch_details('es');patch_details('en');build_index('es');build_index('en')
print('ok')
