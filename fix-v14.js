(()=>{
const s=document.createElement('style');
s.textContent=`
/* v20: authoritative ingredient/assembly rendering */
.foodItem#bun,.foodItem#cheese,.sauceItem,.rawbin,.rawBaconBin{overflow:hidden!important}
.foodItem#bun:before,.foodItem#bun:after,.foodItem#cheese:before,.rawbin:before,.plateBun:before{content:""!important;display:block!important;position:absolute!important;border:0!important;box-shadow:none!important;clip-path:none!important;background-color:transparent!important;background-repeat:no-repeat!important;background-position:center!important;background-size:contain!important}
.foodItem#bun:before{left:10%!important;right:10%!important;top:2%!important;height:46%!important;background-image:url('assets/game/top-bun.svg')!important}
.foodItem#bun:after{left:14%!important;right:14%!important;top:37%!important;height:34%!important;background-image:url('assets/game/bottom-bun.svg')!important}
.foodItem#cheese:before{left:9%!important;right:9%!important;top:5%!important;bottom:21%!important;background-image:url('assets/game/cheese.svg')!important}
.rawbin:before{left:10%!important;right:10%!important;top:5%!important;bottom:19%!important;background-image:url('assets/game/patty-raw.svg')!important}
.rawBaconVisual{width:82%!important;height:64%!important;background:transparent url('assets/game/bacon-raw.svg') center/contain no-repeat!important;border:0!important;box-shadow:none!important;transform:none!important;filter:none!important}
.sauceBottle{left:9%!important;right:9%!important;top:5%!important;height:67%!important;background:transparent url('assets/game/sauce.svg') center/contain no-repeat!important;border:0!important;box-shadow:none!important;transform:none!important}
.dualFood{background-color:transparent!important;background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important;border:0!important;box-shadow:none!important}
.dualPatty{left:6%!important;top:12%!important;width:38%!important;height:68%!important}.dualPatty.raw{background-image:url('assets/game/patty-raw.svg')!important}.dualPatty.cooking{background-image:url('assets/game/patty-cooking.svg')!important}.dualPatty.ready{background-image:url('assets/game/patty-cooked.svg')!important}.dualPatty.burned{background-image:url('assets/game/patty-burned.svg')!important}
.dualBacon{right:5%!important;top:18%!important;width:42%!important;height:58%!important}.dualBacon.raw{background:transparent url('assets/game/bacon-raw.svg') center/contain no-repeat!important}.dualBacon.cooking{background:transparent url('assets/game/bacon-cooking.svg') center/contain no-repeat!important}.dualBacon.ready{background:transparent url('assets/game/bacon-crispy.svg') center/contain no-repeat!important}.dualBacon.burned{background:transparent url('assets/game/bacon-crispy.svg') center/contain no-repeat!important;filter:brightness(.28)!important}
/* Kill every old visual on the bottom-bun button, then center one clean sprite. */
.plateBun{position:absolute!important;left:50%!important;right:auto!important;bottom:6%!important;width:48%!important;height:20%!important;transform:translateX(-50%)!important;background:none!important;background-image:none!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;overflow:visible!important}
.plateBun:after{content:none!important;display:none!important}
.plateBun:before{left:0!important;right:0!important;top:0!important;bottom:0!important;width:100%!important;height:100%!important;transform:none!important;background:transparent url('assets/game/bottom-bun.svg') center/contain no-repeat!important}
/* Layer stack sits immediately on that bottom bun, centered over plate. */
#layers{position:absolute!important;left:18%!important;right:18%!important;bottom:11%!important;height:38%!important;pointer-events:none!important;overflow:visible!important}
#layers .layer{left:50%!important;transform:translateX(-50%)!important;background-color:transparent!important;background-repeat:no-repeat!important;background-position:center bottom!important;background-size:contain!important;border:0!important;box-shadow:none!important;clip-path:none!important;margin:0!important}
#layers .layer:before,#layers .layer:after{content:none!important;display:none!important}
#layers .patty{width:76%!important;height:31%!important;background-image:url('assets/game/patty-cooked.svg')!important}
#layers .cheese{width:80%!important;height:24%!important;background-image:url('assets/game/cheese.svg')!important}
#layers .sauce{width:68%!important;height:13%!important;background-image:url('assets/game/sauce-drizzle.svg')!important}
#layers .bacon{width:73%!important;height:18%!important;background-image:url('assets/game/bacon-crispy.svg')!important;transform:translateX(-50%)!important}
#layers .topBun{width:82%!important;height:38%!important;background-image:url('assets/game/top-bun.svg')!important}
.foodLabel,.meatBinLabel{z-index:30!important;background:#f7f7f2e8!important;padding:0 5px!important;border-radius:5px!important}
`;
document.head.appendChild(s);
})();