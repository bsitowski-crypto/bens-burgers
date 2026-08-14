(()=>{
const s=document.createElement('style');
s.id='ingredient-assets-v17';
s.textContent=`
/* v18: make the actual transparent food sprites large, centered, and unobstructed. */
.foodItem#bun,.foodItem#cheese,.rawbin,.rawBaconBin,.sauceItem{overflow:visible!important;position:relative!important}
.foodItem#bun:before,.foodItem#bun:after,.foodItem#cheese:before,.rawbin:before,.plateBun:before,.rawBaconVisual,.sauceBottle,.dualFood,#layers .layer{border:0!important;box-shadow:none!important;clip-path:none!important;background-color:transparent!important;background-repeat:no-repeat!important;background-position:center!important;background-size:contain!important}
.foodItem#bun:before{content:""!important;display:block!important;position:absolute!important;left:18%!important;right:18%!important;top:2%!important;height:45%!important;background-image:url('assets/top-bun.png?v=18')!important}
.foodItem#bun:after{content:""!important;display:block!important;position:absolute!important;left:18%!important;right:18%!important;top:32%!important;height:42%!important;background-image:url('assets/bottom-bun.png?v=18')!important}
.foodItem#cheese:before{content:""!important;display:block!important;position:absolute!important;left:20%!important;right:20%!important;top:5%!important;height:62%!important;background-image:url('assets/cheese.png?v=18')!important}
.rawbin:before{content:""!important;display:block!important;position:absolute!important;left:16%!important;right:16%!important;top:4%!important;height:68%!important;background-image:url('assets/raw-patty.png?v=18')!important}
.rawBaconVisual{display:block!important;width:74%!important;height:62%!important;margin:auto!important;background-image:url('assets/bacon-raw.png?v=18')!important;filter:none!important}
.sauceBottle{display:block!important;position:absolute!important;left:15%!important;right:15%!important;top:3%!important;height:68%!important;background-image:url('assets/sauce-drizzle.png?v=18')!important;filter:none!important}
.sauceBottle:before,.sauceBottle:after{content:none!important;display:none!important}
.dualPatty{left:8%!important;top:13%!important;width:36%!important;height:64%!important}.dualPatty.raw{background-image:url('assets/raw-patty.png?v=18')!important}.dualPatty.cooking{background-image:url('assets/raw-patty.png?v=18')!important;filter:brightness(.72) saturate(1.25)!important}.dualPatty.ready{background-image:url('assets/cooked-patty.png?v=18')!important}.dualPatty.burned{background-image:url('assets/cooked-patty.png?v=18')!important;filter:brightness(.28)!important}
.dualBacon{right:7%!important;top:17%!important;width:38%!important;height:58%!important}.dualBacon.raw,.dualBacon.cooking{background-image:url('assets/bacon-raw.png?v=18')!important}.dualBacon.ready,.dualBacon.burned{background-image:url('assets/bacon-crispy.png?v=18')!important}
.plateBun:before{content:""!important;display:block!important;position:absolute!important;left:50%!important;bottom:0!important;transform:translateX(-50%)!important;width:82%!important;height:82%!important;background-image:url('assets/bottom-bun.png?v=18')!important}
#layers .layer:before,#layers .layer:after{content:none!important;display:none!important}
#layers .patty{width:72%!important;height:26%!important;background-image:url('assets/cooked-patty.png?v=18')!important}#layers .cheese{width:73%!important;height:21%!important;background-image:url('assets/cheese.png?v=18')!important}#layers .sauce{width:62%!important;height:11%!important;background-image:url('assets/sauce-drizzle.png?v=18')!important}#layers .bacon{width:67%!important;height:16%!important;background-image:url('assets/bacon-crispy.png?v=18')!important;transform:translateX(-50%)!important}#layers .topBun{width:74%!important;height:30%!important;background-image:url('assets/top-bun.png?v=18')!important}
.foodLabel,.meatBinLabel{z-index:30!important;pointer-events:none!important}
`;
document.head.appendChild(s);
})();