const navToggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navMenu = document.querySelector<HTMLElement>('.nav-links');
const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');
const counters = document.querySelectorAll<HTMLSpanElement>('.counter');
const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
const partnerCards = Array.from(document.querySelectorAll<HTMLElement>('.partner-card'));
const testimonialSlides = Array.from(document.querySelectorAll<HTMLElement>('.testimonial-slide'));
const prevButton = document.querySelector<HTMLButtonElement>('#prev-testimonial');
const nextButton = document.querySelector<HTMLButtonElement>('#next-testimonial');
const form = document.querySelector<HTMLFormElement>('#contact-form');
const formStatus = document.querySelector<HTMLDivElement>('#form-status');
const yearElement = document.querySelector<HTMLSpanElement>('#current-year');
let activeSlide = 0;
let countersStarted = false;

const toggleNavigation = (): void => {
  navMenu?.classList.toggle('active');
};

const closeNavigation = (): void => {
  navMenu?.classList.remove('active');
};

const smoothScroll = (event: Event): void => {
  event.preventDefault();
  const targetId = (event.currentTarget as HTMLAnchorElement).getAttribute('href')?.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;
  if (target) {
    closeNavigation();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const animateCounter = (counter: HTMLElement): void => {
  const target = Number(counter.dataset.target) || 0;
  const duration = 1800;
  const stepTime = Math.max(duration / target, 20);
  let current = 0;

  const increment = (): void => {
    current += 1;
    counter.textContent = current.toString();
    if (current < target) {
      window.setTimeout(increment, stepTime);
    }
  };

  increment();
};

const startCounters = (): void => {
  if (countersStarted) {
    return;
  }
  countersStarted = true;
  counters.forEach((counter) => animateCounter(counter));
};

const revealOnScroll = (): void => {
  const windowHeight = window.innerHeight;
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < windowHeight - 100) {
      item.classList.add('visible');
    }
  });
};

const setFilter = (filter: string): void => {
  partnerCards.forEach((card) => {
    const type = card.dataset.type;
    card.classList.toggle('hidden', filter !== 'all' && type !== filter);
  });
};

const updateFilterButtons = (selectedButton: HTMLButtonElement): void => {
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button === selectedButton);
  });
};

const showSlide = (index: number): void => {
  activeSlide = (index + testimonialSlides.length) % testimonialSlides.length;
  testimonialSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === activeSlide);
  });
};

const displayFormStatus = (message: string, isSuccess = true): void => {
  if (!formStatus) {
    return;
  }
  formStatus.textContent = message;
  formStatus.classList.add('visible');
  formStatus.classList.toggle('success', isSuccess);
  formStatus.classList.toggle('error', !isSuccess);
};

const handleFormSubmit = (event: Event): void => {
  event.preventDefault();
  if (!form) {
    return;
  }
  if (!form.checkValidity()) {
    displayFormStatus('Please fill all required fields correctly.', false);
    return;
  }

  displayFormStatus('Thank you! Your request has been sent successfully.');
  form.reset();
};

const setCurrentYear = (): void => {
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
};

const initialize = (): void => {
  navToggle?.addEventListener('click', toggleNavigation);
  navLinks.forEach((link) => link.addEventListener('click', smoothScroll));
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      updateFilterButtons(button);
      setFilter(button.dataset.filter || 'all');
    });
  });
  prevButton?.addEventListener('click', () => showSlide(activeSlide - 1));
  nextButton?.addEventListener('click', () => showSlide(activeSlide + 1));
  form?.addEventListener('submit', handleFormSubmit);
  setFilter('all');
  setCurrentYear();
  showSlide(activeSlide);
  revealOnScroll();
  window.addEventListener('scroll', () => {
    revealOnScroll();
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats && heroStats.getBoundingClientRect().top < window.innerHeight - 100) {
      startCounters();
    }
  });
};

initialize();
