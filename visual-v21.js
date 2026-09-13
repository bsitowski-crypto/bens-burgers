(()=>{
'use strict';
/* Swap the rough prototype food drawings for the richer PNG art already in the repo. */
const srcDescriptor=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
const replacements={
  'assets/game/bottom-bun.svg':'assets/bottom-bun.png',
  'assets/game/top-bun.svg':'assets/top-bun.png',
  'assets/game/patty-raw.svg':'assets/raw-patty.png',
  'assets/game/patty-cooking.svg':'assets/cooking-patty.png',
  'assets/game/patty-cooked.svg':'assets/cooked-patty.png',
  'assets/game/patty-burned.svg':'assets/burned-patty.png',
  'assets/game/pickles.svg':'assets/pickles-v21.svg'
};
if(srcDescriptor?.set&&srcDescriptor?.get){
  Object.defineProperty(HTMLImageElement.prototype,'src',{
    configurable:true,
    enumerable:srcDescriptor.enumerable,
    get(){return srcDescriptor.get.call(this)},
    set(value){
      let v=String(value);const q=v.indexOf('?');const base=q>=0?v.slice(0,q):v;const query=q>=0?v.slice(q):'';
      if(replacements[base])v=replacements[base]+query;
      srcDescriptor.set.call(this,v);
    }
  });
}

/* The engine still sets an emoji face; this turns it into a full counter customer with rotating outfits. */
const customer=document.getElementById('customerEmoji');
const name=document.getElementById('customerName');
const outfits={Lou:['#d95842','red'],Maya:['#333943','hoodie'],Eddie:['#3d754a','green'],Tina:['#c07b2d','gold'],Sam:['#426b9a','blue'],Nora:['#8a5043','plaid'],Gus:['#3d754a','green'],Penny:['#d95842','red'],Bea:['#426b9a','blue'],Dex:['#8a5043','plaid']};
function dress(){const key=name?.textContent?.trim();const [shirt,outfit]=outfits[key]||['#d95842','red'];customer?.style.setProperty('--shirt',shirt);if(customer)customer.dataset.outfit=outfit}
if(name){new MutationObserver(dress).observe(name,{childList:true,subtree:true,characterData:true});dress()}
})();