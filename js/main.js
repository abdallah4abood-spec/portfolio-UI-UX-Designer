(function(){
var d=document,r=d.documentElement,$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
function theme(t,save){r.dataset.theme=t;var b=d.getElementById('theme');if(b){b.setAttribute('aria-label','Switch to '+(t==='dark'?'light':'dark')+' theme')}
 var m=d.querySelector('meta[name=theme-color]');if(m)m.content=t==='dark'?'#0B1216':'#F4F7F8';if(save){try{localStorage.setItem('theme',t)}catch(e){}}}
theme(r.dataset.theme||'light');
var tb=d.getElementById('theme');if(tb)tb.addEventListener('click',function(){theme(r.dataset.theme==='dark'?'light':'dark',true)});
var mb=d.getElementById('menu'),nav=d.getElementById('nav');
function close(f){nav.removeAttribute('data-open');mb.setAttribute('aria-expanded','false');if(f)mb.focus()}
if(mb){mb.addEventListener('click',function(){var o=nav.hasAttribute('data-open');o?close():(nav.setAttribute('data-open',''),mb.setAttribute('aria-expanded','true'))});
 d.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.hasAttribute('data-open'))close(true)});
 $('a',nav).forEach(function(a){a.addEventListener('click',function(){close()})})}
var y=d.getElementById('y');if(y)y.textContent=new Date().getFullYear();
$('.tabs').forEach(function(t){var tabs=$('[role=tab]',t);function pick(x){tabs.forEach(function(b){var on=b===x;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;d.getElementById(b.getAttribute('aria-controls')).hidden=!on});x.focus()}
 tabs.forEach(function(b,i){b.addEventListener('click',function(){pick(b)});b.addEventListener('keydown',function(e){var n=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(n){e.preventDefault();pick(tabs[(i+n+tabs.length)%tabs.length])}})})});
if(!('IntersectionObserver' in window)){$('.rv').forEach(function(e){e.classList.add('in')});return}
var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.12});
$('.rv').forEach(function(e,i){e.style.transitionDelay=(i%3)*60+'ms';ro.observe(e)});
var links=$('.nav a[href^="#"]'),secs=links.map(function(a){return d.querySelector(a.getAttribute('href'))}).filter(Boolean);
if(secs.length){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.setAttribute('aria-current',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});secs.forEach(function(s){so.observe(s)})}
})();
