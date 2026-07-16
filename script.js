import { mockFAQ, mockNGOs, mockImpactStats, fetchListings, fetchNGOs, submitDonation, createNgo, createListing } from './src/api.js';
import { showModal, createNotification } from './src/ui.js';

// DOM refs
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
const dashboardNgoForm = document.querySelector('#dashboard-ngo-form');
const dashboardListingForm = document.querySelector('#dashboard-listing-form');
const listingsContainer = document.querySelector('#listings-container');
const listingSearch = document.querySelector('#listing-search');
const listingsCount = document.querySelector('#listings-count');
const impactStatsContainer = document.querySelector('#impact-stats');
const dashboardStatsContainer = document.querySelector('#dashboard-stats');
const dashboardNgoList = document.querySelector('#dashboard-ngos-list');
const dashboardListingsList = document.querySelector('#dashboard-listings-list');
const faqContainer = document.querySelector('#faq-container');
const activityFeed = document.querySelector('#activity-feed');
const themeToggle = document.querySelector('#theme-toggle');
const loadMoreBtn = document.querySelector('#load-more-listings');

// State
let activeSlide = 0;
let countersStarted = false;
let activeListings = [];
let ngoLocations = [];
let testimonialInterval = null;
let mapInstance = null;
let mapMarkers = [];

// Helpers
const toggleNavigation = () => navMenu?.classList.toggle('active');
const closeNavigation = () => navMenu?.classList.remove('active');

const smoothScroll = (event) => {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute('href')?.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target) || 0;
  const duration = 1400;
  const step = Math.max(Math.floor(duration / Math.max(target, 1)), 20);
  let current = 0;
  const tick = () => {
    current += 1;
    counter.textContent = current.toString();
    if (current < target) setTimeout(tick, step);
  };
  tick();
};

const startCounters = () => {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach(animateCounter);
};

const revealOnScroll = () => {
  const h = window.innerHeight;
  revealItems.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < h - 100) el.classList.add('visible');
  });
};

const setFilter = (filter) => {
  partnerCards.forEach((card) => {
    const type = card.dataset.type;
    card.classList.toggle('hidden', filter !== 'all' && type !== filter);
  });
};

const updateFilterButtons = (selected) => {
  filterButtons.forEach((btn) => btn.classList.toggle('active', btn === selected));
};

const displayFormStatus = (message, isSuccess = true) => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.add('visible');
  formStatus.classList.toggle('success', isSuccess);
  formStatus.classList.toggle('error', !isSuccess);
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  if (!form) return;
  if (!form.checkValidity()) return displayFormStatus('Please fill required fields', false);
  displayFormStatus('Thanks — we will be in touch');
  setTimeout(() => { form.reset(); form.style.display = 'none'; }, 800);
};

const resetDashboardForm = (formElement) => {
  if (!formElement) return;
  formElement.reset();
};

const handleCreateNgo = async (event) => {
  event.preventDefault();
  if (!dashboardNgoForm) return;
  if (!dashboardNgoForm.checkValidity()) return createNotification('Fill all NGO fields', 'error');

  const formData = new FormData(dashboardNgoForm);
  const newNgo = {
    name: formData.get('name')?.toString().trim(),
    city: formData.get('city')?.toString().trim(),
    people: Number(formData.get('people')) || 0,
    verified: true,
    latitude: Number(formData.get('latitude')),
    longitude: Number(formData.get('longitude')),
  };

  try {
    const created = await createNgo(newNgo);
    ngoLocations.push(created);
    renderDashboardStats();
    renderDashboardEntries();
    renderMapMarkers();
    createNotification('NGO added successfully', 'success');
    resetDashboardForm(dashboardNgoForm);
  } catch (error) {
    createNotification('Failed to add NGO', 'error');
  }
};

const handleCreateListing = async (event) => {
  event.preventDefault();
  if (!dashboardListingForm) return;
  if (!dashboardListingForm.checkValidity()) return createNotification('Fill all listing fields', 'error');

  const formData = new FormData(dashboardListingForm);
  const newListing = {
    business: formData.get('business')?.toString().trim(),
    location: formData.get('location')?.toString().trim(),
    food: formData.get('food')?.toString().trim(),
    quantity: formData.get('quantity')?.toString().trim(),
    pickupWindow: formData.get('pickupWindow')?.toString().trim(),
    available: true,
    latitude: Number(formData.get('latitude')),
    longitude: Number(formData.get('longitude')),
  };

  try {
    const created = await createListing(newListing);
    activeListings.unshift(created);
    renderListings(activeListings);
    renderDashboardStats();
    renderDashboardEntries();
    renderMapMarkers();
    createNotification('Listing added successfully', 'success');
    resetDashboardForm(dashboardListingForm);
  } catch (error) {
    createNotification('Failed to add listing', 'error');
  }
};

const setCurrentYear = () => { if (yearElement) yearElement.textContent = new Date().getFullYear(); };

const updateListingCount = (listings) => { if (listingsCount) listingsCount.textContent = String(listings.length); };

