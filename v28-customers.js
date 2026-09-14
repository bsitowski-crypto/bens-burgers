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
function character(index){
 const p=LOOKS[index]||LOOKS[0],id='person'+index,skin=p.skin;
 const fill='url(#'+id+'shirt)',denim='url(#'+id+'pants)',hand='url(#'+id+'skin)';
 function arm(side,x){return `<g data-joint="${side}Arm" transform="translate(${x} 171)"><path d="M-10 3Q-24 38-18 73L-13 95Q2 99 10 91L13 44 16 12Z" fill="${fill}" stroke="${p.dark}" stroke-width="2"/><path d="M-14 34Q-3 43 6 36M-13 71Q-3 78 7 71" fill="none" stroke="#ffffff20" stroke-width="2"/><path d="M-12 87L-11 106Q-10 123 0 126Q12 130 13 117L10 91Z" fill="${hand}" stroke="${skin}" stroke-width="1.5"/><path d="M-7 109L-6 120M-1 111L0 123M5 110L6 122" stroke="#653f302f" fill="none" stroke-width="1.5"/><path d="M9 101Q19 107 13 117" fill="${skin}"/></g>`;}
 function leg(side,x){return `<g data-joint="${side}Leg" transform="translate(${x} 289)"><path d="M-17-2H18L17 72Q0 78-16 72Z" fill="${denim}" stroke="#202d3970" stroke-width="2"/><path d="M-11 8L-9 59M12 13L10 62" stroke="#b0bbcb25" stroke-width="2"/><g data-joint="${side}Shin" transform="translate(0 66)"><path d="M-16-2Q0-7 17-2L13 74Q0 78-13 73Z" fill="${denim}" stroke="#202d3950" stroke-width="2"/><path d="M-11 51L10 54M-12 62L11 64" stroke="#18263550" stroke-width="3"/><g data-joint="${side}Foot"><path d="M-14 69Q-19 85-13 91L21 93Q31 92 27 84L13 73Z" fill="${p.shoe}" stroke="#22292c" stroke-width="2"/><path d="M-15 88Q3 93 28 89L28 95H-16Z" fill="#d7d4c9"/><path d="M-4 78L10 80M-5 83L12 85" stroke="#e5dfcf" stroke-width="2"/></g></g></g>`;}
 let details=p.hood?`<path d="M81 153Q54 172 81 205L111 181M159 153Q185 172 159 205L130 181" fill="${p.dark}" stroke="#ffffff16" stroke-width="3"/><path d="M82 157Q93 149 106 159L120 183 135 157Q150 150 159 159L144 185H95Z" fill="${fill}"/><path d="M109 184L109 236M135 183L133 237" stroke="#eae1d0" stroke-width="3"/><path d="M116 183L120 303" stroke="${p.dark}" stroke-width="3"/><path d="M87 251L76 278Q95 291 110 280L110 248M134 247L162 275Q144 291 131 279Z" fill="#00000012" stroke="#ffffff13" stroke-width="2"/>`:p.heart?`<path d="M137 187C120 171 119 202 137 211C155 193 152 175 137 187Z" fill="#d7658a"/><path d="M98 157Q117 182 143 157" fill="none" stroke="#555963" stroke-width="4"/>`:p.knit?`<path d="M94 157Q119 182 145 157" fill="none" stroke="#a7bb8e55" stroke-width="5"/><path d="M77 195Q120 185 164 195M75 220Q120 210 166 220M76 247Q120 237 165 247M77 273Q120 264 164 273" stroke="#cee0b81c" fill="none" stroke-width="3"/>`:`<path d="M93 151L120 180 149 150L162 180 140 194 120 180 103 194 78 178Z" fill="#3a424c" stroke="#aab1b840" stroke-width="2"/><path d="M120 183V302" stroke="#ccd0c84d" stroke-width="3"/><g fill="#202c33"><circle cx="120" cy="217" r="2"/><circle cx="120" cy="249" r="2"/><circle cx="120" cy="281" r="2"/></g>`;
 if(p.plaid)details=`<path d="M68 174Q120 140 172 174L172 297H69Z" fill="url(#${id}plaid)" opacity=".55"/>`+details;
 return `<svg class="customer-rig" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 460" role="img" aria-label="${p.name}, a full character with walking legs"><defs><linearGradient id="${id}shirt" x2="1" y2=".3"><stop stop-color="${p.dark}"/><stop offset=".3" stop-color="${p.shirt}"/><stop offset=".65" stop-color="${p.shirt}"/><stop offset="1" stop-color="${p.dark}"/></linearGradient><linearGradient id="${id}pants"><stop stop-color="#26323e"/><stop offset=".38" stop-color="${p.pants}"/><stop offset=".65" stop-color="${p.pants}"/><stop offset="1" stop-color="#26323e"/></linearGradient><radialGradient id="${id}skin"><stop stop-color="${skin}"/><stop offset="1" stop-color="${skin}"/></radialGradient><pattern id="${id}plaid" width="30" height="34" patternUnits="userSpaceOnUse"><rect width="30" height="34" fill="none"/><path d="M8 0V34M0 9H30" stroke="#c9c4b6" stroke-width="8"/><path d="M23 0V34M0 26H30" stroke="#263442" stroke-width="5"/></pattern></defs><ellipse class="foot-shadow" cx="120" cy="450" rx="57" ry="7" fill="#1e1811" opacity=".2"/>${leg('left',96)}${leg('right',146)}<g data-joint="body">${arm('left',73)}<path d="M80 163Q120 145 164 164Q184 204 173 270L173 302Q120 317 67 302L67 246Q55 194 80 163Z" fill="${fill}" stroke="${p.dark}" stroke-width="2"/><path d="M75 289Q120 301 169 290L172 303Q120 315 68 303Z" fill="${p.dark}" opacity=".6"/><path d="M79 197Q72 221 79 238M163 218Q169 239 162 253M79 278Q91 272 103 277" fill="none" stroke="#ffffff14" stroke-width="3"/>${details}${arm('right',171)}<g data-joint="head"><path d="M103 135H138L145 161Q120 181 95 161Z" fill="${hand}"/><svg class="head-frame" x="${index===3?18:45}" y="${index===3?4:-4}" width="${index===3?204:150}" height="${index===3?242:188}" viewBox="${index*160} 0 160 190" preserveAspectRatio="xMidYMid meet" overflow="hidden"><image href="customer-heads-v28.webp" x="0" y="0" width="800" height="190"/></svg></g></g></svg>`;
}
let simTime=0;
function motion(stage,model,dt){
 if(!stage||!model.active)return;
 if(!model.paused)simTime+=Math.max(0,dt||0);
 const o=model.active,p=Math.min(1,Math.max(0,1-o.arrivalLeft/2200));
 const departing=model.phase==='served'||model.phase==='left';
 const q=departing?Math.min(1,Math.max(0,model.phase==='served'?(1700-model.phaseLeft-350)/1350:1-model.phaseLeft/2200)):0;
 const width=Math.max(30,Math.min(stage.clientWidth*.92,stage.clientHeight*.86));
 const height=width*460/240,walker=stage.querySelector('.customer-walker');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 // The source is framed once. Limbs move independently of the walker's world position.
 const approach=reduced?1:Math.min(1,Math.max(0,(p-.65)/.35)),depth=approach*approach*(3-2*approach);
 const lateral=Math.min(1,p/.72),exit=Math.max(0,(q-.3)/.7);
 const x=reduced?0:-(stage.clientWidth*.65)*(1-lateral)-(stage.clientWidth+width)*exit;
 const farScale=Math.min(.66,stage.clientHeight*.94/height);
 const scale=reduced?1:farScale+(1-farScale)*depth-(1-farScale)*q;
 walker.style.width=width+'px';walker.style.height=height+'px';walker.style.bottom=(-Math.max(0,height-stage.clientHeight*.96)*depth*(1-q))+'px';
 walker.style.transform=`translateX(calc(-50% + ${x.toFixed(2)}px)) scale(${scale.toFixed(4)})`;
 walker.style.opacity=reduced?'1':String(Math.min(1,p*8)*(1-Math.max(0,(q-.8)*5)));
 const walking=!reduced&&(p<.97||q>0);
 const phase=(p<1?(1-p)*2200:q*1600)/560*Math.PI*2;
 const wave=Math.sin(phase),amp=walking?1:0;
 function joint(name,value){const el=stage.querySelector('[data-joint="'+name+'"]');if(el)el.setAttribute('transform',value);}
 joint('leftLeg',`translate(96 289) rotate(${amp*wave*24})`);joint('rightLeg',`translate(146 289) rotate(${-amp*wave*24})`);
 joint('leftShin',`translate(0 66) rotate(${amp*Math.max(0,-wave)*31})`);joint('rightShin',`translate(0 66) rotate(${amp*Math.max(0,wave)*31})`);
 joint('leftArm',`translate(73 171) rotate(${-amp*wave*14})`);joint('rightArm',`translate(171 171) rotate(${amp*wave*14})`);
 const bob=walking?-Math.abs(wave)*2:reduced?0:Math.sin(simTime/700)*.65;
 joint('body',`translate(0 ${bob.toFixed(2)})`);
 const nod=model.phase==='served'&&q===0&&!reduced?Math.sin((1700-model.phaseLeft)/350*Math.PI)*2:0;
 joint('head',`rotate(${nod.toFixed(2)} 120 147)`);
 stage.dataset.motion=reduced?'reduced':walking?'walking':departing?'leaving':'waiting';
 stage.style.setProperty('--step-progress',p);
}
root.BBCustomers={character,motion};
})(globalThis);
