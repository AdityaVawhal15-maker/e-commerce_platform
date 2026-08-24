const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
const EASE = [.22,1,.36,1];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasMotion = typeof Motion !== "undefined";

const Cart = {
  read(){ try{return JSON.parse(localStorage.getItem("zen_cart"))||[]}catch(e){return []} },
  write(items){ localStorage.setItem("zen_cart", JSON.stringify(items)); UI.refreshBadges(); document.dispatchEvent(new CustomEvent("cart:change")); },
  add(id, qty=1){
    const items = this.read();
    const found = items.find(i=>i.id===Number(id));
    found ? found.qty += qty : items.push({id:Number(id), qty});
    this.write(items);
  },
  setQty(id, qty){
    let items = this.read().filter(i=>!(i.id===Number(id)&&qty<=0));
    const f = items.find(i=>i.id===Number(id)); if(f&&qty>0) f.qty=qty;
    this.write(items);
  },
  remove(id){ this.write(this.read().filter(i=>i.id!==Number(id))); },
  clear(){ this.write([]); },
  count(){ return this.read().reduce((a,i)=>a+i.qty,0); },
  subtotal(){ return this.read().reduce((a,i)=>{const p=zenProduct(i.id); return a+(p?p.price*i.qty:0)},0); }
};
const Wish = {
  all(){ try{return JSON.parse(localStorage.getItem("zen_wish"))||[]}catch(e){return []} },
  has(id){ return this.all().includes(Number(id)); },
  toggle(id){
    let w=this.all(); const n=Number(id);
    w.includes(n)?w=w.filter(x=>x!==n):w.push(n);
    localStorage.setItem("zen_wish",JSON.stringify(w));
    return w.includes(n);
  }
};

