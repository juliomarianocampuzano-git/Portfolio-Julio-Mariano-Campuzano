# arte.py · ilustraciones SVG hechas a mano para los sitios demo (sin fotos de stock).
# Cada funcion devuelve un <svg> listo para insertar. Colores por parametro para que cada marca tenga su paleta.

def _svg(vb, body, label='', extra=''):
    a = ' role="img" aria-label="%s"' % label if label else ' aria-hidden="true"'
    return '<svg viewBox="%s" xmlns="http://www.w3.org/2000/svg"%s%s>%s</svg>' % (vb, a, extra, body)

# ---------- autos (vista lateral) ----------
CAR_BODY = {
    'sedan':  'M18 92 L22 74 Q30 66 52 64 L92 46 Q112 38 150 38 Q182 39 206 56 L238 64 Q256 68 258 82 L258 92 Z',
    'suv':    'M16 94 L18 66 Q22 56 40 54 L70 30 Q78 24 96 24 L196 24 Q212 24 220 36 L236 56 Q256 60 258 76 L258 94 Z',
    'pickup': 'M14 94 L16 70 Q20 60 36 58 L64 34 Q70 28 86 28 L134 28 Q146 28 150 40 L156 58 L250 58 Q258 58 258 66 L258 94 Z',
    'hatch':  'M20 92 L24 72 Q30 64 50 62 L86 38 Q98 30 130 30 L176 30 Q196 32 214 52 L236 62 Q254 66 256 80 L256 92 Z',
    'coupe':  'M16 90 L20 76 Q28 70 56 66 L104 44 Q124 36 156 38 Q190 42 214 60 L240 66 Q258 70 258 82 L258 90 Z',
}
CAR_GLASS = {
    'sedan':  'M98 50 Q114 44 146 44 L148 62 L82 62 Z M156 44 Q180 46 198 60 L156 62 Z',
    'suv':    'M80 32 Q86 30 98 30 L136 30 L136 52 L60 52 Z M146 30 L192 30 Q204 30 210 40 L222 52 L146 52 Z',
    'pickup': 'M74 36 Q80 34 90 34 L130 34 Q140 34 142 44 L146 56 L58 56 Z',
    'hatch':  'M94 40 Q104 36 128 36 L132 58 L72 60 Z M140 36 L172 36 Q190 38 204 54 L140 58 Z',
    'coupe':  'M110 48 Q128 42 152 44 L150 62 L92 64 Z M160 45 Q184 48 202 60 L158 62 Z',
}
def car(kind='sedan', color='#C8102E', bg=None, label=''):
    w = lambda x: ('<g><circle cx="%d" cy="94" r="20" fill="#16161A"/><circle cx="%d" cy="94" r="11" fill="#D9DDE3"/><circle cx="%d" cy="94" r="4" fill="#16161A"/></g>' % (x, x, x))
    body = ('<ellipse cx="138" cy="114" rx="122" ry="7" fill="#000" opacity=".16"/>'
            '<path d="%s" fill="%s"/><path d="%s" fill="#1B2233" opacity=".88"/>'
            '<path d="M24 80 L254 80" stroke="#fff" stroke-opacity=".22" stroke-width="2"/>'
            '<rect x="246" y="70" width="10" height="6" rx="2" fill="#FFF3C4"/><rect x="18" y="72" width="8" height="6" rx="2" fill="#FF3B3B"/>%s%s'
            % (CAR_BODY[kind], color, CAR_GLASS[kind], w(70), w(206)))
    return _svg('0 0 276 124', body, label)

