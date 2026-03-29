// All 50+ categories from the ULFRO UI, organized by group
export const CATEGORY_GROUPS = [
  {
    group: 'Delivery & Errands',
    categories: [
      { id: 'delivery-pickup', name: 'Delivery & Pickup', icon: '📦' },
      { id: 'shopping-errands', name: 'Shopping & Errands', icon: '🛒' },
      { id: 'ride-drop', name: 'Ride & Drop', icon: '🚗' },
      { id: 'courier-post', name: 'Courier & Post', icon: '📮' },
      { id: 'luggage-help', name: 'Luggage Help', icon: '🧳' },
      { id: 'store-pickup', name: 'Store Pickup', icon: '🏪' },
    ],
  },
  {
    group: 'Education',
    categories: [
      { id: 'assignment-help', name: 'Assignment Help', icon: '📝' },
      { id: 'tutoring-coaching', name: 'Tutoring & Coaching', icon: '🎓' },
      { id: 'notes-making', name: 'Notes Making', icon: '📚' },
      { id: 'online-class-help', name: 'Online Class Help', icon: '🖥️' },
      { id: 'proofreading', name: 'Proofreading', icon: '✏️' },
      { id: 'lab-file-work', name: 'Lab File Work', icon: '🔬' },
    ],
  },
  {
    group: 'Home Help',
    categories: [
      { id: 'cleaning-sweeping', name: 'Cleaning & Sweeping', icon: '🧹' },
      { id: 'laundry-ironing', name: 'Laundry & Ironing', icon: '🧺' },
      { id: 'cooking-help', name: 'Cooking Help', icon: '🍳' },
      { id: 'dishes-kitchen', name: 'Dishes & Kitchen', icon: '🧴' },
      { id: 'gardening-plants', name: 'Gardening & Plants', icon: '🪴' },
      { id: 'water-supplies', name: 'Water & Supplies', icon: '🪣' },
    ],
  },
  {
    group: 'Tech & Digital',
    categories: [
      { id: 'tech-help-setup', name: 'Tech Help & Setup', icon: '💻' },
      { id: 'phone-app-help', name: 'Phone & App Help', icon: '📱' },
      { id: 'printing-scanning', name: 'Printing & Scanning', icon: '🖨️' },
      { id: 'data-entry-typing', name: 'Data Entry & Typing', icon: '📋' },
      { id: 'research-info', name: 'Research & Info', icon: '🔍' },
      { id: 'excel-spreadsheets', name: 'Excel & Spreadsheets', icon: '📊' },
    ],
  },
  {
    group: 'Creative',
    categories: [
      { id: 'basic-design', name: 'Basic Design', icon: '🎨' },
      { id: 'photography', name: 'Photography', icon: '📸' },
      { id: 'video-recording', name: 'Video Recording', icon: '🎬' },
      { id: 'basic-video-editing', name: 'Basic Video Editing', icon: '✂️' },
      { id: 'poster-making', name: 'Poster Making', icon: '🖼️' },
      { id: 'social-media-help', name: 'Social Media Help', icon: '📣' },
    ],
  },
  {
    group: 'Repairs & Maintenance',
    categories: [
      { id: 'minor-repairs', name: 'Minor Repairs', icon: '🔧' },
      { id: 'electrical-fixes', name: 'Electrical Fixes', icon: '💡' },
      { id: 'plumbing-help', name: 'Plumbing Help', icon: '🚰' },
      { id: 'furniture-assembly', name: 'Furniture Assembly', icon: '🪑' },
      { id: 'wall-painting', name: 'Wall Painting', icon: '🎨' },
      { id: 'locksmith-help', name: 'Locksmith Help', icon: '🔑' },
    ],
  },
  {
    group: 'Personal & Lifestyle',
    categories: [
      { id: 'pet-care-walking', name: 'Pet Care & Walking', icon: '🐾' },
      { id: 'babysitting', name: 'Babysitting', icon: '👶' },
      { id: 'elder-care-help', name: 'Elder Care Help', icon: '👴' },
      { id: 'medicine-pickup', name: 'Medicine Pickup', icon: '💊' },
      { id: 'hospital-companion', name: 'Hospital Companion', icon: '🏥' },
      { id: 'personal-styling', name: 'Personal Styling', icon: '💇' },
    ],
  },
  {
    group: 'Events & Social',
    categories: [
      { id: 'event-help', name: 'Event Help', icon: '🎉' },
      { id: 'party-planning', name: 'Party Planning', icon: '🎂' },
      { id: 'standing-in-line', name: 'Standing in Line', icon: '🤝' },
      { id: 'form-filling-help', name: 'Form Filling Help', icon: '📜' },
      { id: 'govt-office-help', name: 'Govt Office Help', icon: '🏛️' },
      { id: 'newspaper-delivery', name: 'Newspaper Delivery', icon: '📰' },
    ],
  },
  {
    group: 'Food',
    categories: [
      { id: 'food-tiffin', name: 'Food & Tiffin', icon: '🍱' },
      { id: 'meal-prep-help', name: 'Meal Prep Help', icon: '🥗' },
      { id: 'tea-snacks', name: 'Tea & Snacks', icon: '☕' },
    ],
  },
  {
    group: 'Moving',
    categories: [
      { id: 'packing-moving', name: 'Packing & Moving', icon: '📦' },
      { id: 'home-shifting-help', name: 'Home Shifting Help', icon: '🏠' },
      { id: 'heavy-lifting', name: 'Heavy Lifting', icon: '🪜' },
    ],
  },
  {
    group: 'Other',
    categories: [
      { id: 'any-other-task', name: 'Any Other Task', icon: '⚙️' },
    ],
  },
];

// Flatten all categories into a single array
export const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap((g) =>
  g.categories.map((c) => ({ ...c, group: g.group }))
);

// Get category by ID
export function getCategoryById(id) {
  return ALL_CATEGORIES.find((c) => c.id === id) || null;
}

// Get categories by group
export function getCategoriesByGroup(group) {
  const g = CATEGORY_GROUPS.find((g) => g.group === group);
  return g ? g.categories : [];
}

// Delhi areas for location selection
export const DELHI_AREAS = [
  'Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Saket',
  'Dwarka', 'Rohini', 'Pitampura', 'Janakpuri', 'Rajouri Garden',
  'Nehru Place', 'Greater Kailash', 'Defence Colony', 'Hauz Khas',
  'Vasant Kunj', 'Mayur Vihar', 'Preet Vihar', 'Laxmi Nagar',
  'Shahdara', 'Chandni Chowk', 'Paharganj', 'New Delhi Railway Station',
  'IGI Airport Area', 'Noida Sector 18', 'Noida Sector 62',
  'Gurgaon Cyber City', 'Gurgaon MG Road', 'Faridabad',
  'Ghaziabad', 'Other',
];