const UI = {
  stars(r){
    const pct=(r/5)*100;
    return `<span class="stars">★★★★★<span class="fill" style="width:${pct}%">★★★★★</span></span>`;
  },
  badgeText(p){
    if(!p.badge) return "";
    if(p.badge==="sale") return `<span class="badge sale">-${Math.round((1-p.price/p.old)*100)}%</span>`;
    if(p.badge==="new") return `<span class="badge new">New</span>`;
    return `<span class="badge">Hot</span>`;
  },
  card(p){
    return `
    <article class="p-card" data-reveal data-tilt>
      ${this.badgeText(p)}
      <div class="p-media">
        <img class="main" src="${p.img}" alt="${p.name}" loading="lazy">
        <img class="alt" src="${p.imgAlt}" alt="" loading="lazy">
        <button class="p-wish ${Wish.has(p.id)?"on":""}" data-wish="${p.id}" aria-label="Save to wishlist">
          <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 00-7.7 0L12 5.6l-1.1-1a5.5 5.5 0 10-7.8 7.8l1.1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>
        </button>
        <button class="quick-add" data-add="${p.id}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Add to bag
        </button>
      </div>
      <div class="p-body">
        <span class="p-cat">${p.cat}</span>
        <h3 class="p-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="p-row">
          <span class="price">${fmt(p.price)}${p.old?`<s>${fmt(p.old)}</s>`:""}</span>
          <span style="display:flex;align-items:center;gap:6px;font-size:.78rem;color:var(--mut)">${this.stars(p.rating)} <b>${p.rating}</b></span>
        </div>
      </div>
    </article>`;
  },
  observe(scope=document){
    $$("[data-reveal]",scope).forEach(el=>{
      if(el.dataset.revealBound) return;
      el.dataset.revealBound="1";
      if(reduced||!hasMotion){ el.style.opacity=1; return; }
      el.style.opacity="0"; el.style.transform="translateY(28px)";
      Motion.inView(el, ()=>{
        Motion.animate(el,{opacity:[0,1],transform:["translateY(28px)","translateY(0px)"]},{duration:.9,easing:EASE});
      },{margin:"0px 0px -12% 0px"});
    });
    this.bindTilt(scope);
    this.bindMagnetic(scope);
  },
  bindTilt(scope=document){
    if(matchMedia("(pointer:coarse)").matches) return;
    $$("[data-tilt]",scope).forEach(el=>{
      if(el.dataset.tiltBound) return; el.dataset.tiltBound="1";
      el.style.transformStyle="preserve-3d";
      el.addEventListener("pointermove",e=>{
        const r=el.getBoundingClientRect();
        const rx=((e.clientY-r.top)/r.height-.5)*-7;
        const ry=((e.clientX-r.left)/r.width-.5)*9;
        el.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      });
      el.addEventListener("pointerleave",()=>{
        el.style.transition="transform .6s cubic-bezier(.22,1,.36,1)";
        el.style.transform="";
        setTimeout(()=>el.style.transition="",600);
      });
    });
  },
  bindMagnetic(scope=document){
    if(matchMedia("(pointer:coarse)").matches) return;
    $$(".magnetic",scope).forEach(el=>{
      if(el.dataset.magBound) return; el.dataset.magBound="1";
      el.addEventListener("pointermove",e=>{
        const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left-r.width/2)*.25;
        const y=(e.clientY-r.top-r.height/2)*.35;
        el.style.transform=`translate(${x}px,${y}px)`;
      });
      el.addEventListener("pointerleave",()=>{
        el.style.transition="transform .5s cubic-bezier(.34,1.56,.64,1)";
        el.style.transform="";
        setTimeout(()=>el.style.transition="",500);
      });
    });
  },

  refreshBadges(){
    const c=Cart.count(), w=Wish.all().length;
    $$("#cart-count").forEach(el=>{el.textContent=c; el.classList.toggle("show",c>0)});
    $$("#wish-count").forEach(el=>{el.textContent=w; el.classList.toggle("show",w>0)});
  },

  renderHeader(){
    const page=$("body").dataset.page||"";
    $("#header-root").innerHTML=`
    <header class="site" id="site-header">
      <div class="container">
        <div class="nav-shell">
          <a href="index.html" class="logo">ZENITH<i></i></a>
          <nav class="nav-links">
            <a href="index.html" class="${page==="home"?"active":""}">Home</a>
            <a href="shop.html" class="${page==="shop"?"active":""}">Shop</a>
            <a href="index.html#collections">Collections</a>
            <a href="index.html#deals">Deals</a>
            <a href="index.html#newsletter">Newsletter</a>
          </nav>
          <div class="nav-actions">
            <button class="icon-btn" data-open-search aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            </button>
            <button class="icon-btn" id="open-wish-btn" aria-label="Wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.7 0L12 5.6l-1.1-1a5.5 5.5 0 10-7.8 7.8l1.1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>
              <span class="count" id="wish-count"></span>
            </button>
            <button class="icon-btn" data-open-cart aria-label="Shopping bag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 14H5L6 7z"/><path d="M9 7a3 3 0 016 0"/></svg>
              <span class="count" id="cart-count"></span>
            </button>
            <button class="icon-btn burger" data-open-menu aria-label="Menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
    <div class="mobile-menu" id="mobile-menu">
      <button class="close-mm icon-btn" data-close-menu aria-label="Close menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <a href="index.html">Home</a><a href="shop.html">Shop</a>
      <a href="index.html#collections">Collections</a><a href="index.html#deals">Deals</a>
      <a href="cart.html">Bag</a>
    </div>`;
  },

  renderFooter(){
    $("#footer-root").innerHTML=`
    <footer class="site">
      <div class="container">
        <div class="f-top">
          <div class="f-brand">
            <a href="index.html" class="logo" style="color:#fff">ZENITH<i></i></a>
            <p>Future-grade essentials for people who move fast. Designed everywhere, shipped carbon-neutral.</p>
            <div class="socials">
              <a href="#" aria-label="Twitter / X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.3l-5-6.5L6.4 22H3.3l7.3-8.4L1 2h6.5l4.5 6zm-1.1 18h1.7L7.6 3.9H5.8z"/></svg></a>
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/></svg></a>
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.8-.5-5.6c-.3-1-1-1.7-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4c-1 .3-1.7 1-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6c.3 1 1 1.7 2 2 1.8.4 8.5.4 8.5.4s6.7 0 8.5-.4c1-.3 1.7-1 2-2 .5-1.8.5-5.6.5-5.6zM10 15.5v-7l6 3.5-6 3.5z"/></svg></a>
              <a href="#" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.4 2.1 1.8 3.6 3.9 3.9v3c-1.5 0-2.8-.5-3.9-1.3v6.1A5.8 5.8 0 1110 8.9v3.2a2.7 2.7 0 102.6 2.7V3h4z"/></svg></a>
            </div>
          </div>
          <div class="f-col">
            <h4>Shop</h4>
            <a href="shop.html?cat=Audio">Audio</a>
            <a href="shop.html?cat=Wearables">Wearables</a>
            <a href="shop.html?cat=Tech">Tech</a>
            <a href="shop.html?cat=Footwear">Footwear</a>
            <a href="shop.html">All products</a>
          </div>
          <div class="f-col">
            <h4>Company</h4>
            <a href="#">About us</a>
            <a href="#">Careers</a>
            <a href="#">Sustainability</a>
            <a href="#">Press kit</a>
          </div>
          <div class="f-col">
            <h4>Support</h4>
            <a href="#">Help center</a>
            <a href="#">Track order</a>
            <a href="#">Shipping &amp; returns</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div class="f-bar">
          <span>© ${new Date().getFullYear()} Zenith Commerce. All rights reserved.</span>
          <div class="pay-badges"><span>VISA</span><span>MASTERCARD</span><span>AMEX</span><span>PAYPAL</span><span>APPLE PAY</span></div>
          <a href="#top" id="to-top" class="link-arrow" style="color:#fff">Back to top ↑</a>
        </div>
      </div>
      <div class="f-word">ZENITH</div>
    </footer>`;
  },

  renderDrawer(){
    $("#drawer-root").innerHTML=`
    <div class="drawer-backdrop" data-close-drawer></div>
    <aside class="drawer" id="cart-drawer" aria-label="Shopping bag">
      <div class="drawer-head">
        <div class="drawer-tabs">
          <button class="on" data-dtab="cart">Bag (<b id="d-count">0</b>)</button>
          <button data-dtab="saved">Saved (<b id="d-wish">0</b>)</button>
        </div>
        <button class="icon-btn" data-close-drawer aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="drawer-body" id="drawer-body"></div>
      <div class="drawer-foot" id="drawer-foot"></div>
    </aside>`;
    this.renderDrawerBody("cart");
  },

  drawerTab:"cart",
  renderDrawerBody(tab){
    this.drawerTab=tab;
    $$(".drawer-tabs button").forEach(b=>b.classList.toggle("on",b.dataset.dtab===tab));
    const body=$("#drawer-body"), foot=$("#drawer-foot");
    if(tab==="cart"){
      const items=Cart.read();
      $("#d-count").textContent=Cart.count();
      if(!items.length){
        body.innerHTML=`<div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M6 7h12l1 14H5L6 7z"/><path d="M9 7a3 3 0 016 0"/></svg>
          <b>Your bag is empty</b><span>Fill it with something good.</span>
          <a href="shop.html" class="btn btn-dark sm" data-close-drawer>Start shopping</a></div>`;
        foot.innerHTML="";
        return;
      }
      const sub=Cart.subtotal(), left=Math.max(0,150-sub);
      body.innerHTML=`
        <div class="ship-bar">${left>0?`You're <b>${fmt(left)}</b> away from free shipping`:`🎉 You unlocked <b>free shipping</b>`}
          <div class="ship-track"><i style="width:${Math.min(100,sub/150*100)}%"></i></div>
        </div>
        ${items.map(i=>{const p=zenProduct(i.id); return p?`
        <div class="d-item" data-item="${p.id}">
          <img src="${p.img}" alt="${p.name}">
          <div class="d-info">
            <b>${p.name}</b>
            <span class="price">${fmt(p.price)}</span>
            <div class="qty">
              <button data-qdec="${p.id}" aria-label="Decrease">−</button><b>${i.qty}</b><button data-qinc="${p.id}" aria-label="Increase">+</button>
            </div>
          </div>
          <button class="d-x" data-remove="${p.id}" aria-label="Remove">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>`:""}).join("")}`;
      foot.innerHTML=`
        <div class="subtotal"><span>Subtotal</span><span>${fmt(sub)}</span></div>
        <a href="cart.html" class="btn btn-dark magnetic" data-close-drawer>View bag &amp; checkout</a>`;
    } else {
      const ids=Wish.all();
      $("#d-wish").textContent=ids.length;
      if(!ids.length){
        body.innerHTML=`<div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.8 4.6a5.5 5.5 0 00-7.7 0L12 5.6l-1.1-1a5.5 5.5 0 10-7.8 7.8l1.1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>
          <b>Nothing saved yet</b><span>Tap the heart on any product.</span>
          <a href="shop.html" class="btn btn-dark sm" data-close-drawer>Browse products</a></div>`;
        foot.innerHTML=""; return;
      }
      body.innerHTML=ids.map(id=>{const p=zenProduct(id); return p?`
      <div class="d-item">
        <img src="${p.img}" alt="${p.name}">
        <div class="d-info"><b>${p.name}</b><span class="price">${fmt(p.price)}</span>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="btn sm btn-dark" data-add="${p.id}">Add to bag</button>
          </div>
        </div>
        <button class="d-x" data-wish="${p.id}" aria-label="Remove saved">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.7 0L12 5.6l-1.1-1a5.5 5.5 0 10-7.8 7.8l1.1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>
        </button>
      </div>`:""}).join("");
      foot.innerHTML="";
    }
  },
  openDrawer(tab){ if(tab)this.renderDrawerBody(tab); $("#cart-drawer").classList.add("open"); $(".drawer-backdrop").classList.add("open"); document.body.style.overflow="hidden"; },
  closeDrawer(){ $("#cart-drawer")?.classList.remove("open"); $(".drawer-backdrop")?.classList.remove("open"); document.body.style.overflow=""; },

  renderSearch(){
    $("#search-root").innerHTML=`
    <div class="search-overlay" id="search-overlay">
      <div class="container" style="display:flex;flex-direction:column;align-items:center;height:100%">
        <div class="search-box">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input id="search-input" type="text" placeholder="Search products…" autocomplete="off">
          <button class="icon-btn" data-close-search aria-label="Close search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="search-results" id="search-results"></div>
        <div class="search-hint">Esc to close · Enter opens first result</div>
      </div>
    </div>`;
    const input=$("#search-input");
    input.addEventListener("input",()=>{
      const q=input.value.toLowerCase().trim();
      const res=q?ZEN_DATA.products.filter(p=>(p.name+p.cat+p.desc).toLowerCase().includes(q)).slice(0,7):[];
      $("#search-results").innerHTML=res.map(p=>`
        <a class="sr-item" href="product.html?id=${p.id}">
          <img src="${p.img}" alt="">
          <div><b>${p.name}</b><small>${p.cat} · ★ ${p.rating}</small></div>
          <span class="price">${fmt(p.price)}</span>
        </a>`).join("")||(q?`<div style="text-align:center;color:var(--mut);padding:30px 0">No matches for “${input.value}”</div>`:"");
    });
    input.addEventListener("keydown",e=>{
      if(e.key==="Enter"){ const first=$("#search-results .sr-item"); if(first) location.href=first.href; }
    });
  },
  openSearch(){ $("#search-overlay").classList.add("open"); document.body.style.overflow="hidden"; setTimeout(()=>$("#search-input").focus(),80); },
  closeSearch(){ $("#search-overlay").classList.remove("open"); document.body.style.overflow=""; },

  toast(msg, actionLabel, actionFn){
    let root=$("#toast-root");
    root.innerHTML=`<div class="toast" id="toast-el">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      <span>${msg}</span>${actionLabel?`<button id="toast-action">${actionLabel}</button>`:""}
    </div>`;
    const el=$("#toast-el");
    requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add("show")));
    if(actionLabel) $("#toast-action").onclick=()=>{ actionFn&&actionFn(); el.classList.remove("show"); };
    clearTimeout(this._tt);
    this._tt=setTimeout(()=>el.classList.remove("show"),3400);
  },

  initCursor(){
    if(matchMedia("(pointer:coarse)").matches) return;
    $("#cursor-root").innerHTML=`<div class="cursor-dot"></div><div class="cursor-ring"></div>`;
    const dot=$(".cursor-dot"),ring=$(".cursor-ring");
    let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;
    addEventListener("pointermove",e=>{x=e.clientX;y=e.clientY;dot.style.left=x+"px";dot.style.top=y+"px"});
    (function loop(){rx+=(x-rx)*.16;ry+=(y-ry)*.16;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(loop)})();
    addEventListener("pointerover",e=>{
      ring.classList.toggle("hot",!!e.target.closest("a,button,[data-tilt],input,select"));
    });
  }
};

document.addEventListener("click",e=>{
  const t=e.target;
  const add=t.closest("[data-add]");
  if(add){
    e.preventDefault();
    Cart.add(add.dataset.add,1);
    const p=zenProduct(add.dataset.add);
    UI.toast(`${p.name} added to bag`,"View bag",()=>UI.openDrawer("cart"));
    UI.openDrawer("cart");
    return;
  }
  const wish=t.closest("[data-wish]");
  if(wish){
    e.preventDefault();
    const on=Wish.toggle(wish.dataset.wish);
    wish.classList.toggle("on",on);
    const p=zenProduct(wish.dataset.wish);
    UI.refreshBadges();
    if(UI.drawerTab==="saved")UI.renderDrawerBody("saved");
    UI.toast(on?`${p.name} saved`:`${p.name} removed from saved`);
    return;
  }
  if(t.closest("[data-open-cart]")){ UI.openDrawer("cart"); return; }
  if(t.closest("#open-wish-btn")){ UI.openDrawer("saved"); return; }
  const dt=t.closest("[data-dtab]");
  if(dt){ UI.renderDrawerBody(dt.dataset.dtab); return; }
  const qinc=t.closest("[data-qinc]");
  if(qinc){ const id=qinc.dataset.qinc; Cart.setQty(id,Cart.read().find(i=>i.id===Number(id)).qty+1); UI.renderDrawerBody("cart"); return; }
  const qdec=t.closest("[data-qdec]");
  if(qdec){ const id=qdec.dataset.qdec; const cur=Cart.read().find(i=>i.id===Number(id)); Cart.setQty(id,cur.qty-1); UI.renderDrawerBody("cart"); return; }
  const rm=t.closest("[data-remove]");
  if(rm){ const row=rm.closest(".d-item"); row&&(row.style.cssText="transition:.35s;opacity:0;transform:translateX(30px)"); setTimeout(()=>{Cart.remove(rm.dataset.remove);UI.renderDrawerBody("cart")},280); return; }
  if(t.closest("[data-open-search]")){ UI.openSearch(); return; }
  if(t.closest("[data-close-search]")){ UI.closeSearch(); return; }
  if(t.closest("#search-overlay")&&!t.closest(".search-box,.search-results")){ UI.closeSearch(); return; }
  if(t.closest("[data-close-drawer]")){ UI.closeDrawer(); return; }
  if(t.closest("[data-open-menu]")){ $("#mobile-menu").classList.add("open"); return; }
  if(t.closest("[data-close-menu]")||t.closest("#mobile-menu a")){ $("#mobile-menu")?.classList.remove("open"); return; }
});

addEventListener("keydown",e=>{
  if(e.key==="/"&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){ e.preventDefault(); UI.openSearch(); }
  if(e.key==="Escape"){ UI.closeDrawer(); UI.closeSearch(); $("#mobile-menu")?.classList.remove("open"); }
});

const scrollFX=()=>{
  const h=$("#site-header");
  const prog=$("#progress");
  const onScroll=()=>{
    const st=scrollY;
    h?.classList.toggle("scrolled",st>40);
    if(prog){const max=document.documentElement.scrollHeight-innerHeight;prog.style.transform=`scaleX(${max?st/max:0})`}
    $$("[data-parallax]").forEach(el=>{
      const sp=parseFloat(el.dataset.parallax)||.1;
      el.style.translate=`0 ${st*sp}px`;
    });
  };
  addEventListener("scroll",onScroll,{passive:true});
  onScroll();
};

const initCounters=()=>{
  const run=el=>{
    const target=Number(el.dataset.count), dur=1800, t0=performance.now();
    const step=now=>{
      const p=Math.min(1,(now-t0)/dur), e=1-Math.pow(2,-10*p);
      el.textContent=Math.round(target*e).toLocaleString();
      if(p<1)requestAnimationFrame(step); else el.textContent=target.toLocaleString();
    };
    requestAnimationFrame(step);
  };
  $$("[data-count]").forEach(el=>{
    if(reduced){ el.textContent=Number(el.dataset.count).toLocaleString(); return; }
    if(hasMotion) Motion.inView(el,()=>run(el),{margin:"0px 0px -10% 0px"});
    else run(el);
  });
};

document.addEventListener("DOMContentLoaded",()=>{
  UI.renderHeader();
  UI.renderFooter();
  UI.renderDrawer();
  UI.renderSearch();
  UI.refreshBadges();
  UI.initCursor();
  scrollFX();
  initCounters();
  UI.observe();
});
