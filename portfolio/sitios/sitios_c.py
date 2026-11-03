# sitios_c.py · sitios 15 a 20. Negocios ficticios: nombres, precios y datos son de ejemplo.
import arte as A
from comun import tok, foot, contact, faq, cta, marquee

# 15 ─────────────────────────────── MODA
LOOK = lambda kind, col, bg: '<div style="background:%s;display:grid;place-items:center;aspect-ratio:3/4;padding:12%%">%s</div>' % (bg, A.garment(kind, col))
moda = dict(
    slug='telar-moda', name='Telar', rubro='Tienda de ropa', ref='#21 Fashion/E-commerce · Editorial Luxury + Exaggerated Minimalism',
    title='Telar | Ropa de diseño hecha en Argentina', desc='Tienda de moda demo con diseño editorial, catálogo filtrable con favoritos, carrito y pedido por WhatsApp.',
    tagline='Prendas de diseño en fibras naturales, hechas en talleres locales.',
    style='luxe', fonts={'d': 'Bodoni Moda', 'b': 'Jost', 'dw': '500', 'dfb': 'Georgia,serif'}, cart=True, split='rise',
    cfg={'cartTitle': 'Tu bolsa', 'orderIntro': 'Hola Telar! Quiero comprar:', 'checkout': 'Finalizar por WhatsApp', 'okOrder': 'Pedido enviado: te escribimos para coordinar el pago y el envío (demo).'},
    tokens=tok(bg='#FFFFFF', bg2='#F7F1F0', fg='#111111', fg_strong='#000000', muted='#5E5A58', primary='#111111', on_primary='#FFFFFF', primary_text='#111111',
               accent='#E8A0B4', on_accent='#111111', card='#FFFFFF', line='#E7E1DF', r='0px', r_lg='0px', r_btn='0px', track='-.03em', case='none',
               ink_bg='#111111', ink_fg='#FFFFFF', mq_bg='#F7F1F0', mq_fg='#111111', h1='clamp(3.4rem,11vw,11rem)'),
    logo={'shape': 'circle', 't': 'T', 'size': 22},
    nav=[('Colección', 'coleccion'), ('Lookbook', 'lookbook'), ('Talles', 'talles'), ('Contacto', 'contacto')], hdrCta=('Ver colección', 'coleccion'),
    hero=dict(type='editorial', eyebrow='Colección otoño · invierno', h1=['Vestir', 'despacio.'],
              lead='Lino, lana y algodón orgánico en cortes que duran más que una temporada. Elegí, sumá a tu bolsa y coordinamos por WhatsApp.',
              cta1=('Ver colección', 'coleccion'), cta2=('Lookbook', 'lookbook'), points=[('truck', 'Envíos a todo el país'), ('repeat', 'Cambios sin cargo'), ('leaf', 'Fibras naturales')],
              vis='<div class="ed-looks">%s%s</div>' % (LOOK('vestido', '#E8A0B4', '#F7F1F0'), LOOK('campera', '#111111', '#EDE6E3'))),
    css='''.hero--editorial h1{font-style:italic;letter-spacing:-.05em;line-height:.88}.ed-looks{display:grid;grid-template-columns:1fr 1fr;gap:14px}.ed-looks>div:nth-child(2){margin-top:48px}
.item .art{aspect-ratio:3/4!important}.item .art svg{width:70%}''',
    sections=[
        marquee(['Lino', 'Lana merino', 'Algodón orgánico', 'Hecho en Argentina', 'Talles reales'], speed=38),
        dict(kind='module', id='coleccion', mod='catalogo', layout='full', panel='Colección',
             head={'eb': 'Colección', 'h': 'Pocas prendas, muy bien hechas.', 'p': 'Filtrá por tipo, ordená por precio y sumá a tu bolsa. Guardá tus favoritos con el corazón.'},
             cfg={'cats': ['Vestidos', 'Abrigos', 'Básicos'], 'fav': True, 'cart': True, 'addLabel': 'Sumar', 'items': [
                 {'n': 'Vestido Lino Rosa', 'cat': 'Vestidos', 'p': 89000, 'svg': A.garment('vestido', '#E8A0B4'), 'bg': '#F7F1F0', 'tag': 'Nuevo', 'opt': 'Talle M', 'meta': [['leaf', 'Lino'], ['ruler', 'S a XL']]},
                 {'n': 'Campera Lana Negra', 'cat': 'Abrigos', 'p': 168000, 'svg': A.garment('campera', '#111111'), 'bg': '#EDE6E3', 'opt': 'Talle M', 'meta': [['leaf', 'Lana merino'], ['ruler', 'S a XXL']]},
                 {'n': 'Remera Orgánica Hueso', 'cat': 'Básicos', 'p': 32000, 'svg': A.garment('remera', '#E7DCCB'), 'bg': '#F7F1F0', 'opt': 'Talle M', 'meta': [['leaf', 'Algodón orgánico'], ['ruler', 'XS a XXL']]},
                 {'n': 'Pantalón Sastre Gris', 'cat': 'Básicos', 'p': 76000, 'svg': A.garment('pantalon', '#6B6B6B'), 'bg': '#EDE6E3', 'opt': 'Talle 40', 'meta': [['leaf', 'Lana fría'], ['ruler', '36 a 48']]},
                 {'n': 'Vestido Midi Negro', 'cat': 'Vestidos', 'p': 98000, 'svg': A.garment('vestido', '#111111'), 'bg': '#F7F1F0', 'tag': 'Favorito', 'opt': 'Talle S', 'meta': [['leaf', 'Viscosa'], ['ruler', 'S a XL']]},
                 {'n': 'Campera Rosa Empolvado', 'cat': 'Abrigos', 'p': 154000, 'svg': A.garment('campera', '#D98CA2'), 'bg': '#EDE6E3', 'opt': 'Talle L', 'meta': [['leaf', 'Paño de lana'], ['ruler', 'S a XL']]}]}),
        dict(kind='gallery', id='lookbook', bg='alt', head={'eb': 'Lookbook', 'h': 'Cómo lo usamos.'}, layout='grid3', tiles=[
            {'t': 'Look 01', 'm': 'Vestido lino + campera', 'bg': '#F7F1F0', 'art': A.garment('vestido', '#E8A0B4'), 'ratio': '3/4'},
            {'t': 'Look 02', 'm': 'Sastre + remera', 'bg': '#111111', 'art': A.garment('pantalon', '#EDE6E3'), 'ratio': '3/4'},
            {'t': 'Look 03', 'm': 'Abrigo + midi', 'bg': '#E8A0B4', 'art': A.garment('campera', '#111111'), 'ratio': '3/4'}]),
        dict(kind='split', id='talles', head={'eb': 'Talles reales', 'h': 'Medimos cada prenda, una por una.'},
             text=['Cada producto tiene su tabla con medidas reales en centímetros: largo, pecho, cintura y cadera.',
                   'Si no te queda, el primer cambio es sin cargo y lo retiramos por tu casa.'],
             bullets=[('ruler', 'Tabla de medidas en cada prenda'), ('repeat', 'Primer cambio gratis'), ('truck', 'Envío gratis desde $ 120.000')],
             art=LOOK('remera', '#E7DCCB', '#F7F1F0')),
        faq([('¿Hacen envíos?', 'Sí, a todo el país. En la ciudad entregamos en 24 h.'), ('¿Cómo pago?', 'Transferencia, tarjeta o efectivo al retirar en el showroom.'),
             ('¿Tienen local?', 'Un showroom con turno previo, de lunes a sábado.')]),
        contact([('map-pin', 'Showroom', 'Pasaje Textil 12 (con turno)'), ('clock', 'Horario', 'Lun a sáb · 11 a 19 h'), ('instagram', 'Instagram', '@telar.moda')], head={'eb': 'Contacto', 'h': 'Visitá el showroom.'}, formT='Pedí un turno o consultá', msgL='¿Qué prenda te interesa?'),
    ],
)
moda['footer'] = foot(moda['nav'])