# ---------- propiedades ----------
def house(kind='casa', c1='#0F766E', c2='#99F6E4', label=''):
    if kind == 'depto':
        rows = ''.join('<rect x="%d" y="%d" width="18" height="16" rx="2" fill="%s"/>' % (x, y, c2 if (x + y) % 3 else '#FDE68A') for y in range(40, 160, 26) for x in (62, 92, 122, 152))
        body = '<rect x="48" y="24" width="138" height="160" rx="6" fill="%s"/>%s<rect x="100" y="160" width="34" height="24" fill="#0B1F1C"/>' % (c1, rows)
    elif kind == 'lote':
        body = ('<path d="M20 160 L120 110 L220 160 L120 210Z" fill="%s" opacity=".35"/><path d="M20 160 L120 110 L220 160 L120 210Z" fill="none" stroke="%s" stroke-width="3" stroke-dasharray="8 6"/>'
                '<circle cx="80" cy="140" r="16" fill="%s"/><rect x="77" y="150" width="6" height="16" fill="#3F2E1E"/><circle cx="170" cy="150" r="12" fill="%s"/><rect x="167" y="158" width="6" height="12" fill="#3F2E1E"/>' % (c2, c1, c1, c1))
    else:
        body = ('<path d="M30 110 L120 46 L210 110 Z" fill="%s"/><rect x="48" y="104" width="144" height="86" fill="%s"/>'
                '<rect x="66" y="124" width="34" height="30" rx="3" fill="#FDE68A"/><rect x="140" y="124" width="34" height="30" rx="3" fill="#FDE68A"/><rect x="104" y="144" width="32" height="46" fill="#0B1F1C"/>'
                '<rect x="160" y="62" width="16" height="30" fill="%s"/>' % (c1, c2, c1))
    return _svg('0 0 240 220', body, label)

# ---------- destinos ----------
def trip(kind='montana', c1='#0EA5E9', c2='#F97316', label=''):
    sky = '<rect width="240" height="180" fill="%s" opacity=".18"/><circle cx="182" cy="48" r="22" fill="%s"/>' % (c1, c2)
    if kind == 'playa':
        b = sky + '<path d="M0 118 Q60 106 120 118 T240 118 V180 H0Z" fill="%s"/><path d="M0 140 Q60 130 120 140 T240 140 V180 H0Z" fill="#FCD9A8"/><path d="M60 140 Q66 100 82 80" stroke="#7C4A1E" stroke-width="5" fill="none"/><path d="M82 80 q-26 -4 -36 10 M82 80 q-10 -20 -30 -18 M82 80 q16 -16 34 -10 M82 80 q20 2 26 16" stroke="#15803D" stroke-width="6" fill="none" stroke-linecap="round"/>' % c1
    elif kind == 'cataratas':
        b = sky + '<path d="M0 70 H240 V180 H0Z" fill="#166534"/><path d="M70 70 H170 L176 150 H64Z" fill="#E0F2FE"/><path d="M84 70 V150 M104 70 V150 M124 70 V150 M144 70 V150 M160 70 V150" stroke="%s" stroke-width="3" opacity=".5"/><ellipse cx="120" cy="156" rx="70" ry="12" fill="#fff" opacity=".8"/>' % c1
    elif kind == 'ciudad':
        bld = ''.join('<rect x="%d" y="%d" width="26" height="%d" fill="%s"/>' % (10 + i * 30, 180 - h, h, c1 if i % 2 else '#1E293B') for i, h in enumerate([70, 110, 86, 130, 96, 120, 80, 100]))
        b = sky + bld
    else:
        b = sky + '<path d="M0 150 L60 70 L100 120 L150 50 L240 150 V180 H0Z" fill="%s"/><path d="M150 50 L134 72 L150 66 L164 74Z" fill="#fff"/><path d="M0 162 Q120 140 240 162 V180 H0Z" fill="#15803D"/>' % c1
    return _svg('0 0 240 180', b, label)

# ---------- prendas ----------
def garment(kind='remera', color='#BE185D', label=''):
    p = {
        'remera': 'M60 30 L90 18 Q120 34 150 18 L180 30 L210 70 L180 86 L172 74 L172 190 L68 190 L68 74 L60 86 L30 70Z',
        'vestido': 'M96 16 L144 16 L150 60 Q190 140 200 196 L40 196 Q50 140 90 60Z',
        'campera': 'M64 26 L100 16 L120 30 L140 16 L176 26 L204 80 L204 192 L36 192 L36 80Z',
        'pantalon': 'M70 16 L170 16 L178 196 L132 196 L120 76 L108 196 L62 196Z',
    }[kind]
    seam = {'campera': '<path d="M120 30 V192" stroke="#000" stroke-opacity=".25" stroke-width="3"/>', 'remera': '<path d="M100 22 Q120 40 140 22" stroke="#000" stroke-opacity=".2" stroke-width="3" fill="none"/>'}.get(kind, '')
    return _svg('0 0 240 210', '<path d="%s" fill="%s"/>%s' % (p, color, seam), label)

