const $=id=>document.getElementById(id);
let money=0,score=0,served=0,patience=100,order='cheese',selectedType=null,cookedSelectedType=null,grillItem=null,grillStage='empty',built=['bottomBun'],timer,gt;
const names=['Lou','Maya','Eddie','Tina','Sam','Nora','Gus','Penny'];
const people=['🧑','👩','🧔','👩‍🦱','👨','👩‍🦰','🧑‍🦱','👨‍🦱'];

// Remove the old prep-shelf bacon button if a cached version created it.
const oldBacon=$('bacon'); if(oldBacon) oldBacon.remove();

// Add raw bacon beside the raw patties on the grill station.
const grillStation=document.querySelector('.station');
if(grillStation&&!$('rawBacon')){
  const b=document.createElement('button');
  b.id='rawBacon'; b.className='rawBaconBin'; b.setAttribute('aria-label','Raw bacon');
  b.innerHTML='<span class="rawBaconVisual"></span><span class="meatBinLabel">BACON</span>';
  grillStation.appendChild(b);
  const pLabel=document.createElement('span');
  pLabel.className='meatBinLabel pattyLabel'; pLabel.textContent='PATTY';
  $('raw').appendChild(pLabel);
}

const realism=document.createElement('style');
realism.textContent=`
/* --- realistic food pass --- */
.rawbin{left:4%!important;width:38%!important;height:20%!important;bottom:4%!important;overflow:hidden!important}
.rawBaconBin{position:absolute;right:4%;bottom:4%;width:38%;height:20%;background:linear-gradient(#e8e9e6,#c9cbc7);border:3px solid #777;border-radius:7px;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer;box-shadow:inset 0 4px 8px #fff8,0 4px 7px #0005}
.rawBaconBin.selected,.rawbin.selected{outline:4px solid #f1ca51;box-shadow:0 0 14px #f1ca5188,inset 0 4px 8px #fff8}
.meatBinLabel{position:absolute;left:0;right:0;bottom:2px;text-align:center;font-size:clamp(8px,.9vw,12px);font-weight:950;color:#363636;letter-spacing:.05em;z-index:5}
.pattyLabel{pointer-events:none}
.rawbin:before{content:"";display:block;width:54%;height:68%;border-radius:49% 49% 46% 46%;background:
 radial-gradient(circle at 32% 28%,#ff9c9488 0 3%,transparent 4%),
 radial-gradient(circle at 66% 62%,#8e2e2b66 0 4%,transparent 5%),
 repeating-radial-gradient(ellipse at 50% 50%,#df6b66 0 3px,#c84f4b 4px 7px,#b74340 8px 10px);
 border:2px solid #8b3534;box-shadow:inset 0 5px 8px #fff3,inset 0 -6px 9px #6406,0 5px 7px #0006}
.rawBaconVisual{width:68%;height:44%;position:relative;display:block;transform:rotate(-4deg);border-radius:13px 7px 12px 6px;background:
 repeating-linear-gradient(92deg,#8b211d 0 8%,#d64b35 9% 18%,#f0a07b 19% 24%,#b72d25 25% 36%,#f3b18f 37% 42%,#8b211d 43% 54%);
 border:1px solid #6e1d18;box-shadow:0 8px 0 -1px #a82c24,0 16px 0 -2px #7d211c,0 4px 7px #0006,inset 0 2px 3px #fff3}
.rawBaconVisual:after{content:"";position:absolute;inset:17% 4% 20%;border-radius:10px;background:repeating-linear-gradient(-8deg,transparent 0 9%,#f8c8aa99 10% 16%,transparent 17% 29%)}

.grillPatty{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;display:none;border:0!important;box-sizing:border-box!important}
.grillPatty.patty{width:34%!important;height:49%!important;border-radius:49%!important;border:2px solid #3a211a!important;box-shadow:inset 0 5px 8px #fff2,inset 0 -7px 10px #0005,0 7px 9px #0008!important}
.grillPatty.patty.raw{background:repeating-radial-gradient(ellipse,#dd6964 0 4px,#c44d49 5px 9px,#ae403d 10px 12px)!important}
.grillPatty.patty.cooking{background:repeating-linear-gradient(18deg,transparent 0 12px,#52291f44 13px 15px,transparent 16px 24px),radial-gradient(ellipse at 45% 35%,#aa6246,#76402f 70%)!important}
.grillPatty.patty.ready{background:repeating-linear-gradient(18deg,transparent 0 11px,#2a17118f 12px 14px,transparent 15px 23px),radial-gradient(ellipse at 44% 34%,#86503b,#4f2e23 72%)!important}
.grillPatty.patty.burned{background:repeating-linear-gradient(18deg,transparent 0 10px,#000b 11px 14px,transparent 15px 22px),radial-gradient(ellipse,#3a2c27,#171311 75%)!important}
.grillPatty.bacon{width:54%!important;height:27%!important;border-radius:13px 7px 12px 6px!important;border:1px solid #612019!important;box-shadow:0 5px 7px #0007,inset 0 2px 3px #fff3!important}
.grillPatty.bacon.raw{background:repeating-linear-gradient(92deg,#9e2821 0 8%,#df6245 9% 18%,#f4b092 19% 25%,#b7372b 26% 37%,#f3c0a2 38% 44%,#98261f 45% 56%)!important}
.grillPatty.bacon.cooking{background:repeating-linear-gradient(92deg,#7d201b 0 8%,#c24c34 9% 18%,#df8d6d 19% 25%,#9b2a23 26% 37%,#e39b7c 38% 44%,#742019 45% 56%)!important;filter:saturate(.9)}
.grillPatty.bacon.ready{background:repeating-linear-gradient(92deg,#681b17 0 8%,#a73728 9% 18%,#c86f52 19% 25%,#81221d 26% 37%,#d18365 38% 44%,#5d1915 45% 56%)!important;filter:saturate(.9) contrast(1.08)}
.grillPatty.bacon.burned{background:repeating-linear-gradient(92deg,#2d1715 0 9%,#4a201b 10% 20%,#633126 21% 28%,#241312 29% 42%)!important;filter:brightness(.78)}
.grillPatty.pickable{filter:drop-shadow(0 0 9px #79e85f)!important}.grillPatty.selectedCooked{filter:drop-shadow(0 0 11px #ffd95a)!important}

.plateBun{width:43%!important;height:21%!important;bottom:9%!important;background:transparent!important;border:0!important;box-shadow:none!important}
.plateBun:before{content:"";position:absolute;left:50%;bottom:20%;transform:translateX(-50%);width:76%;height:37%;border-radius:8px 8px 30px 30px;background:
 linear-gradient(180deg,#f1c68b 0 14%,#dea35d 48%,#be7136 100%);
 border:2px solid #915629;box-shadow:inset 0 4px 5px #fff6,inset 0 -5px 7px #6e351f44,0 6px 7px #0006}
.plateBun:after{content:"";position:absolute;left:50%;bottom:44%;transform:translateX(-50%);width:69%;height:5%;border-radius:50%;background:#ffe0ab77;filter:blur(.3px)}
.plateBun.readyTarget:before{filter:drop-shadow(0 0 10px #ffd84e)}

.layer{position:absolute!important;left:50%!important;transform:translateX(-50%)!important;border:0!important;box-shadow:none!important}.layer img{display:none!important}
.layer.patty{width:31%!important;height:8.7%!important;border-radius:48%!important;background:
 repeating-linear-gradient(16deg,transparent 0 11px,#2715107c 12px 14px,transparent 15px 23px),
 radial-gradient(ellipse at 45% 30%,#8d5540 0 15%,#6e3f31 48%,#4e2d22 100%)!important;
 border:2px solid #392019!important;box-shadow:inset 0 3px 4px #fff2,inset 0 -4px 5px #0005,0 4px 5px #0006!important}
.layer.patty:after{content:"";position:absolute;inset:18% 10%;border-radius:50%;background:radial-gradient(circle,#3f241c55 0 2px,transparent 3px);background-size:13px 9px;opacity:.65}
.layer.cheese{width:33%!important;height:5.7%!important;background:linear-gradient(145deg,#ffe680 0 14%,#f4c94d 42%,#dca01f 100%)!important;border:1px solid #a97613!important;clip-path:polygon(2% 12%,93% 0,100% 66%,67% 100%,0 78%)!important;transform:translateX(-50%) rotate(-1.4deg)!important;box-shadow:inset 0 2px 2px #fff7,0 3px 4px #0005!important}
.layer.cheese:after{content:"";position:absolute;right:3%;bottom:0;width:19%;height:36%;background:#c88c17aa;clip-path:polygon(0 0,100% 0,100% 100%);filter:brightness(.95)}
.layer.bacon{width:34%!important;height:5.8%!important;border-radius:14px 7px 13px 6px!important;background:repeating-linear-gradient(92deg,#671b17 0 8%,#a83b2b 9% 18%,#d27b5e 19% 25%,#84241e 26% 37%,#d88c6c 38% 44%,#5f1915 45% 56%)!important;border:1px solid #561713!important;transform:translateX(-50%) rotate(.8deg)!important;box-shadow:0 3px 4px #0006,inset 0 2px 3px #fff2!important}
.layer.bacon:before{content:"";position:absolute;left:5%;right:5%;top:26%;height:40%;border-radius:11px;background:repeating-linear-gradient(-9deg,transparent 0 8%,#efaf8b88 9% 14%,transparent 15% 27%)}
.layer.topBun{width:34%!important;height:14.5%!important;border-radius:55% 55% 18% 18%/82% 82% 24% 24%!important;background:
 radial-gradient(ellipse at 18% 30%,#fff5d8 0 1.2%,transparent 1.8%),radial-gradient(ellipse at 31% 20%,#fff5d8 0 1.25%,transparent 1.9%),radial-gradient(ellipse at 46% 31%,#fff5d8 0 1.2%,transparent 1.8%),radial-gradient(ellipse at 61% 21%,#fff5d8 0 1.25%,transparent 1.9%),radial-gradient(ellipse at 76% 34%,#fff5d8 0 1.2%,transparent 1.8%),radial-gradient(ellipse at 57% 47%,#fff5d8 0 1.1%,transparent 1.7%),linear-gradient(#f4d29a 0 13%,#e7b567 42%,#cf8740 78%,#ae622c 100%)!important;
 border:2px solid #8f5124!important;box-shadow:inset 0 7px 9px #fff6,inset 0 -7px 8px #71381c44,0 6px 7px #0006!important}
.layer.topBun:after{content:"";position:absolute;left:12%;right:12%;top:12%;height:25%;border-radius:50%;background:linear-gradient(#fff5,transparent);filter:blur(2px)}

.foodShelf{gap:5%!important;padding:5%!important}.foodItem{overflow:hidden!important}.foodLabel{z-index:6!important;background:rgba(245,245,240,.86);border-radius:4px;padding:1px 3px}
#bun:before{top:14%!important;width:62%!important;height:35%!important;border-radius:55% 55% 16% 16%/82% 82% 22% 22%!important;background:radial-gradient(circle at 26% 34%,#fff5d8 0 2%,transparent 2.7%),radial-gradient(circle at 48% 22%,#fff5d8 0 2%,transparent 2.7%),radial-gradient(circle at 70% 35%,#fff5d8 0 2%,transparent 2.7%),linear-gradient(#f3cf93,#db9b50)!important;border:2px solid #8f5328!important;box-shadow:inset 0 5px 6px #fff6,0 4px 5px #0005!important}
#bun:after{top:50%!important;width:62%!important;height:19%!important;border-radius:8px 8px 18px 18px!important;background:linear-gradient(#e8b36d,#bd7538)!important;border:2px solid #8a4f27!important;box-shadow:inset 0 3px 4px #fff4,0 3px 4px #0004!important}
#cheese:before{top:24%!important;width:66%!important;height:22%!important;background:linear-gradient(145deg,#ffe786,#f0bd3d)!important;border:2px solid #a57413!important;transform:translateX(-50%) rotate(-5deg)!important;box-shadow:0 7px 0 #d99d20,0 14px 0 #c98b18,0 5px 6px #0005!important}
#transferGhost{border:0!important;border-radius:50%!important;background:radial-gradient(ellipse at 45% 35%,#86503b,#4f2e23 72%)!important;box-shadow:inset 0 4px 5px #fff1,0 4px 5px #0006!important}
`;
document.head.appendChild(realism);