# 16 ─────────────────────────────── INSTITUTO DE IDIOMAS
idiomas = dict(
    slug='kairos-idiomas', name='Kairos', rubro='Instituto de idiomas', ref='#16 Education/Language · Claymorphism + Playful',
    title='Kairos Idiomas | Inglés, portugués e italiano', desc='Instituto de idiomas demo: burbujas animadas en varios idiomas, test de nivel interactivo y planes de cursada.',
    tagline='Inglés, portugués e italiano en grupos chicos, presencial u online.',
    style='clay', fonts={'d': 'Lexend', 'b': 'Source Sans 3', 'dw': '800'}, vis=True, split='flip',
    tokens=tok(bg='#F5F3FF', bg2='#EDE9FE', fg='#1E1B4B', fg_strong='#110E35', muted='#4C4A73', primary='#4F46E5', on_primary='#FFFFFF', primary_text='#4338CA',
               accent='#F59E0B', on_accent='#1E1B4B', card='#FFFFFF', line='#DDD6FE', r='20px', r_lg='30px', r_btn='999px', track='-.04em', case='none',
               ink_bg='#4F46E5', ink_fg='#FFFFFF', mq_bg='#F59E0B', mq_fg='#1E1B4B', mq_bw='0', h1='clamp(2.8rem,7.4vw,6.8rem)'),
    logo={'shape': 'hex', 't': 'K', 'size': 20},
    nav=[('Cursos', 'cursos'), ('Test de nivel', 'test'), ('Planes', 'planes'), ('Contacto', 'contacto')], hdrCta=('Hacer el test', 'test'),
    hero=dict(type='full', eyebrow='Instituto de idiomas', h1=['Hablá otro', 'idioma este año.'],
              lead='Grupos de hasta ocho personas, profes que te hablan en el idioma desde la primera clase y un test para saber dónde empezar.',
              cta1=('Hacer el test de nivel', 'test'), cta2=('Ver planes', 'planes'), points=[('users', 'Grupos de hasta 8'), ('monitor', 'Presencial u online'), ('award', 'Preparación de exámenes')],
              vis='<canvas class="bg-canvas" data-vis="bubbles" data-c1="#4F46E5" data-c2="#16A34A" data-c3="#F59E0B" aria-hidden="true"></canvas>'),
    css='.hero--full{min-height:calc(100svh - 40px)}.hero--full .hero-copy{max-width:760px}.hero--full::after{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(55% 60% at 30% 55%,#F5F3FF 40%,transparent)}',
    sections=[
        marquee(['Hello', 'Olá', 'Ciao', 'Bonjour', 'Hallo', 'Hola'], speed=26),
        dict(kind='features', id='cursos', layout='bento', head={'eb': 'Cursos', 'h': 'Un curso para cada objetivo.'}, items=[
            {'i': 'messages-square', 't': 'Inglés conversacional', 'd': 'Para perder el miedo a hablar: situaciones reales, viajes y trabajo. Del nivel inicial al avanzado, con un profe nativo una vez por mes.'},
            {'i': 'briefcase', 't': 'Inglés para el trabajo', 'd': 'Reuniones, emails y entrevistas.'},
            {'i': 'sun', 't': 'Portugués', 'd': 'Ideal para viajar a Brasil.'},
            {'i': 'pizza', 't': 'Italiano', 'd': 'Ciudadanía, viajes y cultura.'},
            {'i': 'award', 't': 'Exámenes internacionales', 'd': 'Preparación para FCE, IELTS y CELPE-Bras.'},
            {'i': 'baby', 't': 'Kids y teens', 'd': 'Desde los 6 años, con juegos.'}]),
        dict(kind='module', id='test', mod='quiz', panel='Test de nivel de inglés', bg='alt',
             head={'eb': 'Test de nivel', 'h': '¿En qué nivel estás?', 'p': 'Seis preguntas rápidas. Al final te decimos tu nivel aproximado y en qué curso empezar.',
                   'bullets': [('clock', 'Menos de 2 minutos'), ('check', 'Resultado al instante'), ('gift', 'Primera clase de prueba gratis')]},
             cfg={'mode': 'score', 'cta': 'Reservar clase de prueba', 'okMsg': 'Clase de prueba reservada: te escribimos para coordinar el horario (demo).',
                  'levels': [[0, 'Inicial (A1)', 'Arrancás desde cero, ¡ideal para construir buenas bases!'], [2, 'Básico (A2)', 'Ya entendés frases simples: te falta soltura.'], [4, 'Intermedio (B1)', 'Te defendés bien: ahora toca ganar fluidez.'], [6, 'Intermedio alto (B2)', 'Muy bien: podés preparar un examen internacional.']],
                  'qs': [{'q': 'She ___ a doctor.', 'opts': ['are', 'is', 'am', 'be'], 'ok': 1},
                         {'q': 'I ___ to the cinema yesterday.', 'opts': ['go', 'gone', 'went', 'going'], 'ok': 2},
                         {'q': '¿Qué significa “I’m looking forward to it”?', 'opts': ['Lo estoy buscando', 'Tengo muchas ganas', 'Lo dejo para después', 'Ya lo vi'], 'ok': 1},
                         {'q': 'If I ___ more time, I would travel.', 'opts': ['have', 'had', 'will have', 'having'], 'ok': 1},
                         {'q': 'She has lived here ___ 2019.', 'opts': ['for', 'since', 'from', 'during'], 'ok': 1},
                         {'q': 'The report ___ by the manager last week.', 'opts': ['wrote', 'was written', 'has write', 'is writing'], 'ok': 1}]}),
        dict(kind='steps', id='metodo', head={'eb': 'Método', 'h': 'Así aprendés en Kairos.'}, items=[
            {'t': 'Test de nivel', 'd': 'Sabés dónde empezar desde el primer día.'}, {'t': 'Clases vivas', 'd': 'Hablás el 70% del tiempo de clase.'},
            {'t': 'Práctica en la app', 'd': 'Ejercicios cortos para los días sin clase.'}, {'t': 'Certificado', 'd': 'Al terminar cada nivel.'}]),
        dict(kind='plans', id='planes', bg='alt', center=True, toggle=('Mensual', 'Cuatrimestral (−10%)'), per=['/mes', '/mes, pago cuatrimestral'], head={'eb': 'Planes', 'h': 'Elegí cómo cursar.'}, plans=[
            {'n': 'Online', 'd': 'Desde tu casa', 'm': 38000, 'y': 34200, 'f': ['2 clases por semana', 'Grupos de hasta 8', 'Material digital']},
            {'n': 'Presencial', 'd': 'En el instituto', 'm': 46000, 'y': 41400, 'hot': True, 'tag': 'Más elegido', 'f': ['2 clases por semana', 'Club de conversación', 'Material incluido', 'Certificado']},
            {'n': 'Individual', 'd': 'Uno a uno', 'm': 72000, 'y': 64800, 'f': ['Horario a elección', 'Plan personalizado', 'Preparación de exámenes']}], ctaHref='test'),
        faq([('¿Qué pasa si falto a una clase?', 'Podés recuperarla en otro grupo del mismo nivel esa semana.'), ('¿Los certificados tienen validez?', 'Son certificados del instituto. Para validez internacional preparamos los exámenes oficiales.'),
             ('¿Hay clases para chicos?', 'Sí, desde los 6 años, en grupos por edad.')], center=True),
        contact([('map-pin', 'Sede', 'Calle Babel 77'), ('clock', 'Horario', 'Lun a vie · 8 a 21 h'), ('mail', 'Email', 'hola@kairos.demo')], head={'eb': 'Contacto', 'h': 'Empezá este mes.'}, formT='Pedí información', msgL='¿Qué idioma querés aprender?'),
    ],
)
idiomas['footer'] = foot(idiomas['nav'])

