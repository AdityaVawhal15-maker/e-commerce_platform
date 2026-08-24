let promo=JSON.parse(localStorage.getItem("zen_promo")||"null");
const PROMOS={NOVA10:.1};

function totals(){
  const sub=Cart.subtotal();
  const disc=promo?sub*promo.pct:0;
  const ship=sub-disc>=150||sub===0?0:12;
  return{sub,disc,ship,total:sub-disc+ship};
}

function renderCart(){
  const items=Cart.read();
  $("#d-count")&&($("#d-count").textContent=Cart.count());
  const wrap=$("#cart-list");
  if(!items.length){
    wrap.innerHTML=`<div class="empty" style="min-height:300px">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M6 7h12l1 14H5L6 7z"/><path d="M9 7a3 3 0 016 0"/></svg>
      <b>Your bag is empty</b><span>Once you add something, it'll show up here.</span>
      <a href="shop.html" class="btn btn-dark magnetic">Go shopping</a></div>`;
  } else {
    wrap.innerHTML=items.map(i=>{const p=zenProduct(i.id);return p?`
    <div class="d-item" data-item="${p.id}" style="padding:18px;border-radius:22px">
      <img src="${p.img}" alt="${p.name}" style="width:110px;height:110px">
      <div class="d-info">
        <b>${p.name}</b>
        <small style="color:var(--mut);font-size:.78rem">${p.cat} · In stock</small>
        <span class="price">${fmt(p.price)}</span>
        <div class="qty">
          <button data-qdec="${p.id}">−</button><b>${i.qty}</b><button data-qinc="${p.id}">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px">
        <button class="d-x" data-remove="${p.id}" aria-label="Remove item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <b class="price">${fmt(p.price*i.qty)}</b>
      </div>
    </div>`:""}).join("");
  }
  const t=totals();
  $("#sum-sub").textContent=fmt(t.sub);
  $("#sum-ship").innerHTML=t.ship===0?`<span class="free">${t.sub?"Free":"—"}</span>`:fmt(t.ship);
  $("#sum-total").textContent=fmt(t.total);
  $("#sum-disc-row").style.display=promo?"flex":"none";
  $("#sum-disc").textContent=`−${fmt(t.disc)}`;
  $("#promo-label").textContent=promo?`Code ${promo.code} applied ✓`:"";
}

document.addEventListener("click",e=>{
  const qinc=e.target.closest("[data-qinc]");
  if(qinc){const id=qinc.dataset.qinc;Cart.setQty(id,Cart.read().find(i=>i.id===Number(id)).qty+1);renderCart();return}
  const qdec=e.target.closest("[data-qdec]");
  if(qdec){const id=qdec.dataset.qdec;Cart.setQty(id,Cart.read().find(i=>i.id===Number(id)).qty-1);renderCart();return}
  const rm=e.target.closest("[data-remove]");
  if(rm){
    const row=rm.closest(".d-item");
    row&&(row.style.cssText="transition:.35s var(--ease);opacity:0;transform:translateX(40px)");
    setTimeout(()=>{Cart.remove(rm.dataset.remove);renderCart()},300);
    return;
  }
  if(e.target.id==="apply-promo"){
    const code=$("#promo-input").value.trim().toUpperCase();
    if(PROMOS[code]){promo={code,pct:PROMOS[code]};localStorage.setItem("zen_promo",JSON.stringify(promo));UI.toast(`Code ${code} applied — ${PROMOS[code]*100}% off`)}
    else UI.toast("Invalid promo code","Try NOVA10");
    renderCart();
    return;
  }
  if(e.target.id==="checkout-btn"){
    const btn=e.target;
    btn.textContent="Processing…";btn.style.pointerEvents="none";
    setTimeout(()=>{
      $(".summary").style.display="none";
      $("#checkout-form").style.display="none";
      $("#cart-list").style.display="none";
      $("#page-title").textContent="Order confirmed";
      $("#order-num").textContent=String(Math.floor(100000+Math.random()*900000));
      Cart.clear();localStorage.removeItem("zen_promo");
      const sv=$("#success-view");sv.classList.add("show");
      document.dispatchEvent(new CustomEvent("cart:change"));
      if(hasMotion&&!reduced){
        Motion.animate(".ok-ring",{scale:[0,1],rotate:[-30,0]},{duration:.7,easing:EASE});
        Motion.animate("#success-view > *",{opacity:[0,1],transform:["translateY(20px)","translateY(0px)"]},{duration:.6,easing:EASE,delay:Motion.stagger(.09,.15)});
      }
    },1400);
  }
});

$("#checkout-form").addEventListener("submit",e=>e.preventDefault());
document.addEventListener("DOMContentLoaded",()=>{
  document.body.dataset.page="shop";
  renderCart();
  UI.observe();
});
