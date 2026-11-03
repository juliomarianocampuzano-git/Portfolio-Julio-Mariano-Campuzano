/* visuals.js · fondos y escenas animadas de los heroes (three.js para 3D, canvas 2D para particulas).
   Cada <canvas data-vis="nombre" data-c1="#hex" data-c2="#hex"> elige su escena.
   Con reduced-motion se dibuja un solo cuadro estatico. Se pausa cuando sale de pantalla. */
(function(){
'use strict';
var K=window.KIT,RM=K.RM,$$=K.$$;
function col(el,k,d){return el.dataset[k]||d}
function fit(cv,ctx){var r=Math.min(devicePixelRatio||1,2),w=cv.clientWidth,h=cv.clientHeight;cv.width=w*r;cv.height=h*r;if(ctx)ctx.setTransform(r,0,0,r,0,0);return {w:w,h:h}}
function loop(cv,draw){var on=true,raf;if('IntersectionObserver' in window)new IntersectionObserver(function(e){on=e[0].isIntersecting;if(on&&!RM)tick()}).observe(cv);
  function tick(){cancelAnimationFrame(raf);if(!on)return;draw(performance.now()/1000);if(!RM)raf=requestAnimationFrame(tick)}tick()}
function hex(c){c=c.replace('#','');if(c.length===3)c=c.split('').map(function(x){return x+x}).join('');var n=parseInt(c,16);return [n>>16&255,n>>8&255,n&255]}
function rgba(c,a){var x=hex(c);return 'rgba('+x[0]+','+x[1]+','+x[2]+','+a+')'}

var V={};
/* ---------- brasas que suben (parrilla, pizzeria) ---------- */
V.embers=function(cv){var ctx=cv.getContext('2d'),s=fit(cv,ctx),c1=col(cv,'c1','#FF6A00'),c2=col(cv,'c2','#FFD166'),P=[];
  function spawn(y){return {x:Math.random()*s.w,y:y===undefined?s.h+10:y,r:Math.random()*2.6+.6,vy:Math.random()*.9+.35,ph:Math.random()*6,life:1}}
  for(var i=0;i<140;i++)P.push(spawn(Math.random()*s.h));
  addEventListener('resize',function(){s=fit(cv,ctx)});
  loop(cv,function(t){ctx.clearRect(0,0,s.w,s.h);var g=ctx.createRadialGradient(s.w*.5,s.h*1.1,10,s.w*.5,s.h*1.1,s.h*.9);g.addColorStop(0,rgba(c1,.55));g.addColorStop(1,rgba(c1,0));ctx.fillStyle=g;ctx.fillRect(0,0,s.w,s.h);
    ctx.globalCompositeOperation='lighter';P.forEach(function(p,i){p.y-=p.vy;p.x+=Math.sin(t*1.5+p.ph)*.5;var a=Math.max(0,p.y/s.h);
      ctx.beginPath();ctx.fillStyle=rgba(i%3?c1:c2,a);ctx.shadowBlur=12;ctx.shadowColor=c1;ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();if(p.y<-10)P[i]=spawn()});ctx.globalCompositeOperation='source-over';ctx.shadowBlur=0})};
/* ---------- hojas y niebla (lodge en la selva) ---------- */
V.leaves=function(cv){var ctx=cv.getContext('2d'),s=fit(cv,ctx),c1=col(cv,'c1','#1F6F43'),c2=col(cv,'c2','#A3C76D'),L=[];
  for(var i=0;i<38;i++)L.push({x:Math.random(),y:Math.random(),z:Math.random()*.8+.2,r:Math.random()*6,sp:Math.random()*.3+.1});
  addEventListener('resize',function(){s=fit(cv,ctx)});
  function leaf(x,y,sz,rot,c){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,-sz);ctx.bezierCurveTo(sz*.9,-sz*.4,sz*.7,sz*.6,0,sz);ctx.bezierCurveTo(-sz*.7,sz*.6,-sz*.9,-sz*.4,0,-sz);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-sz);ctx.lineTo(0,sz);ctx.stroke();ctx.restore()}
  loop(cv,function(t){ctx.clearRect(0,0,s.w,s.h);
    for(var k=0;k<3;k++){var g=ctx.createLinearGradient(0,s.h*(.45+k*.15),0,s.h);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,255,255,'+(.05+k*.03)+')');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,s.h);for(var x=0;x<=s.w;x+=20)ctx.lineTo(x,s.h*(.6+k*.12)+Math.sin(x*.004+t*.3+k)*24);ctx.lineTo(s.w,s.h);ctx.fill()}
    L.sort(function(a,b){return a.z-b.z}).forEach(function(l){l.y+=l.sp*.0015*l.z;l.x+=Math.sin(t*.5+l.r)*.0006;if(l.y>1.1){l.y=-.1;l.x=Math.random()}
      ctx.globalAlpha=.35+l.z*.6;leaf(l.x*s.w,l.y*s.h,10+l.z*26,Math.sin(t*.7+l.r)*.9+l.r,l.z>.6?c2:c1)});ctx.globalAlpha=1})};
