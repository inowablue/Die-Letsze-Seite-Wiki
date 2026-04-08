const track = document.getElementById('ctrack');
const dotsContainer = document.getElementById('cdots');
let cur = 0;
let visible = window.innerWidth <= 768 ? 1 : 2;
let total = track ? track.children.length : 0;
let max = Math.max(0, total - visible);

function render() {
  if (!track) return;
  const w = track.children[0].offsetWidth + 12;
  track.style.transform = `translateX(-${cur * w}px)`;
  
  document.querySelectorAll('.cdot').forEach((dot, i) => {
    dot.classList.toggle('active', i === cur);
  });

  const prev = document.querySelector('.btn-prev');
  const next = document.querySelector('.btn-next');
  if (prev) {
    prev.style.opacity = cur === 0 ? '0.5' : '1';
    prev.style.pointerEvents = cur === 0 ? 'none' : 'auto';
  }
  if (next) {
    next.style.opacity = cur >= max ? '0.5' : '1';
    next.style.pointerEvents = cur >= max ? 'none' : 'auto';
  }
}

function init() {
  if (!track) return;
  total = track.children.length;
  visible = window.innerWidth <= 768 ? 1 : 2;
  max = Math.max(0, total - visible);
  if (cur > max) cur = max;
  
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    const count = visible === 1 ? total : max + 1;
    for (let i = 0; i < count; i++) {
      let dot = document.createElement('div');
      dot.className = i === cur ? 'cdot active' : 'cdot';
      dot.onclick = () => { cur = i; render(); };
      dotsContainer.appendChild(dot);
    }
  }
  render();
}

function moveSlide(dir) {
  const n = cur + dir;
  if (n >= 0 && n <= max) {
    cur = n;
    render();
  }
}

window.addEventListener('resize', () => {
  setTimeout(init, 150);
});

const faders = document.querySelectorAll('.fade');
function showFade() {
  faders.forEach(fader => {
    if (fader.getBoundingClientRect().top < window.innerHeight + 50) {
      fader.classList.add('show');
    }
  });
}

window.addEventListener('scroll', showFade);
showFade();

document.addEventListener('DOMContentLoaded', () => {
  init();
  
  const stars = document.querySelectorAll('.star');
  let voted = false;
  let ratings = [];

  stars.forEach((star, idx) => {
    star.addEventListener('mouseover', () => {
      if (voted) return;
      stars.forEach((s, j) => s.classList.toggle('active', j <= idx));
    });
    star.addEventListener('mouseout', () => {
      if (voted) return;
      stars.forEach(s => s.classList.remove('active'));
    });
  });

  window.rate = (val) => {
    if (voted) return;
    voted = true;
    ratings.push(val);
    stars.forEach((s, i) => s.classList.toggle('active', i < val));
    
    let sum = ratings.reduce((a, b) => a + b, 0);
    let avg = (sum / ratings.length).toFixed(1);
    
    if (document.getElementById('ratingScore')) document.getElementById('ratingScore').textContent = avg;
    if (document.getElementById('ratingCount')) document.getElementById('ratingCount').textContent = `${ratings.length} rating(s)`;
    if (document.getElementById('ratingMsg')) document.getElementById('ratingMsg').style.display = 'block';
  };

  const topBtn = document.createElement('button');
  topBtn.innerHTML = '&#8679;';
  topBtn.className = 'back-to-top';
  document.body.appendChild(topBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) topBtn.classList.add('show');
    else topBtn.classList.remove('show');
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

function openLightbox(src, alt) {
  const img = document.getElementById('lightbox-img');
  const lb = document.getElementById('lightbox');
  if (img && lb) {
    img.src = src;
    img.alt = alt;
    lb.classList.add('open');
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});