(()=>{
const s=document.createElement('style');
s.textContent=`
/* v17: clean tightly-framed game sprites */
.foodItem#bun:before,.foodItem#bun:after,.foodItem#cheese:before,.rawbin:before,.plateBun:before{content:""!important;display:block!important;position:absolute!important;border:0!important;box-shadow:none!important;transform:none!important;clip-path:none!important;background-color:transparent!important;background-repeat:no-repeat!important;background-position:center!important;background-size:contain!important}
.foodItem#bun:before{left:6%!important;right:6%!important;top:0!important;height:49%!important;background-image:url('assets/game/top-bun.svg')!important}
.foodItem#bun:after{left:9%!important;right:9%!important;top:34%!important;height:42%!important;background-image:url('assets/game/bottom-bun.svg')!important}
.foodItem#cheese:before{left:5%!important;right:5%!important;top:3%!important;bottom:19%!important;background-image:url('assets/game/cheese.svg')!important}
.rawbin:before{left:5%!important;right:5%!important;top:2%!important;bottom:15%!important;background-image:url('assets/game/patty-raw.svg')!important}
.rawBaconVisual{width:90%!important;height:72%!important;background:transparent url('assets/game/bacon-raw.svg') center/contain no-repeat!important;border:0!important;box-shadow:none!important;transform:none!important}
.sauceBottle{left:5%!important;right:5%!important;top:2%!important;height:72%!important;background:transparent url('assets/game/sauce.svg') center/contain no-repeat!important;border:0!important;box-shadow:none!important;transform:none!important}
.dualFood{background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important;border:0!important;box-shadow:none!important}
.dualPatty{left:5%!important;top:10%!important;width:39%!important;height:72%!important}.dualPatty.raw{background-image:url('assets/game/patty-raw.svg')!important}.dualPatty.cooking{background-image:url('assets/game/patty-cooking.svg')!important}.dualPatty.ready{background-image:url('assets/game/patty-cooked.svg')!important}.dualPatty.burned{background-image:url('assets/game/patty-burned.svg')!important}
.dualBacon{right:4%!important;top:18%!important;width:44%!important;height:64%!important}.dualBacon.raw{background:transparent url('assets/game/bacon-raw.svg') center/contain no-repeat!important}.dualBacon.cooking{background:transparent url('assets/game/bacon-cooking.svg') center/contain no-repeat!important}.dualBacon.ready{background:transparent url('assets/game/bacon-crispy.svg') center/contain no-repeat!important}.dualBacon.burned{background:transparent url('assets/game/bacon-crispy.svg') center/contain no-repeat!important;filter:brightness(.28)!important}
.plateBun:before{left:50%!important;bottom:0!important;transform:translateX(-50%)!important;width:70%!important;height:72%!important;background-image:url('assets/game/bottom-bun.svg')!important;background-position:center bottom!important}
#layers .layer{background-color:transparent!important;background-repeat:no-repeat!important;background-position:center bottom!important;background-size:contain!important;border:0!important;box-shadow:none!important;clip-path:none!important}
#layers .patty{width:66%!important;height:24%!important;background-image:url('assets/game/patty-cooked.svg')!important}
#layers .cheese{width:68%!important;height:19%!important;background-image:url('assets/game/cheese.svg')!important}
#layers .sauce{width:58%!important;height:9%!important;background-image:url('assets/game/sauce-drizzle.svg')!important}
#layers .bacon{width:62%!important;height:12%!important;background-image:url('assets/game/bacon-crispy.svg')!important;transform:translateX(-50%)!important}
#layers .topBun{width:70%!important;height:29%!important;background-image:url('assets/game/top-bun.svg')!important}
.foodLabel{z-index:30!important;background:#f7f7f2e8!important;padding:0 5px!important;border-radius:5px!important;bottom:2%!important}
`;
document.head.appendChild(s);
})();