/* ---------- sol y rayos (energia solar) ---------- */
V.sun=function(cv){var ctx=cv.getContext('2d'),s=fit(cv,ctx),c1=col(cv,'c1','#FDB813'),c2=col(cv,'c2','#059669');
  addEventListener('resize',function(){s=fit(cv,ctx)});
  loop(cv,function(t){ctx.clearRect(0,0,s.w,s.h);var cx=s.w*.78,cy=s.h*.32,R=Math.min(s.w,s.h)*.16;
    ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.08);for(var i=0;i<28;i++){ctx.rotate(6.283/28);ctx.fillStyle=rgba(c1,i%2?.10:.18);ctx.beginPath();ctx.moveTo(R*1.1,-6);ctx.lineTo(Math.max(s.w,s.h),-40);ctx.lineTo(Math.max(s.w,s.h),40);ctx.lineTo(R*1.1,6);ctx.fill()}ctx.restore();
    var g=ctx.createRadialGradient(cx,cy,R*.2,cx,cy,R*2.2);g.addColorStop(0,rgba(c1,1));g.addColorStop(.35,rgba(c1,.55));g.addColorStop(1,rgba(c1,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R*2.2+Math.sin(t*2)*4,0,6.283);ctx.fill();
    for(var r=0;r<5;r++){var y=s.h*(.72+r*.07);ctx.strokeStyle=rgba(c2,.18+r*.06);ctx.lineWidth=2;ctx.beginPath();for(var x=0;x<=s.w;x+=16)ctx.lineTo(x,y+Math.sin(x*.01+t+r)*6);ctx.stroke()}})};
/* ---------- aurora de colores (viajes) ---------- */
V.aurora=function(cv){var ctx=cv.getContext('2d'),s=fit(cv,ctx),C=[col(cv,'c1','#0EA5E9'),col(cv,'c2','#F97316'),col(cv,'c3','#8B5CF6')];
  addEventListener('resize',function(){s=fit(cv,ctx)});
  loop(cv,function(t){ctx.clearRect(0,0,s.w,s.h);ctx.globalCompositeOperation='lighter';C.forEach(function(c,i){var x=s.w*(.3+.4*Math.sin(t*.15+i*2.1)),y=s.h*(.4+.25*Math.cos(t*.12+i*1.7)),r=Math.max(s.w,s.h)*.55;
    var g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(c,.55));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(0,0,s.w,s.h)});ctx.globalCompositeOperation='source-over'})};
/* ---------- malla de puntos que ondula (legal, contable, seguros) ---------- */
V.grid=function(cv){var ctx=cv.getContext('2d'),s=fit(cv,ctx),c1=col(cv,'c1','#2563EB'),mx=.5,my=.5;
  addEventListener('resize',function(){s=fit(cv,ctx)});addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;my=(e.clientY-r.top)/r.height},{passive:true});
  loop(cv,function(t){ctx.clearRect(0,0,s.w,s.h);var gap=28;for(var y=gap/2;y<s.h;y+=gap)for(var x=gap/2;x<s.w;x+=gap){var dx=x/s.w-mx,dy=y/s.h-my,d=Math.sqrt(dx*dx+dy*dy),w=Math.sin(d*18-t*2.2)*.5+.5;
    ctx.fillStyle=rgba(c1,.08+w*.5*(1-Math.min(d*1.4,1)));ctx.beginPath();ctx.arc(x,y,1.2+w*2.2*(1-Math.min(d*1.2,1)),0,6.283);ctx.fill()}})};