function targetForOrder(){
  if(order==='bacon') return ['bottomBun','patty','cheese','bacon','topBun'];
  if(order==='cheese') return ['bottomBun','patty','cheese','topBun'];
  return ['bottomBun','patty','topBun'];
}
function nextNeeded(){return targetForOrder()[built.length]}
function flash(t){const m=$('msg');m.textContent=t;m.classList.add('show');clearTimeout(m.t);m.t=setTimeout(()=>m.classList.remove('show'),1100)}
function hud(){$('money').textContent=money.toFixed(2);$('score').textContent=score;$('served').textContent=served}
function lights(s){['lraw','lcook','lready'].forEach(x=>$(x).classList.remove('on'));if(s==='raw')$('lraw').classList.add('on');if(s==='cook')$('lcook').classList.add('on');if(s==='ready')$('lready').classList.add('on')}

function showGrillItem(){
  const p=$('grillPatty');
  if(grillStage==='empty'||!grillItem){p.style.display='none';p.className='grillPatty';$('grill').classList.remove('sizzle');return}
  p.style.display='block';
  p.className='grillPatty '+grillItem+' '+grillStage;
  if(grillStage==='ready')p.classList.add('pickable');
  if(grillStage==='raw'||grillStage==='cooking')$('grill').classList.add('sizzle');else $('grill').classList.remove('sizzle');
}
function updateServeHint(){$('cust').classList.toggle('readyToServe',JSON.stringify(built)===JSON.stringify(targetForOrder()))}
function render(){
  const holder=$('layers');holder.innerHTML='';let y=25;
  built.forEach(x=>{if(x==='bottomBun')return;const d=document.createElement('div');d.className='layer '+x;d.style.bottom=y+'%';holder.appendChild(d);if(x==='patty')y+=6.6;else if(x==='cheese')y+=3.9;else if(x==='bacon')y+=4.2;});
  updateServeHint();
}
function resetGrill(){clearTimeout(gt);selectedType=null;cookedSelectedType=null;grillItem=null;grillStage='empty';$('raw').classList.remove('selected');$('rawBacon').classList.remove('selected');$('plateBun').classList.remove('readyTarget');lights('');showGrillItem()}
function next(){
  built=['bottomBun'];render();resetGrill();
  const r=Math.random();order=r<.46?'cheese':r<.72?'plain':'bacon';
  const i=served%names.length;$('name').textContent=names[i];$('cust').textContent=people[i];
  $('order').textContent=order==='bacon'?'One bacon cheeseburger, please!':order==='cheese'?'One cheeseburger, please!':'One hamburger, please!';
  patience=100;clearInterval(timer);timer=setInterval(()=>{patience=Math.max(0,patience-.7);$('patnum').textContent=Math.round(patience);$('patbar').style.width=patience+'%';if(!patience){clearInterval(timer);served++;hud();flash('Customer left!');setTimeout(next,700)}},300);
}

