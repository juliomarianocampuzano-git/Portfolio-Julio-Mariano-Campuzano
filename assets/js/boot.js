/* boot: marca JS activo y los modos de movimiento antes del primer pintado (sin JS todo queda visible) */
(function(){
  var d=document.documentElement,q=location.search;
  d.classList.add('js');
  if(/[?&]nofx\b/.test(q))d.classList.add('nofx');
  window.__fx={rm:matchMedia('(prefers-reduced-motion: reduce)').matches||d.classList.contains('nofx')};
  /* el telon de entrada solo en la primera visita de la sesion */
  try{if(sessionStorage.getItem('mc-seen'))d.classList.add('seen')}catch(e){}
  /* red de seguridad: si app.js no termino (error, bloqueado, red lenta), se apagan los efectos y todo queda visible */
  setTimeout(function(){d.classList.add('ready');if(!window.__appOk)d.classList.add('nofx')},4000);
})();