const renderListings = (listings = activeListings) => {
  if (!listingsContainer) return;
  updateListingCount(listings);
  listingsContainer.innerHTML = listings.map((l) => `
    <article class="card listing-card reveal">
      <div class="flex justify-between items-center">
        <h3>${l.business}</h3>
        <span class="listing-badge ${l.available ? 'available' : 'unavailable'}">${l.available ? '✅ Available' : '⏸️ Unavailable'}</span>
      </div>
      <p><strong>📍</strong> ${l.location}</p>
      <p class="my-2"><strong>🍽️</strong> ${l.food}</p>
      <p class="my-2"><strong>📦</strong> ${l.quantity}</p>
      <p class="my-2"><strong>⏱️</strong> ${l.time} (${l.pickupWindow})</p>
      <button class="btn primary w-full mt-4" ${!l.available ? 'disabled' : ''} onclick="window.handleClaimFood('${l.id}')">${l.available ? 'Claim Food' : 'Already Claimed'}</button>
    </article>
  `).join('');
};

const clearMapMarkers = () => { mapMarkers.forEach(m => mapInstance.removeLayer(m)); mapMarkers = []; };

const addMapMarker = (item, title, color = '#047857', symbol = '') => {
  if (!mapInstance) return;
  const lat = Number(item.latitude);
  const lon = Number(item.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
  const marker = L.circleMarker([lat, lon], { color: '#fff', weight: 2, fillColor: color, fillOpacity: 1, radius: 8 }).addTo(mapInstance);
  const locationText = item.location || item.city || '';
  marker.bindPopup(`<strong>${title}</strong><br>${locationText}`);
  mapMarkers.push(marker);
};

const renderMapMarkers = () => {
  if (!mapInstance) return;
  clearMapMarkers();
  activeListings.forEach((l) => { if (l.latitude && l.longitude) addMapMarker(l, `${l.business} (Business)`, '#047857', '🏪'); });
  ngoLocations.forEach((n) => { if (n.latitude && n.longitude) addMapMarker(n, `${n.name} (NGO)`, '#f59e0b', '🤝'); });
  if (mapMarkers.length > 0) { const group = new L.featureGroup(mapMarkers); mapInstance.fitBounds(group.getBounds().pad(0.12)); }
};

const loadLeafletMap = () => {
  const el = document.getElementById('location-map');
  if (!el) return;
  mapInstance = L.map('location-map').setView([20.5937, 78.9629], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(mapInstance);
  setTimeout(() => { mapInstance.invalidateSize(); renderMapMarkers(); }, 150);
};

// API loaders
const loadListings = async () => {
  try { activeListings = await fetchListings(); } catch (e) { console.warn(e); activeListings = []; }
  renderListings(activeListings);
  renderDashboardStats();
  renderDashboardEntries();
  renderMapMarkers();
};

const loadNgoLocations = async () => {
  try { ngoLocations = await fetchNGOs(); } catch (e) { console.warn(e); ngoLocations = mockNGOs; }
  renderDashboardEntries();
  renderMapMarkers();
};

// Dashboard
const renderDashboardStats = () => {
  if (!dashboardStatsContainer) return;
  const available = activeListings.filter(l => l.available).length;
  const total = activeListings.length;
  const ngos = ngoLocations.length || mockNGOs.length;
  const cities = [...new Set(activeListings.map(l => (l.location || '').toLowerCase()))].filter(Boolean).length;
  dashboardStatsContainer.innerHTML = `
    <article class="dashboard-card"><p class="dashboard-label">Active offers</p><h3>${available}/${total}</h3><span>Listings ready for pickup</span></article>
    <article class="dashboard-card"><p class="dashboard-label">Verified NGOs</p><h3>${ngos}</h3><span>Partner organizations</span></article>
    <article class="dashboard-card"><p class="dashboard-label">Cities covered</p><h3>${cities}</h3><span>Active locations</span></article>
  `;
};

const renderDashboardEntries = () => {
  if (dashboardNgoList) {
    const ngos = ngoLocations.length ? ngoLocations : mockNGOs;
    dashboardNgoList.innerHTML = ngos.slice(0, 5).map((ngo) => `
      <article class="dashboard-entry-item">
        <div>
          <strong>${ngo.name || 'Unnamed NGO'}</strong>
          <p>${ngo.city || 'Unknown city'} • ${ngo.people || 0} people</p>
        </div>
        <span class="listing-badge ${ngo.verified ? 'available' : 'unavailable'}">${ngo.verified ? 'Verified' : 'Pending'}</span>
      </article>
    `).join('');
  }

  if (dashboardListingsList) {
    const listings = activeListings.length ? activeListings : [];
    dashboardListingsList.innerHTML = listings.slice(0, 5).map((listing) => `
      <article class="dashboard-entry-item">
        <div>
          <strong>${listing.business || 'Unnamed business'}</strong>
          <p>${listing.location || 'Unknown location'} • ${listing.food || 'Food available'}</p>
        </div>
        <span class="listing-badge ${listing.available ? 'available' : 'unavailable'}">${listing.available ? 'Open' : 'Claimed'}</span>
      </article>
    `).join('');
  }
};

const renderImpactStats = () => { if (!impactStatsContainer) return; impactStatsContainer.innerHTML = mockImpactStats.map(s => `<article class="stat-box"><div class="stat-box-value">${s.value}</div><p class="stat-box-label"><strong>${s.label}</strong></p></article>`).join(''); };

const renderFAQ = () => {
  if (!faqContainer) return;
  faqContainer.innerHTML = '<div class="faq-grid">' + mockFAQ.map((item, i) => `
    <div class="faq-item"><button class="faq-question" data-index="${i}"><span>${item.question}</span><span class="faq-toggle">+</span></button><div class="faq-answer" style="display:none;"><p>${item.answer}</p></div></div>
  `).join('') + '</div>';
  document.querySelectorAll('.faq-question').forEach(btn => btn.addEventListener('click', () => { const ans = btn.nextElementSibling; const open = ans.style.display !== 'none'; ans.style.display = open ? 'none' : 'block'; btn.querySelector('.faq-toggle').textContent = open ? '+' : '−'; }));
};

window.handleClaimFood = async (id) => {
  const res = await submitDonation({ listingId: id });
  if (res.success) {
    const item = activeListings.find(x => String(x.id) === String(id)); if (item) item.available = false;
    createNotification('Food claimed', 'success');
    renderListings(activeListings);
    renderMapMarkers();
  } else {
    createNotification('Claim failed', 'error');
  }
};

const showContactForm = (role) => { if (form) { form.style.display = 'block'; const sel = form.querySelector('#role'); if (sel) { sel.value = role; sel.disabled = true; } form.scrollIntoView({behavior:'smooth'}); } };

const renderActivityFeed = () => { if (!activityFeed) return; activityFeed.innerHTML = [`Just now|Sunrise Restaurant posted 50 portions of biryani`,`5 mins ago|Hope Foundation claimed pickup from Grand Hotel`].map(e => { const [time,msg]=e.split('|'); return `<article class="activity-card"><time>${time}</time><p>${msg}</p></article>`}).join(''); };

const toggleTheme = () => { const isDark = document.body.classList.toggle('dark-mode'); if (themeToggle) themeToggle.textContent = isDark ? '☀️' : '🌙'; localStorage.setItem('foodBridgeTheme', isDark ? 'dark' : 'light'); };

const initializeTheme = () => { const t = localStorage.getItem('foodBridgeTheme'); if (t === 'dark') { document.body.classList.add('dark-mode'); if (themeToggle) themeToggle.textContent = '☀️'; } };

const startAutoSlide = () => { if (testimonialInterval) return; testimonialInterval = setInterval(() => { activeSlide = (activeSlide+1) % testimonialSlides.length; testimonialSlides.forEach((s,i) => s.classList.toggle('active', i===activeSlide)); }, 8000); };

const initialize = async () => {
  navToggle?.addEventListener('click', toggleNavigation);
  navLinks.forEach(l => l.addEventListener('click', smoothScroll));
  filterButtons.forEach(btn => btn.addEventListener('click', () => { updateFilterButtons(btn); setFilter(btn.dataset.filter || 'all'); }));
  prevButton?.addEventListener('click', () => { activeSlide = (activeSlide-1+testimonialSlides.length)%testimonialSlides.length; testimonialSlides.forEach((s,i)=>s.classList.toggle('active', i===activeSlide)); });
  nextButton?.addEventListener('click', () => { activeSlide = (activeSlide+1)%testimonialSlides.length; testimonialSlides.forEach((s,i)=>s.classList.toggle('active', i===activeSlide)); });
  form?.addEventListener('submit', handleFormSubmit);
  btnBusiness?.addEventListener('click', () => showContactForm('business'));
  btnNgo?.addEventListener('click', () => showContactForm('ngo'));
  dashboardNgoForm?.addEventListener('submit', handleCreateNgo);
  dashboardListingForm?.addEventListener('submit', handleCreateListing);
  listingSearch?.addEventListener('input', () => { const q = listingSearch.value.trim().toLowerCase(); const filtered = activeListings.filter(l => [l.business, l.location, l.food].some(v => (v||'').toLowerCase().includes(q))); renderListings(filtered); });
  themeToggle?.addEventListener('click', toggleTheme);

  initializeTheme();
  await loadListings();
  await loadNgoLocations();
  renderDashboardStats();
  renderDashboardEntries();
  renderImpactStats();
  renderFAQ();
  renderActivityFeed();
  loadLeafletMap();
  setFilter('all');
  setCurrentYear();
  revealItems.forEach((el) => el.classList.add('visible'));
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('resize', revealOnScroll);
  startAutoSlide();

  // Periodic refresh so new entries appear in near real-time
  setInterval(() => { loadListings(); loadNgoLocations(); }, 10000);
};

initialize();
