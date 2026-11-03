/* modules.js · modulos interactivos de los sitios demo (turnos, recetas, fichas, catalogo, carrito,
   reservas, cotizadores...). Cada <div data-mod="x"> trae su configuracion en un <script type="application/json">.
   Todo corre en el navegador con datos ficticios: nada se envia ni se guarda en un servidor. */
(function(){
'use strict';
var K=window.KIT,$=K.$,$$=K.$$,E=K.esc,I=K.icon,M=function(n){return K.money(n)};
var D=document,G=window.gsap;
function cfgOf(el){try{return JSON.parse($('script[type="application/json"]',el).textContent)}catch(e){return {}}}
function h(html){var t=D.createElement('template');t.innerHTML=html.trim();return t.content.firstChild}
var DAYS=['dom','lun','mar','mié','jue','vie','sáb'],MONTHS=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function fmtDate(d){return DAYS[d.getDay()]+' '+d.getDate()+' de '+MONTHS[d.getMonth()]}
function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function swap(box,html){box.innerHTML=html;if(G&&!K.RM)G.from(box.children,{y:18,opacity:0,duration:.45,ease:'power3.out',stagger:.04})}
function ics(title,start,mins,where){var p=function(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'')};var end=new Date(start.getTime()+mins*60000);
  var s='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//demo//ES\r\nBEGIN:VEVENT\r\nUID:'+Date.now()+'@demo\r\nDTSTAMP:'+p(new Date())+'\r\nDTSTART:'+p(start)+'\r\nDTEND:'+p(end)+'\r\nSUMMARY:'+title+'\r\nLOCATION:'+(where||'')+'\r\nEND:VEVENT\r\nEND:VCALENDAR';
  return 'data:text/calendar;charset=utf-8,'+encodeURIComponent(s)}

/* ================= TURNOS ================= */
function agenda(el){
  var c=cfgOf(el),st={step:0},box=$('.mod-ui',el);
  var days=[],d=new Date();d.setHours(0,0,0,0);
  while(days.length<(c.days||12)){d=new Date(d.getTime()+864e5);if((c.closed||[0]).indexOf(d.getDay())<0)days.push(d)}
  function taken(day,pro){var r=K.rnd(ymd(day)+pro);return (c.hours||[]).filter(function(){return r()<.38})}
  function bar(){var n=c.pros&&c.pros.length>1?5:4;var s='<div class="steps-ui" aria-hidden="true">';for(var i=0;i<n;i++)s+='<i class="'+(i<=st.step?'on':'')+'"></i>';return s+'</div>'}
  function render(){
    var s=bar();
    if(st.step===0){s+='<p class="lbl">'+E(c.q1||'¿Qué necesitás?')+'</p><div class="list">'+c.services.map(function(v,i){return '<button class="li" data-i="'+i+'"><span><b>'+E(v.n)+'</b><br><small class="muted">'+E(v.d||'')+'</small></span>'+(v.p?'<b>'+M(v.p)+'</b>':I('chevron-right'))+'</button>'}).join('')+'</div>'}
    else if(st.step===1&&c.pros&&c.pros.length>1){s+='<p class="lbl">'+E(c.q2||'Elegí profesional')+'</p><div class="list">'+c.pros.map(function(p,i){return '<button class="li" data-p="'+i+'"><span style="display:flex;gap:12px;align-items:center"><span class="av">'+E(p.n.split(' ').map(function(w){return w[0]}).join('').slice(0,2))+'</span><span><b>'+E(p.n)+'</b><br><small class="muted">'+E(p.r||'')+'</small></span></span>'+I('chevron-right')+'</button>'}).join('')+'</div>'}
    else if(st.step===dayStep()){var day=days[st.day||0],tk=taken(day,st.pro||0);
      s+='<p class="lbl">Día</p><div class="days" role="group" aria-label="Días disponibles">'+days.map(function(x,i){return '<button class="day" data-d="'+i+'" aria-pressed="'+(i===(st.day||0))+'"><small>'+DAYS[x.getDay()]+'</small><b>'+x.getDate()+'</b><small>'+MONTHS[x.getMonth()].slice(0,3)+'</small></button>'}).join('')+'</div>'+
        '<p class="lbl" style="margin-top:18px">Horario</p><div class="slots">'+(c.hours||[]).map(function(hh){var t=tk.indexOf(hh)>=0;return '<button class="chip" data-h="'+hh+'" '+(t?'disabled aria-label="'+hh+' ocupado"':'')+' aria-pressed="'+(st.hour===hh)+'">'+hh+'</button>'}).join('')+'</div>'+
        '<div style="display:flex;justify-content:space-between;gap:10px;margin-top:20px"><button class="btn ghost sm" data-back>Volver</button><button class="btn sm" data-next '+(st.hour?'':'disabled')+'>Continuar</button></div>'}
    else if(st.step===dayStep()+1){s+='<form class="f" novalidate><div class="field"><label for="ag-n">'+E(c.nameLabel||'Tu nombre')+'</label><input class="inp" id="ag-n" required autocomplete="name" value="'+E(st.name||'')+'"></div>'+
        (c.extra?'<div class="field"><label for="ag-x">'+E(c.extra)+'</label><input class="inp" id="ag-x" required value="'+E(st.extraV||'')+'"></div>':'')+
        '<div class="field"><label for="ag-t">Celular</label><input class="inp" id="ag-t" type="tel" inputmode="tel" required autocomplete="tel" placeholder="Ej: 376 412 3456" value="'+E(st.tel||'')+'"></div>'+
        '<p class="note" id="ag-err" role="alert"></p><div style="display:flex;justify-content:space-between;gap:10px;margin-top:8px"><button type="button" class="btn ghost sm" data-back>Volver</button><button class="btn sm">'+E(c.cta||'Confirmar turno')+'</button></div></form>'}
    else{var sv=c.services[st.svc],day2=days[st.day||0],p=c.pros&&c.pros[st.pro||0],hm=st.hour.split(':'),start=new Date(day2);start.setHours(+hm[0],+hm[1]);
      s='<div style="text-align:center;display:grid;gap:12px;justify-items:center"><div class="ic" style="display:grid;place-items:center;width:72px;height:72px;border-radius:50%;background:var(--primary);color:var(--on-primary)">'+I('calendar-check')+'</div><h3 class="h-m">'+E(c.okTitle||'¡Turno confirmado!')+'</h3><p class="muted">Te esperamos, '+E(st.name.split(' ')[0])+'.</p></div>'+
        '<div style="margin-top:18px"><div class="kv"><span class="muted">Servicio</span><b>'+E(sv.n)+'</b></div>'+(p?'<div class="kv"><span class="muted">Profesional</span><b>'+E(p.n)+'</b></div>':'')+(st.extraV?'<div class="kv"><span class="muted">'+E(c.extra)+'</span><b>'+E(st.extraV)+'</b></div>':'')+
        '<div class="kv"><span class="muted">Fecha</span><b>'+fmtDate(day2)+'</b></div><div class="kv"><span class="muted">Hora</span><b>'+st.hour+' h</b></div></div>'+
        '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:20px"><a class="btn sm" download="turno.ics" href="'+ics(sv.n+' · '+(c.biz||''),start,sv.m||30,c.addr)+'">'+I('calendar-plus')+'Agregar al calendario</a><button class="btn ghost sm" data-reset>Pedir otro turno</button></div>'+
        '<p class="note">Demo: en la versión real llega un recordatorio por WhatsApp 24 h antes.</p>';K.burst();save(sv,p,day2)}
    swap(box,s);
  }
  function dayStep(){return c.pros&&c.pros.length>1?2:1}
  /* el turno queda solo en este navegador, para verlo en el panel de gestion demo (sin telefono) */
  function save(sv,p,day){try{var L=JSON.parse(localStorage.getItem('demo-turnos')||'[]');
    L.push({site:location.pathname.split('/').slice(-2,-1)[0],biz:c.biz||'',svc:sv.n,pro:p?p.n:'',date:ymd(day),hour:st.hour,name:st.name,extra:st.extraV||'',at:Date.now()});
    localStorage.setItem('demo-turnos',JSON.stringify(L.slice(-30)))}catch(e){}}
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.i!==undefined){st.svc=+b.dataset.i;st.step=1;st.hour=null;render()}
    else if(b.dataset.p!==undefined){st.pro=+b.dataset.p;st.step=2;st.hour=null;render()}
    else if(b.dataset.d!==undefined){st.day=+b.dataset.d;st.hour=null;render()}
    else if(b.dataset.h){st.hour=b.dataset.h;$$('[data-h]',box).forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('[data-next]',box).disabled=false}
    else if(b.hasAttribute('data-next')){st.step++;render()}
    else if(b.hasAttribute('data-back')){st.step--;render()}
    else if(b.hasAttribute('data-reset')){st={step:0};render()}});
  box.addEventListener('submit',function(e){e.preventDefault();var n=$('#ag-n',box).value.trim(),t=$('#ag-t',box).value.replace(/\D/g,''),x=$('#ag-x',box);
    var err=!n?'Escribí tu nombre.':(x&&!x.value.trim())?'Completá: '+c.extra+'.':t.length<8?'Escribí un celular válido (al menos 8 números).':'';
    if(err){$('#ag-err',box).textContent=err;return}st.name=n;st.tel=t;st.extraV=x?x.value.trim():'';st.step++;render()});
  render();
}