# ---------- mapa estilizado ----------
def mapa(c1, bg):
    return _svg('0 0 400 200', ('<rect width="400" height="200" fill="%s"/>'
                '<path d="M0 60 H400 M0 140 H400 M90 0 V200 M230 0 V200 M320 0 V200" stroke="#fff" stroke-width="10"/>'
                '<path d="M0 100 Q120 80 200 110 T400 90" stroke="#fff" stroke-width="16" fill="none"/>'
                '<rect x="110" y="16" width="100" height="34" rx="6" fill="#fff" opacity=".5"/><rect x="250" y="150" width="56" height="40" rx="6" fill="#fff" opacity=".5"/>'
                '<path d="M200 66 c-14 0 -24 10 -24 23 c0 18 24 39 24 39 s24 -21 24 -39 c0 -13 -10 -23 -24 -23z" fill="%s"/><circle cx="200" cy="89" r="8" fill="#fff"/>') % (bg, c1))

# ---------- iconografia grande para heroes ----------
def tooth(c1='#0EA5E9', label='Diente sano y brillante'):
    return _svg('0 0 240 260', ('<defs><linearGradient id="tg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#E0F2FE"/></linearGradient></defs>'
                '<circle cx="120" cy="124" r="112" fill="%s" opacity=".12"/>'
                '<path d="M64 44 Q92 26 120 46 Q148 26 176 44 Q206 66 192 120 Q180 166 170 214 Q164 236 150 222 Q138 206 132 170 Q126 150 120 150 Q114 150 108 170 Q102 206 90 222 Q76 236 70 214 Q60 166 48 120 Q34 66 64 44Z" fill="url(#tg)" stroke="%s" stroke-width="5"/>'
                '<path d="M82 70 Q96 60 108 70" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none"/>'
                '<g fill="%s"><path d="M196 40 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z"/><path d="M40 170 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z" opacity=".7"/></g>') % (c1, c1, c1), label)

def cup(c1='#92400E', c2='#FEF3C7', label='Taza de café humeante'):
    steam = ''.join('<path class="steam" d="M%d 70 q-14 -18 0 -36 t0 -36" stroke="%s" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55" style="animation-delay:%ss"/>' % (x, c1, d) for x, d in ((96, 0), (124, .6), (152, 1.2)))
    return _svg('0 0 260 260', ('<circle cx="130" cy="150" r="104" fill="%s"/>%s'
                '<path d="M60 96 H200 L188 200 Q184 222 160 222 H100 Q76 222 72 200Z" fill="%s"/><path d="M198 116 q40 0 40 34 t-46 36" stroke="%s" stroke-width="14" fill="none"/>'
                '<ellipse cx="130" cy="98" rx="70" ry="12" fill="#3B1D0B"/><path d="M96 150 q34 -26 68 0 q-34 26 -68 0z" fill="%s" opacity=".9"/>') % (c2, steam, c1, c1, c2), label)

def paw(c='#0D9488'):
    return _svg('0 0 100 100', '<g fill="%s"><ellipse cx="50" cy="66" rx="22" ry="18"/><ellipse cx="24" cy="42" rx="9" ry="12"/><ellipse cx="42" cy="28" rx="9" ry="12"/><ellipse cx="60" cy="28" rx="9" ry="12"/><ellipse cx="78" cy="42" rx="9" ry="12"/></g>' % c)

def scales(c1='#B45309', c2='#1E3A8A', label='Balanza de la justicia'):
    return _svg('0 0 320 300', ('<g fill="none" stroke="%s" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="draw">'
                '<path d="M160 30 V250 M100 262 H220 M120 250 H200"/><path d="M60 70 H260"/><circle cx="160" cy="30" r="10"/>'
                '<path d="M80 70 L40 160 M80 70 L120 160 M240 70 L200 160 M240 70 L280 160"/></g>'
                '<path d="M34 160 Q80 200 126 160Z M194 160 Q240 200 286 160Z" fill="%s"/>') % (c2, c1), label)

