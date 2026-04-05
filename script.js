var track = document.getElementById('ctrack');
var dotsContainer = document.getElementById('cdots');
var cur = 0;
var total = track ? track.children.length : 0;
var visible = window.innerWidth <= 768 ? 1 : 2;
var max = Math.max(0, total - visible);

function updateDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  var count = visible === 1 ? total : max + 1;
  for (var i = 0; i < count; i++) {
    var dot = document.createElement('div');
    dot.className = i === cur ? 'cdot active' : 'cdot';
    dot.setAttribute('onclick', 'goSlide(' + i + ')');
    dotsContainer.appendChild(dot);
  }
}

function initCarousel() {
  if (!track) return;
  total = track.children.length;
  visible = window.innerWidth <= 768 ? 1 : 2;
  max = Math.max(0, total - visible);
  if (cur > max) cur = max;
  updateDots();
  render();
}

function render() {
  if (!track || !track.children.length) return;
  var w = track.children[0].offsetWidth + 12;
  track.style.transform = 'translateX(-' + (cur * w) + 'px)';
  var dots = document.querySelectorAll('.cdot');
  for (var i = 0; i < dots.length; i++) {
    dots[i].classList.toggle('active', i === cur);
  }
  var prev = document.querySelector('.btn-prev');
  var next = document.querySelector('.btn-next');
  if (prev) {
    prev.style.opacity = cur === 0 ? '0.5' : '1';
    prev.style.pointerEvents = cur === 0 ? 'none' : 'auto';
  }
  if (next) {
    next.style.opacity = cur >= max ? '0.5' : '1';
    next.style.pointerEvents = cur >= max ? 'none' : 'auto';
  }
}

function moveSlide(dir) {
  var n = cur + dir;
  if (n >= 0 && n <= max) {
    cur = n;
    render();
  }
}

function goSlide(i) {
  if (i >= 0 && i <= max) {
    cur = i;
    render();
  }
}

var resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initCarousel, 150);
});

var faders = document.querySelectorAll('.fade');

function showFade() {
  for (var i = 0; i < faders.length; i++) {
    var r = faders[i].getBoundingClientRect();
    if (r.top < window.innerHeight + 50 && r.bottom > 0) {
      faders[i].classList.add('show');
    }
  }
}

showFade();
window.addEventListener('scroll', showFade);

document.addEventListener('DOMContentLoaded', function() {
  initCarousel();
  window.addEventListener('load', render);

  var stars = document.querySelectorAll('.star');
  if (stars.length > 0) {
    var ratings = [];
    var voted = false;

    for (var i = 0; i < stars.length; i++) {
      (function(idx) {
        stars[idx].addEventListener('mouseover', function() {
          if (voted) return;
          for (var j = 0; j < stars.length; j++) {
            stars[j].classList.toggle('active', j <= idx);
          }
        });
        stars[idx].addEventListener('mouseout', function() {
          if (voted) return;
          for (var j = 0; j < stars.length; j++) {
            stars[j].classList.remove('active');
          }
        });
      })(i);
    }

    window.rate = function(val) {
      if (voted) return;
      voted = true;
      ratings.push(val);
      for (var i = 0; i < stars.length; i++) {
        stars[i].classList.toggle('active', i < val);
      }
      var sum = 0;
      for (var i = 0; i < ratings.length; i++) sum += ratings[i];
      var avg = (sum / ratings.length).toFixed(1);
      if (document.getElementById('ratingScore')) document.getElementById('ratingScore').textContent = avg;
      if (document.getElementById('ratingCount')) document.getElementById('ratingCount').textContent = ratings.length + ' rating' + (ratings.length !== 1 ? 's' : '');
      if (document.getElementById('ratingMsg')) document.getElementById('ratingMsg').style.display = 'block';
    };
  }
});

function openLightbox(src, alt) {
  var img = document.getElementById('lightbox-img');
  var lb = document.getElementById('lightbox');
  if (!img || !lb) return;
  img.src = src;
  img.alt = alt;
  lb.classList.add('open');
}

function closeLightbox() {
  var lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
});
