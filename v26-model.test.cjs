'use strict';
const assert=require('node:assert/strict');
const {Kitchen,RECIPES,same}=require('./v26-game.js');
const Art=require('./v26-art.js');
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name);}
function open(recipe=RECIPES[1],fries=false,drink=false){const g=new Kitchen();g.paused=false;Object.assign(g.active,{recipe,fries,drink});return g;}
function cook(g,id){assert(g.pick(id==='patty'?'rawPatty':'rawBacon').ok);const i=g.grills.findIndex((v,i)=>!v&&(i<3||g.capacity>1));assert(g.grillTap(i).ok);g.advance(id==='patty'?5000:4000);assert.equal(g.stage(g.grills[i]),'ready');assert(g.grillTap(i).ok);}
function build(g){assert(g.pick('bottomBun').ok);cook(g,'patty');for(const id of g.active.recipe.layers.slice(2,-1).reverse()){if(id==='bacon')cook(g,id);else assert(g.pick(id).ok);}assert(g.pick('topBun').ok);}
for(const recipe of RECIPES)for(const extras of [[false,false],[true,false],[false,true],[true,true]])test(recipe.name+' / sides '+extras,()=>{
 const g=open(recipe,...extras);assert(!g.serve().ok);build(g);assert(same(g.active.built,recipe.layers));
 if(extras[0]){assert(g.side('fries').ok);assert(!g.side('fries').ok);g.advance(6000);assert(g.side('fries').ok);}
 if(extras[1]){assert(g.side('drink').ok);g.advance(3000);assert(g.side('drink').ok);}
 assert(g.ready());assert(g.serve().ok);const score=g.score;assert(!g.serve().ok);assert.equal(g.score,score);g.advance(1100);assert.equal(g.phase,'playing');assert.deepEqual(g.active.built,[]);assert.equal(g.active.friesReady,false);assert.equal(g.active.drinkReady,false);
 const svg=Art.burger(recipe.layers,true);const layers=[...svg.matchAll(/data-layer="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(layers,recipe.layers);
});
test('Unwanted ingredient never changes burger; stale meat selection cleared',()=>{const g=open();g.pick('bottomBun');g.pick('rawBacon');assert.equal(g.selected,'bacon');assert(!g.pick('onion').ok);assert.equal(g.selected,null);assert.deepEqual(g.active.built,['bottomBun']);assert(!g.grillTap(0).ok);assert.equal(g.grills[0],null);});
test('Raw meat cannot be added before cooking',()=>{const g=open();g.pick('bottomBun');g.pick('rawPatty');g.grillTap(0);assert(!g.grillTap(0).ok);g.advance(4999);assert(!g.grillTap(0).ok);assert.deepEqual(g.active.built,['bottomBun']);g.advance(1);assert(g.grillTap(0).ok);});
test('Ready meat cannot substitute for a different requested ingredient',()=>{const g=open();g.pick('bottomBun');g.pick('rawBacon');g.grillTap(0);g.advance(4000);assert(!g.grillTap(0).ok);assert.equal(g.grills[0].type,'bacon');});
test('Burned meat discarded, not added',()=>{const g=open();g.pick('bottomBun');g.pick('rawPatty');g.grillTap(0);g.advance(15000);assert.equal(g.stage(g.grills[0]),'burned');g.grillTap(0);assert.equal(g.grills[0],null);assert.deepEqual(g.active.built,['bottomBun']);});
test('Paused game freezes all three station timers and patience',()=>{const g=open(RECIPES[1],true,true);g.pick('rawPatty');g.grillTap(0);g.side('fries');g.side('drink');g.paused=true;const before=JSON.stringify(g);g.advance(60000);assert.equal(JSON.stringify(g),before);g.paused=false;g.advance(3000);assert.equal(g.jobs.drink.elapsed,3000);});
test('Undo removes only last layer; top bun gated until fillings complete',()=>{const g=open();g.pick('bottomBun');assert(!g.pick('topBun').ok);cook(g,'patty');g.undo();assert.deepEqual(g.active.built,['bottomBun']);});
test('Five successful orders trigger summary and reset only when continued',()=>{const g=open();for(let n=0;n<5;n++){Object.assign(g.active,{recipe:RECIPES[0],fries:false,drink:false});build(g);g.serve();g.advance(1100);}assert.equal(g.phase,'summary');assert.equal(g.shiftServed,5);const earned=g.money;g.continueShift();assert.equal(g.shift,2);assert.equal(g.capacity,1);assert.equal(g.shiftServed,0);assert.equal(g.money,earned);});
test('Expansion is opt-in and unlocks second customer after shift 2',()=>{const g=open();g.phase='summary';g.shift=2;g.continueShift(true);assert.equal(g.capacity,2);assert.equal(g.orders.length,2);assert.notEqual(g.orders[0].id,g.orders[1].id);});
test('Side jobs remain tied to their owner when customers are switched',()=>{const g=open();g.capacity=2;g.orders.push(g.makeOrder());g.orders.forEach(o=>{o.fries=true;o.drink=true;});const first=g.active;g.side('fries');g.chooseOrder(g.orders[1].id);g.side('drink');g.advance(6000);g.side('fries');assert.equal(first.friesReady,true);assert.equal(g.active.friesReady,false);g.side('drink');assert.equal(g.active.drinkReady,true);assert.equal(first.drinkReady,false);});
test('Timed-out orders clear their side jobs and selection',()=>{const g=open(RECIPES[0],true,true);const id=g.active.id;g.side('fries');g.side('drink');g.pick('rawPatty');g.advance(100000);assert.notEqual(g.active.id,id);assert.equal(g.jobs.fries,null);assert.equal(g.jobs.drink,null);assert.equal(g.selected,null);});
test('All recipe fillings accepted in any order after cooked patty',()=>{for(const r of RECIPES){const g=open(r);build(g);assert(g.ready());}});
test('Every recipe preview contains the exact burger layers',()=>{for(const r of RECIPES){const v=Art.burger(r.layers,true);assert.equal((v.match(/data-layer=/g)||[]).length,r.layers.length);for(const id of r.layers)assert(v.includes(`data-layer="${id}"`));}});
console.log(`\n${passed} model/renderer tests passed.`);