# 17 ─────────────────────────────── SEGUROS
seguros = dict(
    slug='escudo-seguros', name='Escudo', rubro='Productor de seguros', ref='#14 Insurance · Trust & Authority + Soft UI',
    title='Escudo Seguros | Cotizá tu seguro de auto, hogar y vida', desc='Productor de seguros demo con cotizador de auto paso a paso, planes de hogar y guía de siniestros.',
    tagline='Asesores de seguros independientes: comparamos aseguradoras por vos y te acompañamos en cada siniestro.',
    style='soft', fonts={'d': 'Rubik', 'b': 'Rubik', 'dw': '800'}, libs=['tilt'], split='scale',
    tokens=tok(bg='#F6FAFD', bg2='#E5F1FA', fg='#0B2540', fg_strong='#06182B', muted='#46607A', primary='#0369A1', on_primary='#FFFFFF', primary_text='#075985',
               accent='#16A34A', on_accent='#FFFFFF', card='#FFFFFF', line='#D3E4F1', r='14px', r_lg='24px', r_btn='12px', track='-.03em', case='none',
               ink_bg='#0369A1', ink_fg='#FFFFFF', h1='clamp(2.6rem,6.4vw,5.6rem)'),
    logo={'shape': 'shield', 't': 'E', 'size': 18},
    nav=[('Seguros', 'seguros'), ('Cotizar', 'cotizar'), ('Hogar', 'hogar'), ('Siniestros', 'siniestros'), ('Contacto', 'contacto')], hdrCta=('Cotizar ahora', 'cotizar'),
    hero=dict(type='split', eyebrow='Productor asesor de seguros', h1=['Cubrite bien,', 'pagá lo justo.'],
              lead='Comparamos varias aseguradoras y te recomendamos la mejor cobertura para vos. Cotizá tu auto en menos de un minuto.',
              cta1=('Cotizar mi auto', 'cotizar'), cta2=('Qué hacer ante un siniestro', 'siniestros'), points=[('scale', 'Comparamos aseguradoras'), ('phone-call', 'Te atendemos en el siniestro'), ('badge-check', 'Matrícula profesional')],
              vis='<div data-tilt style="max-width:380px;margin:auto">%s</div><div class="floater" style="left:0;top:18%%">%s Póliza activa</div><div class="floater" style="right:0;bottom:20%%;animation-delay:1.3s">%s Grúa 24 h</div>'
                  % (A.shield('#0369A1', '#16A34A'), '<svg class="ico"><use href="#i-file-check"/></svg>', '<svg class="ico"><use href="#i-truck"/></svg>')),
    css='.hero{background:radial-gradient(50% 60% at 80% 40%,#DCEEFB,transparent)}.cta-big{background:linear-gradient(135deg,#0369A1,#075985)}',
    sections=[
        dict(kind='features', id='seguros', layout='grid3', tilt=True, head={'eb': 'Seguros', 'h': 'Protegé lo que más te importa.'}, items=[
            {'i': 'car', 't': 'Auto y moto', 'd': 'Desde responsabilidad civil hasta todo riesgo con franquicia.'}, {'i': 'house', 't': 'Hogar', 'd': 'Incendio, robo, daños por agua y responsabilidad civil.'},
            {'i': 'heart-pulse', 't': 'Vida', 'd': 'Tranquilidad para tu familia, con capital a elección.'}, {'i': 'store', 't': 'Comercio', 'd': 'Integral para locales, mercadería y equipos.'},
            {'i': 'hard-hat', 't': 'ART', 'd': 'Cobertura para empleadores y trabajadores.'}, {'i': 'plane', 't': 'Viajes', 'd': 'Asistencia médica en el exterior.'}]),
        dict(kind='module', id='cotizar', mod='wizard', panel='Cotizador de auto', bg='alt',
             head={'eb': 'Cotizador', 'h': 'Cotizá tu auto en cuatro pasos.', 'p': 'Elegí el vehículo, la cobertura y los adicionales. Te mostramos un rango de cuota mensual orientativo.',
                   'bullets': [('check', 'Comparamos 6 aseguradoras'), ('check', 'Sin llamados insistentes'), ('check', 'Póliza digital en el día')]},
             cfg={'base': 42000, 'spread': .15, 'outLabel': 'Cuota mensual orientativa', 'cta': 'Quiero esta cobertura', 'okMsg': 'Recibimos tu pedido: un asesor te escribe hoy con las opciones (demo).',
                  'disclaimer': 'Valores de ejemplo para la demo. La cuota real depende del modelo, la zona y la aseguradora.', 'steps': [
                 {'k': 'v', 'q': '¿Qué vehículo querés asegurar?', 'short': 'Vehículo', 'type': 'choice', 'opts': [{'l': 'Auto', 'i': 'car', 'm': 1}, {'l': 'Pickup o SUV', 'i': 'truck', 'm': 1.35}, {'l': 'Moto', 'i': 'bike', 'm': .5}]},
                 {'k': 'c', 'q': '¿Qué cobertura buscás?', 'short': 'Cobertura', 'type': 'choice', 'opts': [
                     {'l': 'Responsabilidad civil', 'd': 'Lo mínimo obligatorio', 'm': .45}, {'l': 'Terceros completo', 'd': 'Robo, incendio y granizo', 'm': .85}, {'l': 'Todo riesgo', 'd': 'Con franquicia', 'm': 1.7}]},
                 {'k': 'e', 'q': '¿Qué edad tiene quien maneja?', 'short': 'Conductor', 'type': 'choice', 'opts': [{'l': '18 a 25 años', 'm': 1.3}, {'l': '26 a 60 años', 'm': 1}, {'l': 'Más de 60', 'm': 1.1}]},
                 {'k': 'x', 'q': '¿Sumás algún adicional?', 'short': 'Adicionales', 'type': 'choice', 'multi': True, 'opts': [{'l': 'Cristales y cerraduras', 'a': 4500}, {'l': 'Auto sustituto', 'a': 6800}, {'l': 'Cobertura en países limítrofes', 'a': 3200}, {'l': 'Ninguno', 'a': 0}]}]}),
        dict(kind='plans', id='hogar', head={'eb': 'Hogar', 'h': 'Planes para tu casa o departamento.'}, plans=[
            {'n': 'Básico', 'd': 'Departamentos', 'm': 9800, 'f': ['Incendio del edificio y contenido', 'Responsabilidad civil', 'Cerrajería de urgencia']},
            {'n': 'Completo', 'd': 'Lo más elegido', 'm': 16500, 'hot': True, 'tag': 'Recomendado', 'f': ['Todo lo del Básico', 'Robo de contenido', 'Daños por agua', 'Electrodomésticos']},
            {'n': 'Premium', 'd': 'Casas grandes', 'm': 27000, 'f': ['Todo lo del Completo', 'Notebooks y celulares', 'Cristales', 'Plomería 24 h']}], ctaHref='contacto', note='Precios de ejemplo para la demo. La cuota real depende de la suma asegurada.'),
        dict(kind='steps', id='siniestros', bg='alt', head={'eb': 'Siniestros', 'h': 'Si te pasa algo, hacé esto.'}, items=[
            {'t': 'Ponete a salvo', 'd': 'Primero vos y las personas. Si hay heridos, llamá al 107.'}, {'t': 'Sacá fotos', 'd': 'De los vehículos, las patentes y el lugar.'},
            {'t': 'Escribinos', 'd': 'Por WhatsApp, las 24 horas. Te guiamos con la denuncia.'}, {'t': 'Nos ocupamos', 'd': 'Seguimos el trámite con la aseguradora hasta el pago.'}]),
        faq([('¿Trabajan con una sola aseguradora?', 'No. Somos productores independientes: comparamos varias compañías.'), ('¿Puedo cambiarme de seguro antes de que venza?', 'Sí. Te ayudamos a dar de baja la póliza anterior sin perder cobertura.'),
             ('¿Cuánto tarda en salir la póliza?', 'La póliza digital sale en el día, después de la inspección del vehículo.')]),
        cta('¿Hace cuánto no revisás tu seguro?', 'Mandanos tu póliza actual y te decimos si estás pagando de más. Sin costo.', 'Revisar mi póliza', 'contacto'),
        contact([('map-pin', 'Oficina', 'Av. Seguridad 900'), ('clock', 'Horario', 'Lun a vie · 9 a 18 h'), ('phone-call', 'Siniestros', '24 h por WhatsApp')], head={'eb': 'Contacto', 'h': 'Te asesoramos sin compromiso.'}, formT='Pedí tu cotización', msgL='¿Qué querés asegurar?'),
    ],
)
seguros['footer'] = foot(seguros['nav'])

