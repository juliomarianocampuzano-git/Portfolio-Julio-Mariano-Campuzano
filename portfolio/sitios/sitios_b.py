# sitios_b.py · sitios 8 a 14. Negocios ficticios: nombres, precios y datos son de ejemplo.
import arte as A
from comun import tok, foot, contact, faq, cta, marquee

def big(t, c, size='clamp(3rem,7vw,5.5rem)', font='var(--fd)'):
    """Tipografia grande como 'arte' de una tarjeta."""
    return '<span aria-hidden="true" style="font:var(--fdw) %s/1 %s;color:%s;letter-spacing:-.02em;text-transform:uppercase">%s</span>' % (size, font, c, t)

# 8 ─────────────────────────────── ESTUDIO DE ARQUITECTURA
arq = dict(
    slug='monolito-arquitectura', name='Monolito', rubro='Estudio de arquitectura', ref='#41 Architecture/Interior · Swiss Modernism 2.0 + 3D',
    title='Monolito Arquitectura | Viviendas, reformas e interiorismo', desc='Estudio de arquitectura demo: ciudad 3D animada, proyectos en scroll horizontal y cotizador por metro cuadrado.',
    tagline='Arquitectura de líneas simples para vivir mejor. Proyecto, dirección de obra e interiorismo.',
    style='swiss', fonts={'d': 'Archivo', 'b': 'Archivo', 'dw': '800'}, libs=['three'], vis=True, loader=True, cursor=True, split='rise',
    tokens=tok(bg='#F5F5F4', bg2='#E7E5E4', fg='#1C1917', fg_strong='#0C0A09', muted='#57534E', primary='#1C1917', on_primary='#F5F5F4', primary_text='#1C1917',
               accent='#A16207', on_accent='#FFFFFF', card='#FFFFFF', line='#D6D3D1', r='0px', r_lg='0px', r_btn='0px', track='-.045em', case='none',
               ink_bg='#1C1917', ink_fg='#F5F5F4', mq_bg='#1C1917', mq_fg='#F5F5F4', mq_bw='0', loader_bg='#1C1917', loader_fg='#F5F5F4', h1='clamp(2.8rem,8.4vw,8.6rem)'),
    logo={'shape': 'square', 't': 'M', 'size': 22, 'r': 0},
    nav=[('Proyectos', 'proyectos'), ('Proceso', 'proceso'), ('Cotizador', 'cotizador'), ('Contacto', 'contacto')], hdrCta=('Cotizar mi obra', 'cotizador'),
    hero=dict(type='full', eyebrow='Estudio de arquitectura · desde 2014', h1=['Espacios', 'que ordenan', 'tu vida.'],
              lead='Proyectamos casas, locales y reformas con presupuesto claro desde el primer día. Calculá un rango para tu obra en un minuto.',
              cta1=('Ver proyectos', 'proyectos'), cta2=('Cotizar mi obra', 'cotizador'),
              vis='<canvas class="bg-canvas" data-vis="blocks3d" data-c1="#A16207" data-c2="#E7E5E4" aria-hidden="true"></canvas>'),
    css='''.hero--full{min-height:calc(100svh - 40px)}.hero--full .bg-canvas{left:38%;width:62%}
.hero--full::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,#F5F5F4 30%,transparent 70%)}
@media(max-width:860px){.hero--full .bg-canvas{left:0;width:100%;height:50%;top:auto;bottom:0;opacity:.55}.hero--full::after{background:linear-gradient(180deg,#F5F5F4 40%,transparent)}}
.hs-card h3{font-size:1.5rem}''',
    sections=[
        marquee(['Viviendas', 'Reformas', 'Locales', 'Interiorismo', 'Dirección de obra', 'Render 3D'], speed=40),
        dict(kind='hs', id='proyectos', head={'eb': 'Proyectos seleccionados', 'h': 'Cada obra, una respuesta distinta.'}, cards=[
            {'t': 'Casa Patio', 'd': 'Vivienda de 180 m² organizada alrededor de un patio con lapacho.', 'tag': 'Vivienda · 2024', 'bg': '#E7E5E4', 'art': A.building('#1C1917', '#A16207')},
            {'t': 'Local Trama', 'd': 'Showroom textil con estantería continua de madera y luz cenital.', 'tag': 'Comercial · 2023', 'bg': '#D6D3D1', 'art': A.building('#44403C', '#F5F5F4')},
            {'t': 'Edificio Raíz', 'd': 'Doce departamentos con balcones jardineros y terraza común.', 'tag': 'Multifamiliar · 2023', 'bg': '#1C1917', 'art': A.building('#A16207', '#E7E5E4')},
            {'t': 'Reforma Lumen', 'd': 'Departamento de los años 70 abierto a la luz: cocina integrada y piso continuo.', 'tag': 'Reforma · 2022', 'bg': '#E7E5E4', 'art': A.building('#78716C', '#1C1917')},
            {'t': 'Oficinas Eje', 'd': 'Planta libre para 40 puestos, salas acústicas y un patio interior.', 'tag': 'Corporativo · 2022', 'bg': '#A16207', 'art': A.building('#1C1917', '#F5F5F4')}]),
        dict(kind='fill', id='manifiesto', text='Creemos en pocos materiales, bien elegidos. En la luz natural como primer recurso. Y en un presupuesto que no cambia a mitad de obra.'),
        dict(kind='steps', id='proceso', bg='alt', head={'eb': 'Proceso', 'h': 'Del primer boceto a la llave en mano.'}, items=[
            {'t': 'Escucha', 'd': 'Relevamos el terreno, tus necesidades y el presupuesto real.'},
            {'t': 'Anteproyecto', 'd': 'Plantas, maqueta 3D y un costo estimado para decidir con datos.'},
            {'t': 'Proyecto ejecutivo', 'd': 'Planos de detalle, pliegos y trámites municipales.'},
            {'t': 'Dirección de obra', 'd': 'Visitas semanales, control de certificados y reporte con fotos.'}]),
        dict(kind='module', id='cotizador', mod='wizard', panel='Cotizador de obra',
             head={'eb': 'Cotizador', 'h': '¿Cuánto cuesta tu obra?', 'p': 'Elegí el tipo de obra, la superficie y las terminaciones. Te mostramos un rango orientativo por metro cuadrado.',
                   'bullets': [('ruler', 'Valores por m² de ejemplo'), ('file-text', 'Presupuesto formal en 72 h'), ('check', 'Primera reunión sin cargo')]},
             cfg={'base': 0, 'spread': .12, 'outLabel': 'Costo orientativo de obra', 'cta': 'Pedir reunión', 'okMsg': 'Reunión solicitada: te escribimos para coordinar (demo).',
                  'disclaimer': 'Valores de ejemplo para la demo. El costo real depende del terreno, la ubicación y el proyecto.', 'steps': [
                 {'k': 'n', 'q': '¿Cuántos metros cuadrados?', 'short': 'Superficie', 'type': 'range', 'min': 30, 'max': 400, 'step': 10, 'def': 120, 'role': 'qty', 'unit': 'm²'},
                 {'k': 't', 'q': '¿Qué tipo de obra es?', 'short': 'Tipo de obra', 'type': 'choice', 'opts': [
                     {'l': 'Vivienda nueva', 'd': 'Desde cero', 'i': 'house', 'aq': 1150000}, {'l': 'Reforma integral', 'd': 'Sobre lo existente', 'i': 'hammer', 'aq': 620000},
                     {'l': 'Local comercial', 'd': 'Obra y equipamiento', 'i': 'store', 'aq': 880000}, {'l': 'Interiorismo', 'd': 'Muebles y terminaciones', 'i': 'sofa', 'aq': 260000}]},
                 {'k': 'f', 'q': '¿Qué nivel de terminaciones?', 'short': 'Terminaciones', 'type': 'choice', 'opts': [
                     {'l': 'Estándar', 'd': 'Buena calidad, sin vueltas', 'aq': 0}, {'l': 'Superior', 'd': 'Carpinterías de aluminio, porcellanato', 'aq': 240000}, {'l': 'Premium', 'd': 'Materiales nobles y domótica', 'aq': 520000}]},
                 {'k': 'x', 'q': '¿Qué servicios sumás?', 'short': 'Servicios', 'type': 'choice', 'multi': True, 'opts': [
                     {'l': 'Dirección de obra', 'a': 2400000}, {'l': 'Render 3D fotorrealista', 'a': 450000}, {'l': 'Trámites municipales', 'a': 380000}, {'l': 'Ninguno por ahora', 'a': 0}]}]}),
        dict(kind='features', id='servicios', layout='grid2', head={'eb': 'Servicios', 'h': 'Un solo equipo para todo el proyecto.'}, items=[
            {'i': 'drafting-compass', 't': 'Proyecto de arquitectura', 'd': 'Diseño, planos y documentación completa para construir sin improvisar.'},
            {'i': 'hard-hat', 't': 'Dirección de obra', 'd': 'Controlamos plazos, calidad y certificados para que no tengas sorpresas.'},
            {'i': 'sofa', 't': 'Interiorismo', 'd': 'Muebles a medida, iluminación y materiales pensados con el proyecto.'},
            {'i': 'box', 't': 'Render y recorridos 3D', 'd': 'Ves tu casa terminada antes de poner el primer ladrillo.'}]),
        faq([('¿Trabajan fuera de la ciudad?', 'Sí. Para obras a más de 50 km sumamos los viáticos de las visitas.'),
             ('¿Cuánto tarda un proyecto?', 'Un anteproyecto lleva de 3 a 5 semanas; el proyecto ejecutivo, de 6 a 10.'),
             ('¿Cobran por la primera reunión?', 'No. Es una charla para conocer el terreno y lo que necesitás.')]),
        contact([('map-pin', 'Estudio', 'Calle Proyecto 321'), ('clock', 'Horario', 'Lun a vie · 9 a 18 h'), ('mail', 'Email', 'hola@monolito.demo')], head={'eb': 'Contacto', 'h': 'Contanos tu proyecto.'}, formT='Primera reunión sin cargo', msgL='¿Qué querés construir o reformar?'),
    ],
)
arq['footer'] = foot(arq['nav'])

