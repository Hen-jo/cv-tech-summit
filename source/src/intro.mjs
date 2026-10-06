import * as THREE from 'three';
import {makeSweep,makeStudio} from './sculpture.mjs';

const hero=document.querySelector('.hero');
const media=hero.querySelector('.hero-media');
const pause=document.querySelector('#motion-control');
const replay=document.querySelector('#replay-intro');
const status=document.querySelector('#render-status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer,raf=0,failed=false,choice=null,time=0,last=0,inView=true;
const motion=()=>choice===null?!reduced.matches:choice;
function fallback(reason) {
  failed=true;cancelAnimationFrame(raf);raf=0;
  hero.classList.remove('webgl-ready');
  pause.hidden=true;replay.hidden=true;status.hidden=false;
  status.textContent='정지 이미지 모드';
  status.title='이 브라우저에서 3D 렌더링을 사용할 수 없어 정지 이미지를 표시합니다.';
  console.warn('CV TECH SUMMIT: static fallback.',reason);
  if(renderer) renderer.dispose();
}
try {
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.debug.onShaderError=()=>{throw new Error('WebGL shader compilation failed');};
  renderer.setClearColor(0x07101a,1);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.12;
  renderer.domElement.className='hero-canvas';
  renderer.domElement.setAttribute('aria-hidden','true');
  media.appendChild(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback('WebGL context lost');});
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,.1,80);
  const studio=makeStudio(),pmrem=new THREE.PMREMGenerator(renderer);
  const environment=pmrem.fromScene(studio,.035,.1,50,{size:256});
  scene.environment=environment.texture;scene.environmentIntensity=1.15;
  pmrem.dispose();studio.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});
  const sculpture=new THREE.Group();scene.add(sculpture);
  const geometry=makeSweep();
  const material=new THREE.MeshPhysicalMaterial({
    color:'#9caabb',metalness:1,roughness:.24,envMapIntensity:1.25,
    clearcoat:.22,clearcoatRoughness:.25,anisotropy:.55,anisotropyRotation:Math.PI/2
  });
  sculpture.add(new THREE.Mesh(geometry,material));
  const key=new THREE.DirectionalLight('#d9e7ff',2.2);key.position.set(-4,6,5);scene.add(key);
  const fill=new THREE.DirectionalLight('#7f9cb8',.7);fill.position.set(5,-2,-3);scene.add(fill);
  let width=1,height=1,dpr=1,frameSamples=[],sampleStart=0;
  function resize() {
    width=hero.clientWidth;height=hero.clientHeight;
    dpr=Math.min(devicePixelRatio||1,width<700?1.35:1.75);
    renderer.setPixelRatio(dpr);renderer.setSize(width,height,false);
    camera.aspect=width/height;camera.updateProjectionMatrix();
    render();
  }
  function pose() {
    const mobile=width<700;
    const progress=Math.min(time/4.2,1);
    const ease=1-Math.pow(1-progress,3);
    const idle=Math.max(0,time-4.2);
    // Perspective position and look-at both move. This is not a scaled image.
    camera.position.set(1.8*(1-ease)+Math.sin(idle*.18)*.24,.7*(1-ease)+Math.sin(idle*.12)*.08,10.4+3.7*ease);
    camera.lookAt(0,.2,0);
    sculpture.position.set(mobile?.45:3.0,mobile?1.1:0,0);
    sculpture.scale.setScalar(mobile?.85:1.08);
    sculpture.rotation.set(-.10+.10*ease,-.62+.45*ease+Math.sin(idle*.2)*.045,-.13+.06*ease);
    scene.environmentRotation.set(0,-.18+time*.022,0);
    key.position.x=-4+Math.sin(time*.35)*2;
  }
  function render() {if(!failed){pose();renderer.render(scene,camera);}}
  function tick(now) {
    raf=0;if(failed||!motion()||document.hidden||!inView)return;
    const dt=last?Math.min((now-last)/1000,.05):0;last=now;time+=dt;
    try{render();}catch(error){fallback(error);return;}
    // One-way quality reduction after sustained low frame rate; no DPR oscillation.
    if(dt>0&&time>1)frameSamples.push(dt);
    if(now-sampleStart>2500&&frameSamples.length>45){
      const average=frameSamples.reduce((a,b)=>a+b,0)/frameSamples.length;
      if(average>.026&&dpr>1){dpr=Math.max(1,dpr-.25);renderer.setPixelRatio(dpr);renderer.setSize(width,height,false);}
      frameSamples=[];sampleStart=now;
    }
    raf=requestAnimationFrame(tick);
  }
  function sync() {
    if(failed)return;
    const playing=motion();pause.hidden=false;replay.hidden=false;
    pause.setAttribute('aria-pressed',String(playing));
    pause.setAttribute('aria-label',playing?'3D 움직임 일시 정지':'3D 움직임 재생');
    pause.querySelector('.control-symbol').textContent=playing?'Ⅱ':'▶';
    pause.querySelector('.control-label').textContent=playing?'Pause motion':'Play motion';
    replay.title=reduced.matches?'누르면 3D 움직임을 재생합니다.':'3D 인트로 다시 보기';
    cancelAnimationFrame(raf);raf=0;last=0;
    if(playing&&!document.hidden&&inView)raf=requestAnimationFrame(tick);
    else render();
  }
  pause.addEventListener('click',()=>{choice=!motion();sync();});
  replay.addEventListener('click',()=>{choice=true;time=0;sync();});
  reduced.addEventListener('change',()=>{choice=null;if(reduced.matches)time=4.2;sync();});
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pageshow',sync);
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:0}).observe(hero);
  if(reduced.matches)time=4.2;
  resize();renderer.compile(scene,camera);render();
  hero.classList.add('webgl-ready');
  hero.dataset.renderer='three-webgl-pbr';
  sync();
}catch(error){fallback(error);}