/* ================= RECETA EN PDF ================= */
function receta(el){
  var c=cfgOf(el),box=$('.mod-ui',el),rows=[{m:c.meds[0]||'',p:c.posos[0]||''}];
  function render(){
    box.innerHTML='<form novalidate><div class="row2"><div class="field"><label for="rx-p">'+E(c.patient||'Paciente')+'</label><input class="inp" id="rx-p" value="'+E(c.defPatient||'')+'"></div>'+
      '<div class="field"><label for="rx-d">'+E(c.idLabel||'DNI')+'</label><input class="inp" id="rx-d" value="'+E(c.defId||'')+'"></div></div>'+
      '<p class="lbl">Medicación</p><div id="rx-rows">'+rows.map(function(r,i){return '<div class="rx-row"><input class="inp" aria-label="Medicamento '+(i+1)+'" list="rx-meds" data-k="m" data-i="'+i+'" value="'+E(r.m)+'"><input class="inp" aria-label="Indicación '+(i+1)+'" list="rx-pos" data-k="p" data-i="'+i+'" value="'+E(r.p)+'"><button type="button" class="icon-btn" data-del="'+i+'" aria-label="Quitar">'+I('x')+'</button></div>'}).join('')+'</div>'+
      '<datalist id="rx-meds">'+c.meds.map(function(m){return '<option value="'+E(m)+'">'}).join('')+'</datalist><datalist id="rx-pos">'+c.posos.map(function(m){return '<option value="'+E(m)+'">'}).join('')+'</datalist>'+
      '<button type="button" class="chip" data-add>'+I('plus')+' Agregar medicamento</button>'+
      '<div class="field" style="margin-top:14px"><label for="rx-n">Indicaciones</label><textarea class="inp" id="rx-n">'+E(c.defNote||'')+'</textarea></div>'+
      '<p class="note" id="rx-err" role="alert"></p><div style="display:flex;flex-wrap:wrap;gap:10px"><button class="btn">'+I('file-text')+'Generar receta PDF</button></div>'+
      '<p class="note">Demo: el PDF lleva la marca de agua “DEMO, sin validez”. La versión real usa firma digital y número de receta.</p></form>';
  }
  box.addEventListener('input',function(e){var t=e.target;if(t.dataset.k)rows[+t.dataset.i][t.dataset.k]=t.value});
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-add')){rows.push({m:'',p:''});render();var ins=$$('[data-k="m"]',box);ins[ins.length-1].focus()}
    if(b.dataset.del!==undefined){if(rows.length>1){rows.splice(+b.dataset.del,1);render()}}});
  box.addEventListener('submit',function(e){e.preventDefault();var pac=$('#rx-p',box).value.trim(),meds=rows.filter(function(r){return r.m.trim()});
    if(!pac||!meds.length){$('#rx-err',box).textContent=!pac?'Completá el nombre de '+(c.patient||'paciente').toLowerCase()+'.':'Agregá al menos un medicamento.';return}
    $('#rx-err',box).textContent='';
    var J=window.jspdf&&window.jspdf.jsPDF;if(!J){K.toast('No se pudo cargar el generador de PDF.');return}
    var doc=new J({unit:'mm',format:'a5'}),col=c.pdfColor||[20,120,110],y=18;
    doc.setFillColor(col[0],col[1],col[2]);doc.rect(0,0,148,26,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(16);doc.text(c.biz,12,13);
    doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.text(c.pro+'  ·  '+c.mat,12,20);
    doc.setTextColor(30,30,30);y=38;doc.setFontSize(9);doc.text('Fecha: '+new Date().toLocaleDateString('es-AR'),12,y);doc.text('N° '+Math.floor(1e5+Math.random()*9e5),110,y);
    y+=8;doc.setFont('helvetica','bold');doc.text((c.patient||'Paciente')+': ',12,y);doc.setFont('helvetica','normal');doc.text(pac,12+doc.getTextWidth((c.patient||'Paciente')+': '),y);
    var idv=$('#rx-d',box).value.trim();if(idv){y+=6;doc.text((c.idLabel||'DNI')+': '+idv,12,y)}
    y+=10;doc.setFont('helvetica','bold');doc.setFontSize(18);doc.setTextColor(col[0],col[1],col[2]);doc.text('Rp/',12,y);doc.setTextColor(30,30,30);doc.setFontSize(10);
    meds.forEach(function(r,i){y+=9;doc.setFont('helvetica','bold');doc.text((i+1)+'. '+r.m,16,y);if(r.p){y+=5;doc.setFont('helvetica','normal');doc.text(doc.splitTextToSize(r.p,118),20,y)}});
    var note=$('#rx-n',box).value.trim();if(note){y+=12;doc.setFont('helvetica','bold');doc.text('Indicaciones',12,y);doc.setFont('helvetica','normal');var ls=doc.splitTextToSize(note,124);y+=5;doc.text(ls,12,y);y+=ls.length*4.5}
    doc.setDrawColor(120);doc.line(84,185,136,185);doc.setFontSize(8);doc.text(c.pro,110,190,{align:'center'});doc.text(c.mat,110,194,{align:'center'});
    doc.setTextColor(200,40,40);doc.setFontSize(34);doc.setFont('helvetica','bold');doc.saveGraphicsState&&doc.saveGraphicsState();
    if(doc.GState){doc.setGState(new doc.GState({opacity:.13}))}doc.text('DEMO · SIN VALIDEZ',74,120,{align:'center',angle:30});doc.restoreGraphicsState&&doc.restoreGraphicsState();
    doc.setTextColor(120);doc.setFontSize(7);doc.text(c.addr||'',74,203,{align:'center'});
    doc.save('receta-demo.pdf');K.toast('Receta generada: revisá tus descargas.')});
  render();
}

