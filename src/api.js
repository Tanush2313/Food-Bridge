// Mock data utilities for development
export const mockListings = [
  {
    id: 1,
    business: 'Sunrise Restaurant',
    location: 'Delhi',
    food: 'Biryani, Dal Makhani',
    quantity: '50 portions',
    time: '7:30 PM',
    pickupWindow: '1 hour',
    available: true
  },
  {
    id: 2,
    business: 'Grand Hotel',
    location: 'Mumbai',
    food: 'Paneer Tikka, Naan',
    quantity: '100 portions',
    time: '8:00 PM',
    pickupWindow: '2 hours',
    available: true
  },
  {
    id: 3,
    business: 'Cloud Kitchen Pro',
    location: 'Bangalore',
    food: 'Mixed Veg Curry, Rice',
    quantity: '75 portions',
    time: '6:30 PM',
    pickupWindow: '90 minutes',
    available: false
  }
];

export const mockNGOs = [
  { id: 1, name: 'Hope Foundation', city: 'Delhi', people: 500, verified: true },
  { id: 2, name: 'Seva Samiti', city: 'Mumbai', people: 300, verified: true },
  { id: 3, name: 'Rising Stars', city: 'Bangalore', people: 200, verified: true }
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

export const mockImpactStats = [
  { label: 'Food Redirected', value: '1.2M', unit: 'kg', icon: '🍽️' },
  { label: 'People Fed', value: '25K+', unit: '', icon: '👥' },
  { label: 'Partner Businesses', value: '150+', unit: '', icon: '🏪' },
  { label: 'Verified NGOs', value: '50+', unit: '', icon: '🤝' }
];

export const fetchListings = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockListings), 300);
  });
};

export const fetchNGOs = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockNGOs), 300);
  });
};

export const submitDonation = async (data) => {
  console.log('Donation submitted:', data);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, id: Math.random() }), 500);
  });
};
