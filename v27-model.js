/* Ben's Burgers v27. All purchases use earned, fictional currency. */
(function(root){
'use strict';
const PEOPLE=['Lou','Maya','Eddie','Nora','Gus'];
const LABELS={bottomBun:'bottom bun',topBun:'top bun',patty:'patty',rawPatty:'raw patty',cheese:'cheese',bacon:'bacon',rawBacon:'raw bacon',lettuce:'lettuce',tomato:'tomato',onion:'onion',pickles:'pickles',sauce:'burger sauce'};
const BASE=['bottomBun','patty','topBun'];
const SHOP=Object.freeze([
 {id:'cheese',name:'Cheese',cost:20,group:'Ingredients',art:'cheese',description:'Unlock cheeseburgers. Unlimited slices after purchase.'},
 {id:'lettuce',name:'Lettuce',cost:25,group:'Ingredients',art:'lettuce',description:'Add fresh lettuce to the menu.'},
 {id:'tomato',name:'Tomato',cost:30,group:'Ingredients',art:'tomato',description:'Unlock juicy tomato burgers.'},
 {id:'sauce',name:'Burger sauce',cost:35,group:'Ingredients',art:'sauce',description:'Unlock your signature burger sauce.'},
 {id:'onion',name:'Onion',cost:40,group:'Ingredients',art:'onion',description:'Add sliced onion to the menu.'},
 {id:'pickles',name:'Pickles',cost:45,group:'Ingredients',art:'pickles',description:'Unlock tangy pickle burgers.'},
 {id:'bacon',name:'Bacon',cost:65,group:'Ingredients',art:'rawBacon',description:'Unlock bacon burgers. Cook bacon on a burner first.'},
 {id:'burner2',name:'Burner 2',cost:75,group:'Equipment',requires:[],description:'Cook two portions at the same time.'},
 {id:'burner3',name:'Burner 3',cost:125,group:'Equipment',requires:['burner2'],description:'A third cooking spot for your growing kitchen.'},
 {id:'burner4',name:'Burner 4',cost:200,group:'Equipment',requires:['burner3'],description:'Unlock the last spot on the griddle.'},
 {id:'fryer',name:'Fries fryer',cost:100,group:'Equipment',description:'Customers can order fries. Tap to cook, then collect.'},
 {id:'drinkMachine',name:'Cola fountain',cost:120,group:'Equipment',description:'Customers can order cola. Fill a cup, then collect.'},
 {id:'counter2',name:'Neighborhood diner',cost:250,group:'Store expansion',requires:['burner2'],minServed:10,description:'Two customers at a time, starting next shift. Optional.'},
 {id:'counter3',name:'Bigger diner',cost:400,group:'Store expansion',requires:['counter2','burner3'],minServed:20,description:'Three customers at a time, starting next shift. Optional.'}
].map(x=>Object.freeze(x)));
const EXTRA_ORDER=['cheese','bacon','lettuce','tomato','onion','pickles','sauce'];
const MENU=[
 {id:'classic',name:'Classic burger',price:7,layers:['bottomBun','patty','lettuce','tomato','sauce','topBun']},
 {id:'baconCheese',name:'Bacon cheeseburger',price:8,layers:['bottomBun','patty','cheese','bacon','topBun']},
 {id:'pickleOnion',name:'Pickle & onion burger',price:7,layers:['bottomBun','patty','onion','pickles','sauce','topBun']}
];
const count=(a,id)=>a.filter(v=>v===id).length;
const same=(a,b)=>a.length===b.length&&a.every(id=>count(a,id)===count(b,id));
const integer=(v,max=100000000)=>Number.isSafeInteger(v)&&v>=0&&v<=max;
class Kitchen{
 constructor(saved=null){
  this.unlocks=[];this.cashCents=0;this.earnedCents=0;this.shift=1;this.capacity=1;this.shiftServed=0;this.served=0;this.score=0;this.combo=0;this.perfect=0;this.serial=0;this.selected=null;this.featured=null;this.featuredSide=null;
  this.grills=Array(4).fill(null);this.jobs={fries:null,drink:null};this.paused=true;this.phase='playing';this.phaseLeft=0;this.message='Buns, patties, one burner. Build your burger business!';this.orders=[];this.activeId=null;
  this.loaded=this.restore(saved);
  if(!this.orders.length){this.orders=[this.makeOrder()];this.activeId=this.orders[0].id;}
 }
 get money(){return this.cashCents/100;}
 get burners(){return 1+['burner2','burner3','burner4'].filter(id=>this.owns(id)).length;}
 get storeCapacity(){return this.owns('counter3')?3:this.owns('counter2')?2:1;}
 get active(){return this.orders.find(o=>o.id===this.activeId)||this.orders[0];}
 owns(id){return this.unlocks.includes(id);}
 hasIngredient(id){id=({rawPatty:'patty',rawBacon:'bacon'})[id]||id;return BASE.includes(id)||EXTRA_ORDER.includes(id)&&this.owns(id);}
 hasStation(type){return this.owns(type==='fries'?'fryer':'drinkMachine');}
 menu(){
  const recipes=[{id:'plain',name:'Hamburger',price:5,layers:[...BASE]}];
  EXTRA_ORDER.filter(id=>this.owns(id)).forEach(id=>recipes.push({id:'single-'+id,name:id==='cheese'?'Cheeseburger':id==='sauce'?'Sauce burger':LABELS[id][0].toUpperCase()+LABELS[id].slice(1)+' burger',price:5+(id==='bacon'?2:id==='cheese'?1.25:.75),layers:['bottomBun','patty',id,'topBun']}));
  recipes.push(...MENU.filter(r=>r.layers.every(id=>this.hasIngredient(id))));
  const all=EXTRA_ORDER.filter(id=>this.owns(id));
  if(all.length>=2)recipes.push({id:'house-'+all.join('-'),name:all.length===7?'Fully loaded burger':'House special',price:5+all.reduce((sum,id)=>sum+(id==='bacon'?2:.75),0),layers:['bottomBun','patty',...all,'topBun']});
  return recipes;
 }
 makeOrder(){
  const n=this.serial++,menu=this.menu();let recipe=menu[n%menu.length];
  if(this.featured){recipe=menu.find(r=>r.id==='single-'+this.featured)||recipe;this.featured=null;}
  const fries=this.hasStation('fries')&&(n%3!==1||this.featuredSide==='fries');
  const drink=this.hasStation('drink')&&(n%3!==2||this.featuredSide==='drink');this.featuredSide=null;
  return{id:n+1,person:n%5,recipe:{...recipe,layers:[...recipe.layers]},built:[],fries,drink,friesReady:false,drinkReady:false,patience:100,mistakes:0,arrivalLeft:1400};
 }
 say(message,ok=true){this.message=message;return{ok,message};}
 playable(){return !this.paused&&this.phase==='playing'&&this.active.arrivalLeft<=0;}
 unavailable(){return this.say(this.paused?'Resume the game first.':this.active.arrivalLeft>0?`${PEOPLE[this.active.person]} is walking up to the counter.`:'Please wait for the next customer.',false);}
 remaining(o=this.active){return o?o.recipe.layers.filter((id,i,a)=>count(o.built,id)<count(a.slice(0,i+1),id)):[];}
 canAdd(id,o=this.active){if(!o||!this.hasIngredient(id)||!this.remaining(o).includes(id))return false;if(!o.built.length)return id==='bottomBun';if(id==='bottomBun'||o.built.includes('topBun'))return false;if(id==='topBun')return this.remaining(o).length===1;return id==='patty'||o.built.includes('patty');}
 ready(o=this.active){return !!o&&same(o.built,o.recipe.layers)&&o.built[0]==='bottomBun'&&o.built.at(-1)==='topBun'&&(!o.fries||o.friesReady)&&(!o.drink||o.drinkReady);}
 hint(){
  const o=this.active;if(this.phase==='served')return 'Thank you! Your customer is heading out.';if(this.phase==='left')return 'A fresh customer will be here shortly.';if(o.arrivalLeft>0)return `${PEOPLE[o.person]} is walking up…`;
  if(this.selected)return `${LABELS[this.selected]} selected — tap an empty burner.`;
  if(this.ready())return `Everything is ready. Tap SERVE ${PEOPLE[o.person].toUpperCase()}.`;
  const rem=this.remaining();if(rem.length){const id=rem.find(i=>this.canAdd(i));if(id==='patty'||id==='bacon'){
   const ready=this.grills.findIndex(g=>g&&g.type===id&&this.stage(g)==='ready');if(ready>=0)return `Tap the READY ${id} on burner ${ready+1}.`;
   if(this.grills.some(g=>g&&g.type===id&&['raw','cooking'].includes(this.stage(g))))return `Your ${id} is cooking. Tap it when it says READY.`;
   return `Tap RAW ${id==='patty'?'PATTY':'BACON'}, then an empty burner.`;
  }return `Next: ${LABELS[id]||'finish your burger'}. Tap its ingredient tray.`;}
  if(o.fries&&!o.friesReady)return this.jobs.fries?'Collect the fries when READY.':'Burger done. Tap START FRYER.';
  return this.jobs.drink?'Collect the cola when READY.':'Burger done. Tap FILL COLA.';
 }
 pick(id){if(!this.playable())return this.unavailable();this.selected=null;if(!this.hasIngredient(id))return this.say('Unlock that ingredient in the shop first.',false);if(id==='rawPatty'||id==='rawBacon'){this.selected=id==='rawPatty'?'patty':'bacon';return this.say(this.hint());}if(['patty','bacon'].includes(id))return this.say('Cook raw meat on the griddle first.',false);return this.add(id);}
 add(id){if(!this.canAdd(id)){this.active.mistakes++;return this.say(!this.active.recipe.layers.includes(id)?`This burger does not need ${LABELS[id]||'that ingredient'}.`:this.hint(),false);}this.active.built.push(id);return this.say(`${LABELS[id]} added.`);}
 stage(g){const cook=g.type==='patty'?5000:4000;return g.elapsed<cook*.4?'raw':g.elapsed<cook?'cooking':g.elapsed<cook+10000?'ready':'burned';}
 grillTap(index){if(!this.playable())return this.unavailable();if(!Number.isInteger(index)||index<0||index>=4)return this.say('Unknown burner.',false);if(index>=this.burners)return this.say('Buy this burner in the upgrade shop.',false);const g=this.grills[index];
  if(!g){if(!this.selected)return this.say('Select RAW PATTY'+(this.owns('bacon')?' or RAW BACON':'')+' first.',false);this.grills[index]={type:this.selected,elapsed:0};const name=this.selected;this.selected=null;return this.say(`${name} is cooking on burner ${index+1}.`);}
  const stage=this.stage(g);if(stage==='burned'){this.grills[index]=null;this.active.mistakes++;return this.say('Burned food discarded. Start a fresh portion.',false);}if(stage!=='ready')return this.say('Still cooking. Wait for READY.',false);this.selected=null;const result=this.add(g.type);if(result.ok)this.grills[index]=null;return result;
 }
 side(type){if(!this.playable())return this.unavailable();if(!['fries','drink'].includes(type))return this.say('Unknown station.',false);if(!this.hasStation(type))return this.say('Buy this station in the upgrade shop.',false);this.selected=null;const job=this.jobs[type];
  if(job){if(job.elapsed<job.duration)return this.say('Wait until READY, then collect.',false);const owner=this.orders.find(o=>o.id===job.orderId);this.jobs[type]=null;if(!owner)return this.say('That customer has left.',false);owner[type+'Ready']=true;return this.say(`${type==='fries'?'Fries':'Cola'} added to ${PEOPLE[owner.person]}’s tray.`);}
  const o=this.active;if(!o[type])return this.say(`No ${type==='fries'?'fries':'cola'} on this order.`,false);if(o[type+'Ready'])return this.say('Already on this tray.',false);this.jobs[type]={orderId:o.id,elapsed:0,duration:type==='fries'?6000:3000};return this.say(type==='fries'?'Basket lowered. Fries are cooking.':'Cup placed. Cola is filling.');
 }
 undo(){if(!this.playable())return this.unavailable();this.selected=null;const id=this.active.built.pop();return this.say(id?`Removed ${LABELS[id]}.`:'Nothing to undo.');}
 chooseOrder(id){if(this.paused||this.phase!=='playing'||!this.orders.some(o=>o.id===id))return this.say('Order unavailable.',false);this.activeId=id;this.selected=null;return this.say(this.hint());}
 serve(){if(!this.playable())return this.unavailable();this.selected=null;if(!this.ready())return this.say(this.hint(),false);const o=this.active,perfect=o.mistakes===0&&o.patience>=65;this.combo=o.mistakes?0:this.combo+1;const points=Math.round(o.patience)+(perfect?40:10);
  const payout=Math.round(100*(o.recipe.price+(o.fries?2:0)+(o.drink?1.5:0)+(o.patience/50)*(this.combo>=3?1.2:1)));
  this.cashCents+=payout;this.earnedCents+=payout;this.score+=points;this.served++;this.shiftServed++;this.perfect+=Number(perfect);this.phase='served';this.phaseLeft=1700;return this.say(`${perfect?'Perfect!':'Thank you!'} +$${(payout/100).toFixed(2)} · +${points} points`);
 }
 purchaseStatus(id){const item=SHOP.find(x=>x.id===id);if(!item)return{ok:false,message:'Unknown upgrade.'};if(this.owns(id))return{ok:false,message:'Already owned.'};const missing=(item.requires||[]).filter(v=>!this.owns(v));if(missing.length)return{ok:false,message:'Buy '+missing.map(v=>SHOP.find(x=>x.id===v).name).join(' and ')+' first.'};if(this.served<(item.minServed||0))return{ok:false,message:`Serve ${item.minServed} meals first (${this.served}/${item.minServed}).`};if(this.cashCents<item.cost*100)return{ok:false,message:`Need $${((item.cost*100-this.cashCents)/100).toFixed(2)} more.`};return{ok:true,message:'Ready to buy.'};}
 buy(id){const status=this.purchaseStatus(id);if(!status.ok)return this.say(status.message,false);const item=SHOP.find(x=>x.id===id);this.cashCents-=item.cost*100;this.unlocks.push(id);this.selected=null;
  if(item.group==='Ingredients')this.featured=id;if(id==='fryer')this.featuredSide='fries';if(id==='drinkMachine')this.featuredSide='drink';
  return this.say(`${item.name} unlocked! ${item.group==='Ingredients'?'New customers can order it.':id.startsWith('counter')?'Extra customers start next shift.':'Ready to use.'}`);
 }
 replaceOrder(id){const i=this.orders.findIndex(o=>o.id===id);if(i<0)return;this.orders[i]=this.makeOrder();for(const t of ['fries','drink'])if(this.jobs[t]?.orderId===id)this.jobs[t]=null;if(this.activeId===id)this.activeId=this.orders[i].id;this.selected=null;}
 advance(ms){
  if(this.paused||!Number.isFinite(ms)||ms<=0||this.phase==='summary')return;
  if(this.phase==='served'||this.phase==='left'){this.phaseLeft-=ms;if(this.phaseLeft<=0){if(this.phase==='served'&&this.shiftServed>=5){this.phase='summary';this.say('Shift complete! Visit the shop or continue.');}else{this.replaceOrder(this.activeId);this.phase='playing';this.say('Here comes your next customer.');}this.phaseLeft=0;}return;}
  this.grills.forEach(g=>{if(g)g.elapsed+=ms;});Object.values(this.jobs).forEach(j=>{if(j)j.elapsed=Math.min(j.duration,j.elapsed+ms);});
  for(const o of [...this.orders]){if(o.arrivalLeft>0){o.arrivalLeft=Math.max(0,o.arrivalLeft-ms);continue;}o.patience=Math.max(0,o.patience-ms/Math.max(800,1100-this.shift*20));if(o.patience===0){this.combo=0;if(o.id===this.activeId){this.phase='left';this.phaseLeft=1400;this.say('Customer left. The next order is a fresh start.',false);}else this.replaceOrder(o.id);}}
 }
 continueShift(){if(this.phase!=='summary')return false;this.shift++;this.shiftServed=0;this.perfect=0;this.capacity=this.storeCapacity;this.grills=Array(4).fill(null);this.jobs={fries:null,drink:null};this.orders=Array.from({length:this.capacity},()=>this.makeOrder());this.activeId=this.orders[0].id;this.phase='playing';this.paused=false;this.selected=null;this.say(`Shift ${this.shift}. ${this.capacity===1?'One customer at a time.':'Your expanded diner is open!'}`);return true;}
 snapshot(){return{version:27,unlocks:[...this.unlocks],cashCents:this.cashCents,earnedCents:this.earnedCents,shift:this.shift,capacity:this.capacity,shiftServed:this.shiftServed,served:this.served,score:this.score,combo:this.combo,perfect:this.perfect,serial:this.serial,featured:this.featured,featuredSide:this.featuredSide,orders:JSON.parse(JSON.stringify(this.orders)),activeId:this.activeId,grills:JSON.parse(JSON.stringify(this.grills)),jobs:JSON.parse(JSON.stringify(this.jobs)),phase:this.phase,phaseLeft:this.phaseLeft};}
 restore(s){
  if(!s||s.version!==27||!Array.isArray(s.unlocks)||!integer(s.cashCents)||!integer(s.earnedCents))return false;
  const wanted=new Set(s.unlocks);this.unlocks=[];for(const item of SHOP)if(wanted.has(item.id)&&(item.requires||[]).every(v=>this.owns(v.id||v)))this.unlocks.push(item.id);
  this.cashCents=s.cashCents;this.earnedCents=Math.max(s.earnedCents,s.cashCents);
  for(const k of ['served','score','serial','combo','perfect'])this[k]=integer(s[k])?s[k]:0;
  this.shift=integer(s.shift)&&s.shift>0?s.shift:1;this.shiftServed=integer(s.shiftServed,5)?s.shiftServed:0;this.capacity=integer(s.capacity,3)&&s.capacity>=1?Math.min(s.capacity,this.storeCapacity):1;
  const menu=this.menu();
  if(Array.isArray(s.orders))for(const raw of s.orders.slice(0,this.capacity)){
   if(!raw||!integer(raw.id)||raw.id===0||!integer(raw.person,4)||!raw.recipe||!Array.isArray(raw.built))continue;
   if(!Array.isArray(raw.recipe.layers)||!raw.recipe.layers.every(x=>typeof x==='string')||this.orders.some(o=>o.id===raw.id))continue;
   let recipe=menu.find(r=>r.id===raw.recipe.id&&same(r.layers,raw.recipe.layers));
   // Existing house-special tickets survive newly purchased toppings and a reload.
   if(!recipe){const extras=EXTRA_ORDER.filter(id=>raw.recipe.layers.includes(id));const layers=['bottomBun','patty',...extras,'topBun'];if(extras.length>=2&&raw.recipe.id==='house-'+extras.join('-')&&layers.every(id=>this.hasIngredient(id))&&same(layers,raw.recipe.layers))recipe={id:raw.recipe.id,name:extras.length===7?'Fully loaded burger':'House special',price:5+extras.reduce((sum,id)=>sum+(id==='bacon'?2:.75),0),layers};}if(!recipe)continue;
   const built=raw.built;const valid=built.length<=recipe.layers.length&&built.every(v=>recipe.layers.includes(v)&&count(built,v)<=count(recipe.layers,v))&&(!built.length||built[0]==='bottomBun')&&(!built.includes('topBun')||same(built,recipe.layers)&&built.at(-1)==='topBun')&&(built.length<2||built[1]==='patty');if(!valid)continue;
   this.orders.push({id:raw.id,person:raw.person,recipe:{...recipe,layers:[...recipe.layers]},built:[...built],fries:this.hasStation('fries')&&!!raw.fries,drink:this.hasStation('drink')&&!!raw.drink,friesReady:!!raw.friesReady,drinkReady:!!raw.drinkReady,patience:Number.isFinite(raw.patience)?Math.max(0,Math.min(100,raw.patience)):100,mistakes:integer(raw.mistakes)?raw.mistakes:0,arrivalLeft:Number.isFinite(raw.arrivalLeft)?Math.max(0,Math.min(1400,raw.arrivalLeft)):1400});
  }
  this.serial=Math.max(this.serial,...this.orders.map(o=>o.id),0);this.activeId=this.orders.some(o=>o.id===s.activeId)?s.activeId:this.orders[0]?.id;
  if(!this.orders.length){this.phase='playing';this.shiftServed=this.shiftServed===5?0:this.shiftServed;return true;}
  this.phase=['playing','served','left','summary'].includes(s.phase)?s.phase:'playing';this.phaseLeft=Number.isFinite(s.phaseLeft)?Math.max(0,Math.min(1700,s.phaseLeft)):0;
  if(this.shiftServed>=5)this.phase='summary';if(this.phase==='served'&&!this.ready())this.phase='playing';
  if(Array.isArray(s.grills))s.grills.slice(0,this.burners).forEach((g,i)=>{if(g&&['patty','bacon'].includes(g.type)&&this.hasIngredient(g.type)&&Number.isFinite(g.elapsed)&&g.elapsed>=0)this.grills[i]={type:g.type,elapsed:Math.min(60000,g.elapsed)};});
  for(const t of ['fries','drink']){const j=s.jobs?.[t],owner=this.orders.find(o=>o.id===j?.orderId);if(this.hasStation(t)&&owner&&owner[t]&&!owner[t+'Ready']&&Number.isFinite(j.elapsed)&&j.elapsed>=0)this.jobs[t]={orderId:j.orderId,duration:t==='fries'?6000:3000,elapsed:Math.min(t==='fries'?6000:3000,j.elapsed)};}
  this.featured=EXTRA_ORDER.includes(s.featured)&&this.owns(s.featured)?s.featured:null;this.featuredSide=['fries','drink'].includes(s.featuredSide)&&this.hasStation(s.featuredSide)?s.featuredSide:null;return true;
 }
}
const api={Kitchen,SHOP,PEOPLE,LABELS,BASE,same};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BB27=api;
})(typeof globalThis!=='undefined'?globalThis:this);
