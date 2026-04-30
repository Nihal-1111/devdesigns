/* ═══════════════════════════════════════════════
   DEV DESIGNS — script.js
   3D · Animated · Reactive
═══════════════════════════════════════════════ */

/* ══════════════════════
   STATE
══════════════════════ */
let currentSection = 0;
let isAnimating    = false;
let siteOpen       = false;

const SECTIONS = [
  { name: 'Home',     sub: 'Bhopal, MP' },
  { name: 'About',    sub: 'Who We Are' },
  { name: 'Services', sub: 'What We Offer' },
  { name: 'Projects', sub: 'Portfolio' },
  { name: 'Process',  sub: 'How We Work' },
  { name: 'Contact',  sub: 'Get In Touch' },
];

/* ══════════════════════
   DOM REFS
══════════════════════ */
const entrance  = document.getElementById('entrance');
const enterBtn  = document.getElementById('enterBtn');
const site      = document.getElementById('site');
const trans     = document.getElementById('trans');
const dotnav    = document.getElementById('dotnav');
const dots      = document.querySelectorAll('.dot');
const secs      = document.querySelectorAll('.sec');
const hSecName  = document.getElementById('hSecName');
const hSecSub   = document.getElementById('hSecSub');
const hCounter  = document.getElementById('hCounter');
const hProg     = document.getElementById('hProg');

/* ══════════════════════
   CUSTOM CURSOR
══════════════════════ */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
  }
  requestAnimationFrame(animRing);
})();

/* ══════════════════════
   ENTRANCE
══════════════════════ */
enterBtn.addEventListener('click', openEntrance);

function openEntrance() {
  entrance.classList.add('open');

  setTimeout(() => {
    site.classList.add('visible');
  }, 600);

  setTimeout(() => {
    entrance.style.opacity = '0';
    entrance.style.pointerEvents = 'none';
    entrance.style.transition = 'opacity 0.5s ease';
  }, 1200);

  setTimeout(() => {
    entrance.style.display = 'none';
    siteOpen = true;
    revealSection(0);
    animateCounters();
  }, 1700);
}

/* ══════════════════════
   NAVIGATION
══════════════════════ */
function goTo(index) {
  if (isAnimating || index === currentSection || !siteOpen) return;
  if (index < 0 || index >= SECTIONS.length) return;

  isAnimating = true;

  const prev = currentSection;
  const next = index;
  const dir  = next > prev ? 1 : -1;

  // Exit current
  const prevSec = document.getElementById('s' + prev);
  prevSec.classList.remove('active');
  prevSec.classList.add('exit-up');

  // Clear ri items
  prevSec.querySelectorAll('.ri').forEach(el => {
    el.classList.remove('show');
  });

  // Enter next
  const nextSec = document.getElementById('s' + next);
  nextSec.style.transform = `translateY(${dir * 50}px) scale(0.98)`;
  nextSec.style.opacity   = '0';
  nextSec.style.visibility = 'visible';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      nextSec.style.transition = 'opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out)';
      nextSec.style.transform = 'translateY(0) scale(1)';
      nextSec.style.opacity   = '1';
      nextSec.classList.add('active');
    });
  });

  setTimeout(() => {
    prevSec.classList.remove('exit-up');
    prevSec.style.cssText = '';
    nextSec.style.cssText = '';
    currentSection = next;
    isAnimating = false;
    updateHeader(next);
    updateDots(next);
    revealSection(next);
    // scroll top
    nextSec.scrollTop = 0;
    // Section-specific animations
    if (next === 0) animateCounters();
  }, 750);
}

/* ══════════════════════
   HEADER UPDATE
══════════════════════ */
function updateHeader(idx) {
  const s = SECTIONS[idx];
  hSecName.textContent = s.name;
  hSecSub.textContent  = s.sub;
  hCounter.textContent = String(idx + 1).padStart(2,'0') + ' / ' + String(SECTIONS.length).padStart(2,'0');
  hProg.style.width = ((idx + 1) / SECTIONS.length * 100) + '%';
}

