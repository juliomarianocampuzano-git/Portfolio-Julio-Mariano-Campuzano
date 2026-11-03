# comun.py · atajos para armar secciones repetidas en los datos de los sitios.

def tok(**k):
    """Tokens CSS: tok(fg_strong='#000') -> {'--fg-strong': '#000'}."""
    return {'--' + a.replace('_', '-'): v for a, v in k.items()}

def foot(nav, extra=None):
    return [('Secciones', list(nav)), ('Este sitio', [('Volver arriba', 'top')] + (extra or []))]

def marquee(words, skew=False, speed=30, dir='l'):
    return dict(kind='marquee', id='mq', words=words, skew=skew, speed=speed, dir=dir)

def faq(qa, center=False, head=None, bg=None):
    d = dict(kind='faq', id='faq', qa=qa, center=center, head=head or {'eb': 'Preguntas frecuentes', 'h': 'Lo que más nos preguntan.'})
    if bg: d['bg'] = bg
    return d

def cta(h, p, btn, href='contacto', art=''):
    return dict(kind='cta', id='cta', h=h, p=p, btn=btn, href=href, art=art)

def contact(info, head=None, formT='Escribinos', msgL='Mensaje', btn='Enviar consulta', bg='alt'):
    return dict(kind='contact', id='contacto', bg=bg, info=info, head=head or {'eb': 'Contacto', 'h': 'Hablemos.'}, formT=formT, msgL=msgL, btn=btn)
