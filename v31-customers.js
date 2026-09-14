/* Full character rig. Raster heads have real transparency; limbs are articulated SVG. */
(function(root){
'use strict';
const LOOKS=[
 {name:'Lou',shirt:'#b44430',dark:'#692a25',pants:'#344554',skin:'#e9a47b',shoe:'#7b2f28',hood:true},
 {name:'Maya',shirt:'#303039',dark:'#151820',pants:'#3b4956',skin:'#d9946e',shoe:'#785756',heart:true},
 {name:'Eddie',shirt:'#aaa8a2',dark:'#626971',pants:'#344150',skin:'#8e5639',shoe:'#3b424c',hood:true},
 {name:'Nora',shirt:'#527456',dark:'#263f34',pants:'#364e62',skin:'#ecc3a0',shoe:'#755a48',knit:true},
 {name:'Gus',shirt:'#6c7780',dark:'#394953',pants:'#3a4147',skin:'#c98961',shoe:'#624e3c',plaid:true}
];

// Each moving facial patch is sampled from the SAME face, not a pasted-on replacement.
// Coordinates are in the existing 160x190 atlas cells. Full hair and neck remain intact.
const FEATURES=[
 {eyes:[[66,81,23,18],[108,80,23,18]],mouth:[84,118,65,32],skin:'#f1ac80'},
 {eyes:[[68,98,24,20],[108,97,23,20]],mouth:[88,128,46,18],skin:'#dfa074'},
 {eyes:[[67,71,20,13],[104,76,19,14]],mouth:[82,107,59,25],skin:'#935b3d',mouthSkin:'#33271f'},
 {eyes:[[61,70,19,14],[101,74,20,14]],mouth:[80,99,45,18],skin:'#eec39d'},
 {eyes:[[65,71,21,16],[101,81,20,16]],mouth:[78,114,57,25],skin:'#cf8d63',mouthSkin:'#716054'}
];
function face(index){
 const f=FEATURES[index],p='face'+index;
 const image=`<image href="customer-heads-v28.webp" x="${-index*160}" y="0" width="800" height="190"/>`;
 let body=image,defs='';
 f.eyes.forEach(([cx,cy,w,h],i)=>{
  defs+=`<clipPath id="${p}eye${i}"><rect x="${cx-w/2}" y="${cy-h/2}" width="${w}" height="${h}" rx="${h/2}"/></clipPath>`;
  body+=`<ellipse cx="${cx}" cy="${cy}" rx="${w/2}" ry="${h/2}" fill="${f.skin}"/><g data-eye="${i}" data-cx="${cx}" data-cy="${cy}" clip-path="url(#${p}eye${i})">${image}</g><path data-lid="${i}" d="M${cx-w*.43} ${cy}q${w*.43} 4 ${w*.86} 0" fill="none" stroke="#593828" stroke-width="1.5" opacity="0"/>`;
 });
 const [cx,cy,w,h]=f.mouth;
 defs+=`<clipPath id="${p}mouth"><ellipse cx="${cx}" cy="${cy}" rx="${w/2}" ry="${h/2}"/></clipPath>`;
 body+=`<ellipse cx="${cx}" cy="${cy}" rx="${w/2}" ry="${h/2}" fill="${f.mouthSkin||f.skin}"/><g data-mouth data-cx="${cx}" data-cy="${cy}" clip-path="url(#${p}mouth)">${image}</g>`;
 return `<svg class="head-frame" x="${index===3?49:49}" y="${index===3?23:-2}" width="142" height="169" viewBox="0 0 160 190" overflow="hidden"><defs>${defs}</defs>${body}</svg>`;
}

function character(index){
 const p=LOOKS[index]||LOOKS[0],id='person'+index,skin=p.skin;
 const fill='url(#'+id+'shirt)',denim='url(#'+id+'pants)',hand='url(#'+id+'skin)';
 function arm(side,x){return `<g data-joint="${side}Arm" transform="translate(${x} 171)"><path d="M-12 2Q-22 27-16 57Q0 66 14 56L17 14Q13 0-12 2Z" fill="${fill}" stroke="${p.dark}" stroke-width="2"/><path d="M-13 24Q-3 32 11 25" fill="none" stroke="#ffffff20" stroke-width="2"/><g data-joint="${side}Elbow" transform="translate(0 53)"><path d="M-16 0Q0-7 14 0L11 52Q1 59-12 51Z" fill="${fill}" stroke="${p.dark}" stroke-width="2"/><path d="M-12 44L11 44" stroke="${p.dark}" stroke-width="5"/><g data-joint="${side}Hand" transform="translate(0 55)"><path d="M-10-3Q0-7 10-2L11 16Q7 27-4 24L-12 17Z" fill="${hand}" stroke="#754a3433" stroke-width="1.5"/><path d="M8 1Q20 8 10 15M-7 10V19M-2 11V22M3 11V21" fill="none" stroke="#754a3455" stroke-width="1.3"/></g></g></g>`;}
 function leg(side,x){return `<g data-joint="${side}Leg" transform="translate(${x} 299)"><path d="M-17-6H18L15 70Q0 76-15 68Z" fill="${denim}" stroke="#202d3970" stroke-width="2"/><path d="M-10 8L-8 58" stroke="#b0bbcb30" stroke-width="2"/><g data-joint="${side}Shin" transform="translate(0 68)"><path d="M-15-5Q0-9 15-5L12 64Q0 72-12 64Z" fill="${denim}" stroke="#202d3950" stroke-width="2"/><path d="M-11 55H11" stroke="#19273180" stroke-width="4"/><g data-joint="${side}Foot" transform="translate(0 66)"><path d="M-12-4Q-18 9-12 14L22 16Q31 14 26 6L11-4Z" fill="${p.shoe}" stroke="#22292c" stroke-width="2"/><path d="M-15 13Q3 17 28 13L28 19H-15Z" fill="#e1decf"/><path d="M-3 3L11 5M-4 8L12 10" stroke="#eee6d5" stroke-width="2"/></g></g></g>`;}
 let details=p.hood?`<path d="M81 153Q54 172 81 205L111 181M159 153Q185 172 159 205L130 181" fill="${p.dark}" stroke="#ffffff16" stroke-width="3"/><path d="M82 157Q93 149 106 159L120 183 135 157Q150 150 159 159L144 185H95Z" fill="${fill}"/><path d="M109 184L109 236M135 183L133 237" stroke="#eae1d0" stroke-width="3"/><path d="M116 183L120 303" stroke="${p.dark}" stroke-width="3"/><path d="M87 251L76 278Q95 291 110 280L110 248M134 247L162 275Q144 291 131 279Z" fill="#00000012" stroke="#ffffff13" stroke-width="2"/>`:p.heart?`<path d="M137 187C120 171 119 202 137 211C155 193 152 175 137 187Z" fill="#d7658a"/><path d="M98 157Q117 182 143 157" fill="none" stroke="#555963" stroke-width="4"/>`:p.knit?`<path d="M94 157Q119 182 145 157" fill="none" stroke="#a7bb8e55" stroke-width="5"/><path d="M77 195Q120 185 164 195M75 220Q120 210 166 220M76 247Q120 237 165 247M77 273Q120 264 164 273" stroke="#cee0b81c" fill="none" stroke-width="3"/>`:`<path d="M93 151L120 180 149 150L162 180 140 194 120 180 103 194 78 178Z" fill="#3a424c" stroke="#aab1b840" stroke-width="2"/><path d="M120 183V302" stroke="#ccd0c84d" stroke-width="3"/><g fill="#202c33"><circle cx="120" cy="217" r="2"/><circle cx="120" cy="249" r="2"/><circle cx="120" cy="281" r="2"/></g>`;
 if(p.plaid)details=`<path d="M68 174Q120 140 172 174L172 297H69Z" fill="url(#${id}plaid)" opacity=".55"/>`+details;
 return `<svg class="customer-rig" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 460" role="img" aria-label="${p.name}, a full character with walking legs"><defs><linearGradient id="${id}shirt" x2="1" y2=".3"><stop stop-color="${p.dark}"/><stop offset=".3" stop-color="${p.shirt}"/><stop offset=".65" stop-color="${p.shirt}"/><stop offset="1" stop-color="${p.dark}"/></linearGradient><linearGradient id="${id}pants"><stop stop-color="#26323e"/><stop offset=".38" stop-color="${p.pants}"/><stop offset=".65" stop-color="${p.pants}"/><stop offset="1" stop-color="#26323e"/></linearGradient><radialGradient id="${id}skin"><stop stop-color="${skin}"/><stop offset="1" stop-color="${skin}"/></radialGradient><pattern id="${id}plaid" width="30" height="34" patternUnits="userSpaceOnUse"><rect width="30" height="34" fill="none"/><path d="M8 0V34M0 9H30" stroke="#c9c4b6" stroke-width="8"/><path d="M23 0V34M0 26H30" stroke="#263442" stroke-width="5"/></pattern></defs><ellipse class="foot-shadow" cx="120" cy="452" rx="57" ry="6" fill="#1e1811" opacity=".19"/>${leg('left',96)}${leg('right',146)}<g data-joint="body">${arm('left',73)}<path d="M80 163Q120 145 164 164Q184 204 173 270L173 302Q120 317 67 302L67 246Q55 194 80 163Z" fill="${fill}" stroke="${p.dark}" stroke-width="2"/><path d="M75 289Q120 301 169 290L172 303Q120 315 68 303Z" fill="${p.dark}" opacity=".6"/><path d="M79 197Q72 221 79 238M163 218Q169 239 162 253M79 278Q91 272 103 277" fill="none" stroke="#ffffff14" stroke-width="3"/>${details}${arm('right',171)}<g data-joint="head"><path d="M107 135H133L136 159Q120 169 103 159Z" fill="${hand}"/>${face(index)}</g></g></svg>`;
}
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;
// Foot targets remain motionless in WORLD space through each stance phase.
function foot(distance,offset){
 const cycle=56,u=distance/cycle+offset,phase=u-Math.floor(u),swing=clamp((phase-.62)/.38);
 return {x:18-phase*cycle+cycle*smooth(swing),lift:Math.sin(Math.PI*swing)*13,phase,stance:phase<.62};
}
function solve(hx,hy,tx,ty,a,b,bend=1){
 const dx=tx-hx,dy=ty-hy,d=Math.min(a+b-.001,Math.max(Math.abs(a-b)+.001,Math.hypot(dx,dy)));
 const theta=Math.atan2(dy,dx),alpha=Math.acos(clamp((a*a+d*d-b*b)/(2*a*d),-1,1));
 const ang=theta+alpha*bend,kx=hx+a*Math.cos(ang),ky=hy+a*Math.sin(ang);
 return {kx,ky,upper:ang*180/Math.PI-90,lower:Math.atan2(ty-ky,tx-kx)*180/Math.PI-90};
}
let simTime=0,lastOrderId=null,settle=0;
function motion(stage,model,dt=0){
 if(!stage||!model.active)return;
 const o=model.active,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!model.paused)simTime+=Math.max(0,dt);
 if(lastOrderId!==o.id){lastOrderId=o.id;settle=0;}
 if(!model.paused&&o.arrivalLeft<=0)settle+=dt;
 const walker=stage.querySelector('.customer-walker'),rig=stage.querySelector('.customer-rig');if(!rig)return;
 let counter=stage.querySelector('.customer-counter');
 if(!counter){
  counter=document.createElement('div');counter.className='customer-counter';counter.setAttribute('aria-hidden','true');counter.innerHTML='<span class="counter-top"></span>';stage.appendChild(counter);
  const front=document.createElement('div');front.className='customer-foreground';front.setAttribute('aria-hidden','true');stage.appendChild(front);
  const cash=document.createElement('div');cash.className='counter-cash';cash.setAttribute('role','img');cash.innerHTML='<svg viewBox="0 0 100 46"><g transform="rotate(-5 50 23)"><rect x="4" y="6" width="85" height="34" rx="3" fill="#92b48d" stroke="#314f3c" stroke-width="2"/><rect x="9" y="10" width="75" height="25" rx="2" fill="#d0dfae" stroke="#628667"/><ellipse cx="47" cy="23" rx="17" ry="11" fill="#91b286"/><text x="47" y="29" text-anchor="middle" font-size="18" font-family="Georgia" fill="#3b6143">$</text><path d="M15 17h9m44 12h9" stroke="#52755b" stroke-width="2"/></g></svg><b></b>';stage.appendChild(cash);
 }
 const W=stage.clientWidth,H=stage.clientHeight,s=Math.min((H-9)/460,W/190),rw=240*s,rh=460*s,top=H-rh-3;
 const start=-rw*.53,end=W*.61,travel=end-start;
 const arriving=o.arrivalLeft>0,departing=model.phase==='served'||model.phase==='left',paying=model.phase==='paying';
 const p=clamp(1-o.arrivalLeft/2400),q=departing?clamp(1-model.phaseLeft/2200):0;
 const progress=reduced?1:smooth(p),exitProgress=reduced?1:smooth(q);
 const cx=departing?mix(end,start,exitProgress):mix(start,end,progress),x=cx-rw/2;
 // No animated scale, bottom offset, or fade: shoes stay on one floor plane.
 walker.style.cssText=`position:absolute;left:${x}px;top:${top}px;bottom:auto;width:${rw}px;height:${rh}px;transform:none;opacity:1;`;
 rig.style.transform=departing&&!reduced?'scaleX(-1)':'none';rig.style.transformOrigin='50% 50%';
 const dir=1,walking=!reduced&&(arriving||departing),distance=(departing?travel*exitProgress:travel*progress)/s;
 const fade=arriving?1:departing?1:1-smooth(settle/240);
 const left=foot(distance,0),right=foot(distance,.5);
 const bob=walking?Math.sin(distance/56*Math.PI*4)*1.2:reduced?0:Math.sin(simTime/820)*.5;
 function joints(name,value){stage.querySelectorAll(`[data-joint="${name}"]`).forEach(el=>el.setAttribute('transform',value));}
 // Horizontal arm/leg swing agrees with actual distance travelled.
 for(const [side,hx,step] of [['left',96,left],['right',146,right]]){
  const amount=walking?1:reduced?0:fade,fx=hx+dir*step.x*amount,fy=431-step.lift*amount;
  const z=solve(hx,299+bob,fx,fy,68,66,-dir);
  joints(side+'Leg',`translate(${hx} ${299+bob}) rotate(${z.upper})`);
  joints(side+'Shin',`translate(0 68) rotate(${z.lower-z.upper})`);
  joints(side+'Foot',`translate(0 66) rotate(${-z.lower})`);
 }
 joints('body',`translate(0 ${bob})`);
 let clock=paying?2200-model.phaseLeft:0;
 // Prepare a separate forearm layer so the paying hand reaches OVER the countertop.
 const front=stage.querySelector('.customer-foreground');
 if(front.dataset.person!==String(o.person)){
  front.dataset.person=String(o.person);const arm=rig.querySelector('[data-joint="rightArm"]').cloneNode(true);
  front.innerHTML='<svg viewBox="0 0 240 460" class="customer-rig" aria-hidden="true"><g class="front-body"></g><g class="held-cash"><rect x="-35" y="-13" width="70" height="30" rx="2" fill="#cbdcaa" stroke="#467054"/><text x="0" y="5" text-anchor="middle" font-size="13" fill="#4a6e45">$</text></g></svg>';
  front.querySelector('.front-body').appendChild(arm);
 }
 front.style.cssText=`position:absolute;left:${x}px;top:${top}px;width:${rw}px;height:${rh}px;display:${paying?'block':'none'};`;
 const originalRight=rig.querySelector('[data-joint="rightArm"]');originalRight.style.opacity=paying?'0':'1';
 const swing=walking?Math.sin(distance/56*Math.PI*2)*15:reduced?0:Math.sin(simTime/1400)*1.5;
 joints('leftArm',`translate(73 171) rotate(${-dir*swing-3})`);joints('leftElbow','translate(0 53) rotate(-7)');
 joints('rightArm',`translate(171 171) rotate(${dir*swing+3})`);joints('rightElbow','translate(0 53) rotate(7)');
 const target={x:184,y:275};
 if(paying){
  const reach=smooth((clock-700)/650),returning=smooth((clock-1550)/480);
  const pocket=smooth((clock-300)/400);
  target.x=mix(mix(184,153,pocket),198,reach);target.y=mix(mix(275,260,pocket),285,reach);
  target.x=mix(target.x,184,returning);target.y=mix(target.y,275,returning);
  const z=solve(171,171,target.x,target.y,53,62,-1);
  joints('rightArm',`translate(171 171) rotate(${z.upper})`);joints('rightElbow',`translate(0 53) rotate(${z.lower-z.upper})`);
  joints('rightHand',`translate(0 55) rotate(${-z.lower-20})`);
  front.querySelector('.front-body').setAttribute('transform','translate(0 0)');
 }else joints('rightHand','translate(0 55)');
 const held=front.querySelector('.held-cash');held.style.display=clock>=580&&clock<1350?'block':'none';held.setAttribute('transform',`translate(${target.x} ${target.y+9}) rotate(-8)`);
 const tableY=top+294*s,tableX=end-rw/2+198*s;
 counter.style.cssText=`left:${Math.max(0,W*.30)}px;right:0;top:${tableY-1}px;bottom:0;`;
 const cash=stage.querySelector('.counter-cash'),showCash=!!model.payment?.paid&&(paying||departing);
 cash.style.cssText=`display:${showCash?'block':'none'};left:${tableX-41*s}px;top:${tableY-19*s}px;width:${82*s}px;height:${38*s}px;`;
 cash.querySelector('svg').style.cssText='width:100%;height:100%;';
 cash.querySelector('b').textContent=model.payment?.amount?'+$'+(model.payment.amount/100).toFixed(2):'';
 cash.setAttribute('aria-label',model.payment?.amount?'Customer cash payment of '+(model.payment.amount/100).toFixed(2)+' dollars':'Customer cash');
 stage.querySelector('.name-tag').style.cssText=`bottom:auto;top:${tableY+27}px;left:${W*.62}px;opacity:${!arriving&&!departing?'1':'0'};`;
 // Source-aligned eyelids and mouth are animated independently of the head.
 const blinkPhase=(simTime+o.person*690)%4100;
 const shut=reduced?0:blinkPhase<160?Math.sin(blinkPhase/160*Math.PI):0;
 const greeting=!reduced&&!arriving&&settle<1600;
 const talk=greeting||paying&&clock<700;
 const mouthOpen=reduced?1:talk?.64+.36*(.5+.5*Math.sin(simTime/68)):paying?1:1;
 stage.querySelectorAll('[data-eye]').forEach(el=>{const cx=+el.dataset.cx,cy=+el.dataset.cy;el.setAttribute('transform',`translate(0 ${cy*(1-Math.max(.04,1-shut))}) scale(1 ${Math.max(.04,1-shut)})`);});
 stage.querySelectorAll('[data-lid]').forEach(el=>el.setAttribute('opacity',shut>.8?String((shut-.8)*5):'0'));
 stage.querySelectorAll('[data-mouth]').forEach(el=>{const cy=+el.dataset.cy;el.setAttribute('transform',`translate(0 ${cy*(1-mouthOpen)}) scale(1 ${mouthOpen})`);});
 const nod=paying&&clock<450&&!reduced?Math.sin(clock/450*Math.PI)*2:reduced?0:Math.sin(simTime/1900)*.5;
 joints('head',`rotate(${nod} 120 150)`);
 stage.dataset.motion=reduced?'reduced':walking?'walking':paying?'paying':'waiting';
 stage.dataset.payment=showCash?'paid':paying?'reaching':'none';
 stage.querySelectorAll('.customer-rig').forEach(el=>el.dataset.gait=walking?'steps':'idle');
 // Read-only geometric telemetry for regression tests of stance-foot drift.
 stage.__pose={x,cx,s,top,left,right,distance,walking,paying,showCash,tableY,tableX};
}
const api={character,motion,foot,solve,FEATURES};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BBCustomers=api;
})(globalThis);
