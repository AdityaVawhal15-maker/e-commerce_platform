const params=new URLSearchParams(location.search);
const id=Number(params.get("id"));
const p=zenProduct(id);

function initPDP(){
  if(!p){location.replace("shop.html");return}
  let color=p.colors[0];
  let qty=1;

  document.title=`${p.name} — ZENITH`;
  $("#crumbs-name").textContent=p.name;
  $("#crumbs-name").href=`shop.html?cat=${encodeURIComponent(p.cat)}`;
  $("#pdp").innerHTML=`
    <div class="p-gallery" data-reveal>
      <div class="p-main" id="p-main">
        ${UI.badgeText(p)}
        <img src="${p.img}" alt="${p.name}" id="main-img">
      </div>
      <div class="p-thumbs" id="p-thumbs">
        <button class="on" data-img="${p.img}"><img src="${p.img}" alt=""></button>
        <button data-img="${p.imgAlt}"><img src="${p.imgAlt}" alt=""></button>
        <button data-img="${ZEN_DATA.products[id%ZEN_DATA.products.length].img}"><img src="${ZEN_DATA.products[id%ZEN_DATA.products.length].img}" alt=""></button>
      </div>
    </div>
    <div class="pdp-info">
      <span class="eyebrow">${p.cat}</span>
      <h1>${p.name}</h1>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;font-size:.9rem;color:var(--mut)">
        ${UI.stars(p.rating)} <b style="color:var(--ink)">${p.rating}</b> · ${p.reviews.toLocaleString()} reviews
      </div>
      <div class="price pdp-price">${fmt(p.price)}${p.old?`<s style="font-size:1.1rem">${fmt(p.old)}</s>`:""}</div>
      <p class="pdp-desc">${p.desc}</p>
      <span class="opt-label">Color — <b id="color-name" style="color:var(--ink)">${color}</b></span>
      <div class="swatches">
        ${p.colors.map(c=>`<button class="swatch ${c===color?"on":""}" data-color="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")}
      </div>
      <div class="buy-row">
        <div class="qty">
          <button id="q-dec" aria-label="Decrease quantity">−</button><b id="q-val">1</b><button id="q-inc" aria-label="Increase quantity">+</button>
        </div>
        <button class="btn btn-acc magnetic" id="add-main">
          Add to bag · <span id="add-price">${fmt(p.price)}</span>
        </button>
        <button class="icon-btn" id="wish-main" aria-label="Save to wishlist" style="border:1.5px solid var(--line);border-radius:50%">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="${Wish.has(p.id)?"var(--acc)":"none"}" stroke="${Wish.has(p.id)?"var(--acc)":"currentColor"}" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.7 0L12 5.6l-1.1-1a5.5 5.5 0 10-7.8 7.8l1.1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>
        </button>
      </div>
      <div class="meta-list">
        <div class="acc open">
          <button class="acc-head">What's included
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <div class="acc-body"><ul>${p.features.map(f=>`<li>${f}</li>`).join("")}</ul></div>
        </div>
        <div class="acc">
          <button class="acc-head">Shipping &amp; delivery
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <div class="acc-body"><ul>
            <li>Free carbon-neutral shipping on orders over $150</li>
            <li>Standard delivery 2–4 business days</li>
            <li>Express next-day available at checkout</li>
          </ul></div>
        </div>
        <div class="acc">
          <button class="acc-head">Returns &amp; warranty
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <div class="acc-body"><ul>
            <li>30-day free returns, no questions asked</li>
            <li>2-year Zenith warranty included</li>
            <li>Lifetime support from real humans</li>
          </ul></div>
        </div>
      </div>
    </div>`;

  $("#related-wrap").innerHTML=`<div class="container">
    <div class="sec-head" data-reveal>
      <div><span class="eyebrow">Keep looking</span><h2 style="margin-top:12px">You may also love</h2></div>
    </div>
    <div class="grid-products" id="related-grid"></div>
  </div>`;
  const rel=ZEN_DATA.products.filter(x=>x.cat===p.cat&&x.id!==p.id).concat(ZEN_DATA.products.filter(x=>x.cat!==p.cat)).slice(0,4);
  $("#related-grid").innerHTML=rel.map(x=>UI.card(x)).join("");

  document.addEventListener("click",e=>{
    const th=e.target.closest("[data-img]");
    if(th){
      $$("#p-thumbs button").forEach(b=>b.classList.remove("on"));th.classList.add("on");
      const img=$("#main-img");img.style.opacity=0;
      setTimeout(()=>{img.src=th.dataset.img;img.style.transition="opacity .45s";img.style.opacity=1},180);
    }
    const sw=e.target.closest("[data-color]");
    if(sw){
      $$(".swatch").forEach(s=>s.classList.remove("on"));sw.classList.add("on");
      color=sw.dataset.color;
      $("#color-name").textContent=color;
    }
    if(e.target.id==="q-inc"){qty++;$("#q-val").textContent=qty;$("#add-price").textContent=fmt(p.price*qty);}
    if(e.target.id==="q-dec"&&qty>1){qty--;$("#q-val").textContent=qty;$("#add-price").textContent=fmt(p.price*qty);}
    if(e.target.closest("#add-main")){
      Cart.add(p.id,qty);
      UI.toast(`${p.name} ×${qty} added to bag`,"View bag",()=>UI.openDrawer("cart"));
      UI.openDrawer("cart");
    }
    if(e.target.closest("#wish-main")){
      const on=Wish.toggle(p.id);
      const svg=$("#wish-main svg");
      svg.setAttribute("fill",on?"var(--acc)":"none");
      svg.setAttribute("stroke",on?"var(--acc)":"currentColor");
      UI.refreshBadges();
      UI.toast(on?"Saved to wishlist":"Removed from wishlist");
    }
    const head=e.target.closest(".acc-head");
    if(head){
      const acc=head.parentElement,body=acc.querySelector(".acc-body");
      const open=acc.classList.toggle("open");
      body.style.maxHeight=open?body.scrollHeight+"px":"0px";
    }
  });

  document.addEventListener("DOMContentLoaded",()=>{
    document.body.dataset.page="product";
    const first=$(".acc.open .acc-body");
    first&&(first.style.maxHeight=first.scrollHeight+"px");
    UI.observe();
  });
}

initPDP();
