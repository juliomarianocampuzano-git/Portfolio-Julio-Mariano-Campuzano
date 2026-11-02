# Contenido editable del portfolio. Lo usa build-portfolio.py.
# Regla: cada ficha cuenta QUE resuelve el proyecto, nunca COMO esta construido por dentro.

# Proyectos entregados a clientes. Para sumar uno, agrega su id aca (ej. 'knowbase') y corre:
#   python portfolio/build-portfolio.py
# Solo agregar proyectos que de verdad se entregaron a un cliente.
CLIENTES_EXTRA = []

# Fichas sin definicion suficiente para mostrarse: quedan fuera del catalogo publico
# hasta que tengan descripcion (se restauran sacandolas de esta lista).
OCULTOS = ['recupera', 'llavint', 'clara', 'propuestas-publicas', 'propuesta-pymes', 'intermediacion']

# Descripciones nuevas (orientadas al resultado) para las fichas que solo tenian un texto provisorio
DESC = {
 'dropshipping': ('Tienda online que coordina catálogo, búsqueda visual de productos y respuestas a clientes en un solo lugar.',
                  'Online store that brings catalog, visual product search and customer answers together in one place.'),
 'hotel-arandu': ('Experiencia digital para un hotel: presentación de habitaciones, cálculo de estadía y reserva con seña.',
                  'Digital hotel experience: room showcase, stay calculation and booking with a deposit.'),
 'enterprise-etl': ('Flujo de datos con controles de calidad y auditoría: cada carga queda validada antes de llegar a los reportes.',
                    'Data flow with quality controls and auditing: every load is validated before it reaches the reports.'),
 'proveedoria': ('Centraliza la información de proveedores y compara condiciones para comprar mejor, aun con grandes volúmenes de datos.',
                 'Centralizes supplier information and compares terms to buy better, even with large data volumes.'),
 'casa-rapida': ('Automatización para inmobiliarias: ordena consultas, prioriza oportunidades y agiliza el seguimiento, con foco en el mercado italiano.',
                 'Real-estate agency automation: sorts enquiries, prioritizes opportunities and speeds up follow-up, focused on the Italian market.'),
 'cotizador-propiedades': ('Estimación de valor de propiedades a partir de comparables similares por superficie, ambientes y zona.',
                           'Property value estimation based on comparable listings by size, rooms and area.'),
 'inmoflow': ('Gestión de oportunidades inmobiliarias: etapas, prioridades y mensajes de seguimiento listos para enviar.',
              'Real-estate opportunity management: stages, priorities and ready-to-send follow-up messages.'),
 'cv-generator': ('Generador de currículums: completás tus datos y obtenés un CV ordenado, claro y listo para imprimir.',
                  'Resume generator: fill in your details and get a clean, ordered resume ready to print.'),
 'grokbot': ('Lleva una idea hasta un proyecto presentable: preparación, validación y publicación con aprobación manual en cada paso.',
             'Takes an idea to a presentable project: preparation, validation and publishing with manual approval at each step.'),
 'cierreok': ('Cierres operativos automáticos: convierte el registro diario de trabajo en un resumen con totales y pendientes.',
              'Automatic operational closings: turns the daily work log into a summary with totals and pending items.'),
 'rendicionok': ('Ordena y valida rendiciones: separa errores, limpia los datos y deja indicadores listos para revisar.',
                 'Organizes and validates expense reports: flags errors, cleans the data and leaves indicators ready to review.'),
 'contextpulse': ('Mide qué tan confiables son las respuestas de un buscador de conocimiento, mostrando las fuentes de cada una.',
                  'Measures how reliable a knowledge search assistant is, showing the sources behind each answer.'),
 'stockguard': ('Control de stock para comercios: avisa la reposición y detecta diferencias entre pedido, recepción y factura.',
                'Retail stock control: flags restocking and catches differences between order, receipt and invoice.'),
 'portalinmo': ('Reúne en un solo tablero los contactos inmobiliarios que llegan por distintos canales y ordena su seguimiento.',
                'Brings real-estate leads from every channel into one board and organizes their follow-up.'),
 'polizaflow': ('Gestión para productores de seguros: vencimientos, renovaciones y comisiones bajo control en un solo lugar.',
                'Management for insurance brokers: expirations, renewals and commissions under control in one place.'),
 'casa-mia': ('Agenda y organización para una actividad inmobiliaria o de alquiler: estadías, señas y estado de cada reserva.',
              'Scheduling and organization for a real-estate or rental business: stays, deposits and booking status.'),
 'cotiza': ('Cotizaciones rápidas: compara proveedores por costo total, con envío y descuentos incluidos.',
            'Fast quotations: compares suppliers by total cost, shipping and discounts included.'),
}

