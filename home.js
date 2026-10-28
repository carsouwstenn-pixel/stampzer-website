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

// Filmpje "Zo werkt het": een tijdlijn van 20 seconden in de telefoon (scannen, toevoegen, stempelen,
// beloning). Speelt af zodra hij in beeld is en pauzeert daarbuiten; de stappen rechts zijn hoofdstukken
// om naartoe te springen. Met "minder beweging" speelt hij niet vanzelf en toont elke stap een stilstaand beeld.
// De meldingen zijn dezelfde teksten die Apple Wallet echt laat zien (apple-wallet in het dashboard).
(function(){
  var film=document.querySelector('[data-film]');if(!film)return;
  var DUUR=20000,START=[0,4500,9000,15500],STIL=[3800,6800,14300,18500],N=10;
  var ICOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 9h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10h2.5a2.5 2.5 0 0 1 0 5H16"/><path d="M7 3v2M10.5 3v2"/></svg>';
  function maakStempels(wrap){var uit=[];for(var i=0;i<N;i++){var s=document.createElement('span');s.className='stamp';s.innerHTML=ICOON;wrap.appendChild(s);uit.push(s);}return uit;}
  maakStempels(film.querySelector('[data-film-leeg]'));
  var stempels=maakStempels(film.querySelector('[data-film-stempels]'));
  var voet=film.querySelector('[data-film-voet]'),noti=film.querySelector('[data-film-noti]');
  var knoppen=[].slice.call(film.querySelectorAll('[data-stap]'));
  var balken=knoppen.map(function(k){return k.querySelector('.film__bar i');});
  var play=film.querySelector('[data-film-play]'),tijd=film.querySelector('[data-film-tijd]');
  var tikPill=film.querySelector('.tik--pill'),tikAdd=film.querySelector('.tik--add');
  var rustig=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  var t=0,speelt=false,gepauzeerd=false,laatst=null;

  function scene(t){var s=0;for(var i=0;i<START.length;i++)if(t>=START[i])s=i;return s;}
  // Stempels: de eerste na het toevoegen, dan "een paar bezoeken later" snel door naar 9, de laatste bij de beloning.
  function aantal(t){if(t<9700)return 0;if(t<11400)return 1;if(t<15800)return Math.min(9,2+Math.floor((t-11400)/420));return N;}
  function zet(el,klasse,aan){if(el.classList.contains(klasse)!==aan)el.classList.toggle(klasse,aan);}
  function mmss(ms){var s=Math.floor(ms/1000);return '0:'+(s<10?'0':'')+s;}
  function render(){
    var s=scene(t),n=aantal(t);
    if(film.getAttribute('data-scene')!==String(s))film.setAttribute('data-scene',s);
    zet(film,'lock',t>1500&&t<START[1]);
    zet(film,'pill',t>2300&&t<START[1]);
    zet(film,'later',t>11200&&t<14600);
    zet(film,'noti-aan',(t>9900&&t<11300)||(t>14700&&t<15600)||t>16000);
    zet(film,'feest-aan',t>16000);
    zet(tikPill,'aan',!rustig&&t>3500&&t<4200);
    zet(tikAdd,'aan',!rustig&&t>7300&&t<8000);
    for(var i=0;i<N;i++)zet(stempels[i],'on',i<n);
    var over=N-n;
    voet.textContent=n>=N?'Kaart vol! Je koffie is van ons 🎉':'Nog '+over+' stempel'+(over===1?'':'s')+' tot je gratis koffie';
    noti.textContent=n>=N?'Je kaart is vol (10/10)! 🎉 Laat je gratis koffie inwisselen.':n>=9?'Nog 1 stempel tot gratis koffie! Je staat op 9/10':'Stempel erbij! Je staat nu op 1/10';
    for(var j=0;j<knoppen.length;j++){
      var eind=j+1<START.length?START[j+1]:DUUR,p=Math.max(0,Math.min(1,(t-START[j])/(eind-START[j])));
      balken[j].style.width=(p*100).toFixed(1)+'%';
      zet(knoppen[j].parentNode,'is-on',j===s);
      if(j===s)knoppen[j].setAttribute('aria-current','step');else knoppen[j].removeAttribute('aria-current');
    }
    tijd.textContent=mmss(t)+' / '+mmss(DUUR);
  }
  function frame(ts){if(!speelt)return;if(laatst!==null){t+=Math.min(ts-laatst,100);if(t>=DUUR)t-=DUUR;}laatst=ts;render();requestAnimationFrame(frame);}
  function knop(){play.textContent=speelt?'❚❚ Pauzeer':'▶ Speel af';play.setAttribute('aria-label',speelt?'Pauzeer het filmpje':'Speel het filmpje af');}
  function start(){if(speelt)return;speelt=true;laatst=null;knop();requestAnimationFrame(frame);}
  function stop(){speelt=false;knop();}
  play.addEventListener('click',function(){if(speelt){gepauzeerd=true;stop();}else{gepauzeerd=false;start();}});
  knoppen.forEach(function(k,i){k.addEventListener('click',function(){t=rustig||gepauzeerd?STIL[i]:START[i];render();});});
  if(rustig){t=STIL[0];gepauzeerd=true;}
  else if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!gepauzeerd)start();}else stop();});},{threshold:.35}).observe(film);
  }else start();
  render();knop();
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

// Reveal on scroll
(function(){
  if(!('IntersectionObserver' in window)){document.querySelectorAll('.reveal').forEach(function(x){x.classList.add('in');});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.1});
  document.querySelectorAll('.reveal').forEach(function(x){io.observe(x);});
})();
