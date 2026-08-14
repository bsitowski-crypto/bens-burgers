(()=>{
const s=document.createElement('style');
s.textContent=`
/* v14: compensate for transparent padding inside ingredient PNG files */
.foodItem#bun:before{
  inset:-42% -42% 4%!important;
  background-size:220% auto!important;
  background-position:center 48%!important;
}
.foodItem#cheese:before{
  inset:-48% -48% 2%!important;
  background-size:235% auto!important;
  background-position:center 50%!important;
}
.rawbin:before{
  inset:-30% -24% -4%!important;
  background-size:185% auto!important;
  background-position:center 52%!important;
}
.dualPatty{
  left:3%!important;
  top:4%!important;
  width:44%!important;
  height:88%!important;
  background-size:175% auto!important;
}
.plateBun:before{
  width:82%!important;
  height:90%!important;
  background-size:175% auto!important;
  background-position:center 60%!important;
}
#layers .patty{
  width:76%!important;
  height:34%!important;
  background-size:170% auto!important;
  background-position:center 58%!important;
}
#layers .cheese{
  width:72%!important;
  height:29%!important;
  background-size:185% auto!important;
  background-position:center 54%!important;
}
#layers .topBun{
  width:78%!important;
  height:38%!important;
  background-size:175% auto!important;
  background-position:center 56%!important;
}
/* keep the finished burger compact rather than floating */
#layers .layer{transform:translateX(-50%)!important}
`;
document.head.appendChild(s);
})();