/* ================= FICHA / HISTORIA CLINICA ================= */
function ficha(el){
  var c=cfgOf(el),box=$('.mod-ui',el),sel=0,tab='h',q='';
  function render(){
    var list=c.items.map(function(p,i){return {p:p,i:i}}).filter(function(o){return !q||(o.p.n+' '+o.p.sub).toLowerCase().indexOf(q)>=0});
    var p=c.items[sel];
    box.innerHTML='<div class="fi" style="display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.4fr);gap:18px">'+
      '<div><label class="sr" for="fi-q">Buscar</label><input class="inp" id="fi-q" type="search" placeholder="Buscar '+E(c.noun||'paciente')+'…" value="'+E(q)+'"><div class="list" style="margin-top:10px">'+
      (list.length?list.map(function(o){return '<button class="li'+(o.i===sel?' on':'')+'" data-s="'+o.i+'"><span style="display:flex;gap:10px;align-items:center"><span class="av">'+E(o.p.ini||o.p.n[0])+'</span><span><b>'+E(o.p.n)+'</b><br><small class="muted">'+E(o.p.sub)+'</small></span></span></button>'}).join(''):'<p class="empty">Sin resultados.</p>')+'</div></div>'+
      '<div><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div><h3 style="font-size:1.4rem">'+E(p.n)+'</h3><p class="muted small">'+E(p.info)+'</p></div>'+(p.alert?'<span class="badge bad">'+I('triangle-alert')+E(p.alert)+'</span>':'')+'</div>'+
      '<div class="tabs" role="tablist" style="margin-top:14px"><button role="tab" data-t="h" aria-selected="'+(tab==='h')+'">Historia</button><button role="tab" data-t="v" aria-selected="'+(tab==='v')+'">'+E(c.tab2||'Vacunas')+'</button></div><div id="fi-b"></div></div></div>';
    var b=$('#fi-b',box);
    if(tab==='h'){b.innerHTML='<div class="timeline">'+p.visits.map(function(v){return '<div><small class="muted">'+E(v.d)+'</small><p><b>'+E(v.t)+'</b></p><p class="small muted">'+E(v.x)+'</p></div>'}).join('')+'</div>'+
      '<form style="display:flex;gap:8px;margin-top:16px"><label class="sr" for="fi-n">Nueva nota</label><input class="inp" id="fi-n" placeholder="Agregar evolución…"><button class="btn sm">Guardar</button></form>'}
    else{b.innerHTML='<div class="list">'+p.vacc.map(function(v){var cls=v.s==='ok'?'ok':v.s==='due'?'warn':'bad',lb=v.s==='ok'?'Al día':v.s==='due'?'Próxima':'Vencida';return '<div class="li"><span><b>'+E(v.n)+'</b><br><small class="muted">'+E(v.d)+'</small></span><span class="badge '+cls+'">'+lb+'</span></div>'}).join('')+'</div>'+
      (p.vacc.some(function(v){return v.s!=='ok'})?'<button class="btn sm" style="margin-top:14px" data-remind>'+I('bell')+'Enviar recordatorio</button>':'')}
  }
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    if(b.dataset.s!==undefined){sel=+b.dataset.s;render()}else if(b.dataset.t){tab=b.dataset.t;render()}else if(b.hasAttribute('data-remind'))K.toast('Recordatorio programado por WhatsApp (demo).')});
  box.addEventListener('input',function(e){if(e.target.id==='fi-q'){q=e.target.value.toLowerCase();var pos=e.target.selectionStart;render();var i=$('#fi-q',box);i.focus();i.setSelectionRange(pos,pos)}});
  box.addEventListener('submit',function(e){e.preventDefault();var v=$('#fi-n',box).value.trim();if(!v)return;c.items[sel].visits.unshift({d:'Hoy · '+new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'}),t:'Nota de evolución',x:v});render();K.toast('Nota guardada en la historia.')});
  render();
  if(innerWidth<700)box.querySelector('.fi').style.gridTemplateColumns='1fr';
}

/* ================= SIMULADOR DE CUOTAS ================= */
function cuotas(el){
  var c=cfgOf(el),box=$('.mod-ui',el),v={price:c.price,down:c.down||30,term:c.terms[Math.min(1,c.terms.length-1)]};
  box.innerHTML='<div class="field"><label for="cu-p">'+E(c.label||'Precio')+': <b id="cu-pv"></b></label><input class="range" id="cu-p" type="range" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+v.price+'"></div>'+
    '<div class="field"><label for="cu-d">Anticipo: <b id="cu-dv"></b></label><input class="range" id="cu-d" type="range" min="'+(c.downMin||10)+'" max="80" step="5" value="'+v.down+'"></div>'+
    '<p class="lbl">Plazo</p><div class="chips" id="cu-t">'+c.terms.map(function(t){return '<button type="button" class="chip" data-t="'+t+'" aria-pressed="'+(t===v.term)+'">'+t+' '+E(c.unit||'cuotas')+'</button>'}).join('')+'</div>'+
    '<div class="total"><span>'+E(c.out||'Cuota mensual estimada')+'</span><b id="cu-o" aria-live="polite"></b></div><div id="cu-k" class="kpis"></div>'+
    '<p class="note">Simulación orientativa con tasa nominal anual del '+c.rate+'% (sistema francés). No es una oferta de crédito.</p>'+
    (c.cta?'<a class="btn" style="margin-top:16px" href="#'+(c.ctaHref||'contacto')+'">'+E(c.cta)+'</a>':'');
  var last=0;
  function calc(){var cap=v.price*(1-v.down/100),n=c.unit==='años'?v.term*12:v.term,i=c.rate/1200,q=i?cap*i/(1-Math.pow(1+i,-n)):cap/n;
    $('#cu-pv',box).textContent=M(v.price);$('#cu-dv',box).textContent=v.down+'% ('+M(v.price*v.down/100)+')';
    var o=$('#cu-o',box),from={x:last};if(G&&!K.RM)G.to(from,{x:q,duration:.5,ease:'power3.out',onUpdate:function(){o.textContent=M(from.x)}});else o.textContent=M(q);last=q;
    $('#cu-k',box).innerHTML='<div class="kpi"><small>A financiar</small><b>'+M(cap)+'</b></div><div class="kpi"><small>Total en cuotas</small><b>'+M(q*n)+'</b></div><div class="kpi"><small>Cuotas</small><b>'+n+'</b></div>'}
  box.addEventListener('input',function(e){if(e.target.id==='cu-p')v.price=+e.target.value;if(e.target.id==='cu-d')v.down=+e.target.value;calc()});
  box.addEventListener('click',function(e){var b=e.target.closest('[data-t]');if(!b)return;v.term=+b.dataset.t;$$('[data-t]',box).forEach(function(x){x.setAttribute('aria-pressed',x===b)});calc()});
  K.cuotas=function(price){v.price=Math.max(c.min,Math.min(c.max,price));$('#cu-p',box).value=v.price;calc()};
  calc();
}

/* ================= CARRITO (compartido) ================= */
var cart={items:[],el:null};
function cartUI(){if(cart.el)return;var c=K.cfg;
  var sc=h('<div class="scrim"></div>'),dr=h('<aside class="cart" aria-label="Tu pedido" aria-hidden="true"><div class="cart-h"><b style="font:var(--fdw) 1.4rem/1 var(--fd)">'+E(c.cartTitle||'Tu pedido')+'</b><button class="close" aria-label="Cerrar">'+I('x')+'</button></div><div class="cart-b"></div><div class="cart-f"></div></aside>');
  D.body.appendChild(sc);D.body.appendChild(dr);cart.el=dr;cart.sc=sc;
  function close(){dr.classList.remove('on');sc.classList.remove('on');dr.setAttribute('aria-hidden','true')}
  sc.addEventListener('click',close);$('.close',dr).addEventListener('click',close);
  D.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
  dr.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var i=+b.dataset.i;
    if(b.dataset.q==='+')cart.items[i].q++;if(b.dataset.q==='-'){cart.items[i].q--;if(!cart.items[i].q)cart.items.splice(i,1)}
    if(b.hasAttribute('data-go')){var msg=(c.orderIntro||'Hola! Quiero hacer este pedido:')+'\n'+cart.items.map(function(x){return '• '+x.q+' x '+x.n+(x.o?' ('+x.o+')':'')+' — '+M(x.p*x.q)}).join('\n')+'\nTotal: '+M(tot());
      $('.cart-f',dr).innerHTML='<p class="lbl">Así le llega el pedido al negocio por WhatsApp:</p><pre style="white-space:pre-wrap;font:500 .85rem/1.5 var(--fb);background:var(--bg);border-radius:12px;padding:12px;max-height:200px;overflow:auto">'+E(msg)+'</pre><p class="note">Es una demo: no se envía nada.</p><button class="btn" style="width:100%;margin-top:10px" data-done>Listo</button>';return}
    if(b.hasAttribute('data-done')){cart.items=[];close();K.toast(c.okOrder||'Pedido enviado (demo).');K.burst()}
    paint()});
}
function tot(){return cart.items.reduce(function(s,x){return s+x.p*x.q},0)}
function paint(){var dr=cart.el;if(!dr)return;var n=cart.items.reduce(function(s,x){return s+x.q},0);
  $$('.cart-btn .n').forEach(function(b){b.textContent=n;b.hidden=!n});
  $('.cart-b',dr).innerHTML=cart.items.length?cart.items.map(function(x,i){return '<div class="li"><span><b>'+E(x.n)+'</b>'+(x.o?'<br><small class="muted">'+E(x.o)+'</small>':'')+'<br><small>'+M(x.p)+'</small></span><span class="qty"><button data-q="-" data-i="'+i+'" aria-label="Quitar uno">−</button><b>'+x.q+'</b><button data-q="+" data-i="'+i+'" aria-label="Agregar uno">+</button></span></div>'}).join(''):'<p class="empty">'+I('shopping-bag')+'<br>Tu pedido está vacío.</p>';
  $('.cart-f',dr).innerHTML='<div class="total"><span>Total</span><b>'+M(tot())+'</b></div><button class="btn" style="width:100%;margin-top:14px" data-go '+(cart.items.length?'':'disabled')+'>'+E(K.cfg.checkout||'Enviar pedido por WhatsApp')+'</button>'}
K.addToCart=function(n,p,o){o=o||'';cartUI();var f=cart.items.filter(function(x){return x.n===n&&x.o===o})[0];if(f)f.q++;else cart.items.push({n:n,p:p,o:o||'',q:1});paint();
  $$('.cart-btn').forEach(function(b){if(G&&!K.RM)G.fromTo(b,{scale:1.35},{scale:1,duration:.6,ease:'elastic.out(1,.4)'})});K.toast(n+' agregado.')};
K.openCart=function(){cartUI();paint();cart.el.classList.add('on');cart.sc.classList.add('on');cart.el.setAttribute('aria-hidden','false');$('.close',cart.el).focus()};
$$('.cart-btn').forEach(function(b){b.addEventListener('click',K.openCart)});

/* ================= CATALOGO (filtros con Flip, favoritos, orden) ================= */
function catalogo(el){
  var c=cfgOf(el),box=$('.mod-ui',el),cat='',sort='',favs={};
  box.innerHTML='<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-bottom:22px"><div class="chips" role="group" aria-label="Filtrar">'+['Todos'].concat(c.cats).map(function(x,i){return '<button class="chip" data-c="'+(i?E(x):'')+'" aria-pressed="'+(!i)+'">'+E(x)+'</button>'}).join('')+'</div>'+
    '<label class="sr" for="ct-s">Ordenar</label><select class="inp" id="ct-s" style="width:auto;min-width:200px"><option value="">Destacados</option><option value="a">Menor precio</option><option value="d">Mayor precio</option></select></div>'+
    '<div class="cat-grid">'+c.items.map(function(it,i){return '<article class="item" data-cat="'+E(it.cat)+'" data-p="'+it.p+'" data-i="'+i+'"><div class="art" style="background:'+(it.bg||'var(--bg2)')+'">'+(it.svg||'')+(it.tag?'<span class="tag" style="position:absolute;top:12px;left:12px;background:var(--card)">'+E(it.tag)+'</span>':'')+'</div>'+
      '<div class="body"><h3>'+E(it.n)+'</h3><div class="meta">'+(it.meta||[]).map(function(m){return '<span>'+I(m[0])+E(m[1])+'</span>'}).join('')+'</div><div class="foot"><span class="price">'+(it.pl||M(it.p))+'</span><span style="display:flex;gap:8px">'+
      (c.fav?'<button class="fav" data-f="'+i+'" aria-pressed="false" aria-label="Guardar '+E(it.n)+'">'+I('heart')+'</button>':'')+
      (c.cart?'<button class="btn sm" data-add="'+i+'">'+E(c.addLabel||'Agregar')+'</button>':c.action?'<button class="btn sm" data-act="'+i+'">'+E(c.action)+'</button>':'')+'</span></div></div></article>'}).join('')+'</div>'+
    (c.fav?'<p class="note" id="ct-f" aria-live="polite"></p>':'');
  var grid=$('.cat-grid',box),items=$$('.item',grid);
  function apply(){var Fl=window.Flip,state=Fl&&!K.RM?Fl.getState(items):null;
    items.forEach(function(it){it.style.display=!cat||it.dataset.cat===cat?'':'none'});
    var arr=items.slice().sort(function(a,b){return sort==='a'?a.dataset.p-b.dataset.p:sort==='d'?b.dataset.p-a.dataset.p:a.dataset.i-b.dataset.i});arr.forEach(function(x){grid.appendChild(x)});
    if(state)Fl.from(state,{duration:.7,ease:'power3.inOut',absolute:true,scale:true,onEnter:function(e){return G.fromTo(e,{opacity:0,scale:.8},{opacity:1,scale:1,duration:.5})},onLeave:function(e){return G.to(e,{opacity:0,scale:.8,duration:.4})}})}
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    if(b.dataset.c!==undefined){cat=b.dataset.c;$$('[data-c]',box).forEach(function(x){x.setAttribute('aria-pressed',x===b)});apply()}
    else if(b.dataset.f!==undefined){var on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);favs[b.dataset.f]=on;K.pop(b);var n=Object.keys(favs).filter(function(k){return favs[k]}).length;$('#ct-f',box).textContent=n?'Guardaste '+n+' '+(n>1?'favoritos':'favorito')+'. En la versión real te avisamos si baja el precio.':''}
    else if(b.dataset.add!==undefined){var it=c.items[+b.dataset.add];K.addToCart(it.n,it.p,it.opt)}
    else if(b.dataset.act!==undefined){var it2=c.items[+b.dataset.act];if(c.actMode==='cuotas'&&K.cuotas){K.cuotas(it2.p);var t=$('[data-mod="cuotas"]');if(t)(K.lenis?K.lenis.scrollTo(t,{offset:-90}):t.scrollIntoView({behavior:'smooth'}));K.toast('Simulá la cuota de '+it2.n+'.')}else K.toast(it2.n+': te contactamos para coordinar (demo).')}});
  $('#ct-s',box).addEventListener('change',function(e){sort=e.target.value;apply()});
}

