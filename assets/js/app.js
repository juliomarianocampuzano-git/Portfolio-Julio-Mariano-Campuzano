/* app.js · Mariano Campuzano v2
   Reglas de origen anotadas en DESIGN.md. Todo lo "vivo" es mejora progresiva:
   sin JS el contenido esta completo y la pagina se lee entera. */
(function(){
'use strict';
var D=document,root=D.documentElement,FX=window.__fx||{rm:false};
var RM=FX.rm,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
var $=function(s,c){return (c||D).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s))};
var G=window.gsap,ST=window.ScrollTrigger;
var CFG={};try{CFG=JSON.parse($('#config').textContent)}catch(e){}
var DEF={web1:300,web2:600,web3:1200,tienda:600,bot:250,app:1200,extraBot:250,extraCatalogo:150,extraAnim:600,mBot:40,mApp:80,mWeb:25,rangeFactor:1.6};
var PH=/^\d{8,15}$/.test(CFG.whatsapp)?CFG.whatsapp:'5493765306244',P=CFG.prices||{};
Object.keys(DEF).forEach(function(k){if(!(+P[k]>0))P[k]=DEF[k]});
/* abre WhatsApp dentro del gesto del usuario (Safari bloquea ventanas abiertas despues de un setTimeout) */
function openWA(t){var a=D.createElement('a');a.href=wa(t);a.target='_blank';a.rel='noopener noreferrer';D.body.appendChild(a);a.click();a.remove()}
/* evita abrir varias pestanas con clics repetidos */
function gate(ms){var t=0;return function(){var n=Date.now();if(n-t<ms)return false;t=n;return true}}
function wa(t){return 'https://wa.me/'+PH+(t?'?text='+encodeURIComponent(t):'')}

/* ---------- enlaces de WhatsApp ---------- */
$$('[data-wa]').forEach(function(a){a.href=wa(a.getAttribute('data-text')||'Hola Mariano, vi tu sitio y quiero consultar por un proyecto.');a.target='_blank';a.rel='noopener noreferrer'});

/* ---------- smooth scroll (solo puntero fino y sin reduced motion) ---------- */
var lenis=null;
if(window.Lenis&&G&&ST&&!RM&&FINE){
  lenis=new Lenis({duration:1.05,easing:function(t){return 1-Math.pow(1-t,4)},smoothWheel:true});
  lenis.on('scroll',ST.update);G.ticker.add(function(t){lenis.raf(t*1000)});G.ticker.lagSmoothing(0);
}
if(G&&ST)G.registerPlugin(ST);
$$('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){
  var id=a.getAttribute('href');if(id.length<2)return;var t=$(id);if(!t)return;
  e.preventDefault();closeMenu();
  if(lenis)lenis.scrollTo(t,{offset:-64,duration:1.4});else t.scrollIntoView({behavior:RM?'auto':'smooth'});
  history.replaceState(null,'',id);
})});

/* ---------- menu movil ---------- */
var burger=$('.burger'),menu=$('#menu');
var behind=[$('#main'),$('.foot'),$('.fab')];
function inert(on){behind.forEach(function(el){if(el){if(on)el.setAttribute('inert','');else el.removeAttribute('inert')}})}
function closeMenu(focusBurger){if(!menu||!menu.classList.contains('open'))return;menu.classList.remove('open');menu.hidden=true;burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Abrir menú');if(lenis)lenis.start();root.style.overflow='';inert(false);if(focusBurger===true)burger.focus()}
if(burger)burger.addEventListener('click',function(){
  var o=!menu.classList.contains('open');
  if(!o){closeMenu();return}
  menu.hidden=false;menu.classList.add('open');burger.setAttribute('aria-expanded','true');burger.setAttribute('aria-label','Cerrar menú');if(lenis)lenis.stop();root.style.overflow='hidden';inert(true);
  var first=$('a',menu);if(first)first.focus({preventScroll:true});
});
D.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu(true)});
matchMedia('(min-width:1081px)').addEventListener('change',function(m){if(m.matches)closeMenu()});

