const params=new URLSearchParams(location.search);
let cat=params.get("cat")||"All";
let q=(params.get("q")||"").toLowerCase();
let sort="featured";

const chipsBox=$("#cat-chips");
chipsBox.innerHTML=ZEN_DATA.cats.map(c=>`<button class="chip ${c===cat?"on":""}" data-cat="${c}">${c}</button>`).join("");

const qInput=$("#shop-q");
qInput.value=q;

function currentList(){
  let list=ZEN_DATA.products.filter(p=>(cat==="All"||p.cat===cat)&&(!q||(p.name+p.cat+p.desc).toLowerCase().includes(q)));
  if(sort==="price-asc")list=[...list].sort((a,b)=>a.price-b.price);
  if(sort==="price-desc")list=[...list].sort((a,b)=>b.price-a.price);
  if(sort==="rating")list=[...list].sort((a,b)=>b.rating-a.rating||b.reviews-a.reviews);
  if(sort==="featured")list=[...list].sort((a,b)=>(b.badge?1:0)-(a.badge?1:0));
  return list;
}

function render(){
  const list=currentList();
  $("#results-meta").textContent=`${list.length} product${list.length===1?"":"s"}${cat!=="All"?` in ${cat}`:""}${q?` matching “${qInput.value}”`:""}`;
  const grid=$("#shop-grid");
  grid.innerHTML=list.length?list.map(p=>UI.card(p)).join(""):`<div class="empty" style="grid-column:1/-1">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
    <b>No products found</b><span>Try a different search or category.</span>
    <button class="btn btn-dark sm" id="reset-filters">Reset filters</button></div>`;
  UI.observe(grid);
}

document.addEventListener("click",e=>{
  const chip=e.target.closest("[data-cat]");
  if(chip){
    cat=chip.dataset.cat;
    $$("[data-cat]").forEach(c=>c.classList.toggle("on",c.dataset.cat===cat));
    const url=new URL(location);url.searchParams.set("cat",cat==="All"?"":cat);history.replaceState(null,"",url);
    render();
  }
  if(e.target.id==="reset-filters"){cat="All";q="";qInput.value="";$$("[data-cat]").forEach(c=>c.classList.toggle("on",c.dataset.cat==="All"));render();}
});

qInput.addEventListener("input",()=>{q=qInput.value.toLowerCase().trim();render()});
$("#shop-sort").addEventListener("change",e=>{sort=e.target.value;render()});

document.addEventListener("DOMContentLoaded",render);
