/* PromptPro · creador de prompts
   Todo corre en el navegador. Sin servidor propio: si el visitante conecta su clave, el pedido va directo
   desde su navegador al proveedor que eligió. Sin clave, funciona en modo demostración (sin IA).
   Sin código en línea: compatible con la CSP del sitio (script-src 'self'). */
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (/[?&]embed=1\b/.test(location.search)) document.documentElement.classList.add('embed');

  /* ---------- Almacenamiento seguro (puede estar bloqueado en modo privado o iframes) ---------- */
  const PREFIX = 'promptpro:';
  const mem = {};
  const makeStore = (area) => ({
    get(k) { try { return window[area].getItem(PREFIX + k); } catch (e) { return mem[area + k] ?? null; } },
    set(k, v) { try { window[area].setItem(PREFIX + k, v); } catch (e) { mem[area + k] = v; } },
    del(k) { try { window[area].removeItem(PREFIX + k); } catch (e) { delete mem[area + k]; } }
  });
  const local = makeStore('localStorage');
  const session = makeStore('sessionStorage');

  /* ---------- Proveedores ---------- */
  const PROVIDERS = {
    gemini: { name: 'Google Gemini', badge: 'Gemini', models: ['gemini-3-flash-preview', 'gemini-1.5-pro', 'gemini-1.5-flash'], defaultModel: 'gemini-3-flash-preview', baseUrl: 'https://generativelanguage.googleapis.com/v1beta', type: 'gemini' },
    openai: { name: 'OpenAI (ChatGPT)', badge: 'ChatGPT', models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'gpt-4-turbo'], defaultModel: 'gpt-4o', baseUrl: 'https://api.openai.com/v1', type: 'openai' },
    anthropic: { name: 'Anthropic (Claude)', badge: 'Claude', models: ['claude-sonnet-5-5', 'claude-opus-5-5', 'claude-haiku-4-5-20251001'], defaultModel: 'claude-sonnet-5-5', baseUrl: 'https://api.anthropic.com/v1', type: 'anthropic' },
    deepseek: { name: 'DeepSeek', badge: 'DeepSeek', models: ['deepseek-chat', 'deepseek-reasoner'], defaultModel: 'deepseek-chat', baseUrl: 'https://api.deepseek.com', type: 'openai' },
    grok: { name: 'Grok (xAI)', badge: 'Grok', models: ['grok-2-latest', 'grok-vision-beta'], defaultModel: 'grok-2-latest', baseUrl: 'https://api.x.ai/v1', type: 'openai' },
    kimi: { name: 'Moonshot AI (Kimi)', badge: 'Kimi', models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'], defaultModel: 'moonshot-v1-8k', baseUrl: 'https://api.moonshot.cn/v1', type: 'openai' },
    custom: { name: 'Servidor propio', badge: 'Servidor propio', models: ['custom'], defaultModel: 'custom', baseUrl: 'http://localhost:11434/v1', type: 'openai' }
  };

  let activeProviderKey = local.get('provider');
  if (!PROVIDERS[activeProviderKey]) activeProviderKey = 'gemini';
  let apiKey = local.get('key') || session.get('key') || '';
  let activeModel = local.get('model') || PROVIDERS[activeProviderKey].defaultModel;
  let activeBaseUrl = local.get('baseurl') || PROVIDERS[activeProviderKey].baseUrl;

  const isDemo = () => !apiKey && activeProviderKey !== 'custom';

  let currentGeneratedPrompt = '';
  let currentImagePrompt = '';
  let currentAuditedPrompt = '';
  let recognition = null;
  let isRecording = false;
  let lastFocus = null;

  /* ---------- Interfaz base ---------- */
  function updateUIState() {
    const info = PROVIDERS[activeProviderKey] || PROVIDERS.gemini;
    const demo = isDemo();
    $('providerBadge').textContent = demo ? 'Modo demostración' : `${info.badge} · ${activeModel}`;
    $('navConfigBtnLabel').textContent = demo ? 'Conectar IA' : info.badge;
    $('demoBanner').classList.toggle('hidden', !demo);
  }

  let toastTimer;
  function showToast(msg, isError = false) {
    const toast = $('toast');
    $('toastMsg').textContent = msg;
    $('toastIcon').className = isError
      ? 'ph-bold ph-warning-circle text-rose-400 text-base shrink-0'
      : 'ph-bold ph-check-circle text-emerald-400 text-base shrink-0';
    toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, isError ? 4500 : 3000);
  }

  function showLoading(msg) {
    $('loadingMsg').textContent = msg || 'Procesando…';
    $('globalLoading').classList.remove('hidden');
  }
  function hideLoading() { $('globalLoading').classList.add('hidden'); }

  function reveal(el) { el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest' }); }

  /* ---------- Pestañas ---------- */
  const tabButtons = () => Array.from(document.querySelectorAll('.tab-btn'));

  function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach((s) => s.classList.add('hidden'));
    tabButtons().forEach((btn) => {
      const on = btn.id === 'nav-' + tabId;
      btn.classList.toggle('active', on);
      btn.classList.toggle('text-slate-400', !on);
      btn.setAttribute('aria-selected', String(on));
      btn.tabIndex = on ? 0 : -1;
    });
    const panel = $(tabId);
    if (panel) panel.classList.remove('hidden');
  }

  document.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
    const tabs = tabButtons();
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n === null) return;
    e.preventDefault();
    tabs[n].focus();
    tabs[n].click();
  });

  /* ---------- Configuración de IA ---------- */
  function openApiKeyModal() {
    lastFocus = document.activeElement;
    $('providerSelect').value = activeProviderKey;
    handleProviderChange(true);
    $('apiKeyInputModal').value = apiKey;
    $('rememberKey').checked = !!local.get('key');
    $('apiKeyModal').classList.remove('hidden');
    $('providerSelect').focus();
  }

  function closeApiKeyModal() {
    $('apiKeyModal').classList.add('hidden');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function handleProviderChange(keepSavedValues = false) {
    const selected = $('providerSelect').value;
    const provider = PROVIDERS[selected] || PROVIDERS.gemini;
    const modelSelect = $('modelSelect');
    modelSelect.replaceChildren();
    provider.models.forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m === 'custom' ? 'Modelo personalizado / manual' : m;
      modelSelect.appendChild(opt);
    });
    $('baseUrlContainer').classList.toggle('hidden', !['custom', 'deepseek', 'grok', 'kimi'].includes(selected));
    if (keepSavedValues && selected === activeProviderKey) {
      const known = provider.models.includes(activeModel);
      modelSelect.value = known ? activeModel : (provider.models.includes('custom') ? 'custom' : provider.models[0]);
      $('customModelInput').value = known ? '' : activeModel;
      $('baseUrlInputModal').value = activeBaseUrl || provider.baseUrl;
    } else {
      modelSelect.value = provider.defaultModel;
      $('customModelInput').value = '';
      $('baseUrlInputModal').value = provider.baseUrl;
    }
    handleModelSelectChange();
  }

  function handleModelSelectChange() {
    $('customModelInput').classList.toggle('hidden', $('modelSelect').value !== 'custom');
  }

  function saveApiKeyFromUI() {
    const providerKey = $('providerSelect').value;
    const provider = PROVIDERS[providerKey];
    const keyVal = $('apiKeyInputModal').value.trim();
    const selectedModel = $('modelSelect').value;
    const customModel = $('customModelInput').value.trim();
    const baseUrlVal = $('baseUrlInputModal').value.trim();

    if (selectedModel === 'custom' && !customModel) { showToast('Escribí el nombre del modelo.', true); return; }
    if (baseUrlVal && !/^https?:\/\//i.test(baseUrlVal)) { showToast('La URL base tiene que empezar con http:// o https://', true); return; }

    activeProviderKey = providerKey;
    activeModel = selectedModel === 'custom' ? customModel : selectedModel;
    activeBaseUrl = baseUrlVal || provider.baseUrl;
    apiKey = keyVal;

    local.set('provider', activeProviderKey);
    local.set('model', activeModel);
    local.set('baseurl', activeBaseUrl);
    local.del('key');
    session.del('key');
    if (keyVal) (($('rememberKey').checked ? local : session)).set('key', keyVal);

    updateUIState();
    closeApiKeyModal();
    showToast(keyVal || providerKey === 'custom' ? `Configuración guardada para ${provider.name}` : 'Sin clave: sigue el modo demostración');
  }

  function forgetKey() {
    apiKey = '';
    local.del('key');
    session.del('key');
    $('apiKeyInputModal').value = '';
    $('rememberKey').checked = false;
    updateUIState();
    showToast('Tu clave se borró de este navegador');
  }

  // Cierra el modal con Escape o tocando afuera; mantiene el foco adentro mientras está abierto
  document.addEventListener('keydown', (e) => {
    const modal = $('apiKeyModal');
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') { closeApiKeyModal(); return; }
    if (e.key !== 'Tab') return;
    const f = Array.from(modal.querySelectorAll('button, select, input:not(.hidden), a[href]')).filter((x) => x.offsetParent !== null && !x.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  $('apiKeyModal').addEventListener('click', (e) => { if (e.target === $('apiKeyModal')) closeApiKeyModal(); });
  $('providerSelect').addEventListener('change', () => handleProviderChange(false));
  $('modelSelect').addEventListener('change', handleModelSelectChange);

  /* ---------- Llamadas a la IA ---------- */
  async function postJSON(url, headers, payload, providerName) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 90000);
    let res;
    try {
      res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(payload), signal: ctrl.signal });
    } catch (e) {
      if (e && e.name === 'AbortError') throw new Error(`${providerName} tardó demasiado en responder. Probá de nuevo.`);
      throw new Error(`No se pudo conectar con ${providerName}. Revisá tu conexión, tu clave y la URL del servidor.`);
    } finally {
      clearTimeout(timer);
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data && data.error && data.error.message) || (data && data.message) || `Error ${res.status} de ${providerName}`);
    return data;
  }

  async function callUniversalLLM(systemInstruction, userPrompt) {
    const provider = PROVIDERS[activeProviderKey] || PROVIDERS.gemini;
    const key = apiKey.trim();
    if (!key && activeProviderKey !== 'custom') {
      openApiKeyModal();
      throw new Error(`Conectá tu clave de ${provider.name} para usar esta función.`);
    }
    const baseUrl = (activeBaseUrl || provider.baseUrl).replace(/\/$/, '');

    if (provider.type === 'gemini') {
      const data = await postJSON(`${baseUrl}/models/${encodeURIComponent(activeModel)}:generateContent`, { 'x-goog-api-key': key }, {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
      }, provider.name);
      const text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
      if (!text) throw new Error('Gemini devolvió una respuesta vacía.');
      return text.trim();
    }

    if (provider.type === 'openai') {
      const headers = key ? { Authorization: `Bearer ${key}` } : {};
      const data = await postJSON(`${baseUrl}/chat/completions`, headers, {
        model: activeModel,
        messages: [{ role: 'system', content: systemInstruction }, { role: 'user', content: userPrompt }]
      }, provider.name);
      const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!text) throw new Error(`${provider.name} devolvió una respuesta vacía.`);
      return text.trim();
    }

    // Anthropic: para llamar desde el navegador hace falta este encabezado
    const data = await postJSON(`${baseUrl}/messages`, {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    }, {
      model: activeModel,
      max_tokens: 4096,
      system: systemInstruction,
      messages: [{ role: 'user', content: userPrompt }]
    }, provider.name);
    const text = data.content && data.content[0] && data.content[0].text;
    if (!text) throw new Error('Claude devolvió una respuesta vacía.');
    return text.trim();
  }

  function requireAI(action) {
    if (isDemo()) {
      showToast(`Para ${action} conectá tu IA.`, true);
      openApiKeyModal();
      return false;
    }
    return true;
  }
  function requireGemini(action) {
    if (activeProviderKey !== 'gemini' || !apiKey.trim()) {
      showToast(`Para ${action} elegí Google Gemini y cargá tu clave.`, true);
      openApiKeyModal();
      return false;
    }
    return true;
  }

  /* ---------- Modo demostración: arma el prompt en el navegador, sin IA ---------- */
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const DOMAINS = [
    { id: 'code', re: /\b(codigo|funcion|script|programa|bug|error|api|base de datos|sql|javascript|typescript|python|react|html|css|algoritmo|app|aplicacion|zod)\b/g,
      rol: 'ingeniero/a de software senior, experto/a en código limpio, pruebas y buenas prácticas',
      tono: 'técnico, preciso y conciso',
      salida: 'Primero el código completo y ejecutable dentro de un bloque; después una explicación breve de cómo funciona y cómo probarlo.' },
    { id: 'marketing', re: /\b(email|correo|mail|venta|ventas|vender|cliente|clientes|marketing|publicidad|campana|anuncio|instagram|redes|copy|lanzamiento|curso|seo|embudo|leads?|posts?)\b/g,
      rol: 'estratega senior de marketing y ventas, con foco en conversión y mensajes claros',
      tono: 'profesional y cercano, orientado a resultados',
      salida: 'Secciones con títulos claros. Si es un mensaje: asunto o gancho, cuerpo y un llamado a la acción concreto.' },
    { id: 'business', re: /\b(plan|estrategia|negocio|negocios|inversor|propuesta|presupuesto|empresa|pyme|emprendimiento|startup|finanzas|informe|comercial)\b/g,
      rol: 'consultor/a de negocios senior, con experiencia en estrategia y propuestas para decisores',
      tono: 'ejecutivo, claro y fundamentado',
      salida: 'Resumen ejecutivo de 3 líneas, desarrollo en secciones numeradas y próximos pasos accionables.' },
    { id: 'creative', re: /\b(historia|cuento|capitulo|poema|guion|relato|personaje|novela|cancion|letra|ciencia ficcion)\b/g,
      rol: 'escritor/a profesional con oficio narrativo y voz propia',
      tono: 'evocador, con ritmo y detalles sensoriales',
      salida: 'Texto corrido, sin explicaciones sobre cómo lo escribiste; con título y párrafos bien cortados.' },
    { id: 'study', re: /\b(explica|explicar|explicame|resumen|resumi|resumir|estudi\w*|concepto|aprender|examen|clase|ensena\w*|como si tuviera)\b/g,
      rol: 'docente experto/a en explicar temas complejos con ejemplos cotidianos',
      tono: 'didáctico, paciente y accesible',
      salida: 'Explicación en niveles (idea central, desarrollo, ejemplo) y un cierre con 3 preguntas para repasar.' }
  ];
  const GENERAL = {
    id: 'general',
    rol: 'asistente experto/a en el tema del pedido, con criterio profesional',
    tono: 'claro, directo y útil',
    salida: 'Respuesta ordenada en secciones con títulos breves, lista para usar sin retoques.'
  };

  function detectDomain(text) {
    const t = norm(text);
    let best = GENERAL, bestN = 0;
    for (const d of DOMAINS) {
      const n = (t.match(d.re) || []).length;
      if (n > bestN) { best = d; bestN = n; }
    }
    return best;
  }

  function extractConstraints(text) {
    const found = text.match(/\d+(?:[.,]\d+)?\s?(?:%|por ciento|d[ií]as?|semanas?|meses|palabras|caracteres|minutos|a[ñn]os?|p[aá]ginas|opciones|ideas|ejemplos)/gi) || [];
    return [...new Set(found.map((s) => s.trim()))].slice(0, 6);
  }

  function localTextPrompt(idea, format) {
    const d = detectDomain(idea);
    const datos = extractConstraints(idea);
    const lines = [];
    lines.push(`**ROL / PERSONA:** Actuá como ${d.rol}.`);
    lines.push('');
    lines.push(`**CONTEXTO:** Pedido original de la persona: «${idea.trim().replace(/[.\s]+$/, '')}». Si falta información clave, hacé como máximo 3 preguntas breves antes de responder; si no, asumí lo más razonable y aclará tus supuestos al principio.`);
    lines.push('');
    lines.push(`**TAREA PRINCIPAL:** Resolvé el pedido de punta a punta, con un resultado listo para usar y adaptado a la situación descrita.${datos.length ? ' Respetá estos datos: ' + datos.join('; ') + '.' : ''}`);
    lines.push('');
    if (format === 'fewshot') {
      lines.push('**EJEMPLOS (few-shot):**');
      lines.push('Ejemplo 1');
      lines.push('- Entrada: [escribí acá un caso de entrada típico]');
      lines.push('- Salida ideal: [escribí acá la respuesta que esperás]');
      lines.push('Ejemplo 2');
      lines.push('- Entrada: [otro caso, distinto del primero]');
      lines.push('- Salida ideal: [la respuesta esperada]');
      lines.push('(Reemplazá los corchetes por casos reales: la IA imita su estilo y su estructura.)');
      lines.push('');
    }
    if (format === 'chain') {
      lines.push('**MÉTODO DE TRABAJO:** Antes de dar la respuesta final, razoná paso a paso: 1) identificá el objetivo real; 2) listá los datos y supuestos; 3) evaluá al menos dos alternativas; 4) elegí la mejor y justificá. Mostrá un resumen breve del razonamiento y cerrá con «Respuesta final:».');
      lines.push('');
    }
    if (format === 'agent') {
      lines.push('**BUCLE DE CALIDAD (agente autónomo):** 1) Escribí un borrador. 2) Revisalo contra las restricciones y listá sus fallas. 3) Corregí. 4) Repetí hasta que no queden fallas relevantes. 5) Entregá solo la versión final, seguida de un checklist de lo que cumple.');
      lines.push('');
    }
    lines.push('**RESTRICCIONES Y REGLAS:**');
    lines.push(`- Tono: ${d.tono}.`);
    lines.push('- No inventes datos, cifras ni fuentes. Si algo no se sabe, decilo.');
    lines.push('- Sé específico/a: evitá las generalidades y las frases de relleno.');
    lines.push('- Respondé en el mismo idioma del pedido.');
    lines.push('');
    lines.push(`**FORMATO DE SALIDA:** ${d.salida}`);
    return lines.join('\n');
  }

  function localImagePrompt(idea, style, camera, lighting) {
    return `${idea.trim()}, ${style}, ${camera}, ${lighting}. Composition: clear focal subject, balanced framing, rule of thirds, sense of depth. Quality: ultra detailed, sharp focus, rich textures, 8K. No text, no watermark.`;
  }

  function localAudit(prompt) {
    const words = prompt.trim().split(/\s+/).filter(Boolean).length;
    const t = norm(prompt);
    const checks = [
      ['Define un rol o perfil experto', /(actua|actues|sos un|eres|rol|como un|como una|persona|experto)/],
      ['Da contexto sobre la situación', /(contexto|situacion|trabajo en|para (un|una|mi|el|la)|cliente|objetivo|publico)/],
      ['Pide una tarea concreta', /(escrib|crea|genera|explica|lista|analiza|redact|arma|dame|necesito|quiero|resumi|compara|traduci)/],
      ['Indica restricciones (tono, límites, qué evitar)', /(tono|no |evita|maximo|minimo|limite|sin |solo |exactamente)/],
      ['Especifica el formato de la respuesta', /(formato|tabla|lista|vinetas|json|pasos|secciones|parrafos|markdown|esquema)/]
    ];
    const results = checks.map(([label, re]) => [label, re.test(t)]);
    results.push(['Es lo bastante detallado (más de 25 palabras)', words > 25]);
    const ok = results.filter((r) => r[1]).length;
    let score = Math.round(1 + (ok / results.length) * 9);
    if (words < 6) score = Math.min(score, 2);
    score = Math.max(1, Math.min(10, score));
    const fortalezas = results.filter((r) => r[1]).map((r) => `✔ ${r[0]}`);
    const debilidades = results.filter((r) => !r[1]).map((r) => `✖ Falta: ${r[0].charAt(0).toLowerCase() + r[0].slice(1)}`);
    const analysis = ['Revisión automática de la estructura (modo demostración):', '', ...fortalezas, ...debilidades, '', 'Con tu IA conectada, además se evalúa la claridad y la efectividad del contenido.'].join('\n');
    return { score, analysis, improved: localTextPrompt(prompt, 'standard') };
  }

  /* ---------- Generador de texto ---------- */
  function applyPreset(category) {
    const presets = {
      marketing: 'Quiero una estrategia de contenido de 1 semana para vender un curso digital. Necesito posts de Instagram, correos y ganchos de atención.',
      coding: 'Necesito una función en JavaScript/TypeScript para validar formularios con Zod y manejar errores de servidor de forma elegante.',
      business: 'Crear un plan de propuesta comercial para presentar a un inversor un prototipo de aplicación móvil de logística urbana.',
      creative: 'Escribir el primer capítulo de una historia de ciencia ficción cyberpunk sobre un detective cibernético en Buenos Aires 2088.',
      study: 'Explicar el concepto de mecánica cuántica y entrelazamiento cuántico como si tuviera 12 años, usando analogías cotidianas.'
    };
    const input = $('textInput');
    input.value = presets[category] || '';
    input.focus();
    showToast('Ejemplo cargado en el campo de texto');
  }

  function showTextResult(text) {
    currentGeneratedPrompt = text;
    $('textPromptOutput').textContent = text;
    $('textResultCard').classList.remove('hidden');
    reveal($('textResultCard'));
  }

  const SYSTEM_TEXT_PROMPT_GENERATOR = `Actúas como un experto Senior mundial en Prompt Engineering. Tu único trabajo es transformar la idea informal del usuario en un prompt profesional de altísimo rendimiento para LLMs (ChatGPT, Claude, Gemini, DeepSeek, Grok, Llama).

Estructura el prompt utilizando formato Markdown claro:
**ROL / PERSONA:** (El perfil experto exacto)
**CONTEXTO:** (El escenario de fondo)
**TAREA PRINCIPAL:** (Instrucción ejecutable, precisa y detallada)
**RESTRICCIONES Y REGLAS:** (Límites, tono, estilo, cosas prohibidas)
**FORMATO DE SALIDA:** (Estructura visual exacta requerida)

Reglas estrictas:
- NO saludes ni des explicaciones previas o posteriores.
- Devuelve ÚNICAMENTE el texto del prompt profesional listo para copiar y usar.`;

  const SYSTEM_IMAGE_PROMPT_GENERATOR = `Actúas como un artista conceptual y especialista en IA generativa de imágenes (Midjourney v6, DALL-E 3, Flux, SDXL).
Crea un prompt descriptivo en INGLÉS altamente optimizado para generar la imagen requerida. Incluye detalles de composición, estilo artístico, iluminación, paleta de colores y especificaciones técnicas de cámara al final.

Devuelve ÚNICAMENTE el texto del prompt en inglés.`;

  const SYSTEM_AUDITOR = `Actúas como un auditor de Prompts de IA. Analiza el prompt proporcionado por el usuario.
Proporciona:
1. Un puntaje general del 1 al 10 (escribilo como "Puntaje: N/10").
2. Un breve resumen (3 viñetas) con fortalezas y debilidades.
3. Una versión REESCRITA Y MEJORADA profesionalmente en formato Markdown.

Usa exactamente la marca "---MEJORADO---" como separador antes de poner la versión reescrita.`;

  async function handleGenerateTextPrompt() {
    const userText = $('textInput').value.trim();
    const format = $('promptFormat').value;
    if (!userText) { showToast('Escribí alguna idea antes de generar el prompt', true); $('textInput').focus(); return; }

    if (isDemo()) {
      const out = localTextPrompt(userText, format);
      showTextResult(out);
      saveToHistory('Prompt de texto (demo)', userText, out);
      showToast('Prompt armado en modo demostración');
      return;
    }

    showLoading(`Diseñando tu prompt profesional con ${PROVIDERS[activeProviderKey].name}…`);
    try {
      let instruction = `Idea original del usuario: "${userText}"`;
      if (format === 'fewshot') instruction += '\nIncluye 2 ejemplos claros de entrada/salida (Few-Shot).';
      else if (format === 'chain') instruction += '\nEstructura la tarea para que la IA piense paso a paso antes de dar la respuesta final.';
      else if (format === 'agent') instruction += '\nDiseña el prompt con personalidad de Agente Autónomo con bucle de verificación de calidad.';
      const out = await callUniversalLLM(SYSTEM_TEXT_PROMPT_GENERATOR, instruction);
      showTextResult(out);
      saveToHistory('Prompt de texto', userText, out);
    } catch (err) {
      showToast(err.message || 'Error al conectar con la IA', true);
    } finally {
      hideLoading();
    }
  }

  async function testPromptWithAI() {
    if (!currentGeneratedPrompt || !requireAI('probar el prompt')) return;
    const arena = $('testArena');
    arena.classList.remove('hidden');
    $('testLoadingState').classList.remove('hidden');
    $('testOutputText').textContent = '';
    reveal(arena);
    try {
      const reply = await callUniversalLLM('Respondé directamente como la IA que ejecuta la instrucción dada.', currentGeneratedPrompt);
      $('testOutputText').textContent = reply || 'No se obtuvo respuesta.';
    } catch (err) {
      $('testOutputText').textContent = `No se pudo ejecutar la prueba: ${err.message}`;
    } finally {
      $('testLoadingState').classList.add('hidden');
    }
  }

  function closeTestArena() { $('testArena').classList.add('hidden'); }

  async function refinePrompt(instruction) {
    if (!currentGeneratedPrompt || !requireAI('ajustar el prompt')) return;
    showLoading(`Ajustando el prompt (${instruction.toLowerCase()})…`);
    try {
      const reply = await callUniversalLLM(
        'Eres un experto reescribiendo y optimizando prompts según peticiones específicas.',
        `Modifica el siguiente prompt agregando este ajuste específico: "${instruction}". Mantén la estructura profesional.\n\nPrompt actual:\n${currentGeneratedPrompt}`);
      if (reply) { showTextResult(reply); showToast('Prompt actualizado'); }
    } catch (err) {
      showToast(err.message || 'No se pudo ajustar el prompt', true);
    } finally {
      hideLoading();
    }
  }

  async function translatePromptToEnglish() {
    if (!currentGeneratedPrompt || !requireAI('traducir el prompt')) return;
    showLoading('Traduciendo el prompt al inglés…');
    try {
      const reply = await callUniversalLLM(
        'You are a professional translator specializing in AI system prompts.',
        `Translate the following system prompt into professional, highly accurate English for AI instruction. Return ONLY the translated prompt:\n\n${currentGeneratedPrompt}`);
      if (reply) { showTextResult(reply); showToast('Prompt traducido al inglés'); }
    } catch (err) {
      showToast(err.message || 'No se pudo traducir', true);
    } finally {
      hideLoading();
    }
  }

  /* ---------- Voz (Gemini TTS) ---------- */
  function pcmToWav(pcm16, sampleRate) {
    const buffer = new ArrayBuffer(44 + pcm16.length * 2);
    const view = new DataView(buffer);
    const str = (offset, s) => { for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); view.setUint32(4, 36 + pcm16.length * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true); view.setUint16(34, 16, true); str(36, 'data'); view.setUint32(40, pcm16.length * 2, true);
    for (let i = 0, o = 44; i < pcm16.length; i++, o += 2) view.setInt16(o, pcm16[i], true);
    return new Blob([buffer], { type: 'audio/wav' });
  }
  function base64ToArrayBuffer(b64) {
    const bin = window.atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }

  async function speakPromptWithTTS() {
    if (!currentGeneratedPrompt || !requireGemini('escuchar el prompt')) return;
    showLoading('Sintetizando la voz con Gemini…');
    try {
      const data = await postJSON(`${PROVIDERS.gemini.baseUrl}/models/gemini-2.5-flash-preview-tts:generateContent`, { 'x-goog-api-key': apiKey.trim() }, {
        contents: [{ parts: [{ text: `Lee con voz clara y profesional este prompt: ${currentGeneratedPrompt.substring(0, 500)}` }] }],
        generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } } }
      }, 'Gemini');
      const part = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0];
      const b64 = part && part.inlineData && part.inlineData.data;
      if (!b64) throw new Error('Gemini no devolvió audio.');
      const mime = (part.inlineData.mimeType) || 'audio/L16;rate=24000';
      const m = mime.match(/rate=(\d+)/);
      const wav = pcmToWav(new Int16Array(base64ToArrayBuffer(b64)), m ? parseInt(m[1], 10) : 24000);
      const player = $('audioPlayer');
      if (player.src) URL.revokeObjectURL(player.src);
      player.src = URL.createObjectURL(wav);
      await player.play();
      showToast('Reproduciendo audio…');
    } catch (err) {
      showToast(err.message || 'No se pudo generar la voz', true);
    } finally {
      hideLoading();
    }
  }

  /* ---------- Imágenes ---------- */
  async function handleGenerateImagePrompt() {
    const idea = $('imageInput').value.trim();
    const style = $('imgStyle').value, camera = $('imgCamera').value, lighting = $('imgLighting').value, aspect = $('imgAspect').value;
    if (!idea) { showToast('Escribí una idea para la imagen', true); $('imageInput').focus(); return; }

    const show = (text) => {
      currentImagePrompt = text;
      $('imagePromptOutput').textContent = text;
      $('imageResultCard').classList.remove('hidden');
      $('sampleImageContainer').classList.add('hidden');
      reveal($('imageResultCard'));
    };

    if (isDemo()) {
      const out = `${localImagePrompt(idea, style, camera, lighting)} ${aspect}`;
      show(out);
      saveToHistory('Prompt de imagen (demo)', idea, out);
      showToast('Listo. Con tu IA conectada, la idea se traduce al inglés y se enriquece');
      return;
    }

    showLoading('Construyendo un prompt visual detallado…');
    try {
      const out = await callUniversalLLM(SYSTEM_IMAGE_PROMPT_GENERATOR, `Idea visual: ${idea}. Parámetros deseados: Estilo (${style}), Cámara (${camera}), Iluminación (${lighting}), Aspect ratio (${aspect}).`);
      const full = `${out} ${aspect}`;
      show(full);
      saveToHistory('Prompt de imagen', idea, full);
    } catch (err) {
      showToast(err.message || 'No se pudo crear el prompt de imagen', true);
    } finally {
      hideLoading();
    }
  }

  async function generateImageSampleWithGemini() {
    if (!currentImagePrompt || !requireGemini('generar la muestra de imagen')) return;
    const container = $('sampleImageContainer'), loading = $('sampleImageLoading'), img = $('sampleImageElement');
    container.classList.remove('hidden');
    loading.classList.remove('hidden');
    loading.classList.add('flex');
    img.classList.add('hidden');
    reveal(container);
    try {
      const data = await postJSON(`${PROVIDERS.gemini.baseUrl}/models/gemini-3.1-flash-image:generateContent`, { 'x-goog-api-key': apiKey.trim() }, {
        contents: [{ parts: [{ text: `High visual fidelity illustration based on this concept: ${currentImagePrompt}` }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '1:1' } }
      }, 'Gemini');
      const parts = (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
      const part = parts.find((p) => p.inlineData);
      if (!part) throw new Error('Gemini no devolvió una imagen.');
      img.src = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      img.classList.remove('hidden');
      showToast('Imagen de muestra generada');
    } catch (err) {
      container.classList.add('hidden');
      showToast(err.message || 'No se pudo generar la muestra', true);
    } finally {
      loading.classList.add('hidden');
      loading.classList.remove('flex');
    }
  }

  /* ---------- Auditor ---------- */
  function showAudit(score, analysis, improved) {
    currentAuditedPrompt = improved;
    $('auditScore').textContent = `${score}/10`;
    $('auditAnalysisText').textContent = analysis;
    $('auditedPromptOutput').textContent = improved;
    $('auditResultCard').classList.remove('hidden');
    reveal($('auditResultCard'));
  }

  async function handleAuditPrompt() {
    const raw = $('auditorInput').value.trim();
    if (!raw) { showToast('Pegá un prompt para auditar', true); $('auditorInput').focus(); return; }

    if (isDemo()) {
      const r = localAudit(raw);
      showAudit(r.score, r.analysis, r.improved);
      saveToHistory('Auditoría (demo)', raw, r.improved);
      showToast('Auditoría lista (modo demostración)');
      return;
    }

    showLoading('Auditando la estructura y la efectividad de tu prompt…');
    try {
      const output = await callUniversalLLM(SYSTEM_AUDITOR, raw);
      const parts = output.split('---MEJORADO---');
      const analysis = (parts[0] || 'Análisis completado.').trim();
      const improved = (parts[1] || output).trim();
      const m = analysis.match(/(\d{1,2})\s*\/\s*10/);
      showAudit(m ? Math.min(10, parseInt(m[1], 10)) : '–', analysis.replace(/Puntaje:?\s*\d{1,2}\s*\/\s*10/gi, '').trim(), improved);
      saveToHistory('Auditoría', raw, improved);
    } catch (err) {
      showToast(err.message || 'No se pudo auditar el prompt', true);
    } finally {
      hideLoading();
    }
  }

  /* ---------- Copiar ---------- */
  async function copyText(text) {
    if (!text) { showToast('Todavía no hay nada para copiar', true); return; }
    try {
      await navigator.clipboard.writeText(text);
      showToast('¡Copiado al portapapeles!');
      return;
    } catch (e) { /* sigue con el método de respaldo */ }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.className = 'fixed -top-96 opacity-0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    showToast(ok ? '¡Copiado al portapapeles!' : 'No se pudo copiar. Seleccioná el texto y copialo a mano.', !ok);
  }
  const copyGeneratedPrompt = () => copyText(currentGeneratedPrompt);
  const copyImagePrompt = () => copyText(currentImagePrompt);
  const copyAuditedPrompt = () => copyText(currentAuditedPrompt);

  /* ---------- Dictado por voz ---------- */
  function stopDictationUI() {
    isRecording = false;
    $('micIcon').className = 'ph-bold ph-microphone text-slate-400';
    $('micLabel').textContent = 'Dictar';
    $('micBtn').setAttribute('aria-pressed', 'false');
  }

  function toggleDictation() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast('Tu navegador no permite dictar por voz', true); return; }
    if (isRecording && recognition) { recognition.stop(); return; }
    recognition = new SR();
    recognition.lang = 'es-AR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => {
      isRecording = true;
      $('micIcon').className = 'ph-bold ph-microphone text-rose-500 animate-pulse';
      $('micLabel').textContent = 'Escuchando…';
      $('micBtn').setAttribute('aria-pressed', 'true');
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = $('textInput');
      input.value = input.value ? `${input.value} ${transcript}` : transcript;
    };
    recognition.onerror = () => { showToast('No se pudo usar el micrófono. Revisá el permiso del navegador.', true); stopDictationUI(); };
    recognition.onend = stopDictationUI;
    try { recognition.start(); } catch (e) { stopDictationUI(); }
  }

  /* ---------- Historial (se guarda solo en este navegador) ---------- */
  function readHistory() {
    try { const h = JSON.parse(local.get('history') || '[]'); return Array.isArray(h) ? h : []; } catch (e) { return []; }
  }

  function saveToHistory(type, original, prompt) {
    const history = readHistory();
    history.unshift({ id: Date.now(), type, original, prompt, date: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) });
    local.set('history', JSON.stringify(history.slice(0, 20)));
    renderHistory();
  }

  function mk(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function renderHistory() {
    const list = $('historyList');
    list.replaceChildren();
    const history = readHistory();
    if (!history.length) {
      list.appendChild(mk('p', 'text-center text-slate-500 py-8 text-xs', 'No tenés prompts guardados todavía. Generá tu primer prompt para verlo acá.'));
      return;
    }
    history.forEach((item) => {
      const card = mk('div', 'p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2');
      const head = mk('div', 'flex items-center justify-between gap-2 text-xs');
      head.appendChild(mk('span', 'font-semibold text-indigo-400 uppercase tracking-wider', item.type));
      head.appendChild(mk('span', 'text-slate-500 shrink-0', item.date));
      card.appendChild(head);
      card.appendChild(mk('p', 'text-xs text-slate-400 line-clamp-2 break-words', `Idea: «${item.original}»`));
      card.appendChild(mk('div', 'p-2.5 bg-slate-950 font-mono-code text-xs text-slate-300 rounded-lg line-clamp-3 break-words whitespace-pre-wrap', item.prompt));
      const row = mk('div', 'flex justify-end pt-1');
      const btn = mk('button', 'min-h-[44px] sm:min-h-0 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg flex items-center gap-1');
      btn.type = 'button';
      btn.dataset.click = 'copyHistory';
      btn.dataset.arg = String(item.id);
      const icon = mk('i', 'ph-bold ph-copy');
      icon.setAttribute('aria-hidden', 'true');
      btn.append(icon, ' Copiar');
      row.appendChild(btn);
      card.appendChild(row);
      list.appendChild(card);
    });
  }

  function copyHistory(id) {
    const item = readHistory().find((h) => String(h.id) === String(id));
    copyText(item ? item.prompt : '');
  }

  function clearHistory() {
    local.del('history');
    renderHistory();
    showToast('Historial borrado');
  }

  /* ---------- Eventos (sin atributos onclick: compatible con la CSP) ---------- */
  const actions = {
    switchTab, applyPreset, toggleDictation, handleGenerateTextPrompt, copyGeneratedPrompt, testPromptWithAI,
    speakPromptWithTTS, translatePromptToEnglish, refinePrompt, closeTestArena, handleGenerateImagePrompt,
    copyImagePrompt, generateImageSampleWithGemini, handleAuditPrompt, copyAuditedPrompt, clearHistory,
    openApiKeyModal, closeApiKeyModal, saveApiKeyFromUI, forgetKey, copyHistory
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-click]');
    if (!el) return;
    const fn = actions[el.dataset.click];
    if (!fn) return;
    try {
      const r = fn(el.dataset.arg, el);
      if (r && typeof r.catch === 'function') r.catch((err) => showToast((err && err.message) || 'Algo salió mal', true));
    } catch (err) {
      showToast((err && err.message) || 'Algo salió mal', true);
    }
  });

  updateUIState();
  renderHistory();
})();
