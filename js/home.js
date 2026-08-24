document.body.dataset.page="home";

const heroIntro=()=>{
  if(reduced||!hasMotion) return;
  const words=$$(".hero h1 .w > span");
  Motion.animate(words,{transform:["translateY(110%) rotate(4deg)","translateY(0%) rotate(0deg)"]},{duration:1,easing:EASE,delay:Motion.stagger(.09,{start:.2})});
  const rest=$$("[data-hero]:not(canvas)");
  rest.forEach(el=>{el.style.opacity=0;el.style.transform="translateY(24px)"});
  Motion.animate(rest,{opacity:[0,1],transform:["translateY(24px)","translateY(0px)"]},{duration:.9,easing:EASE,delay:Motion.stagger(.12,{start:.55})});
};

const initThree=()=>{
  const canvas=$("#gl");
  if(!canvas||typeof THREE==="undefined") return;
  try{
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(45,1,.1,100);
    camera.position.set(0,0,7.5);

    const group=new THREE.Group();
    scene.add(group);

    const matInk=new THREE.MeshStandardMaterial({color:0x16161d,metalness:.85,roughness:.22});
    const matAcc=new THREE.MeshStandardMaterial({color:0xff4d24,metalness:.55,roughness:.28});
    const matVio=new THREE.MeshStandardMaterial({color:0x7c5cff,metalness:.6,roughness:.3});

    const torus=new THREE.Mesh(new THREE.TorusKnotGeometry(1.15,.36,220,32),matInk);
    group.add(torus);

    const ring=new THREE.Mesh(new THREE.TorusGeometry(2.5,.02,16,120),new THREE.MeshBasicMaterial({color:0xff4d24}));
    ring.rotation.x=Math.PI/2.4;group.add(ring);
    const ring2=new THREE.Mesh(new THREE.TorusGeometry(2.9,.012,16,140),new THREE.MeshBasicMaterial({color:0x7c5cff}));
    ring2.rotation.x=Math.PI/1.8;ring2.rotation.y=.5;group.add(ring2);

    const sat=(r,c,dist,speed)=>{
      const m=new THREE.Mesh(new THREE.SphereGeometry(r,32,32),c);
      m.userData={dist,speed};group.add(m);return m;
    };
    const sats=[
      sat(.16,new THREE.MeshStandardMaterial({color:0xffffff,metalness:.9,roughness:.15}),2.5,.8),
      sat(.11,matAcc,2.5,-1.2),
      sat(.13,matVio,2.9,.9),
      sat(.09,new THREE.MeshStandardMaterial({color:0xffffff,metalness:.9,roughness:.15}),2.9,-1.6)
    ];

    const shards=[];
    for(let i=0;i<26;i++){
      const g=Math.random()>.5?new THREE.OctahedronGeometry(.07+Math.random()*.08):new THREE.BoxGeometry(.06,.06,.14);
      const m=new THREE.Mesh(g,[matAcc,matVio,matInk][i%3]);
      m.position.set((Math.random()-.5)*7,(Math.random()-.5)*5,(Math.random()-.5)*3-1);
      m.userData={sp:.2+Math.random()*.6,off:Math.random()*Math.PI*2};
      group.add(m);shards.push(m);
    }

    scene.add(new THREE.AmbientLight(0xffffff,.55));
    const l1=new THREE.PointLight(0xff4d24,60,30);l1.position.set(-4,3,4);scene.add(l1);
    const l2=new THREE.PointLight(0x7c5cff,50,30);l2.position.set(4,-2,4);scene.add(l2);
    const l3=new THREE.DirectionalLight(0xffffff,1.4);l3.position.set(2,4,6);scene.add(l3);

    let mx=0,my=0,tx=0,ty=0,dragging=false,px=0,vx=0;
    canvas.addEventListener("pointermove",e=>{
      const r=canvas.getBoundingClientRect();
      tx=((e.clientX-r.left)/r.width-.5);
      ty=((e.clientY-r.top)/r.height-.5);
      if(dragging){vx+=(e.clientX-px)*.004;px=e.clientX}
    });
    canvas.addEventListener("pointerdown",e=>{dragging=true;px=e.clientX});
    addEventListener("pointerup",()=>dragging=false);

    const resize=()=>{
      const w=canvas.clientWidth||canvas.parentElement.clientWidth;
      const h=canvas.clientHeight||canvas.parentElement.clientHeight;
      renderer.setSize(w,h,false);
      camera.aspect=w/h;camera.updateProjectionMatrix();
    };
    resize();addEventListener("resize",resize);

    const clock=new THREE.Clock();
    const tick=()=>{
      requestAnimationFrame(tick);
      const t=clock.getElapsedTime();
      mx+=(tx-mx)*.05;my+=(ty-my)*.05;
      vx*=.94;
      group.rotation.y=t*.25+mx*.7+vx;
      group.rotation.x=my*.5+Math.sin(t*.4)*.06;
      torus.rotation.z=t*.18;
      sats.forEach(s=>{
        const a=t*s.userData.speed+s.userData.dist;
        s.position.set(Math.cos(a)*s.userData.dist,Math.sin(a*1.4)*.5,Math.sin(a)*s.userData.dist*.4);
      });
      shards.forEach(sh=>{
        sh.rotation.x+=sh.userData.sp*.01;
        sh.rotation.y+=sh.userData.sp*.013;
        sh.position.y+=Math.sin(t+sh.userData.off)*.0022;
      });
      renderer.render(scene,camera);
    };
    if(!reduced)tick();else renderer.render(scene,camera);
  }catch(err){ canvas.style.display="none"; }
};

