/* v32: production sprites derived from approved artwork; gameplay still uses exact recipes. */
(function(root){
'use strict';
root.BB32_TEXTURE_URI='stand-art-v32.webp';
const cells={"rawPatty":[2,2,135,77],"patty":[141,2,133,82],"readyPatty":[278,2,136,87],"topBun":[418,2,108,63],"bottomBun":[530,2,123,69],"cheese":[657,2,131,63],"lettuce":[792,2,124,62],"tomato":[2,93,104,47],"onion":[110,93,106,51],"pickles":[220,93,136,46],"bacon":[360,93,123,70],"sauce":[487,93,65,127],"grill":[556,93,420,220],"lou":[2,317,236,201],"maya":[242,317,236,205],"eddie":[482,317,236,206],"nora":[722,317,232,208],"gus":[2,529,236,182],"_size":[1024,713]},base=root.BBArt;let serial=0;
function sprite(id,x=0,y=0,w=240,h=160){
 const r=cells[id];if(!r)return '';
 return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${r.join(' ')}" preserveAspectRatio="none" style="overflow:hidden" aria-hidden="true"><image href="${root.BB32_TEXTURE_URI}" x="0" y="0" width="${cells._size[0]}" height="${cells._size[1]}"/></svg>`;
}
function wrap(body,view,label){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" role="img" aria-label="${label}" focusable="false">${body}</svg>`;}
function food(id,stage='ready'){
 if(id==='rawBacon'||id==='sauce')return base.food(id,stage);
 let key=id==='patty'?(stage==='raw'?'rawPatty':stage==='cooking'?'patty':'readyPatty'):id;
 if(!cells[key])return base.food(id,stage);
 const r=cells[key];const h=id==='sauce'?118:Math.min(112,210*r[3]/r[2]),w=id==='sauce'?h*r[2]/r[3]:210;
 return wrap(`<g ${stage==='burned'?'style="filter:brightness(.27) saturate(.25)"':''}>${sprite(key,(240-w)/2,(130-h)/2,w,h)}</g>`,'0 0 240 130',id+' '+stage);
}
function burger(layers,compact=false){
 if(!layers.length)return wrap('<ellipse cx="120" cy="236" rx="80" ry="9" fill="#653c20" opacity=".09"/>','0 0 240 270','Empty serving board');
 let bottom=248,body='<ellipse cx="120" cy="247" rx="101" ry="10" fill="#3f2619" opacity=".2"/>',min=248;
 const heights={bottomBun:52,patty:65,topBun:87,cheese:31,lettuce:36,tomato:28,onion:25,pickles:26,bacon:28,sauce:12};
 const rises={bottomBun:20,patty:22,cheese:12,lettuce:15,tomato:13,onion:9,pickles:10,bacon:12,sauce:5,topBun:0};
 for(const id of layers){
  const h=heights[id]||20;min=Math.min(min,bottom-h);
  let part=id==='sauce'?'<path d="M35 '+(bottom-7)+'q23-12 43 0t43 0t43 0t40 0" fill="none" stroke="#cf512b" stroke-width="7" stroke-linecap="round"/>':sprite(id==='patty'?'readyPatty':id,13,bottom-h,214,h);
  body+='<g data-layer="'+id+'">'+part+'</g>';bottom-=rises[id]||0;
 }
 return wrap(body,`0 ${compact?Math.max(0,min-12):Math.min(15,min-10)} 240 ${compact?266-Math.max(0,min-12):266-Math.min(15,min-10)}`,'Burger with '+layers.join(', '));
}
root.BBArt={...base,food,burger,sprite,cells};
})(globalThis);
