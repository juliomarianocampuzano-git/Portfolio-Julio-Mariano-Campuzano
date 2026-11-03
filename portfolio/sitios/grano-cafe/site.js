/* site.js · comportamiento comun del formulario de contacto de la demo */
(function(){var f=document.querySelector('[data-demo-form]');if(!f)return;f.addEventListener('submit',function(e){e.preventDefault();var err=f.querySelector('[data-err]'),bad=[].slice.call(f.querySelectorAll('[required]')).filter(function(i){return !i.value.trim()});
if(bad.length){err.textContent='Completá: '+bad.map(function(i){return f.querySelector('label[for="'+i.id+'"]').textContent}).join(', ')+'.';bad[0].focus();return}
err.textContent='';f.reset();window.KIT&&KIT.toast('Consulta enviada: te respondemos en el día (demo).');window.KIT&&KIT.burst()})})();
