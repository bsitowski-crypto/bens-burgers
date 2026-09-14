'use strict';
const assert = require('node:assert/strict');
const { SoundEngine, SoundDirector, actionCue, preferences, transitions, snapshot, PREF_KEY } = require('./sound-v29.js');
const { Kitchen } = require('./v28-model.js');
let passed = 0;
function test(name, fn) { fn(); console.log(`PASS ${++passed}: ${name}`); }
class Spy {
  constructor(){this.effects=[];this.loops={};this.stops=0;}
  play(e){this.effects.push(e);}
  setLoops(l){this.loops=l;}
  stopAll(){this.loops={};this.stops++;}
}
function setup(){const game=new Kitchen(),engine=new Spy(),director=new SoundDirector(engine);director.sync(game);game.paused=false;director.sync(game);game.advance(2200);director.sync(game);engine.effects=[];return{game,engine,director};}
const ok={ok:true},no={ok:false};
test('defaults are enabled, moderate volume, with no context construction',()=>{let made=0;const e=new SoundEngine({contextFactory:()=>{made++;}});assert.equal(made,0);assert.equal(e.enabled,true);assert.equal(e.volume,.45);assert.equal(e.play('ready'),false);});
test('corrupt, denied and out-of-range preferences are safe',()=>{assert.equal(preferences({getItem:()=>'{'}).volume,.45);assert.equal(preferences({getItem:()=>{throw Error();}}).enabled,true);assert.equal(preferences({getItem:()=>'{"enabled":false,"volume":5}'}).volume,1);});
test('preference writes use a separate key, never game progress',()=>{const writes=[];const e=new SoundEngine({storage:{getItem:()=>null,setItem:(...a)=>writes.push(a)}});e.setVolume(.2);e.setEnabled(false);assert(writes.every(w=>w[0]===PREF_KEY));});
test('failed ingredient/serve/buy actions cannot trigger reward sounds',()=>{for(const a of ['serve','buy','ingredient','grill'])assert.equal(actionCue(a,no),'error');assert.equal(actionCue('pause'),null);});
test('meat selection is not the same cue as placing meat on heat',()=>{assert.equal(actionCue('ingredient',ok,{id:'rawPatty'}),'select');assert.equal(actionCue('grill',ok,{occupied:false}),'grillDrop');assert.equal(actionCue('grill',ok,{occupied:true}),'place');});
test('toppings, top bun and sauce have appropriate cues',()=>{assert.equal(actionCue('ingredient',ok,{id:'cheese'}),'place');assert.equal(actionCue('ingredient',ok,{id:'topBun'}),'cap');assert.equal(actionCue('ingredient',ok,{id:'sauce'}),'sauce');});
test('fryer and drink starts differ from collection',()=>{assert.equal(actionCue('fries',ok,{occupied:false}),'basket');assert.equal(actionCue('drink',ok,{occupied:false}),'cup');assert.equal(actionCue('drink',ok,{occupied:true}),'collect');});
test('arrival notification occurs once, not on each render',()=>{const g=new Kitchen(),e=new Spy(),d=new SoundDirector(e);d.sync(g);g.paused=false;d.sync(g);g.advance(2200);d.sync(g);d.sync(g);assert.deepEqual(e.effects,['arrival']);});
test('no kitchen noise while the customer arrival blocks input',()=>{const g=new Kitchen();g.paused=false;g.grills[0]={type:'patty',elapsed:1};assert.deepEqual(transitions(null,snapshot(g)).loops,{});});
test('sizzle starts only after meat goes onto a burner',()=>{const {game:g,engine:e,director:d}=setup();g.pick('rawPatty');d.sync(g);assert.deepEqual(e.loops,{});g.grillTap(0);d.sync(g);assert(e.loops.grill>0);assert.equal(g.grills.filter(Boolean).length,1);});
test('ready ping fires once; ready meat retains only quiet heat noise',()=>{const {game:g,engine:e,director:d}=setup();g.pick('rawPatty');g.grillTap(0);d.sync(g);g.advance(5000);d.sync(g);for(let i=0;i<30;i++)d.sync(g);assert.deepEqual(e.effects,['ready']);assert.equal(e.loops.grill,.15);});
test('burn warning fires once and stops grill noise',()=>{const {game:g,engine:e,director:d}=setup();g.pick('rawPatty');g.grillTap(0);d.sync(g);g.advance(5000);d.sync(g);e.effects=[];g.advance(10000);d.sync(g);d.sync(g);assert.deepEqual(e.effects,['burn']);assert.deepEqual(e.loops,{});});
test('starting and finishing side jobs controls their own noise',()=>{const {game:g,engine:e,director:d}=setup();g.jobs.fries={orderId:g.active.id,elapsed:0,duration:6000};g.jobs.drink={orderId:g.active.id,elapsed:0,duration:3000};d.sync(g);assert(e.loops.fryer&&e.loops.drink);g.advance(3000);d.sync(g);assert(!e.loops.drink&&e.loops.fryer);assert.deepEqual(e.effects,['ready']);g.advance(3000);d.sync(g);assert.deepEqual(e.loops,{});assert.deepEqual(e.effects,['ready','ready']);});
test('several simultaneous completions produce one ping, not a chorus',()=>{const {game:g,engine:e,director:d}=setup();g.grills[0]={type:'patty',elapsed:4999};g.grills[1]={type:'patty',elapsed:4999};d.sync(g);g.advance(1);d.sync(g);assert.deepEqual(e.effects,['ready']);});
test('opening pause/shop stops loops; resume does not replay ready alerts',()=>{const {game:g,engine:e,director:d}=setup();g.pick('rawPatty');g.grillTap(0);d.sync(g);g.advance(5000);d.sync(g);e.effects=[];d.pause();g.paused=true;d.sync(g);assert.deepEqual(e.loops,{});g.paused=false;d.sync(g);assert.deepEqual(e.effects,[]);});
test('restoring a finished job does not replay old completion notifications',()=>{const g=new Kitchen(),e=new Spy(),d=new SoundDirector(e);g.active.arrivalLeft=0;g.grills[0]={type:'patty',elapsed:7000};g.paused=false;d.sync(g);assert.deepEqual(e.effects,[]);});
test('serving transition does not leave kitchen noise running',()=>{const {game:g,engine:e,director:d}=setup();g.grills[0]={type:'patty',elapsed:10};d.sync(g);g.phase='served';d.sync(g);assert.deepEqual(e.loops,{});});
test('audio synchronization never mutates the game or its save',()=>{const {game:g,director:d}=setup();const saved=JSON.stringify(g.snapshot());d.sync(g);assert.equal(JSON.stringify(g.snapshot()),saved);});
test('unsupported Web Audio and refused storage do not break the game',()=>{const e=new SoundEngine({contextFactory:()=>{throw Error('unsupported');},storage:{getItem:()=>null,setItem:()=>{throw Error();}}});assert.doesNotThrow(()=>{e.unlock();e.setVolume(.7);e.setEnabled(false);e.setLoops({grill:1});e.play('serve');});assert.equal(e.voices.size,0);});
test('hidden pages cannot unlock or emit effects',()=>{let made=0;const e=new SoundEngine({hidden:()=>true,contextFactory:()=>{made++;}});e.unlock();assert.equal(made,0);assert.equal(e.play('serve'),false);});
console.log(`\n${passed} sound tests passed`);