/* ---------- header, progreso, nav activa, fab ---------- */
var hdr=$('.hdr'),prog=$('.prog'),fab=$('.fab'),contact=$('#contacto');
var docH=0;function measureDoc(){docH=root.scrollHeight-innerHeight}measureDoc();
addEventListener('resize',measureDoc,{passive:true});if('ResizeObserver' in window)new ResizeObserver(measureDoc).observe(D.body);
function onScroll(){
  var y=window.scrollY,h=docH;
  hdr.classList.toggle('sc',y>24);
  prog.style.transform='scaleX('+(h>0?y/h:0)+')';
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
if('IntersectionObserver' in window){
  var links=$$('.nav a.l');
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id='#'+e.target.id;links.forEach(function(l){l.setAttribute('aria-current',l.getAttribute('href')===id?'true':'false')})}})},{rootMargin:'-45% 0px -50% 0px'});
  ['servicios','diagnostico','trabajos','portfolio','precios','faq'].forEach(function(id){var s=D.getElementById(id);if(s)so.observe(s)});
  if(contact&&fab)new IntersectionObserver(function(e){fab.classList.toggle('hide',e[0].isIntersecting)},{threshold:.25}).observe(contact);
}

/* ---------- reloj y año ---------- */
(function(){
  var c=$('#clock');if(c){var f,o={hour:'2-digit',minute:'2-digit',hour12:false,timeZone:CFG.tz||'America/Argentina/Cordoba'};try{f=new Intl.DateTimeFormat('es-AR',o)}catch(e){o.timeZone='America/Argentina/Cordoba';f=new Intl.DateTimeFormat('es-AR',o)}var u=function(){c.textContent=f.format(new Date())};u();setInterval(u,20000)}
  var y=$('#yr');if(y)y.textContent=new Date().getFullYear();
})();

/* ---------- texto: separar en letras / palabras ---------- */
function srText(el,t){var s=D.createElement('span');s.className='sr';s.textContent=t;el.appendChild(s)}
function dotted(s,w){if(/\.$/.test(w)){s.textContent=w.slice(0,-1);var d=D.createElement('span');d.className='dot';d.textContent='.';s.appendChild(d)}else s.textContent=w}
function words(el){
  var full=el.textContent.trim(),txt=full.split(/\s+/),i=0;el.textContent='';srText(el,full);
  txt.forEach(function(w,k){var o=D.createElement('span');o.className='w';o.setAttribute('aria-hidden','true');var s=D.createElement('span');dotted(s,w);o.appendChild(s);o.style.setProperty('--i',i++);el.appendChild(o);if(k<txt.length-1)el.appendChild(D.createTextNode(' '))});
}
function chars(el,start){
  var out=[],i=start||0;
  var targets=$$('.ln',el);if(!targets.length)targets=[el];
  if(targets[0]!==el)srText(el,targets.map(function(t){return t.textContent.trim()}).join(' '));
  targets.forEach(function(t){
    var parts=t.textContent.split(' ');t.setAttribute('aria-hidden','true');t.textContent='';
    parts.forEach(function(w,k){var wd=D.createElement('span');wd.className='wd';
      w.split('').forEach(function(c){var s=D.createElement('span');s.className='ch'+(c==='.'?' dot':'');s.textContent=c;s.style.setProperty('--i',i++);wd.appendChild(s);out.push(s)});
      t.appendChild(wd);if(k<parts.length-1)t.appendChild(D.createTextNode(' '))});
  });
  return out;
}
$$('[data-fx="rise"],[data-fx="weight"]').forEach(words);

