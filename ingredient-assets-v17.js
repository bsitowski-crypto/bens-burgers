(()=>{
const s=document.createElement('style');
s.id='ingredient-assets-v17';
s.textContent=`
/* Clean v17 ingredient assets: each food is its own tightly-cropped transparent PNG. */
.foodItem#bun,.foodItem#cheese,.rawbin,.rawBaconBin,.sauceItem{overflow:hidden!important}
.foodItem#bun:before,.foodItem#bun:after,.foodItem#cheese:before,.rawbin:before,.plateBun:before,.rawBaconVisual,.sauceBottle,.dualFood,#layers .layer{border:0!important;box-shadow:none!important;clip-path:none!important;background-color:transparent!important;background-repeat:no-repeat!important;background-position:center!important;background-size:contain!important}
.foodItem#bun:before{content:""!important;display:block!important;position:absolute!important;left:7%!important;right:7%!important;top:1%!important;height:50%!important;background-image:url('assets/top-bun.png')!important;transform:none!important}
.foodItem#bun:after{content:""!important;display:block!important;position:absolute!important;left:9%!important;right:9%!important;top:37%!important;height:39%!important;background-image:url('assets/bottom-bun.png')!important;transform:none!important}
.foodItem#cheese:before{content:""!important;display:block!important;position:absolute!important;left:6%!important;right:6%!important;top:3%!important;bottom:19%!important;background-image:url('assets/cheese.png')!important;transform:none!important}
.rawbin:before{content:""!important;display:block!important;position:absolute!important;left:6%!important;right:6%!important;top:3%!important;bottom:16%!important;background-image:url('assets/raw-patty.png')!important;transform:none!important}
.rawBaconVisual{display:block!important;width:88%!important;height:72%!important;background-image:url('assets/bacon-raw.png')!important;transform:none!important;filter:none!important}
.sauceBottle{display:block!important;position:absolute!important;left:5%!important;right:5%!important;top:3%!important;height:72%!important;background-image:url('assets/sauce-drizzle.png')!important;transform:none!important;filter:none!important}
.sauceBottle:before,.sauceBottle:after{content:none!important;display:none!important}
.dualPatty{left:5%!important;top:10%!important;width:39%!important;height:72%!important}
.dualPatty.raw{background-image:url('assets/raw-patty.png')!important;filter:none!important}
.dualPatty.cooking{background-image:url('assets/raw-patty.png')!important;filter:brightness(.72) saturate(1.25)!important}
.dualPatty.ready{background-image:url('assets/cooked-patty.png')!important;filter:drop-shadow(0 0 8px #78e35f)!important}
.dualPatty.burned{background-image:url('assets/cooked-patty.png')!important;filter:brightness(.28)!important}
.dualBacon{right:4%!important;top:18%!important;width:43%!important;height:62%!important;transform:none!important}
.dualBacon.raw{background-image:url('assets/bacon-raw.png')!important;filter:none!important}
.dualBacon.cooking{background-image:url('assets/bacon-raw.png')!important;filter:brightness(.74) saturate(1.3)!important}
.dualBacon.ready{background-image:url('assets/bacon-crispy.png')!important;filter:drop-shadow(0 0 8px #78e35f)!important}
.dualBacon.burned{background-image:url('assets/bacon-crispy.png')!important;filter:brightness(.25)!important}
.plateBun:before{content:""!important;display:block!important;position:absolute!important;left:50%!important;bottom:0!important;transform:translateX(-50%)!important;width:72%!important;height:74%!important;background-image:url('assets/bottom-bun.png')!important}
#layers .layer:before,#layers .layer:after{content:none!important;display:none!important}
#layers .patty{width:68%!important;height:25%!important;background-image:url('assets/cooked-patty.png')!important}
#layers .cheese{width:70%!important;height:20%!important;background-image:url('assets/cheese.png')!important}
#layers .sauce{width:59%!important;height:10%!important;background-image:url('assets/sauce-drizzle.png')!important;border-radius:0!important}
#layers .bacon{width:63%!important;height:14%!important;background-image:url('assets/bacon-crispy.png')!important;transform:translateX(-50%)!important}
#layers .topBun{width:70%!important;height:29%!important;background-image:url('assets/top-bun.png')!important}
.foodLabel,.meatBinLabel{z-index:30!important}
`;
document.head.appendChild(s);
})();