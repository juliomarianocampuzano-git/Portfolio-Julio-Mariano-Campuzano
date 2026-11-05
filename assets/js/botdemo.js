/* Demo en vivo del asistente de WhatsApp (hero).
   Todo corre en el navegador con reglas y datos ficticios: no se envia nada a ningun servidor.
   Lo que escribe el visitante se muestra con textContent (nunca como HTML). */
(function(){
  var root=document.getElementById('bot');if(!root)return;
  var log=document.getElementById('bot-log'),quick=document.getElementById('bot-quick'),form=document.getElementById('bot-form'),inp=document.getElementById('bot-q'),
      nameEl=document.getElementById('bot-name'),stEl=document.getElementById('bot-st'),avEl=document.getElementById('bot-av'),stat=document.getElementById('bot-stat');
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var busy=false,state=null,ctx={},misses=0,answered=0,mode='comida',started=false;

  function norm0(t){return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9ñ:\s]/g,' ').replace(/\s+/g,' ').trim()}
  /* con el sitio en ingles o italiano, el bot entiende las palabras clave en esos idiomas:
     se pasan a su equivalente en español antes de buscar la respuesta */
  var SYN={'see the menu':'menu','i want':'quiero','i d like':'quiero','id like':'quiero','vorrei':'quiero','voglio':'quiero','how much':'cuanto','pick up':'retiro','where is':'donde esta','book an appointment':'sacar un turno',
    order:'pedido',ordine:'pedido',ordinare:'pedir',buy:'comprar',comprare:'comprar',menu:'menu',food:'comida',cibo:'comida',
    hours:'horarios',hour:'hora',open:'abren',opening:'horario',orari:'horarios',orario:'horario',aperti:'abierto',
    delivery:'envio',deliver:'envio',shipping:'envio',ship:'envio',consegna:'envio',consegne:'envios',spedizione:'envio',spedite:'mandan',
    price:'precio',prices:'precios',cost:'cuesta',prezzo:'precio',prezzi:'precios',quanto:'cuanto',costa:'cuesta',
    where:'donde',address:'direccion',location:'ubicacion',dove:'donde',indirizzo:'direccion',
    pay:'pagar',payment:'pago',card:'tarjeta',cash:'efectivo',transfer:'transferencia',pagare:'pagar',pagamento:'pago',carta:'tarjeta',contanti:'efectivo',bonifico:'transferencia',
    chicken:'pollo',chickens:'pollos',half:'medio',mezzo:'medio',fries:'papas',chips:'papas',patatine:'papas',soda:'gaseosa',drink:'gaseosa',coke:'coca',bibita:'gaseosa',
    one:'un',a:'un',two:'2',three:'3',four:'4',six:'6',dozen:'docena',due:'2',tre:'3',quattro:'4',sei:'6',dozzina:'docena',and:'y',e:'y',
    appointment:'turno',book:'reservar',booking:'turno',schedule:'agendar',appuntamento:'turno',prenota:'reservar',prenotare:'reservar',prenotazione:'turno',
    haircut:'corte',cut:'corte',hair:'pelo',colour:'color',dye:'tintura',nails:'unas',manicure:'manicura',eyebrows:'cejas',brows:'cejas',taglio:'corte',capelli:'pelo',colore:'color',unghie:'unas',sopracciglia:'cejas',
    change:'cambiar',reschedule:'reprogramar',cambiare:'cambiar',spostare:'mover',cancel:'cancelar',annulla:'cancelar',annullare:'cancelar',
    products:'productos',product:'productos',catalog:'catalogo',prodotti:'productos',catalogo:'catalogo',
    instalments:'cuotas',installments:'cuotas',rate:'cuotas',finance:'financiar',
    track:'seguir',tracking:'tracking',traccia:'seguir',seguire:'seguir',
    warranty:'garantia',garanzia:'garantia',return:'devolucion',exchange:'cambio',reso:'devolucion',
    headphones:'auriculares',earphones:'auriculares',cuffie:'auriculares',charger:'cargador',caricatore:'cargador',lamp:'lampara',lampada:'lampara',light:'luz',speaker:'parlante',cassa:'parlante',mouse:'mouse',
    stock:'stock',available:'stock',disponibile:'stock',
    pickup:'retiro',collect:'retiro',ritiro:'retiro',ritirare:'retiro',
    thanks:'gracias','thank you':'gracias',grazie:'gracias',hello:'hola',hi:'hola',hey:'hola',ciao:'hola',salve:'hola',
    yes:'si',ok:'dale',okay:'dale',si:'si',today:'hoy',oggi:'hoy',tomorrow:'manana',domani:'manana',
    monday:'lunes',tuesday:'martes',wednesday:'miercoles',thursday:'jueves',friday:'viernes',saturday:'sabado',
    lunedi:'lunes',martedi:'martes',mercoledi:'miercoles',giovedi:'jueves',venerdi:'viernes',sabato:'sabado',
    mon:'lun',tue:'mar',wed:'mie',thu:'jue',fri:'vie',sat:'sab',mer:'mie',gio:'jue',ven:'vie',sab:'sab',person:'persona',human:'humano',agent:'asesor',operatore:'persona'};
  function norm(t){
    var n=norm0(t),L=(document.documentElement.lang||'es').slice(0,2);if(L==='es')return n;
    Object.keys(SYN).forEach(function(k){if(k.indexOf(' ')>-1&&n.indexOf(k)>-1)n=n.split(k).join(SYN[k])});
    return n.split(' ').map(function(w){return Object.prototype.hasOwnProperty.call(SYN,w)?SYN[w]:w}).join(' ');
  }
  function has(t,words){return words.some(function(w){return (' '+t+' ').indexOf(' '+w)>-1})}
  function money(n){return '$'+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
  function now(){var d=new Date();return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
  var NUM={un:1,una:1,uno:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,docena:12};

  /* ---------- negocios de ejemplo ---------- */
  var BIZ={
    comida:{name:'Rotisería El Fogón',av:'F',
      hi:'¡Hola! Soy el asistente de El Fogón. Puedo mostrarte el menú, tomar tu pedido o contarte cómo hacemos los envíos.',
      quick:['Ver menú','Hacer un pedido','Horarios','Envíos'],
      items:[{k:['pollo','pollos'],n:'Pollo entero',p:12000},{k:['media','medio'],n:'Medio pollo',p:6500},{k:['empanada','empanadas'],n:'Empanada',p:1200},{k:['papas','papa'],n:'Papas fritas',p:4000},{k:['gaseosa','gaseosas','coca','bebida'],n:'Gaseosa 1,5 L',p:2500}],
      faq:[
        [['menu','carta','precio','precios','cuanto','que tienen','comida'],function(){return 'Hoy tenemos:\n• Pollo entero '+money(12000)+'\n• Medio pollo '+money(6500)+'\n• Empanadas '+money(1200)+' c/u\n• Papas fritas '+money(4000)+'\n• Gaseosa 1,5 L '+money(2500)}],
        [['horario','horarios','abren','abierto','cierran','hora'],'Abrimos de martes a domingo, de 11 a 15 y de 19 a 23.'],
        [['envio','envios','delivery','zona','llevan','mandan'],'Hacemos envíos en Posadas: hasta 3 km es gratis, más lejos '+money(1500)+'. Tarda entre 35 y 45 minutos.'],
        [['pago','pagar','transferencia','mercado','tarjeta','efectivo'],'Aceptamos efectivo, transferencia y Mercado Pago.'],
        [['donde','direccion','ubicacion','local'],'Estamos en Av. Ejemplo 1234, Posadas. También podés retirar en el local.']
      ],
      flow:[['pedido','pedir','quiero','encargar','comprar'],'order']},
    turnos:{name:'Estética Luna',av:'L',
      hi:'¡Hola! Soy el asistente de Estética Luna. Te ayudo a sacar un turno, ver precios o cambiar una reserva.',
      quick:['Sacar un turno','Precios','Horarios','Dónde están'],
      services:[{k:['corte','pelo'],n:'Corte',p:8000,d:'45 min'},{k:['color','tintura','mechas'],n:'Color',p:25000,d:'2 h'},{k:['manicura','unas','manos'],n:'Manicura',p:9000,d:'1 h'},{k:['cejas','perfilado'],n:'Perfilado de cejas',p:6000,d:'30 min'}],
      faq:[
        [['precio','precios','cuanto','servicios','sale','cuesta'],function(){return 'Nuestros servicios:\n• Corte '+money(8000)+' (45 min)\n• Color '+money(25000)+' (2 h)\n• Manicura '+money(9000)+' (1 h)\n• Perfilado de cejas '+money(6000)+' (30 min)'}],
        [['horario','horarios','abren','atienden','hora'],'Atendemos de lunes a sábado, de 9 a 19.'],
        [['donde','direccion','ubicacion','local','estan'],'Estamos en Calle Ejemplo 567, Posadas, a media cuadra de la plaza.'],
        [['cambiar','cancelar turno','reprogramar','mover'],'Claro. Decime "sacar un turno" y elegimos un horario nuevo; el anterior se libera solo.'],
        [['pago','pagar','transferencia','tarjeta','sena'],'Se paga en el local: efectivo, transferencia o tarjeta. No pedimos seña.']
      ],
      flow:[['turno','turnos','reservar','agendar','cita','sacar'],'turn']},
    tienda:{name:'TecnoHogar',av:'T',
      hi:'¡Hola! Soy el asistente de TecnoHogar. Consultame precios y stock, cuotas o el estado de tu pedido.',
      quick:['Ver productos','¿Hay stock de auriculares?','Seguir mi pedido','Cuotas'],
      products:[{k:['auricular','auriculares'],n:'Auriculares bluetooth',p:45000,s:12},{k:['cargador','cargadores'],n:'Cargador rápido',p:18000,s:30},{k:['lampara','lamparas','luz'],n:'Lámpara LED',p:25000,s:0},{k:['parlante','parlantes','bocina'],n:'Parlante portátil',p:60000,s:5},{k:['mouse','raton'],n:'Mouse inalámbrico',p:15000,s:20},{k:['reloj','smartwatch'],n:'Smartwatch',p:90000,s:3}],
      faq:[
        [['productos','catalogo','que venden','que tienen','lista'],function(){return 'Algunos productos:\n'+BIZ.tienda.products.map(function(x){return '• '+x.n+' '+money(x.p)+(x.s?'':' (sin stock)')}).join('\n')}],
        [['cuota','cuotas','tarjeta','financiar'],'3 cuotas sin interés con tarjeta en compras desde '+money(30000)+'.'],
        [['envio','envios','llega','mandan','delivery'],'Enviamos a todo el país. En Posadas, comprando antes de las 13, te llega en el día.'],
        [['garantia','cambio','devolucion'],'Todos los productos tienen 6 meses de garantía y 30 días para cambios.'],
        [['horario','horarios','abren','hora'],'Atendemos online las 24 horas; el local abre de lunes a sábado, de 9 a 20.']
      ],
      flow:[['seguir','pedido','envio de mi','donde esta','tracking','rastrear'],'track']}
  };

  /* ---------- pintar mensajes ---------- */
  function bubble(who,text){
    var b=document.createElement('div');b.className='bm '+who;
    var p=document.createElement('p');p.textContent=text;b.appendChild(p);
    var t=document.createElement('time');t.textContent=now()+(who==='u'?' ✓✓':'');b.appendChild(t);
    log.appendChild(b);while(log.children.length>40)log.removeChild(log.firstChild);
    log.scrollTop=log.scrollHeight;return b;
  }
  function setQuick(arr){
    quick.textContent='';(arr||[]).forEach(function(q){var b=document.createElement('button');b.type='button';b.textContent=q;b.addEventListener('click',function(){send(q)});quick.appendChild(b)});
  }
  function say(msgs,qs,done){
    msgs=[].concat(msgs);busy=true;form.classList.add('wait');var i=0;
    (function next(){
      if(i>=msgs.length){busy=false;form.classList.remove('wait');stEl.textContent='en línea';setQuick(qs);if(done)done();return}
      var m=msgs[i++];stEl.textContent='escribiendo…';
      var ty=document.createElement('div');ty.className='bm b typing';ty.setAttribute('aria-hidden','true');ty.innerHTML='<i></i><i></i><i></i>';log.appendChild(ty);log.scrollTop=log.scrollHeight;
      var t0=performance.now(),wait=RM?150:Math.min(1300,450+m.length*9);
      setTimeout(function(){ty.remove();bubble('b',m);answered++;
        if(stat)stat.textContent=answered+' '+(answered===1?'respuesta':'respuestas')+' · '+((performance.now()-t0)/1000).toFixed(1).replace('.',',')+' s la última';
        next()},wait);
    })();
  }
  function party(){if(window.confetti&&!RM){var r=root.getBoundingClientRect();window.confetti({particleCount:70,spread:70,startVelocity:32,origin:{x:(r.left+r.width/2)/innerWidth,y:(r.top+r.height*.6)/innerHeight},colors:['#FF6B2C','#FFC53D','#FF3E8A','#14C89A','#2F7BFF'],disableForReducedMotion:true})}}

  /* ---------- flujos ---------- */
  function parseItems(t,items){
    var w=t.split(' '),out=[];
    items.forEach(function(it){
      for(var i=0;i<w.length;i++){
        if(it.k.indexOf(w[i])<0)continue;
        if(it.n==='Pollo entero'&&w[i-1]==='medio')continue;
        var q=1,a=w[i-1],b=w[i-2];
        if(a==='de'){a=w[i-2];b=w[i-3]}
        if(a==='docena'){q=b==='media'?6:12}else if(/^\d+$/.test(a||'')){q=Math.min(+a,50)}else if(NUM[a]){q=NUM[a]}
        if(it.n==='Medio pollo'&&w[i+1]!=='pollo'&&w[i+1]!=='porcion')continue;
        out.push({n:it.n,p:it.p,q:q});break;
      }
    });return out;
  }
  var N=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  function days(){
    var out=[],d=new Date();
    while(out.length<3){d.setDate(d.getDate()+1);if(d.getDay()!==0)out.push({lab:N[d.getDay()]+' '+d.getDate(),dw:d.getDay()})}
    return out;
  }
  function flowStep(t,raw){
    var B=BIZ[mode];
    if(has(t,['cancelar','salir','olvidalo'])){state=null;return say('Listo, lo cancelé. ¿Te ayudo con otra cosa?',B.quick)}
    if(state==='order'){
      var it=parseItems(t,B.items);
      if(!it.length)return say('¿Qué te gustaría pedir? Por ejemplo: "un pollo y media docena de empanadas".',['Un pollo y papas','6 empanadas','Cancelar']);
      ctx.items=it;ctx.total=it.reduce(function(s,x){return s+x.p*x.q},0);state='addr';
      return say(['Anotado: '+it.map(function(x){return x.q+' × '+x.n}).join(', ')+'. Total: '+money(ctx.total)+'.','¿A qué dirección te lo mandamos? (o escribí "retiro" si pasás a buscarlo)'],['Retiro en el local','Cancelar']);
    }
    if(state==='addr'){
      var ret=has(t,['retiro','retirar','paso','buscar','local']);state=null;var n=1000+Math.floor(Math.random()*9000);
      return say(['Pedido #'+n+' confirmado: '+money(ctx.total)+(ret?'. Te esperamos en el local en 25 minutos.':'. Llega a "'+raw.slice(0,60)+'" en 35 a 45 minutos.'),'Te aviso por acá cuando salga. ¡Gracias por elegirnos!'],['Ver menú','Horarios'],party);
    }
    if(state==='turn'){
      var sv=null;B.services.forEach(function(s){if(!sv&&has(t,s.k))sv=s});
      if(!sv)return say('¿Qué servicio querés?',B.services.map(function(s){return s.n}).concat('Cancelar'));
      ctx.sv=sv;ctx.days=days();state='day';
      return say(sv.n+' ('+money(sv.p)+', '+sv.d+'). ¿Qué día te queda bien?',ctx.days.map(function(d){return d.lab}).concat('Cancelar'));
    }
    if(state==='day'){
      var N=['dom','lun','mar','mie','jue','vie','sab'],dd=null;
      ctx.days.forEach(function(d,i){var l=norm(d.lab);if(!dd&&(t.indexOf(l)>-1||t.indexOf(norm0(N[d.dw]))>-1||(i===0&&has(t,['manana']))))dd=d});
      if(!dd)return say('Tengo lugar estos días:',ctx.days.map(function(d){return d.lab}).concat('Cancelar'));
      ctx.day=dd;var all=['9:30','11:00','14:30','16:00','17:30'];ctx.slots=all.filter(function(s,i){return (i+dd.dw)%4!==0});state='slot';
      return say('El '+dd.lab+' tengo estos horarios:',ctx.slots.concat('Cancelar'));
    }
    if(state==='slot'){
      var m=t.match(/(\d{1,2})(?::?(\d{2}))?/),sl=null;
      if(m)ctx.slots.forEach(function(s){var p=s.split(':');if(!sl&&+p[0]===+m[1]&&(!m[2]||p[1]===m[2]))sl=s});
      if(!sl)return say('Elegí uno de estos horarios:',ctx.slots.concat('Cancelar'));
      ctx.slot=sl;state='name';return say('Perfecto, '+sl+'. ¿A nombre de quién lo agendo?',['Cancelar']);
    }
    if(state==='name'){
      var nm=raw.replace(/\s+/g,' ').trim().slice(0,40)||'vos';state=null;
      return say(['Listo, '+nm+': '+ctx.sv.n+' el '+ctx.day.lab+' a las '+ctx.slot+'.','Te mando un recordatorio el día anterior. Si necesitás cambiarlo, escribime "cambiar turno".'],['Precios','Dónde están'],party);
    }
    if(state==='track'){
      var k=t.match(/\d{3,8}/);
      if(!k)return say('Pasame el número de pedido (está en el mail de compra). Por ejemplo: 2210.',['2210','Cancelar']);
      state=null;return say(['Pedido #'+k[0]+': está en camino.','Llega mañana entre las 9 y las 13. Te aviso por acá cuando el repartidor esté cerca.'],['Ver productos','Cuotas']);
    }
  }

  /* ---------- respuesta ---------- */
  function reply(raw){
    var t=norm(raw),B=BIZ[mode];
    if(state)return flowStep(t,raw);
    if(has(t,['persona','humano','hablar con','atencion','alguien']))return say(['Te paso con una persona del equipo.','(En tu negocio, en este momento te llega un aviso para seguir vos la charla.)'],B.quick);
    if(has(t,B.flow[0])&&!(mode==='tienda'&&has(t,['stock','precio']))){
      state=B.flow[1];
      if(state==='order'){var it=parseItems(t,B.items);if(it.length)return flowStep(t,raw);return say('¡Dale! ¿Qué te gustaría pedir?',['Un pollo y papas','6 empanadas','Cancelar'])}
      if(state==='turn'){var sv=null;B.services.forEach(function(s){if(!sv&&has(t,s.k))sv=s});if(sv)return flowStep(t,raw);return say('¡Genial! ¿Qué servicio querés?',B.services.map(function(s){return s.n}).concat('Cancelar'))}
      if(state==='track'){if(/\d{3,8}/.test(t))return flowStep(t,raw);return say('Pasame el número de pedido y te digo dónde está.',['2210','Cancelar'])}
    }
    if(mode==='tienda'){
      var pr=null;B.products.forEach(function(x){if(!pr&&has(t,x.k))pr=x});
      if(pr)return say(pr.s?pr.n+': '+money(pr.p)+'. Tenemos '+pr.s+' en stock. ¿Querés que te lo reserve?':pr.n+': '+money(pr.p)+'. Ahora no hay stock; entra la semana que viene. ¿Te aviso cuando llegue?',['Cuotas','Envíos','Ver productos']);
    }
    if(mode==='turnos'){var s2=null;B.services.forEach(function(s){if(!s2&&has(t,s.k))s2=s});if(s2&&!has(t,['precio','cuanto','sale','cuesta']))return say(s2.n+': '+money(s2.p)+' ('+s2.d+'). ¿Te saco un turno?',['Sacar un turno','Precios'])}
    for(var i=0;i<B.faq.length;i++){if(has(t,B.faq[i][0])){var a=B.faq[i][1];misses=0;return say(typeof a==='function'?a():a,B.quick)}}
    /* saludos y agradecimientos: solo si el mensaje no pedia otra cosa */
    if(has(t,['hola','buenas','buen dia','buenos','hey']))return say('¡Hola! ¿En qué te ayudo?',B.quick);
    if(has(t,['gracias','genial','perfecto','joya','buenisimo']))return say('¡De nada! Cualquier cosa, escribime acá.',B.quick);
    misses++;
    if(misses>=2){misses=0;return say(['Esa no la sé todavía.','En un asistente real, acá te paso con una persona del equipo para que no quedes sin respuesta.'],B.quick)}
    return say('Mmm, no estoy seguro de entenderte. Puedo ayudarte con esto:',B.quick);
  }
  function send(text){
    text=String(text||'').trim().slice(0,200);if(!text||busy)return;
    bubble('u',text);setQuick([]);reply(text);
  }

  /* ---------- arranque y rubros ---------- */
  function start(m){
    mode=m;state=null;ctx={};misses=0;var B=BIZ[m];
    nameEl.textContent=B.name;avEl.textContent=B.av;root.setAttribute('data-mode',m);
    log.textContent='';setQuick([]);
    say(B.hi,B.quick);
  }
  [].forEach.call(root.querySelectorAll('[data-biz]'),function(b){
    b.addEventListener('click',function(){
      if(busy)return;
      [].forEach.call(root.querySelectorAll('[data-biz]'),function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
      start(b.getAttribute('data-biz'));
    });
  });
  form.addEventListener('submit',function(e){e.preventDefault();var v=inp.value;inp.value='';send(v)});
  /* arranca recien cuando se ve (no gasta animacion fuera de pantalla) */
  function go(){if(started)return;started=true;log.textContent='';start('comida')}
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){io.disconnect();setTimeout(go,RM?0:900)}},{threshold:.35});io.observe(root)}else go();
  root.classList.add('on');
})();
