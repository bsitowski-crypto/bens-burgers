(()=>{
const q=id=>document.getElementById(id);
const G={patty:{stage:'empty',timers:[]},bacon:{stage:'empty',timers:[]}};
let rawPick=null,cookedPick=null;
const grillEl=q('grill'), patty=q('grillPatty');
patty.className='dualFood dualPatty';
patty.setAttribute('aria-label','Patty grill spot');
let bacon=q('grillBacon');
if(!bacon){bacon=document.createElement('span');bacon.id='grillBacon';bacon.className='dualFood dualBacon';grillEl.appendChild(bacon)}
let rb=q('rawBacon');
if(!rb){rb=document.createElement('button');rb.id='rawBacon';rb.className='rawBaconBin';rb.innerHTML='<span class="rawBaconVisual"></span><span class="meatBinLabel">BACON</span>';document.querySelector('.kitchen .station').appendChild(rb)}
if(!q('raw').querySelector('.pattyLabel')){let l=document.createElement('span');l.className='meatBinLabel pattyLabel';l.textContent='PATTY';q('raw').appendChild(l)}
const shelf=document.querySelector('.foodShelf'); const old=q('bacon'); if(old)old.remove();
let sauce=q('sauce');
if(!sauce){sauce=document.createElement('button');sauce.id='sauce';sauce.className='foodItem sauceItem';sauce.innerHTML='<span class="sauceBottle"></span><span class="foodLabel">BURGER SAUCE</span>';shelf.appendChild(sauce)}
const css=document.createElement('style');css.textContent=`
.grill{overflow:hidden!important}.grill:before{content:"";position:absolute;left:50%;top:7%;bottom:7%;width:2px;background:#888;opacity:.7}
.rawbin{left:4%!important;width:38%!important}.rawBaconBin{position:absolute;right:4%;bottom:4%;width:38%;height:20%;border:3px solid #777;border-radius:7px;background:linear-gradient(#eee,#c7cac6);display:flex;align-items:center;justify-content:center;overflow:hidden}.rawBaconBin.selected,.rawbin.selected{outline:4px solid #f1ca51!important}
.meatBinLabel{position:absolute;left:0;right:0;bottom:1px;text-align:center;font-size:10px;font-weight:950;color:#333}.rawBaconVisual{width:68%;height:34%;border-radius:14px 7px;background:repeating-linear-gradient(92deg,#8b211d 0 8%,#d9583e 9% 18%,#f0a586 19% 25%,#b72e26 26% 37%,#f0b596 38% 44%,#8b211d 45% 56%);border:1px solid #651b17;box-shadow:0 7px 0 -1px #a82c24,0 14px 0 -2px #7d211c,0 4px 6px #0006;transform:rotate(-5deg)}
.dualFood{position:absolute;display:none;z-index:5}.dualFood.ready{filter:drop-shadow(0 0 8px #78e35f)}.dualFood.chosen{filter:drop-shadow(0 0 11px #ffd95a)}
.dualPatty{left:8%;top:20%;width:34%;height:60%;border-radius:49%;border:2px solid #342018;box-shadow:inset 0 5px 8px #fff2,inset 0 -7px 10px #0005,0 6px 8px #0008}.dualPatty.raw{background:repeating-radial-gradient(ellipse,#dc6964 0 4px,#c64f4b 5px 9px,#ac3e3a 10px 12px)}.dualPatty.cooking{background:repeating-linear-gradient(18deg,transparent 0 12px,#52291f55 13px 15px,transparent 16px 24px),radial-gradient(ellipse,#aa6246,#75402f 70%)}.dualPatty.ready{background:repeating-linear-gradient(18deg,transparent 0 11px,#25140faa 12px 14px,transparent 15px 23px),radial-gradient(ellipse,#87503b,#4b2b21 72%)}.dualPatty.burned{background:radial-gradient(ellipse,#382a25,#151210)}
.dualBacon{right:6%;top:32%;width:39%;height:34%;border-radius:15px 8px;border:1px solid #601b16;box-shadow:0 5px 7px #0007}.dualBacon.raw{background:repeating-linear-gradient(92deg,#9d2820 0 8%,#df6044 9% 18%,#f2b091 19% 25%,#b5362b 26% 37%,#f0bea0 38% 44%,#97261f 45% 56%)}.dualBacon.cooking{background:repeating-linear-gradient(92deg,#7f211b 0 8%,#c24d35 9% 18%,#df8e6d 19% 25%,#9a2a23 26% 37%,#df9879 38% 44%,#752019 45% 56%)}.dualBacon.ready{background:repeating-linear-gradient(92deg,#651a16 0 8%,#a63728 9% 18%,#c66d50 19% 25%,#7d211c 26% 37%,#cf8062 38% 44%,#591814 45% 56%)}.dualBacon.burned{background:#38201b}
.foodShelf{gap:3%!important;padding:3%!important}.foodLabel{font-size:9px!important;z-index:9!important}.sauceBottle{position:absolute;left:34%;right:34%;top:10%;height:50%;border-radius:8px 8px 14px 14px;background:linear-gradient(90deg,#d97f2b,#f1ad50,#d77c28);border:2px solid #a75c20;box-shadow:inset 4px 0 #fff2,0 4px 5px #0005}.sauceBottle:before{content:"";position:absolute;left:28%;right:28%;top:-14%;height:18%;background:#eee4d4;border:1px solid #999}
.layer.sauce{width:32%!important;height:3.8%!important;background:repeating-linear-gradient(12deg,transparent 0 9%,#e98f35 10% 18%,#ffc06e 19% 24%,#df842f 25% 34%,transparent 35% 44%)!important;border-radius:50%!important;filter:drop-shadow(0 2px 2px #0005)}
`;
document.head.appendChild(css);

function target(){if(order==='bacon')return ['bottomBun','patty','cheese','sauce','bacon','topBun'];if(order==='cheese')return ['bottomBun','patty','cheese','sauce','topBun'];return ['bottomBun','patty','sauce','topBun']}
function need(){return target()[built.length]}
function el(t){return t==='patty'?patty:bacon}
function timersOff(t){G[t].timers.forEach(clearTimeout);G[t].timers=[]}
function draw(t){const e=el(t),s=G[t].stage;e.className='dualFood '+(t==='patty'?'dualPatty':'dualBacon')+(s==='empty'?'':' '+s)+(cookedPick===t?' chosen':'');e.style.display=s==='empty'?'none':'block'}
function cook(t){if(G[t].stage!=='empty')return flash((t==='patty'?'Patty':'Bacon')+' already on grill');G[t].stage='raw';draw(t);const ready=t==='patty'?5800:3900,burn=t==='patty'?7000:6000;G[t].timers.push(setTimeout(()=>{if(G[t].stage==='raw'){G[t].stage='cooking';draw(t)}},t==='patty'?1200:700));G[t].timers.push(setTimeout(()=>{if(G[t].stage==='raw'||G[t].stage==='cooking'){G[t].stage='ready';draw(t);flash(t==='patty'?'Patty ready!':'Bacon ready!')}},ready));G[t].timers.push(setTimeout(()=>{if(G[t].stage==='ready'){G[t].stage='burned';if(cookedPick===t)cookedPick=null;draw(t)}},ready+burn))}
function choose(t){if(G[t].stage==='burned'){timersOff(t);G[t].stage='empty';draw(t);return flash('Burned '+t+' tossed')}if(G[t].stage!=='ready')return flash('Wait until the '+t+' is ready');cookedPick=t;draw('patty');draw('bacon');q('plateBun').classList.add('readyTarget');flash('Tap the burger to add the '+t)}
function render2(){const h=q('layers');h.innerHTML='';let y=25;built.forEach(x=>{if(x==='bottomBun')return;let d=document.createElement('div');d.className='layer '+x;d.style.bottom=y+'%';h.appendChild(d);y+=x==='patty'?6.4:x==='cheese'?3.8:x==='sauce'?2.5:x==='bacon'?4.2:0});q('cust').classList.toggle('readyToServe',JSON.stringify(built)===JSON.stringify(target())}
function reset2(){['patty','bacon'].forEach(t=>{timersOff(t);G[t].stage='empty';draw(t)});rawPick=null;cookedPick=null;q('raw').classList.remove('selected');rb.classList.remove('selected')}
function next2(){built=['bottomBun'];render2();reset2();let r=Math.random();order=r<.42?'cheese':r<.68?'plain':'bacon';let i=served%names.length;q('name').textContent=names[i];q('cust').textContent=people[i];q('order').textContent=order==='bacon'?'One bacon cheeseburger with burger sauce, please!':order==='cheese'?'One cheeseburger with burger sauce, please!':'One hamburger with burger sauce, please!';patience=100;clearInterval(timer);timer=setInterval(()=>{patience=Math.max(0,patience-.7);q('patnum').textContent=Math.round(patience);q('patbar').style.width=patience+'%';if(!patience){clearInterval(timer);served++;hud();flash('Customer left!');setTimeout(next2,700)}},300)}
q('raw').onclick=()=>{rawPick='patty';q('raw').classList.add('selected');rb.classList.remove('selected');flash('Patty selected — tap grill')};
rb.onclick=()=>{rawPick='bacon';rb.classList.add('selected');q('raw').classList.remove('selected');flash('Bacon selected — tap grill')};
grillEl.onclick=e=>{if(e.target===patty||e.target===bacon)return;if(!rawPick)return flash('Select patty or bacon first');let t=rawPick;rawPick=null;q('raw').classList.remove('selected');rb.classList.remove('selected');cook(t)};
patty.onclick=e=>{e.stopPropagation();choose('patty')};bacon.onclick=e=>{e.stopPropagation();choose('bacon')};
q('plateBun').onclick=()=>{if(!cookedPick)return flash('Select a cooked item first');if(need()!==cookedPick)return flash(need()==='cheese'?'Add cheese first':need()==='sauce'?'Add burger sauce first':need()==='bacon'?'Add bacon next':'That is not next');let t=cookedPick;cookedPick=null;timersOff(t);G[t].stage='empty';draw(t);built.push(t);render2();q('plateBun').classList.remove('readyTarget')};
q('cheese').onclick=()=>{if(need()!=='cheese')return flash(order==='plain'?'No cheese on this order':'Add patty first');built.push('cheese');render2()};
sauce.onclick=()=>{if(need()!=='sauce')return flash(need()==='patty'?'Add patty first':need()==='cheese'?'Add cheese first':'Sauce is already added');built.push('sauce');render2()};
q('bun').onclick=()=>{if(need()!=='topBun')return flash(need()==='bacon'?'Add bacon first':need()==='sauce'?'Add burger sauce first':'Finish the fillings first');built.push('topBun');render2();flash('Burger finished!')};
q('cust').onclick=()=>{if(JSON.stringify(built)!==JSON.stringify(target()))return flash('Finish the burger first');clearInterval(timer);let base=order==='plain'?4:order==='cheese'?4.75:5.75,earn=base+2+patience/50;money+=earn;score+=Math.round(patience);served++;hud();flash('Served! +$'+earn.toFixed(2));setTimeout(next2,700)};
clearTimeout(gt);next2();
})();