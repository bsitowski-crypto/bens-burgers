(()=>{
const s=document.createElement('style');
s.textContent=`
/* v16: use individual ingredient PNGs directly — no sprite-sheet cropping */
.foodItem#bun:before,.foodItem#bun:after,.foodItem#cheese:before{
  content:""!important;
  display:block!important;
  position:absolute!important;
  border:0!important;
  box-shadow:none!important;
  transform:none!important;
  clip-path:none!important;
  background-color:transparent!important;
  background-repeat:no-repeat!important;
  background-position:center!important;
  background-size:contain!important;
}
/* Show a real top and bottom bun together in the BUNS bin */
.foodItem#bun:before{
  left:8%!important;right:8%!important;top:2%!important;height:52%!important;
  background-image:url('assets/top-bun.png')!important;
}
.foodItem#bun:after{
  left:12%!important;right:12%!important;top:38%!important;height:38%!important;
  background-image:url('assets/bottom-bun.png')!important;
}
.foodItem#cheese:before{
  left:8%!important;right:8%!important;top:4%!important;bottom:20%!important;
  background-image:url('assets/cheese.png')!important;
}
/* Raw patty: fit the whole transparent PNG instead of cropping it */
.rawbin:before{
  content:""!important;display:block!important;position:absolute!important;
  left:6%!important;right:6%!important;top:3%!important;bottom:16%!important;
  background:transparent url('assets/raw-patty.png') center/contain no-repeat!important;
  border:0!important;box-shadow:none!important;transform:none!important;border-radius:0!important;
}
/* Grill states also use complete individual PNGs */
.dualPatty{left:5%!important;top:10%!important;width:39%!important;height:72%!important;background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important}
.dualPatty.raw{background-image:url('assets/raw-patty.png')!important}
.dualPatty.cooking{background-image:url('assets/cooking-patty.png')!important}
.dualPatty.ready{background-image:url('assets/cooked-patty.png')!important}
.dualPatty.burned{background-image:url('assets/burned-patty.png')!important}
/* Assembly uses the individual files at natural proportions */
.plateBun:before{
  content:""!important;display:block!important;position:absolute!important;
  left:50%!important;bottom:0!important;transform:translateX(-50%)!important;
  width:66%!important;height:70%!important;
  background:transparent url('assets/bottom-bun.png') center bottom/contain no-repeat!important;
  border:0!important;box-shadow:none!important;border-radius:0!important;
}
#layers .patty{width:64%!important;height:23%!important;background:transparent url('assets/cooked-patty.png') center bottom/contain no-repeat!important}
#layers .cheese{width:66%!important;height:18%!important;background:transparent url('assets/cheese.png') center bottom/contain no-repeat!important;clip-path:none!important}
#layers .topBun{width:66%!important;height:26%!important;background:transparent url('assets/top-bun.png') center bottom/contain no-repeat!important}
/* Labels stay readable without covering the food */
.foodLabel{z-index:30!important;background:#f7f7f2e8!important;padding:0 5px!important;border-radius:5px!important;bottom:2%!important}
`;
document.head.appendChild(s);
})();