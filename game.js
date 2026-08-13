const SPRITES={
raw:"assets/raw-patty.png",cooking:"assets/cooking-patty.png",
ready:"assets/cooked-patty.png",burned:"assets/burned-patty.png",
bottomBun:"assets/bottom-bun.png",topBun:"assets/top-bun.png",
cheese:"assets/cheese.png",bunStock:"assets/buns-stock.png",
cheeseStock:"assets/cheese-stock.png"};
const $=x=>document.getElementById(x);let money=0,score=0,served=0,patience=100,order='cheese',selected=false,cookedSelected=false,grill='empty',built=['bottomBun'],timer,gt;
const names=['Lou','Maya','Eddie','Tina','Sam','Nora','Gus','Penny'],people=['🧑','👩','🧔','👩‍🦱','👨','👩‍🦰','🧑‍🦱','👨‍🦱'];


function animatePattyToBun(done){
  const gp=$('grillPatty');
  const bun=$('plateBun');
  const game=$('game');
  const gr=gp.getBoundingClientRect(), br=bun.getBoundingClientRect(), rr=game.getBoundingClientRect();

  const ghost=document.createElement('div');
  ghost.id='transferGhost';ghost.style.backgroundImage='url('+SPRITES.ready+')';ghost.style.backgroundSize='contain';ghost.style.backgroundRepeat='no-repeat';ghost.style.backgroundPosition='center';
  ghost.style.left=((gr.left + gr.width/2 - rr.left)/rr.width*100)+'%';
  ghost.style.top=((gr.top + gr.height/2 - rr.top)/rr.height*100)+'%';
  ghost.style.transform='translate(-50%,-50%) scale(1)';
  game.appendChild(ghost);

  requestAnimationFrame(()=>{
    ghost.style.left=((br.left + br.width/2 - rr.left)/rr.width*100)+'%';
    ghost.style.top=((br.top + br.height*0.60 - rr.top)/rr.height*100)+'%';
    ghost.style.transform='translate(-50%,-50%) scale(.88)';
  });

  setTimeout(()=>{
    ghost.style.opacity='0';
    setTimeout(()=>{ghost.remove();done()},180);
  },320);
}

function showGrillPatty(state){
  const p=$('grillPatty');
  if(state==='empty'){
    p.style.display='none';
    p.className='grillPatty spritePatty';
    p.removeAttribute('src');
    $('grill').classList.remove('sizzle');
    return;
  }
  p.style.display='block';
  p.src=SPRITES[state];
  p.className='grillPatty spritePatty '+state;
  if(state==='ready') p.classList.add('pickable');
  if(state==='raw'||state==='cooking') $('grill').classList.add('sizzle');
  else $('grill').classList.remove('sizzle');
}

function flash(t){let m=$('msg');m.textContent=t;m.classList.add('show');clearTimeout(m.t);m.t=setTimeout(()=>m.classList.remove('show'),1100)}
function hud(){$('money').textContent=money.toFixed(2);$('score').textContent=score;$('served').textContent=served}
function lights(s){['lraw','lcook','lready'].forEach(x=>$(x).classList.remove('on'));if(s==='raw')$('lraw').classList.add('on');if(s==='cook')$('lcook').classList.add('on');if(s==='ready')$('lready').classList.add('on')}

function updateServeHint(){
  const target=order==='cheese'?['bottomBun','patty','cheese','topBun']:['bottomBun','patty','topBun'];
  const ok=JSON.stringify(built)===JSON.stringify(target);
  $('cust').classList.toggle('readyToServe',ok);
}

function render(){
  $('layers').innerHTML='';
  built.forEach(x=>{
    if(x==='bottomBun') return;
    let d=document.createElement('div');
    d.className='layer '+x;
    let im=document.createElement('img');
    im.alt=x;
    im.src=(x==='patty' ? SPRITES.ready : SPRITES[x]);
    d.appendChild(im);
    $('layers').appendChild(d);
  });
  updateServeHint();
}
function next(){built=['bottomBun'];render();selected=false;cookedSelected=false;$('plateBun').classList.remove('readyTarget');$('raw').classList.remove('selected');grill='empty';lights('');showGrillPatty('empty');order=Math.random()<.65?'cheese':'plain';let i=served%names.length;$('name').textContent=names[i];$('cust').textContent=people[i];$('order').textContent=order==='cheese'?'One cheeseburger, please!':'One hamburger, please!';patience=100;clearInterval(timer);timer=setInterval(()=>{patience=Math.max(0,patience-.7);$('patnum').textContent=Math.round(patience);$('patbar').style.width=patience+'%';if(!patience){clearInterval(timer);served++;hud();flash('Customer left!');setTimeout(next,700)}},300)}

$('grillPatty').onclick=(e)=>{
  e.stopPropagation();
  if(grill!=='ready'){flash('Wait until the patty is fully cooked');return}
  cookedSelected=true;
  $('grillPatty').classList.add('selectedCooked');
  $('plateBun').classList.add('readyTarget');
  flash('Cooked patty selected — tap the bottom bun on the plate');
};
$('plateBun').onclick=()=>{
  if(!cookedSelected){
    if(grill==='ready') flash('Tap the cooked patty on the grill first');
    else flash('Cook a patty first');
    return;
  }
  if(built.includes('patty')) return;

  cookedSelected=false;
  $('plateBun').classList.remove('readyTarget');
  $('grillPatty').classList.remove('selectedCooked');

  clearTimeout(gt);
  animatePattyToBun(()=>{
    grill='empty';
    lights('');
    showGrillPatty('empty');
    built=['bottomBun','patty'];
    render();
    flash('Patty placed on the bottom bun!');
  });
};

$('raw').onclick=()=>{if(grill!=='empty')return flash('There is already a patty on the grill');selected=true;$('raw').classList.add('selected');flash('Raw patty picked up')};
$('grill').onclick=()=>{if(grill==='burned'){grill='empty';lights('');showGrillPatty('empty');return flash('Burned patty tossed')}if(grill!=='empty')return flash(grill==='ready'?'Patty is ready!':'Patty is cooking…');if(!selected)return flash('Tap the raw patty first');selected=false;$('raw').classList.remove('selected');grill='raw';lights('raw');showGrillPatty('raw');flash('Patty on grill');gt=setTimeout(()=>{grill='cook';lights('cook');showGrillPatty('cooking');gt=setTimeout(()=>{grill='ready';lights('ready');showGrillPatty('ready');flash('Patty ready!');gt=setTimeout(()=>{if(grill==='ready'){grill='burned';lights('');showGrillPatty('burned');flash('Patty burned!')}},7000)},5800)},1200)};
$('bun').onclick=()=>{if(!built.length){built=['bottomBun'];render();return}let target=order==='cheese'?3:2;if(built.length===target){built.push('topBun');render();return}if(built.length===1){return flash(grill==='ready'?'Tap the cooked patty, then tap the bottom bun':'Cook the patty first')}flash('Add cheese next')};
$('cheese').onclick=()=>{if(order!=='cheese')return flash('This customer did not order cheese');if(built.length!==2)return flash('Add bun and cooked patty first');built.push('cheese');render()};
$('cust').onclick=()=>{let target=order==='cheese'?['bottomBun','patty','cheese','topBun']:['bottomBun','patty','topBun'];if(JSON.stringify(built)!==JSON.stringify(target))return flash('Finish the burger first, then tap the customer');clearInterval(timer);let earn=4.75+2+patience/50;money+=earn;score+=Math.round(patience);served++;hud();flash('Served to '+$('name').textContent+'! +$'+earn.toFixed(2));setTimeout(next,700)};
showGrillPatty('empty');hud();next();