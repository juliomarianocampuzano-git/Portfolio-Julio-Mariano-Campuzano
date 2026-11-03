# sitios_a.py · sitios 1 a 7. Negocios ficticios: nombres, precios y datos son de ejemplo.
import arte as A
from comun import tok, foot, contact, faq, cta, marquee

# 1 ─────────────────────────────── CONCESIONARIA
autos = dict(
    slug='austral-motors', name='Austral Motors', rubro='Concesionaria de autos', ref='#52 Automotive/Car Dealership · Motion-Driven + 3D',
    title='Austral Motors | 0 km y usados certificados con financiación', desc='Concesionaria demo: catálogo con filtros, auto 3D, simulador de cuotas y turnos para test drive.',
    tagline='0 km y usados certificados, con financiación en pesos y test drive a domicilio.',
    style='dark', fonts={'d': 'Syncopate', 'b': 'Archivo', 'dw': '700'}, libs=['three', 'tilt'], vis=True, loader=True, cursor=True, split='skew',
    tokens=tok(bg='#0B0F17', bg2='#111827', fg='#E5E7EB', fg_strong='#FFFFFF', muted='#9CA3AF', primary='#E11D2E', on_primary='#FFFFFF', primary_text='#FF6B75',
               accent='#F5F5F4', on_accent='#0B0F17', card='#121826', line='rgba(255,255,255,.1)', r='6px', r_lg='14px', r_btn='4px', track='.02em', case='uppercase',
               ink_bg='#E11D2E', ink_fg='#FFFFFF', mq_bg='#E11D2E', mq_fg='#FFFFFF', mq_bw='0', h1='clamp(2.1rem,6vw,5.6rem)', loader_bg='#E11D2E', loader_fg='#0B0F17'),
    logo={'shape': 'diamond', 't': 'A', 'size': 17},
    nav=[('Catálogo', 'catalogo'), ('Financiación', 'financiacion'), ('Test drive', 'test-drive'), ('Contacto', 'contacto')], hdrCta=('Simular cuota', 'financiacion'),
    hero=dict(type='full', eyebrow='0 km y usados certificados', h1=['Manejá', 'lo que', 'querés.'],
              lead='Girá el auto, elegí el color y simulá la cuota en segundos. Te lo llevamos a tu casa para que lo pruebes.',
              cta1=('Ver catálogo', 'catalogo'), cta2=('Simular cuota', 'financiacion'),
              points=[('shield-check', 'Usados con 150 puntos de control'), ('badge-percent', 'Financiación en pesos'), ('house', 'Test drive a domicilio')],
              vis='<canvas class="bg-canvas" data-vis="car3d" data-c1="#C8102E" aria-label="Auto deportivo en 3D girando" role="img"></canvas>'),
    css='''.hero--full{min-height:calc(100svh - 40px)}.hero--full .hero-copy{max-width:640px}
.hero--full .bg-canvas{left:28%;width:72%}.hero--full::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,#0B0F17 18%,transparent 62%),linear-gradient(0deg,#0B0F17,transparent 30%)}
@media(max-width:860px){.hero--full .bg-canvas{left:0;width:100%;height:58%;top:0}.hero--full::after{background:linear-gradient(0deg,#0B0F17 45%,transparent 75%)}}
.item .art{background:radial-gradient(circle at 50% 70%,#1F2937,#0B0F17 70%)!important}''',
    sections=[
        marquee(['0 km', 'Usados certificados', 'Permutas', 'Financiación', 'Test drive', 'Garantía escrita'], skew=True),
        dict(kind='module', id='catalogo', mod='catalogo', layout='full', panel='Catálogo en vivo',
             head={'eb': 'Stock disponible', 'h': 'Filtrá, compará y guardá tus favoritos.', 'p': 'Elegí una categoría: la grilla se reordena sola. Tocá “Simular cuota” en cualquier auto.'},
             cfg={'cats': ['0 km', 'Usados', 'SUV', 'Pickup'], 'fav': True, 'action': 'Simular cuota', 'actMode': 'cuotas', 'items': [
                 {'n': 'Vento GT 1.4 TSI', 'cat': '0 km', 'p': 38900000, 'svg': A.car('sedan', '#C8102E'), 'tag': 'Nuevo', 'meta': [['gauge', '0 km'], ['fuel', 'Nafta'], ['settings-2', 'Automático']]},
                 {'n': 'Taos Highline', 'cat': 'SUV', 'p': 47500000, 'svg': A.car('suv', '#E5E7EB'), 'meta': [['gauge', '0 km'], ['fuel', 'Nafta'], ['settings-2', 'Automático']]},
                 {'n': 'Hilux SRX 4x4', 'cat': 'Pickup', 'p': 56200000, 'svg': A.car('pickup', '#374151'), 'meta': [['gauge', '12.000 km'], ['fuel', 'Diésel'], ['settings-2', 'Automática']]},
                 {'n': 'Polo Track', 'cat': '0 km', 'p': 24900000, 'svg': A.car('hatch', '#2563EB'), 'tag': 'Más vendido', 'meta': [['gauge', '0 km'], ['fuel', 'Nafta'], ['settings-2', 'Manual']]},
                 {'n': 'Cruze LTZ 2021', 'cat': 'Usados', 'p': 21800000, 'svg': A.car('sedan', '#9CA3AF'), 'meta': [['gauge', '48.000 km'], ['fuel', 'Nafta'], ['settings-2', 'Automático']]},
                 {'n': 'Ranger XLT 2022', 'cat': 'Pickup', 'p': 41300000, 'svg': A.car('pickup', '#1E3A8A'), 'meta': [['gauge', '35.000 km'], ['fuel', 'Diésel'], ['settings-2', 'Manual']]},
                 {'n': 'Tracker Premier', 'cat': 'SUV', 'p': 33700000, 'svg': A.car('suv', '#B91C1C'), 'meta': [['gauge', '0 km'], ['fuel', 'Nafta'], ['settings-2', 'Automática']]},
                 {'n': 'Toro Coupé Sport', 'cat': 'Usados', 'p': 29400000, 'svg': A.car('coupe', '#F59E0B'), 'meta': [['gauge', '22.000 km'], ['fuel', 'Nafta'], ['settings-2', 'Automático']]}]}),
        dict(kind='module', id='financiacion', mod='cuotas', panel='Simulador de cuotas', bg='alt',
             head={'eb': 'Financiación', 'h': 'Sabé cuánto pagás por mes antes de venir.', 'p': 'Mové el precio y el anticipo. La cuota se recalcula al instante.',
                   'bullets': [('check', 'Hasta 60 cuotas en pesos'), ('check', 'Tomamos tu usado como parte de pago'), ('check', 'Aprobación en el día')]},
             cfg={'label': 'Precio del vehículo', 'price': 38900000, 'min': 8000000, 'max': 80000000, 'step': 100000, 'rate': 39, 'terms': [12, 24, 36, 48, 60], 'downMin': 20, 'cta': 'Reservar test drive', 'ctaHref': 'test-drive'}),
        dict(kind='hs', id='showroom', head={'eb': 'Showroom', 'h': 'Un estilo para cada camino.'}, cards=[
            {'t': 'Sedán', 'd': 'Confort para la ruta y consumo bajo en ciudad.', 'art': A.car('sedan', '#E11D2E'), 'bg': '#0F1522', 'tag': '8 modelos'},
            {'t': 'SUV', 'd': 'Altura, espacio y tracción para la familia.', 'art': A.car('suv', '#F5F5F4'), 'bg': '#0F1522', 'tag': '6 modelos'},
            {'t': 'Pickup', 'd': 'Fuerza para el trabajo, cabina doble para el finde.', 'art': A.car('pickup', '#6B7280'), 'bg': '#0F1522', 'tag': '5 modelos'},
            {'t': 'Hatchback', 'd': 'Ágil para estacionar y fácil de mantener.', 'art': A.car('hatch', '#3B82F6'), 'bg': '#0F1522', 'tag': '7 modelos'},
            {'t': 'Coupé', 'd': 'Diseño deportivo para los que disfrutan manejar.', 'art': A.car('coupe', '#F59E0B'), 'bg': '#0F1522', 'tag': '3 modelos'}]),
        dict(kind='features', id='servicios', layout='grid3', tilt=True, head={'eb': 'Más que vender autos', 'h': 'Todo resuelto en un solo lugar.'}, items=[
            {'i': 'repeat', 't': 'Permuta en el día', 'd': 'Tasamos tu usado con un informe claro y lo tomamos como parte de pago.'},
            {'i': 'file-check', 't': 'Gestoría incluida', 'd': 'Transferencia, patentamiento y seguro listos para que salgas manejando.'},
            {'i': 'wrench', 't': 'Service oficial', 'd': 'Turnos online, presupuesto antes de tocar el auto y repuestos originales.'}]),
        dict(kind='module', id='test-drive', mod='agenda', panel='Turnos', flip=True, bg='alt',
             head={'eb': 'Test drive', 'h': 'Probalo donde quieras.', 'p': 'Elegí qué necesitás, el día y el horario. Te confirmamos al instante.',
                   'bullets': [('map-pin', 'Vamos a tu casa o trabajo'), ('clock', 'Turnos de 30 minutos'), ('calendar-plus', 'Agregalo a tu calendario')]},
             cfg={'biz': 'Austral Motors', 'q1': '¿Qué querés hacer?', 'services': [{'n': 'Test drive', 'd': '30 minutos, a domicilio', 'm': 30}, {'n': 'Tasación de tu usado', 'd': 'Informe en el momento', 'm': 45}, {'n': 'Service programado', 'd': 'Con presupuesto previo', 'm': 120}],
                  'hours': ['09:00', '09:30', '10:00', '11:00', '11:30', '12:00', '15:00', '16:00', '16:30', '17:30', '18:00'], 'extra': 'Modelo que te interesa', 'closed': [0], 'addr': 'Av. Siempreviva 1200'}),
        faq([('¿Puedo entregar mi auto como parte de pago?', 'Sí. Lo tasamos en el día con un informe por escrito y el valor se descuenta del precio del auto que elijas.'),
             ('¿Qué incluye la garantía de los usados?', 'Doce meses de garantía escrita en motor y caja, más el informe de los 150 puntos de control.'),
             ('¿Cuánto tarda la aprobación del crédito?', 'Con DNI y recibo de sueldo o constancia de monotributo, la respuesta llega el mismo día.'),
             ('¿El test drive tiene costo?', 'No. Es gratis y lo hacemos donde te quede cómodo dentro de la ciudad.')], center=True),
        cta('Tu próximo auto te está esperando.', 'Reservá un test drive y llevate la tasación de tu usado en la misma visita.', 'Reservar test drive', 'test-drive'),
        contact([('map-pin', 'Dirección', 'Av. Siempreviva 1200'), ('clock', 'Horario', 'Lun a sáb · 9 a 19 h'), ('phone', 'Teléfono', '(0376) 400-0000')], head={'eb': 'Contacto', 'h': 'Vení a verlos en persona.'}, formT='Consultá por un modelo', msgL='¿Qué modelo te interesa?'),
    ],
)
autos['footer'] = foot(autos['nav'])
autos['hero']['extra'] = ('<div class="swatches" role="group" aria-label="Color del auto" data-in>%s</div>'
    % ''.join('<button type="button" data-car-color="%s" aria-label="%s" aria-pressed="%s" style="background:%s"></button>' % (c, n, 'true' if i == 0 else 'false', c)
              for i, (c, n) in enumerate([('#C8102E', 'Rojo'), ('#E5E7EB', 'Blanco perla'), ('#1F2937', 'Gris grafito'), ('#1D4ED8', 'Azul'), ('#F59E0B', 'Amarillo')])))