/* ================= MENU con carrito ================= */
function menu(el){
  var c=cfgOf(el),box=$('.mod-ui',el),cat=c.cats[0];
  function render(){box.innerHTML='<div class="tabs" role="tablist">'+c.cats.map(function(x){return '<button role="tab" data-c="'+E(x)+'" aria-selected="'+(x===cat)+'">'+E(x)+'</button>'}).join('')+'</div>'+
    '<div class="list">'+c.items.filter(function(i){return i.c===cat}).map(function(i){var idx=c.items.indexOf(i);return '<div class="li" style="padding:16px 18px"><span><b style="font-size:1.05rem">'+E(i.n)+'</b>'+(i.t?' <span class="badge info">'+E(i.t)+'</span>':'')+'<br><small class="muted">'+E(i.d)+'</small></span><span style="display:flex;align-items:center;gap:12px;flex:none"><b>'+M(i.p)+'</b><button class="btn sm" data-a="'+idx+'" aria-label="Agregar '+E(i.n)+'">'+I('plus')+'</button></span></div>'}).join('')+'</div>'}
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.dataset.c){cat=b.dataset.c;render()}else if(b.dataset.a!==undefined){var i=c.items[+b.dataset.a];K.addToCart(i.n,i.p)}});
  render();
}

/* ================= RESERVA DE HABITACION (rango de fechas) ================= */
function reserva(el){
  var c=cfgOf(el),box=$('.mod-ui',el),today=new Date();today.setHours(0,0,0,0);
  var view=new Date(today.getFullYear(),today.getMonth(),1),a=null,b=null,room=0,guests=2;
  function nights(){return a&&b?Math.round((b-a)/864e5):0}
  function render(){var y=view.getFullYear(),m=view.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,len=new Date(y,m+1,0).getDate();
    var cal='<div class="cal-h"><button class="close" data-m="-1" aria-label="Mes anterior">'+I('chevron-left')+'</button><b>'+MONTHS[m]+' '+y+'</b><button class="close" data-m="1" aria-label="Mes siguiente">'+I('chevron-right')+'</button></div><div class="cal">'+['lu','ma','mi','ju','vi','sá','do'].map(function(d){return '<span class="dw">'+d+'</span>'}).join('');
    for(var i=0;i<first;i++)cal+='<span></span>';
    for(var d=1;d<=len;d++){var dt=new Date(y,m,d),t=+dt,cls=(a&&t===+a)||(b&&t===+b)?'edge':(a&&b&&t>a&&t<b)?'in':'';cal+='<button data-day="'+t+'" class="'+cls+'" '+(dt<today?'disabled':'')+' aria-label="'+fmtDate(dt)+'">'+d+'</button>'}
    cal+='</div>';
    var r=c.rooms[room],n=nights(),sub=n*r.p,tax=Math.round(sub*(c.tax||0)/100);
    box.innerHTML='<div class="grid2" style="align-items:start"><div>'+cal+'<p class="note">'+(a?(b?'Del '+fmtDate(a)+' al '+fmtDate(b):'Elegí la fecha de salida.'):'Elegí la fecha de llegada.')+'</p></div><div>'+
      '<p class="lbl">Habitación</p><div class="list">'+c.rooms.map(function(x,i){return '<button class="li'+(i===room?' on':'')+'" data-r="'+i+'"><span><b>'+E(x.n)+'</b><br><small class="muted">'+E(x.d)+' · hasta '+x.cap+' personas</small></span><b>'+M(x.p)+'<small class="muted"> /noche</small></b></button>'}).join('')+'</div>'+
      '<div class="field" style="margin-top:14px"><label for="rs-g">Huéspedes</label><select class="inp" id="rs-g">'+[1,2,3,4,5,6].map(function(g){return '<option'+(g===guests?' selected':'')+' '+(g>r.cap?'disabled':'')+'>'+g+'</option>'}).join('')+'</select></div>'+
      '<div class="kv"><span class="muted">'+n+' noche'+(n===1?'':'s')+' × '+M(r.p)+'</span><b>'+M(sub)+'</b></div>'+(c.tax?'<div class="kv"><span class="muted">Impuestos ('+c.tax+'%)</span><b>'+M(tax)+'</b></div>':'')+
      '<div class="total"><span>Total</span><b>'+M(sub+tax)+'</b></div><button class="btn" style="width:100%;margin-top:14px" data-book '+(n?'':'disabled')+'>'+E(c.cta||'Reservar')+'</button><p class="note">Demo: la reserva real se confirma con una seña online.</p></div></div>'}
  box.addEventListener('click',function(e){var t=e.target.closest('button');if(!t||t.disabled)return;
    if(t.dataset.m){view=new Date(view.getFullYear(),view.getMonth()+(+t.dataset.m),1);if(view<new Date(today.getFullYear(),today.getMonth(),1))view=new Date(today.getFullYear(),today.getMonth(),1);render()}
    else if(t.dataset.day){var d=new Date(+t.dataset.day);if(!a||b||d<=a){a=d;b=null}else b=d;render()}
    else if(t.dataset.r!==undefined){room=+t.dataset.r;if(guests>c.rooms[room].cap)guests=c.rooms[room].cap;render()}
    else if(t.hasAttribute('data-book')){K.toast('¡Reserva confirmada! '+nights()+' noches en '+c.rooms[room].n+' (demo).');K.burst();a=b=null;render()}});
  box.addEventListener('change',function(e){if(e.target.id==='rs-g')guests=+e.target.value});
  render();
}