/* ══════════════════════
   DOT NAV
══════════════════════ */
dots.forEach(dot => {
  dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index)));
});

function updateDots(idx) {
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

/* ══════════════════════
   REVEAL ITEMS
══════════════════════ */
function revealSection(idx) {
  const sec = document.getElementById('s' + idx);
  const items = sec.querySelectorAll('.ri');
  items.forEach(el => {
    el.classList.remove('show');
    void el.offsetWidth; // reflow
  });
  requestAnimationFrame(() => {
    items.forEach(el => el.classList.add('show'));
  });
}

/* ══════════════════════
   KEYBOARD NAVIGATION
══════════════════════ */
document.addEventListener('keydown', e => {
  if (!siteOpen) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(currentSection + 1);
  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  goTo(currentSection - 1);
});

/* ══════════════════════
   WHEEL NAVIGATION
══════════════════════ */
let wheelLock = false;
document.addEventListener('wheel', e => {
  if (!siteOpen || isAnimating || wheelLock) return;
  const sec = document.getElementById('s' + currentSection);
  const atTop    = sec.scrollTop <= 0;
  const atBottom = sec.scrollTop + sec.clientHeight >= sec.scrollHeight - 4;
  if (e.deltaY > 60 && atBottom) {
    goTo(currentSection + 1);
    wheelLock = true;
    setTimeout(() => wheelLock = false, 900);
  } else if (e.deltaY < -60 && atTop) {
    goTo(currentSection - 1);
    wheelLock = true;
    setTimeout(() => wheelLock = false, 900);
  }
}, { passive: true });

/* ══════════════════════
   TOUCH SWIPE
══════════════════════ */
let touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', e => {
  if (!siteOpen || isAnimating) return;
  const dy = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(dy) > 50) goTo(currentSection + (dy > 0 ? 1 : -1));
}, { passive: true });

/* ══════════════════════
   COUNTER ANIMATION
══════════════════════ */
function animateCounters() {
  const stats = document.querySelectorAll('.hstat-num');
  stats.forEach(el => {
    const target = parseFloat(el.textContent.replace(/[^0-9.]/g, '')) || 0;
    const suffix = el.querySelector('sup') ? el.querySelector('sup').outerHTML : '';
    let start = 0; const dur = 1800;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target === 99.99
        ? (eased * target).toFixed(2)
        : Math.round(eased * target);
      el.innerHTML = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ══════════════════════
   3D TILT — SERVICE CARDS
══════════════════════ */
function initTilt(selector, intensity = 12) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `
        perspective(600px)
        rotateX(${-y * intensity}deg)
        rotateY(${x * intensity}deg)
        translateZ(8px)
      `;
      card.style.transition = 'transform 0.1s linear, box-shadow 0.4s, border-color 0.4s, background 0.4s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.transition = 'transform 0.6s var(--ease-out), box-shadow 0.4s, border-color 0.4s, background 0.4s';
    });
  });
}

/* ══════════════════════
   3D TILT — PROJECTS
══════════════════════ */
function initProjectHover() {
  document.querySelectorAll('.proj').forEach(proj => {
    proj.addEventListener('mousemove', e => {
      const r = proj.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      proj.style.transform = `
        perspective(500px)
        rotateX(${-y * 6}deg)
        rotateY(${x * 6}deg)
        scale(1.02)
      `;
      proj.style.zIndex = '10';
      proj.style.transition = 'transform 0.1s linear';
    });
    proj.addEventListener('mouseleave', () => {
      proj.style.transform = '';
      proj.style.zIndex    = '';
      proj.style.transition = 'transform 0.6s var(--ease-out)';
    });
  });
}