# 9 ─────────────────────────────── INMOBILIARIA
inmo = dict(
    slug='habitar-propiedades', name='Habitar', rubro='Inmobiliaria', ref='#50 Real Estate · Glassmorphism + Trust & Authority',
    title='Habitar Propiedades | Casas, departamentos y lotes', desc='Inmobiliaria demo: catálogo de propiedades con filtros animados, favoritos y simulador de crédito hipotecario.',
    tagline='Casas, departamentos y lotes con tasación profesional y crédito hipotecario.',
    style='glass', fonts={'d': 'Cinzel', 'b': 'Josefin Sans', 'dw': '700', 'dfb': 'Georgia,serif'}, libs=['tilt'], split='blur',
    tokens=tok(bg='#EEF6F4', bg2='#D8ECE7', fg='#10302B', fg_strong='#071E1A', muted='#3F5F59', primary='#0F766E', on_primary='#FFFFFF', primary_text='#0F5F58',
               accent='#C08A2E', on_accent='#FFFFFF', card='#FFFFFF', line='rgba(16,48,43,.14)', r='18px', r_lg='26px', r_btn='999px', track='.01em', case='none',
               ink_bg='#0F766E', ink_fg='#FFFFFF', h1='clamp(2.3rem,5.6vw,5rem)'),
    logo={'shape': 'arch', 't': 'H', 'size': 18},
    nav=[('Propiedades', 'propiedades'), ('Crédito', 'credito'), ('Vender', 'vender'), ('Contacto', 'contacto')], hdrCta=('Tasar mi propiedad', 'vender'),
    hero=dict(type='split', eyebrow='Inmobiliaria', h1=['Encontrá', 'tu lugar', 'en el mundo.'],
              lead='Propiedades verificadas, fotos reales y la cuota del crédito calculada al instante. Filtrá y guardá tus favoritas.',
              cta1=('Ver propiedades', 'propiedades'), cta2=('Simular crédito', 'credito'), points=[('shield-check', 'Títulos verificados'), ('camera', 'Visitas virtuales'), ('landmark', 'Crédito hipotecario')],
              vis='<div class="glass-stage" data-tilt>%s<div class="floater" style="left:-18px;top:16%%">%s 3 dormitorios · 160 m²</div><div class="floater" style="right:-12px;bottom:14%%;animation-delay:1.4s">%s Cuota desde $ 890.000</div></div>'
                  % (A.house('casa', '#0F766E', '#E6F4F1'), '<svg class="ico"><use href="#i-bed-double"/></svg>', '<svg class="ico"><use href="#i-calculator"/></svg>')),
    css='''body{background:radial-gradient(40% 40% at 10% 10%,#9EE6DA,transparent 70%),radial-gradient(35% 40% at 95% 30%,#F5D9A8,transparent 70%),radial-gradient(40% 40% at 50% 100%,#B7E4F5,transparent 70%),#EEF6F4;background-attachment:fixed}
.glass-stage{position:relative;padding:32px;border-radius:32px;background:rgba(255,255,255,.45);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.6);box-shadow:0 30px 80px -30px rgba(15,118,110,.45)}
.sec.alt{background:rgba(255,255,255,.35)}.hdr.sc{background:rgba(238,246,244,.7)}''',
    sections=[
        dict(kind='module', id='propiedades', mod='catalogo', layout='full', panel='Propiedades disponibles',
             head={'eb': 'Propiedades', 'h': 'Filtrá, ordená y guardá tus favoritas.', 'p': 'Tocá una categoría: la grilla se reacomoda sola. “Simular cuota” lleva el precio al simulador de crédito.'},
             cfg={'cats': ['Casas', 'Departamentos', 'Lotes'], 'fav': True, 'action': 'Simular cuota', 'actMode': 'cuotas', 'items': [
                 {'n': 'Casa con jardín en Villa Sarita', 'cat': 'Casas', 'p': 165000000, 'svg': A.house('casa', '#0F766E', '#E6F4F1'), 'bg': '#DDF1EC', 'tag': 'Nueva', 'meta': [['bed-double', '3 dorm.'], ['bath', '2 baños'], ['ruler', '160 m²']]},
                 {'n': 'Depto 2 ambientes con balcón', 'cat': 'Departamentos', 'p': 78000000, 'svg': A.house('depto', '#334155', '#BFDBFE'), 'bg': '#E2EEF9', 'meta': [['bed-double', '1 dorm.'], ['bath', '1 baño'], ['ruler', '48 m²']]},
                 {'n': 'Lote 12 x 30 en barrio cerrado', 'cat': 'Lotes', 'p': 42000000, 'svg': A.house('lote', '#15803D', '#86EFAC'), 'bg': '#E6F6E9', 'meta': [['ruler', '360 m²'], ['zap', 'Servicios'], ['shield', 'Seguridad']]},
                 {'n': 'Casa a estrenar con pileta', 'cat': 'Casas', 'p': 218000000, 'svg': A.house('casa', '#B45309', '#FEF3C7'), 'bg': '#FBF0DC', 'tag': 'Destacada', 'meta': [['bed-double', '4 dorm.'], ['bath', '3 baños'], ['ruler', '230 m²']]},
                 {'n': 'Depto 3 ambientes con cochera', 'cat': 'Departamentos', 'p': 112000000, 'svg': A.house('depto', '#0F766E', '#99F6E4'), 'bg': '#DDF1EC', 'meta': [['bed-double', '2 dorm.'], ['car', 'Cochera'], ['ruler', '74 m²']]},
                 {'n': 'Lote esquina sobre avenida', 'cat': 'Lotes', 'p': 68000000, 'svg': A.house('lote', '#C08A2E', '#FDE68A'), 'bg': '#FBF0DC', 'meta': [['ruler', '480 m²'], ['store', 'Uso comercial'], ['zap', 'Servicios']]}]}),
        dict(kind='module', id='credito', mod='cuotas', panel='Simulador hipotecario', bg='alt',
             head={'eb': 'Crédito hipotecario', 'h': 'Calculá tu cuota antes de visitar.', 'p': 'Elegí el valor, el anticipo y el plazo en años. Te mostramos la cuota estimada y el total.',
                   'bullets': [('check', 'Te acompañamos con el banco'), ('check', 'Hasta 30 años de plazo'), ('check', 'Tasación incluida')]},
             cfg={'label': 'Valor de la propiedad', 'price': 120000000, 'min': 30000000, 'max': 300000000, 'step': 1000000, 'rate': 9, 'terms': [10, 15, 20, 30], 'unit': 'años', 'downMin': 20, 'down': 30, 'cta': 'Coordinar visita', 'ctaHref': 'contacto'}),
        dict(kind='split', id='vender', head={'eb': 'Vendé con nosotros', 'h': 'Tasamos tu propiedad en 48 horas.'},
             text=['Visitamos la propiedad, comparamos con ventas reales de la zona y te entregamos un informe escrito con el valor sugerido.',
                   'Después la publicamos con fotos profesionales, plano y recorrido virtual en los principales portales.'],
             bullets=[('camera', 'Fotos y video profesionales'), ('file-check', 'Informe de tasación por escrito'), ('users', 'Filtramos a los interesados')],
             art='<div class="glass-stage">%s</div>' % A.house('depto', '#0F766E', '#FDE68A'), flip=True),
        dict(kind='steps', id='como-comprar', bg='alt', head={'eb': 'Cómo comprar', 'h': 'Cuatro pasos hasta las llaves.'}, items=[
            {'t': 'Elegís', 'd': 'Guardás tus favoritas y coordinamos las visitas el mismo día.'}, {'t': 'Reservás', 'd': 'Con una seña que queda a cuenta del precio.'},
            {'t': 'Firmás el boleto', 'd': 'Con estudio de títulos y escribano de tu confianza.'}, {'t': 'Escriturás', 'd': 'Y te entregamos las llaves.'}]),
        faq([('¿Cobran comisión al comprador?', 'Sí, la comisión de ley. Te la informamos por escrito antes de reservar.'),
             ('¿Puedo comprar con crédito hipotecario?', 'Sí. Te ayudamos a elegir el banco y preparar la documentación.'),
             ('¿Las fotos son reales?', 'Sí, en la versión real. En esta demo las propiedades son ilustraciones.')]),
        contact([('map-pin', 'Oficina', 'Av. Central 2100'), ('clock', 'Horario', 'Lun a vie 9 a 19 h · sáb 9 a 13 h'), ('phone', 'Teléfono', '(0376) 400-0003')], head={'eb': 'Contacto', 'h': 'Coordinemos una visita.'}, formT='Consultá por una propiedad', msgL='¿Qué propiedad te interesa?'),
    ],
)
inmo['footer'] = foot(inmo['nav'])