/* ================= RESERVA DE MESA ================= */
function mesa(el){
  var c=cfgOf(el),box=$('.mod-ui',el),days=[],d=new Date(),st={d:0,h:null,p:2};d.setHours(0,0,0,0);
  for(var i=0;i<8;i++){days.push(new Date(d.getTime()+i*864e5))}
  function render(){var tk=(function(){var r=K.rnd(ymd(days[st.d])+'m');return c.hours.filter(function(){return r()<.3})})();
    box.innerHTML='<p class="lbl">Personas</p><div class="chips">'+[1,2,3,4,5,6,8].map(function(p){return '<button class="chip" data-p="'+p+'" aria-pressed="'+(p===st.p)+'">'+p+'</button>'}).join('')+'</div>'+
      '<p class="lbl" style="margin-top:16px">Día</p><div class="days">'+days.map(function(x,i){return '<button class="day" data-d="'+i+'" aria-pressed="'+(i===st.d)+'"><small>'+(i===0?'hoy':DAYS[x.getDay()])+'</small><b>'+x.getDate()+'</b><small>'+MONTHS[x.getMonth()].slice(0,3)+'</small></button>'}).join('')+'</div>'+
      '<p class="lbl" style="margin-top:16px">Horario</p><div class="slots">'+c.hours.map(function(hh){var t=tk.indexOf(hh)>=0;return '<button class="chip" data-h="'+hh+'" '+(t?'disabled':'')+' aria-pressed="'+(st.h===hh)+'">'+hh+'</button>'}).join('')+'</div>'+
      '<form style="display:flex;gap:8px;margin-top:18px;flex-wrap:wrap"><label class="sr" for="ms-n">Nombre</label><input class="inp" id="ms-n" placeholder="Nombre para la reserva" style="flex:1 1 200px" autocomplete="name"><button class="btn" '+(st.h?'':'disabled')+'>'+E(c.cta||'Reservar mesa')+'</button></form><p class="note" id="ms-e" role="alert"></p>'}
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.p){st.p=+b.dataset.p;render()}else if(b.dataset.d){st.d=+b.dataset.d;st.h=null;render()}else if(b.dataset.h){st.h=b.dataset.h;render()}});
  box.addEventListener('submit',function(e){e.preventDefault();var n=$('#ms-n',box).value.trim();if(!n){$('#ms-e',box).textContent='Escribí un nombre para la reserva.';return}
    K.toast('Mesa para '+st.p+' el '+fmtDate(days[st.d])+' a las '+st.h+' (demo).');K.burst();st.h=null;render()});
  render();
}

