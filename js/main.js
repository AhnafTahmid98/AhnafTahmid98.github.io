// ═══════════════════════════════════════════
// Main — Scroll reveal, file uploads, 3D tilt
// ═══════════════════════════════════════════

// SCROLL REVEAL
const obs = new IntersectionObserver(
  es => es.forEach(e => e.isIntersecting && e.target.classList.add('on')),
  { threshold: .08 }
);
document.querySelectorAll('.r').forEach(el => obs.observe(el));

// Progress bar reveal for skills
const visObs = new IntersectionObserver(
  es => es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      visObs.unobserve(e.target);
    }
  }),
  { threshold: .3 }
);
document.querySelectorAll('.sk-sc').forEach(c => visObs.observe(c));

// ═══════════════ FILE UPLOAD ═══════════════
function trig(id) {
  document.getElementById(id).click();
}

function loadM(e, vId, iId) {
  const f = e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  const slot = e.target.closest('.vslot, .pj-media');
  slot.querySelectorAll('.vplay, .vlbl').forEach(x => x.style.display = 'none');
  const v = document.getElementById(vId);
  const i = document.getElementById(iId);
  if (f.type.startsWith('video/')) {
    v.src = url;
    v.style.display = 'block';
    i.style.display = 'none';
  } else {
    i.src = url;
    i.style.display = 'block';
    v.style.display = 'none';
  }
}

// Expose to global scope for inline onclick/onchange handlers
window.trig = trig;
window.loadM = loadM;

// Scroll hint (show until the user reaches the page bottom)
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
  const updateHintVisibility = () => {
    const scrollBottom = window.scrollY + window.innerHeight;
    const distanceToBottom = document.documentElement.scrollHeight - scrollBottom;
    if (distanceToBottom > 120) {
      scrollHint.classList.remove('hidden');
    } else {
      scrollHint.classList.add('hidden');
    }
  };

  window.addEventListener('scroll', updateHintVisibility, { passive: true });
  window.addEventListener('resize', updateHintVisibility);
  scrollHint.addEventListener('click', () => setTimeout(updateHintVisibility, 100));
  updateHintVisibility();
}

// ═══════════════ 3D TILT ═══════════════
document.querySelectorAll('.tilt-wrap').forEach(wrap => {
  const card = wrap.querySelector('.tilt');
  if (!card) return;
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(0)`;
  });
  wrap.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
  });
});