function selectRaw(type){
  if(grillStage!=='empty')return flash('There is already something on the grill');
  selectedType=type;$('raw').classList.toggle('selected',type==='patty');$('rawBacon').classList.toggle('selected',type==='bacon');
  flash(type==='bacon'?'Raw bacon picked up':'Raw patty picked up');
}
$('raw').onclick=()=>selectRaw('patty');
$('rawBacon').onclick=()=>selectRaw('bacon');

$('grill').onclick=()=>{
  if(grillStage==='burned'){flash('Burned '+grillItem+' tossed');resetGrill();return}
  if(grillStage!=='empty')return flash(grillStage==='ready'?(grillItem==='bacon'?'Bacon is crisp and ready!':'Patty is ready!'):(grillItem==='bacon'?'Bacon is cooking…':'Patty is cooking…'));
  if(!selectedType)return flash('Tap a raw patty or bacon first');
  grillItem=selectedType;selectedType=null;$('raw').classList.remove('selected');$('rawBacon').classList.remove('selected');
  grillStage='raw';lights('raw');showGrillItem();flash(grillItem==='bacon'?'Bacon on grill':'Patty on grill');
  const first=grillItem==='bacon'?1800:1600, second=grillItem==='bacon'?5200:5800, burn=grillItem==='bacon'?6500:7000;
  gt=setTimeout(()=>{grillStage='cooking';lights('cook');showGrillItem();gt=setTimeout(()=>{grillStage='ready';lights('ready');showGrillItem();flash(grillItem==='bacon'?'Bacon ready!':'Patty ready!');gt=setTimeout(()=>{if(grillStage==='ready'){grillStage='burned';lights('');showGrillItem();flash(grillItem==='bacon'?'Bacon burned!':'Patty burned!')}},burn)},second)},first);
};