# Que resuelve cada tipo de proyecto (reemplaza el detalle de implementacion)
RESUELVE = {
 'etl': (['Toma archivos desordenados y los deja limpios y listos para analizar.', 'Separa los registros con errores para revisarlos aparte.', 'Entrega indicadores claros para decidir.'],
         ['Takes messy files and leaves them clean and ready to analyze.', 'Separates records with errors for review.', 'Delivers clear indicators for decision-making.']),
 'ledger': (['Ingresos y egresos ordenados en un solo lugar.', 'Saldo y resultados al día, por empresa o por período.', 'Menos planillas sueltas y menos errores de carga.'],
            ['Income and expenses organized in one place.', 'Up-to-date balance and results by company or period.', 'Fewer scattered spreadsheets and data-entry errors.']),
 'leads': (['Cada consulta queda registrada y con su etapa.', 'Prioriza las oportunidades con más chances de cerrar.', 'Mensajes de seguimiento listos para enviar.'],
           ['Every enquiry is recorded with its stage.', 'Prioritizes the opportunities most likely to close.', 'Follow-up messages ready to send.']),
 'catalog': (['Catálogo claro, con búsqueda y filtros.', 'El cliente arma su pedido o presupuesto solo.', 'Una vidriera que trabaja las 24 horas.'],
             ['Clear catalog with search and filters.', 'Customers build their own order or quote.', 'A storefront that works 24/7.']),
 'documents': (['Documentos ordenados por cliente y por tipo.', 'Encontrar un archivo lleva segundos, no minutos.', 'Inventario exportable para control y auditoría.'],
               ['Documents organized by client and type.', 'Finding a file takes seconds, not minutes.', 'Exportable inventory for control and audits.']),
 'accounting': (['Clasifica movimientos de forma consistente.', 'Actualiza importes históricos para compararlos en valores de hoy.', 'Acelera el análisis contable sin reemplazar la revisión profesional.'],
                ['Classifies transactions consistently.', 'Restates historical amounts to compare them in today\'s values.', 'Speeds up accounting analysis without replacing professional review.']),
 'suppliers': (['Compara proveedores por costo total, no solo por precio.', 'Incluye envío, cantidad y descuentos en la cuenta.', 'Ayuda a comprar mejor y más rápido.'],
               ['Compares suppliers by total cost, not just price.', 'Factors in shipping, quantity and discounts.', 'Helps buy better and faster.']),
 'matcher': (['Compara un perfil con una búsqueda laboral.', 'Explica coincidencias y lo que falta.', 'Da pistas concretas para mejorar la postulación.'],
             ['Compares a profile with a job posting.', 'Explains matches and what is missing.', 'Gives concrete tips to improve the application.']),
 'booking': (['Calcula estadías y señas al instante.', 'Registra reservas con su estado de pago.', 'Menos idas y vueltas por mensaje.'],
             ['Calculates stays and deposits instantly.', 'Records bookings with their payment status.', 'Less back-and-forth over messages.']),
 'knowledge': (['Responde preguntas sobre documentos propios.', 'Muestra las fuentes de cada respuesta para poder verificarla.', 'Suma documentos nuevos en el momento.'],
               ['Answers questions about your own documents.', 'Shows the sources of every answer so it can be checked.', 'Adds new documents on the spot.']),
 'prices': (['Compara precios anteriores y actuales.', 'Detecta aumentos y bajas de un vistazo.', 'Ayuda a mantener la lista de precios al día.'],
            ['Compares previous and current prices.', 'Spots increases and drops at a glance.', 'Helps keep the price list up to date.']),
 'inventory': (['Avisa cuando un producto llega al stock mínimo.', 'Sigue números de serie y garantías.', 'Detecta diferencias entre pedido, recepción y factura.'],
               ['Warns when a product hits minimum stock.', 'Tracks serial numbers and warranties.', 'Catches differences between order, receipt and invoice.']),
 'resume': (['Arma un CV ordenado a partir de tus datos.', 'Formato claro, en una columna y fácil de leer.', 'Listo para imprimir o enviar.'],
            ['Builds an ordered resume from your details.', 'Clear one-column format that is easy to read.', 'Ready to print or send.']),
 'pipeline': (['Ordena un proceso en pasos claros.', 'Valida cada etapa antes de avanzar.', 'Nada se publica sin aprobación manual.'],
              ['Turns a process into clear steps.', 'Validates each stage before moving on.', 'Nothing is published without manual approval.']),
 'prompt': (['Convierte un objetivo en instrucciones claras para la IA.', 'Suma contexto y restricciones de forma ordenada.', 'Resultados más precisos y repetibles.'],
            ['Turns a goal into clear instructions for AI.', 'Adds context and constraints in an orderly way.', 'More precise, repeatable results.']),
 'valuation': (['Estima valores a partir de propiedades comparables.', 'Filtra por superficie, ambientes y zona.', 'Una referencia rápida antes de tasar.'],
               ['Estimates value from comparable properties.', 'Filters by size, rooms and area.', 'A quick reference before a formal appraisal.']),
 'summary': (['Convierte el registro del día en un cierre claro.', 'Totales y pendientes a la vista.', 'Menos tiempo armando informes a mano.'],
             ['Turns the daily log into a clear closing report.', 'Totals and pending items at a glance.', 'Less time building reports by hand.']),
 'insurance': (['Vencimientos y renovaciones bajo control.', 'Comisiones calculadas y a la vista.', 'Seguimiento exportable para no perder ninguna póliza.'],
               ['Expirations and renewals under control.', 'Commissions calculated and visible.', 'Exportable follow-up so no policy slips through.']),
 'brief': (['Define el objetivo y el alcance del proyecto.', 'Genera un plan de trabajo por etapas.', 'Fija criterios claros de aceptación.'],
           ['Defines the project goal and scope.', 'Generates a staged work plan.', 'Sets clear acceptance criteria.']),
}

