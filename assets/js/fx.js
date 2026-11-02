/* fx.js · Mariano Campuzano v3 · capa de movimiento agresivo
   GSAP + ScrollTrigger (+ Lenis desde app.js). Reglas que se mantienen (DESIGN.md):
   solo transform / opacity / clip-path, ease-out, nada en hover tactil,
   y con reduced-motion o ?nofx esta capa no corre. */
(function(){
'use strict';
var D=document,root=D.documentElement,FX=window.__fx||{rm:false};
var G=window.gsap,ST=window.ScrollTrigger;
if(FX.rm||!G||!ST)return;
G.registerPlugin(ST);
var FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
var $=function(s,c){return (c||D).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s))};
function safe(fn){try{fn()}catch(e){if(window.console)console.warn('fx:',e)}}

/* ---------- hero: al salir, las dos lineas se abren ---------- */
safe(function(){
  var lns=$$('.hero h1 .ln');if(lns.length<2)return; /* el chat no se inclina: se usa mientras se scrollea */
  var tl=G.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.5}});
  tl.to(lns[0],{xPercent:-28,ease:'none'},0).to(lns[1],{xPercent:28,ease:'none'},0);
});

/* ---------- velocidad de scroll -> inclinacion (titulos, banda, capturas) ---------- */
safe(function(){
  if(!FINE)return; /* en tactil el scroll nativo con inercia ya mueve suficiente */
  var band=$$('.band-row'),heads=$$('.sechead .h2,.faq-l .h2,.contact h2'),shots=$$('.shots figure');
  var sb=band.map(function(el){return G.quickTo(el,'skewX',{duration:.45,ease:'power3.out'})});
  var sh=heads.concat(shots).map(function(el){return G.quickTo(el,'skewY',{duration:.6,ease:'power3.out'})});
  var idle=null;
  function set(v){sb.forEach(function(f){f(v*1.6)});sh.forEach(function(f){f(v*.45)})}
  ST.create({onUpdate:function(s){
    set(G.utils.clamp(-9,9,s.getVelocity()/-300));
    if(idle)idle.kill();idle=G.delayedCall(.12,function(){set(0)});
  }});
});

/* ---------- proceso: cada escalon entra recortado y se expande a ancho completo ---------- */
safe(function(){
  $$('.stage-p').forEach(function(s){
    G.fromTo(s,{clipPath:'inset(0% 8% 0% 8% round 48px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',
      scrollTrigger:{trigger:s,start:'top 100%',end:'top 30%',scrub:.4}});
  });
});

/* ---------- capturas del caso: zoom de camara con el scroll ---------- */
safe(function(){
  var ba=$('#ba');if(!ba)return;
  G.fromTo($$('img',ba),{scale:1.18},{scale:1,ease:'none',scrollTrigger:{trigger:ba,start:'top bottom',end:'center center',scrub:.5}});
});

/* ---------- palabra final: las letras suben una por una con el scroll ---------- */
safe(function(){
  var cs=$$('#word .ch');if(!cs.length)return;
  G.fromTo(cs,{yPercent:110,rotation:12},{yPercent:0,rotation:0,ease:'none',stagger:.05,transformOrigin:'0 100%',
    scrollTrigger:{trigger:'#word',start:'top bottom',end:'bottom 72%',scrub:.6}});
});

/* ---------- sobre mi: el monograma gira en 3D al entrar ---------- */
safe(function(){
  var m=$('.mono svg');if(!m)return;
  G.fromTo(m,{rotationY:-70,scale:.7,transformPerspective:800},{rotationY:0,scale:1,ease:'none',
    scrollTrigger:{trigger:'.mono',start:'top 95%',end:'center 50%',scrub:.6}});
});

/* ---------- botones: onda desde el punto de contacto (tambien en tactil) ---------- */
safe(function(){
  D.addEventListener('pointerdown',function(e){
    var b=e.target.closest&&e.target.closest('.btn,.fab');if(!b)return;
    var r=b.getBoundingClientRect(),s=D.createElement('span');
    s.className='rip';s.style.left=(e.clientX-r.left)+'px';s.style.top=(e.clientY-r.top)+'px';
    b.appendChild(s);s.addEventListener('animationend',function(){s.remove()});
    setTimeout(function(){if(s.parentNode)s.remove()},900);
  },{passive:true});
});

/* ---------- nav: texto que se "decodifica" al pasar el puntero ---------- */
safe(function(){
  if(!FINE)return;
  var CH='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*';
  $$('.nav a.l,.frow nav a').forEach(function(a){
    var txt=a.textContent,run=0;
    a.setAttribute('aria-label',txt);
    a.addEventListener('pointerenter',function(){
      var f=0,id=++run;
      (function step(){
        if(id!==run)return;
        var out='';for(var i=0;i<txt.length;i++){out+=i<f/2||txt[i]===' '?txt[i]:CH[(Math.random()*CH.length)|0]}
        a.textContent=out;f++;
        if(f/2<txt.length)requestAnimationFrame(step);else a.textContent=txt;
      })();
    });
    a.addEventListener('pointerleave',function(){run++;a.textContent=txt});
  });
});

/* ---------- tarjetas: inclinacion 3D que sigue al puntero ---------- */
safe(function(){
  if(!FINE)return;
  $$('.pcols>div,.vals>div,.facts2 div,.sp li').forEach(function(c){
    var rx=G.quickTo(c,'rotationX',{duration:.5,ease:'power3.out'}),ry=G.quickTo(c,'rotationY',{duration:.5,ease:'power3.out'});
    G.set(c,{transformPerspective:700});
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();ry(((e.clientX-r.left)/r.width-.5)*10);rx(-((e.clientY-r.top)/r.height-.5)*10)});
    c.addEventListener('pointerleave',function(){rx(0);ry(0)});
  });
});

/* ---------- confeti: al pedir el diagnostico, al ver el rango y al abrir el portfolio ---------- */
safe(function(){
  if(!window.confetti)return;
  /* sin worker: la CSP (script-src 'self') bloquea los workers creados desde un blob */
  if(window.confetti.create&&!window.confetti.__csp){window.confetti=window.confetti.create(null,{resize:true,useWorker:false,disableForReducedMotion:true});window.confetti.__csp=1}
  var COLS=['#FF6B2C','#FFC53D','#FF3E8A','#14C89A','#2F7BFF','#6A3DF0'],last=0;
  function boom(x,y,n){var t=Date.now();if(t-last<900)return;last=t;
    window.confetti({particleCount:n||80,spread:75,startVelocity:40,scalar:.95,ticks:170,origin:{x:x/innerWidth,y:y/innerHeight},colors:COLS,disableForReducedMotion:true})}
  D.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-wa],button[type=submit],.pf-cta .btn,.pf-card,.hero .cta .btn');if(b&&b.closest('#bot'))b=null;
    if(b)boom(e.clientX,e.clientY);
  });
  var res=$('#result');
  if(res&&'MutationObserver' in window)new MutationObserver(function(){
    if(!$('#q-lo',res))return;var r=res.getBoundingClientRect();boom(r.left+r.width/2,r.top+r.height/3,60);
  }).observe(res,{childList:true});
});

/* las posiciones dependen de fuentes e imagenes: recalcular cuando cargan */
addEventListener('load',function(){ST.refresh()});
})();
