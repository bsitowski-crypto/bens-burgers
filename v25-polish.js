(()=>{'use strict';
const meats=[...document.querySelectorAll('.ingredient[data-item="patties"],.ingredient[data-item="bacon"]')];
const grills=[...document.querySelectorAll('.grillSlot')];
function clear(){meats.forEach(x=>x.classList.remove('selected'))}
meats.forEach(b=>b.addEventListener('click',()=>{clear();b.classList.add('selected')}));
grills.forEach(g=>g.addEventListener('click',()=>{setTimeout(()=>{const hasFood=(g.querySelector('.foodSprite')?.style.backgroundImage||'')!=='none'&&(g.querySelector('.foodSprite')?.style.backgroundImage||'')!=='';if(hasFood)clear()},30)}));
document.querySelectorAll('.ingredient:not([data-item="patties"]):not([data-item="bacon"])').forEach(b=>b.addEventListener('click',clear));
})();