ESTADO = {
 'cliente': ('Proyecto entregado a un cliente. La demo usa datos de ejemplo para proteger la información del negocio.',
             'Project delivered to a client. The demo uses sample data to protect the business information.'),
 'local': ('Herramienta funcionando. La demo muestra el flujo principal con datos de ejemplo.',
           'Working tool. The demo shows the main workflow with sample data.'),
 'mvp': ('MVP funcionando: el flujo principal está construido y probado.',
         'Working MVP: the main workflow is built and tested.'),
 'piloto': ('En etapa piloto, probándose con casos reales acotados.',
            'In pilot stage, being tested with a limited set of real cases.'),
 'prototipo': ('Prototipo funcional: la experiencia principal está armada y se puede recorrer.',
               'Working prototype: the core experience is built and can be explored.'),
 'desarrollo': ('En desarrollo activo. La demo muestra el flujo principal ya resuelto.',
                'In active development. The demo shows the main workflow already solved.'),
 'idea': ('Concepto con demo funcional: el flujo principal se puede probar completo en esta página.',
          'Concept with a working demo: the main workflow can be fully tried on this page.'),
}
RESERVA = ('Para proteger el trabajo, esta ficha muestra qué resuelve el proyecto y no cómo está construido por dentro.',
           'To protect the work, this page shows what the project solves, not how it is built inside.')

# Etiquetas: solo areas y herramientas generales, sin detalles de arquitectura
def tags(raw, en, engine):
    T = {'ia': 'AI' if en else 'IA', 'auto': 'Automation' if en else 'Automatización', 'data': 'Data' if en else 'Datos', 'web': 'Web'}
    KEEP = {'python': 'Python', 'javascript': 'JavaScript', 'sql': 'SQL', 'html': 'HTML', 'css': 'CSS', 'react': 'React', 'excel': 'Excel',
            'power bi': 'Power BI', 'android': 'Android', 'kotlin': 'Kotlin', 'telegram': 'Telegram', 'blender': 'Blender', 'csv': 'CSV'}
    AI = ('rag', 'llm', 'ollama', 'groq', 'deepseek', 'embedding', 'clip', 'claude', 'qwen', 'xai', 'tf-idf', 'chroma', 'pgvector', 'abacus', 'ia', 'ai')
    AUTO = ('n8n', 'airflow', 'github actions', 'ci', 'celery', 'redis', 'docker', 'api', 'railway', 'render')
    DATA = ('etl', 'pandas', 'dbt', 'duckdb', 'parquet', 'pbip', 'dax', 'sheetjs', 'postgres', 'supabase', 'sqlite', 'indexeddb', 'airtable', 'chart.js', 'scraping', 'json')
    WEB = ('sitio web', 'static website', 'cloudflare', 'netlify', 'tailwind', 'flask', 'fastapi', 'sse', 'streamlit')
    out = []
    def add(t):
        if t not in out: out.append(t)
    for t in raw:
        l = t.lower().strip()
        if l.startswith('stack') or 'prevista' in l or 'planned' in l or 'iniciativa' in l or 'initiative' in l or l in ('github', 'linkedin', 'word', 'pdf'): continue
        if 'whatsapp' in l: add('WhatsApp'); continue
        if l in KEEP: add(KEEP[l]); continue
        if l in ('tinkercad', 'inkscape', 'bambu studio'): add('3D'); continue
        if l == 'pptxgenjs': add('Presentations' if en else 'Presentaciones'); continue
        if 'comparables' in l: add('Real estate' if en else 'Inmobiliario'); continue
        if l in ('ia', 'ai') or any(l.startswith(k) for k in AI if len(k) > 2): add(T['ia']); continue
        if l == 'ci' or any(k in l for k in AUTO if k != 'ci'): add(T['auto']); continue
        if any(k in l for k in DATA): add(T['data']); continue
        if any(k in l for k in WEB): add(T['web']); continue
    if not out:
        FB = {'etl': 'data', 'ledger': 'data', 'accounting': 'data', 'prices': 'data', 'inventory': 'data', 'summary': 'auto', 'pipeline': 'auto',
              'knowledge': 'ia', 'prompt': 'ia', 'matcher': 'ia', 'valuation': 'data', 'catalog': 'web', 'booking': 'web', 'resume': 'web'}
        add(T[FB.get(engine, 'auto')])
    return out[:4]