/* ---------- tipografia cinetica: el peso responde al puntero y a una ola idle ---------- */
function kinetic(el,chs,o){
  var base=o.base,peak=o.peak,sig=o.sigma||150,cur=chs.map(function(){return base}),cx=[],cy=[],px=-9999,py=-9999,run=false,virt=null,vis=false,stamp=0;
  function measure(){cx=[];cy=[];chs.forEach(function(c){var b=c.getBoundingClientRect();cx.push(b.left+b.width/2);cy.push(b.top+b.height/2)})}
  function step(now){
    var x=virt?virt.x:px,y=virt?virt.y:py,moving=false;
    for(var i=0;i<chs.length;i++){
      var dx=cx[i]-x,dy=cy[i]-y,tg=base+(peak-base)*Math.exp(-(dx*dx+dy*dy)/(2*sig*sig));
      var n=cur[i]+(tg-cur[i])*.16;if(Math.abs(n-cur[i])>.4){moving=true}cur[i]=n;
      chs[i].style.setProperty('--w',n.toFixed(0));
      if(o.color)chs[i].style.setProperty('--k',Math.max(0,(n-base)/(peak-base)).toFixed(2));
    }
    if(moving||virt){requestAnimationFrame(step)}else run=false;
  }
  function kick(){if(!run){run=true;measure();requestAnimationFrame(step)}}
  var host=o.host||el;
  if(FINE){host.addEventListener('pointermove',function(e){px=e.clientX;py=e.clientY;if(!run||performance.now()-stamp>600){measure();stamp=performance.now()}kick()},{passive:true});
    host.addEventListener('pointerleave',function(){px=py=-9999;kick()},{passive:true})}
  new IntersectionObserver(function(e){vis=e[0].isIntersecting},{threshold:.1}).observe(el);
  return {sweep:function(ms){
    if(RM||!vis||virt)return;measure();var r=el.getBoundingClientRect(),t0=performance.now();
    virt={x:r.left-80,y:r.top+r.height/2};kick();
    (function mv(n){var k=Math.min(1,(n-t0)/ms);virt.x=r.left-80+(r.width+160)*(1-Math.pow(1-k,2));if(k<1)requestAnimationFrame(mv);else{virt=null;kick()}})(t0);
  }};
}

/* ---------- entradas con variantes (no el mismo fade en todo) ---------- */
var revEls=$$('.rv,.rv-l,.rv-c,.rv-3d,[data-fx]');
var groups=new Map();
revEls.forEach(function(el){var par=el.parentElement;if(!groups.has(par))groups.set(par,[]);groups.get(par).push(el)});
groups.forEach(function(arr){if(arr.length>1)arr.forEach(function(el,i){if(!el.dataset.d)el.style.setProperty('--d',(Math.min(i,6)*70)+'ms')})});
$$('[data-d]').forEach(function(el){el.style.setProperty('--d',(parseInt(el.dataset.d,10)*90)+'ms')});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting||e.boundingClientRect.top<0){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'100000px 0px -4% 0px',threshold:0}); /* margen superior enorme: lo que quedo arriba (saltos con el menu) tambien se revela */
/* los elementos con clip-path no se pueden observar con IntersectionObserver (el recorte los vuelve invisibles): se revisan por scroll */
var clipEls=[];
revEls.forEach(function(el){if(el.classList.contains('rv-c')||el.getAttribute('data-fx')==='wipe')clipEls.push(el);else io.observe(el)});
function checkClip(){var vh=innerHeight;clipEls=clipEls.filter(function(el){var r=el.getBoundingClientRect();if(r.top<vh*.92){el.classList.add('in');return false}return true});if(!clipEls.length){removeEventListener('scroll',checkClip);removeEventListener('resize',checkClip)}}
addEventListener('scroll',checkClip,{passive:true});addEventListener('resize',checkClip);checkClip();

/* ---------- hero: letras + ola + interfaz viva ---------- */
var h1=$('.hero h1'),kin=null;
if(h1){var hc=chars(h1,0);kin=kinetic(h1,hc,{base:600,peak:800,sigma:140,host:$('.hero')})}
requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.add('ready');try{sessionStorage.setItem('mc-seen','1')}catch(e){}if(kin&&!RM){setTimeout(function(){kin.sweep(1500)},1500);setInterval(function(){kin.sweep(1500)},9000)}})});

/* topo (WebGL con fallback 2D) */
if(window.Topo){
  var th=$('#topo-hero');if(th)window.Topo(th,{host:th.parentElement});
  var tc=$('#topo-contact');
  if(tc)new IntersectionObserver(function(e,ob){if(e[0].isIntersecting){window.Topo(tc,{host:tc.parentElement});ob.disconnect()}},{rootMargin:'400px'}).observe(tc);
}

