'use strict';
// Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('header');
const message = document.createElement('div');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContents = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dots = document.querySelector('.dots');

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Cookie message
message.classList.add('cookie-message');
message.innerHTML = `
We use Cookies for improved functionality and analytics. 
<button class="btn btn--close--cookie">Got it!</button>`;
header.append(message);
const btnCloseCookie = document.querySelector('.btn--close--cookie');
const closeCookie = function () {
  message.remove();
};
btnCloseCookie.addEventListener('click', closeCookie);

message.style.backgroundColor = '#37383d';
message.style.width = '100vw';
message.style.padding = '10px';

// Learn More Button - Smooth Scroll
btnScrollTo.addEventListener('click', () =>
  section1.scrollIntoView({ behavior: 'smooth' })
);

// Navigation Links - Smooth Scroll [using event delegation]
// Adding the event listener to a common parent element
const handleNavScroll = function (e) {
  e.preventDefault();

  // Determine the origin element (Matching)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    const section = document.querySelector(id);
    section.scrollIntoView({ behavior: 'smooth' });
  }
};
navLinks.addEventListener('click', handleNavScroll);

// Tabbed Component
const handleTabs = function (e) {
  e.preventDefault();
  const clickedTab = e.target.closest('.operations__tab');
  const tabNum = clickedTab.dataset.tab;
  const tabContent = document.querySelector(`.operations__content--${tabNum}`);

  if (!clickedTab) return;

  // Activate Tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clickedTab.classList.add('operations__tab--active');

  // Activate Content
  tabsContents.forEach(tC =>
    tC.classList.remove('operations__content--active')
  );
  tabContent.classList.add('operations__content--active');
};
tabsContainer.addEventListener('click', handleTabs);

// Nav Links Fade on Hover
const handleNavFade = function (opacity, e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });

    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', handleNavFade.bind(null, 0.5));
nav.addEventListener('mouseout', handleNavFade.bind(null, 1));

// Sticky Nav [using Intersection Observer API]
const navHeight = nav.getBoundingClientRect().height;
const handleStickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(handleStickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal Sections
const handleRevealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(handleRevealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(s => {
  // s.classList.add('section--hidden');
  sectionObserver.observe(s);
});

// Lazy Loading Images
const handleLazyImages = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replacing src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(handleLazyImages, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const startSlider = function () {
  let currentSlide = 0;
  const lastSlide = slides.length - 1;

  // -- Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dots.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    const dots = document.querySelectorAll('.dots__dot');
    dots.forEach(dot => dot.classList.remove('dots__dot--active'));

    const targetDot = document.querySelector(
      `.dots__dot[data-slide="${slide}"]`
    );
    targetDot.classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const handleRightSlide = function () {
    if (currentSlide === lastSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const handleLeftSlide = function () {
    if (currentSlide === 0) {
      currentSlide = lastSlide;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const initSlider = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  initSlider();

  // -- Event Listeners

  btnRight.addEventListener('click', handleRightSlide);
  btnLeft.addEventListener('click', handleLeftSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') handleRightSlide();
    if (e.key === 'ArrowLeft') handleLeftSlide();
  });
  dots.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
startSlider();
