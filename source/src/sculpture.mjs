import * as THREE from 'three';

// Original open titanium sweep. The cross section rolls along a smooth spline.
// No downloaded model, environment, texture or font is used.
export function makeSweep(segments = 240, radial = 48) {
  const curve = new THREE.CatmullRomCurve3([
    [-4.2,-4.4,-.7],[-2.5,-3.2,.3],[.3,-2.9,1.1],
    [2.0,-1.9,.5],[2.3,.05,-.6],[1.1,2.1,-.7],
    [-.35,3.2,.35],[.3,4.8,.9]
  ].map(p=>new THREE.Vector3(...p)),false,'centripetal');
  const frames=curve.computeFrenetFrames(segments,false);
  const positions=[],uvs=[],indices=[];
  const p=new THREE.Vector3();
  for(let i=0;i<=segments;i++) {
    const t=i/segments, center=curve.getPointAt(t);
    const twist=.2+1.3*t+.35*Math.sin(t*Math.PI*2);
    const n=frames.normals[i].clone().multiplyScalar(Math.cos(twist)).addScaledVector(frames.binormals[i],Math.sin(twist));
    const b=frames.binormals[i].clone().multiplyScalar(Math.cos(twist)).addScaledVector(frames.normals[i],-Math.sin(twist));
    const width=.64+.37*Math.sin(Math.PI*t), depth=.20+.045*Math.sin(Math.PI*t);
    for(let j=0;j<=radial;j++) {
      const a=j/radial*Math.PI*2;
      p.copy(center).addScaledVector(n,Math.cos(a)*width).addScaledVector(b,Math.sin(a)*depth);
      positions.push(p.x,p.y,p.z);uvs.push(t*3,j/radial);
      if(i<segments&&j<radial) {
        const a=i*(radial+1)+j,c=a+radial+1;
        indices.push(a,a+1,c,a+1,c+1,c);
      }
    }
  }
  // End caps are outside the main framing, but close the object cleanly.
  for(const end of [0,segments]) {
    const center=curve.getPointAt(end/segments), ci=positions.length/3;
    positions.push(center.x,center.y,center.z);uvs.push(end/segments*3,.5);
    for(let j=0;j<radial;j++) {
      const a=end*(radial+1)+j;
      if(end===0) indices.push(ci,a+1,a);else indices.push(ci,a,a+1);
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  g.setIndex(indices);g.computeVertexNormals();g.computeTangents();g.computeBoundingSphere();
  return g;
}

export function makeStudio() {
  const studio=new THREE.Scene();
  studio.background=new THREE.Color('#101820');
  const room=new THREE.Mesh(new THREE.BoxGeometry(35,30,30),new THREE.MeshBasicMaterial({color:'#27313c',side:THREE.BackSide}));
  studio.add(room);
  const cards=[
    {p:[-6,5,5],s:[4,12],c:'#edf4ff',v:7},
    {p:[5,3,2],s:[1.3,14],c:'#ffffff',v:12},
    {p:[0,8,-3],s:[12,3],c:'#b9cee5',v:5},
    {p:[-4,-5,4],s:[8,2],c:'#869aa9',v:2},
    {p:[4,1,-7],s:[3,12],c:'#7899c7',v:6},
    {p:[1,0,9],s:[7,8],c:'#d4dce4',v:1.1}
  ];
  for(const {p,s,c,v} of cards) {
    const panel=new THREE.Mesh(new THREE.PlaneGeometry(...s),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(v),side:THREE.DoubleSide}));
    panel.position.set(...p);panel.lookAt(0,0,0);studio.add(panel);
  }
  return studio;
}
