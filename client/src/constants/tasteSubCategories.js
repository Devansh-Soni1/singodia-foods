export const TASTE_SUBCATEGORIES = [
  {
    id: 'sweet',
    slug: 'sweet',
    name: 'Sweet',
    hindiName: 'मीठा',
    icon: '🍯',
    description: 'Sweet, preserved, and murabba-style taste profile',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  {
    id: 'tangy',
    slug: 'tangy',
    name: 'Tangy',
    hindiName: 'खट्टा / चटपटा',
    icon: '🍋',
    description: 'Mouthwatering sour, khatta-meetha, and lemony zing',
    badgeClass: 'bg-yellow-100 text-yellow-900 border-yellow-300'
  },
  {
    id: 'spicy',
    slug: 'spicy',
    name: 'Spicy',
    hindiName: 'तीखा / चटपटा',
    icon: '🌶️',
    description: 'Fiery red and green chillies, cracked mustard, and bold spices',
    badgeClass: 'bg-red-100 text-red-900 border-red-300'
  },
  {
    id: 'winter',
    slug: 'winter',
    name: 'Winter',
    hindiName: 'सर्दियों का खास',
    icon: '❄️',
    description: 'Seasonal winter harvest: Pachranga, Gajar-Gobhi-Shalgam pickles',
    badgeClass: 'bg-cyan-100 text-cyan-900 border-cyan-300'
  },
  {
    id: 'rajasthani',
    slug: 'rajasthani',
    name: 'Rajasthani',
    hindiName: 'शाही राजस्थानी',
    icon: '🏺',
    description: 'Authentic Marwadi royal heritage recipes: Kair Sangri, Hing Aam, Lesua',
    badgeClass: 'bg-orange-100 text-orange-950 border-orange-300'
  }
];

export const getTasteInfo = (tasteId = '') => {
  if (!tasteId) return null;
  const tid = tasteId.toLowerCase();
  return TASTE_SUBCATEGORIES.find(t => t.id === tid || t.slug === tid) || null;
};

