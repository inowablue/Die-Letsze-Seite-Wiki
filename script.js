// Carousel functionality
const track = document.getElementById('ctrack');
const dotsContainer = document.getElementById('cdots');
let cur = 0;
let total = track ? track.children.length : 0;
let visibleSlides = getVisibleSlides(); // Determine based on screen width
let max = Math.max(0, total - visibleSlides);

// Function to determine number of visible slides based on screen width
function getVisibleSlides() {
  return window.innerWidth <= 768 ? 1 : 2; // Mobile: 1 slide, Desktop: 2 slides
}

// Function to create/update dots dynamically
function updateDots() {
  if (!dotsContainer) return;
  
  const dotCount = visibleSlides === 1 ? total : max + 1;
  
  // Clear existing dots
  dotsContainer.innerHTML = '';
  
  // Create new dots
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('div');
    dot.className = `cdot ${i === cur ? 'active' : ''}`;
    dot.setAttribute('onclick', `goSlide(${i})`);
    dotsContainer.appendChild(dot);
  }
}

// Initialize or reinitialize carousel on resize
function initCarousel() {
  if (!track) return;
  
  total = track.children.length;
  const newVisibleSlides = getVisibleSlides();
  const newMax = Math.max(0, total - newVisibleSlides);
  
  // Adjust current index if it exceeds new max
  if (cur > newMax) {
    cur = newMax;
  }
  
  visibleSlides = newVisibleSlides;
  max = newMax;
  
  updateDots();
  render();
}

function render() {
  if (!track || !track.children.length) return;
  
  const slideWidth = track.children[0].offsetWidth;
  const gap = 12; // Matches the gap in CSS
  const moveDistance = cur * (slideWidth + gap);
  
  track.style.transform = `translateX(-${moveDistance}px)`;
  
  // Update dots active state
  const dots = document.querySelectorAll('.cdot');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === cur);
  });
  
  // Disable buttons at limits for better UX
  const prevBtn = document.querySelector('.btn-prev');
  const nextBtn = document.querySelector('.btn-next');
  
  if (prevBtn) {
    prevBtn.style.opacity = cur === 0 ? '0.5' : '1';
    prevBtn.style.pointerEvents = cur === 0 ? 'none' : 'auto';
  }
  
  if (nextBtn) {
    nextBtn.style.opacity = cur >= max ? '0.5' : '1';
    nextBtn.style.pointerEvents = cur >= max ? 'none' : 'auto';
  }
}

function moveSlide(dir) {
  const newPos = cur + dir;
  if (newPos >= 0 && newPos <= max) {
    cur = newPos;
    render();
  }
}

function goSlide(i) {
  if (i >= 0 && i <= max) {
    cur = i;
    render();
  }
}

// Debounced resize handler for better performance
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initCarousel();
  }, 150);
});

// Intersection Observer for fade-in effects
const faders = document.querySelectorAll(".fade");

const appear = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.15 });

faders.forEach(el => appear.observe(el));

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  
  // Also render after images load (to get correct widths)
  window.addEventListener('load', render);
});