$('grillPatty').onclick=e=>{
  e.stopPropagation();
  if(grillStage!=='ready')return flash('Wait until it is fully cooked');
  if(grillItem==='patty'&&nextNeeded()!=='patty')return flash('The burger already has its patty');
  if(grillItem==='bacon'&&nextNeeded()!=='bacon')return flash(order==='bacon'?'Add the patty and cheese first':'This order does not need bacon');
  cookedSelectedType=grillItem;$('grillPatty').classList.add('selectedCooked');$('plateBun').classList.add('readyTarget');
  flash('Cooked '+grillItem+' selected — tap the burger');
};

$('plateBun').onclick=()=>{
  if(!cookedSelectedType){
    if(grillStage==='ready')return flash('Tap the cooked '+grillItem+' first');
    return flash(nextNeeded()==='patty'?'Cook the patty first':nextNeeded()==='bacon'?'Grill the bacon first':'Add the next ingredient');
  }
  if(cookedSelectedType!==nextNeeded())return flash('That is not the next ingredient');
  built.push(cookedSelectedType);const placed=cookedSelectedType;cookedSelectedType=null;resetGrill();render();flash((placed==='bacon'?'Bacon':'Patty')+' added!');
};

$('cheese').onclick=()=>{if(nextNeeded()!=='cheese')return flash(order==='plain'?'No cheese on this order':nextNeeded()==='patty'?'Add the patty first':nextNeeded()==='bacon'?'Grill the bacon next':'Cheese is already on');built.push('cheese');render()};
$('bun').onclick=()=>{if(nextNeeded()==='topBun'){built.push('topBun');render();return}if(nextNeeded()==='patty')return flash('Cook the patty first');if(nextNeeded()==='cheese')return flash('Add cheese first');if(nextNeeded()==='bacon')return flash('Grill and add the bacon first')};
$('cust').onclick=()=>{if(JSON.stringify(built)!==JSON.stringify(targetForOrder()))return flash('Finish the burger first, then tap the customer');clearInterval(timer);const base=order==='plain'?4:order==='cheese'?4.75:5.75;const earn=base+2+patience/50;money+=earn;score+=Math.round(patience);served++;hud();flash('Served to '+$('name').textContent+'! +$'+earn.toFixed(2));setTimeout(next,700)};

hud();next();