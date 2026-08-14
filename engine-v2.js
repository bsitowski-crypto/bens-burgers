(()=>{
'use strict';
const $=s=>document.querySelector(s);
const canvas=$('#kitchenCanvas'),ctx=canvas.getContext('2d');
const toast=$('#toast'),serveBtn=$('#serveBtn');

const ASSETS={
 bottomBun:'assets/bottom-bun.png',topBun:'assets/top-bun.png',pattyRaw:'assets/raw-patty.png',pattyCooking:'assets/cooking-patty.png',pattyCooked:'assets/cooked-patty.png',pattyBurned:'assets/burned-patty.png',baconRaw:'assets/bacon-raw.png',baconCooking:'assets/bacon-raw.png',baconCooked:'assets/bacon-crispy.png',cheese:'assets/cheese.png',sauce:'assets/sauce-drizzle.png'
};
const IMAGES={};
function loadImages(){return Promise.all(Object.entries(ASSETS).map(([k,src])=>new Promise(res=>{const im=new Image();im.onload=()=>{IMAGES[k]=im;res()};im.onerror=()=>{IMAGES[k]=null;res()};im.src=src+'?canvas=3'})))}

const CATALOG={
 patty:{id:'patty',label:'PATTY',station:'grill',raw:'pattyRaw',cooking:'pattyCooking',cooked:'pattyCooked',burned:'pattyBurned',cookMs:5200,burnMs:6500,stack:{w:176,h:53,overlap:18}},
 bacon:{id:'bacon',label:'BACON',station:'grill',raw:'baconRaw',cooking:'baconCooking',cooked:'baconCooked',burned:'baconCooked',cookMs:3900,burnMs:5200,stack:{w:178,h:40,overlap:17}},
 cheese:{id:'cheese',label:'CHEESE',station:'cold',asset:'cheese',stack:{w:184,h:40,overlap:19}},
 sauce:{id:'sauce',label:'SAUCE',station:'cold',asset:'sauce',stack:{w:162,h:28,overlap:22}},
 topBun:{id:'topBun',label:'BUNS',station:'cold',asset:'topBun',stack:{w:190,h:80,overlap:20}},
 bottomBun:{id:'bottomBun',label:'BUNS',station:'cold',asset:'bottomBun',stack:{w:190,h:62,overlap:0}}
};
const RECIPES={
 hamburger:{id:'hamburger',label:'Hamburger',price:4,request:'One hamburger with burger sauce, please!',layers:['bottomBun','patty','sauce','topBun']},
 cheeseburger:{id:'cheeseburger',label:'Cheeseburger',price:4.75,request:'One cheeseburger with burger sauce, please!',layers:['bottomBun','patty','cheese','sauce','topBun']},
 baconCheese:{id:'baconCheese',label:'Bacon Cheeseburger',price:5.75,request:'One bacon cheeseburger with burger sauce, please!',layers:['bottomBun','patty','cheese','sauce','bacon','topBun']}
};
const CUSTOMERS=[['Lou','🧑'],['Maya','👩'],['Eddie','🧔'],['Tina','👩‍🦱'],['Sam','👨'],['Nora','👩‍🦰'],['Gus','🧑‍🦱'],['Penny','👨‍🦱'],['Bea','👵'],['Dex','🤠'],['Kai','🧑‍🎤'],['Rory','🧙']];

const state={money:0,score:0,served:0,patience:100,recipe:RECIPES.cheeseburger,built:[],selectedSource:null,selectedCooked:null,grill:[null,null],customerIndex:0,last:performance.now(),orderStarted:performance.now()};
const hits=[];
function flash(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(flash.t);flash.t=setTimeout(()=>toast.classList.remove('show'),1000)}
function setHUD(){ $('#money').textContent=state.money.toFixed(2);$('#score').textContent=state.score;$('#served').textContent=state.served;$('#patience').textContent=Math.round(state.patience);$('#patfill').style.width=state.patience+'%';serveBtn.classList.toggle('ready',isComplete()) }
function newOrder(){const keys=Object.keys(RECIPES);state.recipe=RECIPES[keys[Math.floor(Math.random()*keys.length)]];state.built=[];state.selectedSource=null;state.selectedCooked=null;state.grill=[null,null];state.patience=100;state.orderStarted=performance.now();const c=CUSTOMERS[state.customerIndex++%CUSTOMERS.length];$('#customerName').textContent=c[0];$('#customerEmoji').textContent=c[1];$('#orderText').textContent=state.recipe.request;setHUD()}
function needed(){return state.recipe.layers[state.built.length]}
function isComplete(){return state.built.length===state.recipe.layers.length&&state.built.every((x,i)=>x===state.recipe.layers[i])}
function fitImage(img,x,y,w,h){if(!img)return false;const r=Math.min(w/img.width,h/img.height),dw=img.width*r,dh=img.height*r;ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);return true}
function roundRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=3;ctx.stroke()}}
function text(t,x,y,size=22,align='center'){ctx.fillStyle='#eee';ctx.font=`900 ${size}px Arial`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(t,x,y)}
function addHit(id,x,y,w,h,data={}){hits.push({id,x,y,w,h,...data})}
function drawBin(id,label,asset,x,y,w,h){roundRect(x,y,w,h,14,'#d8dcda','#777');fitImage(IMAGES[asset],x+10,y+8,w-20,h-31);ctx.fillStyle='#f4f2ebdd';ctx.fillRect(x,y+h-28,w,28);ctx.fillStyle='#333';ctx.font='900 17px Arial';ctx.textAlign='center';ctx.fillText(label,x+w/2,y+h-9);addHit(id,x,y,w,h)}
function drawBunBin(x,y,w,h){roundRect(x,y,w,h,14,'#d8dcda','#777');fitImage(IMAGES.topBun,x+22,y+3,w-44,(h-31)*.58);fitImage(IMAGES.bottomBun,x+27,y+(h-31)*.40,w-54,(h-31)*.45);ctx.fillStyle='#f4f2ebee';ctx.fillRect(x,y+h-28,w,28);ctx.fillStyle='#333';ctx.font='900 17px Arial';ctx.textAlign='center';ctx.fillText('BUNS',x+w/2,y+h-9);addHit('coldBun',x,y,w,h)}
function drawGrillSlot(slotIndex,x,y,w,h){roundRect(x,y,w,h,12,'#202323','#777');for(let i=0;i<6;i++){ctx.fillStyle=i%2?'#3a3d3c':'#111';ctx.fillRect(x+i*w/6,y,w/12,h)}const g=state.grill[slotIndex];if(g){const def=CATALOG[g.type];const elapsed=performance.now()-g.started;let stage='raw',asset=def.raw;if(elapsed>def.cookMs){stage='cooked';asset=def.cooked}if(elapsed>def.cookMs+def.burnMs){stage='burned';asset=def.burned}g.stage=stage;fitImage(IMAGES[asset],x+18,y+12,w-36,h-24);if(stage==='cooked'){ctx.strokeStyle='#65d25c';ctx.lineWidth=6;ctx.strokeRect(x+5,y+5,w-10,h-10)}if(state.selectedCooked===slotIndex){ctx.strokeStyle='#ffd452';ctx.lineWidth=6;ctx.strokeRect(x+7,y+7,w-14,h-14)}}addHit('grillSlot',x,y,w,h,{slotIndex})}
function drawBurger(){const cx=1040,baseY=318;let y=baseY;const boxes=[];for(const id of state.built){const d=CATALOG[id],st=d.stack;y-=st.h;boxes.push({id,x:cx-st.w/2,y,w:st.w,h:st.h});y+=st.overlap}for(const b of boxes){const d=CATALOG[b.id];let asset=d.asset;if(b.id==='patty')asset='pattyCooked';if(b.id==='bacon')asset='baconCooked';fitImage(IMAGES[asset],b.x,b.y,b.w,b.h)}addHit('assembly',cx-220,100,440,245)}
function render(){const W=1600,H=420;ctx.clearRect(0,0,W,H);hits.length=0;ctx.fillStyle='#121413';ctx.fillRect(0,0,W,H);text('🔥 GRILL',28,34,26,'left');text('🍽️ ASSEMBLY',655,34,26,'left');
 drawGrillSlot(0,30,65,270,165);drawGrillSlot(1,315,65,270,165);
 drawBin('sourcePatty','PATTY','pattyRaw',32,278,240,112);drawBin('sourceBacon','BACON','baconRaw',310,278,240,112);
 roundRect(650,58,725,332,16,'#b98857','#6c4b32');ctx.beginPath();ctx.ellipse(1040,322,260,55,0,0,Math.PI*2);ctx.fillStyle='#e9e9e9';ctx.fill();ctx.strokeStyle='#8d9090';ctx.lineWidth=4;ctx.stroke();ctx.beginPath();ctx.ellipse(1040,315,185,34,0,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();drawBurger();
 roundRect(1405,55,175,335,15,'#b9bfbd','#666');drawBunBin(1420,75,145,88);drawBin('coldCheese','CHEESE','cheese',1420,175,145,88);drawBin('coldSauce','SAUCE','sauce',1420,275,145,88);
 if(state.selectedSource)text(`Selected: ${state.selectedSource.toUpperCase()}`,292,252,16);if(isComplete())text('READY!',1040,86,24);
}
function canvasPoint(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*1600/r.width,y:(e.clientY-r.top)*420/r.height}}
function pickHit(p){return [...hits].reverse().find(h=>p.x>=h.x&&p.x<=h.x+h.w&&p.y>=h.y&&p.y<=h.y+h.h)}
function placeOnGrill(slotIndex){if(!state.selectedSource)return flash('Choose a patty or bacon first');if(state.grill[slotIndex])return flash('That grill spot is occupied');state.grill[slotIndex]={type:state.selectedSource,started:performance.now(),stage:'raw'};state.selectedSource=null;flash('On the grill!')}
function chooseGrill(slotIndex){const g=state.grill[slotIndex];if(!g)return placeOnGrill(slotIndex);if(g.stage==='burned'){state.grill[slotIndex]=null;return flash('Burned item tossed')};if(g.stage!=='cooked')return flash('Still cooking');state.selectedCooked=slotIndex;flash(`Selected cooked ${g.type}`)}
function addBun(){const next=needed();if(next==='bottomBun'){state.built.push('bottomBun');return flash('Bottom bun placed')};if(next==='topBun'){state.built.push('topBun');return flash('Top bun placed — burger finished!')};flash(`Next: ${CATALOG[next]?.label||next}`)}
function addCold(id){if(needed()!==id)return flash(`Next: ${CATALOG[needed()]?.label||needed()}`);state.built.push(id);flash(`${CATALOG[id].label} added`)}
function addCooked(){if(state.selectedCooked===null)return flash('Select a cooked item from the grill');const g=state.grill[state.selectedCooked];if(!g||g.stage!=='cooked')return;if(needed()!==g.type)return flash(`Next: ${CATALOG[needed()]?.label||needed()}`);state.built.push(g.type);state.grill[state.selectedCooked]=null;state.selectedCooked=null;flash(`${CATALOG[g.type].label} added`)}
canvas.addEventListener('pointerdown',e=>{const h=pickHit(canvasPoint(e));if(!h)return;if(h.id==='sourcePatty'){state.selectedSource='patty';flash('Patty selected — tap a grill spot')}else if(h.id==='sourceBacon'){state.selectedSource='bacon';flash('Bacon selected — tap a grill spot')}else if(h.id==='grillSlot')chooseGrill(h.slotIndex);else if(h.id==='coldBun')addBun();else if(h.id==='coldCheese')addCold('cheese');else if(h.id==='coldSauce')addCold('sauce');else if(h.id==='assembly')addCooked()});
serveBtn.addEventListener('click',()=>{if(!isComplete())return flash(`Finish the burger — next is ${CATALOG[needed()]?.label||needed()}`);const tip=1+state.patience/50;state.money+=state.recipe.price+tip;state.score+=Math.round(state.patience);state.served++;setHUD();flash(`Served! +$${(state.recipe.price+tip).toFixed(2)}`);setTimeout(newOrder,650)});
function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=1600*dpr;canvas.height=420*dpr;canvas.style.aspectRatio='1600/420';ctx.setTransform(dpr,0,0,dpr,0,0)}
function tick(now){const dt=Math.min(100,now-state.last);state.last=now;state.patience=Math.max(0,state.patience-dt*0.0018);if(state.patience<=0){state.served++;flash('Customer left');newOrder()}setHUD();render();requestAnimationFrame(tick)}
window.addEventListener('resize',resize);resize();loadImages().then(()=>{newOrder();requestAnimationFrame(tick)});
})();