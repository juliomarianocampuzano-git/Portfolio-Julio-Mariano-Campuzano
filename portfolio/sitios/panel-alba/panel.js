/* panel.js · panel de gestion demo de Centro Medico Alba (lo que ve el consultorio detras de la web).
   Datos ficticios. Todo se guarda en localStorage de este navegador: nada se envia a un servidor.
   Lee los turnos que se reservaron en la web publica de la demo (clave "demo-turnos"). */
(function(){
'use strict';
var D=document,$=function(s,c){return (c||D).querySelector(s)},$$=function(s,c){return [].slice.call((c||D).querySelectorAll(s))};
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,G=window.gsap;
var KEY='alba-panel-v1',SITE='centro-medico-alba';
var DAYS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],MON=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
var PROS=[{id:'pr',n:'Dra. Paula Ríos',e:'Clínica médica',c:'#0E7490'},{id:'ac',n:'Dr. Andrés Cabral',e:'Cardiología',c:'#B45309'},{id:'ls',n:'Dra. Lucía Sosa',e:'Pediatría',c:'#6D28D9'}];
var SVCS=['Clínica médica','Pediatría','Cardiología','Teleconsulta','Control'];
var HOURS=['08:00','08:20','08:40','09:00','09:20','09:40','10:00','10:20','10:40','11:00','11:20','11:40'];
var STATES=[['pendiente','Pendiente'],['confirmado','Confirmado'],['sala','En sala'],['atendido','Atendido'],['ausente','Ausente']];
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var ico=function(n){return '<svg class="ico" aria-hidden="true"><use href="#i-'+n+'"/></svg>'};
var ini=function(n){return n.replace(/^(Dra?\.)\s*/,'').split(' ').map(function(w){return w[0]}).join('').slice(0,2).toUpperCase()};
var pro=function(id){return PROS.filter(function(p){return p.id===id})[0]||PROS[0]};
var today=new Date();today.setHours(0,0,0,0);
var tomorrow=new Date(today.getTime()+864e5);
function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function nice(s){var p=s.split('-'),d=new Date(+p[0],+p[1]-1,+p[2]);return DAYS[d.getDay()]+' '+d.getDate()+' de '+MON[d.getMonth()]}

/* ---------- datos de ejemplo ---------- */
function seed(){
  var P=[
    {id:1,n:'María González',dni:'30.000.001',os:'Prepaga A',tel:'376 400-0001',nac:'1984',al:'Penicilina',hist:[['Clínica médica','Control de presión. Indica dieta hiposódica.'],['Laboratorio','Perfil lipídico dentro de valores normales.']]},
    {id:2,n:'Juan Pérez',dni:'28.000.002',os:'Obra social provincial',tel:'376 400-0002',nac:'1979',al:'',hist:[['Cardiología','Electrocardiograma normal. Control anual.']]},
    {id:3,n:'Sofía Benítez',dni:'52.000.003',os:'Particular',tel:'376 400-0003',nac:'2017',al:'',hist:[['Pediatría','Control de crecimiento. Vacunas al día.']]},
    {id:4,n:'Carlos Medina',dni:'25.000.004',os:'Prepaga B',tel:'376 400-0004',nac:'1972',al:'Ibuprofeno',hist:[['Cardiología','Hipertensión controlada con medicación.'],['Clínica médica','Gripe estacional.']]},
    {id:5,n:'Lucía Fernández',dni:'38.000.005',os:'Prepaga A',tel:'376 400-0005',nac:'1994',al:'',hist:[['Teleconsulta','Consulta por cefalea. Sin signos de alarma.']]},
    {id:6,n:'Tomás Acosta',dni:'54.000.006',os:'Obra social provincial',tel:'376 400-0006',nac:'2019',al:'Látex',hist:[['Pediatría','Otitis. Control en 7 días.']]},
    {id:7,n:'Ana Romero',dni:'33.000.007',os:'Particular',tel:'376 400-0007',nac:'1988',al:'',hist:[['Clínica médica','Chequeo anual.']]},
    {id:8,n:'Roberto Silva',dni:'20.000.008',os:'Prepaga B',tel:'376 400-0008',nac:'1965',al:'',hist:[['Cardiología','Control post holter.']]},
    {id:9,n:'Valentina Ruiz',dni:'41.000.009',os:'Prepaga A',tel:'376 400-0009',nac:'1998',al:'',hist:[['Clínica médica','Certificado de aptitud física.']]},
    {id:10,n:'Martín López',dni:'35.000.010',os:'Obra social provincial',tel:'376 400-0010',nac:'1990',al:'',hist:[]}
  ];
  var T=[['08:00',1,'pr','Clínica médica','atendido'],['08:20',4,'ac','Cardiología','atendido'],['08:40',3,'ls','Pediatría','sala'],['09:00',7,'pr','Clínica médica','confirmado'],
         ['09:20',2,'ac','Cardiología','confirmado'],['10:00',6,'ls','Pediatría','confirmado'],['10:20',9,'pr','Control','pendiente'],['11:00',8,'ac','Cardiología','pendiente'],['11:40',5,'pr','Teleconsulta','pendiente']];
  return {v:1,day:ymd(today),pats:P,today:T.map(function(t,i){return {id:i+1,h:t[0],p:t[1],pro:t[2],svc:t[3],st:t[4]}}),
    tomorrow:[{h:'08:40',p:10,pro:'pr',svc:'Clínica médica'},{h:'09:20',p:2,pro:'ac',svc:'Cardiología'},{h:'10:40',p:3,pro:'ls',svc:'Pediatría'}],
    rx:[],auto:true,sent:{}};
}
var S;
function load(){try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){S=null}
  /* los datos de ejemplo siempre son "de hoy": si cambio el dia, se regeneran conservando pacientes nuevos y recetas */
  if(!S||S.v!==1){S=seed()}else if(S.day!==ymd(today)){var k=seed();k.pats=S.pats;k.rx=S.rx;k.auto=S.auto;S=k}save()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function webBookings(){try{return (JSON.parse(localStorage.getItem('demo-turnos')||'[]')).filter(function(b){return b.site===SITE}).sort(function(a,b){return (a.date+a.hour)<(b.date+b.hour)?-1:1})}catch(e){return []}}
var pat=function(id){return S.pats.filter(function(p){return p.id===id})[0]||{n:'Paciente',os:'',tel:''}};

/* ---------- utilidades de interfaz ---------- */
var toastT;
function toast(m){var t=$('.toast');t.innerHTML=ico('circle-check')+'<span>'+esc(m)+'</span>';t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('on')},3000)}
function enter(box){if(RM||!G)return;G.from(box.children,{y:16,opacity:0,duration:.4,ease:'power3.out',stagger:.05,clearProps:'transform,opacity'})}
var view=$('#view'),title=$('#vtitle'),cur='hoy',arg=null;
var TITLES={hoy:'Hoy',pacientes:'Pacientes',recetas:'Recetas',mensajes:'Recordatorios'};
function go(v,a,focus){cur=v;arg=a;$$('[data-view]').forEach(function(b){if(b.dataset.view===v)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  title.textContent=TITLES[v];D.title=TITLES[v]+' · Panel Centro Médico Alba (demo)';
  view.innerHTML=R[v](a);enter(view);if(focus)view.focus({preventScroll:true});scrollTo({top:0,behavior:RM?'auto':'smooth'})}

/* ---------- vistas ---------- */
var R={};
var filt='todos';
R.hoy=function(){
  var T=S.today.slice().sort(function(a,b){return a.h<b.h?-1:1});
  var n=T.length,conf=T.filter(function(t){return t.st==='confirmado'||t.st==='sala'||t.st==='atendido'}).length,wait=T.filter(function(t){return t.st==='sala'}).length;
  var free=HOURS.length*PROS.length-n,list=T.filter(function(t){return filt==='todos'||t.pro===filt});
  var web=webBookings();
  var chips='<div class="chips" role="group" aria-label="Filtrar por profesional"><button class="chip" data-f="todos" aria-pressed="'+(filt==='todos')+'">Todos</button>'+PROS.map(function(p){return '<button class="chip" data-f="'+p.id+'" aria-pressed="'+(filt===p.id)+'"><span class="pro-dot" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+p.c+';margin-right:6px"></span>'+esc(p.n)+'</button>'}).join('')+'</div>';
  var rows=list.length?list.map(function(t){var p=pat(t.p),pr=pro(t.pro);
    return '<li class="row'+(t.st==='atendido'?' done':'')+'"><time>'+t.h+'</time><div class="who"><b>'+esc(p.n)+'</b><small><span class="pro-dot" style="background:'+pr.c+'"></span>'+esc(t.svc)+' · '+esc(pr.n)+'</small></div>'+
      '<div class="st"><label class="sr" for="st'+t.id+'" style="position:absolute;left:-9999px">Estado de '+esc(p.n)+'</label><select class="st-sel st-'+t.st+'" id="st'+t.id+'" data-st="'+t.id+'">'+STATES.map(function(s){return '<option value="'+s[0]+'"'+(s[0]===t.st?' selected':'')+'>'+s[1]+'</option>'}).join('')+'</select></div></li>'}).join(''):'<li class="empty">Sin turnos para este filtro.</li>';
  var webHtml=web.length?'<ul class="list">'+web.map(function(b){return '<li class="row"><time>'+esc(b.hour)+'</time><div class="who"><b>'+esc(b.name)+' <span class="badge web">'+ico('globe').replace('class="ico"','class="ico" style="width:12px;height:12px"')+'web</span></b><small>'+esc(nice(b.date))+' · '+esc(b.svc)+(b.pro?' · '+esc(b.pro):'')+'</small></div></li>'}).join('')+'</ul>'
    :'<div class="empty">Todavía no hay reservas online en este navegador.<br><a href="../centro-medico-alba/index.html#turnos">Sacá un turno en la web del centro</a> y volvé: aparece acá al instante.</div>';
  return '<div class="kpis"><div class="kpi p"><small>Turnos hoy</small><b>'+n+'</b></div><div class="kpi"><small>Confirmados</small><b>'+conf+'</b></div><div class="kpi"><small>En sala de espera</small><b>'+wait+'</b></div><div class="kpi"><small>Horarios libres</small><b>'+free+'</b></div></div>'+
    '<div class="two"><section class="card" aria-labelledby="h-ag"><div class="card-h"><h2 id="h-ag">Agenda del día</h2><span class="muted" style="font-size:.85rem">Tocá el estado para cambiarlo</span></div><div class="card-b">'+chips+'<ul class="list">'+rows+'</ul></div></section>'+
    '<section class="card" aria-labelledby="h-web"><div class="card-h"><h2 id="h-web">Reservas desde la web</h2><span class="badge web">'+web.length+'</span></div><div class="card-b">'+webHtml+'</div></section></div>';
};
var q='';
R.pacientes=function(id){
  if(id){var p=pat(id),turnos=S.today.filter(function(t){return t.p===id});
    return '<button class="back" data-back>'+ico('arrow-left')+'Pacientes</button><div class="two" style="margin-top:6px"><section class="card"><div class="card-b" style="padding-top:16px">'+
      '<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px"><span class="av" style="width:56px;height:56px;font-size:1.1rem">'+ini(p.n)+'</span><div><h2 style="margin:0;font-size:1.3rem">'+esc(p.n)+'</h2><span class="muted">DNI '+esc(p.dni)+'</span></div></div>'+
      (p.al?'<p class="alert">'+ico('triangle-alert')+'Alergia: '+esc(p.al)+'</p>':'')+
      '<div class="kv"><span>Cobertura</span><b>'+esc(p.os)+'</b></div><div class="kv"><span>Celular</span><b>'+esc(p.tel)+'</b></div><div class="kv"><span>Año de nacimiento</span><b>'+esc(p.nac)+'</b></div>'+
      (turnos.length?'<div class="kv"><span>Turno de hoy</span><b>'+turnos.map(function(t){return t.h+' · '+esc(t.svc)}).join(', ')+'</b></div>':'')+
      '<div class="actions"><button class="btn" data-rx="'+p.id+'">'+ico('file-text')+'Nueva receta</button><button class="btn ghost" data-newfor="'+p.id+'">'+ico('calendar-plus')+'Dar turno</button></div></div></section>'+
      '<section class="card"><div class="card-h"><h2>Historia clínica</h2></div><div class="card-b">'+(p.hist.length?'<ul class="hist">'+p.hist.map(function(h,i){return '<li><b>'+esc(h[0])+'</b><small>'+(i===0?'Última visita':'Visita anterior')+'</small>'+esc(h[1])+'</li>'}).join('')+'</ul>':'<p class="muted">Sin visitas registradas.</p>')+
      '<form data-note="'+p.id+'" style="margin-top:8px"><div class="field"><label for="nt">Agregar evolución</label><textarea class="inp" id="nt" placeholder="Ej: Control de presión 120/80."></textarea></div><button class="btn sm">Guardar en la historia</button></form></div></section></div>'}
  var L=S.pats.filter(function(p){var s=(p.n+' '+p.dni).toLowerCase();return !q||s.indexOf(q.toLowerCase())>=0});
  return '<div class="search">'+ico('search')+'<label for="q" style="position:absolute;left:-9999px">Buscar paciente</label><input class="inp" id="q" type="search" placeholder="Buscar por nombre o DNI" value="'+esc(q)+'" autocomplete="off"></div>'+
    '<section class="card"><div class="card-b" id="plist">'+plist(L)+'</div></section>';
};
function plist(L){return L.length?L.map(function(p){return '<button class="pt" data-pat="'+p.id+'"><span class="av">'+ini(p.n)+'</span><span><b>'+esc(p.n)+'</b><small>DNI '+esc(p.dni)+' · '+esc(p.os)+'</small></span>'+ico('chevron-right')+'</button>'}).join(''):'<p class="empty">No hay pacientes con ese nombre o DNI.</p>'}
R.recetas=function(pid){
  var opts=S.pats.map(function(p){return '<option value="'+p.id+'"'+(p.id===pid?' selected':'')+'>'+esc(p.n)+'</option>'}).join('');
  var hist=S.rx.length?S.rx.slice().reverse().map(function(r){return '<div class="kv"><span>'+esc(r.when)+' · '+esc(pat(r.p).n)+'</span><b>'+r.meds.length+' indicación'+(r.meds.length>1?'es':'')+'</b></div>'}).join(''):'<p class="muted">Todavía no emitiste recetas en esta demo.</p>';
  return '<div class="two"><section class="card"><div class="card-h"><h2>Nueva receta</h2><span class="badge">PDF</span></div><div class="card-b"><form id="rxf" novalidate>'+
    '<div class="field"><label for="rp">Paciente</label><select class="inp" id="rp">'+opts+'</select></div>'+
    '<div class="field"><label for="rpro">Profesional</label><select class="inp" id="rpro">'+PROS.map(function(p){return '<option value="'+p.id+'">'+esc(p.n)+' · '+esc(p.e)+'</option>'}).join('')+'</select></div>'+
    '<div class="field"><label for="rdx">Diagnóstico</label><input class="inp" id="rdx" value="Hipertensión arterial"></div>'+
    '<p style="margin:4px 0 8px;font-weight:600;font-size:.9rem">Medicamentos</p><div id="meds">'+medRow('Enalapril 10 mg','1 comprimido cada 12 h')+'</div>'+
    '<button type="button" class="btn ghost sm" data-addmed style="margin-bottom:14px">'+ico('plus')+'Agregar medicamento</button>'+
    '<div class="field"><label for="rnote">Indicaciones</label><textarea class="inp" id="rnote">Control de presión en 30 días. Dieta hiposódica.</textarea></div>'+
    '<p class="err" id="rerr" role="alert"></p><button class="btn full">'+ico('download')+'Generar y descargar PDF</button></form></div></section>'+
    '<section class="card"><div class="card-h"><h2>Emitidas hoy</h2></div><div class="card-b">'+hist+'<p class="muted" style="font-size:.85rem;margin-top:12px">El PDF lleva la marca “DEMO, sin validez”. En la versión real se firma digitalmente.</p></div></section></div>';
};
function medRow(a,b){return '<div class="med"><input class="inp" aria-label="Medicamento y dosis" placeholder="Medicamento y dosis" value="'+esc(a||'')+'"><input class="inp" aria-label="Indicación" placeholder="Indicación" value="'+esc(b||'')+'"><button type="button" class="x" data-delmed aria-label="Quitar medicamento">'+ico('trash-2')+'</button></div>'}
R.mensajes=function(){
  var web=webBookings().filter(function(b){return b.date===ymd(tomorrow)});
  var items=S.tomorrow.map(function(t,i){var p=pat(t.p);return {k:'t'+i,n:p.n,tel:p.tel,svc:t.svc,pro:pro(t.pro).n,h:t.h,web:false}})
    .concat(web.map(function(b){return {k:'w'+b.at,n:b.name,tel:'',svc:b.svc,pro:b.pro,h:b.hour,web:true}}))
    .sort(function(a,b){return a.h<b.h?-1:1});
  var f=nice(ymd(tomorrow));
  var list=items.map(function(m){var sent=S.sent[ymd(today)+m.k];
    return '<div class="msg"><div class="msg-h"><div><b>'+esc(m.n)+'</b> '+(m.web?'<span class="badge web">web</span>':'')+'<br><small class="muted">'+esc(m.h)+' · '+esc(m.svc)+'</small></div><span class="badge"'+(sent?' style="background:#DCFCE7;color:#14532D"':'')+'>'+(sent?'Enviado':'Programado')+'</span></div>'+
      '<p class="bubble">Hola '+esc(m.n.split(' ')[0])+', te recordamos tu turno de '+esc(m.svc)+(m.pro?' con '+esc(m.pro):'')+' mañana, '+esc(f)+', a las '+esc(m.h)+' h en Centro Médico Alba. Respondé 1 para confirmar o 2 para cancelar.<small>'+(sent?'enviado':'09:00')+'</small></p></div>'}).join('');
  return '<div class="two"><section class="card"><div class="card-h"><h2>Turnos de mañana</h2><span class="badge">'+items.length+'</span></div><div class="card-b">'+(list||'<p class="empty">No hay turnos para mañana.</p>')+'</div></section>'+
    '<section class="card"><div class="card-h"><h2>Automatización</h2></div><div class="card-b"><label class="switch"><span><b>Recordatorio 24 h antes</b><br><small class="muted">Por WhatsApp, a las 9:00</small></span><input type="checkbox" id="auto" '+(S.auto?'checked':'')+'></label>'+
    '<p class="muted" style="font-size:.9rem">Los pacientes que responden “2” liberan el horario y aparece libre en la web.</p><button class="btn full" data-send '+(items.length?'':'disabled')+'>'+ico('send')+'Enviar recordatorios ahora</button>'+
    '<p class="muted" style="font-size:.8rem;margin-top:10px">Demo: no se envía ningún mensaje real.</p></div></section></div>';
};

/* ---------- nuevo turno ---------- */
var dlg=$('#sheet');
function openNew(pid){
  var used=function(proId){return S.today.filter(function(t){return t.pro===proId}).map(function(t){return t.h})};
  $('#sheet-t').textContent='Nuevo turno para hoy';
  $('#sheet-b').innerHTML='<form id="nf" novalidate><div class="field"><label for="np">Paciente</label><select class="inp" id="np"><option value="">Elegí un paciente</option>'+S.pats.map(function(p){return '<option value="'+p.id+'"'+(p.id===pid?' selected':'')+'>'+esc(p.n)+'</option>'}).join('')+'<option value="new">+ Paciente nuevo</option></select></div>'+
    '<div class="field" id="nnw" hidden><label for="nn">Nombre y apellido</label><input class="inp" id="nn" autocomplete="off"></div>'+
    '<div class="field"><label for="npr">Profesional</label><select class="inp" id="npr">'+PROS.map(function(p){return '<option value="'+p.id+'">'+esc(p.n)+'</option>'}).join('')+'</select></div>'+
    '<div class="field"><label for="ns">Motivo</label><select class="inp" id="ns">'+SVCS.map(function(s){return '<option>'+s+'</option>'}).join('')+'</select></div>'+
    '<div class="field"><label for="nh">Horario libre</label><select class="inp" id="nh"></select></div><p class="err" id="nerr" role="alert"></p><button class="btn full">'+ico('check')+'Guardar turno</button></form>';
  function hours(){var u=used($('#npr').value),fr=HOURS.filter(function(h){return u.indexOf(h)<0});$('#nh').innerHTML=fr.length?fr.map(function(h){return '<option>'+h+'</option>'}).join(''):'<option value="">Sin horarios libres</option>'}
  hours();$('#npr').addEventListener('change',hours);
  $('#np').addEventListener('change',function(){$('#nnw').hidden=this.value!=='new';if(this.value==='new')$('#nn').focus()});
  $('#nf').addEventListener('submit',function(e){e.preventDefault();var v=$('#np').value,h=$('#nh').value,err='';
    if(!v)err='Elegí un paciente.';else if(v==='new'&&$('#nn').value.trim().length<3)err='Escribí el nombre del paciente nuevo.';else if(!h)err='Ese profesional no tiene horarios libres hoy.';
    if(err){$('#nerr').textContent=err;return}
    var id=+v;if(v==='new'){id=Math.max.apply(null,S.pats.map(function(p){return p.id}))+1;S.pats.push({id:id,n:$('#nn').value.trim(),dni:'Sin cargar',os:'Particular',tel:'Sin cargar',nac:'—',al:'',hist:[]})}
    S.today.push({id:Date.now(),h:h,p:id,pro:$('#npr').value,svc:$('#ns').value,st:'confirmado'});save();dlg.close();toast('Turno guardado: '+h+' h con '+pro($('#npr').value).n+'.');go('hoy')});
  if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');
  setTimeout(function(){$('#np').focus()},50);
}
$('#sheet-x').addEventListener('click',function(){dlg.close()});
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});

/* ---------- PDF de la receta ---------- */
function pdf(r){
  var J=window.jspdf&&window.jspdf.jsPDF;if(!J){toast('No se pudo cargar el generador de PDF.');return}
  var d=new J({unit:'mm',format:'a5'}),p=pat(r.p),pr=pro(r.pro),y;
  d.setFillColor(14,116,144);d.rect(0,0,148,26,'F');d.setTextColor(255);d.setFont('helvetica','bold');d.setFontSize(16);d.text('Centro Médico Alba',12,13);
  d.setFont('helvetica','normal');d.setFontSize(9);d.text('Receta · '+r.when,12,20);
  d.setTextColor(15,47,58);d.setFontSize(10);d.setFont('helvetica','bold');d.text(pr.n,12,36);d.setFont('helvetica','normal');d.text(pr.e+' · M.N. 000000 (ejemplo)',12,41);
  d.setDrawColor(220,232,236);d.line(12,46,136,46);
  d.text('Paciente: '+p.n,12,54);d.text('DNI: '+(p.dni||'-')+'   Cobertura: '+(p.os||'-'),12,60);d.text('Diagnóstico: '+r.dx,12,66);
  d.setFont('helvetica','bold');d.setFontSize(14);d.text('Rp/',12,79);d.setFontSize(10);y=88;
  r.meds.forEach(function(m,i){d.setFont('helvetica','bold');d.text((i+1)+'. '+m[0],16,y);d.setFont('helvetica','normal');var l=d.splitTextToSize(m[1],112);d.text(l,20,y+5);y+=8+l.length*5});
  if(r.note){d.setFont('helvetica','bold');d.text('Indicaciones',12,y+4);d.setFont('helvetica','normal');d.text(d.splitTextToSize(r.note,124),12,y+10)}
  d.setTextColor(200,60,60);d.setFontSize(30);d.setFont('helvetica','bold');d.text('DEMO · SIN VALIDEZ',74,150,{align:'center',angle:28});
  d.setTextColor(85,112,121);d.setFontSize(8);d.setFont('helvetica','normal');d.text('Documento de demostración con datos ficticios. Panel de gestión hecho por Mariano Campuzano.',74,202,{align:'center'});
  d.save('receta-'+p.n.toLowerCase().replace(/[^a-z]+/g,'-')+'.pdf');
}

/* ---------- eventos ---------- */
$$('[data-view]').forEach(function(b){b.addEventListener('click',function(){go(b.dataset.view,null,true)})});
$$('[data-new]').forEach(function(b){b.addEventListener('click',function(){openNew()})});
$('[data-reset]').addEventListener('click',function(){if(!confirm('¿Restablecer la demo? Se borran los cambios hechos en este navegador.'))return;S=seed();save();filt='todos';q='';go('hoy');toast('Demo restablecida.')});
view.addEventListener('change',function(e){var t=e.target;
  if(t.dataset.st){var x=S.today.filter(function(k){return k.id==t.dataset.st})[0];x.st=t.value;save();t.className='st-sel st-'+t.value;
    var li=t.closest('.row');li.classList.toggle('done',t.value==='atendido');toast(pat(x.p).n+': '+t.options[t.selectedIndex].text.toLowerCase()+'.');
    var keep=t.id;view.innerHTML=R.hoy();var n=D.getElementById(keep);if(n)n.focus()}
  else if(t.id==='auto'){S.auto=t.checked;save();toast(t.checked?'Recordatorios automáticos activados.':'Recordatorios automáticos pausados.')}});
view.addEventListener('input',function(e){if(e.target.id==='q'){q=e.target.value;$('#plist').innerHTML=plist(S.pats.filter(function(p){return (p.n+' '+p.dni).toLowerCase().indexOf(q.toLowerCase())>=0}))}});
view.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(b.dataset.f){filt=b.dataset.f;view.innerHTML=R.hoy();var c=$('[data-f="'+filt+'"]',view);if(c)c.focus()}
  else if(b.dataset.pat)go('pacientes',+b.dataset.pat,true);
  else if(b.hasAttribute('data-back'))go('pacientes',null,true);
  else if(b.dataset.rx)go('recetas',+b.dataset.rx,true);
  else if(b.dataset.newfor)openNew(+b.dataset.newfor);
  else if(b.hasAttribute('data-addmed')){var m=$('#meds');m.insertAdjacentHTML('beforeend',medRow());$$('.med',m).pop().querySelector('input').focus()}
  else if(b.hasAttribute('data-delmed')){var all=$$('.med',view);if(all.length>1)b.closest('.med').remove();else $$('input',all[0]).forEach(function(i){i.value=''})}
  else if(b.hasAttribute('data-send')){var web=webBookings().filter(function(x){return x.date===ymd(tomorrow)});S.tomorrow.forEach(function(t,i){S.sent[ymd(today)+'t'+i]=1});web.forEach(function(x){S.sent[ymd(today)+'w'+x.at]=1});save();go('mensajes');toast('Recordatorios marcados como enviados (demo).')}});
