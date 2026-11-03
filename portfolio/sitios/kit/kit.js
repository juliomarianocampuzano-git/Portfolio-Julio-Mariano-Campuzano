/* kit.js · motor de animacion e interaccion de los sitios demo.
   Usa GSAP + ScrollTrigger + Flip + SplitText, Lenis y vanilla-tilt (todo local en /assets/libs).
   Mejora progresiva: sin JS el contenido se lee completo; con prefers-reduced-motion no hay animaciones. */
(function(){
'use strict';
var D=document,R=D.documentElement,W=window;
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches||/[?&]nofx\b/.test(location.search);
var FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
var G=W.gsap,ST=W.ScrollTrigger;
var $=function(s,c){return (c||D).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s))};
var K=W.KIT=W.KIT||{};
K.$=$;K.$$=$$;K.RM=RM;
K.cfg=(function(){try{return JSON.parse($('#site-cfg').textContent)}catch(e){return {}}})();
K.money=function(n,cur){cur=cur||K.cfg.cur||'$';return cur+' '+Math.round(n).toLocaleString('es-AR')};
K.esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
K.icon=function(n){return '<svg class="ico" aria-hidden="true"><use href="#i-'+n+'"/></svg>'};
K.wa=function(text){return 'https://wa.me/'+(K.cfg.wa||'5493764148342')+'?text='+encodeURIComponent(text)};
var toastT;
K.toast=function(msg){var t=$('.toast');if(!t){t=D.createElement('div');t.className='toast';t.setAttribute('role','status');D.body.appendChild(t)}
  t.innerHTML=K.icon('circle-check')+'<span>'+K.esc(msg)+'</span>';requestAnimationFrame(function(){t.classList.add('on')});clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('on')},3200)};
K.pop=function(el){if(RM||!G||!el)return;G.fromTo(el,{scale:.94,opacity:.4},{scale:1,opacity:1,duration:.5,ease:'back.out(2)'})};
K.burst=function(){if(RM||!W.confetti)return;var c=getComputedStyle(R);W.confetti({particleCount:110,spread:75,origin:{y:.7},colors:[c.getPropertyValue('--primary').trim()||'#f60',c.getPropertyValue('--accent').trim()||'#0cf','#ffffff']})};
/* pseudo-aleatorio estable (los turnos ocupados son siempre los mismos para cada dia) */
K.rnd=function(seed){var s=0;for(var i=0;i<seed.length;i++)s=(s*31+seed.charCodeAt(i))|0;return function(){s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff}};

if(!RM&&G)R.classList.add('fx');
if(FINE&&K.cfg.cursor)R.classList.add('has-cursor');

/* ---------- WhatsApp "quiero una web asi" ---------- */
$$('[data-hire]').forEach(function(a){a.href=K.wa(a.getAttribute('data-hire'));a.target='_blank';a.rel='noopener noreferrer'});

/* ---------- menu movil ---------- */
var burger=$('.burger');
if(burger){burger.addEventListener('click',function(){var o=D.body.classList.toggle('menu-open');burger.setAttribute('aria-expanded',o)});
  $$('.nav a').forEach(function(a){a.addEventListener('click',function(){D.body.classList.remove('menu-open');burger.setAttribute('aria-expanded','false')})});
  D.addEventListener('keydown',function(e){if(e.key==='Escape'&&D.body.classList.contains('menu-open')){D.body.classList.remove('menu-open');burger.setAttribute('aria-expanded','false');burger.focus()}})}

/* ---------- header: se esconde al bajar, vuelve al subir ---------- */
var hdr=$('.hdr'),lastY=0,hire=$('.hire'),mbar=$('.mbar');
function onScroll(){var y=W.scrollY;if(hdr){hdr.classList.toggle('sc',y>30);hdr.classList.toggle('up',y>lastY&&y>400&&!D.body.classList.contains('menu-open'))}
  if(hire)hire.classList.toggle('off',y<300);if(mbar)mbar.classList.toggle('off',y<300||D.body.classList.contains('menu-open'));lastY=y}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------- FAQ: un solo abierto ---------- */
$$('.faq').forEach(function(f){$$('details',f).forEach(function(d){d.addEventListener('toggle',function(){if(d.open)$$('details',f).forEach(function(o){if(o!==d)o.open=false})})})});

/* ---------- planes mensual / anual ---------- */
$$('[data-plans]').forEach(function(box){var bs=$$('.plans-toggle button',box);
  bs.forEach(function(b){b.addEventListener('click',function(){bs.forEach(function(x){x.setAttribute('aria-pressed',x===b)});var y=b.dataset.mode==='y';
    $$('[data-m]',box).forEach(function(p){var v=+(y?p.dataset.y:p.dataset.m);p.textContent=K.money(v);K.pop(p)});
    $$('[data-per]',box).forEach(function(p){p.textContent=y?p.dataset.yl:p.dataset.ml})})})});

