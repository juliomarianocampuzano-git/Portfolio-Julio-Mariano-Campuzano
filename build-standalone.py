#!/usr/bin/env python3
"""Genera mariano-web-v4-standalone.html: un solo archivo (CSS, JS, fuentes, librerias e imagenes en linea).
Sirve para MIRARLO o mandarlo por WhatsApp. Para publicar usa la carpeta (la CSP de _headers
no permite scripts ni estilos en linea). Uso: python build-standalone.py"""
import re,base64,os
here=os.path.dirname(os.path.abspath(__file__))
rd=lambda p:open(os.path.join(here,p),encoding='utf-8').read()
def b64(p,mime):return 'data:%s;base64,%s'%(mime,base64.b64encode(open(os.path.join(here,p),'rb').read()).decode())
s=rd('index.html')
s=re.sub(r'<link rel="preload"[^>]*>\n','',s)
def css(m):
    c=rd(m.group(1))
    c=re.sub(r'url\(\.\./fonts/([^)]+\.woff2)\)',lambda f:'url(%s)'%b64('assets/fonts/'+f.group(1),'font/woff2'),c)
    return '<style>'+c+'</style>'
s=re.sub(r'<link rel="stylesheet" href="(assets/css/[^"?]+)(?:\?[^"]*)?">',css,s)
s=re.sub(r'<script src="(assets/(?:js|libs)/[^"?]+)(?:\?[^"]*)?"( defer)?></script>',lambda m:'<script>'+rd(m.group(1)).replace('</script>','<\\/script>')+'</script>',s)
s=re.sub(r'src="(assets/img/[^"]+\.jpg)"',lambda m:'src="%s"'%b64(m.group(1),'image/jpeg'),s)
s=s.replace('<link rel="icon" href="favicon.svg" type="image/svg+xml">','<link rel="icon" href="%s" type="image/svg+xml">'%b64('favicon.svg','image/svg+xml'))
s=s.replace('<link rel="apple-touch-icon" href="apple-touch-icon.png">','')
s=s.replace('content="assets/img/og.jpg"','content="og.jpg"')
open(os.path.join(here,'mariano-web-v4-standalone.html'),'w',encoding='utf-8').write(s)
print('ok',len(s)//1024,'KB')