# 2 ─────────────────────────────── SOFTWARE PARA VETERINARIAS
vet = dict(
    slug='patita-vet', name='Patita', rubro='Software para veterinarias', ref='#61 Veterinary Clinic · Claymorphism + Accessible',
    title='Patita | Software para veterinarias: turnos, fichas y recetas', desc='Software demo para veterinarias: turnos online, ficha de cada mascota con vacunas y recetas en PDF.',
    tagline='Turnos, historias clínicas y recetas de tu veterinaria en un solo lugar.',
    style='clay', fonts={'d': 'Baloo 2', 'b': 'Nunito Sans', 'dw': '800'}, libs=['pdf', 'tilt'], split='rise',
    tokens=tok(bg='#F0FDFA', bg2='#CCFBF1', fg='#134E4A', fg_strong='#042F2E', muted='#3F6B66', primary='#0D9488', on_primary='#FFFFFF', primary_text='#0F766E',
               accent='#EA580C', on_accent='#FFFFFF', card='#FFFFFF', line='#B5E4DD', r='18px', r_lg='28px', r_btn='999px', track='-.01em', case='none',
               ink_bg='#134E4A', ink_fg='#F0FDFA', mq_bg='#EA580C', mq_fg='#FFFFFF', mq_bw='0', inp_bg='#F7FFFD'),
    logo={'shape': 'circle', 't': 'P', 'size': 22},
    nav=[('Funciones', 'funciones'), ('Turnos', 'agenda'), ('Fichas', 'fichas'), ('Recetas', 'recetas'), ('Planes', 'planes')], hdrCta=('Probar gratis', 'planes'),
    hero=dict(type='split', eyebrow='Software para veterinarias', h1=['Tu veterinaria', 'en orden,', 'sin papeles.'],
              lead='Turnos que se reservan solos, la ficha de cada mascota con sus vacunas y recetas en PDF listas para imprimir. Probá todo acá abajo.',
              cta1=('Probar la demo', 'agenda'), cta2=('Ver planes', 'planes'), points=[('bell-ring', 'Recordatorios de vacunas'), ('file-text', 'Recetas en PDF'), ('smartphone', 'Funciona en el celular')],
              vis=A.app_vet('#0D9488', '#EA580C') + '<div class="floater" style="left:-24px;bottom:40px">%s Luna: vacuna al día</div><div class="floater" style="right:-10px;top:-18px;animation-delay:1.2s">%s Recordatorio enviado</div><div style="position:absolute;right:-30px;bottom:-40px;width:110px;opacity:.9;transform:rotate(18deg)">%s</div>'
                  % ('<svg class="ico"><use href="#i-syringe"/></svg>', '<svg class="ico"><use href="#i-message-circle"/></svg>', A.paw('#EA580C'))),
    css='.hero--split .stage{padding:20px}.cta-big{background:linear-gradient(135deg,#0D9488,#0F766E)}',
    sections=[
        marquee(['Turnos online', 'Fichas clínicas', 'Vacunas', 'Recetas', 'Recordatorios', 'Pet shop'], speed=26),
        dict(kind='features', id='funciones', layout='bento', head={'eb': 'Funciones', 'h': 'Pensado con veterinarios, no con programadores.', 'p': 'Cada pantalla resuelve una tarea del día a día, en menos clics.'}, items=[
            {'i': 'calendar-days', 't': 'Agenda compartida', 'd': 'Todo el equipo ve los turnos en tiempo real, desde la compu o el celular. Los tutores reservan solos desde tu web o WhatsApp.'},
            {'i': 'paw-print', 't': 'Ficha de cada mascota', 'd': 'Historia, peso, alergias y vacunas en una sola vista.'},
            {'i': 'syringe', 't': 'Plan de vacunación', 'd': 'Avisa qué vacuna toca y a quién recordarle.'},
            {'i': 'file-text', 't': 'Recetas en PDF', 'd': 'Con tu logo, matrícula e indicaciones.'},
            {'i': 'message-circle', 't': 'Recordatorios', 'd': 'Por WhatsApp, 24 h antes de cada turno.'},
            {'i': 'chart-column', 't': 'Caja y reportes', 'd': 'Ingresos por servicio y por profesional.'}]),
        dict(kind='module', id='agenda', mod='agenda', panel='Reserva de turnos', bg='alt',
             head={'eb': 'Probalo: turnos', 'h': 'Así reserva un tutor desde el celular.', 'p': 'Servicio, profesional, día y horario. Los horarios ocupados no se pueden elegir.',
                   'bullets': [('check', 'Sin llamadas ni mensajes cruzados'), ('check', 'El turno queda en la agenda del equipo'), ('check', 'Archivo .ics para el calendario')]},
             cfg={'biz': 'Veterinaria del Parque', 'q1': '¿Qué necesita tu mascota?', 'services': [{'n': 'Consulta clínica', 'd': '30 minutos', 'm': 30}, {'n': 'Vacunación', 'd': '15 minutos', 'm': 15}, {'n': 'Baño y corte', 'd': '90 minutos', 'm': 90}, {'n': 'Control post cirugía', 'd': '20 minutos', 'm': 20}],
                  'pros': [{'n': 'Dra. Sofía Ledesma', 'r': 'Clínica general'}, {'n': 'Dr. Martín Acosta', 'r': 'Cirugía y traumatología'}, {'n': 'Lic. Paula Benítez', 'r': 'Peluquería canina'}],
                  'hours': ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'], 'extra': 'Nombre de tu mascota', 'nameLabel': 'Tu nombre (tutor)', 'closed': [0]}),
        dict(kind='module', id='fichas', mod='ficha', panel='Fichas clínicas', flip=True,
             head={'eb': 'Probalo: fichas', 'h': 'La historia completa, en una sola pantalla.', 'p': 'Buscá una mascota, mirá sus visitas y vacunas, y agregá una nota de evolución.',
                   'bullets': [('check', 'Alertas de alergias a la vista'), ('check', 'Vacunas vencidas en rojo'), ('check', 'Recordatorio en un clic')]},
             cfg={'noun': 'mascota', 'tab2': 'Vacunas', 'items': [
                 {'n': 'Luna', 'ini': 'L', 'sub': 'Golden retriever · 4 años', 'info': 'Tutor: Carla Méndez · 29,4 kg · Castrada', 'alert': 'Alérgica a la penicilina',
                  'visits': [{'d': '12/09', 't': 'Control anual', 'x': 'Buen estado general. Se indica antiparasitario.'}, {'d': '03/05', 't': 'Otitis leve', 'x': 'Gotas óticas por 7 días. Mejoró.'}, {'d': '18/01', 't': 'Vacuna séxtuple', 'x': 'Aplicada sin reacciones.'}],
                  'vacc': [{'n': 'Antirrábica', 'd': 'Aplicada 12/09 · vence 09/2026', 's': 'ok'}, {'n': 'Séxtuple', 'd': 'Refuerzo en 15 días', 's': 'due'}, {'n': 'Tos de las perreras', 'd': 'Venció hace 2 meses', 's': 'bad'}]},
                 {'n': 'Toby', 'ini': 'T', 'sub': 'Mestizo · 7 años', 'info': 'Tutor: Javier Ríos · 14,1 kg', 'alert': '',
                  'visits': [{'d': '28/10', 't': 'Limpieza dental', 'x': 'Con anestesia general. Recuperación normal.'}, {'d': '02/06', 't': 'Control de peso', 'x': 'Bajó 1,2 kg con la dieta indicada.'}],
                  'vacc': [{'n': 'Antirrábica', 'd': 'Al día', 's': 'ok'}, {'n': 'Séxtuple', 'd': 'Al día', 's': 'ok'}]},
                 {'n': 'Milo', 'ini': 'M', 'sub': 'Gato europeo · 2 años', 'info': 'Tutora: Ana Torres · 4,8 kg · Castrado', 'alert': '',
                  'visits': [{'d': '15/10', 't': 'Consulta por vómitos', 'x': 'Bolas de pelo. Pasta de malta y control.'}],
                  'vacc': [{'n': 'Triple felina', 'd': 'Refuerzo este mes', 's': 'due'}, {'n': 'Antirrábica', 'd': 'Al día', 's': 'ok'}]},
                 {'n': 'Nala', 'ini': 'N', 'sub': 'Bulldog francés · 3 años', 'info': 'Tutor: Diego Paz · 11,9 kg', 'alert': 'Braquicéfala: anestesia con cuidado',
                  'visits': [{'d': '20/10', 't': 'Prequirúrgico', 'x': 'Análisis normales. Cirugía de paladar programada.'}],
                  'vacc': [{'n': 'Séxtuple', 'd': 'Venció la semana pasada', 's': 'bad'}, {'n': 'Antirrábica', 'd': 'Al día', 's': 'ok'}]}]}),
        dict(kind='module', id='recetas', mod='receta', panel='Receta veterinaria', bg='alt',
             head={'eb': 'Probalo: recetas', 'h': 'Una receta prolija en diez segundos.', 'p': 'Completá la mascota, elegí la medicación de la lista y descargá el PDF con tu membrete.',
                   'bullets': [('check', 'Autocompleta medicamentos frecuentes'), ('check', 'Queda guardada en la ficha'), ('check', 'Se envía por WhatsApp al tutor')]},
             cfg={'biz': 'Veterinaria del Parque', 'pro': 'Dra. Sofía Ledesma', 'mat': 'M.P. 0000 (ejemplo)', 'patient': 'Mascota', 'idLabel': 'Tutor', 'defPatient': 'Luna (Golden, 29 kg)', 'defId': 'Carla Méndez',
                  'meds': ['Amoxicilina + ác. clavulánico 250 mg', 'Meloxicam 1,5 mg/ml suspensión', 'Prednisolona 5 mg', 'Metronidazol 250 mg', 'Gotas óticas (otomax)'],
                  'posos': ['1 comprimido cada 12 h por 7 días', '0,1 ml/kg cada 24 h por 5 días', '½ comprimido cada 24 h por 10 días', '3 gotas en cada oído cada 12 h'],
                  'defNote': 'Dar con comida. Volver a control en 7 días o antes si hay vómitos.', 'pdfColor': [13, 148, 136], 'addr': 'Veterinaria del Parque · demo de Patita'}),
        dict(kind='steps', id='implementacion', head={'eb': 'Empezar es fácil', 'h': 'Funcionando en una semana.'}, center=False, items=[
            {'t': 'Importamos tus datos', 'd': 'Pasamos tus planillas de clientes y mascotas sin que pierdas nada.'},
            {'t': 'Configuramos la agenda', 'd': 'Profesionales, servicios, horarios y duración de cada turno.'},
            {'t': 'Capacitamos al equipo', 'd': 'Una hora por videollamada y una guía corta para consultar.'},
            {'t': 'Publicás tu link', 'd': 'En Instagram, Google y WhatsApp para recibir reservas.'}]),
        dict(kind='plans', id='planes', bg='alt', center=True, toggle=('Mensual', 'Anual (2 meses gratis)'), per=['/mes', '/mes, pago anual'],
             head={'eb': 'Planes', 'h': 'Elegí según el tamaño de tu equipo.'}, plans=[
                 {'n': 'Consultorio', 'd': 'Para un profesional', 'm': 18000, 'y': 15000, 'f': ['1 profesional', 'Agenda y turnos online', 'Fichas ilimitadas', 'Recetas en PDF']},
                 {'n': 'Clínica', 'd': 'El más elegido', 'm': 36000, 'y': 30000, 'hot': True, 'tag': 'Recomendado', 'f': ['Hasta 5 profesionales', 'Recordatorios por WhatsApp', 'Plan de vacunación', 'Caja y reportes']},
                 {'n': 'Hospital', 'd': 'Varias sedes', 'm': 72000, 'y': 60000, 'f': ['Profesionales ilimitados', 'Varias sucursales', 'Internación', 'Soporte prioritario']}],
             note='Precios de ejemplo para la demo. Incluyen 14 días de prueba.', ctaHref='agenda'),
        faq([('¿Necesito instalar algo?', 'No. Funciona en el navegador de la compu, la tablet o el celular.'),
             ('¿Puedo pasar mis datos actuales?', 'Sí. Importamos clientes, mascotas y vacunas desde Excel o tu sistema anterior.'),
             ('¿Los tutores tienen que descargar una app?', 'No. Reservan desde un link y reciben los recordatorios por WhatsApp.'),
             ('¿Qué pasa con mis datos si me doy de baja?', 'Te los llevás completos en Excel y PDF. Son tuyos.')]),
        cta('Dejá el cuaderno de turnos.', 'Probá Patita 14 días con tu equipo. Si no te sirve, no pagás nada.', 'Empezar la prueba', 'planes'),
    ],
)
vet['footer'] = foot(vet['nav'])

# 3 ─────────────────────────────── CENTRO MEDICO
medico = dict(
    slug='centro-medico-alba', name='Centro Médico Alba', rubro='Consultorio médico', ref='#58 Medical Clinic · Accessible & Ethical + Swiss',
    title='Centro Médico Alba | Turnos online, recetas e historia clínica', desc='Clínica demo con turnos online por especialidad, recetas digitales en PDF e historia clínica del paciente.',
    tagline='Clínica médica, pediatría y especialidades con turnos online y recetas digitales.',
    style='soft', fonts={'d': 'Figtree', 'b': 'Figtree', 'dw': '800'}, libs=['pdf'], split='blur',
    tokens=tok(bg='#F7FBFC', bg2='#E6F4F7', fg='#0F2F3A', fg_strong='#082129', muted='#4B6670', primary='#0E7490', on_primary='#FFFFFF', primary_text='#0E7490',
               accent='#16A34A', on_accent='#FFFFFF', card='#FFFFFF', line='#D5E7EC', r='12px', r_lg='20px', r_btn='12px', track='-.035em', case='none',
               ink_bg='#0E7490', ink_fg='#FFFFFF', h1='clamp(2.6rem,6.6vw,5.8rem)', maxw='1180px'),
    logo={'shape': 'square', 't': '+', 'size': 26, 'r': 12},
    nav=[('Especialidades', 'especialidades'), ('Turnos', 'turnos'), ('Recetas', 'recetas'), ('Historia clínica', 'historia'), ('Contacto', 'contacto')], hdrCta=('Sacar turno', 'turnos'),
    hero=dict(type='center', eyebrow='Atención presencial y por videollamada', h1=['Tu salud,', 'sin filas ni esperas.'],
              lead='Sacá turno en un minuto, recibí tus recetas en el celular y tené tus estudios siempre a mano.',
              cta1=('Sacar turno', 'turnos'), cta2=('Ver especialidades', 'especialidades'), points=[('clock', 'Turnos en el día'), ('video', 'Teleconsulta'), ('shield-check', 'Obras sociales y prepagas')],
              vis='<div style="max-width:960px;margin:0 auto">%s</div>' % A.app_portal('#0E7490')),
    css='.hero--center{background:radial-gradient(60% 50% at 50% 0%,#D7EEF3,transparent)}.hero--center h1{max-width:14ch;margin-inline:auto}',
    sections=[
        dict(kind='features', id='especialidades', layout='grid3', rv='scale', head={'eb': 'Especialidades', 'h': 'Todo tu equipo médico en un mismo lugar.'}, items=[
            {'i': 'stethoscope', 't': 'Clínica médica', 'd': 'Controles, chequeos anuales y seguimiento de enfermedades crónicas.'},
            {'i': 'baby', 't': 'Pediatría', 'd': 'Controles de niño sano, vacunas y certificados escolares.'},
            {'i': 'heart-pulse', 't': 'Cardiología', 'd': 'Electrocardiograma, ecocardiograma y apto físico.'},
            {'i': 'flower-2', 't': 'Ginecología', 'd': 'Controles anuales, PAP y colposcopía.'},
            {'i': 'scan-face', 't': 'Dermatología', 'd': 'Control de lunares, acné y tratamientos de piel.'},
            {'i': 'apple', 't': 'Nutrición', 'd': 'Planes de alimentación personalizados y seguimiento.'}]),
        dict(kind='module', id='turnos', mod='agenda', panel='Turnos online', bg='alt',
             head={'eb': 'Probalo: turnos', 'h': 'Elegí especialidad, médico y horario.', 'p': 'Ves los turnos libres reales de cada profesional y confirmás en el momento.',
                   'bullets': [('check', 'Recordatorio 24 h antes'), ('check', 'Cancelás o cambiás con un mensaje'), ('check', 'Opción de teleconsulta')]},
             cfg={'biz': 'Centro Médico Alba', 'q1': '¿Qué especialidad necesitás?', 'services': [{'n': 'Clínica médica', 'd': 'Consulta de 20 minutos', 'm': 20}, {'n': 'Pediatría', 'd': 'Consulta de 30 minutos', 'm': 30}, {'n': 'Cardiología', 'd': 'Incluye electrocardiograma', 'm': 40}, {'n': 'Teleconsulta', 'd': 'Por videollamada', 'm': 20}],
                  'pros': [{'n': 'Dra. Paula Ríos', 'r': 'Clínica médica'}, {'n': 'Dr. Andrés Cabral', 'r': 'Cardiología'}, {'n': 'Dra. Lucía Sosa', 'r': 'Pediatría'}],
                  'hours': ['08:00', '08:20', '08:40', '09:00', '10:00', '10:20', '11:40', '14:00', '14:20', '15:00', '16:40', '17:00'], 'extra': 'Obra social o prepaga', 'nameLabel': 'Nombre y apellido', 'closed': [0, 6], 'okTitle': '¡Turno reservado!'}),
        dict(kind='module', id='recetas', mod='receta', panel='Receta digital', flip=True,
             head={'eb': 'Para profesionales', 'h': 'Recetas digitales prolijas y legibles.', 'p': 'El médico completa la medicación y el paciente la recibe en PDF en su celular.',
                   'bullets': [('check', 'Nada de letra ilegible'), ('check', 'Historial de recetas por paciente'), ('check', 'Firma digital en la versión real')]},
             cfg={'biz': 'Centro Médico Alba', 'pro': 'Dra. Paula Ríos · Clínica médica', 'mat': 'M.N. 000000 (ejemplo)', 'patient': 'Paciente', 'idLabel': 'DNI', 'defPatient': 'María González', 'defId': '30.000.000',
                  'meds': ['Losartán 50 mg', 'Atorvastatina 10 mg', 'Amoxicilina 500 mg', 'Ibuprofeno 400 mg', 'Omeprazol 20 mg', 'Levotiroxina 50 mcg'],
                  'posos': ['1 comprimido por día', '1 comprimido cada 8 h por 7 días', '1 comprimido en ayunas', '1 comprimido cada 12 h si hay dolor'],
                  'defNote': 'Control de presión en 30 días. Dieta hiposódica.', 'pdfColor': [14, 116, 144], 'addr': 'Centro Médico Alba · demo'}),
        dict(kind='module', id='historia', mod='ficha', panel='Historia clínica', bg='alt',
             head={'eb': 'Historia clínica', 'h': 'Toda la información del paciente, ordenada.', 'p': 'Consultas, estudios y alertas en una línea de tiempo. Cada profesional ve lo que necesita.',
                   'bullets': [('lock', 'Acceso solo para profesionales'), ('check', 'Estudios con su estado'), ('check', 'Alergias siempre visibles')]},
             cfg={'noun': 'paciente', 'tab2': 'Estudios', 'items': [
                 {'n': 'María González', 'ini': 'MG', 'sub': '54 años · Plan 210', 'info': 'Hipertensión controlada · Última visita: hace 2 meses', 'alert': 'Alergia: sulfas',
                  'visits': [{'d': '02/09', 't': 'Control de presión', 'x': '130/85. Se ajusta dosis de losartán.'}, {'d': '14/06', 't': 'Chequeo anual', 'x': 'Laboratorio pedido. Colesterol LDL elevado.'}],
                  'vacc': [{'n': 'Laboratorio completo', 'd': 'Resultado cargado', 's': 'ok'}, {'n': 'Electrocardiograma', 'd': 'Pendiente de turno', 's': 'due'}, {'n': 'Mamografía', 'd': 'Vencida (más de 1 año)', 's': 'bad'}]},
                 {'n': 'Tomás Herrera', 'ini': 'TH', 'sub': '8 años · Particular', 'info': 'Control de niño sano', 'alert': '',
                  'visits': [{'d': '20/10', 't': 'Control pediátrico', 'x': 'Peso y talla acordes. Apto escolar entregado.'}],
                  'vacc': [{'n': 'Calendario de vacunas', 'd': 'Completo para la edad', 's': 'ok'}]},
                 {'n': 'Roberto Duarte', 'ini': 'RD', 'sub': '67 años · PAMI', 'info': 'Seguimiento cardiológico', 'alert': 'Anticoagulado',
                  'visits': [{'d': '11/10', 't': 'Cardiología', 'x': 'Ecocardiograma sin cambios. Continúa tratamiento.'}, {'d': '05/07', 't': 'Guardia', 'x': 'Palpitaciones. Holter indicado.'}],
                  'vacc': [{'n': 'Holter 24 h', 'd': 'Informe listo', 's': 'ok'}, {'n': 'Ecocardiograma', 'd': 'Próximo en marzo', 's': 'due'}]}]}),
        dict(kind='steps', id='teleconsulta', head={'eb': 'Teleconsulta', 'h': 'Atendete desde tu casa, en cuatro pasos.'}, items=[
            {'t': 'Reservá', 'd': 'Elegí “Teleconsulta” al sacar el turno.'}, {'t': 'Recibí el link', 'd': 'Te llega por WhatsApp 15 minutos antes.'},
            {'t': 'Conectate', 'd': 'Desde el celular o la compu, sin instalar nada.'}, {'t': 'Recibí la receta', 'd': 'La receta y las indicaciones llegan en PDF.'}]),
        faq([('¿Qué obras sociales atienden?', 'Trabajamos con las principales obras sociales y prepagas. Consultá la tuya al sacar el turno.'),
             ('¿Puedo cancelar un turno?', 'Sí, respondiendo el recordatorio de WhatsApp o desde el link de tu turno, hasta 2 horas antes.'),
             ('¿Las recetas digitales sirven en cualquier farmacia?', 'Sí. Llevan firma digital y código de validación (en la versión real).'),
             ('¿Cómo veo mis estudios?', 'En el portal del paciente, apenas el laboratorio carga el resultado.')], center=True),
        contact([('map-pin', 'Dirección', 'Calle Salud 450'), ('clock', 'Horario', 'Lun a vie · 8 a 20 h'), ('phone', 'Turnos', '(0376) 400-0001')], head={'eb': 'Contacto', 'h': 'Estamos cerca.'}, formT='Hacé tu consulta', msgL='Contanos qué necesitás'),
    ],
)
medico['footer'] = foot(medico['nav'])

# 4 ─────────────────────────────── ODONTOLOGIA
SMILE = lambda c: '<svg viewBox="0 0 400 240" aria-hidden="true" style="width:86%%"><path d="M40 90 Q200 20 360 90 Q340 200 200 214 Q60 200 40 90Z" fill="#C2414B"/><path d="M60 96 Q200 46 340 96 L332 128 Q200 104 68 128Z" fill="%s"/><path d="M110 74 V122 M150 64 V116 M190 60 V112 M230 60 V112 M270 64 V116 M300 72 V122" stroke="#00000022" stroke-width="3"/><path d="M80 150 Q200 130 320 150 L314 168 Q200 156 86 168Z" fill="%s"/></svg>' % (c, c)
dental = dict(
    slug='sonrie-dental', name='Sonríe', rubro='Odontología', ref='#60 Dental Practice · Soft UI + Swiss',
    title='Sonríe Estudio Dental | Implantes, ortodoncia y blanqueamiento', desc='Estudio dental demo: antes y después interactivo, presupuesto por tratamiento y turnos online.',
    tagline='Odontología integral con presupuesto claro antes de empezar.',
    style='soft', fonts={'d': 'Plus Jakarta Sans', 'b': 'Plus Jakarta Sans', 'dw': '800'}, libs=['tilt'], split='scale',
    tokens=tok(bg='#F5FAFF', bg2='#E0F2FE', fg='#0C2D48', fg_strong='#071E31', muted='#45607A', primary='#0284C7', on_primary='#FFFFFF', primary_text='#0369A1',
               accent='#14B8A6', on_accent='#042F2E', card='#FFFFFF', line='#D3E6F5', r='16px', r_lg='28px', r_btn='999px', track='-.04em', case='none', h1='clamp(2.6rem,6.2vw,5.4rem)'),
    logo={'shape': 'circle', 't': 'S', 'size': 22},
    nav=[('Tratamientos', 'tratamientos'), ('Antes y después', 'resultados'), ('Presupuesto', 'presupuesto'), ('Turnos', 'turnos')], hdrCta=('Pedir turno', 'turnos'),
    hero=dict(type='split', eyebrow='Estudio dental', h1=['Sonreír', 'sin miedo', 'al dentista.'],
              lead='Tratamientos sin dolor, presupuesto cerrado antes de empezar y turnos que respetamos. Calculá el tuyo en un minuto.',
              cta1=('Calcular presupuesto', 'presupuesto'), cta2=('Pedir turno', 'turnos'), points=[('sparkles', 'Blanqueamiento en 1 sesión'), ('shield-check', 'Garantía en implantes'), ('credit-card', 'Hasta 12 cuotas')],
              vis='<div data-tilt style="max-width:420px;margin:auto">%s</div><div class="floater" style="left:0;top:20%%">%s Sin dolor</div><div class="floater" style="right:0;bottom:16%%;animation-delay:1s">%s Turno en 48 h</div>'
                  % (A.tooth('#0284C7'), '<svg class="ico"><use href="#i-smile"/></svg>', '<svg class="ico"><use href="#i-calendar-check"/></svg>')),
    css='.hero{background:radial-gradient(50% 60% at 80% 40%,#DBEFFF,transparent)}',
    sections=[
        dict(kind='features', id='tratamientos', layout='grid3', tilt=True, head={'eb': 'Tratamientos', 'h': 'Todo lo que tu sonrisa necesita.'}, items=[
            {'i': 'sparkles', 't': 'Blanqueamiento', 'd': 'Hasta 6 tonos más blancos en una sesión de una hora.'}, {'i': 'smile', 't': 'Ortodoncia invisible', 'd': 'Alineadores transparentes que nadie nota.'},
            {'i': 'bolt', 't': 'Implantes', 'd': 'Reemplazá piezas perdidas con resultados naturales.'}, {'i': 'shield', 't': 'Prevención', 'd': 'Limpieza, flúor y control cada seis meses.'},
            {'i': 'baby', 't': 'Odontopediatría', 'd': 'Primeras visitas sin miedo para los más chicos.'}, {'i': 'siren', 't': 'Urgencias', 'd': 'Atención en el día para dolor o fracturas.'}]),
        dict(kind='ba', id='resultados', bg='alt', head={'eb': 'Resultados', 'h': 'Arrastrá y mirá la diferencia.'}, bgA='#FDF2E9', a=SMILE('#E9D8A6'), bgB='#ECFEFF', b=SMILE('#FFFFFF'),
             note='Ilustración de ejemplo para la demo. En la versión real se muestran casos con autorización de cada paciente.'),
        dict(kind='module', id='presupuesto', mod='wizard', panel='Presupuesto online',
             head={'eb': 'Presupuesto', 'h': 'Sabé cuánto cuesta antes de venir.', 'p': 'Respondé tres preguntas y te mostramos un rango orientativo. El valor final sale de la primera consulta.',
                   'bullets': [('check', 'Sin letra chica'), ('check', 'Financiación en cuotas'), ('check', 'Primera consulta sin cargo')]},
             cfg={'base': 0, 'spread': .15, 'outLabel': 'Presupuesto orientativo', 'cta': 'Reservar consulta gratis', 'okMsg': 'Consulta reservada: te escribimos para confirmar (demo).', 'steps': [
                 {'k': 't', 'q': '¿Qué tratamiento te interesa?', 'short': 'Tratamiento', 'type': 'choice', 'opts': [{'l': 'Blanqueamiento', 'i': 'sparkles', 'a': 180000}, {'l': 'Ortodoncia invisible', 'i': 'smile', 'a': 1900000}, {'l': 'Implante', 'i': 'bolt', 'a': 0, 'aq': 650000}, {'l': 'Limpieza y control', 'i': 'shield', 'a': 45000}]},
                 {'k': 'n', 'q': '¿Cuántas piezas? (solo implantes)', 'short': 'Piezas', 'type': 'range', 'min': 1, 'max': 6, 'def': 1, 'role': 'qty', 'unit': 'pieza(s)'},
                 {'k': 'x', 'q': '¿Sumás algo más?', 'short': 'Extras', 'type': 'choice', 'multi': True, 'opts': [{'l': 'Tomografía', 'd': 'Diagnóstico 3D', 'a': 60000}, {'l': 'Sedación consciente', 'd': 'Para los que tienen miedo', 'a': 90000}, {'l': 'Ninguno', 'a': 0}]}]}),
        dict(kind='module', id='turnos', mod='agenda', panel='Turnos', flip=True, bg='alt',
             head={'eb': 'Turnos', 'h': 'Tu turno, cuando te queda bien.', 'p': 'Elegí el motivo, el profesional y el horario.', 'bullets': [('check', 'Atendemos sábados'), ('check', 'Recordatorio por WhatsApp')]},
             cfg={'biz': 'Sonríe', 'q1': '¿Cuál es el motivo?', 'services': [{'n': 'Primera consulta', 'd': 'Sin cargo · 30 min', 'm': 30}, {'n': 'Limpieza', 'd': '45 min', 'm': 45}, {'n': 'Urgencia', 'd': 'En el día', 'm': 30}],
                  'pros': [{'n': 'Dra. Valeria Núñez', 'r': 'Ortodoncia'}, {'n': 'Dr. Federico Vera', 'r': 'Implantes'}], 'hours': ['09:00', '09:45', '10:30', '11:15', '15:00', '15:45', '16:30', '17:15', '18:00'], 'closed': [0]}),
        faq([('¿El blanqueamiento daña el esmalte?', 'No, si lo hace un profesional con productos aprobados. Puede haber sensibilidad leve por 24 horas.'),
             ('¿Cuánto dura un tratamiento de ortodoncia invisible?', 'Entre 6 y 18 meses según el caso. Lo vemos en la primera consulta.'),
             ('¿Aceptan obras sociales?', 'Sí, para prevención y urgencias. Los tratamientos estéticos se financian en cuotas.')]),
        cta('Tu primera consulta es sin cargo.', 'Te revisamos, te explicamos las opciones y te damos un presupuesto por escrito.', 'Pedir turno', 'turnos'),
    ],
)
dental['footer'] = foot(dental['nav'])

# 5 ─────────────────────────────── GIMNASIO
gym = dict(
    slug='pulso-training', name='Pulso', rubro='Gimnasio', ref='#35 Fitness/Gym · Vibrant & Block-based + Dark OLED',
    title='Pulso Training Club | Funcional, fuerza, HIIT y boxeo', desc='Gimnasio demo con grilla de clases reservables, planes mensuales y anuales y animaciones intensas.',
    tagline='Entrenamiento funcional, fuerza y boxeo con coaches que te siguen de cerca.',
    style='dark', fonts={'d': 'Barlow Condensed', 'b': 'Barlow', 'dw': '800'}, loader=True, cursor=True, split='skew', libs=['tilt'],
    tokens=tok(bg='#0E0E10', bg2='#17171A', fg='#F4F4F5', fg_strong='#FFFFFF', muted='#A1A1AA', primary='#FF5A1F', on_primary='#0E0E10', primary_text='#FF7A45',
               accent='#FFFFFF', on_accent='#0E0E10', card='#18181B', line='rgba(255,255,255,.12)', r='0px', r_lg='0px', r_btn='0px', track='-.01em', case='uppercase',
               ink_bg='#FF5A1F', ink_fg='#0E0E10', mq_bg='#FF5A1F', mq_fg='#0E0E10', mq_bw='0', loader_bg='#FF5A1F', loader_fg='#0E0E10'),
    logo={'shape': 'square', 't': 'P', 'size': 24, 'r': 0},
    nav=[('Clases', 'clases'), ('Programas', 'programas'), ('Planes', 'planes'), ('Contacto', 'contacto')], hdrCta=('Clase gratis', 'clases'),
    hero=dict(type='kinetic', eyebrow='Training club', h1=['Entrená', 'más fuerte,', 'cada día.'],
              lead='Clases de 50 minutos, grupos chicos y un coach que corrige cada movimiento. Tu primera clase es gratis.',
              cta1=('Reservar clase gratis', 'clases'), cta2=('Ver planes', 'planes'), vis='<div style="width:min(420px,100%%)">%s</div>' % A.pulse('#FF5A1F'), out='rotate'),
    css='''.hero--kinetic h1{color:#fff}.hero--kinetic .k-row:nth-child(2){color:var(--primary);padding-left:12vw}.hero--kinetic .k-row:nth-child(3){-webkit-text-stroke:2px #fff;color:transparent}
.stack-card{border:0!important}.sec.ink .eyebrow{color:#0E0E10}''',
    sections=[
        marquee(['Funcional', 'Fuerza', 'HIIT', 'Boxeo', 'Movilidad', 'Running'], skew=True, speed=18),
        dict(kind='module', id='clases', mod='horario', layout='full', panel='Grilla semanal',
             head={'eb': 'Clases', 'h': 'Reservá tu lugar en la grilla.', 'p': 'Cupos de 14 personas por clase. Si se completa, quedás en lista de espera.'},
             cfg={'days': ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], 'classes': [
                 {'d': 0, 'h': '07:00', 'n': 'Funcional', 'c': 'Coach Lara', 'cap': 14, 't': 9}, {'d': 1, 'h': '07:00', 'n': 'HIIT', 'c': 'Coach Nico', 'cap': 14, 't': 14}, {'d': 2, 'h': '07:00', 'n': 'Funcional', 'c': 'Coach Lara', 'cap': 14, 't': 6},
                 {'d': 3, 'h': '07:00', 'n': 'HIIT', 'c': 'Coach Nico', 'cap': 14, 't': 11}, {'d': 4, 'h': '07:00', 'n': 'Movilidad', 'c': 'Coach Juli', 'cap': 14, 't': 4},
                 {'d': 0, 'h': '12:30', 'n': 'Fuerza', 'c': 'Coach Tomi', 'cap': 12, 't': 12}, {'d': 2, 'h': '12:30', 'n': 'Fuerza', 'c': 'Coach Tomi', 'cap': 12, 't': 8}, {'d': 4, 'h': '12:30', 'n': 'Fuerza', 'c': 'Coach Tomi', 'cap': 12, 't': 10},
                 {'d': 0, 'h': '19:00', 'n': 'Boxeo', 'c': 'Coach Ramiro', 'cap': 16, 't': 13}, {'d': 1, 'h': '19:00', 'n': 'Funcional', 'c': 'Coach Lara', 'cap': 14, 't': 7}, {'d': 2, 'h': '19:00', 'n': 'Boxeo', 'c': 'Coach Ramiro', 'cap': 16, 't': 16},
                 {'d': 3, 'h': '19:00', 'n': 'Funcional', 'c': 'Coach Lara', 'cap': 14, 't': 5}, {'d': 4, 'h': '19:00', 'n': 'HIIT', 'c': 'Coach Nico', 'cap': 14, 't': 12}, {'d': 5, 'h': '10:00', 'n': 'Running', 'c': 'Coach Juli', 'cap': 20, 't': 9}]}),
        dict(kind='stack', id='programas', head={'eb': 'Programas', 'h': 'Elegí tu objetivo.'}, cards=[
            {'tag': '8 semanas', 't': 'Fuerza desde cero', 'd': 'Aprendé la técnica de los básicos y aumentá tus cargas sin lesionarte.', 'bg': '#FF5A1F', 'fg': '#0E0E10', 'art': '<svg viewBox="0 0 24 24" style="width:140px" fill="none" stroke="#0E0E10" stroke-width="1.6"><use href="#i-dumbbell"/></svg>'},
            {'tag': '6 semanas', 't': 'HIIT quema grasa', 'd': 'Intervalos cortos e intensos con frecuencia cardíaca controlada.', 'bg': '#F4F4F5', 'fg': '#0E0E10', 'art': '<svg viewBox="0 0 24 24" style="width:140px" fill="none" stroke="#0E0E10" stroke-width="1.6"><use href="#i-flame"/></svg>'},
            {'tag': '12 semanas', 't': 'Boxeo recreativo', 'd': 'Golpes, guardia y desplazamientos. Descargá el estrés con técnica.', 'bg': '#27272A', 'fg': '#F4F4F5', 'art': '<svg viewBox="0 0 24 24" style="width:140px" fill="none" stroke="#FF5A1F" stroke-width="1.6"><use href="#i-swords"/></svg>'}]),
        dict(kind='fill', id='manifiesto', text='No vendemos abonos que no usás. Te esperamos, te anotamos y si faltás dos clases, tu coach te escribe.'),
        dict(kind='plans', id='planes', bg='alt', toggle=('Mensual', 'Anual (−20%)'), per=['/mes', '/mes, pago anual'], head={'eb': 'Planes', 'h': 'Sin matrícula. Sin permanencia.'}, plans=[
            {'n': '2 veces', 'd': 'Para empezar', 'm': 28000, 'y': 22400, 'f': ['8 clases por mes', 'Evaluación inicial', 'App con tu rutina']},
            {'n': 'Libre', 'd': 'El que más resultados da', 'm': 42000, 'y': 33600, 'hot': True, 'tag': 'Más elegido', 'f': ['Clases ilimitadas', 'Plan de fuerza personalizado', 'Seguimiento mensual', '1 invitado por mes']},
            {'n': 'Personal', 'd': 'Uno a uno', 'm': 95000, 'y': 76000, 'f': ['8 sesiones personalizadas', 'Plan de nutrición', 'Horario a elección']}], ctaHref='clases', note='Precios de ejemplo para la demo.'),
        faq([('¿Tengo que estar en forma para empezar?', 'No. Las clases se adaptan a tu nivel y el coach te da variantes más fáciles o más difíciles.'),
             ('¿Qué pasa si no puedo ir a una clase reservada?', 'Cancelá desde la app hasta 2 horas antes y tu lugar pasa al primero de la lista de espera.'),
             ('¿Hay vestuarios?', 'Sí, con duchas y lockers.')]),
        cta('Tu primera clase es gratis.', 'Reservá ahora y vení a probar. Si te gusta, te quedás.', 'Reservar clase', 'clases'),
        contact([('map-pin', 'Dirección', 'Bv. del Deporte 77'), ('clock', 'Horario', 'Lun a vie 6 a 23 h · sáb 9 a 14 h'), ('instagram', 'Instagram', '@pulso.training')], head={'eb': 'Contacto', 'h': 'Pasá a conocernos.'}),
    ],
)
gym['footer'] = foot(gym['nav'])

# 6 ─────────────────────────────── PARRILLA
parrilla = dict(
    slug='brasa-parrilla', name='Brasa', rubro='Parrilla y restaurante', ref='#34 Restaurant/Food · Vibrant + Motion-Driven',
    title='Brasa Parrilla | Cortes a la leña, reservas y pedidos', desc='Restaurante demo: carta con pedido por WhatsApp, reservas de mesa y fondo animado de brasas.',
    tagline='Parrilla a la leña. Cortes madurados, vinos de la región y fuego lento.',
    style='dark', fonts={'d': 'Playfair Display', 'b': 'Karla', 'dw': '800'}, vis=True, cart=True, split='blur', loader=True,
    cfg={'cartTitle': 'Tu pedido', 'orderIntro': 'Hola Brasa! Quiero pedir para llevar:', 'checkout': 'Pedir por WhatsApp', 'okOrder': '¡Pedido enviado! Te avisamos cuando esté listo (demo).'},
    tokens=tok(bg='#140D0A', bg2='#1E1410', fg='#F5E9DC', fg_strong='#FFF7EE', muted='#BFA894', primary='#E8590C', on_primary='#140D0A', primary_text='#FF8A3D',
               accent='#FFD166', on_accent='#140D0A', card='#1F1612', line='rgba(255,230,200,.13)', r='6px', r_lg='10px', r_btn='4px', track='-.02em', case='none',
               ink_bg='#E8590C', ink_fg='#140D0A', mq_bg='transparent', mq_fg='#FFD166', loader_bg='#E8590C', loader_fg='#140D0A', inp_bg='#140D0A', h1='clamp(2.8rem,8vw,7.4rem)'),
    logo={'shape': 'arch', 't': 'B', 'size': 20},
    nav=[('Carta', 'carta'), ('Reservas', 'reservas'), ('El fuego', 'fuego'), ('Contacto', 'contacto')], hdrCta=('Reservar mesa', 'reservas'),
    hero=dict(type='full', eyebrow='Parrilla a la leña', h1=['Fuego lento.', 'Sabor que', 'se recuerda.'],
              lead='Cortes madurados 21 días, leña de quebracho y vinos de la región. Reservá tu mesa o pedí para llevar.',
              cta1=('Ver la carta', 'carta'), cta2=('Reservar mesa', 'reservas'), points=[('flame', 'Leña de quebracho'), ('wine', 'Cava de 120 etiquetas'), ('clock', 'Abierto todas las noches')],
              vis='<canvas class="bg-canvas" data-vis="embers" data-c1="#E8590C" data-c2="#FFD166" aria-hidden="true"></canvas>'),
    css='.hero--full h1{font-style:italic}.hero--full .hero-copy{max-width:980px}',
    sections=[
        marquee(['Ojo de bife', 'Vacío', 'Entraña', 'Provoleta', 'Mollejas', 'Malbec'], speed=34),
        dict(kind='module', id='carta', mod='menu', panel='Carta para llevar', layout='full',
             head={'eb': 'La carta', 'h': 'Elegí, sumá y pedí por WhatsApp.', 'p': 'Agregá platos al pedido y mirá cómo le llega el mensaje al restaurante.'},
             cfg={'cats': ['Entradas', 'A la parrilla', 'Guarniciones', 'Postres'], 'items': [
                 {'c': 'Entradas', 'n': 'Provoleta a la leña', 'd': 'Con orégano, ají molido y aceite de oliva.', 'p': 9800, 't': 'Vegetariano'},
                 {'c': 'Entradas', 'n': 'Empanadas de carne cortada a cuchillo', 'd': 'Horneadas en barro. Por unidad.', 'p': 2600},
                 {'c': 'Entradas', 'n': 'Mollejas al limón', 'd': 'Crocantes por fuera, tiernas por dentro.', 'p': 14500},
                 {'c': 'A la parrilla', 'n': 'Ojo de bife madurado', 'd': '400 g, madurado 21 días.', 'p': 28900, 't': 'De la casa'},
                 {'c': 'A la parrilla', 'n': 'Vacío de novillo', 'd': '450 g, cocción lenta de 3 horas.', 'p': 24500},
                 {'c': 'A la parrilla', 'n': 'Entraña fina', 'd': '350 g con chimichurri de la casa.', 'p': 23800},
                 {'c': 'Guarniciones', 'n': 'Papas rústicas', 'd': 'Con romero y ajo confitado.', 'p': 7200},
                 {'c': 'Guarniciones', 'n': 'Ensalada de la huerta', 'd': 'Hojas verdes, tomate y cebolla morada.', 'p': 6500, 't': 'Vegano'},
                 {'c': 'Postres', 'n': 'Flan casero', 'd': 'Con dulce de leche y crema.', 'p': 6900},
                 {'c': 'Postres', 'n': 'Panqueque al rhum', 'd': 'Flambeado en la mesa.', 'p': 7800}]}),
        dict(kind='fill', id='fuego', bg='alt', text='Prendemos el fuego a las cinco de la tarde. Para cuando llegás, la brasa está justa y la carne descansó lo que tenía que descansar.'),
        dict(kind='module', id='reservas', mod='mesa', panel='Reservas', flip=True,
             head={'eb': 'Reservas', 'h': 'Tu mesa, sin llamar por teléfono.', 'p': 'Elegí cuántos son, el día y el horario. Los horarios completos no aparecen disponibles.',
                   'bullets': [('check', 'Confirmación al instante'), ('check', 'Tolerancia de 15 minutos'), ('check', 'Mesas en la galería con reserva previa')]},
             cfg={'hours': ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], 'cta': 'Reservar mesa'}),
        dict(kind='features', id='experiencias', layout='list', head={'eb': 'Experiencias', 'h': 'Más que una cena.'}, items=[
            {'i': 'utensils', 't': 'Menú de pasos', 'd': 'Siete pasos con maridaje de vinos de la región, los jueves.'},
            {'i': 'users', 't': 'Eventos privados', 'd': 'El salón del fondo para 40 personas, con parrillero propio.'},
            {'i': 'graduation-cap', 't': 'Clase de parrilla', 'd': 'Aprendé a encender, manejar la brasa y elegir cada corte.'}]),
        faq([('¿Tienen opciones sin carne?', 'Sí: provoleta, verduras a la leña, ensaladas y pastas caseras.'), ('¿Hacen envíos?', 'Para llevar sí. Envíos a domicilio dentro de los 5 km.'),
             ('¿Se puede ir con mascotas?', 'En la galería exterior, sí.')]),
        contact([('map-pin', 'Dirección', 'Costanera 900'), ('clock', 'Horario', 'Todos los días · 20 a 0.30 h'), ('phone', 'Teléfono', '(0376) 400-0002')], head={'eb': 'Contacto', 'h': 'Te esperamos con el fuego prendido.'}, formT='Consultá por eventos', msgL='Fecha y cantidad de personas'),
    ],
)
parrilla['footer'] = foot(parrilla['nav'])

