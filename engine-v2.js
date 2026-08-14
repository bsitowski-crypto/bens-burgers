(()=>{
'use strict';
const $=s=>document.querySelector(s);
const canvas=$('#kitchenCanvas'),ctx=canvas.getContext('2d');
const toast=$('#toast'),serveBtn=$('#serveBtn');

const ASSETS={
 bottomBun:'assets/game/bottom-bun.svg',topBun:'assets/game/top-bun.svg',
 pattyRaw:'assets/game/patty-raw.svg',pattyCooking:'assets/game/patty-cooking.svg',pattyCooked:'assets/game/patty-cooked.svg',pattyBurned:'assets/game/patty-burned.svg',
 baconRaw:'assets/bacon-raw.png',baconCooking:'assets/bacon-raw.png',baconCooked:'assets/bacon-crispy.png',
 cheese:'assets/cheese.png',sauce:'assets/sauce-drizzle.png',pickles:'assets/game/pickles.svg'
};
const IMAGES={};
function loadImages(){return Promise.all(Object.entries(ASSETS).map(([k,src])=>new Promise(res=>{const im=new Image();im.onload=()=>{IMAGES[k]=im;res()};im.onerror=()=>{IMAGES[k]=null;res()};im.src=src+'?v=12'})))}

const CATALOG={
 patty:{id:'patty',label:'PATTY',raw:'pattyRaw',cooking:'pattyCooking',cooked:'pattyCooked',burned:'pattyBurned',cookMs:5200,burnMs:6500,visual:{w:232,h:68,rise:29}},
 bacon:{id:'bacon',label:'BACON',raw:'baconRaw',cooking:'baconCooking',cooked:'baconCooked',burned:'baconCooked',cookMs:3900,burnMs:5200,visual:{w:254,h:44,rise:14}},
 cheese:{id:'cheese',label:'CHEESE',asset:'cheese',visual:{w:238,h:48,rise:12}},
 pickles:{id:'pickles',label:'PICKLES',asset:'pickles',visual:{w:220,h:42,rise:8}},
 sauce:{id:'sauce',label:'SAUCE',asset:'sauce',visual:{w:205,h:22,rise:5}},
 topBun:{id:'topBun',label:'BUNS',asset:'topBun',visual:{w:228,h:86,rise:0}},
 bottomBun:{id:'bottomBun',label:'BUNS',asset:'bottomBun',visual:{w:228,h:66,rise:31}}
};

function recipe(price,request,layers){return{price,request,layers}}
const RECIPES={
 hamburger:recipe(4,'One hamburger with burger sauce, please!',['bottomBun','patty','sauce','topBun']),
 hamburgerPickles:recipe(4,'One hamburger with pickles and burger sauce, please!',['bottomBun','patty','pickles','sauce','topBun']),
 cheeseburger:recipe(4.75,'One cheeseburger with burger sauce, please!',['bottomBun','patty','cheese','sauce','topBun']),
 cheeseburgerPickles:recipe(4.75,'One cheeseburger with pickles and burger sauce, please!',['bottomBun','patty','cheese','pickles','sauce','topBun']),
 baconCheese:recipe(5.75,'One bacon cheeseburger with burger sauce, please!',['bottomBun','patty','cheese','sauce','bacon','topBun']),
 baconCheesePickles:recipe(5.75,'One bacon cheeseburger with pickles and burger sauce, please!',['bottomBun','patty','cheese','pickles','sauce','bacon','topBun']),
 baconSandwich:recipe(4.50,'One bacon sandwich with burger sauce, please!',['bottomBun','bacon','bacon','sauce','topBun']),
 baconSandwichPickles:recipe(4.50,'One bacon sandwich with pickles and burger sauce, please!',['bottomBun','bacon','bacon','pickles','sauce','topBun']),
 doubleCheeseburger:recipe(6.75,'One double cheeseburger with burger sauce, please!',['bottomBun','patty','cheese','patty','cheese','sauce','topBun']),
 doubleCheeseburgerPickles:recipe(6.75,'One double cheeseburger with pickles and burger sauce, please!',['bottomBun','patty','cheese','patty','cheese','pickles','sauce','topBun'])
};
const CUSTOMERS=[['Lou','🧑'],['Maya','👩'],['Eddie','🧔'],['Tina','👩‍🦱'],['Sam','👨'],['Nora','👩‍🦰'],['Gus','🧑‍🦱'],['Penny','👨‍🦱'],['Bea','👵'],['Dex','🤠']];
const state={money:0,score:0,served:0,patience:100,recipe:RECIPES.cheeseburger,built:[],selectedSource:null,selectedCooked:null,grill:[null,null],customerIndex:0,last:performance.now()};
const hits=[];

function flash(m){toast.textContent=m;toast.classList.add('show');clearTimeout(flash.t);flash.t=setTimeout(()=>toast.classList.remove('show'),1000)}
function needed(){return state.recipe.layers[state.built.length]}
function isComplete(){return state.built.length===state.recipe.layers.length&&state.built.every((x,i)=>x===state.recipe.layers[i])}
function setHUD(){$('#money').textContent=state.money.toFixed(2);$('#score').textContent=state.score;$('#served').textContent=state.served;$('#patience').textContent=Math.round(state.patience);$('#patfill').style.width=state.patience+'%';serveBtn.classList.toggle('ready',isComplete())}
function newOrder(){const ks=Object.keys(RECIPES);state.recipe=RECIPES[ks[Math.floor(Math.random()*ks.length)]];state.built=[];state.grill=[null,null];state.selectedSource=null;state.selectedCooked=null;state.patience=100;const c=CUSTOMERS[state.customerIndex++%CUSTOMERS.length];$('#customerName').textContent=c[0];$('#customerEmoji').textContent=c[1];$('#orderText').textContent=state.recipe.request;setHUD()}
function fit(img,x,y,w,h){if(!img)return false;const r=Math.min(w/img.width,h/img.height),dw=img.width*r,dh=img.height*r;ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);return true}
function drawExact(img,x,y,w,h){if(!img)return false;ctx.drawImage(img,x,y,w,h);return true}
function rr(x,y,w,h,r,f,s){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=f;ctx.fill();if(s){ctx.strokeStyle=s;ctx.lineWidth=3;ctx.stroke()}}
function text(t,x,y,z=22,a='center'){ctx.fillStyle='#eee';ctx.font=`900 ${z}px Arial`;ctx.textAlign=a;ctx.textBaseline='middle';ctx.fillText(t,x,y)}
function hit(id,x,y,w,h,d={}){hits.push({id,x,y,w,h,...d})}
function bin(id,label,asset,x,y,w,h){const selected=state.selectedSource===id;rr(x,y,w,h,12,selected?'#e6dfbd':'#d8dcda',selected?'#f1c84b':'#777');fit(IMAGES[asset],x+9,y+4,w-18,h-25);ctx.fillStyle='#f4f2ebee';ctx.fillRect(x,y+h-22,w,22);ctx.fillStyle='#333';ctx.font='900 14px Arial';ctx.textAlign='center';ctx.fillText(label,x+w/2,y+h-7);hit(id,x,y,w,h)}
function bunBin(x,y,w,h){rr(x,y,w,h,12,'#d8dcda','#777');fit(IMAGES.topBun,x+22,y+1,w-44,31);fit(IMAGES.bottomBun,x+25,y+29,w-50,22);ctx.fillStyle='#f4f2ebf2';ctx.fillRect(x,y+h-22,w,22);ctx.fillStyle='#333';ctx.font='900 14px Arial';ctx.textAlign='center';ctx.fillText('BUNS',x+w/2,y+h-7);hit('coldBun',x,y,w,h)}
function grill(i,x,y,w,h){rr(x,y,w,h,12,'#202323','#777');for(let j=0;j<6;j++){ctx.fillStyle=j%2?'#3a3d3c':'#111';ctx.fillRect(x+j*w/6,y,w/12,h)}const g=state.grill[i];if(g){const d=CATALOG[g.type],e=performance.now()-g.started;g.stage=e>d.cookMs+d.burnMs?'burned':e>d.cookMs?'cooked':e>d.cookMs*.35?'cooking':'raw';const asset=g.stage==='raw'?d.raw:g.stage==='cooking'?d.cooking:g.stage==='cooked'?d.cooked:d.burned;if(g.type==='patty')fit(IMAGES[asset],x+42,y+31,w-84,h-62);else fit(IMAGES[asset],x+18,y+18,w-36,h-36);if(g.stage==='cooked'){ctx.strokeStyle=state.selectedCooked===i?'#f1c84b':'#65d25c';ctx.lineWidth=6;ctx.strokeRect(x+5,y+5,w-10,h-10)}}hit('grill',x,y,w,h,{i})}
function burger(){const cx=1040;let surface=318;for(const id of state.built){const d=CATALOG[id],v=d.visual;let asset=d.asset;if(id==='patty')asset='pattyCooked';if(id==='bacon')asset='baconCooked';drawExact(IMAGES[asset],cx-v.w/2,surface-v.h,v.w,v.h);surface-=v.rise}hit('assembly',820,100,440,245)}
function render(){ctx.clearRect(0,0,1600,420);hits.length=0;ctx.fillStyle='#121413';ctx.fillRect(0,0,1600,420);text('🔥 GRILL',28,34,26,'left');text('🍽️ ASSEMBLY',655,34,26,'left');grill(0,30,65,270,165);grill(1,315,65,270,165);bin('patty','PATTY','pattyRaw',32,278,240,112);bin('bacon','BACON','baconRaw',310,278,240,112);rr(650,58,725,332,16,'#b98857','#6c4b32');ctx.beginPath();ctx.ellipse(1040,322,260,55,0,0,Math.PI*2);ctx.fillStyle='#e9e9e9';ctx.fill();ctx.strokeStyle='#8d9090';ctx.lineWidth=4;ctx.stroke();ctx.beginPath();ctx.ellipse(1040,315,185,34,0,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();burger();rr(1405,55,175,335,15,'#b9bfbd','#666');bunBin(1420,66,145,70);bin('cheese','CHEESE','cheese',1420,143,145,70);bin('pickles','PICKLES','pickles',1420,220,145,70);bin('sauce','SAUCE','sauce',1420,297,145,70)}
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*1600/r.width,y:(e.clientY-r.top)*420/r.height}}
function pick(p){return [...hits].reverse().find(h=>p.x>=h.x&&p.x<=h.x+h.w&&p.y>=h.y&&p.y<=h.y+h.h)}
function addBun(){const n=needed();if(n==='bottomBun'||n==='topBun'){state.built.push(n);flash(n==='bottomBun'?'Bottom bun placed':'Top bun placed')}else flash(`Next: ${CATALOG[n]?.label||n}`)}
function addCold(id){if(needed()===id){state.built.push(id);flash(CATALOG[id].label+' added')}else flash(`Next: ${CATALOG[needed()]?.label||needed()}`)}
canvas.addEventListener('pointerdown',e=>{const h=pick(point(e));if(!h)return;if(h.id==='patty'||h.id==='bacon'){state.selectedSource=h.id;state.selectedCooked=null;flash(`${CATALOG[h.id].label} selected — tap either grill`)}else if(h.id==='grill'){const g=state.grill[h.i];if(!g&&state.selectedSource){state.grill[h.i]={type:state.selectedSource,started:performance.now(),stage:'raw'};flash(`${CATALOG[state.selectedSource].label} on burner ${h.i+1}`);state.selectedSource=null}else if(!g)flash('Select patty or bacon first');else if(g.stage==='cooked'){state.selectedCooked=h.i;state.selectedSource=null;flash(`Cooked ${g.type} selected`)}else if(g.stage==='burned'){state.grill[h.i]=null;flash('Burned food discarded')}else flash('Still cooking')}else if(h.id==='coldBun')addBun();else if(h.id==='cheese')addCold('cheese');else if(h.id==='pickles')addCold('pickles');else if(h.id==='sauce')addCold('sauce');else if(h.id==='assembly'&&state.selectedCooked!==null){const g=state.grill[state.selectedCooked];if(g&&needed()===g.type){state.built.push(g.type);state.grill[state.selectedCooked]=null;state.selectedCooked=null;flash(g.type+' added')}else if(g)flash(`Next: ${CATALOG[needed()]?.label||needed()}`)}});
serveBtn.addEventListener('click',()=>{if(!isComplete())return flash(`Finish burger — next: ${CATALOG[needed()]?.label||needed()}`);const tip=1+state.patience/50;state.money+=state.recipe.price+tip;state.score+=Math.round(state.patience);state.served++;flash('Served!');setTimeout(newOrder,650)});
function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=1600*d;canvas.height=420*d;canvas.style.aspectRatio='1600/420';ctx.setTransform(d,0,0,d,0,0)}
function tick(n){const dt=Math.min(100,n-state.last);state.last=n;state.patience=Math.max(0,state.patience-dt*.0018);if(state.patience<=0)newOrder();setHUD();render();requestAnimationFrame(tick)}
window.addEventListener('resize',resize);resize();loadImages().then(()=>{newOrder();requestAnimationFrame(tick)});
})();