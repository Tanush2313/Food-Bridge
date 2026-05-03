import { mockFAQ, mockNGOs, mockImpactStats, fetchListings, submitDonation } from './src/api.js';
import { showModal, createNotification } from './src/ui.js';

const navToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links a');
const counters = document.querySelectorAll('.counter');
const revealItems = Array.from(document.querySelectorAll('.reveal'));
const filterButtons = document.querySelectorAll('.filter-btn');
const partnerCards = Array.from(document.querySelectorAll('.partner-card'));
const testimonialSlides = Array.from(document.querySelectorAll('.testimonial-slide'));
const prevButton = document.querySelector('#prev-testimonial');
const nextButton = document.querySelector('#next-testimonial');
const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const yearElement = document.querySelector('#current-year');
const btnBusiness = document.querySelector('#btn-business');
const btnNgo = document.querySelector('#btn-ngo');
const listingsContainer = document.querySelector('#listings-container');
const listingSearch = document.querySelector('#listing-search');
const listingsCount = document.querySelector('#listings-count');
const impactStatsContainer = document.querySelector('#impact-stats');
const faqContainer = document.querySelector('#faq-container');
const activityFeed = document.querySelector('#activity-feed');
const themeToggle = document.querySelector('#theme-toggle');
const loadMoreBtn = document.querySelector('#load-more-listings');

let activeSlide = 0;
let countersStarted = false;
let activeListings = [];
let testimonialInterval = null;
let mapInstance = null;
let mapMarkers = [];

const toggleNavigation = () => {
  navMenu?.classList.toggle('active');
};

const closeNavigation = () => {
  navMenu?.classList.remove('active');
};

const smoothScroll = (event) => {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute('href')?.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;
  if (target) {
    closeNavigation();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target) || 0;
  const duration = 1800;
  const stepTime = Math.max(duration / target, 20);
  let current = 0;
  const increment = () => {
    current += 1;
    counter.textContent = current.toString();
    if (current < target) {
      window.setTimeout(increment, stepTime);
    }
  };
  increment();
};

const startCounters = () => {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach(animateCounter);
};

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < windowHeight - 100) {
      item.classList.add('visible');
    }
  });
};

const setFilter = (filter) => {
  partnerCards.forEach((card) => {
    const type = card.dataset.type;
    card.classList.toggle('hidden', filter !== 'all' && type !== filter);
  });
};

const updateFilterButtons = (selectedButton) => {
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button === selectedButton);
  });
};

const showSlide = (index) => {
  activeSlide = (index + testimonialSlides.length) % testimonialSlides.length;
  testimonialSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === activeSlide);
  });
};

const displayFormStatus = (message, isSuccess = true) => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.add('visible');
  formStatus.classList.toggle('success', isSuccess);
  formStatus.classList.toggle('error', !isSuccess);
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  if (!form) return;
  if (!form.checkValidity()) {
    displayFormStatus('Please fill all required fields correctly.', false);
    return;
  }
  displayFormStatus('Thank you! Your request has been sent successfully.');
  setTimeout(() => {
    form.style.display = 'none';
    const ctaCard = document.querySelector('.cta-card');
    if (ctaCard) ctaCard.style.display = 'block';
    form.reset();
  }, 1500);
};

const setCurrentYear = () => {
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
};

const updateListingCount = (listings) => {
  if (!listingsCount) return;
  listingsCount.textContent = listings.length.toString();
};

const renderListings = (listings = activeListings) => {
  if (!listingsContainer) return;
  updateListingCount(listings);
  listingsContainer.innerHTML = listings.map((listing) => `
    <article class="card listing-card reveal">
      <div class="flex justify-between items-center">
        <h3>${listing.business}</h3>
        <span class="listing-badge ${listing.available ? 'available' : 'unavailable'}">
          ${listing.available ? '✅ Available' : '⏸️ Unavailable'}
        </span>
      </div>
      <p><strong>📍</strong> ${listing.location}</p>
      <p class="my-2"><strong>🍽️ Food:</strong> ${listing.food}</p>
      <p class="my-2"><strong>📦 Quantity:</strong> ${listing.quantity}</p>
      <p class="my-2"><strong>⏱️ Pickup:</strong> ${listing.time} (${listing.pickupWindow} window)</p>
      <button class="btn primary w-full mt-4" ${!listing.available ? 'disabled' : ''} onclick="window.handleClaimFood('${listing.id}')">
        ${listing.available ? 'Claim Food' : 'Already Claimed'}
      </button>
    </article>
  `).join('');
};

const clearMapMarkers = () => {
  mapMarkers.forEach((marker) => mapInstance.removeLayer(marker));
  mapMarkers = [];
};

const addMapMarker = (item, title, iconColor) => {
  if (!mapInstance || !item.latitude || !item.longitude) return;

  const marker = L.circleMarker([Number(item.latitude), Number(item.longitude)], {
    color: '#ffffff',
    weight: 2,
    fillColor: iconColor,
    fillOpacity: 1,
    radius: 8
  }).addTo(mapInstance);

  marker.bindPopup(`<strong>${title}</strong><br>${item.location || item.city || ''}`);
  mapMarkers.push(marker);
};

