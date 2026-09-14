/* Ben's Burgers 28: one renderer for ingredient bins, order previews and assembled burgers. */
(function (root) {
'use strict';
let serial = 0;
// Measured FRONT edge heights: each visible edge touches the layer below.
const rises = {bottomBun:28,patty:24,cheese:16,bacon:12,lettuce:14,tomato:12,onion:9,pickles:9,sauce:7,topBun:0};
const fronts = {bottomBun:32,patty:30,cheese:28,bacon:32,lettuce:30,tomato:25,onion:24,pickles:20,sauce:12,topBun:30};
function grain(seed,n,fn){let s=seed,out='';for(let i=0;i<n;i++){s=(Math.imul(s,1664525)+1013904223)>>>0;const x=s/4294967296;s=(Math.imul(s,1664525)+1013904223)>>>0;out+=fn(x,s/4294967296,i);}return out;}

function defs(p) {
 return `<defs>
 <linearGradient id="${p}bun" x2=".15" y2="1"><stop stop-color="#fff0b3"/><stop offset=".22" stop-color="#f5bd5d"/><stop offset=".67" stop-color="#d88329"/><stop offset="1" stop-color="#9e4418"/></linearGradient>
 <linearGradient id="${p}bread" x2="0" y2="1"><stop stop-color="#ffe6a3"/><stop offset=".48" stop-color="#e9a44c"/><stop offset="1" stop-color="#b16322"/></linearGradient>
 <linearGradient id="${p}cheese" x2=".3" y2="1"><stop stop-color="#fff480"/><stop offset=".45" stop-color="#ffd134"/><stop offset="1" stop-color="#e89712"/></linearGradient>
 <radialGradient id="${p}meat" cx=".36" cy=".28" r=".8"><stop stop-color="#b2743d"/><stop offset=".45" stop-color="#804522"/><stop offset="1" stop-color="#3f231a"/></radialGradient>
 <radialGradient id="${p}raw" cx=".35" cy=".25" r=".85"><stop stop-color="#f49594"/><stop offset=".5" stop-color="#de6768"/><stop offset="1" stop-color="#a23842"/></radialGradient>
 <linearGradient id="${p}green" x2=".5" y2="1"><stop stop-color="#b4e664"/><stop offset=".45" stop-color="#65ba36"/><stop offset="1" stop-color="#298124"/></linearGradient>
 <radialGradient id="${p}red"><stop stop-color="#ff9970"/><stop offset=".5" stop-color="#f35231"/><stop offset="1" stop-color="#b92620"/></radialGradient>
 <radialGradient id="${p}pickle"><stop stop-color="#dce784"/><stop offset=".58" stop-color="#a5bc50"/><stop offset="1" stop-color="#50752b"/></radialGradient>
 <linearGradient id="${p}bacon" x2="0" y2="1"><stop stop-color="#fbb36b"/><stop offset=".3" stop-color="#c9562d"/><stop offset=".72" stop-color="#96311e"/><stop offset="1" stop-color="#e07836"/></linearGradient>
 <linearGradient id="${p}steel" x2=".2" y2="1"><stop stop-color="#fffaf1"/><stop offset=".3" stop-color="#bdbab2"/><stop offset=".5" stop-color="#595b5b"/><stop offset=".72" stop-color="#c5c5c0"/><stop offset="1" stop-color="#666c70"/></linearGradient>
 </defs>`;
}
function ellipse(cx,cy,rx,ry,fill,extra='') {return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;}
function layer(id,y,p,stage='ready') {
 const u=k=>`url(#${p+k})`;
 if(id==='bottomBun') {
 const pores=grain(61,150,(rx,rz,i)=>{const x=33+174*rx,z=(rz-.5)*34;return ((x-120)/87)**2+(z/19)**2<.94?ellipse(x,y-5+z,.6+i%3*.45,.4+i%2*.45,i%3?'#b57933':'#fff0bf','opacity=".45"'):'';});
 return `<path d="M23 ${y-5}Q120 ${y-31} 217 ${y-5}L214 ${y+15}Q118 ${y+41} 26 ${y+15}Z" fill="${u('bun')}" stroke="#ae6226" stroke-width="2"/>${ellipse(120,y-5,97,23,'#e4a955')}${ellipse(120,y-6,91,19,'#f7d290')}${pores}<path d="M34 ${y+13}Q120 ${y+34} 205 ${y+13}" fill="none" stroke="#f0b55b" stroke-width="3" opacity=".7"/>`;
 }
 if(id==='topBun') {
 let seeds='',seed=1974;for(let i=0;i<48;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=35+seed%174;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const z=-42+seed%49;if(((x-120)/91)**2+((z+6)/51)**2<.90)seeds+=`<ellipse cx="${x}" cy="${y+z}" rx="3.3" ry="1.5" fill="#fff1bc" transform="rotate(${i*29%90-45} ${x} ${y+z})"/>`;}
 return `<path d="M22 ${y+7}C22 ${y-63} 217 ${y-63} 218 ${y+7}Q213 ${y+28} 120 ${y+30}Q31 ${y+28} 22 ${y+7}Z" fill="${u('bun')}" stroke="#b16424" stroke-width="2"/><path d="M34 ${y+9}Q121 ${y+30} 207 ${y+9}" stroke="#f5bd5b" stroke-width="3" fill="none"/><path d="M52 ${y-22}Q88 ${y-46} 139 ${y-38}" stroke="#ffe8a1" stroke-width="6" opacity=".35" stroke-linecap="round" fill="none"/>${seeds}`;
 }
 if(id==='patty') {
 const raw=stage==='raw',burned=stage==='burned',cooking=stage==='cooking';
 const color=raw?u('raw'):burned?'#332520':u('meat');let texture='';
 let seed=3749;for(let i=0;i<180;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=24+seed%192;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const z=-22+seed%44;if(((x-120)/97)**2+(z/22)**2<.88)texture+=ellipse(x,y-4+z,1.3+i%3,.7+i%2,raw?(i%3?'#f3aaa0':'#b6434b'):burned?(i%2?'#514039':'#211a18'):(i%3?'#bc864b':'#45261c'),`opacity="${.45+i%3*.15}"`);}
 let marks='';if(!raw)for(let i=0;i<5;i++){let x=46+i*34;marks+=`<path d="M${x-12} ${y+8}l28-25" stroke="${burned?'#15100e':'#39271e'}" stroke-width="5" stroke-linecap="round" opacity=".65"/>`;}
 return `<path d="M23 ${y-4}Q119 ${y-36} 217 ${y-4}L214 ${y+14}Q177 ${y+31} 122 ${y+30}Q63 ${y+29} 25 ${y+14}Z" fill="${raw?'#af474b':burned?'#201918':'#47271c'}" stroke="${raw?'#a94349':'#382219'}" stroke-width="2"/>${ellipse(120,y-4,98,24,color)}${texture}${grain(143,38,(rx,rz,i)=>{const x=29+181*rx,z=(rz-.5)*39;return ((x-120)/92)**2+(z/20)**2<.9?ellipse(x,y-4+z,raw?2.1:1.8,raw?1.0:.65,raw?'#ffd0b4':'#e4b172','opacity=".48"'):'';})}${marks}${cooking?ellipse(120,y-4,97,23,'#bf8560','opacity=".14"'):''}<path d="M36 ${y+17}q80 23 166 0" fill="none" stroke="${raw?'#e97678':'#9b5e31'}" stroke-width="3" opacity=".6"/>`;
 }
 if(id==='cheese')return `<path d="M20 ${y-12}L121 ${y-30}L220 ${y-8}L211 ${y+10}L157 ${y+8}L128 ${y+28}L91 ${y+11}L26 ${y+12}Z" fill="${u('cheese')}" stroke="#e9a622" stroke-width="1.5"/><path d="M29 ${y-9}l90-16 88 19" fill="none" stroke="#fff3a2" stroke-width="3" opacity=".85"/>`;
 if(id==='lettuce')return `<path d="M17 ${y}Q10 ${y-13} 29 ${y-17}Q35 ${y-33} 52 ${y-21}Q71 ${y-41} 87 ${y-24}Q106 ${y-40} 122 ${y-22}Q145 ${y-39} 159 ${y-24}Q180 ${y-34} 193 ${y-17}Q220 ${y-24} 225 ${y-7}Q236 ${y+8} 214 ${y+14}Q205 ${y+32} 185 ${y+17}Q173 ${y+35} 154 ${y+18}Q136 ${y+34} 116 ${y+19}Q95 ${y+36} 79 ${y+17}Q56 ${y+32} 44 ${y+14}Q20 ${y+21} 17 ${y}Z" fill="${u('green')}" stroke="#408d28" stroke-width="2"/><g stroke="#d5ee90" stroke-width="2" fill="none" opacity=".5"><path d="M28 ${y}q84-17 184 0M67 ${y+14}l21-32M121 ${y+19}v-43M169 ${y+15}l-14-30"/></g>`;
 if(id==='tomato'){
 let s='';[79,153].forEach((x,j)=>{s+=ellipse(x,y+j*3,66,23,'#b82a20');s+=ellipse(x,y-4+j*3,63,21,u('red'),`stroke="#ff8059" stroke-width="2"`);for(let i=0;i<7;i++){const a=i*Math.PI*2/7;s+=ellipse(x+Math.cos(a)*40,y-4+j*3+Math.sin(a)*12,7,3,'#ffb76c','opacity=".75"');}s+=ellipse(x,y-4+j*3,10,6,'#f5c486');});return s;
 }
 if(id==='onion'){let s='';[72,118,162].forEach((x,i)=>{s+=ellipse(x,y+(i%2)*5,48,17,'none','stroke="#733887" stroke-width="7"');s+=ellipse(x,y-2+(i%2)*5,48,17,'none','stroke="#e6bbe9" stroke-width="4"');s+=ellipse(x,y-3+(i%2)*5,41,13,'none','stroke="#a964ba" stroke-width="2"');});return s;}
 if(id==='pickles'){let s='';[66,120,174].forEach((x,i)=>{s+=ellipse(x,y+(i%2)*3,36,17,u('pickle'),'stroke="#527e28" stroke-width="3"');for(let j=0;j<5;j++){let a=j*1.26;s+=ellipse(x+Math.cos(a)*20,y+(i%2)*3+Math.sin(a)*8,3,2,'#eceda4');}});return s;}
 if(id==='bacon'){let s='';for(let i=0;i<3;i++){let z=y-11+i*11;const raw=stage==='raw';s+=`<path d="M25 ${z}Q40 ${z-13} 56 ${z}T88 ${z}T120 ${z}T152 ${z}T184 ${z}T218 ${z}L213 ${z+9}Q199 ${z+21} 181 ${z+10}T150 ${z+10}T118 ${z+10}T86 ${z+10}T55 ${z+10}T24 ${z+10}Z" fill="${raw?'#dd6b65':stage==='burned'?'#4c2a20':u('bacon')}" stroke="${raw?'#b64749':'#84321c'}" stroke-width="1.5"/><path d="M27 ${z+4}Q43 ${z-8} 57 ${z+4}T89 ${z+4}T121 ${z+4}T153 ${z+4}T185 ${z+4}T214 ${z+4}" fill="none" stroke="${raw?'#ffe5c7':'#f4aa61'}" stroke-width="4" opacity=".8"/>`; }return s;}
 if(id==='sauce')return `<path d="M38 ${y}q23-17 40 1t40 0t40 0t39-1" fill="none" stroke="#ae291b" stroke-width="10" stroke-linecap="round"/><path d="M39 ${y-2}q22-14 39 1t40 0t40 0t37-1" fill="none" stroke="#f57a40" stroke-width="5" stroke-linecap="round"/>`;
 return '';
}
function wrap(body,p,view='0 0 240 260',label='') {return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" role="img" aria-label="${label}" focusable="false">${defs(p)}${body}</svg>`;}
function burger(layers,compact=false) {
 const p='bb'+(++serial);let front=244,body=ellipse(121,249,94,6,'#3d2314','opacity=".17"');
 for(const id of layers){const y=front-(fronts[id]||0);body+=`<g data-layer="${id}" data-front="${front}">${layer(id,y,p)}</g>`;front-=rises[id]||0;}
 if(!layers.length)body='<path d="M83 189q0-42 74 0M83 195h74M83 207h74M83 218q37 13 74 0" stroke="#9b713e" stroke-width="4" fill="none" opacity=".22"/>';
 return wrap(body,p,'0 0 240 260',layers.length?'Burger with '+layers.join(', '):'Empty burger board');
}
function food(id,stage='ready') {
 const p='bb'+(++serial);let item=id;if(item==='rawPatty'){item='patty';stage='raw';}if(item==='rawBacon'){item='bacon';stage='raw';}
 let body=layer(item,67,p,stage);
 if(id==='cheese')body=`<g transform="translate(7 11)">${layer(item,64,p,stage)}</g><g transform="translate(-3 5)">${layer(item,64,p,stage)}</g>${layer(item,62,p,stage)}`;
 if(id==='sauce')return wrap(`<path d="M91 43Q87 32 98 29L108 26V10H129V28L141 31Q148 34 149 44L154 166Q154 178 143 180H99Q88 178 86 166Z" fill="#b93e22" stroke="#79301e" stroke-width="3"/><path d="M101 47L102 162" stroke="#f8904e" stroke-width="9" opacity=".4"/><path d="M106 11V-2L114-15H123L132-2V11Z" fill="#f4bb61"/><rect x="92" y="92" width="57" height="47" rx="8" fill="#f7dfac"/><text x="120" y="112" text-anchor="middle" fill="#8c3a24" font-size="11" font-weight="800">BURGER</text><text x="120" y="126" text-anchor="middle" fill="#8c3a24" font-size="11" font-weight="800">SAUCE</text>`,p,'44 -22 152 216','Burger sauce bottle');
 return wrap(body,p,'0 0 240 120',id);
}

function drink(fill=1) {
 const p='bb'+(++serial),h=Math.max(0,Math.min(1,fill))*105;
 return wrap(`<path d="M54 31h105l-15 139H72Z" fill="#fff6db" stroke="#c4ac89" stroke-width="3"/><path d="M60 ${161-h}h92l-9 ${h}H72Z" fill="#64311f"/><path d="M66 45l10 113" stroke="#fff" stroke-width="7" opacity=".23"/><ellipse cx="107" cy="31" rx="55" ry="12" fill="#e8dcc4" stroke="#b19d81" stroke-width="3"/><ellipse cx="107" cy="29" rx="48" ry="8" fill="#402a22"/><path d="M118 45l9-62h28" stroke="#dd5440" stroke-width="8" fill="none"/><path d="M118 43l8-59" stroke="#fff1d5" stroke-width="2"/><ellipse cx="108" cy="111" rx="28" ry="23" fill="#bd3d2e"/><text x="108" y="119" fill="#fff3dd" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="24">B</text>`,p,'35 -23 140 200','Cola');
}
function fries() {
 const p='bb'+(++serial);let f='';for(let i=0;i<15;i++){let x=55+(i*17%107),y=10+i*19%37;f+=`<rect x="${x}" y="${y}" width="9" height="105" rx="3" fill="${i%2?'#ffdb66':'#efb342'}" stroke="#d79524" stroke-width="1.5" transform="rotate(${i%5*6-12} ${x} 100)"/>`;}
 return wrap(`${f}<path d="M49 77q58 20 116 0l-16 98H65Z" fill="#c1372c" stroke="#922820" stroke-width="3"/><path d="M65 89l7 73M89 95l4 70M119 95l-2 70M145 89l-7 73" stroke="#fff5dc" stroke-width="12"/><ellipse cx="108" cy="128" rx="21" ry="18" fill="#eac259"/><text x="108" y="136" text-anchor="middle" fill="#914327" font-family="Georgia" font-size="24">B</text>`,p,'35 0 145 188','Fries');
}
function machine(type,progress=0) {
 const p='bb'+(++serial),u=k=>`url(#${p+k})`;
 if(type==='drink')return wrap(`<path d="M43 8h154v181H43Z" fill="${u('steel')}" stroke="#505a60" stroke-width="4"/><rect x="54" y="18" width="132" height="55" rx="8" fill="#a8372c"/><text x="120" y="53" text-anchor="middle" fill="#fff3d1" font-size="25" font-family="Georgia" font-style="italic">Ben's Cola</text><path d="M66 82h109v93H66Z" fill="#202b31"/><path d="M107 72v22h22V72" fill="#b7baba"/>${progress>0&&progress<1?'<path d="M119 94v28" stroke="#835138" stroke-width="5"/>':''}<path d="M93 117h54l-8 53h-38Z" fill="#efe3ca"/><path d="M99 ${165-progress*39}H141L136 166H104Z" fill="#6e3925"/><path d="M54 181h132" stroke="#333" stroke-width="7"/>`,p,'20 0 200 206','Drink filling station');
 let bubbles='';for(let i=0;i<14;i++)bubbles+=ellipse(64+i*41%115,99+i*17%39,2+i%3,2,'#f7d26d','opacity=".65"');
 return wrap(`<path d="M35 54l22-33h135l15 33v130H35Z" fill="${u('steel')}" stroke="#575c5e" stroke-width="3"/><path d="M46 59h149v96H46Z" fill="#504129" stroke="#222c30" stroke-width="6"/><path d="M54 87h132v56H54Z" fill="#b07b2c"/>${progress>0?bubbles:''}<path d="M61 79h117l-12 73H73Z" fill="none" stroke="#d8d1b7" stroke-width="4"/><g stroke="#d8d1b7" opacity=".7"><path d="M69 92h101M70 106h98M73 123h93M81 86v58M99 86v60M119 86v60M139 86v60M158 86v56"/></g><path d="M119 78V8h61" stroke="#282d31" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="170" cy="170" r="6" fill="#7bc955"/><path d="M58 168h60" stroke="#4a555c" stroke-width="5"/>`,p,'20 0 200 206','Fries fryer');
}
const api={burger,food,drink,fries,machine,rises,fronts};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BBArt=api;
})(typeof globalThis!=='undefined'?globalThis:this);