# 18 ─────────────────────────────── ENERGIA SOLAR
solar = dict(
    slug='solaria-energia', name='Solaria', rubro='Energía solar', ref='#47 Renewable Energy · Organic Biophilic + Motion',
    title='Solaria | Paneles solares para casas y empresas', desc='Empresa de energía solar demo: sol animado, calculadora de ahorro con paneles y recupero de la inversión.',
    tagline='Instalamos paneles solares para que generes tu propia energía y bajes la factura de luz.',
    style='soft', fonts={'d': 'Work Sans', 'b': 'Public Sans', 'dw': '600'}, vis=True, split='rise',
    tokens=tok(bg='#F7FBF3', bg2='#E8F5E1', fg='#0F2A1C', fg_strong='#06190F', muted='#43604F', primary='#047857', on_primary='#FFFFFF', primary_text='#065F46',
               accent='#F2A900', on_accent='#0F2A1C', card='#FFFFFF', line='#D3E8CB', r='16px', r_lg='28px', r_btn='999px', track='-.045em', case='none',
               ink_bg='#065F46', ink_fg='#F7FBF3', mq_bg='#F2A900', mq_fg='#0F2A1C', mq_bw='0', h1='clamp(2.8rem,7.6vw,7rem)'),
    logo={'shape': 'circle', 't': '☀', 'size': 20, 'c1': '#F2A900', 'c2': '#0F2A1C'},
    nav=[('Ahorro', 'ahorro'), ('Cómo funciona', 'como-funciona'), ('Instalación', 'instalacion'), ('Contacto', 'contacto')], hdrCta=('Calcular mi ahorro', 'ahorro'),
    hero=dict(type='full', eyebrow='Energía solar', h1=['Tu techo', 'puede pagar', 'tu luz.'],
              lead='Paneles solares conectados a la red: generás de día, consumís menos y en pocos años recuperás la inversión. Calculá tu ahorro.',
              cta1=('Calcular mi ahorro', 'ahorro'), cta2=('Cómo funciona', 'como-funciona'), points=[('sun', 'Hasta 80% menos en la factura'), ('shield-check', '25 años de garantía'), ('wrench', 'Instalación en 2 días')],
              vis='<canvas class="bg-canvas" data-vis="sun" data-c1="#F2A900" data-c2="#047857" aria-hidden="true"></canvas><div class="sol-panel" aria-hidden="true">%s</div>' % A.solar_panel('#047857', '#F2A900')),
    css='''.hero--full .sol-panel{position:absolute;right:4%;bottom:6%;width:min(40vw,520px);z-index:-1}
@media(max-width:860px){.hero--full .sol-panel{width:70vw;opacity:.35}}''',
    sections=[
        marquee(['Ahorro', 'Energía limpia', 'Garantía 25 años', 'Monitoreo en el celular', 'Financiación'], speed=30),
        dict(kind='module', id='ahorro', mod='solar', panel='Calculadora de ahorro',
             head={'eb': 'Calculadora', 'h': '¿Cuánto podés ahorrar?', 'p': 'Mové la barra con lo que pagás de luz por mes. Te mostramos cuántos paneles necesitás y en cuánto tiempo los recuperás.',
                   'bullets': [('check', 'Estudio de tu factura sin cargo'), ('check', 'Financiación en cuotas'), ('check', 'Monitoreo desde el celular')]},
             cfg={'def': 60000, 'min': 15000, 'max': 300000, 'step': 5000, 'kwh': 140, 'yieldKwh': 650, 'cover': 80, 'panelCost': 420000, 'fixed': 900000}),
        dict(kind='steps', id='como-funciona', bg='alt', head={'eb': 'Cómo funciona', 'h': 'Del sol a tu enchufe.'}, items=[
            {'t': 'Los paneles captan el sol', 'd': 'Y generan corriente continua durante el día.'}, {'t': 'El inversor la convierte', 'd': 'En la corriente que usan tus equipos.'},
            {'t': 'Consumís lo que generás', 'd': 'Y lo que sobra se inyecta a la red.'}, {'t': 'Lo seguís en la app', 'd': 'Cuánto generaste y cuánto ahorraste.'}]),
        dict(kind='split', id='instalacion', head={'eb': 'Instalación', 'h': 'Llave en mano, en dos días.'},
             text=['Hacemos la visita técnica, el proyecto, los trámites con la distribuidora y la instalación con personal propio.',
                   'Después te dejamos la app configurada y hacemos un mantenimiento gratis al año.'],
             bullets=[('clipboard-check', 'Trámites de usuario-generador incluidos'), ('hard-hat', 'Instaladores certificados'), ('smartphone', 'App de monitoreo')],
             art=A.solar_panel('#047857', '#F2A900'), flip=True),
        dict(kind='features', id='para-quien', layout='grid3', head={'eb': 'Para quién', 'h': 'Casas, comercios y campos.'}, items=[
            {'i': 'house', 't': 'Hogares', 'd': 'Sistemas de 2 a 10 kW para casas con consumo medio o alto.'},
            {'i': 'store', 't': 'Comercios', 'd': 'Bajá el costo fijo de heladeras, aires y equipos.'},
            {'i': 'tractor', 't': 'Rural', 'd': 'Bombeo solar y sistemas aislados donde no llega la red.'}]),
        faq([('¿Funciona en días nublados?', 'Sí, genera menos pero sigue generando. El cálculo anual ya lo considera.'), ('¿Necesito baterías?', 'No si estás conectado a la red. Las baterías son opcionales para cortes de luz.'),
             ('¿Cuánto dura un panel?', 'Más de 25 años, con garantía de rendimiento del fabricante.')], center=True),
        cta('Pedí tu estudio solar sin cargo.', 'Mandanos una foto de tu factura y te enviamos el proyecto con el ahorro real.', 'Pedir estudio', 'contacto'),
        contact([('map-pin', 'Oficina', 'Parque Industrial, lote 8'), ('clock', 'Horario', 'Lun a vie · 8 a 17 h'), ('phone', 'Teléfono', '(0376) 400-0005')], head={'eb': 'Contacto', 'h': 'Empecemos por tu factura.'}, formT='Pedí tu estudio solar', msgL='¿Cuánto pagás de luz por mes?'),
    ],
)
solar['footer'] = foot(solar['nav'])