/* stage: boceto -> diseño -> codigo -> en linea, con el chat */
(function(){
  var st=$('#stage');if(!st||!G)return;
  var fls=$$('.fl',st),scan=$('.scan',st),live=$('.live',st),bubs=$$('.bub',st),typ=$('.typing',st),steps=$$('#steps-b li');
  function setStep(i){steps.forEach(function(s,k){s.classList.toggle('on',k===i)})}
  if(RM){setStep(3);return}
  var tl=G.timeline({repeat:-1,repeatDelay:2.2,paused:true,defaults:{ease:'power3.out'}});
  tl.set(fls,{scaleX:0,opacity:.4}).set(bubs,{autoAlpha:0,y:10}).set(typ,{display:'none'}).set(live,{autoAlpha:0,scale:.9}).set(scan,{autoAlpha:0,top:0})
    .add(function(){setStep(0)},0)
    .to(fls,{scaleX:1,duration:.7,stagger:.04},.2)
    .add(function(){setStep(1)},1.5)
    .to(fls,{opacity:1,duration:.6,stagger:.03,ease:'power2.out'},1.5)
    .add(function(){setStep(2)},2.7)
    .to(scan,{autoAlpha:1,duration:.15},2.7).to(scan,{top:'100%',duration:1.3,ease:'power1.inOut'},2.7).to(scan,{autoAlpha:0,duration:.2},4)
    .add(function(){setStep(3)},4.1)
    .to(live,{autoAlpha:1,scale:1,duration:.5,ease:'back.out(2)'},4.1)
    .to(bubs[0],{autoAlpha:1,y:0,duration:.45},4.5)
    .to(bubs[1],{autoAlpha:1,y:0,duration:.45},5.4)
    .to(bubs[2],{autoAlpha:1,y:0,duration:.45},6.3)
    .set(typ,{display:'flex'},6.9).set(typ,{display:'none'},7.6)
    .to(bubs[3],{autoAlpha:1,y:0,duration:.45},7.6);
  new IntersectionObserver(function(e){e[0].isIntersecting?tl.play():tl.pause()},{threshold:.15}).observe(st);
  /* tilt 3D + capas con distinta profundidad (Emil: 3D para profundidad, solo transform) */
  if(FINE){
    var inn=$('.st-in',st),br=$('.browser',st),ph=$('.phone',st);
    var rx=G.quickTo(inn,'rotationX',{duration:.8,ease:'power3.out'}),ry=G.quickTo(inn,'rotationY',{duration:.8,ease:'power3.out'});
    var bx=G.quickTo(br,'x',{duration:.9,ease:'power3.out'}),px=G.quickTo(ph,'x',{duration:.9,ease:'power3.out'}),py=G.quickTo(ph,'y',{duration:.9,ease:'power3.out'});
    var hero=$('.hero');
    hero.addEventListener('pointermove',function(e){var b=st.getBoundingClientRect(),nx=(e.clientX-(b.left+b.width/2))/innerWidth,ny=(e.clientY-(b.top+b.height/2))/innerHeight;ry(nx*14);rx(-ny*10);bx(-nx*22);px(nx*34);py(ny*20)},{passive:true});
    hero.addEventListener('pointerleave',function(){ry(0);rx(0);bx(0);px(0);py(0)});
  }
})();

/* ---------- banda cinetica: se mueve solo con el scroll ---------- */
if(G&&ST&&!RM){
  $$('[data-band]').forEach(function(r){var d=parseInt(r.dataset.band,10);
    G.fromTo(r,{xPercent:d<0?6:-48},{xPercent:d<0?-48:6,ease:'none',scrollTrigger:{trigger:r.parentElement,start:'top bottom',end:'bottom top',scrub:.7}})});
}

/* ---------- capitulos: viñeta fijada (solo >900px) ---------- */
(function(){
  var pin=$('#pin'),chs=$$('.chap');if(!pin||!chs.length)return;
  var mq=matchMedia('(min-width:901px)'),vs=[];
  chs.forEach(function(c,i){var v=D.createElement('div');v.className='v'+(i===0?' on':'');var cl=$('.vig',c).cloneNode(true);v.appendChild(cl);pin.appendChild(v);vs.push(v)});
  function set(){root.classList.toggle('pinned',mq.matches)}
  set();mq.addEventListener('change',set);
  var cur=0;
  var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var i=chs.indexOf(e.target);if(i===cur)return;cur=i;chs.forEach(function(c,k){c.classList.toggle('act',k===i);vs[k].classList.toggle('on',k===i)})}})},{rootMargin:'-45% 0px -45% 0px'});
  chs.forEach(function(c){o.observe(c)});
})();

