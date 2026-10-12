// Stampzer homepage — externalized so it runs under the site CSP (script-src 'self').
// Marks the document as JS-enabled so .reveal elements only start hidden when JS can reveal them.
document.documentElement.classList.add('js');

// Hero: animated stamp fill
(function(){
  var wrap=document.getElementById('stamps'),foot=document.getElementById('stampfoot');if(!wrap)return;
  var N=10,els=[];
  for(var i=0;i<N;i++){var s=document.createElement('span');s.className='stamp';s.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 9h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10h2.5a2.5 2.5 0 0 1 0 5H16"/><path d="M7 3v2M10.5 3v2"/></svg>';wrap.appendChild(s);els.push(s);}
  var n=0;
  function tick(){
    if(n<N){els[n].classList.add('on');n++;var left=N-n;foot.textContent=left>0?('Nog '+left+' stempel'+(left===1?'':'s')+' tot je gratis koffie'):'Kaart vol! Je koffie is van ons 🎉';}
    else{setTimeout(function(){for(var j=0;j<N;j++)els[j].classList.remove('on');n=0;foot.textContent='Nog 10 stempels tot je gratis koffie';},1600);}
  }
  tick();setInterval(tick,900);
})();

// ROI — dopamine calculator with smooth count-up
(function(){
  var ids=['k','s','b','u'],r={},v={};
  ids.forEach(function(i){r[i]=document.getElementById('r_'+i);v[i]=document.getElementById('v_'+i);});
  var elYear=document.getElementById('out_year'),elMonth=document.getElementById('out_month'),elVisits=document.getElementById('out_visits');
  var barBase=document.getElementById('bar_base'),barUs=document.getElementById('bar_us');
  var cur={year:21600,month:1800,visits:180};
  function euro(n){return '€'+Math.round(n).toLocaleString('nl-NL');}
  function ease(t){return 1-Math.pow(1-t,3);}
  function animate(el,from,to,fmt){
    var t0=null,dur=650;
    function fr(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);var val=from+(to-from)*ease(p);el.textContent=fmt(val);if(p<1)requestAnimationFrame(fr);}
    requestAnimationFrame(fr);
  }
  function targets(){
    var k=+r.k.value,s=+r.s.value,b=+r.b.value,u=+r.u.value/100;
    var baseMonth=k*b*s;var extraVisits=k*b*u;var extraMonth=extraVisits*s;var extraYear=extraMonth*12;
    return {k:k,s:s,b:b,u:Math.round(u*100),baseMonth:baseMonth,extraVisits:extraVisits,extraMonth:extraMonth,extraYear:extraYear};
  }
  function update(){
    if(!elYear)return;
    var t=targets();
    v.k.textContent=t.k;v.s.textContent=t.s;v.b.textContent=t.b;v.u.textContent=t.u;
    animate(elYear,cur.year,t.extraYear,euro);
    animate(elMonth,cur.month,t.extraMonth,euro);
    animate(elVisits,cur.visits,t.extraVisits,function(n){return Math.round(n).toLocaleString('nl-NL');});
    cur={year:t.extraYear,month:t.extraMonth,visits:t.extraVisits};
    // bars: base fixed-ish, us grows with uplift
    var usPct=Math.min(60+ (t.u/40)*38,98);
    barBase.style.width='60%';barUs.style.width=usPct+'%';
    elYear.classList.remove('pulse');void elYear.offsetWidth;elYear.classList.add('pulse');
  }
  ids.forEach(function(i){if(r[i])r[i].addEventListener('input',update);});update();
})();

// Mobile burger menu
(function(){
  var nav=document.querySelector('.nav'),b=document.querySelector('.nav__burger');if(!b)return;
  b.addEventListener('click',function(){nav.classList.toggle('open');});
  document.querySelectorAll('.nav__links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');});});
})();

// Reveal on scroll
(function(){
  if(!('IntersectionObserver' in window)){document.querySelectorAll('.reveal').forEach(function(x){x.classList.add('in');});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.1});
  document.querySelectorAll('.reveal').forEach(function(x){io.observe(x);});
})();