# 10 ─────────────────────────────── ESTUDIO JURIDICO
legal = dict(
    slug='lex-norte-abogados', name='Lex Norte', rubro='Estudio jurídico', ref='#45 Legal Services · Trust & Authority + Editorial',
    title='Lex Norte Abogados | Laboral, familia, sucesiones y empresas', desc='Estudio jurídico demo con diseño editorial, evaluación inicial del caso paso a paso y turnos para consulta.',
    tagline='Abogados en derecho laboral, familia, sucesiones y empresas. Respuestas claras desde la primera consulta.',
    style='luxe', fonts={'d': 'EB Garamond', 'b': 'Lato', 'dw': '500', 'dfb': 'Georgia,serif'}, split='rise',
    tokens=tok(bg='#FBF8F2', bg2='#F1EBDD', fg='#1F2433', fg_strong='#0E1220', muted='#555C6E', primary='#1E3A8A', on_primary='#FFFFFF', primary_text='#1E3A8A',
               accent='#B45309', on_accent='#FFFFFF', card='#FFFFFF', line='#E2D9C6', r='2px', r_lg='2px', r_btn='0px', track='-.02em', case='none',
               ink_bg='#1E3A8A', ink_fg='#FFFFFF', h1='clamp(3rem,8vw,7.6rem)'),
    logo={'shape': 'shield', 't': 'L', 'size': 20},
    nav=[('Áreas', 'areas'), ('Tu caso', 'tu-caso'), ('Consultas', 'consultas'), ('Contacto', 'contacto')], hdrCta=('Pedir consulta', 'consultas'),
    hero=dict(type='editorial', eyebrow='Estudio jurídico', h1=['Defendemos', 'lo que es tuyo.'],
              lead='Te explicamos tu situación sin tecnicismos, con honorarios claros por escrito. Contanos tu caso en dos minutos.',
              cta1=('Evaluar mi caso', 'tu-caso'), cta2=('Pedir consulta', 'consultas'), points=[('scale', 'Laboral, familia y sucesiones'), ('file-pen-line', 'Honorarios por escrito'), ('video', 'Consultas por videollamada')],
              vis=A.scales('#B45309', '#1E3A8A')),
    css='''.hero--editorial h1{font-style:italic;font-weight:500}.hero--editorial .ed-title{border-bottom:1px solid var(--line);padding-bottom:28px;margin-bottom:12px}
.hero--editorial .ed-art{width:min(380px,100%);justify-self:end}.feat-list h3{font-family:var(--fd);font-size:1.6rem;font-weight:500}''',
    sections=[
        dict(kind='features', id='areas', layout='list', head={'eb': 'Áreas de práctica', 'h': 'Conocemos cada etapa del proceso.'}, items=[
            {'i': 'briefcase', 't': 'Derecho laboral', 'd': 'Despidos, accidentes de trabajo, trabajo no registrado y reclamos ante la ART.'},
            {'i': 'users', 't': 'Familia', 'd': 'Divorcios, cuota alimentaria, régimen de comunicación y adopciones.'},
            {'i': 'scroll-text', 't': 'Sucesiones', 'd': 'Declaratoria de herederos, testamentos y partición de bienes.'},
            {'i': 'building-2', 't': 'Empresas', 'd': 'Contratos, sociedades, marcas y asesoramiento mensual para pymes.'}]),
        dict(kind='module', id='tu-caso', mod='quiz', panel='Evaluación inicial', bg='alt',
             head={'eb': 'Tu caso', 'h': 'Contanos qué pasó, paso a paso.', 'p': 'Cuatro preguntas para que el abogado llegue a la consulta con tu caso ya leído.',
                   'bullets': [('lock', 'Información confidencial'), ('clock', 'Respuesta en 24 h hábiles'), ('check', 'Sin compromiso')]},
             cfg={'mode': 'summary', 'sumTitle': 'Resumen de tu consulta', 'sumText': 'Con esto, un abogado del área te contacta para la primera consulta. Esta demo no envía datos.', 'cta': 'Enviar al estudio', 'okMsg': 'Recibimos tu caso: te escribimos en 24 h hábiles (demo).',
                  'qs': [{'q': '¿Sobre qué tema es tu consulta?', 'short': 'Tema', 'opts': ['Laboral', 'Familia', 'Sucesión', 'Empresa o contrato']},
                         {'q': '¿Hace cuánto ocurrió?', 'short': 'Cuándo', 'opts': ['Menos de un mes', 'Entre 1 y 6 meses', 'Entre 6 meses y 2 años', 'Más de 2 años']},
                         {'q': '¿Tenés documentación?', 'short': 'Documentación', 'opts': ['Sí, completa', 'Algo tengo', 'No tengo nada', 'No sé qué necesito']},
                         {'q': '¿Cómo preferís la consulta?', 'short': 'Modalidad', 'opts': ['En el estudio', 'Por videollamada', 'Por teléfono', 'Me da igual']}]}),
        dict(kind='fill', id='principios', text='No prometemos resultados. Prometemos decirte la verdad sobre tu caso, trabajar cada expediente como si fuera el único y avisarte de cada novedad.'),
        dict(kind='module', id='consultas', mod='agenda', panel='Turnos para consulta', flip=True, bg='alt',
             head={'eb': 'Consultas', 'h': 'Reservá tu primera consulta.', 'p': 'Elegí el área, el abogado y el horario. La consulta dura 45 minutos.',
                   'bullets': [('video', 'Presencial o por videollamada'), ('calendar-plus', 'Agregala a tu calendario'), ('file-text', 'Te decimos qué documentos traer')]},
             cfg={'biz': 'Lex Norte Abogados', 'q1': '¿Sobre qué área?', 'q2': 'Elegí abogado', 'services': [{'n': 'Laboral', 'd': '45 minutos', 'm': 45, 'p': 35000}, {'n': 'Familia', 'd': '45 minutos', 'm': 45, 'p': 35000}, {'n': 'Sucesiones', 'd': '45 minutos', 'm': 45, 'p': 35000}, {'n': 'Empresas', 'd': '60 minutos', 'm': 60, 'p': 50000}],
                  'pros': [{'n': 'Dra. Carolina Ibarra', 'r': 'Laboral y previsional'}, {'n': 'Dr. Ignacio Ferreyra', 'r': 'Familia y sucesiones'}, {'n': 'Dra. Julieta Morán', 'r': 'Empresas y contratos'}],
                  'hours': ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00'], 'closed': [0, 6], 'okTitle': '¡Consulta reservada!', 'addr': 'Calle Tribunales 88'}),
        faq([('¿Cuánto cuesta la primera consulta?', 'Tiene un valor fijo que se descuenta de los honorarios si avanzamos con el caso.'),
             ('¿Trabajan con cuota litis?', 'En reclamos laborales sí: cobramos un porcentaje solo si se cobra.'),
             ('¿Atienden en otras provincias?', 'Por videollamada sí. Para juicios coordinamos con estudios corresponsales.')], center=True),
        contact([('map-pin', 'Estudio', 'Calle Tribunales 88, piso 3'), ('clock', 'Horario', 'Lun a vie · 9 a 13 y 16 a 19 h'), ('phone', 'Teléfono', '(0376) 400-0004')], head={'eb': 'Contacto', 'h': 'Escribinos con tranquilidad.'}, formT='Consulta confidencial', msgL='Contanos brevemente tu situación'),
    ],
)
legal['footer'] = foot(legal['nav'])

# 11 ─────────────────────────────── ESTUDIO CONTABLE
contable = dict(
    slug='balance-contable', name='Balance', rubro='Estudio contable', ref='#12 Fintech/Accounting · Swiss + Data-Dense Dashboard',
    title='Balance Estudio Contable | Monotributo, sociedades y sueldos', desc='Estudio contable demo: calendario de vencimientos por CUIT, tablero de ejemplo y planes mensuales.',
    tagline='Contadores para monotributistas, autónomos y pymes. Impuestos al día sin perseguirte.',
    style='swiss', fonts={'d': 'IBM Plex Sans', 'b': 'IBM Plex Sans', 'dw': '600'}, libs=['tilt'], split='slide',
    tokens=tok(bg='#F8FAFC', bg2='#EEF2F7', fg='#0F172A', fg_strong='#020617', muted='#475569', primary='#2563EB', on_primary='#FFFFFF', primary_text='#1D4ED8',
               accent='#059669', on_accent='#FFFFFF', card='#FFFFFF', line='#E2E8F0', r='4px', r_lg='8px', r_btn='4px', track='-.03em', case='none',
               ink_bg='#0F172A', ink_fg='#F8FAFC', mq_bg='#0F172A', mq_fg='#F8FAFC', mq_bw='0'),
    logo={'shape': 'square', 't': 'B', 'size': 22, 'r': 6},
    nav=[('Servicios', 'servicios'), ('Vencimientos', 'vencimientos'), ('Planes', 'planes'), ('Contacto', 'contacto')], hdrCta=('Hablar con un contador', 'contacto'),
    hero=dict(type='split', eyebrow='Estudio contable', h1=['Tus impuestos,', 'al día y', 'sin sustos.'],
              lead='Liquidamos, presentamos y te avisamos antes de cada vencimiento. Vos mirás todo desde un tablero simple.',
              cta1=('Ver mis vencimientos', 'vencimientos'), cta2=('Ver planes', 'planes'), points=[('calendar-clock', 'Alertas de vencimientos'), ('file-spreadsheet', 'Sueldos y cargas sociales'), ('messages-square', 'Respuesta en el día')],
              vis=A.dash_kpis('#2563EB', '#059669')),
    css='.hero--split .stage .appwin{max-width:560px;margin-left:auto}.cta-big{background:linear-gradient(120deg,#1D4ED8,#0F172A)}',
    sections=[
        marquee(['Monotributo', 'Responsables inscriptos', 'Sociedades', 'Sueldos', 'Ingresos brutos', 'Balances'], speed=36),
        dict(kind='features', id='servicios', layout='grid3', rv='scale', head={'eb': 'Servicios', 'h': 'Todo lo contable, en un solo lugar.'}, items=[
            {'i': 'receipt', 't': 'Monotributo', 'd': 'Alta, recategorización, facturación y pago mensual.'}, {'i': 'landmark', 't': 'Responsables inscriptos', 'd': 'IVA, ganancias y bienes personales.'},
            {'i': 'building-2', 't': 'Sociedades', 'd': 'Constitución, libros, balances y asambleas.'}, {'i': 'users', 't': 'Sueldos', 'd': 'Liquidación, recibos y cargas sociales.'},
            {'i': 'map', 't': 'Ingresos brutos', 'd': 'Local y convenio multilateral.'}, {'i': 'chart-line', 't': 'Tablero de gestión', 'd': 'Ventas, gastos y margen de tu negocio.'}]),
        dict(kind='module', id='vencimientos', mod='venc', layout='full', panel='Calendario de vencimientos', bg='alt',
             head={'eb': 'Probalo', 'h': 'Tus vencimientos según tu CUIT.', 'p': 'Elegí el último número de tu CUIT: el calendario marca qué vence y cuándo. Tocá un día para ver el detalle.'},
             cfg={'taxes': [{'n': 'Monotributo', 'day': 20, 'group': 10}, {'n': 'IVA', 'day': 18, 'group': 2}, {'n': 'Ingresos brutos', 'day': 13, 'group': 2}, {'n': 'Cargas sociales', 'day': 9, 'group': 4}, {'n': 'Autónomos', 'day': 5, 'group': 3}]}),
        dict(kind='steps', id='como-trabajamos', head={'eb': 'Cómo trabajamos', 'h': 'Simple, mes a mes.'}, items=[
            {'t': 'Nos pasás tus comprobantes', 'd': 'Por WhatsApp, email o una carpeta compartida.'}, {'t': 'Liquidamos', 'd': 'Revisamos y calculamos cada impuesto.'},
            {'t': 'Te avisamos', 'd': 'Tres días antes de cada vencimiento, con el monto.'}, {'t': 'Presentamos', 'd': 'Y te mandamos el comprobante.'}]),
        dict(kind='plans', id='planes', bg='alt', toggle=('Mensual', 'Anual (−15%)'), per=['/mes', '/mes, pago anual'], head={'eb': 'Planes', 'h': 'Un precio fijo, sin sorpresas.'}, plans=[
            {'n': 'Monotributo', 'd': 'Para independientes', 'm': 22000, 'y': 18700, 'f': ['Facturación y pago mensual', 'Recategorización', 'Alertas por WhatsApp']},
            {'n': 'Autónomo', 'd': 'Responsable inscripto', 'm': 55000, 'y': 46750, 'hot': True, 'tag': 'Más elegido', 'f': ['IVA y ganancias', 'Ingresos brutos', 'Tablero mensual', 'Consultas ilimitadas']},
            {'n': 'Pyme', 'd': 'Sociedades con empleados', 'm': 140000, 'y': 119000, 'f': ['Hasta 10 empleados', 'Sueldos y cargas', 'Balance anual', 'Reunión mensual']}], ctaHref='contacto'),
        faq([('¿Puedo cambiarme de contador en cualquier momento?', 'Sí. Pedimos la clave fiscal con delegación y nos ocupamos del traspaso.'),
             ('¿Atienden a distancia?', 'Sí. La mayoría de nuestros clientes nunca vino a la oficina.'),
             ('¿Qué pasa si tengo deudas con AFIP?', 'Revisamos tu situación y te proponemos un plan de pagos.')]),
        cta('Dejá de perseguir vencimientos.', 'Contanos tu actividad y te decimos qué plan te conviene. Respondemos en el día.', 'Hablar con un contador', 'contacto'),
        contact([('map-pin', 'Oficina', 'Calle Comercio 640'), ('clock', 'Horario', 'Lun a vie · 8 a 17 h'), ('mail', 'Email', 'hola@balance.demo')], head={'eb': 'Contacto', 'h': 'Hablemos de tus números.'}, formT='Consultá sin compromiso', msgL='¿A qué te dedicás?'),
    ],
)
contable['footer'] = foot(contable['nav'])

# 12 ─────────────────────────────── BARBERIA
barber = dict(
    slug='navaja-barber-club', name='Navaja', rubro='Barbería', ref='#38 Barbershop · Neubrutalism + Kinetic Typography',
    title='Navaja Barber Club | Cortes, barba y afeitado clásico', desc='Barbería demo con tipografía cinética, poste de barbero animado, turnos por barbero y membresía mensual.',
    tagline='Cortes, barba y afeitado a navaja. Música, café y turnos que se respetan.',
    style='brutal', fonts={'d': 'Anton', 'b': 'Epilogue', 'dw': '400'}, cursor=True, split='skew',
    tokens=tok(bg='#F2EDE4', bg2='#E6DECF', fg='#111111', fg_strong='#000000', muted='#4A4A4A', primary='#111111', on_primary='#F2EDE4', primary_text='#111111',
               accent='#D62828', on_accent='#FFFFFF', card='#FFFFFF', line='#111111', r='0px', r_lg='0px', r_btn='0px', track='.01em', case='uppercase',
               ink_bg='#D62828', ink_fg='#FFFFFF', mq_bg='#D62828', mq_fg='#FFFFFF', mq_bw='3px', card_bw='3px'),
    logo={'shape': 'square', 't': 'N', 'size': 26, 'r': 0},
    nav=[('Servicios', 'servicios'), ('Turnos', 'turnos'), ('Estilos', 'estilos'), ('Club', 'club'), ('Contacto', 'contacto')], hdrCta=('Sacar turno', 'turnos'),
    hero=dict(type='kinetic', eyebrow='Barber club', h1=['Corte.', 'Barba.', 'Actitud.'],
              lead='Barberos con oficio, turnos online por barbero y una cerveza o un café mientras esperás. Sin esperas, sin vueltas.',
              cta1=('Sacar turno', 'turnos'), cta2=('Ver estilos', 'estilos'), vis=A.barber_pole(), out='scale'),
    css='''.hero--kinetic .k-row:nth-child(2){color:var(--accent);padding-left:10vw}.hero--kinetic .k-row:nth-child(3){padding-left:20vw}
.hero--kinetic .k-sub .pole{justify-self:end}.stack-card .tag{background:rgba(255,255,255,.2);color:inherit}''',
    sections=[
        marquee(['Fade', 'Clásico', 'Barba', 'Navaja', 'Diseños', 'Color'], skew=True, speed=22),
        dict(kind='features', id='servicios', layout='grid3', head={'eb': 'Servicios', 'h': 'Lo que hacemos mejor.'}, items=[
            {'i': 'scissors', 't': 'Corte', 'd': 'Fade, clásico o tijera. Incluye lavado y peinado. 40 minutos.'},
            {'i': 'sparkles', 't': 'Barba', 'd': 'Perfilado, toalla caliente y aceite. 30 minutos.'},
            {'i': 'crown', 't': 'Ritual completo', 'd': 'Corte, barba y afeitado a navaja con espuma tibia. 75 minutos.'}]),
        dict(kind='module', id='turnos', mod='agenda', panel='Turnos', bg='alt',
             head={'eb': 'Turnos', 'h': 'Elegí tu barbero y tu horario.', 'p': 'Cada barbero tiene su agenda. Los horarios tomados aparecen bloqueados.',
                   'bullets': [('check', 'Sin esperas'), ('check', 'Recordatorio por WhatsApp'), ('check', 'Cancelás con un mensaje')]},
             cfg={'biz': 'Navaja Barber Club', 'q1': '¿Qué te hacés?', 'q2': 'Elegí tu barbero', 'services': [{'n': 'Corte', 'd': '40 minutos', 'm': 40, 'p': 14000}, {'n': 'Barba', 'd': '30 minutos', 'm': 30, 'p': 9000}, {'n': 'Corte + barba', 'd': '60 minutos', 'm': 60, 'p': 20000}, {'n': 'Ritual completo', 'd': '75 minutos', 'm': 75, 'p': 27000}],
                  'pros': [{'n': 'Facu', 'r': 'Fades y diseños'}, {'n': 'Rami', 'r': 'Clásicos y tijera'}, {'n': 'Lu', 'r': 'Barba y navaja'}],
                  'hours': ['10:00', '10:45', '11:30', '12:15', '15:00', '15:45', '16:30', '17:15', '18:00', '18:45', '19:30'], 'closed': [0, 1]}),
        dict(kind='gallery', id='estilos', head={'eb': 'Estilos', 'h': 'Elegí el tuyo o traé una foto.'}, layout='grid3', tiles=[
            {'t': 'Low fade', 'm': 'Corte', 'bg': '#111111', 'art': big('Fade', '#F2EDE4'), 'ratio': '1/1'},
            {'t': 'Pompadour', 'm': 'Corte', 'bg': '#D62828', 'art': big('Pomp', '#FFFFFF'), 'ratio': '1/1'},
            {'t': 'Barba candado', 'm': 'Barba', 'bg': '#E6DECF', 'art': big('Barba', '#111111'), 'ratio': '1/1'},
            {'t': 'Buzz cut', 'm': 'Corte', 'bg': '#E6DECF', 'art': big('Buzz', '#D62828'), 'ratio': '1/1'},
            {'t': 'Afeitado clásico', 'm': 'Navaja', 'bg': '#111111', 'art': big('Navaja', '#D62828', 'clamp(2.4rem,5vw,4rem)'), 'ratio': '1/1'},
            {'t': 'Texturizado', 'm': 'Corte', 'bg': '#D62828', 'art': big('Crop', '#111111'), 'ratio': '1/1'}]),
        dict(kind='stack', id='club', bg='alt', head={'eb': 'Navaja Club', 'h': 'Membresía mensual. Siempre prolijo.'}, cards=[
            {'tag': '$ 24.000 por mes', 't': 'Club Corte', 'd': 'Dos cortes por mes, prioridad en turnos de sábado y 10% en productos.', 'bg': '#111111', 'fg': '#F2EDE4', 'art': big('2x', '#D62828', 'clamp(5rem,12vw,9rem)')},
            {'tag': '$ 36.000 por mes', 't': 'Club Completo', 'd': 'Dos cortes y dos barbas por mes, más una bebida de la casa en cada visita.', 'bg': '#D62828', 'fg': '#FFFFFF', 'art': big('4x', '#111111', 'clamp(5rem,12vw,9rem)')},
            {'tag': 'Precios de ejemplo', 't': 'Sin permanencia', 'd': 'Te das de baja cuando quieras desde un mensaje. Sin letra chica.', 'bg': '#FFFFFF', 'fg': '#111111', 'art': big('OK', '#D62828', 'clamp(5rem,12vw,9rem)')}]),
        faq([('¿Atienden sin turno?', 'Si hay un barbero libre, sí. Con turno no esperás.'), ('¿Cortan a chicos?', 'Sí, desde los 6 años.'), ('¿Qué medios de pago aceptan?', 'Efectivo, débito, crédito y transferencia.')]),
        contact([('map-pin', 'Dirección', 'Calle del Barrio 404'), ('clock', 'Horario', 'Mar a sáb · 10 a 20.30 h'), ('instagram', 'Instagram', '@navaja.club')], head={'eb': 'Contacto', 'h': 'Pasá por el club.'}),
    ],
)
barber['footer'] = foot(barber['nav'])

# 13 ─────────────────────────────── LODGE
lodge = dict(
    slug='selva-lodge', name='Selva Lodge', rubro='Hotel boutique en la selva', ref='#29 Hotel/Resort · Liquid Luxury + Nature',
    title='Selva Lodge | Hotel boutique en la selva misionera', desc='Lodge demo: hojas animadas, habitaciones en scroll horizontal, reserva por calendario con total de la estadía.',
    tagline='Ocho suites entre la selva y el río. Desayuno de campo, excursiones y silencio.',
    style='luxe', fonts={'d': 'Cormorant', 'b': 'Montserrat', 'dw': '500', 'dfb': 'Georgia,serif'}, vis=True, loader=True, split='blur',
    tokens=tok(bg='#0F1D16', bg2='#15271E', fg='#E9E2D0', fg_strong='#FFF9EA', muted='#B3AC98', primary='#C9A96E', on_primary='#0F1D16', primary_text='#D9BC86',
               accent='#7FA77A', on_accent='#0F1D16', card='#16291F', line='rgba(233,226,208,.16)', r='0px', r_lg='0px', r_btn='0px', track='-.01em', case='none',
               ink_bg='#C9A96E', ink_fg='#0F1D16', mq_bg='transparent', mq_fg='#C9A96E', loader_bg='#0F1D16', loader_fg='#C9A96E', inp_bg='#0F1D16', h1='clamp(3rem,8.6vw,8rem)'),
    logo={'shape': 'arch', 't': 'S', 'size': 20},
    nav=[('Suites', 'suites'), ('Reservas', 'reservas'), ('Experiencias', 'experiencias'), ('Contacto', 'contacto')], hdrCta=('Reservar', 'reservas'),
    hero=dict(type='full', eyebrow='Hotel boutique · Misiones', h1=['Despertá', 'en la selva.'],
              lead='Ocho suites rodeadas de monte nativo, a veinte minutos de las cataratas. Elegí tus fechas y mirá el total de tu estadía al instante.',
              cta1=('Ver disponibilidad', 'reservas'), cta2=('Conocer las suites', 'suites'), points=[('trees', 'Reserva natural privada'), ('utensils', 'Desayuno de campo'), ('waves', 'Pileta con vista al río')],
              vis='<canvas class="bg-canvas" data-vis="leaves" data-c1="#2F6B45" data-c2="#A3C76D" aria-hidden="true"></canvas>'),
    css='''.hero--full h1{font-style:italic;font-weight:500}.hero--full::after{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(60% 70% at 30% 60%,rgba(15,29,22,.85),transparent)}
.cal button.edge{color:#0F1D16}''',
    sections=[
        marquee(['Selva', 'Río', 'Silencio', 'Cataratas', 'Aves', 'Estrellas'], speed=40),
        dict(kind='hs', id='suites', head={'eb': 'Suites', 'h': 'Ocho suites, ninguna igual.'}, cards=[
            {'t': 'Suite Copal', 'd': 'Deck propio sobre el monte y bañera exenta.', 'tag': 'Hasta 2 personas', 'bg': '#1F3A2B', 'art': A.trip('montana', '#2F6B45', '#C9A96E')},
            {'t': 'Suite Río', 'd': 'Ventanal al río Iguazú y hamaca paraguaya.', 'tag': 'Hasta 3 personas', 'bg': '#16291F', 'art': A.trip('cataratas', '#7FA77A', '#C9A96E')},
            {'t': 'Casa del Árbol', 'd': 'Elevada a seis metros, entre las copas.', 'tag': 'Hasta 2 personas', 'bg': '#1F3A2B', 'art': A.trip('montana', '#7FA77A', '#E9E2D0')},
            {'t': 'Familiar Yerba', 'd': 'Dos ambientes y galería con parrilla.', 'tag': 'Hasta 5 personas', 'bg': '#16291F', 'art': A.trip('playa', '#2F6B45', '#C9A96E')}]),
        dict(kind='module', id='reservas', mod='reserva', layout='full', panel='Disponibilidad', bg='alt',
             head={'eb': 'Reservas', 'h': 'Elegí tus fechas.', 'p': 'Tocá el día de llegada y el de salida. El total se calcula solo, con impuestos incluidos.'},
             cfg={'tax': 10, 'cta': 'Reservar estadía', 'rooms': [{'n': 'Suite Copal', 'd': 'Deck y bañera', 'p': 145000, 'cap': 2}, {'n': 'Suite Río', 'd': 'Vista al río', 'p': 168000, 'cap': 3}, {'n': 'Casa del Árbol', 'd': 'Entre las copas', 'p': 190000, 'cap': 2}, {'n': 'Familiar Yerba', 'd': 'Dos ambientes', 'p': 230000, 'cap': 5}]}),
        dict(kind='fill', id='filosofia', text='Construimos con madera de la zona, cocinamos con lo que da la huerta y dejamos que la selva marque el ritmo del día.'),
        dict(kind='features', id='experiencias', layout='grid3', head={'eb': 'Experiencias', 'h': 'Para llenar los días (o no).'}, items=[
            {'i': 'binoculars', 't': 'Avistaje de aves', 'd': 'Salidas al amanecer con guía local: más de 300 especies registradas.'},
            {'i': 'droplets', 't': 'Cataratas', 'd': 'Traslado y entradas a las cataratas, con almuerzo incluido.'},
            {'i': 'moon-star', 't': 'Noche de estrellas', 'd': 'Fogón, telescopio y cielo sin luces de ciudad.'}]),
        faq([('¿Se puede llegar sin auto?', 'Sí. Coordinamos el traslado desde el aeropuerto o la terminal.'), ('¿Aceptan mascotas?', 'No, para cuidar la fauna de la reserva.'),
             ('¿Cuál es la política de cancelación?', 'Devolución completa hasta 15 días antes de la llegada.')], center=True),
        contact([('map-pin', 'Ubicación', 'Ruta 12, km 1600 (ejemplo)'), ('plane', 'Aeropuerto', 'A 25 minutos'), ('phone', 'Reservas', '(03757) 40-0000')], head={'eb': 'Contacto', 'h': 'Te ayudamos a planear tu viaje.'}, formT='Consultá por fechas', msgL='Fechas y cantidad de huéspedes'),
    ],
)
lodge['footer'] = foot(lodge['nav'])

# 14 ─────────────────────────────── AGENCIA DE VIAJES
viajes = dict(
    slug='ruta-norte-viajes', name='Ruta Norte', rubro='Agencia de viajes', ref='#30 Travel/Tourism · Aurora UI + Glassmorphism',
    title='Ruta Norte Viajes | Paquetes, escapadas y viajes a medida', desc='Agencia de viajes demo: fondo aurora animado, ruta de avión, catálogo de destinos y armador de viaje con precio.',
    tagline='Paquetes nacionales e internacionales y viajes armados a tu medida, con asistencia 24 h.',
    style='glass', fonts={'d': 'Outfit', 'b': 'DM Sans', 'dw': '800'}, vis=True, libs=['tilt'], split='scale',
    tokens=tok(bg='#071526', bg2='#0C2038', fg='#E6EEF8', fg_strong='#FFFFFF', muted='#9FB3CC', primary='#38BDF8', on_primary='#04111F', primary_text='#7DD3FC',
               accent='#FB923C', on_accent='#04111F', card='#0F2744', line='rgba(255,255,255,.14)', r='18px', r_lg='28px', r_btn='999px', track='-.04em', case='none',
               ink_bg='#38BDF8', ink_fg='#04111F', mq_bg='transparent', mq_fg='#7DD3FC', inp_bg='#0A1B30', h1='clamp(2.8rem,7.6vw,7rem)'),
    logo={'shape': 'circle', 't': 'R', 'size': 22},
    nav=[('Destinos', 'destinos'), ('Armá tu viaje', 'arma-tu-viaje'), ('Cómo viajamos', 'como-viajamos'), ('Contacto', 'contacto')], hdrCta=('Armar mi viaje', 'arma-tu-viaje'),
    hero=dict(type='full', eyebrow='Agencia de viajes', h1=['El mundo', 'te espera.'],
              lead='Paquetes armados o viajes a tu medida, con asistencia las 24 horas desde que salís hasta que volvés.',
              cta1=('Ver destinos', 'destinos'), cta2=('Armar mi viaje', 'arma-tu-viaje'), points=[('plane', 'Vuelos y traslados'), ('hotel', 'Hoteles verificados'), ('headset', 'Asistencia 24 h')],
              vis='<canvas class="bg-canvas" data-vis="aurora" data-c1="#0EA5E9" data-c2="#FB923C" data-c3="#8B5CF6" aria-hidden="true"></canvas><div class="route" aria-hidden="true">%s</div>' % A.plane_route('#7DD3FC', '#FB923C')),
    css='''.hero--full .route{position:absolute;right:2%;top:16%;width:min(46vw,640px);z-index:-1;opacity:.9}
@media(max-width:860px){.hero--full .route{width:90vw;top:auto;bottom:4%;opacity:.45}}
.s-glass .card,.s-glass .panel,.s-glass .item{border-color:rgba(255,255,255,.14)}.item .art{background:rgba(255,255,255,.06)!important}''',
    sections=[
        marquee(['Cataratas', 'Patagonia', 'Brasil', 'Caribe', 'Europa', 'Norte argentino'], speed=32, dir='r'),
        dict(kind='module', id='destinos', mod='catalogo', layout='full', panel='Destinos',
             head={'eb': 'Destinos', 'h': 'Paquetes listos para salir.', 'p': 'Filtrá por tipo de viaje y guardá tus favoritos. Precios por persona, de ejemplo.'},
             cfg={'cats': ['Nacionales', 'Playa', 'Internacionales'], 'fav': True, 'action': 'Consultar', 'items': [
                 {'n': 'Cataratas del Iguazú · 4 noches', 'cat': 'Nacionales', 'p': 480000, 'svg': A.trip('cataratas', '#0EA5E9', '#FB923C'), 'tag': 'Más vendido', 'meta': [['plane', 'Aéreo'], ['hotel', 'Hotel 4★'], ['coffee', 'Desayuno']]},
                 {'n': 'Florianópolis · 7 noches', 'cat': 'Playa', 'p': 890000, 'svg': A.trip('playa', '#0EA5E9', '#FBBF24'), 'meta': [['bus', 'Bus cama'], ['hotel', 'Posada'], ['coffee', 'Desayuno']]},
                 {'n': 'Bariloche · 5 noches', 'cat': 'Nacionales', 'p': 650000, 'svg': A.trip('montana', '#38BDF8', '#F8FAFC'), 'meta': [['plane', 'Aéreo'], ['hotel', 'Hotel 3★'], ['mountain', 'Excursiones']]},
                 {'n': 'Punta Cana · 7 noches', 'cat': 'Playa', 'p': 2350000, 'svg': A.trip('playa', '#22D3EE', '#FB923C'), 'tag': 'All inclusive', 'meta': [['plane', 'Aéreo'], ['hotel', 'Resort 5★'], ['utensils', 'Todo incluido']]},
                 {'n': 'Madrid y Barcelona · 10 noches', 'cat': 'Internacionales', 'p': 3900000, 'svg': A.trip('ciudad', '#38BDF8', '#FB923C'), 'meta': [['plane', 'Aéreo'], ['train-front', 'Tren'], ['hotel', 'Hoteles 4★']]},
                 {'n': 'Salta y Jujuy · 6 noches', 'cat': 'Nacionales', 'p': 720000, 'svg': A.trip('montana', '#FB923C', '#FDE68A'), 'meta': [['plane', 'Aéreo'], ['car', 'Auto incluido'], ['hotel', 'Posadas']]}]}),
        dict(kind='module', id='arma-tu-viaje', mod='wizard', panel='Armá tu viaje', bg='alt',
             head={'eb': 'A tu medida', 'h': 'Armá tu viaje en cuatro pasos.', 'p': 'Elegí destino, cantidad de viajeros, noches y extras. Te mostramos un precio orientativo por grupo.',
                   'bullets': [('check', 'Cotización final en 24 h'), ('check', 'Pagás en cuotas'), ('check', 'Asistencia al viajero incluida')]},
             cfg={'base': 0, 'perQty': True, 'spread': .1, 'outLabel': 'Precio orientativo del grupo', 'cta': 'Pedir cotización', 'okMsg': 'Pedido de cotización enviado: te escribimos en 24 h (demo).',
                  'disclaimer': 'Precio orientativo para la demo: depende de fechas y disponibilidad.', 'steps': [
                 {'k': 'd', 'q': '¿A dónde querés ir?', 'short': 'Destino', 'type': 'choice', 'opts': [{'l': 'Norte argentino', 'i': 'mountain', 'a': 380000}, {'l': 'Playas de Brasil', 'i': 'sun', 'a': 520000}, {'l': 'Caribe', 'i': 'tree-palm', 'a': 1300000}, {'l': 'Europa', 'i': 'landmark', 'a': 2200000}]},
                 {'k': 'p', 'q': '¿Cuántos viajan?', 'short': 'Viajeros', 'type': 'range', 'min': 1, 'max': 8, 'def': 2, 'role': 'qty', 'unit': 'persona(s)'},
                 {'k': 'n', 'q': '¿Cuántas noches?', 'short': 'Noches', 'type': 'range', 'min': 3, 'max': 21, 'def': 7, 'role': 'add', 'each': 55000, 'unit': 'noches'},
                 {'k': 'x', 'q': '¿Qué sumamos?', 'short': 'Extras', 'type': 'choice', 'multi': True, 'opts': [{'l': 'Excursiones', 'a': 120000}, {'l': 'Auto de alquiler', 'a': 180000}, {'l': 'Seguro premium', 'a': 60000}, {'l': 'Nada más', 'a': 0}]}]}),
        dict(kind='steps', id='como-viajamos', head={'eb': 'Cómo viajamos', 'h': 'Vos disfrutás, nosotros resolvemos.'}, items=[
            {'t': 'Nos contás', 'd': 'Fechas, presupuesto y qué te gusta hacer.'}, {'t': 'Te proponemos', 'd': 'Dos o tres opciones con precios cerrados.'},
            {'t': 'Reservamos', 'd': 'Vuelos, hoteles, traslados y excursiones.'}, {'t': 'Te acompañamos', 'd': 'Asistencia por WhatsApp las 24 horas.'}]),
        faq([('¿Puedo pagar en cuotas?', 'Sí, con tarjeta de crédito y en algunos paquetes con transferencia en pagos.'), ('¿Qué pasa si se cancela mi vuelo?', 'Te reubicamos y gestionamos el reclamo por vos.'),
             ('¿Necesito pasaporte para Brasil?', 'No: con DNI vigente alcanza para argentinos.')]),
        contact([('map-pin', 'Oficina', 'Av. Viajeros 1500'), ('clock', 'Horario', 'Lun a vie 9 a 19 h · sáb 10 a 13 h'), ('headset', 'Asistencia', '24 h por WhatsApp')], head={'eb': 'Contacto', 'h': '¿A dónde vamos?'}, formT='Pedí tu cotización', msgL='Destino, fechas y cantidad de viajeros'),
    ],
)
viajes['footer'] = foot(viajes['nav'])

SITES = [arq, inmo, legal, contable, barber, lodge, viajes]