const renderMapMarkers = () => {
  if (!mapInstance) return;

  clearMapMarkers();

  activeListings.forEach((listing) => {
    if (listing.latitude && listing.longitude) {
      addMapMarker(listing, `${listing.business} (Business)`, '#047857');
    }
  });

  mockNGOs.forEach((ngo) => {
    if (ngo.latitude && ngo.longitude) {
      addMapMarker(ngo, `${ngo.name} (NGO)`, '#f59e0b');
    }
  });

  // Fit bounds to show all markers
  if (mapMarkers.length > 0) {
    const group = new L.featureGroup(mapMarkers);
    mapInstance.fitBounds(group.getBounds().pad(0.1));
  }
};

const loadLeafletMap = () => {
  const mapElement = document.getElementById('location-map');
  if (!mapElement) return;

  // Initialize Leaflet map
  mapInstance = L.map('location-map').setView([20.5937, 78.9629], 5);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance);

  renderMapMarkers();
};

const filterListings = () => {
  if (!listingSearch) return;
  const query = listingSearch.value.trim().toLowerCase();
  const filtered = activeListings.filter((listing) => {
    return [listing.business, listing.location, listing.food].some((value) =>
      value.toLowerCase().includes(query)
    );
  });
  renderListings(filtered);
};

const renderActivityFeed = () => {
  if (!activityFeed) return;
  const events = [
    { time: 'Just now', message: 'Sunrise Restaurant posted 50 portions of biryani for nearby NGOs.' },
    { time: '5 mins ago', message: 'Hope Foundation claimed a fresh food pickup from Grand Hotel.' },
    { time: '12 mins ago', message: 'Cloud Kitchen Pro updated availability after confirming safe delivery.' },
    { time: '20 mins ago', message: 'Logistics partner set a new route for urgent distribution in Mumbai.' }
  ];
  activityFeed.innerHTML = events.map((event) => `
    <article class="activity-card">
      <time>${event.time}</time>
      <p>${event.message}</p>
    </article>
  `).join('');
};

const toggleTheme = () => {
  const isDark = document.body.classList.toggle('dark-mode');
  if (themeToggle) {
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  }
  localStorage.setItem('foodBridgeTheme', isDark ? 'dark' : 'light');
};

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('foodBridgeTheme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.textContent = '☀️';
  }
};

const startAutoSlide = () => {
  if (testimonialInterval) return;
  testimonialInterval = window.setInterval(() => showSlide(activeSlide + 1), 8000);
};

const renderImpactStats = () => {
  if (!impactStatsContainer) return;
  impactStatsContainer.innerHTML = mockImpactStats.map((stat) => `
    <article class="stat-box">
      <div class="stat-box-value">${stat.value}</div>
      <p class="stat-box-label"><strong>${stat.label}</strong></p>
    </article>
  `).join('');
};

const renderFAQ = () => {
  if (!faqContainer) return;
  faqContainer.innerHTML = '<div class="faq-grid">' + mockFAQ.map((item, index) => `
    <div class="faq-item">
      <button class="faq-question" data-index="${index}">
        <span>${item.question}</span>
        <span class="faq-toggle">+</span>
      </button>
      <div class="faq-answer" style="display: none;">
        <p>${item.answer}</p>
      </div>
    </div>
  `).join('') + '</div>';

  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const toggle = btn.querySelector('.faq-toggle');
      const isOpen = answer.style.display !== 'none';
      answer.style.display = isOpen ? 'none' : 'block';
      toggle.textContent = isOpen ? '+' : '−';
    });
  });
};

window.handleClaimFood = async (listingId) => {
  const result = await submitDonation({ listingId });
  if (result.success) {
    const listing = activeListings.find((item) => item.id === listingId || item.id === Number(listingId));
    if (listing) {
      listing.available = false;
      createNotification('Food claimed successfully! ✅', 'success');
      filterListings();
    }
  } else {
    createNotification('Unable to claim food. Please try again.', 'error');
  }
};

const showContactForm = (role) => {
  const ctaCard = document.querySelector('.cta-card');
  if (ctaCard) ctaCard.style.display = 'none';
  if (form) form.style.display = 'block';
  const roleSelect = form.querySelector('#role');
  if (roleSelect) {
    roleSelect.value = role;
    roleSelect.disabled = true;
  }
  if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const loadListings = async () => {
  try {
    activeListings = await fetchListings();
  } catch (error) {
    console.error('Failed to load listing data from API:', error);
    activeListings = [];
  }
  renderListings(activeListings);
  renderMapMarkers();
};

const initialize = async () => {
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
  btnBusiness?.addEventListener('click', () => showContactForm('business'));
  btnNgo?.addEventListener('click', () => showContactForm('ngo'));
  listingSearch?.addEventListener('input', filterListings);
  themeToggle?.addEventListener('click', toggleTheme);

  initializeTheme();
  await loadListings();
  renderImpactStats();
  renderFAQ();
  renderActivityFeed();
  loadLeafletMap();

  setFilter('all');
  setCurrentYear();
  showSlide(activeSlide);
  revealOnScroll();
  startAutoSlide();

  window.addEventListener('scroll', () => {
    revealOnScroll();
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats && heroStats.getBoundingClientRect().top < window.innerHeight - 100) {
      startCounters();
    }
  });

  loadMoreBtn?.addEventListener('click', () => {
    createNotification('Loading more listings...', 'info');
    setTimeout(() => {
      renderListings();
      createNotification('✅ More listings loaded!', 'success');
    }, 800);
  });
};

initialize();
