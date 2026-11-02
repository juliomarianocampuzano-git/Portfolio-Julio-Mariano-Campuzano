/* portfolio.js · portada del portfolio
   Filtros con GSAP Flip, titular con SplitText, entradas con ScrollTrigger, confeti (canvas-confetti, ISC)
   y scroll suave (Lenis). Todo es mejora progresiva: sin JS las 67 tarjetas se ven y los enlaces funcionan. */
(()=>{'use strict';
const D=document,root=D.documentElement,en=root.lang==='en',t=(a,b)=>en?b:a;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const G=window.gsap,ST=window.ScrollTrigger,Flip=window.Flip,Split=window.SplitText;
const $=(s,c)=>(c||D).querySelector(s),$$=(s,c)=>[...(c||D).querySelectorAll(s)];
const COLORS=['#FF6B2C','#FFC53D','#FF3E8A','#14C89A','#2F7BFF','#6A3DF0'];
if(G&&ST)G.registerPlugin(ST);if(G&&Flip)G.registerPlugin(Flip);if(G&&Split)G.registerPlugin(Split);
function safe(fn){try{fn()}catch(e){console.warn('portfolio:',e)}}

/* ---------- confeti ---------- */
let lastBoom=0;
/* sin worker: la CSP (script-src 'self') bloquea los workers creados desde un blob */
if(window.confetti&&window.confetti.create)window.confetti=window.confetti.create(null,{resize:true,useWorker:false,disableForReducedMotion:true});
function boom(x,y,n){if(RM||!window.confetti)return;const now=Date.now();if(now-lastBoom<700)return;lastBoom=now;
  window.confetti({particleCount:n||70,spread:70,startVelocity:38,scalar:.9,ticks:160,origin:{x:x/innerWidth,y:y/innerHeight},colors:COLORS,disableForReducedMotion:true})}

/* ---------- onda en botones (tambien en tactil) ---------- */
D.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('.btn,.chips button,.p-card .row a');if(!b||RM)return;
  const r=b.getBoundingClientRect(),s=D.createElement('span');s.className='rip';s.style.left=(e.clientX-r.left)+'px';s.style.top=(e.clientY-r.top)+'px';
  if(getComputedStyle(b).position==='static')b.style.position='relative';b.style.overflow='hidden';
  b.appendChild(s);s.addEventListener('animationend',()=>s.remove());setTimeout(()=>s.remove(),900)},{passive:true});
D.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a.demo,.btn.primary,.p-case');if(a)boom(e.clientX,e.clientY)});

/* ---------- copiar enlace (fichas) ---------- */
const toast=$('.toast');let timer;
function announce(s){if(!toast)return;toast.textContent=s;toast.hidden=false;clearTimeout(timer);timer=setTimeout(()=>toast.hidden=true,6000)}
$$('.copy').forEach(b=>b.addEventListener('click',async()=>{const url=new URL(b.dataset.url,location.href).href;
  try{await navigator.clipboard.writeText(url);announce(t('Enlace copiado.','Link copied.'))}catch{announce(t('Copiá este enlace: ','Copy this link: ')+url)}}));

/* ---------- scroll suave ---------- */
let lenis=null;
if(window.Lenis&&G&&ST&&!RM&&FINE){lenis=new Lenis({duration:1.05,smoothWheel:true});lenis.on('scroll',ST.update);G.ticker.add(x=>lenis.raf(x*1000));G.ticker.lagSmoothing(0)}

