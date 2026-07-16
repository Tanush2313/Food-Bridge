export const mockNGOs = [
  { id: 1, name: 'Hope Foundation', city: 'Delhi', people: 500, verified: true, latitude: 28.6139, longitude: 77.2090 },
  { id: 2, name: 'Seva Samiti', city: 'Mumbai', people: 300, verified: true, latitude: 19.0760, longitude: 72.8777 },
  { id: 3, name: 'Rising Stars', city: 'Bangalore', people: 200, verified: true, latitude: 12.9716, longitude: 77.5946 }
];

export const mockFAQ = [
  {
    question: 'How can my restaurant get started?',
    answer:
      'Sign up, create a profile, and list surplus food whenever available. Our system matches you with nearby NGOs immediately.'
  },
  {
    question: 'Is there any cost to use The Food Bridge?',
    answer:
      'The platform is completely free for verified nonprofits and discounted for businesses contributing regularly.'
  },
  {
    question: 'How is the food safety ensured?',
    answer:
      'All partners are verified, and we maintain strict hygiene protocols. Food must be claimed within the pickup window.'
  },
  {
    question: 'What if food is not claimed in time?',
    answer:
      'You can extend availability or remove the listing. Our system prioritizes fastest matches to minimize waste.'
  }
];

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';

export const mockImpactStats = [
  { label: 'Food Redirected', value: '1.2M', unit: 'kg', icon: '🍽️' },
  { label: 'People Fed', value: '25K+', unit: '', icon: '👥' },
  { label: 'Partner Businesses', value: '150+', unit: '', icon: '🏪' },
  { label: 'Verified NGOs', value: '50+', unit: '', icon: '🤝' }
];

export const fetchListings = async () => {
  const response = await fetch(`${API_BASE}/fooditems`);
  if (!response.ok) {
    throw new Error('Failed to load listings');
  }
  return await response.json();
};

export const fetchNGOs = async () => {
  try {
    const response = await fetch(`${API_BASE}/ngos`);
    if (!response.ok) throw new Error('Failed to load NGOs');
    const data = await response.json();
    return Array.isArray(data) ? data : mockNGOs;
  } catch (err) {
    console.warn('fetchNGOs failed, falling back to mockNGOs', err);
    return mockNGOs;
  }
};

export const submitDonation = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/fooditems/${data.listingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: false }),
    });
    if (!response.ok) {
      throw new Error('Failed to update listing');
    }
    return { success: true, listing: await response.json() };
  } catch (err) {
    console.warn('Donation submission failed:', err);
    return { success: false, error: err.message };
  }
};

export const createNgo = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/ngos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create NGO');
    return await response.json();
  } catch (err) {
    console.warn('createNgo failed:', err);
    throw err;
  }
};

export const createListing = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/fooditems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create listing');
    return await response.json();
  } catch (err) {
    console.warn('createListing failed:', err);
    throw err;
  }
};
