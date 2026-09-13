(()=>{
'use strict';
const $=s=>document.querySelector(s);
const canvas=$('#kitchenCanvas'),ctx=canvas.getContext('2d');
const toast=$('#toast'),serveBtn=$('#serveBtn'),sodaStation=$('#sodaStation'),sodaStatus=$('#sodaStatus');
const scorePop=$('#scorePop'),hint=$('#hint');

const ASSETS={
 bottomBun:'assets/game/bottom-bun.svg',topBun:'assets/game/top-bun.svg',
 pattyRaw:'assets/game/patty-raw.svg',pattyCooking:'assets/game/patty-cooking.svg',pattyCooked:'assets/game/patty-cooked.svg',pattyBurned:'assets/game/patty-burned.svg',
 baconRaw:'assets/bacon-raw.png',baconCooking:'assets/bacon-raw.png',baconCooked:'assets/bacon-crispy.png',
 cheese:'assets/cheese.png',sauce:'assets/sauce-drizzle.png',pickles:'assets/game/pickles.svg'
};
const IMAGES={};
function loadImages(){return Promise.all(Object.entries(ASSETS).map(([k,src])=>new Promise(res=>{const im=new Image();im.onload=()=>{IMAGES[k]=im;res()};im.onerror=()=>{IMAGES[k]=null;res()};im.src=src+'?v=20'})))}

const CATALOG={
 patty:{id:'patty',label:'PATTY',icon:'🥩',raw:'pattyRaw',cooking:'pattyCooking',cooked:'pattyCooked',burned:'pattyBurned',cookMs:4700,burnMs:5200,visual:{w:230,h:68,rise:29}},
 bacon:{id:'bacon',label:'BACON',icon:'🥓',raw:'baconRaw',cooking:'baconCooking',cooked:'baconCooked',burned:'baconCooked',cookMs:3500,burnMs:4300,visual:{w:245,h:42,rise:14}},
 cheese:{id:'cheese',label:'CHEESE',icon:'🧀',asset:'cheese',visual:{w:235,h:48,rise:12}},
 pickles:{id:'pickles',label:'PICKLES',icon:'🥒',asset:'pickles',visual:{w:215,h:42,rise:8}},
 sauce:{id:'sauce',label:'SAUCE',icon:'〰️',asset:'sauce',visual:{w:205,h:22,rise:5}},
 topBun:{id:'topBun',label:'TOP BUN',icon:'🍞',asset:'topBun',visual:{w:228,h:86,rise:0}},
 bottomBun:{id:'bottomBun',label:'BOTTOM BUN',icon:'🍞',asset:'bottomBun',visual:{w:228,h:66,rise:31}}
};
function recipe(name,price,request,layers){return{name,price,request,layers}}
const RECIPES={
 hamburger:recipe('Hamburger',4,'Hamburger with burger sauce',['bottomBun','patty','sauce','topBun']),
 hamburgerPickles:recipe('Pickle Burger',4.25,'Hamburger with pickles + burger sauce',['bottomBun','patty','pickles','sauce','topBun']),
 cheeseburger:recipe('Cheeseburger',4.75,'Cheeseburger with burger sauce',['bottomBun','patty','cheese','sauce','topBun']),
 cheeseburgerPickles:recipe('Pickle Cheeseburger',5,'Cheeseburger with pickles + burger sauce',['bottomBun','patty','cheese','pickles','sauce','topBun']),
 baconCheese:recipe('Bacon Cheeseburger',5.75,'Bacon cheeseburger with burger sauce',['bottomBun','patty','cheese','sauce','bacon','topBun']),
 baconCheesePickles:recipe('Loaded Bacon Burger',6,'Bacon cheeseburger with pickles + sauce',['bottomBun','patty','cheese','pickles','sauce','bacon','topBun']),
 baconSandwich:recipe('Bacon Sandwich',4.5,'Bacon sandwich with burger sauce',['bottomBun','bacon','bacon','sauce','topBun']),
 doubleCheeseburger:recipe('Double Cheeseburger',6.75,'Double cheeseburger with burger sauce',['bottomBun','patty','cheese','patty','cheese','sauce','topBun'])
};
const CUSTOMERS=[['Lou','🧑'],['Maya','👩'],['Eddie','🧔'],['Tina','👩‍🦱'],['Sam','👨'],['Nora','👩‍🦰'],['Gus','🧑‍🦱'],['Penny','👨‍🦱'],['Bea','👵'],['Dex','🤠']];
const state={money:0,score:0,served:0,shiftServed:0,streak:0,patience:100,recipe:RECIPES.cheeseburger,built:[],selectedSource:null,selectedCooked:null,grill:[null,null,null],customerIndex:0,orderNo:0,last:performance.now(),wantsSoda:false,sodaReady:false,mistakes:0};
const hits=[];

function flash(m,bad=false){toast.textContent=m;toast.classList.add('show');if(bad){document.querySelector('.canvasWrap').classList.remove('mistake');void document.querySelector('.canvasWrap').offsetWidth;document.querySelector('.canvasWrap').classList.add('mistake')}clearTimeout(flash.t);flash.t=setTimeout(()=>toast.classList.remove('show'),950)}
function pop(m){scorePop.textContent=m;scorePop.classList.remove('show');void scorePop.offsetWidth;scorePop.classList.add('show')}
function needed(){return state.recipe.layers[state.built.length]}
function burgerComplete(){return state.built.length===state.recipe.layers.length&&state.built.every((x,i)=>x===state.recipe.layers[i])}
function isComplete(){return burgerComplete()&&(!state.wantsSoda||state.sodaReady)}
function readable(id){return CATALOG[id]?.label||id}
function updateHint(){
 const n=needed();
 if(burgerComplete())hint.textContent=state.wantsSoda&&!state.sodaReady?'Burger done — fill the drink!':'Order ready — serve it!';
 else if(n==='patty'||n==='bacon')hint.textContent=`Cook ${readable(n).toLowerCase()} on the grill, then tap it when green.`;
 else hint.textContent=`Next: ${readable(n).toLowerCase()}. Tap the ingredient.`;
}
function setHUD(){
 $('#money').textContent=state.money.toFixed(2);$('#score').textContent=state.score;$('#served').textContent=state.served;$('#streak').textContent=state.streak;$('#patience').textContent=Math.round(state.patience);$('#patfill').style.width=state.patience+'%';
 $('#shiftServed').textContent=state.shiftServed;$('#shiftFill').style.width=Math.min(100,state.shiftServed*10)+'%';
 serveBtn.classList.toggle('ready',isComplete());sodaStation.classList.toggle('needed',state.wantsSoda&&!state.sodaReady);sodaStation.classList.toggle('ready',state.sodaReady);
 sodaStatus.textContent=state.sodaReady?'DRINK READY':state.wantsSoda?'TAP TO FILL':'NO DRINK';
 $('#comboText').textContent=state.streak>=5?`🔥 ${state.streak} order streak — 25% tip boost!`:state.streak>=2?`Nice! ${state.streak} clean orders in a row.`:'Build clean orders to heat up!';
 updateHint();
}
function renderOrderChips(){
 const counts={};state.recipe.layers.forEach(x=>counts[x]=(counts[x]||0)+1);
 const order=[];for(const [id,n] of Object.entries(counts)){const c=CATALOG[id];order.push(`<span class="orderChip${id==='patty'||id==='bacon'?' hot':''}">${c.icon} ${n>1?n+'× ':''}${c.label}</span>`)}
 if(state.wantsSoda)order.push('<span class="orderChip drink">🥤 SODA</span>');$('#orderChips').innerHTML=order.join('');
}
function newOrder(timeout=false){
 if(timeout){state.streak=0;flash('Customer left — keep moving!',true)}
 const ks=Object.keys(RECIPES);state.recipe=RECIPES[ks[Math.floor(Math.random()*ks.length)]];state.built=[];state.grill=[null,null,null];state.selectedSource=null;state.selectedCooked=null;state.patience=100;state.mistakes=0;state.wantsSoda=Math.random()<Math.min(.65,.35+state.served*.025);state.sodaReady=false;state.orderNo++;
 const c=CUSTOMERS[state.customerIndex++%CUSTOMERS.length];$('#customerName').textContent=c[0];$('#customerEmoji').textContent=c[1];$('#orderText').textContent=state.recipe.request;$('#orderNo').textContent=String(state.orderNo).padStart(2,'0');renderOrderChips();setHUD();
}
function fit(img,x,y,w,h){if(!img)return false;const r=Math.min(w/img.width,h/img.height),dw=img.width*r,dh=img.height*r;ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);return true}
function drawExact(img,x,y,w,h){if(!img)return false;ctx.drawImage(img,x,y,w,h);return true}
function rr(x,y,w,h,r,f,s='#ffffff12',lw=2){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=f;ctx.fill();if(s){ctx.strokeStyle=s;ctx.lineWidth=lw;ctx.stroke()}}
function text(t,x,y,z=22,a='center',color='#f7eadc',weight=900){ctx.fillStyle=color;ctx.font=`${weight} ${z}px system-ui`;ctx.textAlign=a;ctx.textBaseline='middle';ctx.fillText(t,x,y)}
function hit(id,x,y,w,h,d={}){hits.push({id,x,y,w,h,...d})}
function stationLabel(label,x,y,w){ctx.fillStyle='#0f0d0bcc';ctx.roundRect(x,y,w,28,10);ctx.fill();text(label,x+w/2,y+14,12,'center','#d9b99e',1000)}
function bin(id,label,asset,x,y,w,h){const n=needed()===id;rr(x,y,w,h,18,n?'#49301f':'#28211e',n?'#f0a14e':'#ffffff12',n?3:2);if(n){ctx.shadowColor='#f0a14e55';ctx.shadowBlur=18}fit(IMAGES[asset],x+8,y+10,w-16,h-38);ctx.shadowBlur=0;ctx.fillStyle='#171210dd';ctx.roundRect(x+8,y+h-34,w-16,26,9);ctx.fill();text(label,x+w/2,y+h-21,12,'center',n?'#ffd697':'#cdb7a8',1000);hit(id,x,y,w,h)}
function bunBin(x,y,w,h){const n=needed()==='bottomBun'||needed()==='topBun';rr(x,y,w,h,18,n?'#49301f':'#28211e',n?'#f0a14e':'#ffffff12',n?3:2);fit(IMAGES.topBun,x+22,y+8,w-44,35);fit(IMAGES.bottomBun,x+24,y+39,w-48,25);ctx.fillStyle='#171210dd';ctx.roundRect(x+8,y+h-34,w-16,26,9);ctx.fill();text(needed()==='topBun'?'TOP BUN':'BUNS',x+w/2,y+h-21,12,'center',n?'#ffd697':'#cdb7a8',1000);hit('coldBun',x,y,w,h)}
function grill(i,x,y,w,h){
 rr(x,y,w,h,20,'#201b19','#ffffff12',2);ctx.save();ctx.beginPath();ctx.roundRect(x+8,y+8,w-16,h-16,14);ctx.clip();
 const grd=ctx.createLinearGradient(x,y,x+w,y+h);grd.addColorStop(0,'#171414');grd.addColorStop(1,'#090909');ctx.fillStyle=grd;ctx.fillRect(x,y,w,h);
 for(let j=0;j<8;j++){ctx.fillStyle=j%2?'#36302e':'#201c1b';ctx.fillRect(x+12+j*(w-24)/8,y+12,5,h-24)}ctx.restore();
 const g=state.grill[i];
 if(g){const d=CATALOG[g.type],e=performance.now()-g.started;g.stage=e>d.cookMs+d.burnMs?'burned':e>d.cookMs?'cooked':e>d.cookMs*.34?'cooking':'raw';const asset=g.stage==='raw'?d.raw:g.stage==='cooking'?d.cooking:g.stage==='cooked'?d.cooked:d.burned;fit(IMAGES[asset],x+28,y+24,w-56,h-48);
 const pct=Math.min(1,e/d.cookMs);ctx.fillStyle='#0009';ctx.roundRect(x+18,y+h-21,w-36,8,5);ctx.fill();ctx.fillStyle=g.stage==='burned'?'#ef4f45':g.stage==='cooked'?'#5ed56f':'#f1a04d';ctx.roundRect(x+18,y+h-21,(w-36)*(g.stage==='cooked'?1:pct),8,5);ctx.fill();
 if(g.stage==='cooked'){ctx.strokeStyle=state.selectedCooked===i?'#ffd56b':'#62d973';ctx.lineWidth=4;ctx.roundRect(x+5,y+5,w-10,h-10,16);ctx.stroke();text('READY',x+w/2,y+19,11,'center','#79e88b',1000)}else if(g.stage==='burned')text('BURNED',x+w/2,y+19,11,'center','#ff6e62',1000);
 }else{text('EMPTY',x+w/2,y+h/2,11,'center','#74645c',1000)}
 hit('grill',x,y,w,h,{i})
}
function burger(){const cx=1100;let surface=317;for(const id of state.built){const d=CATALOG[id],v=d.visual;let asset=d.asset;if(id==='patty')asset='pattyCooked';if(id==='bacon')asset='baconCooked';drawExact(IMAGES[asset],cx-v.w/2,surface-v.h,v.w,v.h);surface-=v.rise}if(!state.built.length)text('BUILD HERE',cx,245,15,'center','#806f66',1000);hit('assembly',820,70,550,285)}
function render(){
 ctx.clearRect(0,0,1600,420);hits.length=0;
 const bg=ctx.createLinearGradient(0,0,0,420);bg.addColorStop(0,'#261d19');bg.addColorStop(1,'#15110f');ctx.fillStyle=bg;ctx.fillRect(0,0,1600,420);
 ctx.fillStyle='#ffffff05';for(let i=0;i<1600;i+=80)ctx.fillRect(i,0,1,420);
 stationLabel('🔥 GRILL',28,20,550);stationLabel('🍽️ ASSEMBLY',625,20,770);stationLabel('🧺 PREP',1410,20,165);
 grill(0,28,58,174,150);grill(1,215,58,174,150);grill(2,402,58,174,150);
 bin('patty','PATTY','pattyRaw',28,228,174,165);bin('bacon','BACON','baconRaw',215,228,174,165);
 rr(625,58,770,335,22,'#6c432c','#b77a4f',3);ctx.fillStyle='#9a603b';ctx.fillRect(645,78,730,8);ctx.beginPath();ctx.ellipse(1100,326,245,49,0,0,Math.PI*2);ctx.fillStyle='#dad7cf';ctx.fill();ctx.strokeStyle='#ffffff55';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.ellipse(1100,318,178,31,0,0,Math.PI*2);ctx.fillStyle='#f5f2ec';ctx.fill();burger();
 bunBin(1410,58,165,76);bin('cheese','CHEESE','cheese',1410,144,165,76);bin('pickles','PICKLES','pickles',1410,230,165,76);bin('sauce','SAUCE','sauce',1410,316,165,76);
}
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*1600/r.width,y:(e.clientY-r.top)*420/r.height}}
function pick(p){return [...hits].reverse().find(h=>p.x>=h.x&&p.x<=h.x+h.w&&p.y>=h.y&&p.y<=h.y+h.h)}
function mistake(msg){state.mistakes++;state.streak=Math.max(0,state.streak-1);flash(msg,true);setHUD()}
function addBun(){const n=needed();if(n==='bottomBun'||n==='topBun'){state.built.push(n);flash(n==='bottomBun'?'Bottom bun down!':'Burger capped!')}else mistake(`Not yet — next is ${readable(n)}`)}
function addCold(id){if(needed()===id){state.built.push(id);flash(`${readable(id)} added`)}else mistake(`Not yet — next is ${readable(needed())}`)}
canvas.addEventListener('pointerdown',e=>{const h=pick(point(e));if(!h)return;
 if(h.id==='patty'||h.id==='bacon'){state.selectedSource=h.id;state.selectedCooked=null;flash(`${readable(h.id)} selected — choose a grill`)}
 else if(h.id==='grill'){const g=state.grill[h.i];if(!g&&state.selectedSource){state.grill[h.i]={type:state.selectedSource,started:performance.now(),stage:'raw'};flash(`${readable(state.selectedSource)} is cooking`);state.selectedSource=null}else if(!g)flash('Pick patty or bacon first');else if(g.stage==='cooked'){state.selectedCooked=h.i;state.selectedSource=null;flash(`Ready ${readable(g.type)} selected — tap the plate`)}else if(g.stage==='burned'){state.grill[h.i]=null;mistake('Burned! Tossed it — try another')}else flash('Still cooking…')}
 else if(h.id==='coldBun')addBun();else if(h.id==='cheese')addCold('cheese');else if(h.id==='pickles')addCold('pickles');else if(h.id==='sauce')addCold('sauce');
 else if(h.id==='assembly'&&state.selectedCooked!==null){const g=state.grill[state.selectedCooked];if(g&&needed()===g.type){state.built.push(g.type);state.grill[state.selectedCooked]=null;state.selectedCooked=null;flash(`${readable(g.type)} stacked!`)}else if(g)mistake(`Hold it — next is ${readable(needed())}`)}
 setHUD();
});
sodaStation.addEventListener('click',()=>{if(!state.wantsSoda)return flash('No drink on this ticket');if(state.sodaReady)return flash('Drink is already ready');state.sodaReady=true;flash('Drink filled!');setHUD()});
serveBtn.addEventListener('click',()=>{
 if(!burgerComplete())return mistake(`Finish the burger — next: ${readable(needed())}`);if(state.wantsSoda&&!state.sodaReady)return mistake('Don’t forget the drink!');
 const clean=state.mistakes===0,perfect=clean&&state.patience>=70;state.streak=clean?state.streak+1:0;const streakBoost=state.streak>=5?1.25:state.streak>=3?1.15:1;const tip=(.75+state.patience/45)*streakBoost;const sale=state.recipe.price+(state.wantsSoda?1.5:0);const points=Math.round(state.patience+(perfect?35:clean?15:0));state.money+=sale+tip;state.score+=points;state.served++;state.shiftServed++;
 pop(perfect?`PERFECT +${points}`:`+${points}`);if(perfect)document.querySelector('.app').classList.add('perfectFlash');setTimeout(()=>document.querySelector('.app').classList.remove('perfectFlash'),500);flash(perfect?'Perfect order! 🔥':clean?'Clean order!':'Order served!');setHUD();
 if(state.shiftServed>=10){setTimeout(()=>{flash(`Shift complete! $${state.money.toFixed(2)} earned`);state.shiftServed=0;setTimeout(newOrder,900)},650)}else setTimeout(newOrder,650)
});
function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=1600*d;canvas.height=420*d;canvas.style.aspectRatio='1600/420';ctx.setTransform(d,0,0,d,0,0)}
function tick(n){const dt=Math.min(100,n-state.last);state.last=n;const speed=0.00155+Math.min(.0008,state.served*.000035);state.patience=Math.max(0,state.patience-dt*speed);if(state.patience<=0)newOrder(true);setHUD();render();requestAnimationFrame(tick)}
window.addEventListener('resize',resize);resize();loadImages().then(()=>{newOrder();requestAnimationFrame(tick)});
})();
