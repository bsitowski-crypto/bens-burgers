(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],toast=$('#toast'),serve=$('#serveBtn'),hint=$('#hint');
const AS={raw:'assets/raw-patty.png',cook:'assets/cooking-patty.png',ready:'assets/cooked-patty.png',burn:'assets/burned-patty.png',bacon:'assets/bacon-raw.png',baconReady:'assets/bacon-crispy.png'};
const RECIPES=[
 ['Classic Burger',5.5,['bunBottom','patty','lettuceL','tomatoL','sauceL','bunTop'],'Classic burger'],
 ['Cheeseburger',6.25,['bunBottom','patty','cheese','lettuceL','tomatoL','sauceL','bunTop'],'Cheeseburger'],
 ['Bacon Cheeseburger',7.5,['bunBottom','patty','cheese','bacon','lettuceL','tomatoL','sauceL','bunTop'],'Bacon cheeseburger'],
 ['Pickle Burger',6,['bunBottom','patty','pickleL','onionL','sauceL','bunTop'],'Pickle burger'],
 ['Loaded Burger',8,['bunBottom','patty','cheese','lettuceL','tomatoL','onionL','pickleL','bacon','sauceL','bunTop'],'Loaded burger']
].map(([name,price,layers,display])=>({name,price,layers,display}));
const PEOPLE=[
 {name:'Lou',skin:'#f1ad7f',skin2:'#d77c52',hair:'#4b2719',shirt:'#b94736',shirt2:'#76271f',style:'swoop'},
 {name:'Maya',skin:'#d88b5f',skin2:'#b76643',hair:'#241712',shirt:'#242429',shirt2:'#111216',style:'bun'},
 {name:'Eddie',skin:'#8b5234',skin2:'#663822',hair:'#151313',shirt:'#72777e',shirt2:'#3b424a',style:'hoodcap'},
 {name:'Nora',skin:'#efc29f',skin2:'#d99976',hair:'#e9be72',shirt:'#3f7251',shirt2:'#244631',style:'glasses'},
 {name:'Gus',skin:'#c27b50',skin2:'#915637',hair:'#4c3329',shirt:'#607080',shirt2:'#334250',style:'capbeard'}
];
const S={money:0,score:0,combo:0,served:0,perfect:0,shift:0,time:94,orders:[],built:[],selected:null,grills:Array(6).fill(null),last:performance.now(),mistakes:0};
const R=x=>({bunBottom:'bottom bun',bunTop:'top bun',patty:'patty',cheese:'cheese',lettuceL:'lettuce',tomatoL:'tomato',onionL:'onion',pickleL:'pickles',bacon:'bacon',sauceL:'sauce'}[x]||x);
function faceExtras(p){
 if(p.style==='glasses')return '<g fill="none" stroke="#26364a" stroke-width="5"><rect x="52" y="76" width="38" height="27" rx="10"/><rect x="109" y="76" width="38" height="27" rx="10"/><path d="M90 87h19"/></g>';
 if(p.style==='capbeard')return '<path d="M62 107q8 50 39 50 34 0 42-50-12 16-23 17-20 2-38-1-12-2-20-16z" fill="#4b3027" opacity=".95"/>';
 if(p.style==='hoodcap')return '<path d="M69 115q12 32 32 32t34-32q-10 18-34 18-22 0-32-18z" fill="#1b1716" opacity=".9"/>';
 return '';
}
function hairShape(p){
 if(p.style==='bun')return `<circle cx="103" cy="26" r="27" fill="${p.hair}"/><path d="M48 73q5-53 55-53 46 0 53 54-29-18-54-10-26 8-54 9z" fill="${p.hair}"/>`;
 if(p.style==='glasses')return `<path d="M40 63q11-50 62-50 57 0 64 53-12 13-14 61-9-21-16-29-20-21-54-27-20 5-31 22-9 14-12 33-8-38 1-63z" fill="${p.hair}"/><path d="M52 65q17-33 52-33 32 0 48 33-27-13-49-5-26 8-51 5z" fill="#f2cd89"/>`;
 if(p.style==='swoop')return `<path d="M45 66q8-48 57-52 45-4 64 33-32-16-57-5-25 11-64 24z" fill="${p.hair}"/><path d="M57 50q28-37 74-20-37 3-57 31z" fill="#70412b"/>`;
 return `<path d="M55 70q3-36 47-39 40 0 46 37-28-12-46-6-24 7-47 8z" fill="${p.hair}"/>`;
}
function capShape(p){
 if(!p.style.includes('cap'))return '';
 return `<path d="M56 54q12-37 46-37 38 0 51 37v18H56z" fill="#252b32" stroke="#111" stroke-width="4"/><path d="M95 55q38-2 57 10-28 11-57 7z" fill="#1c2228"/><text x="102" y="49" text-anchor="middle" fill="#f1e3c0" font-size="22" font-family="system-ui" font-weight="900">B</text>`;
}
function customerSvg(p,i){return `<svg viewBox="0 0 210 245" aria-hidden="true"><defs><linearGradient id="shirt${i}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${p.shirt}"/><stop offset="1" stop-color="${p.shirt2}"/></linearGradient><linearGradient id="skin${i}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${p.skin}"/><stop offset="1" stop-color="${p.skin2}"/></linearGradient><filter id="shadow${i}"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-opacity=".28"/></filter></defs><g filter="url(#shadow${i})"><path d="M22 245q8-82 84-82 74 0 82 82z" fill="url(#shirt${i})" stroke="#0004" stroke-width="5"/><path d="M60 222q16-24 36-30M151 222q-17-24-38-30" stroke="#ffffff22" stroke-width="5" stroke-linecap="round"/><path d="M79 150q2 28 26 29 25 0 28-29" fill="url(#skin${i})"/><ellipse cx="105" cy="98" rx="52" ry="63" fill="url(#skin${i})" stroke="#0003" stroke-width="4"/>${hairShape(p)}${capShape(p)}<path d="M69 81q13-8 27-2M114 79q13-6 27 3" fill="none" stroke="${p.hair}" stroke-width="5" stroke-linecap="round"/><ellipse cx="84" cy="95" rx="6" ry="8" fill="#181412"/><ellipse cx="126" cy="95" rx="6" ry="8" fill="#181412"/><circle cx="86" cy="92" r="2.2" fill="#fff"/><circle cx="128" cy="92" r="2.2" fill="#fff"/><path d="M101 98q-4 12 1 16" fill="none" stroke="#9b593f" stroke-width="3" stroke-linecap="round"/><path d="M86 124q19 18 39 0" fill="#fff7ed" stroke="#8b4234" stroke-width="4" stroke-linejoin="round"/><ellipse cx="66" cy="109" rx="10" ry="6" fill="#ef877155"/><ellipse cx="144" cy="109" rx="10" ry="6" fill="#ef877155"/>${faceExtras(p)}<path d="M43 224q-12-20 4-32 14-10 33 12l12 17" fill="url(#skin${i})" stroke="#0002" stroke-width="3"/><path d="M167 224q13-20-3-32-15-10-33 12l-12 17" fill="url(#skin${i})" stroke="#0002" stroke-width="3"/></g></svg>`}
function flash(m){toast.textContent=m;toast.classList.add('show');clearTimeout(flash.t);flash.t=setTimeout(()=>toast.classList.remove('show'),850)}
const recipe=()=>RECIPES[Math.floor(Math.random()*RECIPES.length)];
const order=p=>({person:p,recipe:recipe(),patience:100,wantsDrink:Math.random()<.45,wantsFries:Math.random()<.35});
function miniOrder(o){let s='<span class="miniBurger"><i></i><i></i><i></i></span>';if(o.wantsFries)s+='<span class="miniSide friesMini">🍟</span>';if(o.wantsDrink)s+='<span class="miniSide">🥤</span>';return s}
function renderCustomers(){const h=$('#customers');h.innerHTML=S.orders.map((o,i)=>`<div class="customerCard ${i?'':'active'}"><div class="bubble ${i?'waiting':''}"><div class="bubbleTop"><span class="orderVisual">${miniOrder(o)}</span><span class="orderName">${o.person.name}</span></div><div class="bubbleOrder">${o.recipe.display}</div><div class="miniPat"><i></i></div></div><div class="avatar">${customerSvg(o.person,i)}</div></div>`).join('');updatePatience()}
function updatePatience(){$$('.miniPat i').forEach((b,i)=>{const v=S.orders[i]?.patience||0;b.style.width=v+'%';b.style.background=v<28?'#ef4334':v<55?'#f2ae30':'#4ed24a'})}
const needed=()=>S.orders[0]?.recipe.layers[S.built.length];
function renderPrep(){$$('.ingredient').forEach(b=>b.classList.remove('next'));const id={bunBottom:'buns',bunTop:'buns',patty:'patties',cheese:'cheese',lettuceL:'lettuce',tomatoL:'tomato',onionL:'onion',pickleL:'pickles',bacon:'bacon',sauceL:'sauce'}[needed()];if(id)$(`[data-item="${id}"]`)?.classList.add('next')}
function renderStack(){const h=$('#burgerStack');h.innerHTML='';let y=0;S.built.forEach(l=>{const d=document.createElement('div');d.className='layer '+l;d.style.bottom=(y+4)+'px';h.appendChild(d);y+=({bunBottom:21,patty:23,cheese:13,lettuceL:12,tomatoL:12,onionL:9,pickleL:9,bacon:10,sauceL:6,bunTop:30}[l]||10)})}
function updateHUD(){const o=S.orders[0],n=needed();$('#money').textContent='$'+S.money.toFixed(2);$('#score').textContent=S.score;$('#combo').textContent='x'+Math.max(1,S.combo);$('#served').textContent=S.shift+'/10';$('#shiftFill').style.width=Math.min(100,S.shift*10)+'%';$('#time').textContent=Math.max(0,Math.ceil(S.time));$('#perfect').textContent=S.perfect+'/10';$('#perfectFooter').textContent=S.combo>1?`${S.combo} clean orders`:'Keep it clean';hint.textContent=n?(n==='patty'||n==='bacon'?`Cook ${R(n)} until green, then tap it to stack.`:`Next: add ${R(n)}.`):'Burger complete — finish any ordered fries/drink, then serve.';serve.disabled=!!n||(!$('#drinkBtn').classList.contains('done')&&o?.wantsDrink)||(!$('#friesBtn').classList.contains('done')&&o?.wantsFries);updatePatience()}
function syncBuild(){renderPrep();renderStack();updateHUD()}
function cold(type){if(needed()===type){S.built.push(type);S.selected=null;flash(`${R(type)} added`)}else{S.mistakes++;flash(`Not yet — next is ${R(needed())}`)}syncBuild()}
function choose(item){if(item==='buns')return cold(needed()==='bunTop'?'bunTop':'bunBottom');if(item==='patties'||item==='bacon'){S.selected=item==='patties'?'patty':'bacon';return flash(`Tap an empty grill spot for ${R(S.selected)}`)}const m={cheese:'cheese',lettuce:'lettuceL',tomato:'tomatoL',onion:'onionL',pickles:'pickleL',sauce:'sauceL'};if(m[item])cold(m[item])}
function bg(type,stage){return type==='patty'?`url(${stage==='raw'?AS.raw:stage==='ready'?AS.ready:stage==='burned'?AS.burn:AS.cook})`:`url(${stage==='ready'?AS.baconReady:AS.bacon})`}
function renderGrills(now){$$('.grillSlot').forEach((el,i)=>{const g=S.grills[i],sp=el.querySelector('.foodSprite'),bar=el.querySelector('.slotBar i');el.className='grillSlot';if(!g){sp.style.backgroundImage='none';bar.style.width='0';return}const e=now-g.start,cook=g.type==='patty'?4600:3400,burn=cook+(g.type==='patty'?4200:3400);g.stage=e>=burn?'burned':e>=cook?'ready':e<500?'raw':'cooking';sp.style.backgroundImage=bg(g.type,g.stage);bar.style.width=Math.min(100,e/cook*100)+'%';bar.style.background=g.stage==='ready'?'#58df3b':g.stage==='burned'?'#f14c37':'#efaa2e';if(g.stage==='ready')el.classList.add('ready');if(g.stage==='burned')el.classList.add('burned')})}
function grill(i){const g=S.grills[i];if(!g){if(!S.selected)return flash('Select patties or bacon first');S.grills[i]={type:S.selected,start:performance.now(),stage:'raw'};flash(`${R(S.selected)} on the grill`);S.selected=null;return}if(g.stage==='ready'){if(needed()===g.type){S.built.push(g.type);S.grills[i]=null;flash(`${R(g.type)} stacked`);syncBuild()}else flash(`Hold that — next is ${R(needed())}`)}else if(g.stage==='burned'){S.grills[i]=null;S.mistakes++;flash('Burned! Tossed it.')}else flash('Still cooking…')}
function resetExtras(){$('#drinkBtn').classList.remove('done');$('#friesBtn').classList.remove('done')}
function nextOrder(){S.orders.shift();S.orders.push(order(S.orders.length?S.orders[S.orders.length-1].person:PEOPLE[4]));S.orders=S.orders.map((o,i)=>({...o,person:PEOPLE[i]}));S.built=[];S.grills=Array(6).fill(null);S.selected=null;S.mistakes=0;resetExtras();renderCustomers();syncBuild()}
function finish(){const o=S.orders[0],clean=S.mistakes===0,perfect=clean&&o.patience>68;S.combo=clean?S.combo+1:0;S.perfect+=perfect?1:0;const pts=Math.round(o.patience)+(perfect?40:clean?15:0),tip=(.8+o.patience/55)*(S.combo>=4?1.3:S.combo>=2?1.15:1);S.money+=o.recipe.price+(o.wantsDrink?1.5:0)+(o.wantsFries?2:0)+tip;S.score+=pts;S.served++;S.shift++;flash(perfect?`PERFECT! +${pts}`:`Served! +${pts}`);if(S.shift>=10){S.shift=0;S.time=94;flash(`Shift complete — $${S.money.toFixed(2)} earned!`)}nextOrder()}
$$('.ingredient').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.item)));$$('.grillSlot').forEach((b,i)=>b.addEventListener('click',()=>grill(i)));
$('#drinkBtn').addEventListener('click',function(){if(!S.orders[0].wantsDrink)return flash('No drink on this order');this.classList.add('done');flash('Drink ready!');updateHUD()});
$('#friesBtn').addEventListener('click',function(){if(!S.orders[0].wantsFries)return flash('No fries on this order');this.classList.add('done');flash('Fries ready!');updateHUD()});serve.addEventListener('click',finish);
function tick(now){const dt=Math.min(.1,(now-S.last)/1000);S.last=now;S.time-=dt;S.orders.forEach((o,i)=>o.patience=Math.max(0,o.patience-dt*(i?0.20:2.2)));if(S.orders[0]?.patience<=0){S.combo=0;flash('Customer left!');nextOrder()}if(S.time<=0){S.time=94;S.shift=0;flash('New shift started!')}renderGrills(now);updateHUD();requestAnimationFrame(tick)}
S.orders=PEOPLE.map(order);renderCustomers();syncBuild();requestAnimationFrame(tick);
})();