/* ================= GRILLA DE CLASES ================= */
function horario(el){
  var c=cfgOf(el),box=$('.mod-ui',el),mine={};
  function render(){var hours=[];c.classes.forEach(function(k){if(hours.indexOf(k.h)<0)hours.push(k.h)});hours.sort();
    var n=Object.keys(mine).filter(function(k){return mine[k]}).length;
    box.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px"><p class="muted">Tocá una clase para reservar tu lugar.</p><span class="tag">'+I('ticket')+'Tus clases: '+n+'</span></div><div class="sched"><table><thead><tr><th></th>'+c.days.map(function(d){return '<th scope="col">'+E(d)+'</th>'}).join('')+'</tr></thead><tbody>'+
      hours.map(function(hh){return '<tr><th scope="row">'+hh+'</th>'+c.days.map(function(d,di){var k=c.classes.filter(function(x){return x.h===hh&&x.d===di})[0];if(!k)return '<td></td>';var id=di+'-'+hh,on=mine[id],left=k.cap-k.t-(on?1:0),full=left<=0&&!on;
        return '<td><button class="cls'+(on?' on':'')+(full?' full':'')+'" data-k="'+id+'" data-left="'+left+'" '+(full?'aria-disabled="true"':'')+'><b>'+E(k.n)+'</b><small>'+E(k.c)+'</small><small>'+(full?'Completa':left+' lugares')+'</small></button></td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>'}
  box.addEventListener('click',function(e){var b=e.target.closest('.cls');if(!b)return;if(b.getAttribute('aria-disabled')){K.toast('Clase completa: te anotamos en lista de espera (demo).');return}
    mine[b.dataset.k]=!mine[b.dataset.k];render();K.toast(mine[b.dataset.k]?'Lugar reservado.':'Reserva cancelada.')});
  render();
}

/* ================= COTIZADOR por pasos ================= */
function wizard(el){
  var c=cfgOf(el),box=$('.mod-ui',el),st={i:0,a:{}};
  c.steps.forEach(function(s){if(s.type==='range')st.a[s.k]=s.def})
  function total(){var base=c.base||0,mult=1,add=0,qty=1;c.steps.forEach(function(s){if(s.type==='range'&&s.role==='qty'&&st.a[s.k]!==undefined)qty*=st.a[s.k]});
    c.steps.forEach(function(s){var v=st.a[s.k];if(v===undefined)return;
      if(s.type==='range'){if(s.role==='add')add+=v*(s.each||0)}
      else{var sel=[].concat(v);sel.forEach(function(ix){var o=s.opts[ix];if(o.m)mult*=o.m;if(o.a)add+=o.a;if(o.aq)add+=o.aq*qty})}});
    return (base*mult+add)*(c.perQty?qty:1)}
  function render(){var s=c.steps[st.i],last=st.i>=c.steps.length;var bar='<div class="steps-ui" aria-hidden="true">'+c.steps.map(function(x,i){return '<i class="'+(i<=st.i?'on':'')+'"></i>'}).join('')+'<i class="'+(last?'on':'')+'"></i></div>';
    if(last){var t=total(),lo=t*(1-(c.spread||.12)),hi=t*(1+(c.spread||.12));
      swap(box,bar+'<p class="lbl">'+E(c.outLabel||'Presupuesto estimado')+'</p><p class="big-num">'+M(lo)+' – '+M(hi)+'</p><div style="margin-top:14px">'+c.steps.map(function(x){var v=st.a[x.k];var txt=x.type==='range'?v+' '+(x.unit||''):[].concat(v).map(function(ix){return x.opts[ix].l}).join(', ');return '<div class="kv"><span class="muted">'+E(x.short||x.q)+'</span><b>'+E(txt||'—')+'</b></div>'}).join('')+'</div>'+
        '<p class="note">'+E(c.disclaimer||'Rango orientativo: el valor final sale de la visita técnica.')+'</p><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px"><button class="btn" data-ok>'+E(c.cta||'Pedir presupuesto formal')+'</button><button class="btn ghost" data-reset>Empezar de nuevo</button></div>');K.burst();return}
    var body='';
    if(s.type==='range')body='<div class="field"><label for="wz-r" class="lbl">'+E(s.q)+'</label><p class="big-num" id="wz-v">'+st.a[s.k]+' '+E(s.unit||'')+'</p><input class="range" id="wz-r" type="range" min="'+s.min+'" max="'+s.max+'" step="'+(s.step||1)+'" value="'+st.a[s.k]+'"></div>';
    else body='<p class="lbl">'+E(s.q)+(s.multi?' <small class="muted">(podés elegir varias)</small>':'')+'</p><div class="grid2">'+s.opts.map(function(o,i){var on=[].concat(st.a[s.k]===undefined?[]:st.a[s.k]).indexOf(i)>=0;return '<button class="li'+(on?' on':'')+'" data-o="'+i+'" aria-pressed="'+on+'" style="min-height:64px"><span style="display:flex;gap:12px;align-items:center">'+(o.i?'<span class="av">'+I(o.i)+'</span>':'')+'<span><b>'+E(o.l)+'</b>'+(o.d?'<br><small class="muted">'+E(o.d)+'</small>':'')+'</span></span></button>'}).join('')+'</div>';
    var ok=s.type==='range'||(st.a[s.k]!==undefined&&[].concat(st.a[s.k]).length);
    swap(box,bar+body+'<div style="display:flex;justify-content:space-between;gap:10px;margin-top:20px"><button class="btn ghost sm" data-back '+(st.i?'':'disabled')+'>Volver</button><button class="btn sm" data-next '+(ok?'':'disabled')+'>'+(st.i===c.steps.length-1?'Ver resultado':'Siguiente')+'</button></div>')}
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;var s=c.steps[st.i];
    if(b.dataset.o!==undefined){var i=+b.dataset.o;if(s.multi){var cur=[].concat(st.a[s.k]||[]),p=cur.indexOf(i);if(p>=0)cur.splice(p,1);else cur.push(i);st.a[s.k]=cur}else st.a[s.k]=i;
      if(!s.multi){st.i++;render()}else render()}
    else if(b.hasAttribute('data-next')){st.i++;render()}else if(b.hasAttribute('data-back')){st.i--;render()}
    else if(b.hasAttribute('data-reset')){st={i:0,a:{}};c.steps.forEach(function(x){if(x.type==='range')st.a[x.k]=x.def});render()}
    else if(b.hasAttribute('data-ok'))K.toast(c.okMsg||'Solicitud enviada: te contactamos en 24 h (demo).')});
  box.addEventListener('input',function(e){if(e.target.id==='wz-r'){var s=c.steps[st.i];st.a[s.k]=+e.target.value;$('#wz-v',box).textContent=e.target.value+' '+(s.unit||'')}});
  render();
}

/* ================= QUIZ / EVALUADOR ================= */
function quiz(el){
  var c=cfgOf(el),box=$('.mod-ui',el),st={i:0,score:0,ans:[]};
  function render(){var bar='<div class="steps-ui" aria-hidden="true">'+c.qs.map(function(x,i){return '<i class="'+(i<st.i?'on':'')+'"></i>'}).join('')+'</div>';
    if(st.i>=c.qs.length){var html;
      if(c.mode==='score'){var lv=c.levels.filter(function(l){return st.score>=l[0]}).pop();html='<p class="lbl">Tu resultado</p><p class="big-num">'+E(lv[1])+'</p><p class="muted" style="margin-top:8px">'+st.score+' de '+c.qs.length+' respuestas correctas. '+E(lv[2])+'</p>'}
      else html='<p class="lbl">'+E(c.sumTitle||'Resumen de tu caso')+'</p><div style="margin-top:8px">'+c.qs.map(function(q,i){return '<div class="kv"><span class="muted">'+E(q.short||q.q)+'</span><b>'+E(q.opts[st.ans[i]])+'</b></div>'}).join('')+'</div><p class="muted" style="margin-top:12px">'+E(c.sumText||'')+'</p>';
      swap(box,bar.replace(/class=""/g,'class="on"')+html+'<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:18px"><button class="btn" data-ok>'+E(c.cta||'Quiero que me contacten')+'</button><button class="btn ghost" data-reset>Repetir</button></div>');K.burst();return}
    var q=c.qs[st.i];swap(box,bar+'<p class="muted small">Pregunta '+(st.i+1)+' de '+c.qs.length+'</p><h3 class="h-m" style="margin:6px 0 18px">'+E(q.q)+'</h3>'+q.opts.map(function(o,i){return '<button class="quiz-opt" data-o="'+i+'">'+E(o)+'</button>'}).join(''))}
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    if(b.dataset.o!==undefined){var q=c.qs[st.i],i=+b.dataset.o;st.ans.push(i);$$('.quiz-opt',box).forEach(function(x){x.disabled=true});
      if(c.mode==='score'){if(i===q.ok)st.score++;b.classList.add(i===q.ok?'ok':'no');if(i!==q.ok)$$('.quiz-opt',box)[q.ok].classList.add('ok')}else b.classList.add('ok');
      setTimeout(function(){st.i++;render()},c.mode==='score'?800:350)}
    else if(b.hasAttribute('data-reset')){st={i:0,score:0,ans:[]};render()}else if(b.hasAttribute('data-ok'))K.toast(c.okMsg||'Listo: te escribimos hoy mismo (demo).')});
  render();
}

