/* v28 extends the tested economy, preserving the v27 save format and key. */
(function(root){
'use strict';
const api=typeof module!=='undefined'&&module.exports?require('./v27-model.js'):root.BB27;
class Kitchen extends api.Kitchen{
 makeOrder(){const order=super.makeOrder();order.arrivalLeft=2200;return order;}
 restore(saved){const loaded=super.restore(saved);if(loaded&&Array.isArray(saved?.orders))for(const order of this.orders){const old=saved.orders.find(o=>o?.id===order.id);if(Number.isFinite(old?.arrivalLeft))order.arrivalLeft=Math.min(2200,Math.max(0,old.arrivalLeft));}return loaded;}
 advance(ms){const phase=this.phase;super.advance(ms);if(phase!=='left'&&this.phase==='left')this.phaseLeft=2200;}
}
const exported={...api,Kitchen};
if(typeof module!=='undefined'&&module.exports)module.exports=exported;else root.BB27=exported;
})(globalThis);