/* ---------- catalogo: busqueda + filtros con Flip ---------- */
safe(()=>{
  const grid=$('#grid');if(!grid)return;
  const cards=$$('.p-card',grid),q=$('#search'),count=$('#count'),empty=$('#empty');
  const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  let cat='',st='';
  function apply(animate){
    const words=norm(q.value).trim().split(/\s+/).filter(Boolean);
    const state=animate&&Flip&&!RM?Flip.getState(cards):null;
    let n=0;
    cards.forEach(c=>{const ok=words.every(w=>norm(c.dataset.search).includes(w))&&(!cat||c.dataset.cat===cat)&&(!st||c.dataset.st===st);c.hidden=!ok;if(ok)n++});
    count.textContent=n+' / '+cards.length+' '+t('proyectos','projects');
    empty.hidden=n>0;
    if(state)Flip.from(state,{duration:.6,ease:'expo.out',scale:true,absolute:true,stagger:.012,
      onEnter:els=>G.fromTo(els,{opacity:0,scale:.6,rotation:-6},{opacity:1,scale:1,rotation:0,duration:.55,ease:'back.out(1.8)',stagger:.02}),
      onLeave:els=>G.to(els,{opacity:0,scale:.6,duration:.3,ease:'power2.out'})});
    if(ST)setTimeout(()=>ST.refresh(),650);
  }
  function chips(sel,set){$$(sel+' button').forEach(b=>b.addEventListener('click',()=>{
    $$(sel+' button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));set(b.dataset.v);apply(true)}))}
  chips('#cats',v=>cat=v);chips('#states',v=>st=v);
  let deb;q.addEventListener('input',()=>{clearTimeout(deb);deb=setTimeout(()=>apply(true),140)});
  $$('[data-clear]').forEach(b=>b.addEventListener('click',()=>{q.value='';cat='';st='';$$('.chips button').forEach(x=>x.setAttribute('aria-pressed',String(!x.dataset.v)));apply(true)}));
  apply(false);
  /* enlaces viejos tipo index.html#casa-amin: llevan a la tarjeta y la marcan */
  function openHash(){let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}const c=cards.find(x=>x.id===id);if(!c)return;
    if(c.hidden){q.value='';cat='';st='';apply(false)}c.scrollIntoView({block:'center'});c.classList.add('pulse-highlight');setTimeout(()=>c.classList.remove('pulse-highlight'),3000)}
  addEventListener('hashchange',openHash);openHash();
});

/* ---------- movimiento ---------- */
if(G&&ST&&!RM){
  /* titular: letras que caen rebotando */
  safe(()=>{const h=$('.p-hero h1');if(!h||!Split)return;
    const sp=new Split(h,{type:'chars,words',charsClass:'ch',aria:'auto'});
    G.from(sp.chars,{yPercent:120,rotation:()=>G.utils.random(-30,30),opacity:0,duration:1,ease:'back.out(2.2)',stagger:.025,delay:.1});
  });
  safe(()=>{if($('.p-hero'))G.from('.p-hero .role,.p-hero .lead,.p-hero .actions,.p-hero .social',{y:40,opacity:0,duration:.9,ease:'expo.out',stagger:.08,delay:.35})});
  safe(()=>{if($('.p-board'))G.from('.p-board>*',{x:120,rotation:8,opacity:0,duration:1.1,ease:'expo.out',stagger:.1,delay:.3})});
  /* figuras del fondo: flotan y se dispersan con el scroll */
  safe(()=>{$$('.shapes i').forEach((s,i)=>{
    G.from(s,{scale:0,rotation:-90,duration:.9,ease:'back.out(2)',delay:.5+i*.08});
    G.to(s,{y:(i%2?-1:1)*G.utils.random(18,34),rotation:'+='+G.utils.random(-25,25),duration:G.utils.random(2.4,3.6),ease:'sine.inOut',yoyo:true,repeat:-1});
    G.to(s,{yPercent:-(160+i*60),ease:'none',scrollTrigger:{trigger:'.p-hero',start:'top top',end:'bottom top',scrub:.6}});
  })});
  /* mosaico: piezas que se levantan en 3D */
  safe(()=>{if($('.bento'))G.from('.bento a',{y:140,rotationX:-50,transformPerspective:900,transformOrigin:'50% 100%',opacity:0,duration:1.1,ease:'expo.out',stagger:.09,
    scrollTrigger:{trigger:'.bento',start:'top 85%',once:true}})});
  /* tarjetas del catalogo: entran en tandas */
  safe(()=>{ST.batch('.p-card',{start:'top 92%',once:true,onEnter:b=>G.fromTo(b,{y:70,opacity:0,rotation:()=>G.utils.random(-4,4)},{y:0,opacity:1,rotation:0,duration:.8,ease:'expo.out',stagger:.06,overwrite:true})})});
  safe(()=>{$$('.section-heading h2,.profile-grid h2,.contact h2').forEach(h=>{if(!Split)return;const sp=new Split(h,{type:'words',wordsClass:'w',aria:'auto'});
    G.from(sp.words,{yPercent:110,rotation:8,opacity:0,duration:.9,ease:'expo.out',stagger:.06,scrollTrigger:{trigger:h,start:'top 88%',once:true}})})});
  safe(()=>{if($('.profile-grid'))G.from('.profile-grid>div,.contact-box',{y:90,rotation:3,opacity:0,duration:1,ease:'expo.out',stagger:.12,scrollTrigger:{trigger:'.profile-grid',start:'top 85%',once:true}})});
  /* inclinacion 3D al puntero */
  if(FINE)safe(()=>{$$('.bento a,.p-board .num div').forEach(c=>{const rx=G.quickTo(c,'rotationX',{duration:.5,ease:'power3.out'}),ry=G.quickTo(c,'rotationY',{duration:.5,ease:'power3.out'});G.set(c,{transformPerspective:800});
    c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();ry(((e.clientX-r.left)/r.width-.5)*12);rx(-((e.clientY-r.top)/r.height-.5)*12)});c.addEventListener('pointerleave',()=>{rx(0);ry(0)})})});
  /* fichas: titulo y bloques */
  safe(()=>{const h=$('.detail-hero h1');if(!h||!Split)return;const sp=new Split(h,{type:'chars,words',charsClass:'ch',aria:'auto'});
    G.from(sp.chars,{yPercent:110,rotation:()=>G.utils.random(-20,20),opacity:0,duration:.9,ease:'back.out(2)',stagger:.02});
    G.from('.detail-grid>*,#demo-app',{y:80,rotation:2,opacity:0,duration:1,ease:'expo.out',stagger:.12,scrollTrigger:{trigger:'.detail-grid',start:'top 90%',once:true}})});
  if(D.fonts&&D.fonts.ready)D.fonts.ready.then(()=>ST.refresh());
  addEventListener('load',()=>ST.refresh());
}
/* sin animaciones: lo que dependia de .rv queda visible */
root.classList.add('ready');
})();
