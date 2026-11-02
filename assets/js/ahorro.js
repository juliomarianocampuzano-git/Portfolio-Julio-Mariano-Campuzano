/* Calculadora de horas ahorradas. Supuestos (los mismos que dice el texto de la seccion):
   el asistente resuelve el 80% de las preguntas repetidas, la automatizacion ahorra el 60% de las
   tareas manuales, 26 dias habiles y 4,33 semanas por mes. */
(function(){
  var f=document.getElementById('ah-form');if(!f)return;
  var BOT=.8,AUTO=.6,DIAS=26,SEM=4.33;
  var $=function(id){return document.getElementById(id)};
  var msg=$('ah-msg'),min=$('ah-min'),rep=$('ah-rep'),man=$('ah-man'),hr=$('ah-hr'),
      H=$('ah-h'),Dd=$('ah-d'),h1=$('ah-h1'),h2=$('ah-h2'),b1=$('ah-b1'),b2=$('ah-b2'),M=$('ah-m'),cta=$('ah-cta');
  var G=window.gsap,RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,shown={v:0},tw=null;
  var num='5493765306244';
  try{num=JSON.parse($('config').textContent).whatsapp||num}catch(e){}
  function fmt(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
  function out(r){var o=$(r.id+'-o');if(o)o.textContent=r.value+(r.getAttribute('data-unit')||'')}
  function calc(){
    [msg,min,rep,man].forEach(out);
    var a=(+msg.value)*(+min.value)*(+rep.value/100)*BOT*DIAS/60,
        b=(+man.value)*SEM*AUTO,t=a+b,max=Math.max(a,b,1);
    h1.textContent=fmt(a)+' h';h2.textContent=fmt(b)+' h';
    b1.style.transform='scaleX('+(a/max).toFixed(3)+')';b2.style.transform='scaleX('+(b/max).toFixed(3)+')';
    var d=t/8;Dd.textContent='≈ '+(d<10?d.toFixed(1).replace('.',','):fmt(d))+' jornadas de 8 horas';
    var v=Math.max(0,Math.min(+hr.value||0,1e7));
    if(v>0){M.hidden=false;M.textContent='Equivale a unos $'+fmt(t*v)+' por mes de tu tiempo.'}else{M.hidden=true}
    var txt='Hola Mariano, usé la calculadora: recibo unos '+msg.value+' mensajes por día y paso '+man.value+' h por semana en tareas manuales. Estimé '+fmt(t)+' horas por mes para recuperar. Quiero el diagnóstico gratis.';
    cta.href='https://wa.me/'+num+'?text='+encodeURIComponent(txt);
    /* el numero grande cuenta hasta el valor nuevo */
    if(tw)tw.kill();
    if(G&&!RM){tw=G.to(shown,{v:t,duration:.6,ease:'power3.out',onUpdate:function(){H.textContent=fmt(shown.v)}})}
    else{shown.v=t;H.textContent=fmt(t)}
  }
  f.addEventListener('input',calc);
  f.addEventListener('submit',function(e){e.preventDefault()});
  calc();
})();
