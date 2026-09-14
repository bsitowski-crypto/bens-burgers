/* Cohesive character illustrations. A head is never attached to a differently drawn body. */
(function(root){
'use strict';
const names=['lou','maya','eddie','nora','gus'];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=t=>{t=clamp(t);return t*t*(3-2*t)};
const lerp=(a,b,t)=>a+(b-a)*t;
function sprite(i){return root.BBArt.sprite(names[i],0,0,260,225);}
function character(i){
 const id='stand-person-'+i;
 const leg=(side,x)=>`<g data-joint="${side}Leg" transform="translate(${x} 220)"><path d="M-17-6H18L14 59H-14Z" fill="url(#${id}-denim)" stroke="#29382a"/><g data-joint="${side}Shin" transform="translate(0 58)"><path d="M-14-4H14L11 53H-11Z" fill="url(#${id}-denim)" stroke="#29382a"/><g data-joint="${side}Foot" transform="translate(0 54)"><path d="M-12-4H11L28 7Q33 17 20 17H-13Q-21 7-12-4" fill="#6f5943" stroke="#322e23" stroke-width="2"/><path d="M-15 14H28" stroke="#e9d9b8" stroke-width="4"/></g></g></g>`;
 const arm='M191 128Q217 127 233 156L254 215 212 224 151 220 145 207Q158 200 182 207L207 202 207 180 195 163Z';
 // Keep the source unbroken except Eddie's original right sleeve/hand, articulated from the same art.
 let torso=sprite(i);
 if(i===2)torso=`<g mask="url(#${id}-bodymask)">${torso}</g><g data-joint="paintedArm">${sprite(i)}</g>`;
 let face='';
 if(i===2){
  face=`<ellipse cx="120" cy="66" rx="12" ry="8" fill="#b17550"/><ellipse cx="158" cy="71" rx="11" ry="8" fill="#a76a43"/><g data-face="eyes" clip-path="url(#${id}-eyes)">${sprite(i)}</g><g data-face="mouth" clip-path="url(#${id}-mouth)">${sprite(i)}</g>`;
 }
 return `<svg class="customer-rig" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 350" role="img" aria-label="${names[i]}, illustrated as one complete person"><defs><linearGradient id="${id}-denim"><stop stop-color="#243e3d"/><stop offset=".35" stop-color="#586760"/><stop offset=".7" stop-color="#415650"/><stop offset="1" stop-color="#203d37"/></linearGradient><clipPath id="${id}-arm"><path d="${arm}"/></clipPath><mask id="${id}-bodymask"><rect width="260" height="230" fill="white"/><path d="${arm}" fill="black"/></mask><clipPath id="${id}-eyes"><ellipse cx="120" cy="66" rx="12" ry="8"/><ellipse cx="158" cy="71" rx="11" ry="8"/></clipPath><clipPath id="${id}-mouth"><ellipse cx="138" cy="113" rx="25" ry="10"/></clipPath></defs><ellipse cx="133" cy="347" rx="53" ry="4" fill="#463a28" opacity=".25"/>${leg('left',105)}${leg('right',156)}<g data-joint="body">${i===2?'<path d="M152 171H211V225H147Z" fill="#a5a397"/>':''}${torso}${face}</g></svg>`;
}
function foot(d,off){const t=d/52+off,f=t-Math.floor(t),u=clamp((f-.62)/.38);return{x:16-f*52+52*ease(u),lift:Math.sin(Math.PI*u)*10,stance:f<.62};}
function solve(x,y,tx,ty,a,b){const dx=tx-x,dy=ty-y,dist=Math.min(a+b-.001,Math.hypot(dx,dy)),th=Math.atan2(dy,dx),aa=Math.acos(clamp((a*a+dist*dist-b*b)/(2*a*dist),-1,1)),up=th-aa,kx=x+a*Math.cos(up),ky=y+a*Math.sin(up);return{up:up*180/Math.PI-90,down:Math.atan2(ty-ky,tx-kx)*180/Math.PI-90};}
let time=0,lastId=0,settle=0;
function motion(stage,G,dt=0){
 if(!stage||!G.active)return;const o=G.active,el=stage.querySelector('.customer-walker'),rig=el.querySelector('.customer-rig');if(!rig)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!G.paused){time+=dt;if(o.arrivalLeft<=0)settle+=dt}if(lastId!==o.id){lastId=o.id;settle=0;}
 let counter=stage.querySelector('.customer-counter');
 if(!counter){counter=document.createElement('div');counter.className='customer-counter';counter.setAttribute('aria-hidden','true');stage.appendChild(counter);const cash=document.createElement('div');cash.className='counter-cash';cash.innerHTML='<svg viewBox="0 0 100 48" aria-hidden="true"><path d="m4 9 83-5 8 32-85 7z" fill="#ccd9a1" stroke="#526e43" stroke-width="2"/><path d="m10 14 73-5 6 22-72 6z" fill="none" stroke="#88a873"/><ellipse cx="48" cy="23" rx="18" ry="12" fill="#97b378"/><text x="48" y="29" text-anchor="middle" fill="#3b623b" font-family="Georgia" font-size="19">$</text></svg><b></b>';stage.appendChild(cash);const held=document.createElement('div');held.className='held-bill counter-cash';held.innerHTML=cash.querySelector('svg').outerHTML;stage.appendChild(held);}
 const W=stage.clientWidth,H=stage.clientHeight,s=Math.min((H-6)/235,(W-6)/260),w=260*s,h=350*s,top=H-235*s-3,start=-w*.53,end=W*.52,travel=end-start;
 const arriving=o.arrivalLeft>0,p=clamp(1-o.arrivalLeft/2400),exit=G.phase==='served'||G.phase==='left',q=exit?clamp(1-G.phaseLeft/2200):0,paying=G.phase==='paying';
 const x=(exit?lerp(end,start,reduce?1:ease(q)):lerp(start,end,reduce?1:ease(p)))-w/2;
 el.style.cssText=`left:${x}px;top:${top}px;width:${w}px;height:${h}px;transform:none;opacity:1;`;
 rig.style.transform=exit&&!reduce?'scaleX(-1)':'none';rig.style.transformOrigin='50% 50%';
 const d=(exit?travel*ease(q):travel*ease(p))/s,walk=!reduce&&(arriving||exit),a=walk?1:1-ease(settle/180),bob=reduce?0:walk?Math.sin(d/52*Math.PI*4)*.8:Math.sin(time/1000)*.45;
 function joint(n,v){const e=rig.querySelector('[data-joint="'+n+'"]');if(e)e.setAttribute('transform',v)}
 for(const [side,hx,off] of [['left',105,0],['right',156,.5]]){const f=foot(d,off),z=solve(hx,220+bob,hx+f.x*a,332-f.lift*a,58,54);joint(side+'Leg',`translate(${hx} ${220+bob}) rotate(${z.up})`);joint(side+'Shin',`translate(0 58) rotate(${z.down-z.up})`);joint(side+'Foot',`translate(0 54) rotate(${-z.down})`);}
 joint('body',`translate(0 ${bob}) rotate(${walk?Math.sin(d/52*Math.PI*2)*.45:0} 130 212)`);
 const clock=paying?2200-G.phaseLeft:0,reaching=paying?ease((clock-400)/700)*(1-ease((clock-1600)/500)):0;
 const arm=rig.querySelector('[data-joint="paintedArm"]');if(arm){arm.setAttribute('clip-path',`url(#stand-person-${o.person}-arm)`);joint('paintedArm',`translate(${reaching*12} ${-reaching*8}) rotate(${-reaching*7+(walk?Math.sin(d/52*Math.PI*2)*1.8:0)} 198 136)`);}
 const eye=rig.querySelector('[data-face="eyes"]'),mouth=rig.querySelector('[data-face="mouth"]');
 if(eye){const b=(time+870)%4500,close=!reduce&&b<145?Math.sin(b/145*Math.PI):0,sy=1-close*.92;eye.setAttribute('transform',`translate(0 ${69*(1-sy)}) scale(1 ${sy})`);}
 if(mouth){const sy=!reduce&&(!arriving&&settle<900||paying&&clock<600)? .88+.12*(.5+.5*Math.sin(time/92)):1;mouth.setAttribute('transform',`translate(0 ${113*(1-sy)}) scale(1 ${sy})`);}
 const yTable=top+210*s;
 counter.style.cssText=`left:${W*.10}px;right:0;top:${yTable}px;bottom:0;`;
 const name=stage.querySelector('.name-tag');name.style.cssText=`left:${W*.24}px;top:${H-24}px;bottom:auto;opacity:${arriving||exit?0:1};`;
 const cash=stage.querySelector('.counter-cash:not(.held-bill)'),held=stage.querySelector('.held-bill'),paid=!!G.payment?.paid&&(paying||exit);
 const cashX=end-w/2+175*s,cashY=yTable-7*s;
 cash.style.cssText=`display:${paid?'block':'none'};left:${cashX-22*s}px;top:${cashY}px;width:${50*s}px;height:${25*s}px;`;
 cash.querySelector('b').textContent=G.payment?.amount?'+$'+(G.payment.amount/100).toFixed(2):'';
 cash.setAttribute('aria-label','Customer cash on counter');
 held.style.cssText=`display:${paying&&clock>580&&clock<1350?'block':'none'};left:${cashX-22*s+9*s*(1-reaching)}px;top:${cashY-9*s*(1-reaching)}px;width:${50*s}px;height:${25*s}px;transform:rotate(${-14*(1-reaching)}deg);`;
 stage.dataset.motion=arriving?'walking':paying?'paying':exit?'leaving':'waiting';stage.dataset.payment=paid?'paid':paying?'reaching':'none';
 stage.__pose={x,w,h,s,top,cashX,cashY,walk,arriving,exit};
}
root.BBCustomers={character,motion,foot,solve};
})(globalThis);