/* ---------- rubros: tabs accesibles con revelado por clip-path ---------- */
(function(){
  var tabs=$$('.tab'),panels=$$('.panel');if(!tabs.length)return;
  function sel(i,focus){
    tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i);t.tabIndex=k===i?0:-1});
    panels.forEach(function(p,k){var show=k===i;if(show&&p.hidden){p.hidden=false;if(!RM&&p.animate){p.animate([{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:420,easing:'cubic-bezier(.32,.72,0,1)'});$$('.pcols>div',p).forEach(function(c,n){c.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:480,delay:120+n*60,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'})})}}else if(!show)p.hidden=true});
    if(focus)tabs[i].focus();
  }
  panels.forEach(function(p,k){if(k)p.hidden=true});
  tabs.forEach(function(t,i){t.addEventListener('click',function(){sel(i)});t.addEventListener('keydown',function(e){
    var n=i;if(e.key==='ArrowDown'||e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;
    e.preventDefault();sel(n,true)})});
})();

/* ---------- antes / despues con resorte (interrumpible) ---------- */
(function(){
  var ba=$('#ba');if(!ba)return;var inp=$('input',ba),cur=50,tg=50,raf=0;
  function loop(){var d=tg-cur;if(Math.abs(d)<.05){cur=tg;ba.style.setProperty('--pos',cur+'%');raf=0;return}cur+=d*.2;ba.style.setProperty('--pos',cur.toFixed(2)+'%');raf=requestAnimationFrame(loop)}
  function go(v){tg=v;if(RM){cur=v;ba.style.setProperty('--pos',v+'%');return}if(!raf)raf=requestAnimationFrame(loop)}
  inp.addEventListener('input',function(){go(+inp.value)});
  ba.addEventListener('pointerdown',function(){ba.classList.add('drag')});
  ['pointerup','pointercancel'].forEach(function(ev){addEventListener(ev,function(){ba.classList.remove('drag')})});
  /* invitacion: un barrido corto la primera vez que entra a pantalla */
  if(!RM)new IntersectionObserver(function(e,ob){if(e[0].isIntersecting){ob.disconnect();setTimeout(function(){go(18);setTimeout(function(){go(82);setTimeout(function(){go(50);inp.value=50},650)},650)},500)}},{threshold:.6}).observe(ba);
})();

/* ---------- parallax + trazo del monograma (scroll scrub) ---------- */
if(G&&ST&&!RM){
  $$('.shots img').forEach(function(im){G.set(im,{scale:1.16});G.fromTo(im,{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:im.parentElement,start:'top bottom',end:'bottom top',scrub:.6}})});
  var pth=$('.mono .pth');
  if(pth)G.fromTo(pth,{strokeDashoffset:1},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.mono',start:'top 85%',end:'center 45%',scrub:.5}});
  $$('.sp-in h3').forEach(function(h){G.fromTo(h,{y:30},{y:-30,ease:'none',scrollTrigger:{trigger:h.closest('.stage-p'),start:'top bottom',end:'bottom top',scrub:.5}})});
}

/* ---------- palabra final cinetica ---------- */
(function(){
  var w=$('#word');if(!w)return;var cs=chars(w,0);kinetic(w,cs,{base:500,peak:800,sigma:170,color:true,host:w.parentElement});
})();

/* ---------- cotizador: rango + diagnostico ---------- */
(function(){
  var f=$('#rango');if(!f)return;
  var res=$('#result'),txt=$('#rango-text'),cta=$('#rango-cta'),state={rubro:'',need:'',x:[]},busy=0,shown={lo:0,hi:0};
  var LAB={web1:'Una web de una página',web2:'Un sitio de varias secciones',tienda:'Una tienda o catálogo',bot:'Un asistente de WhatsApp',app:'Automatizar procesos o un panel',nose:'Todavía no sé'};
  var XL={extraBot:'Asistente de WhatsApp',extraCatalogo:'Catálogo con carrito',extraAnim:'Animaciones a medida',mant:'Mantenimiento mensual'};
  function fmt(n){return n.toLocaleString('es-AR')}
  function calc(){
    var n=state.need;if(!n||n==='nose')return null;
    var base=P[n]||0,mo=0,x=state.x;
    if(n==='bot')mo+=P.mBot||0;if(n==='app')mo+=P.mApp||0;
    x.forEach(function(k){if(k==='mant'){if(n!=='bot'&&n!=='app')mo+=P.mWeb||0}else{base+=P[k]||0;if(k==='extraBot')mo+=P.mBot||0}});
    var hi=Math.ceil(base*(P.rangeFactor||1.6)/50)*50;
    return {lo:base,hi:hi,mo:mo,optMo:(n!=='bot'&&n!=='app'&&x.indexOf('mant')<0)}
  }
  function rules(){
    var n=state.need;
    $$('input[name="x"]',f).forEach(function(i){var off=false;
      if(i.value==='extraBot'&&n==='bot')off=true;
      if(i.value==='extraCatalogo'&&(n==='tienda'||n==='bot'||n==='app'))off=true;
      if(i.value==='extraAnim'&&(n==='bot'||n==='app'))off=true;
      if(i.value==='mant'&&(n==='bot'||n==='app'))off=true;
      i.disabled=off;if(off&&i.checked){i.checked=false;state.x=state.x.filter(function(v){return v!==i.value})}});
  }
  var tws=[];function tween(a,b,cb){if(RM||!G){cb(b);return}var o={v:a};tws.push(G.to(o,{v:b,duration:.6,ease:'power3.out',onUpdate:function(){cb(Math.round(o.v))}}))}
  function render(){
    var r=calc();res.setAttribute('aria-busy','false');
    var parts=['Hola Mariano, quiero el diagnóstico gratis.'];
    if(state.rubro)parts.push('Rubro: '+state.rubro);
    if(state.need)parts.push('Necesito: '+LAB[state.need]);
    if(state.x.length)parts.push('Sumaría: '+state.x.map(function(k){return XL[k]}).join(', '));
    if(!state.need){res.innerHTML='<p class="empty">Elegí qué necesitás y te muestro un rango de referencia.</p>';cta.textContent='Pedir diagnóstico por WhatsApp';txt.value=parts.join('\n');return}
    if(!r){res.innerHTML='<p class="rl">Rango orientativo</p><p class="big">A definir</p><p class="nt">Sin saber qué necesitás, cualquier número sería inventado. En el diagnóstico lo ordenamos juntos y recién ahí te paso un rango.</p>';cta.textContent='Pedir diagnóstico por WhatsApp';txt.value=parts.join('\n');return}
    res.innerHTML='<p class="rl">Rango orientativo</p><p class="big"><small>USD</small><span id="q-lo">'+fmt(shown.lo)+'</span> – <span id="q-hi">'+fmt(shown.hi)+'</span></p>'+
      '<p class="mo">'+(r.mo?'Abono mensual: USD '+fmt(r.mo):'Mantenimiento opcional: desde USD '+fmt(P.mWeb||25)+' por mes')+'</p>'+
      '<p class="nt">El máximo depende de la cantidad de secciones, textos y fotos. Hosting, dominio y WhatsApp Business se cuentan aparte. El precio cerrado sale del diagnóstico.</p>';
    tws.forEach(function(t){t.kill()});tws=[];
    var big=$('.big',res);if(big&&G&&!RM)G.fromTo(big,{scale:1.14,y:-8},{scale:1,y:0,duration:.7,ease:'expo.out',transformOrigin:'0 100%'});
    var lo=$('#q-lo'),hi=$('#q-hi');tween(shown.lo,r.lo,function(v){lo.textContent=fmt(v)});tween(shown.hi,r.hi,function(v){hi.textContent=fmt(v)});
    shown={lo:r.lo,hi:r.hi};
    parts.push('Rango que vi: USD '+fmt(r.lo)+' a '+fmt(r.hi)+' (orientativo)');
    if(r.mo)parts.push('Abono mensual: USD '+fmt(r.mo));
    txt.value=parts.join('\n');cta.textContent='Pedir diagnóstico con este resumen';
  }
  f.addEventListener('change',function(e){
    var t=e.target;
    if(t.name==='rubro')state.rubro=t.value;
    if(t.name==='need'){state.need=t.value;rules()}
    if(t.name==='x'){state.x=$$('input[name="x"]:checked',f).map(function(i){return i.value})}
    res.setAttribute('aria-busy','true');clearTimeout(busy);busy=setTimeout(render,RM?0:240);
  });
  var once=gate(1500);
  f.addEventListener('submit',function(e){e.preventDefault();clearTimeout(busy);render();if(once())openWA(txt.value)});
  render();
})();

/* ---------- formulario de contacto: validacion + 4 estados ---------- */
(function(){
  var f=$('#form');if(!f)return;
  var nom=$('#f-nombre'),tipo=$('#f-tipo'),msg=$('#f-msg'),eN=$('#e-nombre'),eM=$('#e-msg'),ok=$('#f-ok'),bad=$('#f-bad'),prev=$('#f-prev'),link=$('#f-link'),link2=$('#f-link2'),btn=$('#f-btn'),copy=$('#f-copy');
  var once=gate(1500);
  function clear(){[ok,bad].forEach(function(x){x.classList.remove('show')});[nom,msg].forEach(function(i){i.removeAttribute('aria-invalid')});eN.textContent='';eM.textContent=''}
  msg.addEventListener('input',function(){if(msg.getAttribute('aria-invalid')){msg.removeAttribute('aria-invalid');eM.textContent=''}});
  nom.addEventListener('input',function(){nom.removeAttribute('aria-invalid');eN.textContent=''});
  f.addEventListener('submit',function(e){
    e.preventDefault();clear();
    var n=nom.value.trim(),m=msg.value.trim(),bad1=null;
    if(n.length>0&&n.length<2){nom.setAttribute('aria-invalid','true');eN.textContent='Escribí al menos 2 letras o dejalo vacío.';bad1=bad1||nom}
    if(m.length<10){msg.setAttribute('aria-invalid','true');eM.textContent=m.length?'Contame un poco más (mínimo 10 caracteres).':'Escribí tu mensaje para poder enviarlo.';bad1=bad1||msg}
    if(bad1){bad1.focus();return}
    var text=(n?'Hola Mariano, soy '+n+'. ':'Hola Mariano. ')+'Necesito: '+tipo.value+'.\n\n'+m;
    link.href=wa(text);link2.href=wa(text);prev.textContent=text;
    if(navigator.onLine===false){bad.classList.add('show');bad.focus();return}
    if(!once())return;
    openWA(text);
    f.classList.add('sending');btn.textContent='Abriendo WhatsApp…';
    setTimeout(function(){f.classList.remove('sending');btn.textContent='Enviar por WhatsApp';ok.classList.add('show');ok.focus({preventScroll:false})},RM?0:450);
  });
  if(copy)copy.addEventListener('click',function(){
    var t=prev.textContent;var done=function(s){copy.textContent=s?'Copiado':'No se pudo copiar';setTimeout(function(){copy.textContent='Copiar mensaje'},1800)};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(function(){done(true)},function(){done(false)});else done(false);
  });
})();

/* ---------- cursor + imanes (solo puntero fino) ---------- */
if(FINE&&!RM){
  var cur=$('.cur');
  if(cur){
    root.classList.add('cursor-on');var ci=$('i',cur),x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
    var on=false;
    function tick(){cx+=(x-cx)*.22;cy+=(y-cy)*.22;cur.style.transform='translate('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px)';if(Math.abs(x-cx)+Math.abs(y-cy)>.2)requestAnimationFrame(tick);else on=false}
    addEventListener('pointermove',function(e){x=e.clientX;y=e.clientY;if(!on){on=true;requestAnimationFrame(tick)}},{passive:true});
    D.addEventListener('pointerover',function(e){
      var d=e.target.closest&&e.target.closest('[data-cursor]');
      if(d){ci.textContent=d.getAttribute('data-cursor');cur.classList.add('big');cur.classList.remove('link');return}
      cur.classList.remove('big');ci.textContent='';
      cur.classList.toggle('link',!!(e.target.closest&&e.target.closest('a,button,summary,label')));
    });
  }
  if(G)$$('[data-mag]').forEach(function(b){
    var qx=G.quickTo(b,'x',{duration:.6,ease:'power3.out'}),qy=G.quickTo(b,'y',{duration:.6,ease:'power3.out'});
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();qx((e.clientX-(r.left+r.width/2))*.28);qy((e.clientY-(r.top+r.height/2))*.4)});
    b.addEventListener('pointerleave',function(){qx(0);qy(0)});
  });
}
if(ST&&D.fonts&&D.fonts.ready)D.fonts.ready.then(function(){ST.refresh()});
window.__appOk=true;
/* seguridad: si algo tarda, el contenido igual aparece */
setTimeout(function(){root.classList.add('ready')},1500);
})();