view.addEventListener('submit',function(e){var f=e.target;e.preventDefault();
  if(f.id==='rxf'){var meds=$$('.med',f).map(function(r){var i=$$('input',r);return [i[0].value.trim(),i[1].value.trim()]}).filter(function(m){return m[0]});
    if(!meds.length){$('#rerr').textContent='Agregá al menos un medicamento.';return}
    var r={p:+$('#rp').value,pro:$('#rpro').value,dx:$('#rdx').value.trim()||'-',meds:meds.map(function(m){return [m[0],m[1]||'Según indicación médica']}),note:$('#rnote').value.trim(),when:new Date().toLocaleDateString('es-AR')+' '+new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})};
    S.rx.push(r);save();pdf(r);go('recetas',r.p);toast('Receta generada para '+pat(r.p).n+'.')}
  else if(f.dataset.note){var p=pat(+f.dataset.note),t=$('#nt',f).value.trim();if(!t)return;p.hist.unshift(['Evolución '+new Date().toLocaleDateString('es-AR'),t]);save();go('pacientes',p.id);toast('Evolución guardada en la historia de '+p.n+'.')}});
addEventListener('storage',function(e){if(e.key==='demo-turnos'&&cur==='hoy')go('hoy')});

load();
$('#today').textContent=DAYS[today.getDay()].replace(/^./,function(c){return c.toUpperCase()})+' '+today.getDate()+' de '+MON[today.getMonth()];
go('hoy');
})();
