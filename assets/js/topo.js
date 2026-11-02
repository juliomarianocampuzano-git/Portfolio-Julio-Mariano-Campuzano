/* Topo: fondo vivo en WebGL (lineas de nivel que fluyen, reaccionan al puntero)
   con calidad adaptativa y fallback 2D. Concepto: mapa topografico del territorio (Posadas, Misiones).
   Regla de origen: taste-skill "shader-driven effects remain first-class media"; impeccable "nonessential
   loops stop offscreen"; Emil: solo transform/opacity en DOM, el efecto vive en canvas. */
(function(){
  var VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var FS='#ifdef GL_OES_standard_derivatives\n#extension GL_OES_standard_derivatives : enable\n#endif\nprecision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;uniform float k;uniform float pulse;'+
  'float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}'+
  'float n(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'+
  'float fbm(vec2 q){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(q);q=q*2.03+vec2(1.7,9.2);a*=.5;}return s;}'+
  'void main(){vec2 uv=gl_FragCoord.xy/r.y;float tt=t*.045;vec2 q=uv*1.9;'+
  'float w=fbm(q+vec2(tt,-tt*.7)+.9*fbm(q*1.3-vec2(tt*.6,tt)));'+
  'vec2 mm=m*vec2(r.x/r.y,1.);float d=distance(uv,mm);w+=k*.26*exp(-d*d*7.)+pulse*.12*exp(-pow(d-pulse*.9,2.)*60.);'+
  'float f=w*11.;float fr=fract(f);float dd=min(fr,1.-fr);\n'+
  '#ifdef GL_OES_standard_derivatives\nfloat aa=fwidth(f)*1.1;float line=1.-smoothstep(aa*.35,aa*1.35,dd);\n#else\nfloat line=1.-smoothstep(.0,.07,dd);\n#endif\n'+
  'float idx=floor(f);float major=step(.5,fract(idx/5.+.001));float fade=smoothstep(.0,.32,gl_FragCoord.x/r.x)*.7+.3;'+
  'vec3 bg=vec3(1.,.973,.937);vec3 cb=mix(vec3(1.,.42,.173),vec3(1.,.243,.541),major);float a=line*(.26+.3*major)*mix(.55,1.,fade)+line*exp(-d*d*9.)*.55*k;'+
  'gl_FragColor=vec4(mix(bg,cb,clamp(a,0.,1.)),1.);}';

  function GL(cv,opts){
    var gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power',preserveDrawingBuffer:false});
    if(!gl)return null;
    gl.getExtension('OES_standard_derivatives');
    function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)){return null}return o}
    var v=sh(gl.VERTEX_SHADER,VS),f=sh(gl.FRAGMENT_SHADER,FS);if(!v||!f)return null;
    var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null;
    gl.useProgram(pr);
    var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    var U={r:gl.getUniformLocation(pr,'r'),t:gl.getUniformLocation(pr,'t'),m:gl.getUniformLocation(pr,'m'),k:gl.getUniformLocation(pr,'k'),pulse:gl.getUniformLocation(pr,'pulse')};
    return {draw:function(w,h,t,mx,my,k,pu){gl.viewport(0,0,w,h);gl.uniform2f(U.r,w,h);gl.uniform1f(U.t,t);gl.uniform2f(U.m,mx,my);gl.uniform1f(U.k,k);gl.uniform1f(U.pulse,pu);gl.drawArrays(gl.TRIANGLES,0,3)}};
  }

  /* fallback 2D: campo de puntos que derivan (barato, sin WebGL) */
  function Dots(cv){
    var c=cv.getContext('2d'),W=0,H=0,P=[],N=0;
    function size(w,h){W=w;H=h;N=Math.round(Math.min(90,w*h/16000));P=[];for(var i=0;i<N;i++)P.push({x:Math.random()*w,y:Math.random()*h,a:Math.random()*6.28,s:.2+Math.random()*.5})}
    return {draw:function(w,h,t,mx,my,k){
      if(w!==W||h!==H)size(w,h);
      c.fillStyle='#FFF8EF';c.fillRect(0,0,w,h);c.fillStyle='#FF6B2C';
      for(var i=0;i<N;i++){var p=P[i];p.a+=.002*Math.sin(t*.3+i);p.x+=Math.cos(p.a)*p.s;p.y+=Math.sin(p.a)*p.s;
        if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
        var dx=p.x/w-mx,dy=p.y/h-(1-my),near=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)*3)*k;
        c.globalAlpha=.25+.6*near;c.beginPath();c.arc(p.x,p.y,1.5+2.5*near,0,6.283);c.fill()}
      c.globalAlpha=1}};
  }

  function Topo(cv,opt){
    opt=opt||{};
    var rm=window.__fx&&window.__fx.rm,coarse=matchMedia('(pointer:coarse)').matches;
    var scale=coarse?.5:.7,min=.34,r=null,mode='gl';
    var io=null,ro=null,bw=0,bh=0;
    /* a 2D: canvas nuevo (un canvas con contexto WebGL no acepta otro contexto) */
    function to2d(){mode='2d';var nc=cv.cloneNode(false);cv.parentNode.replaceChild(nc,cv);cv=nc;g=Dots(cv);if(io){io.disconnect();io.observe(cv)}if(ro){ro.disconnect();ro.observe(cv)}bw=0}
    var g=GL(cv);if(!g)to2d();
    /* si el navegador tira el contexto WebGL (muchas pestanas, GPU ocupada en el celular) seguimos en 2D en vez de quedar en negro */
    else cv.addEventListener('webglcontextlost',function(e){e.preventDefault();to2d();if(vis)start()},{once:true});
    var t0=performance.now(),vis=false,raf=0,mx=.7,my=.5,tx=.7,ty=.5,k=0,tk=0,pulse=0,pulseT=-9,slow=0,fr=0,last=0,still=false;
    function box(){var rc=cv.getBoundingClientRect();bw=rc.width;bh=rc.height}
    function fit(){
      if(!bw)box();
      var dpr=Math.min(window.devicePixelRatio||1,2);
      var w=Math.max(2,Math.round(bw*dpr*(mode==='gl'?scale:1))),h=Math.max(2,Math.round(bh*dpr*(mode==='gl'?scale:1)));
      if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}
    }
    if('ResizeObserver' in window){ro=new ResizeObserver(function(){box()});ro.observe(cv)}else addEventListener('resize',box,{passive:true});
    function frame(now){
      raf=0;if(!vis&&!still)return;
      var dt=now-last;last=now;
      /* calidad adaptativa: si los cuadros tardan, bajamos la resolucion; si siguen lentos, paramos en un cuadro estatico */
      if(dt>26){slow++}else if(slow>0){slow-=.25}
      if(slow>14&&mode==='gl'){if(scale>min){scale=Math.max(min,scale*.8);slow=4;fit()}else{still=true}}
      mx+=(tx-mx)*.08;my+=(ty-my)*.08;k+=(tk-k)*.06;
      var s=(now-t0)/1000,pu=Math.max(0,1-(s-pulseT)*1.2);pulse=pu>0?(1-pu):0;
      if(pu<=0)pulse=0;
      fit();
      g.draw(cv.width,cv.height,still||rm?12:s,mx,1-my,k,pu>0?(1-pu):0);
      if(!still&&!rm&&vis)raf=requestAnimationFrame(frame);
    }
    function start(){if(!raf&&(vis)){last=performance.now();raf=requestAnimationFrame(frame)}}
    io=new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis){rm?frame(performance.now()):start()}},{threshold:0});io.observe(cv);
    var host=opt.host||cv.parentElement;
    host.addEventListener('pointermove',function(e){var b=host.getBoundingClientRect();tx=(e.clientX-b.left)/b.width;ty=(e.clientY-b.top)/b.height;tk=1},{passive:true});
    host.addEventListener('pointerleave',function(){tk=0},{passive:true});
    host.addEventListener('pointerdown',function(){pulseT=(performance.now()-t0)/1000},{passive:true});
    addEventListener('resize',function(){if(vis)fit()},{passive:true});
    document.addEventListener('visibilitychange',function(){if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0}else if(vis)start()});
    return {mode:function(){return mode}};
  }
  window.Topo=Topo;
})();