def chart(c1='#2563EB', c2='#059669', label='Tablero con ingresos y gastos'):
    bars = ''.join('<rect class="bar" x="%d" y="%d" width="22" height="%d" rx="4" fill="%s" style="--d:%ss"/>' % (40 + i * 38, 200 - h, h, c1 if i % 2 == 0 else c2, i * .08) for i, h in enumerate([60, 90, 74, 120, 104, 150, 136, 170]))
    return _svg('0 0 360 240', ('<rect width="360" height="240" rx="20" fill="#fff"/><path d="M30 200 H340" stroke="#E2E8F0" stroke-width="2"/>%s'
                '<path class="line" d="M50 150 L88 128 L126 136 L164 98 L202 106 L240 70 L278 78 L316 44" stroke="#0F172A" stroke-width="3" fill="none" stroke-linecap="round"/>'
                '<circle cx="316" cy="44" r="6" fill="#0F172A"/><text x="30" y="34" font-family="system-ui" font-size="15" font-weight="700" fill="#0F172A">Flujo de caja</text>') % bars, label)

def solar_panel(c1='#059669', c2='#FDB813', label='Paneles solares'):
    cells = ''.join('<rect x="%d" y="%d" width="38" height="26" fill="#1E3A8A" stroke="#93C5FD" stroke-width="1.5"/>' % (40 + x * 42, 60 + y * 30) for y in range(3) for x in range(5))
    return _svg('0 0 300 230', ('<g transform="skewX(-14) translate(30 0)">%s</g><path d="M120 150 V210 M180 150 V210" stroke="#334155" stroke-width="8"/><path d="M60 214 H240" stroke="%s" stroke-width="8" stroke-linecap="round"/>') % (cells, c1), label)

def shield(c1='#0369A1', c2='#16A34A', label='Escudo de protección'):
    return _svg('0 0 260 280', ('<circle cx="130" cy="140" r="120" fill="%s" opacity=".1"/><path d="M130 20 L222 56 V130 Q222 214 130 258 Q38 214 38 130 V56Z" fill="%s"/>'
                '<path d="M130 44 L200 72 V132 Q200 196 130 232Z" fill="#fff" opacity=".14"/><path class="draw" d="M86 140 L118 172 L180 104" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>') % (c2, c1), label)

def pizza(label='Pizza recién salida del horno'):
    pep = ''.join('<circle cx="%d" cy="%d" r="13" fill="#B91C1C"/><circle cx="%d" cy="%d" r="4" fill="#7F1D1D" opacity=".6"/>' % (x, y, x - 3, y - 3) for x, y in ((90, 90), (150, 80), (120, 140), (170, 150), (80, 160), (140, 196), (196, 110)))
    olv = ''.join('<circle cx="%d" cy="%d" r="6" fill="#1C1917"/><circle cx="%d" cy="%d" r="2.4" fill="#57534E"/>' % (x, y, x, y) for x, y in ((112, 110), (176, 186), (100, 196), (200, 150), (140, 60)))
    bas = ''.join('<path d="M%d %d q10 -14 20 0 q-10 8 -20 0z" fill="#15803D"/>' % (x, y) for x, y in ((128, 98), (60, 128), (160, 124), (110, 170), (186, 84)))
    return _svg('0 0 260 260', '<circle cx="130" cy="130" r="124" fill="#E8A956"/><circle cx="130" cy="130" r="108" fill="#C2410C"/><circle cx="130" cy="130" r="104" fill="#FCD34D"/>%s%s%s' % (pep, olv, bas), label)

def pulse(c='#F97316'):
    return _svg('0 0 1200 160', '<path class="draw" d="M0 90 H380 L420 90 L450 20 L490 150 L520 60 L545 100 L560 90 H1200" stroke="%s" stroke-width="6" fill="none" stroke-linejoin="round"/>' % c, '', ' preserveAspectRatio="none" style="width:100%;height:120px"')