/* ---------- tilt ---------- */
if(W.VanillaTilt&&FINE&&!RM)W.VanillaTilt.init($$('[data-tilt]'),{max:9,speed:600,glare:true,'max-glare':.18,scale:1.02});

/* ---------- cursor ---------- */
if(R.classList.contains('has-cursor')&&G){var cur=D.createElement('div');cur.className='cursor';D.body.appendChild(cur);
  var qx=G.quickTo(cur,'x',{duration:.35,ease:'power3'}),qy=G.quickTo(cur,'y',{duration:.35,ease:'power3'});
  addEventListener('pointermove',function(e){qx(e.clientX);qy(e.clientY)},{passive:true});
  D.addEventListener('pointerover',function(e){cur.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,[data-tilt],input,select,label')))})}

/* ---------- animaciones ---------- */
function motion(){
  if(RM||!G){R.classList.remove('fx');return}
  if(ST)G.registerPlugin(ST);if(W.Flip)G.registerPlugin(W.Flip);if(W.SplitText)G.registerPlugin(W.SplitText);
  var lenis=null;
  if(W.Lenis&&ST){lenis=new W.Lenis({duration:1.15,easing:function(t){return 1-Math.pow(1-t,4)},smoothWheel:true});K.lenis=lenis;
    lenis.on('scroll',ST.update);G.ticker.add(function(t){lenis.raf(t*1000)});G.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');if(id.length<2)return;var t=$(id);if(!t)return;e.preventDefault();lenis.scrollTo(t,{offset:-80})})})}

  /* titulos partidos: el hero entra al cargar, el resto al aparecer */
  var splits=$$('[data-split]');
  splits.forEach(function(el){
    var mode=el.dataset.split||'chars',inHero=!!el.closest('.hero');
    var sp=W.SplitText?new W.SplitText(el,{type:mode==='lines'?'lines,words':'words,chars',mask:mode==='lines'?'lines':'words'}):null;
    var parts=sp?(mode==='lines'?sp.lines:(mode==='words'?sp.words:sp.chars)):[el];
    var fx=el.dataset.fx||K.cfg.split||'rise';
    var from={rise:{yPercent:115,rotate:6},skew:{yPercent:100,skewY:12},scale:{scale:0,opacity:0},blur:{opacity:0,filter:'blur(14px)',y:30},flip:{rotateX:-95,opacity:0,transformOrigin:'50% 0%'},slide:{xPercent:-120,opacity:0}}[fx]||{yPercent:115};
    var tw=Object.assign({},from,{duration:mode==='chars'?1.1:1.2,ease:'expo.out',stagger:mode==='chars'?.028:.08});
    if(inHero){tw.delay=K.cfg.loader?.9:.15;G.from(parts,tw)}
    else{tw.scrollTrigger={trigger:el,start:'top 86%'};G.from(parts,tw)}
  });
  R.classList.add('split-ready');

  /* revelado de grupos */
  $$('[data-rv]').forEach(function(el){
    var kind=el.dataset.rv||'up',kids=el.dataset.kids!==undefined?el.children:[el];
    G.set(el,{opacity:1});
    var from={up:{y:80,opacity:0},scale:{scale:.82,opacity:0},left:{x:-90,opacity:0},right:{x:90,opacity:0},clip:{clipPath:'inset(100% 0% 0% 0%)'},rot:{y:90,rotate:4,opacity:0},zoom:{scale:1.25,opacity:0,filter:'blur(8px)'}}[kind];
    G.from(kids,Object.assign({},from,{duration:1.15,ease:'expo.out',stagger:.09,clearProps:'transform,filter,clipPath',scrollTrigger:{trigger:el,start:'top 85%'}}));
  });

  /* parallax */
  $$('[data-par]').forEach(function(el){G.to(el,{yPercent:-(+el.dataset.par||20),ease:'none',scrollTrigger:{trigger:el.closest('section')||el,start:'top bottom',end:'bottom top',scrub:true}})});

  /* hero que se achica / rota al bajar */
  $$('[data-out]').forEach(function(el){var k=el.dataset.out||'scale';var to=k==='scale'?{scale:.86,opacity:.35,borderRadius:'32px'}:k==='rotate'?{rotate:-4,scale:.9,opacity:.4}:{yPercent:30,opacity:0};
    G.to(el,Object.assign(to,{ease:'none',scrollTrigger:{trigger:el,start:'top top',end:'bottom top',scrub:true}}))});

  /* marquesina con inercia segun velocidad de scroll */
  $$('.marquee-track').forEach(function(tr){
    tr.innerHTML+=tr.innerHTML;var dir=tr.dataset.dir==='r'?1:-1;
    var tl=G.to(tr,{xPercent:50*dir,repeat:-1,ease:'none',duration:+tr.dataset.speed||28});if(dir>0)G.set(tr,{xPercent:-50});
    if(ST)ST.create({trigger:tr,start:'top bottom',end:'bottom top',onUpdate:function(s){var v=Math.min(Math.abs(s.getVelocity())/300,6);G.to(tl,{timeScale:1+v,duration:.2,overwrite:true});G.to(tl,{timeScale:1,duration:1.2,delay:.2})}});
    if(tr.dataset.skew!==undefined&&ST){var qs=G.quickTo(tr,'skewX',{duration:.4});ST.create({trigger:tr,onUpdate:function(s){qs(G.utils.clamp(-12,12,s.getVelocity()/-160))}})}
  });

  /* contadores */
  $$('[data-count]').forEach(function(el){var to=+el.dataset.count,o={v:0},suf=el.dataset.suf||'';
    G.to(o,{v:to,duration:2,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'},onUpdate:function(){el.textContent=Math.round(o.v).toLocaleString('es-AR')+suf}})});

  /* scroll horizontal fijado */
  $$('[data-hs]').forEach(function(sec){var tr=$('.hs-track',sec);if(!tr||innerWidth<700)return;
    G.to(tr,{x:function(){return -(tr.scrollWidth-innerWidth)},ease:'none',scrollTrigger:{trigger:sec,start:'top top',end:function(){return '+='+(tr.scrollWidth-innerWidth)},pin:true,scrub:1,invalidateOnRefresh:true}})});

  /* tarjetas apiladas */
  $$('.stack').forEach(function(st){var cs=$$('.stack-card',st);if(innerWidth<640)return;cs.forEach(function(c,i){if(i===cs.length-1)return;
    G.to(c,{scale:.9-((cs.length-i)*.012),opacity:.55,filter:'blur(2px)',ease:'none',scrollTrigger:{trigger:cs[i+1],start:'top 85%',end:'top 110px',scrub:true}})})});

  /* texto que se "llena" al leer */
  $$('[data-fill]').forEach(function(el){var sp=W.SplitText?new W.SplitText(el,{type:'words'}):null;if(!sp)return;
    G.fromTo(sp.words,{opacity:.14},{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:el,start:'top 80%',end:'bottom 45%',scrub:true}})});

  /* botones magneticos */
  if(FINE)$$('.btn,[data-mag]').forEach(function(b){var qx=G.quickTo(b,'x',{duration:.5,ease:'elastic.out(1,.4)'}),qy=G.quickTo(b,'y',{duration:.5,ease:'elastic.out(1,.4)'});
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();qx((e.clientX-r.left-r.width/2)*.28);qy((e.clientY-r.top-r.height/2)*.38)});
    b.addEventListener('pointerleave',function(){qx(0);qy(0)})});

  /* barra de progreso */
  var pg=$('.progress');if(pg&&ST)G.to(pg,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});

  /* entrada del resto del hero */
  var hs=$$('.hero [data-in]');if(hs.length)G.from(hs,{y:40,opacity:0,duration:1.1,ease:'expo.out',stagger:.1,delay:K.cfg.loader?1.2:.45,clearProps:'transform'});
  var stg=$$('.hero .stage');if(stg.length)G.from(stg,{y:90,rotate:K.cfg.stageRot||3,scale:.9,opacity:0,duration:1.5,ease:'expo.out',delay:K.cfg.loader?1:.35,clearProps:'transform'});

  addEventListener('load',function(){if(ST)ST.refresh()});
}

/* ---------- pantalla de carga ---------- */
function loader(done){var l=$('.loader');if(!l||RM||!G){if(l)l.remove();done();return}
  var n=$('b',l),o={v:0};G.to(o,{v:100,duration:.9,ease:'power2.inOut',onUpdate:function(){n.textContent=Math.round(o.v)}});
  G.to(l,{clipPath:'inset(0 0 100% 0)',duration:.9,ease:'expo.inOut',delay:.95,onComplete:function(){l.remove()}});done()}

/* los modulos se registran con KIT.use y corren antes que las animaciones (asi SplitText ve el HTML final) */
K.use=function(f){(K.mods=K.mods||[]).push(f)};
function boot(){(K.mods||[]).forEach(function(f){try{f()}catch(e){if(W.console)console.error(e)}});loader(motion)}
/* con defer, DOMContentLoaded llega despues de que corren todos los scripts (kit, modulos y sitio) */
if(D.readyState==='complete')setTimeout(boot);else D.addEventListener('DOMContentLoaded',boot);
})();
