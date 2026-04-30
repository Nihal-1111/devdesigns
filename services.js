
/* CURSOR */
const cur=document.getElementById('cur'),curR=document.getElementById('cur-r');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
(function loop(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;curR.style.left=rx+'px';curR.style.top=ry+'px';requestAnimationFrame(loop)})();

/* SCROLL REVEAL */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on')}});
},{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));

/* NAV ACTIVE on scroll */
const sections=document.querySelectorAll('[id]');
const navLinks=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{if(window.scrollY>=s.offsetTop-120)cur=s.id});
  navLinks.forEach(a=>{
    a.classList.toggle('active',a.getAttribute('href')==='#'+cur);
  });
},{passive:true});

/* COUNTER ANIMATE on overview */
const obsC=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.querySelectorAll('.ov-num').forEach(el=>{
      const sup=el.querySelector('sup');
      const txt=el.childNodes[0]?.textContent||'';
      const tgt=parseFloat(txt)||0;
      if(!tgt)return;
      let t0=performance.now();const dur=1400;
      (function tick(now){
        const p=Math.min((now-t0)/dur,1);
        const v=Math.round((1-(1-p)**3)*tgt);
        el.childNodes[0].textContent=v;
        if(p<1)requestAnimationFrame(tick);
      })(t0);
    });
    obsC.unobserve(e.target);
  });
},{threshold:.3});
const ov=document.querySelector('.overview-inner');
if(ov)obsC.observe(ov);

/* TILT on service cards */
document.querySelectorAll('.main-svc').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(1200px) rotateX(${-y*3}deg) rotateY(${x*3}deg)`;
    card.style.transition='transform .08s linear';
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='';
    card.style.transition='transform .6s var(--ease-out)';
  });
});

/* MAGNETIC BUTTONS */
document.querySelectorAll('.btn,.msvc-cta a,.nav-back,.ft-back').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)*.25;
    const dy=(e.clientY-r.top-r.height/2)*.25;
    btn.style.transform=`translate(${dx}px,${dy}px)`;
    btn.style.transition='transform .08s linear';
  });
  btn.addEventListener('mouseleave',()=>{
    btn.style.transform='';
    btn.style.transition='transform .5s var(--ease-spring)';
  });
});

/* link to main site contact section */
function goToContact(e){
  /* if index.html is open in same session, route to contact */
  if(window.opener&&window.opener.goTo){e.preventDefault();window.opener.goTo(5);window.close();}
}