# 7 ─────────────────────────────── CAFE
BADGE = '<svg class="spin-badge" viewBox="0 0 200 200" aria-hidden="true" style="right:4%;top:6%"><defs><path id="cb" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0"/></defs><circle cx="100" cy="100" r="96" fill="#2F7D5B"/><text font-family="Work Sans" font-weight="600" font-size="17" letter-spacing="4" fill="#FFF4D6"><textPath href="#cb">TOSTADO PROPIO · DE ORIGEN · </textPath></text></svg>'
cafe = dict(
    slug='grano-cafe', name='Grano', rubro='Cafetería de especialidad', ref='#63 Bakery/Cafe · Vibrant & Block-based',
    title='Grano Café | Café de especialidad, tostado propio', desc='Cafetería demo: carta con pedido para retirar, tarjeta de sellos digital y orígenes del café.',
    tagline='Café de especialidad tostado en casa. Para tomar acá o llevar.',
    style='brutal', fonts={'d': 'Abril Fatface', 'b': 'Work Sans', 'dw': '400'}, cart=True, split='flip',
    cfg={'cartTitle': 'Para retirar', 'orderIntro': 'Hola Grano! Paso a retirar:', 'checkout': 'Enviar pedido', 'okOrder': 'Pedido recibido: te avisamos cuando esté listo (demo).'},
    tokens=tok(bg='#FFF4D6', bg2='#FFE7A8', fg='#2A160B', fg_strong='#1A0D05', muted='#6B4A33', primary='#6B2E0E', on_primary='#FFF4D6', primary_text='#6B2E0E',
               accent='#2F7D5B', on_accent='#FFFFFF', card='#FFFBEF', line='#2A160B', r='14px', r_lg='22px', r_btn='999px', track='0', case='none', h1='clamp(3rem,8vw,7rem)',
               mq_bg='#2F7D5B', mq_fg='#FFF4D6', mq_bw='3px', card_bw='3px'),
    logo={'shape': 'circle', 't': 'g', 'size': 26, 'c1': '#6B2E0E', 'c2': '#FFF4D6'},
    nav=[('Carta', 'carta'), ('Orígenes', 'origenes'), ('Club', 'club'), ('Contacto', 'contacto')], hdrCta=('Pedir para retirar', 'carta'),
    hero=dict(type='split', eyebrow='Café de especialidad', h1=['Un buen café', 'cambia el día.'],
              lead='Tostamos cada semana granos de pequeños productores. Pedí desde acá y pasá a retirarlo sin hacer fila.',
              cta1=('Pedir para retirar', 'carta'), cta2=('Sumar sellos', 'club'), points=[('coffee', 'Tostado propio'), ('leaf', 'Leche vegetal sin cargo'), ('wifi', 'Wifi y enchufes')],
              vis='<div style="position:relative;max-width:460px;margin:auto">%s%s</div>' % (A.cup('#6B2E0E', '#FFE7A8'), BADGE)),
    css='.marquee-track span{font-family:"Abril Fatface"}',
    sections=[
        marquee(['Espresso', 'Flat white', 'Cortado', 'Filtrado V60', 'Medialunas', 'Cold brew'], speed=30, dir='r'),
        dict(kind='module', id='carta', mod='menu', panel='Carta', head={'eb': 'La carta', 'h': 'Pedí y pasá a buscarlo.', 'p': 'Elegí, sumá al pedido y te avisamos cuando esté listo.',
                                                                       'bullets': [('check', 'Listo en 5 minutos'), ('check', 'Pagás al retirar'), ('check', 'Sumás un sello por cada café')]},
             cfg={'cats': ['Cafés', 'Fríos', 'Para comer'], 'items': [
                 {'c': 'Cafés', 'n': 'Espresso', 'd': 'Blend de la casa, notas a chocolate.', 'p': 2400}, {'c': 'Cafés', 'n': 'Flat white', 'd': 'Doble ristretto con leche texturizada.', 'p': 3600, 't': 'Favorito'},
                 {'c': 'Cafés', 'n': 'Filtrado V60', 'd': 'Origen del día, preparado a mano.', 'p': 4200}, {'c': 'Fríos', 'n': 'Cold brew', 'd': '18 horas de extracción en frío.', 'p': 3900},
                 {'c': 'Fríos', 'n': 'Iced latte', 'd': 'Con leche o bebida de avena.', 'p': 3800}, {'c': 'Para comer', 'n': 'Medialunas de manteca', 'd': 'Horneadas cada mañana. Por unidad.', 'p': 1200},
                 {'c': 'Para comer', 'n': 'Tostado de jamón y queso', 'd': 'En pan de masa madre.', 'p': 5200}, {'c': 'Para comer', 'n': 'Budín de limón', 'd': 'Porción con glaseado.', 'p': 2900, 't': 'Sin TACC'}]}),
        dict(kind='hs', id='origenes', bg='alt', head={'eb': 'Orígenes', 'h': 'De la finca a tu taza.'}, cards=[
            {'t': 'Colombia · Huila', 'd': 'Lavado. Notas a caramelo y frutos rojos.', 'tag': 'Tueste medio', 'bg': '#6B2E0E', 'art': A.cup('#FFE7A8', '#6B2E0E')},
            {'t': 'Etiopía · Yirgacheffe', 'd': 'Natural. Floral, con acidez de cítricos.', 'tag': 'Tueste claro', 'bg': '#2F7D5B', 'art': A.cup('#FFF4D6', '#2F7D5B')},
            {'t': 'Brasil · Cerrado', 'd': 'Pulped natural. Chocolate y avellana.', 'tag': 'Tueste medio-oscuro', 'bg': '#2A160B', 'art': A.cup('#FFE7A8', '#2A160B')},
            {'t': 'Perú · Cajamarca', 'd': 'Lavado. Dulce, con notas a panela.', 'tag': 'Tueste medio', 'bg': '#B45309', 'art': A.cup('#FFF4D6', '#B45309')}]),
        dict(kind='module', id='club', mod='sellos', panel='Tarjeta de sellos', flip=True,
             head={'eb': 'Club Grano', 'h': 'Diez cafés, uno de regalo.', 'p': 'La tarjeta vive en tu celular: no se pierde ni se moja. Tocá para sumar sellos.', 'bullets': [('check', 'Sin descargar apps'), ('check', 'Regalo en tu cumpleaños')]},
             cfg={'start': 6, 'goal': 10, 'icon': 'coffee', 'prize': 'café de regalo', 'win': '¡Ganaste un café de regalo!'}),
        dict(kind='features', id='espacio', layout='grid3', head={'eb': 'El lugar', 'h': 'Quedate todo lo que quieras.'}, items=[
            {'i': 'laptop', 't': 'Para trabajar', 'd': 'Mesas grandes, wifi rápido y enchufes en cada lugar.'}, {'i': 'dog', 't': 'Pet friendly', 'd': 'Tu perro tiene agua y una galletita.'},
            {'i': 'sun', 't': 'Patio', 'd': 'Mesas al aire libre bajo el lapacho.'}]),
        faq([('¿Venden café en grano?', 'Sí, en bolsas de 250 g y 1 kg. Lo molemos para tu método si querés.'), ('¿Tienen opciones sin TACC?', 'Algunas. Están marcadas en la carta.')]),
        contact([('map-pin', 'Dirección', 'Pasaje del Lapacho 15'), ('clock', 'Horario', 'Lun a sáb · 8 a 20 h'), ('instagram', 'Instagram', '@grano.cafe')], head={'eb': 'Contacto', 'h': 'Vení a tomar uno.'}),
    ],
)
cafe['footer'] = foot(cafe['nav'])

SITES = [autos, vet, medico, dental, gym, parrilla, cafe]
