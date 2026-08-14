(()=>{
const s=document.createElement('style');
s.textContent=`
/* v18: authoritative sprite rendering. Override every legacy pseudo/background rule. */
.foodItem#bun,.foodItem#cheese,.sauceItem,.rawbin,.rawBaconBin{overflow:hidden!important}
.foodItem#bun:before,.foodItem#bun:after,.foodItem#cheese:before,.rawbin:before,.plateBun:before{content:""!important;display:block!important;position:absolute!important;border:0!important;box-shadow:none!important;clip-path:none!important;background-color:transparent!important;background-repeat:no-repeat!important;background-position:center!important;background-size:contain!important}
.foodItem#bun:before{left:14%!important;right:14%!important;top:5%!important;height:42%!important;background-image:url('assets/game/top-bun.svg')!important}
.foodItem#bun:after{content:""!important;display:block!important;left:18%!important;right:18%!important;top:37%!important;height:30%!important;background-image:url('assets/game/bottom-bun.svg')!important}
.foodItem#cheese:before{left:14%!important;right:14%!important;top:8%!important;bottom:25%!important;background-image:url('assets/game/cheese.svg')!important}
.rawbin:before{left:13%!important;right:13%!important;top:7%!important;bottom:22%!important;background-image:url('assets/game/patty-raw.svg')!important}
.rawBaconVisual{width:78%!important;height:60%!important;background:transparent url('assets/game/bacon-raw.svg') center/contain no-repeat!important;border:0!important;box-shadow:none!important;transform:none!important;filter:none!important}
.sauceBottle{left:12%!important;right:12%!important;top:8%!important;height:62%!important;background:transparent url('assets/game/sauce.svg') center/contain no-repeat!important;border:0!important;box-shadow:none!important;transform:none!important}
.dualFood{background-color:transparent!important;background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important;border:0!important;box-shadow:none!important}
.dualPatty{left:6%!important;top:14%!important;width:37%!important;height:66%!important}.dualPatty.raw{background-image:url('assets/game/patty-raw.svg')!important}.dualPatty.cooking{background-image:url('assets/game/patty-cooking.svg')!important}.dualPatty.ready{background-image:url('assets/game/patty-cooked.svg')!important}.dualPatty.burned{background-image:url('assets/game/patty-burned.svg')!important}
.dualBacon{right:5%!important;top:20%!important;width:42%!important;height:56%!important}.dualBacon.raw{background:transparent url('assets/game/bacon-raw.svg') center/contain no-repeat!important}.dualBacon.cooking{background:transparent url('assets/game/bacon-cooking.svg') center/contain no-repeat!important}.dualBacon.ready{background:transparent url('assets/game/bacon-crispy.svg') center/contain no-repeat!important}.dualBacon.burned{background:transparent url('assets/game/bacon-crispy.svg') center/contain no-repeat!important;filter:brightness(.28)!important}
/* Burger assembly: smaller, centered stack directly over the plate. */
.plateBun{width:72%!important;height:34%!important;bottom:4%!important;left:14%!important}
.plateBun:before{left:50%!important;bottom:0!important;transform:translateX(-50%)!important;width:56%!important;height:60%!important;background-image:url('assets/game/bottom-bun.svg')!important;background-position:center bottom!important}
#layers{position:absolute!important;left:0!important;right:0!important;bottom:10%!important;height:42%!important;pointer-events:none!important}
#layers .layer{left:50%!important;transform:translateX(-50%)!important;background-color:transparent!important;background-repeat:no-repeat!important;background-position:center bottom!important;background-size:contain!important;border:0!important;box-shadow:none!important;clip-path:none!important}
#layers .layer:before,#layers .layer:after{content:none!important;display:none!important}
#layers .patty{width:43%!important;height:18%!important;background-image:url('assets/game/patty-cooked.svg')!important}
#layers .cheese{width:45%!important;height:14%!important;background-image:url('assets/game/cheese.svg')!important}
#layers .sauce{width:38%!important;height:8%!important;background-image:url('assets/game/sauce-drizzle.svg')!important}
#layers .bacon{width:42%!important;height:11%!important;background-image:url('assets/game/bacon-crispy.svg')!important;transform:translateX(-50%)!important}
#layers .topBun{width:46%!important;height:22%!important;background-image:url('assets/game/top-bun.svg')!important}
.foodLabel,.meatBinLabel{z-index:30!important;background:#f7f7f2e8!important;padding:0 5px!important;border-radius:5px!important}
`;
document.head.appendChild(s);
})();