/* ---------- burbujas con saludos (idiomas) ---------- */
V.bubbles=function(cv){var ctx=cv.getContext('2d'),s=fit(cv,ctx),C=[col(cv,'c1','#4F46E5'),col(cv,'c2','#16A34A'),col(cv,'c3','#F59E0B')],W=['Hola','Hello','Ciao','Olá','Bonjour','Hallo','Hej','Salve'],B=[];
  for(var i=0;i<16;i++)B.push({x:Math.random(),y:Math.random(),r:24+Math.random()*30,v:.0006+Math.random()*.0012,w:W[i%W.length],c:C[i%3],p:Math.random()*6});
  addEventListener('resize',function(){s=fit(cv,ctx)});
  loop(cv,function(t){ctx.clearRect(0,0,s.w,s.h);B.forEach(function(b){b.y-=b.v;if(b.y<-.15){b.y=1.15;b.x=Math.random()}var x=b.x*s.w+Math.sin(t+b.p)*14,y=b.y*s.h;
    ctx.fillStyle=rgba(b.c,.14);ctx.strokeStyle=rgba(b.c,.5);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,b.r,0,6.283);ctx.fill();ctx.stroke();ctx.fillStyle=rgba(b.c,.85);ctx.font='600 '+Math.round(b.r*.42)+'px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(b.w,x,y)})})};

/* ---------- 3D: auto deportivo (three.js) ---------- */
V.car3d=function(cv){var T=window.THREE;if(!T)return;if(T.ColorManagement)T.ColorManagement.legacyMode=false;var body=col(cv,'c1','#C8102E');
  var r=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.outputEncoding=T.sRGBEncoding;r.toneMapping=T.ACESFilmicToneMapping;r.shadowMap.enabled=true;
  var sc=new T.Scene(),cam=new T.PerspectiveCamera(32,1,.1,100);cam.position.set(7.5,2.6,8.5);cam.lookAt(0,.6,0);
  sc.add(new T.HemisphereLight(0xffffff,0x202030,.7));var key=new T.DirectionalLight(0xffffff,1.8);key.position.set(5,8,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);sc.add(key);
  var rim=new T.DirectionalLight(0x88aaff,1.4);rim.position.set(-6,3,-5);sc.add(rim);var fill=new T.PointLight(0xffffff,.8,30);fill.position.set(0,4,8);sc.add(fill);
  var car=new T.Group();sc.add(car);
  /* perfil lateral del auto, extruido a lo ancho */
  var s=new T.Shape();s.moveTo(-2.3,.35);s.lineTo(-2.35,.75);s.quadraticCurveTo(-2.3,1.0,-1.9,1.05);s.lineTo(-1.0,1.12);s.quadraticCurveTo(-.55,1.62,.25,1.66);s.quadraticCurveTo(1.0,1.64,1.45,1.18);s.lineTo(2.15,1.0);s.quadraticCurveTo(2.42,.92,2.4,.62);s.lineTo(2.35,.35);s.lineTo(-2.3,.35);
  var geo=new T.ExtrudeGeometry(s,{depth:1.7,bevelEnabled:true,bevelThickness:.18,bevelSize:.12,bevelSegments:6,curveSegments:24});geo.translate(0,0,-.85);
  var paint=new T.MeshPhysicalMaterial({color:body,metalness:.3,roughness:.3,clearcoat:1,clearcoatRoughness:.08});
  var shell=new T.Mesh(geo,paint);shell.castShadow=true;car.add(shell);
  var gs=new T.Shape();gs.moveTo(-.85,1.14);gs.quadraticCurveTo(-.45,1.55,.25,1.58);gs.quadraticCurveTo(.95,1.56,1.3,1.18);gs.lineTo(-.85,1.14);
  var glass=new T.Mesh(new T.ExtrudeGeometry(gs,{depth:1.78,bevelEnabled:false}),new T.MeshPhysicalMaterial({color:0x0b1020,metalness:.2,roughness:.05,transmission:0,opacity:.92,transparent:true,clearcoat:1}));glass.position.z=-.89;glass.position.y=.02;car.add(glass);
  var tireM=new T.MeshStandardMaterial({color:0x111111,roughness:.85}),rimM=new T.MeshStandardMaterial({color:0xd9dde3,metalness:1,roughness:.25});
  [[-1.45,.95],[1.5,.95],[-1.45,-.95],[1.5,-.95]].forEach(function(p){var w=new T.Group();var tire=new T.Mesh(new T.TorusGeometry(.36,.16,16,40),tireM);var rimG=new T.Mesh(new T.CylinderGeometry(.3,.3,.12,24),rimM);rimG.rotation.x=Math.PI/2;
    for(var i=0;i<5;i++){var sp=new T.Mesh(new T.BoxGeometry(.08,.5,.06),rimM);sp.rotation.z=i*Math.PI*2/5;sp.position.z=p[1]>0?.05:-.05;w.add(sp)}w.add(tire,rimG);w.position.set(p[0],.42,p[1]);w.userData.spin=true;car.add(w)});
  var lightM=new T.MeshBasicMaterial({color:0xfff6d0});[[2.42,.75,.55],[2.42,.75,-.55]].forEach(function(p){var l=new T.Mesh(new T.BoxGeometry(.06,.1,.45),lightM);l.position.set(p[0],p[1],p[2]);car.add(l)});
  var tailM=new T.MeshBasicMaterial({color:0xff2030});[[-2.42,.8,.55],[-2.42,.8,-.55]].forEach(function(p){var l=new T.Mesh(new T.BoxGeometry(.05,.08,.5),tailM);l.position.set(p[0],p[1],p[2]);car.add(l)});
  var floor=new T.Mesh(new T.CircleGeometry(6,64),new T.ShadowMaterial({opacity:.35}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;sc.add(floor);
  var ring=new T.Mesh(new T.RingGeometry(3.2,3.25,96),new T.MeshBasicMaterial({color:body,transparent:true,opacity:.55,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.01;sc.add(ring);
  car.position.y=.02;var tx=0,ty=0,scrollR=0;
  addEventListener('pointermove',function(e){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)},{passive:true});
  addEventListener('scroll',function(){scrollR=Math.min(scrollY/innerHeight,1.5)},{passive:true});
  function size(){var w=cv.clientWidth,h=cv.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.fov=w<600?44:32;cam.updateProjectionMatrix()}size();addEventListener('resize',size);
  K.setCarColor=function(c){paint.color.set(c);ring.material.color.set(c)};
  loop(cv,function(t){car.rotation.y=t*.25+tx*.8+scrollR*2.4;cam.position.y=2.6+ty*-1.2;cam.lookAt(0,.7,0);car.children.forEach(function(ch){if(ch.userData.spin)ch.rotation.z=-t*3});ring.scale.setScalar(1+Math.sin(t*2)*.02);r.render(sc,cam)})};

/* ---------- 3D: ciudad de bloques que crece (arquitectura) ---------- */
V.blocks3d=function(cv){var T=window.THREE;if(!T)return;if(T.ColorManagement)T.ColorManagement.legacyMode=false;var acc=col(cv,'c1','#A16207'),base=col(cv,'c2','#E7E5E4');
  var r=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.shadowMap.enabled=true;r.outputEncoding=T.sRGBEncoding;
  var sc=new T.Scene(),cam=new T.OrthographicCamera(-8,8,8,-8,.1,100);cam.position.set(12,12,12);cam.lookAt(0,0,0);
  sc.add(new T.AmbientLight(0xffffff,.55));var sun=new T.DirectionalLight(0xffffff,1.3);sun.position.set(6,14,4);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);var sCam=sun.shadow.camera;sCam.left=-10;sCam.right=10;sCam.top=10;sCam.bottom=-10;sc.add(sun);
  var g=new T.Group();sc.add(g);var B=[],rnd=K.rnd('monolito');
  for(var x=-4;x<=4;x++)for(var z=-4;z<=4;z++){if(rnd()<.28)continue;var h=.4+Math.pow(rnd(),2.2)*6,hot=rnd()<.09;
    var m=new T.Mesh(new T.BoxGeometry(.86,1,.86),new T.MeshStandardMaterial({color:hot?acc:base,roughness:.8,metalness:0}));m.position.set(x,0,z);m.castShadow=m.receiveShadow=true;m.userData.h=h;m.scale.y=.001;g.add(m);B.push(m);
    var e=new T.LineSegments(new T.EdgesGeometry(m.geometry),new T.LineBasicMaterial({color:0x1c1917,transparent:true,opacity:.25}));m.add(e)}
  var gr=new T.Mesh(new T.PlaneGeometry(30,30),new T.ShadowMaterial({opacity:.18}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;sc.add(gr);
  function size(){var w=cv.clientWidth,h=cv.clientHeight,a=w/h,v=w<600?9:7.5;r.setSize(w,h,false);cam.left=-v*a;cam.right=v*a;cam.top=v;cam.bottom=-v;cam.updateProjectionMatrix()}size();addEventListener('resize',size);
  var t0=null,sp=0;addEventListener('scroll',function(){sp=scrollY*.0015},{passive:true});
  loop(cv,function(t){if(t0===null)t0=t;var e=t-t0;B.forEach(function(m,i){var k=RM?1:Math.min(1,Math.max(0,(e*1.1-i*.012)));k=1-Math.pow(1-k,4);m.scale.y=Math.max(.001,m.userData.h*k);m.position.y=m.scale.y/2});
    g.rotation.y=e*.06+sp;r.render(sc,cam)})};

function init(){$$('canvas[data-vis]').forEach(function(cv){var f=V[cv.dataset.vis];if(f)try{f(cv)}catch(e){console.error(e)}});
  /* selector de color del auto 3D */
  $$('[data-car-color]').forEach(function(b){b.addEventListener('click',function(){if(K.setCarColor)K.setCarColor(b.dataset.carColor);$$('[data-car-color]').forEach(function(x){x.setAttribute('aria-pressed',x===b)})})})}
K.use(init);
})();