const floatChips=()=>{
  if(reduced||!hasMotion)return;
  $$("[data-float]").forEach((el,i)=>{
    const y=i%2?[-10,-22]:[-20,-6];
    Motion.animate(el,{transform:[`translateY(${y[0]}px)`,`translateY(${y[1]}px)`]},{duration:3+i*.7,easing:"ease-in-out",repeat:Infinity,repeatType:"mirror"});
  });
};

let featFilter="All";
const renderFeatured=()=>{
  const grid=$("#featured-grid");
  if(!grid)return;
  let list=ZEN_DATA.products.filter(p=>featFilter==="All"||p.cat===featFilter).slice(0,8);
  grid.innerHTML=list.map(p=>UI.card(p)).join("");
  UI.observe(grid);
};
$("#featured-grid")&&document.addEventListener("click",e=>{
  const chip=e.target.closest("[data-feat]");
  if(!chip)return;
  $$("[data-feat]").forEach(c=>c.classList.remove("on"));
  chip.classList.add("on");
  featFilter=chip.dataset.feat;
  renderFeatured();
});

const initCountdown=()=>{
  const el=$("#countdown");if(!el)return;
  let end=Number(localStorage.getItem("zen_deal_end"));
  if(!end||end<Date.now()){end=Date.now()+1000*60*60*38;localStorage.setItem("zen_deal_end",end)}
  const pad=n=>String(n).padStart(2,"0");
  const upd=()=>{
    let d=end-Date.now();if(d<0)d=0;
    $("#cd-d").textContent=pad(Math.floor(d/86400000));
    $("#cd-h").textContent=pad(Math.floor(d/3600000)%24);
    $("#cd-m").textContent=pad(Math.floor(d/60000)%60);
    $("#cd-s").textContent=pad(Math.floor(d/1000)%60);
  };
  upd();setInterval(upd,1000);
};

const initTesti=()=>{
  const track=$("#testi-track");if(!track)return;
  const card=t=>`
  <div class="t-card">
    <span>${UI.stars(t.s)}</span>
    <p>“${t.t}”</p>
    <div class="t-who">
      <img src="${t.img}" alt="${t.n}" loading="lazy">
      <div><b>${t.n}</b><span>${t.r}</span></div>
    </div>
  </div>`;
  const items=ZEN_DATA.testimonials.map(card).join("");
  track.innerHTML=items+items;
};

const initNews=()=>{
  const f=$("#news-form");if(!f)return;
  f.addEventListener("submit",e=>{
    e.preventDefault();
    if(hasMotion&&!reduced){
      Motion.animate(f,{opacity:[1,0],transform:["scale(1)","scale(.96)"]},{duration:.3,easing:EASE}).finished.then(()=>{
        f.style.display="none";
        const ok=$("#news-ok");ok.style.display="block";
        Motion.animate(ok,{opacity:[0,1],transform:["translateY(12px)","translateY(0px)"]},{duration:.5,easing:EASE});
      });
    } else {f.style.display="none";$("#news-ok").style.display="block";}
  });
};

document.addEventListener("DOMContentLoaded",()=>{
  document.body.dataset.page="home";
  heroIntro();
  initThree();
  floatChips();
  renderFeatured();
  initCountdown();
  initTesti();
  initNews();
  const mq=$("#mq-track");
  mq&&(mq.innerHTML=mq.innerHTML.repeat(4));
});
