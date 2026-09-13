(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const toast=$('#toast'),serveBtn=$('#serveBtn'),hint=$('#hint'),shiftFill=$('#shiftFill');
const AS={pattyRaw:'assets/raw-patty.png',pattyCook:'assets/cooking-patty.png',pattyReady:'assets/cooked-patty.png',pattyBurn:'assets/burned-patty.png',bacon:'assets/bacon-raw.png',baconReady:'assets/bacon-crispy.png',buns:'assets/buns-stock.png',cheese:'assets/cheese-stock.png'};
const RECIPES=[
 {name:'Classic Burger',price:5.5,layers:['bunBottom','patty','lettuceL','tomatoL','sauceL','bunTop'],display:'Burger + lettuce + tomato'},
 {name:'Cheeseburger',price:6.25,layers:['bunBottom','patty','cheese','lettuceL','tomatoL','sauceL','bunTop'],display:'Cheeseburger + lettuce + tomato'},
 {name:'Bacon Cheeseburger',price:7.5,layers:['bunBottom','patty','cheese','bacon','lettuceL','tomatoL','sauceL','bunTop'],display:'Bacon cheeseburger'},
 {name:'Pickle Burger',price:6,layers:['bunBottom','patty','pickleL','onionL','sauceL','bunTop'],display:'Burger + pickles + onion'},
 {name:'Loaded Burger',price:8,layers:['bunBottom','patty','cheese','lettuceL','tomatoL','onionL','pickleL','bacon','sauceL','bunTop'],display:'Loaded burger'}
];
const PEOPLE=[
 {name:'Lou',skin:'#f0b081',hair:'#5a2d1b',shirt:'#bf4c38',accent:'#7d281d',style:'swoop'},
 {name:'Maya',skin:'#d89263',hair:'#221711',shirt:'#2f3036',accent:'#121317',style:'bun'},
 {name:'Eddie',skin:'#925633',hair:'#161413',shirt:'#73777c',accent:'#252a30',style:'cap'},
 {name:'Nora',skin:'#edc09a',hair:'#edc173',shirt:'#416f53',accent:'#24432f',style:'long'},
 {name:'Gus',skin:'#c78559',hair:'#5a392b',shirt:'#65717d',accent:'#303842',style:'cap2'}
];
const state={money:0,score:0,combo:0,served:0,perfect:0,shift:0,time:94,orders:[],built:[],selected:null,grills:Array(6).fill(null),last:performance.now(),mistakes:0};
function customerSvg(p,i){
 const hair=p.hair,skin=p.skin,shirt=p.shirt,accent=p.accent;
 const cap=p.style.startsWith('cap')?`<path d="M58 45q26-28 57 0v18H58z" fill="${accent}"/><path d="M96 48q32 0 43 10-18 8-43 6z" fill="${accent}"/>`:'';
 const long=p.style==='long'?`<path d="M43 70q-4 70 22 95h72q26-23 18-95-5-45-56-45S48 33 43 70z" fill="${hair}"/>`:'';
 const bun=p.style==='bun'?`<circle cx="103" cy="30" r="25" fill="${hair}"/>`:'';
 const swoop=p.style==='swoop'?`<path d="M52 59q11-43 62-37 30 3 42 30-27-14-47-7-24 9-57 14z" fill="${hair}"/>`:'';
 return `<svg viewBox="0 0 200 220" aria-hidden="true">
 <defs><linearGradient id="s${i}" x1="0" x2="1"><stop stop-color="${shirt}"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs>
 ${long}${bun}${swoop}
 <path d="M34 219q7-73 67-73t66 73z" fill="url(#s${i})" stroke="#0005" stroke-width="5"/>
 <path d="M77 145q4 24 24 25 21 0 25-25" fill="${skin}"/>
 <ellipse cx="101" cy="91" rx="48" ry="58" fill="${skin}" stroke="#0003" stroke-width="4"/>
 ${cap}
 ${p.style==='bun'?`<path d="M53 73q8-48 52-44 37 4 45 45-24-12-45-6-26 7-52 5z" fill="${hair}"/>`:''}
 ${p.style==='cap'||p.style==='cap2'?`<path d="M59 74q4-29 43-30 34 1 42 29-28-12-42-7-25 6-43 8z" fill="${hair}" opacity=".75"/>`:''}
 ${p.style==='long'?`<path d="M53 70q5-38 46-39 39 1 48 39-29-15-50-8-22 7-44 8z" fill="${hair}"/>`:''}
 <ellipse cx="83" cy="91" rx="5" ry="7" fill="#1d1713"/><ellipse cx="119" cy="91" rx="5" ry="7" fill="#1d1713"/>
 <path d="M88 116q13 11 27 0" fill="none" stroke="#7b3c2f" stroke-width="5" stroke-linecap="round"/>
 <path d="M69 81q12-7 24-2M110 79q12-5 24 3" fill="none" stroke="${hair}" stroke-width="4" stroke-linecap="round"/>
 <ellipse cx="66" cy="103" rx="8" ry="5" fill="#e8877a55"/><ellipse cx="136" cy="103" rx="8" ry="5" fill="#e8877a55"/>
 </svg>`;
}
function flash(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(flash.t);flash.t=setTimeout(()=>toast.classList.remove('show'),900)}
function randomOrder(){return RECIPES[Math.floor(Math.random()*RECIPES.length)]}
function makeQueue(){state.orders=PEOPLE.map((p,i)=>({person:p,recipe:randomOrder(),patience:100-i*5,wantsDrink:Math.random()<.45,wantsFries:Math.random()<.35}));}
function renderCustomers(){
 const host=$('#customers');host.innerHTML=state.orders.map((o,i)=>`<div class="customerCard ${i===0?'active':''}"><div class="bubble ${i?'waiting':''}"><div class="bubbleTitle"><span>${i===0?'ORDER NOW':'UP NEXT'}</span><span>${o.person.name}</span></div><div class="bubbleOrder">${o.recipe.display}${o.wantsFries?' + fries':''}${o.wantsDrink?' + drink':''}</div><div class="miniPat"><i style="width:${o.patience}%"></i></div></div><div class="avatar">${customerSvg(o.person,i)}</div></div>`).join('');
}
function needed(){return state.orders[0]?.recipe.layers[state.built.length]}
function readable(x){return ({bunBottom:'bottom bun',bunTop:'top bun',patty:'patty',cheese:'cheese',lettuceL:'lettuce',tomatoL:'tomato',onionL:'onion',pickleL:'pickles',bacon:'bacon',sauceL:'sauce'})[x]||x}
function renderPrep(){
 $$('.ingredient').forEach(b=>b.classList.remove('next'));
 const n=needed();const map={bunBottom:'buns',bunTop:'buns',patty:'patties',cheese:'cheese',lettuceL:'lettuce',tomatoL:'tomato',onionL:'onion',pickleL:'pickles',bacon:'bacon',sauceL:'sauce'};
 const id=map[n];if(id)document.querySelector(`[data-item="${id}"]`)?.classList.add('next');
}
function renderStack(){
 const host=$('#burgerStack');host.innerHTML='';let y=0;
 state.built.forEach((l,i)=>{const d=document.createElement('div');d.className='layer '+l;d.style.bottom=(y+4)+'px';host.appendChild(d);y+=({bunBottom:18,patty:20,cheese:12,lettuceL:10,tomatoL:10,onionL:8,pickleL:8,bacon:9,sauceL:5,bunTop:25}[l]||10)});
}
function setHUD(){
 $('#money').textContent='$'+state.money.toFixed(2);$('#score').textContent=state.score;$('#combo').textContent='x'+Math.max(1,state.combo);$('#served').textContent=state.shift+'/10';shiftFill.style.width=Math.min(100,state.shift*10)+'%';$('#time').textContent=Math.max(0,Math.ceil(state.time));$('#perfect').textContent=state.perfect+'/10';
 const n=needed();hint.textContent=n?(n==='patty'||n==='bacon'?`Cook ${readable(n)} until green, then tap it and the build board.`:`Next: add ${readable(n)}.`):'Burger complete — add any ordered fries/drink, then serve.';
 const o=state.orders[0];serveBtn.disabled=!!n||(!$('#drinkBtn').classList.contains('done')&&o?.wantsDrink)||(!$('#friesBtn').classList.contains('done')&&o?.wantsFries);
 renderPrep();renderStack();renderCustomers();
}
function placeCold(type){
 const n=needed();if(n===type){state.built.push(type);state.selected=null;flash(`${readable(type)} added`)}else{state.mistakes++;flash(`Not yet — next is ${readable(n)}`)}setHUD();
}
function selectBin(item){
 if(item==='buns'){placeCold(needed()==='bunTop'?'bunTop':'bunBottom');return}
 if(item==='patties'||item==='bacon'){state.selected=item==='patties'?'patty':'bacon';flash(`Tap an empty grill spot for ${readable(state.selected)}`);return}
 const map={cheese:'cheese',lettuce:'lettuceL',tomato:'tomatoL',onion:'onionL',pickles:'pickleL',sauce:'sauceL'};if(map[item])placeCold(map[item]);
}
function foodBg(type,stage){if(type==='patty')return `url(${stage==='raw'?AS.pattyRaw:stage==='ready'?AS.pattyReady:stage==='burned'?AS.pattyBurn:AS.pattyCook})`;return `url(${stage==='ready'?AS.baconReady:AS.bacon})`}
function renderGrills(now=performance.now()){
 $$('.grillSlot').forEach((el,i)=>{const g=state.grills[i];el.className='grillSlot';const sprite=el.querySelector('.foodSprite'),bar=el.querySelector('.slotBar i');if(!g){sprite.style.backgroundImage='none';bar.style.width='0';return}const elapsed=now-g.start;const cook=g.type==='patty'?4600:3400;const burn=cook+(g.type==='patty'?4200:3400);g.stage=elapsed>=burn?'burned':elapsed>=cook?'ready':'cooking';if(elapsed<500)g.stage='raw';sprite.style.backgroundImage=foodBg(g.type,g.stage);bar.style.width=Math.min(100,elapsed/cook*100)+'%';bar.style.background=g.stage==='ready'?'#58df3b':g.stage==='burned'?'#f14c37':'#efaa2e';if(g.stage==='ready')el.classList.add('ready');if(g.stage==='burned')el.classList.add('burned')});
}
function grillTap(i){const g=state.grills[i];if(!g){if(!state.selected)return flash('Select patties or bacon first');state.grills[i]={type:state.selected,start:performance.now(),stage:'raw'};flash(`${readable(state.selected)} on the grill`);state.selected=null;return}if(g.stage==='ready'){if(needed()===g.type){state.built.push(g.type);state.grills[i]=null;flash(`${readable(g.type)} stacked`);setHUD()}else flash(`Hold that — next is ${readable(needed())}`)}else if(g.stage==='burned'){state.grills[i]=null;state.mistakes++;flash('Burned! Tossed it.')}else flash('Still cooking…')}
function finishOrder(){const o=state.orders[0];const clean=state.mistakes===0,perfect=clean&&o.patience>68;state.combo=clean?state.combo+1:0;state.perfect+=perfect?1:0;const pts=Math.round(o.patience)+(perfect?40:clean?15:0);const tip=(.8+o.patience/55)*(state.combo>=4?1.3:state.combo>=2?1.15:1);state.money+=o.recipe.price+(o.wantsDrink?1.5:0)+(o.wantsFries?2:0)+tip;state.score+=pts;state.served++;state.shift++;flash(perfect?`PERFECT! +${pts}`:`Served! +${pts}`);state.orders.shift();state.orders.push({person:PEOPLE[(state.served+4)%PEOPLE.length],recipe:randomOrder(),patience:100,wantsDrink:Math.random()<.45,wantsFries:Math.random()<.35});state.built=[];state.grills=Array(6).fill(null);state.selected=null;state.mistakes=0;$('#drinkBtn').classList.remove('done');$('#friesBtn').classList.remove('done');if(state.shift>=10){state.shift=0;state.time=94;flash(`Shift complete — $${state.money.toFixed(2)} earned!`)}setHUD()}
$$('.ingredient').forEach(b=>b.addEventListener('click',()=>selectBin(b.dataset.item)));
$$('.grillSlot').forEach((b,i)=>b.addEventListener('click',()=>grillTap(i)));
$('#drinkBtn').addEventListener('click',function(){const o=state.orders[0];if(!o.wantsDrink)return flash('No drink on this order');this.classList.add('done');flash('Drink ready!');setHUD()});
$('#friesBtn').addEventListener('click',function(){const o=state.orders[0];if(!o.wantsFries)return flash('No fries on this order');this.classList.add('done');flash('Fries ready!');setHUD()});
serveBtn.addEventListener('click',finishOrder);
function tick(now){const dt=Math.min(.1,(now-state.last)/1000);state.last=now;state.time-=dt;state.orders.forEach((o,i)=>o.patience=Math.max(0,o.patience-dt*(i===0?2.5:.25)));if(state.orders[0]?.patience<=0){state.combo=0;state.orders.shift();state.orders.push({person:PEOPLE[(state.served+3)%PEOPLE.length],recipe:randomOrder(),patience:100,wantsDrink:Math.random()<.45,wantsFries:Math.random()<.35});state.built=[];state.grills=Array(6).fill(null);state.mistakes=0;flash('Customer left!');}if(state.time<=0){state.time=94;state.shift=0;flash('New shift started!')}renderGrills(now);setHUD();requestAnimationFrame(tick)}
makeQueue();setHUD();requestAnimationFrame(tick);
})();