/* ================= AHORRO SOLAR ================= */
function solar(el){
  var c=cfgOf(el),box=$('.mod-ui',el),bill=c.def;
  box.innerHTML='<div class="field"><label for="so-b" class="lbl">¿Cuánto pagás de luz por mes?</label><p class="big-num" id="so-v"></p><input class="range" id="so-b" type="range" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+bill+'"></div><div class="kpis" id="so-k"></div><div class="meter" style="margin-top:18px" aria-hidden="true"><i id="so-m"></i></div><p class="small muted" id="so-c" style="margin-top:8px"></p>'+
    '<p class="note">Estimación con supuestos de ejemplo: tarifa '+M(c.kwh)+'/kWh, '+c.yieldKwh+' kWh por panel al año y cobertura máxima del '+c.cover+'%. El estudio real usa tu factura.</p>';
  function calc(){var kwhY=bill/c.kwh*12,panels=Math.max(2,Math.ceil(kwhY*c.cover/100/c.yieldKwh)),gen=panels*c.yieldKwh,save=Math.min(gen,kwhY)*c.kwh,cost=panels*c.panelCost+c.fixed,years=cost/save;
    $('#so-v',box).textContent=M(bill);
    $('#so-k',box).innerHTML='<div class="kpi"><small>Paneles</small><b>'+panels+'</b></div><div class="kpi"><small>Ahorro por año</small><b>'+M(save)+'</b></div><div class="kpi"><small>Recuperás la inversión en</small><b>'+years.toFixed(1)+' años</b></div>';
    $('#so-m',box).style.width=Math.min(100,Math.min(gen,kwhY)/kwhY*100)+'%';
    $('#so-c',box).textContent='Cubrís el '+Math.round(Math.min(gen,kwhY)/kwhY*100)+'% de tu consumo y evitás unos '+Math.round(gen*.4)+' kg de CO₂ por año.'}
  $('#so-b',box).addEventListener('input',function(e){bill=+e.target.value;calc()});calc();
}

/* ================= RESPIRACION GUIADA ================= */
function breath(el){
  var c=cfgOf(el),box=$('.mod-ui',el),run=false,timer,phase=0,cycles=0;
  var P=c.phases||[['Inhalá',4,1],['Sostené',4,1],['Exhalá',6,.55]];
  box.innerHTML='<div class="breath"><div class="ring"></div><div class="core"><b id="br-t">Listo</b><span class="muted" id="br-s">Tocá empezar</span></div></div><div style="display:flex;justify-content:center;gap:10px;margin-top:22px"><button class="btn" id="br-go">'+I('play')+'Empezar</button></div><p class="note" style="text-align:center" id="br-c" aria-live="polite"></p>';
  var ring=$('.ring',box),t=$('#br-t',box),s=$('#br-s',box);
  function step(){if(!run)return;var p=P[phase],sec=p[1];t.textContent=p[0];
    ring.style.transition='transform '+sec+'s cubic-bezier(.45,0,.55,1)';ring.style.transform='scale('+p[2]+')';
    var left=sec;s.textContent=left+' s';clearInterval(timer);timer=setInterval(function(){left--;if(left>0)s.textContent=left+' s';else{clearInterval(timer);phase=(phase+1)%P.length;if(!phase){cycles++;$('#br-c',box).textContent=cycles+' ciclo'+(cycles>1?'s':'')+' completo'+(cycles>1?'s':'')+'.'}step()}},1000)}
  $('#br-go',box).addEventListener('click',function(){run=!run;this.innerHTML=run?I('pause')+'Pausar':I('play')+'Seguir';if(run)step();else{clearInterval(timer);t.textContent='En pausa';s.textContent=''}});
}

