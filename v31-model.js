/* Character transactions: money is credited once, when the hand releases the cash. */
(function(root){
'use strict';
const base=typeof module!=='undefined'&&module.exports?require('./v28-model.js'):root.BB27;
const TIMING=Object.freeze({arrival:2400,deposit:1350,payment:2200,exit:2200});
const bounded=(n,a,b)=>Number.isFinite(n)?Math.max(a,Math.min(b,n)):a;
class Kitchen extends base.Kitchen {
 makeOrder(){const o=super.makeOrder();o.arrivalLeft=TIMING.arrival;return o;}
 restore(saved){
  const ok=super.restore(saved);this.payment=null;
  if(!ok)return false;
  for(const o of this.orders){const raw=saved.orders?.find(v=>v?.id===o.id);o.arrivalLeft=bounded(raw?.arrivalLeft,0,TIMING.arrival);}
  const p=saved.payment;
  // v29 saves have already credited their 'served' order. Never credit those again.
  if(saved.phase==='paying'&&p&&p.orderId===this.active?.id&&this.ready()&&
     Number.isSafeInteger(p.amount)&&p.amount>0&&p.amount<=100000&&
     Number.isSafeInteger(p.points)&&p.points>=0&&p.points<=200&&typeof p.paid==='boolean'){
   this.phase='paying';this.phaseLeft=bounded(saved.phaseLeft,0,TIMING.payment);
   this.payment={orderId:p.orderId,amount:p.amount,points:p.points,perfect:!!p.perfect,paid:p.paid};
  }else if(saved.phase==='served'||saved.phase==='left'){
   this.phase=saved.phase;this.phaseLeft=bounded(saved.phaseLeft,0,TIMING.exit);
   if(p?.paid&&p.orderId===this.active?.id)this.payment={orderId:p.orderId,amount:bounded(p.amount,0,100000),paid:true,points:0,perfect:false};
  }
  return ok;
 }
 serve(){
  if(!this.playable())return this.unavailable();
  this.selected=null;if(!this.ready())return this.say(this.hint(),false);
  const o=this.active,perfect=o.mistakes===0&&o.patience>=65,nextCombo=o.mistakes?0:this.combo+1;
  this.payment={orderId:o.id,amount:Math.round(100*(o.recipe.price+(o.fries?2:0)+(o.drink?1.5:0)+(o.patience/50)*(nextCombo>=3?1.2:1))),points:Math.round(o.patience)+(perfect?40:10),perfect,paid:false};
  this.phase='paying';this.phaseLeft=TIMING.payment;
  return this.say(`${base.PEOPLE[o.person]} is paying. Watch the counter!`);
 }
 creditPayment(){
  const p=this.payment;if(!p||p.paid||p.orderId!==this.active?.id)return false;
  p.paid=true;this.cashCents+=p.amount;this.earnedCents+=p.amount;this.score+=p.points;
  this.combo=this.active.mistakes?0:this.combo+1;this.served++;this.shiftServed++;this.perfect+=Number(p.perfect);
  this.say(`${p.perfect?'Perfect!':'Thank you!'} Cash received: +$${(p.amount/100).toFixed(2)}`);return true;
 }
 advance(ms){
  if(this.paused||!Number.isFinite(ms)||ms<=0||this.phase==='summary')return;
  if(this.phase==='paying'){
   const used=Math.min(ms,this.phaseLeft);this.phaseLeft=Math.max(0,this.phaseLeft-used);
   if(TIMING.payment-this.phaseLeft>=TIMING.deposit)this.creditPayment();
   if(this.phaseLeft===0){this.creditPayment();this.phase='served';this.phaseLeft=TIMING.exit;if(ms>used)this.advance(ms-used);}
   return;
  }
  if(this.phase==='served'||this.phase==='left'){
   const used=Math.min(ms,this.phaseLeft);this.phaseLeft=Math.max(0,this.phaseLeft-used);
   if(!this.phaseLeft){
    if(this.phase==='served'&&this.shiftServed>=5){this.phase='summary';this.say('Shift complete! Visit the shop or continue.');}
    else{this.replaceOrder(this.activeId);this.phase='playing';this.say('Here comes your next customer.');}
    this.payment=null;if(ms>used&&this.phase!=='summary')this.advance(ms-used);
   }return;
  }
  super.advance(ms);
  if(this.phase==='left')this.phaseLeft=TIMING.exit;
 }
 hint(){if(this.phase==='paying')return this.payment?.paid?'Payment received — thank you!':'Customer is placing cash on the counter…';return super.hint();}
 snapshot(){return{...super.snapshot(),characterVersion:31,payment:this.payment?{...this.payment}:null};}
 continueShift(){const ok=super.continueShift();if(ok)this.payment=null;return ok;}
}
const api={...base,Kitchen,TIMING};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BB27=api;
})(globalThis);
