(()=>{
const s=document.createElement('style');
s.textContent=`
/* v15: show the useful center region of the ingredient sprite-sheet crops */
.foodItem#bun:before{
  inset:0!important;
  background-image:url('assets/buns-stock.png')!important;
  background-size:300% 100%!important;
  background-position:100% center!important;
  background-repeat:no-repeat!important;
}
.foodItem#cheese:before{
  inset:0!important;
  background-image:url('assets/cheese-stock.png')!important;
  background-size:200% 100%!important;
  background-position:0 center!important;
  background-repeat:no-repeat!important;
}
.rawbin:before{
  inset:0 0 15%!important;
  background-image:url('assets/raw-patty.png')!important;
  background-size:cover!important;
  background-position:center!important;
  background-repeat:no-repeat!important;
}
.dualPatty{left:4%!important;top:8%!important;width:40%!important;height:78%!important;background-size:contain!important;background-position:center!important}
.plateBun:before{width:78%!important;height:78%!important;background-size:contain!important;background-position:center bottom!important}
#layers .patty,#layers .cheese,#layers .topBun{background-size:contain!important;background-position:center bottom!important}
.foodLabel{background:#f7f7f2e8!important;padding:0 5px!important;border-radius:5px!important}
`;
document.head.appendChild(s);
})();