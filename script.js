let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const progressBar = document.getElementById('progressBar');
const slideIndicator = document.getElementById('slideIndicator');
const dynamicBg = document.querySelector('.dynamic-bg');
const root = document.documentElement;
const transitionLayer = document.getElementById('transition-layer');
const transitionText = document.getElementById('transition-text');

let isTransitioning = false;

function updateSlideVisuals(activeSlide) {
    const slideImage = activeSlide.querySelector('img');
    const accentColor = activeSlide.getAttribute('data-accent');
    
    // --- BACKGROUND LOGIC ---
    if (slideImage) {
        // IMAGE MODE: Use image as background + color blend
        dynamicBg.classList.remove('gradient-bg');
        dynamicBg.style.backgroundImage = `url(${slideImage.src})`;
        
        // Apply color blend
        const bgColor = activeSlide.getAttribute('data-color');
        dynamicBg.style.backgroundColor = bgColor;
        dynamicBg.style.backgroundBlendMode = 'multiply';

    } else {
        // NO IMAGE MODE: Dynamic Gradient of SAME COLOR
        // Create a subtle gradient based on the base color
        const baseColor = activeSlide.getAttribute('data-color') || '#000000';
        
        dynamicBg.style.backgroundImage = `linear-gradient(135deg, ${baseColor}, #000000, ${baseColor})`;
        dynamicBg.style.backgroundColor = baseColor; 
        dynamicBg.style.backgroundBlendMode = 'normal';
        dynamicBg.classList.add('gradient-bg');
    }

    // Update Accents
    root.style.setProperty('--accent', accentColor);

    // Update Progress
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.style.backgroundColor = accentColor;
    slideIndicator.innerText = `${currentSlide + 1} / ${totalSlides}`;
}

// Function to handle the simplified transition
function showSlideWithTransition(index) {
    if (isTransitioning) return;
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;

    isTransitioning = true;
    
    const nextSlide = slides[index];
    const titleElement = nextSlide.querySelector('h2') || nextSlide.querySelector('h1');
    const titleText = titleElement ? titleElement.innerText : "";
    
    // 1. Set text
    transitionText.innerText = titleText;
    
    // 2. Fade In Transition Layer (Black BG + Sliding Text)
    transitionLayer.classList.add('active');
    
    // 3. Wait for fade-in and read time (1.2 seconds)
    setTimeout(() => {
        // Swap slides behind the curtain
        currentSlide = index;
        slides.forEach(slide => slide.classList.remove('active'));
        nextSlide.classList.add('active');
        updateSlideVisuals(nextSlide);

        // 4. Fade Out
        transitionLayer.classList.remove('active');
        
        // Reset state
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
        
    }, 1200);
}

function changeSlide(direction) {
    showSlideWithTransition(currentSlide + direction);
}

function toggleNotes() {
    const notes = document.querySelectorAll('.speaker-notes');
    notes.forEach(note => note.classList.toggle('hidden'));
}

// Initial Load
slides[0].classList.add('active');
updateSlideVisuals(slides[0]);

// KEYBOARD SUPPORT
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        changeSlide(1);
    }
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    }
});

// --- SIMPLE TOUCH GESTURE FOR PROMETHEAN BOARD ---
let touchstartX = 0;
let touchendX = 0;

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    // If finger moves left (swiping the slide to the right), go to NEXT slide
    if (touchendX < touchstartX - 100) {
        changeSlide(1);
    }
}, false);