def plane_route(c1='#0EA5E9', c2='#F97316'):
    return _svg('0 0 600 300', ('<path class="draw" d="M40 250 C160 40 380 300 560 60" stroke="%s" stroke-width="4" stroke-dasharray="10 10" fill="none"/>'
                '<circle cx="40" cy="250" r="10" fill="%s"/><circle cx="560" cy="60" r="12" fill="%s"/>'
                '<g class="plane"><path d="M0 -6 L22 0 L0 6 L4 0Z M6 -2 L-2 -16 L4 -16 L14 -2Z M6 2 L-2 16 L4 16 L14 2Z" fill="#fff"/></g>') % (c1, c1, c2), '', ' style="width:100%;height:auto;overflow:visible"')

def barber_pole():
    return ('<div class="pole" aria-hidden="true"><span class="cap"></span><span class="glass"><span class="stripes"></span></span><span class="cap"></span></div>')

def building(c1='#171717', c2='#A16207'):
    fl = ''.join('<rect x="70" y="%d" width="160" height="22" fill="%s"/>' % (40 + i * 30, c1 if i % 3 else c2) for i in range(7))
    return _svg('0 0 300 280', '<rect x="60" y="30" width="180" height="230" fill="#E7E5E4"/>%s<rect x="30" y="256" width="240" height="8" fill="%s"/>' % (fl, c1))

# ---------- maquetas de apps ----------
def app_vet(c1, c2):
    days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']
    ev = [(0, 0, 'Luna · vacuna'), (1, 1, 'Toby · control'), (2, 0, 'Milo · baño'), (3, 2, 'Nala · cirugía'), (4, 1, 'Rocky · rayos'), (0, 2, 'Simba · consulta'), (2, 3, 'Coco · vacuna')]
    cells = ''.join('<div class="ev" style="grid-column:%d;grid-row:%d;--c:%s"><b>%s</b><small>%s</small></div>' % (d + 2, r + 2, c1 if (d + r) % 2 else c2, t.split(' · ')[0], t.split(' · ')[1]) for d, r, t in ev)
    head = ''.join('<span class="dh" style="grid-column:%d">%s</span>' % (i + 2, d) for i, d in enumerate(days))
    hrs = ''.join('<span class="hh" style="grid-row:%d">%s</span>' % (i + 2, h) for i, h in enumerate(['09:00', '10:30', '12:00', '16:00']))
    return '<div class="appwin" data-tilt><div class="aw-h"><div class="dots"><i></i><i></i><i></i></div><b>Agenda de la semana</b><span class="badge ok">7 turnos</span></div><div class="aw-grid">%s%s%s</div></div>' % (head, hrs, cells)

def app_portal(c1):
    return ('<div class="appwin portal"><div class="aw-h"><div class="dots"><i></i><i></i><i></i></div><b>Portal del paciente</b><span class="badge info">En línea</span></div>'
            '<div class="pt-grid"><aside><div class="av big">MG</div><b>María González</b><small>Obra social · Plan 210</small><ul><li class="on">Mis turnos</li><li>Recetas</li><li>Estudios</li><li>Historia</li></ul></aside>'
            '<div><p class="lbl">Próximo turno</p><div class="pt-card"><b>Jue 14 · 10:30</b><span>Dra. Paula Ríos · Clínica médica</span><span class="badge ok">Confirmado</span></div>'
            '<p class="lbl">Recetas activas</p><div class="pt-row"><span>Losartán 50 mg</span><span class="badge info">PDF</span></div><div class="pt-row"><span>Atorvastatina 10 mg</span><span class="badge info">PDF</span></div>'
            '<p class="lbl">Resultados</p><div class="pt-row"><span>Laboratorio completo</span><span class="badge ok">Listo</span></div></div></div></div>')

def dash_kpis(c1, c2):
    return ('<div class="appwin dash" data-tilt><div class="aw-h"><div class="dots"><i></i><i></i><i></i></div><b>Tu estudio, al día</b><span class="badge ok">Sin deudas</span></div>'
            '<div class="dk"><div><small>Facturado este mes</small><b>$ 4.820.000</b></div><div><small>IVA a pagar</small><b>$ 312.400</b></div><div><small>Próximo vencimiento</small><b>en 6 días</b></div></div>%s</div>' % chart(c1, c2))