/* ================= ARMA TU PIZZA ================= */
function pizza(el){
  var c=cfgOf(el),box=$('.mod-ui',el),size=1,tops={};
  function dots(seed,n,col,r){var rnd=K.rnd(seed),s='';for(var i=0;i<n;i++){var a=rnd()*6.283,d=Math.sqrt(rnd())*78;s+='<circle cx="'+(100+Math.cos(a)*d).toFixed(1)+'" cy="'+(100+Math.sin(a)*d).toFixed(1)+'" r="'+r+'" fill="'+col+'"/>'}return s}
  function price(){var p=c.sizes[size].p;Object.keys(tops).forEach(function(k){if(tops[k])p+=c.tops[k].p});return p}
  function render(){
    box.innerHTML='<div class="grid2" style="align-items:center"><div><svg viewBox="0 0 200 200" role="img" aria-label="Tu pizza" id="pz-svg" style="width:100%;max-width:360px;margin:auto"><circle cx="100" cy="100" r="96" fill="#E8B26A"/><circle cx="100" cy="100" r="86" fill="#D0412B"/><circle cx="100" cy="100" r="84" fill="#F4D58D" opacity=".92"/>'+
      c.tops.map(function(t,i){return '<g class="pz-t" data-t="'+i+'" style="opacity:'+(tops[i]?1:0)+';transition:opacity .4s">'+dots(t.n,t.q,t.col,t.r)+'</g>'}).join('')+'</svg></div><div>'+
      '<p class="lbl">Tamaño</p><div class="chips">'+c.sizes.map(function(s,i){return '<button class="chip" data-s="'+i+'" aria-pressed="'+(i===size)+'">'+E(s.n)+'</button>'}).join('')+'</div>'+
      '<p class="lbl" style="margin-top:16px">Ingredientes</p><div class="chips">'+c.tops.map(function(t,i){return '<button class="chip" data-t="'+i+'" aria-pressed="'+!!tops[i]+'">'+E(t.n)+' +'+M(t.p)+'</button>'}).join('')+'</div>'+
      '<div class="total"><span>Tu pizza</span><b id="pz-p">'+M(price())+'</b></div><button class="btn" style="width:100%;margin-top:14px" data-add>'+I('shopping-bag')+'Agregar al pedido</button></div></div>';
    if(G&&!K.RM)G.fromTo('#pz-svg',{rotate:-25,scale:.9},{rotate:0,scale:1,duration:.8,ease:'back.out(1.6)'})}
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    if(b.dataset.s!==undefined){size=+b.dataset.s;render()}
    else if(b.dataset.t!==undefined){var i=+b.dataset.t;tops[i]=!tops[i];b.setAttribute('aria-pressed',tops[i]);var g=$('.pz-t[data-t="'+i+'"]',box);g.style.opacity=tops[i]?1:0;if(tops[i]&&G&&!K.RM)G.from(g.children,{scale:0,transformOrigin:'50% 50%',duration:.4,stagger:.01,ease:'back.out(3)'});$('#pz-p',box).textContent=M(price())}
    else if(b.hasAttribute('data-add')){var sel=Object.keys(tops).filter(function(k){return tops[k]}).map(function(k){return c.tops[k].n});K.addToCart('Pizza '+c.sizes[size].n,price(),sel.join(', ')||'Muzzarella')}});
  render();
}

/* ================= ANTES / DESPUES ================= */
function ba(el){var r=$('input',el);if(!r)return;var f=function(){el.style.setProperty('--x',r.value+'%')};r.addEventListener('input',f);f();
  if(G&&!K.RM&&window.ScrollTrigger){var o={v:15};G.to(o,{v:50,duration:1.6,ease:'power3.inOut',scrollTrigger:{trigger:el,start:'top 75%'},onUpdate:function(){r.value=o.v;f()}})}}

/* ================= VENCIMIENTOS ================= */
function venc(el){
  var c=cfgOf(el),box=$('.mod-ui',el),dig=null,t=new Date(),y=t.getFullYear(),m=t.getMonth();
  function render(){var first=(new Date(y,m,1).getDay()+6)%7,len=new Date(y,m+1,0).getDate(),ev={};
    if(dig!==null)c.taxes.forEach(function(tx){var d=tx.day+Math.floor(dig/tx.group);if(d<=len)(ev[d]=ev[d]||[]).push(tx.n)});
    var cal='<div class="cal">'+['lu','ma','mi','ju','vi','sá','do'].map(function(d){return '<span class="dw">'+d+'</span>'}).join('');for(var i=0;i<first;i++)cal+='<span></span>';
    for(var d=1;d<=len;d++)cal+='<button class="'+(ev[d]?'edge':'')+'" '+(ev[d]?'data-ev="'+E(ev[d].join(' · '))+'"':'disabled')+' aria-label="'+d+(ev[d]?': '+E(ev[d].join(', ')):'')+'">'+d+'</button>';cal+='</div>';
    box.innerHTML='<p class="lbl">Último número de tu CUIT</p><div class="chips" style="margin-bottom:16px">'+[0,1,2,3,4,5,6,7,8,9].map(function(n){return '<button class="chip" data-g="'+n+'" aria-pressed="'+(n===dig)+'">'+n+'</button>'}).join('')+'</div>'+
      '<div class="grid2" style="align-items:start"><div><p class="lbl" style="text-transform:capitalize">'+MONTHS[m]+' '+y+'</p>'+cal+'</div><div><p class="lbl">Tus vencimientos del mes</p><div class="list" id="vc-l">'+
      (dig===null?'<p class="empty">Elegí el último número de tu CUIT.</p>':Object.keys(ev).map(function(d){return '<div class="li"><span><b>'+d+' de '+MONTHS[m]+'</b><br><small class="muted">'+E(ev[d].join(', '))+'</small></span>'+(+d<t.getDate()?'<span class="badge ok">Pasado</span>':+d-t.getDate()<=5?'<span class="badge warn">Pronto</span>':'<span class="badge info">Pendiente</span>')+'</div>'}).join(''))+
      '</div>'+(dig!==null?'<button class="btn sm" style="margin-top:14px" data-rem>'+I('bell')+'Avisarme por WhatsApp</button>':'')+'</div></div><p class="note">Calendario de ejemplo para la demo: las fechas reales salen del cronograma oficial de cada año.</p>'}
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.dataset.g!==undefined){dig=+b.dataset.g;render()}else if(b.dataset.ev)K.toast(b.dataset.ev);else if(b.hasAttribute('data-rem'))K.toast('Listo: te avisamos 3 días antes de cada vencimiento (demo).')});
  render();
}

/* ================= TARJETA DE SELLOS ================= */
function sellos(el){var c=cfgOf(el),box=$('.mod-ui',el),n=c.start||3,goal=c.goal||10;
  function render(){box.innerHTML='<div class="stamps">'+Array.from({length:goal},function(_,i){return '<button class="stamp'+(i<n?' on':'')+'" data-i="'+i+'" aria-label="Sello '+(i+1)+'">'+(i<n?I(c.icon||'coffee'):(i===goal-1?I('gift'):''))+'</button>'}).join('')+'</div><p class="muted" style="margin-top:14px" aria-live="polite">'+(n>=goal?E(c.win||'¡Ganaste un café de regalo!'):'Te faltan '+(goal-n)+' para tu '+E(c.prize||'café gratis')+'.')+'</p>'+(n>=goal?'<button class="btn sm" style="margin-top:10px" data-r>Reiniciar tarjeta</button>':'')}
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-r')){n=0;render();return}if(n<goal){n++;render();var s=$$('.stamp',box)[n-1];if(G&&!K.RM)G.from(s,{scale:2.2,rotate:-60,opacity:0,duration:.6,ease:'back.out(2)'});if(n>=goal)K.burst()}});render()}

/* ================= SEGUIMIENTO DE PEDIDO ================= */
function track(el){var c=cfgOf(el),box=$('.mod-ui',el),t;
  function render(k){box.innerHTML='<div class="track-steps">'+c.steps.map(function(s,i){return '<div class="'+(i<=k?'on':'')+'"><span class="dot">'+I(s.i)+'</span><span><b>'+E(s.n)+'</b><br><small class="muted">'+E(s.d)+'</small></span></div>'}).join('')+'</div><button class="btn" style="margin-top:16px" data-go>'+(k<0?I('play')+'Simular pedido':k>=c.steps.length-1?'Simular otro':'En camino…')+'</button>'}
  box.addEventListener('click',function(e){if(!e.target.closest('[data-go]'))return;clearInterval(t);var k=0;render(k);t=setInterval(function(){k++;render(k);if(k>=c.steps.length-1){clearInterval(t);K.burst()}},1600)});render(-1)}

var MODS={agenda:agenda,receta:receta,ficha:ficha,cuotas:cuotas,catalogo:catalogo,menu:menu,reserva:reserva,mesa:mesa,horario:horario,wizard:wizard,quiz:quiz,solar:solar,breath:breath,pizza:pizza,venc:venc,sellos:sellos,track:track};
K.use(function(){$$('[data-mod]').forEach(function(el){var f=MODS[el.dataset.mod];if(f)f(el)});$$('.ba').forEach(ba)});
})();