# 19 ─────────────────────────────── PSICOLOGIA
BLOB = ('<svg viewBox="0 0 600 260" aria-hidden="true" style="width:100%;max-width:820px;margin:auto;display:block">'
        '<circle class="calm1" cx="200" cy="130" r="110" fill="#C4B5FD" opacity=".55"/><circle class="calm2" cx="330" cy="120" r="120" fill="#A7F3D0" opacity=".5"/>'
        '<circle class="calm1" cx="430" cy="150" r="90" fill="#FBCFE8" opacity=".55"/></svg>')
psico = dict(
    slug='espacio-calma', name='Espacio Calma', rubro='Consultorio de psicología', ref='#55 Mental Health · Soft UI + Accessible & Ethical',
    title='Espacio Calma | Psicología para adultos y adolescentes', desc='Consultorio de psicología demo: ejercicio de respiración guiada, turnos online y lenguaje cuidado.',
    tagline='Psicoterapia para adultos, parejas y adolescentes, presencial y online.',
    style='soft', fonts={'d': 'Lora', 'b': 'Raleway', 'dw': '500', 'dfb': 'Georgia,serif'}, split='blur',
    tokens=tok(bg='#FAF8FF', bg2='#F1ECFE', fg='#2A2342', fg_strong='#1A1530', muted='#5C5675', primary='#6D28D9', on_primary='#FFFFFF', primary_text='#5B21B6',
               accent='#10B981', on_accent='#063B2B', card='#FFFFFF', line='#E6DEFB', r='20px', r_lg='32px', r_btn='999px', track='-.02em', case='none',
               ink_bg='#6D28D9', ink_fg='#FFFFFF', h1='clamp(2.6rem,6.4vw,5.8rem)'),
    logo={'shape': 'circle', 't': 'c', 'size': 24},
    nav=[('Terapia', 'terapia'), ('Respirá', 'respira'), ('Turnos', 'turnos'), ('Contacto', 'contacto')], hdrCta=('Pedir turno', 'turnos'),
    hero=dict(type='center', eyebrow='Psicología', h1=['Un espacio para', 'escucharte.'],
              lead='Terapia con profesionales matriculadas, en consultorio o por videollamada. Sin juicios, a tu ritmo.',
              cta1=('Pedir una primera entrevista', 'turnos'), cta2=('Probar una respiración', 'respira'), points=[('video', 'Online o presencial'), ('lock', 'Confidencialidad'), ('heart-handshake', 'Primera entrevista breve')],
              vis=BLOB),
    css='''.hero--center h1{font-style:italic;font-weight:500;max-width:16ch;margin-inline:auto}
.calm1{animation:calm 9s ease-in-out infinite;transform-origin:center;transform-box:fill-box}.calm2{animation:calm 9s ease-in-out infinite reverse;transform-origin:center;transform-box:fill-box}
@keyframes calm{50%{transform:scale(1.12)}}@media(prefers-reduced-motion:reduce){.calm1,.calm2{animation:none}}
.crisis{border-left:4px solid var(--accent);padding:14px 18px;background:var(--card);border-radius:12px;margin-top:22px}''',
    sections=[
        dict(kind='features', id='terapia', layout='grid2', head={'eb': 'Terapia', 'h': 'Acompañamos distintos momentos.'}, items=[
            {'i': 'user', 't': 'Adultos', 'd': 'Ansiedad, estrés, duelos, cambios de etapa y vínculos.'},
            {'i': 'users', 't': 'Parejas', 'd': 'Comunicación, acuerdos y momentos de crisis.'},
            {'i': 'sprout', 't': 'Adolescentes', 'd': 'Un espacio propio, con encuentros con la familia cuando hace falta.'},
            {'i': 'video', 't': 'Terapia online', 'd': 'Por videollamada, desde donde estés.'}]),
        dict(kind='module', id='respira', mod='breath', panel='Respiración guiada', bg='alt',
             head={'eb': 'Un minuto para vos', 'h': 'Probá esta respiración.', 'p': 'Seguí el círculo: inhalá mientras crece, sostené y exhalá despacio mientras se achica. Repetí tres o cuatro veces.',
                   'bullets': [('wind', 'Inhalá 4 segundos'), ('pause', 'Sostené 4 segundos'), ('leaf', 'Exhalá 6 segundos')]},
             cfg={'phases': [['Inhalá', 4, 1], ['Sostené', 4, 1], ['Exhalá', 6, .55]]}),
        dict(kind='fill', id='enfoque', text='La terapia no es para cuando ya no das más. Es un lugar para pensar lo que te pasa, con alguien que te escucha de verdad.'),
        dict(kind='module', id='turnos', mod='agenda', panel='Turnos', flip=True, bg='alt',
             head={'eb': 'Turnos', 'h': 'Pedí tu primera entrevista.', 'p': 'Elegí la modalidad, la profesional y el horario. Es un primer encuentro para conocerse.',
                   'bullets': [('lock', 'Tus datos son confidenciales'), ('calendar-plus', 'Agendalo en tu calendario'), ('message-circle', 'Recordatorio discreto')]},
             cfg={'biz': 'Espacio Calma', 'q1': '¿Qué modalidad preferís?', 'q2': 'Elegí profesional', 'services': [{'n': 'Primera entrevista presencial', 'd': '50 minutos', 'm': 50}, {'n': 'Primera entrevista online', 'd': '50 minutos', 'm': 50}, {'n': 'Terapia de pareja', 'd': '60 minutos', 'm': 60}],
                  'pros': [{'n': 'Lic. Mariana Quiroga', 'r': 'Adultos y parejas'}, {'n': 'Lic. Sofía Benítez', 'r': 'Adolescentes y familias'}],
                  'hours': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'], 'closed': [0, 6], 'okTitle': 'Turno reservado'}),
        faq([('¿Cuánto dura una sesión?', 'Cincuenta minutos, una vez por semana en general.'), ('¿Atienden por obra social?', 'Trabajamos por reintegro con varias prepagas. Te damos factura.'),
             ('¿Qué hago si estoy en crisis ahora?', 'Esta web no es un servicio de urgencias. Llamá al 911 o acercate a la guardia más cercana. También podés llamar a la línea 135 (CABA y GBA) o al 0800 345 1435, del Centro de Asistencia al Suicida.')], center=True),
        contact([('map-pin', 'Consultorio', 'Calle Serena 230'), ('clock', 'Horario', 'Lun a vie · 9 a 20 h'), ('mail', 'Email', 'hola@calma.demo')], head={'eb': 'Contacto', 'h': 'Escribinos cuando quieras.'}, formT='Consulta', msgL='Si querés, contanos brevemente qué te trae'),
    ],
)
psico['footer'] = foot(psico['nav'])

# 20 ─────────────────────────────── PIZZERIA
pizzeria = dict(
    slug='fuego-pizza', name='Fuego Pizza', rubro='Pizzería y delivery', ref='#33 Food Delivery · Neubrutalism + Playful',
    title='Fuego Pizza | Pizzas a la piedra con delivery', desc='Pizzería demo: armá tu pizza con ingredientes animados, carta con carrito, pedido por WhatsApp y seguimiento del delivery.',
    tagline='Pizzas a la piedra, masa madre de 48 horas y delivery en 35 minutos.',
    style='brutal', fonts={'d': 'Lexend Mega', 'b': 'Public Sans', 'dw': '900'}, cart=True, split='scale',
    cfg={'cartTitle': 'Tu pedido', 'orderIntro': 'Hola Fuego! Quiero pedir:', 'checkout': 'Pedir por WhatsApp', 'okOrder': '¡Pedido enviado! Seguilo en “Dónde está mi pedido” (demo).'},
    tokens=tok(bg='#FFF5E6', bg2='#FFE3B8', fg='#1A1208', fg_strong='#000000', muted='#5A4630', primary='#E63E1C', on_primary='#FFFFFF', primary_text='#B42A0E',
               accent='#2563EB', on_accent='#FFFFFF', card='#FFFFFF', line='#1A1208', r='12px', r_lg='20px', r_btn='12px', track='-.06em', case='none',
               ink_bg='#E63E1C', ink_fg='#FFFFFF', mq_bg='#2563EB', mq_fg='#FFFFFF', mq_bw='3px', card_bw='3px', h1='clamp(2.2rem,6.2vw,5.6rem)'),
    logo={'shape': 'circle', 't': 'F', 'size': 22},
    nav=[('Armá tu pizza', 'arma'), ('Carta', 'carta'), ('Delivery', 'delivery'), ('Contacto', 'contacto')], hdrCta=('Pedir ahora', 'carta'),
    hero=dict(type='split', eyebrow='Pizzería a la piedra', h1=['Pizza', 'caliente', 'en 35 min.'],
              lead='Masa madre de 48 horas, muzzarella de verdad y horno a la piedra. Armá la tuya o elegí de la carta.',
              cta1=('Armar mi pizza', 'arma'), cta2=('Ver la carta', 'carta'), points=[('timer', 'Delivery en 35 minutos'), ('flame', 'Horno a la piedra'), ('wheat', 'Masa madre')],
              vis='<div class="pz-hero">%s</div>' % A.pizza()),
    css='''.pz-hero{max-width:440px;margin:auto;animation:spin 40s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.pz-hero{animation:none}}.hero h1{line-height:1}''',
    sections=[
        marquee(['Muzzarella', 'Napolitana', 'Fugazzeta', 'Calabresa', 'Cuatro quesos', 'Rúcula'], skew=True, speed=24),
        dict(kind='module', id='arma', mod='pizza', layout='full', panel='Armá tu pizza',
             head={'eb': 'Armá tu pizza', 'h': 'Elegí el tamaño y los ingredientes.', 'p': 'Cada ingrediente aparece en la pizza. Cuando te guste, sumala al pedido.'},
             cfg={'sizes': [{'n': 'Chica', 'p': 9500}, {'n': 'Grande', 'p': 13500}, {'n': 'Gigante', 'p': 17500}], 'tops': [
                 {'n': 'Pepperoni', 'p': 2500, 'q': 9, 'col': '#B91C1C', 'r': 9}, {'n': 'Aceitunas', 'p': 1200, 'q': 14, 'col': '#1C1917', 'r': 4},
                 {'n': 'Champiñones', 'p': 1800, 'q': 10, 'col': '#D6C3A5', 'r': 7}, {'n': 'Rúcula', 'p': 1500, 'q': 18, 'col': '#15803D', 'r': 5},
                 {'n': 'Morrón', 'p': 1300, 'q': 12, 'col': '#F97316', 'r': 5}, {'n': 'Cebolla', 'p': 1000, 'q': 14, 'col': '#F5F0FF', 'r': 4}]}),
        dict(kind='module', id='carta', mod='menu', panel='Carta', bg='alt',
             head={'eb': 'La carta', 'h': 'Las de siempre, bien hechas.', 'p': 'Sumá al pedido y mirá cómo le llega el mensaje a la pizzería.',
                   'bullets': [('check', 'Pagás al recibir'), ('check', 'Envío gratis desde $ 25.000'), ('check', 'Opciones sin TACC')]},
             cfg={'cats': ['Pizzas', 'Empanadas', 'Bebidas'], 'items': [
                 {'c': 'Pizzas', 'n': 'Muzzarella', 'd': 'Salsa de tomate, muzzarella y orégano.', 'p': 12500}, {'c': 'Pizzas', 'n': 'Napolitana', 'd': 'Con tomate en rodajas y ajo.', 'p': 14000, 't': 'Favorita'},
                 {'c': 'Pizzas', 'n': 'Fugazzeta', 'd': 'Rellena de muzzarella con cebolla.', 'p': 15500}, {'c': 'Pizzas', 'n': 'Cuatro quesos', 'd': 'Muzzarella, roquefort, parmesano y provolone.', 'p': 16000},
                 {'c': 'Empanadas', 'n': 'Carne cortada a cuchillo', 'd': 'Al horno de barro. Por unidad.', 'p': 2400}, {'c': 'Empanadas', 'n': 'Jamón y queso', 'd': 'Por unidad.', 'p': 2200},
                 {'c': 'Bebidas', 'n': 'Gaseosa 1,5 L', 'd': 'Línea cola, lima limón o naranja.', 'p': 3800}, {'c': 'Bebidas', 'n': 'Cerveza artesanal 1 L', 'd': 'Rubia o roja.', 'p': 6500}]}),
        dict(kind='module', id='delivery', mod='track', panel='¿Dónde está mi pedido?', flip=True,
             head={'eb': 'Delivery', 'h': 'Seguí tu pedido en vivo.', 'p': 'Tocá “Simular pedido” y mirá cómo avanza, del horno a tu puerta.',
                   'bullets': [('map-pin', 'Seguimiento en tiempo real'), ('bike', 'Repartidores propios'), ('timer', '35 minutos promedio')]},
             cfg={'steps': [{'n': 'Pedido recibido', 'd': 'Ya lo vio la cocina', 'i': 'receipt'}, {'n': 'En el horno', 'd': 'A la piedra, 4 minutos', 'i': 'flame'}, {'n': 'En camino', 'd': 'Salió con el repartidor', 'i': 'bike'}, {'n': 'Entregado', 'd': '¡Que la disfrutes!', 'i': 'party-popper'}]}),
        faq([('¿Hasta dónde llegan?', 'Hasta 5 km del local. Ingresá tu dirección al pedir y te confirmamos.'), ('¿Tienen opciones sin TACC?', 'Sí, prepizzas sin TACC con elaboración separada.'),
             ('¿Puedo pagar con transferencia?', 'Sí, o con efectivo y tarjeta al recibir.')]),
        contact([('map-pin', 'Local', 'Calle Horno 500'), ('clock', 'Horario', 'Todos los días · 19 a 0 h'), ('phone', 'Pedidos', '(0376) 400-0006')], head={'eb': 'Contacto', 'h': 'Pasá a buscarla o pedila.'}, formT='Consultas y eventos', msgL='¿Qué necesitás?'),
    ],
)
pizzeria['footer'] = foot(pizzeria['nav'])

SITES = [moda, idiomas, seguros, solar, psico, pizzeria]