/* ══════════════════════
   MAGNETIC BUTTONS
══════════════════════ */
function initMagnetic() {
  document.querySelectorAll('.btn-g, .enter-btn, .btn-send, .wa').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r   = btn.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = (e.clientX - cx) * 0.28;
      const dy  = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s var(--ease-spring)';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s linear';
    });
  });
}

/* ══════════════════════
   PARALLAX GRID LINES
══════════════════════ */
function initParallax() {
  const gridLines = document.querySelector('.home-grid-lines');
  if (!gridLines) return;
  document.getElementById('s0').addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    gridLines.style.transform = `translate(${x}px, ${y}px)`;
    gridLines.style.transition = 'transform 0.5s ease';
  });
}

/* ══════════════════════
   ABOUT VISUAL — MOUSE PARALLAX
══════════════════════ */
function initAboutParallax() {
  const visual = document.querySelector('.about-visual');
  if (!visual) return;
  document.getElementById('s1').addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 15;
    const y = (e.clientY / window.innerHeight - 0.5) * 15;
    const rings = visual.querySelectorAll('.av-ring');
    rings.forEach((r, i) => {
      const fac = (i + 1) * 0.4;
      r.style.transform = `translate(${x * fac}px, ${y * fac}px)`;
      r.style.transition = 'transform 0.4s ease';
    });
  });
}

/* ══════════════════════
   FORM ENHANCEMENTS
══════════════════════ */
function initForm() {
  const inputs = document.querySelectorAll('.fg input, .fg select, .fg textarea');
  inputs.forEach(inp => {
    inp.addEventListener('focus', () => {
      inp.closest('.fg').querySelector('label').style.color = 'var(--gold)';
    });
    inp.addEventListener('blur', () => {
      inp.closest('.fg').querySelector('label').style.color = '';
    });
  });

  const btnSend = document.querySelector('.btn-send');
  if (btnSend) {
    btnSend.addEventListener('click', () => {
      const name  = document.querySelector('.fg input[type="text"]')?.value;
      const email = document.querySelector('.fg input[type="email"]')?.value;
      if (!name || !email) {
        btnSend.textContent = '⚠ Fill required fields';
        btnSend.style.background = 'rgba(255,80,80,0.2)';
        btnSend.style.color = '#ff8080';
        setTimeout(() => {
          btnSend.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          btnSend.style.background = '';
          btnSend.style.color = '';
        }, 2000);
        return;
      }
      btnSend.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btnSend.style.background = 'var(--gold)';
      setTimeout(() => {
        btnSend.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      }, 3000);
    });
  }
}

/* ══════════════════════
   GSAP ANIMATIONS (if available)
══════════════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // entrance emblem spin
  gsap.to('.enter-emblem i', {
    rotation: 360, duration: 20, ease: 'none', repeat: -1
  });
}

/* ══════════════════════
   CURSOR STATE ON ELEMENTS
══════════════════════ */
function initCursorStates() {
  document.querySelectorAll('.svc-card, .proj, .pstep').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '12px';
      cursor.style.height = '12px';
      cursor.style.background = 'var(--gold)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '';
      cursor.style.height = '';
      cursor.style.background = '';
    });
  });
}

/* ══════════════════════
   SECTION BACKGROUND GLOW
══════════════════════ */
function initSectionGlow() {
  document.querySelectorAll('.sec').forEach(sec => {
    sec.addEventListener('mousemove', e => {
      const x = e.clientX;
      const y = e.clientY;
      sec.style.backgroundImage = `
        radial-gradient(
          600px circle at ${x}px ${y}px,
          rgba(200,169,110,0.03) 0%,
          transparent 70%
        )
      `;
    });
    sec.addEventListener('mouseleave', () => {
      sec.style.backgroundImage = '';
    });
  });
}

/* ══════════════════════
   INIT
══════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  updateHeader(0);
  initTilt('.svc-card', 10);
  initProjectHover();
  initMagnetic();
  initParallax();
  initAboutParallax();
  initForm();
  initGSAP();
  initCursorStates();
  initSectionGlow();
});