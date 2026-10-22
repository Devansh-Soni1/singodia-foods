export const INGREDIENT_CATEGORIES = [
  {
    id: 'mango',
    name: 'Mango',
    hindiName: 'आम',
    categorySlug: 'mango-pickles',
    icon: '🥭',
    subCategories: [
      { name: 'Traditional Mango Pickle', hindi: 'पारंपरिक आम का अचार', slug: 'traditional-mango-pickle', taste: 'tangy' },
      { name: 'Punjabi Mango Pickle', hindi: 'पंजाबी आम का अचार', slug: 'punjabi-mango-pickle', taste: 'spicy' },
      { name: 'Sweet Mango Pickle', hindi: 'मीठा आम का अचार', slug: 'sweet-mango-pickle', taste: 'sweet' },
      { name: 'Mango Chundo / Chunda', hindi: 'आम का छुंदा / मुरब्बा', slug: 'mango-chunda', taste: 'sweet' },
      { name: 'Avakaya (Andhra Style)', hindi: 'आवाकाया आम अचार', slug: 'avakaya-mango-pickle', taste: 'spicy' },
      { name: 'Dry Mango Pickle', hindi: 'सूखा हींग आम का अचार', slug: 'dry-mango-pickle', taste: 'tangy' },
      { name: 'Kachi Keri Desi Pickle', hindi: 'कच्ची केरी का अचार', slug: 'kachi-keri-pickle', taste: 'tangy' }
    ]
  },
  {
    id: 'jackfruit',
    name: 'Jackfruit',
    hindiName: 'कटहल',
    categorySlug: 'jackfruit-pickles',
    icon: '🪵',
    subCategories: [
      { name: 'Traditional Kathal Pickle', hindi: 'पारंपरिक कटहल का अचार', slug: 'traditional-kathal-pickle', taste: 'spicy' },
      { name: 'Spicy Mustard Kathal Achar', hindi: 'सरसों मसालेदार कटहल', slug: 'spicy-mustard-kathal', taste: 'spicy' },
      { name: 'Desi Kathal Masala', hindi: 'देसी कटहल मसाला', slug: 'desi-kathal-masala', taste: 'tangy' }
    ]
  },
  {
    id: 'lemon',
    name: 'Lemon',
    hindiName: 'नींबू',
    categorySlug: 'lemon-pickles',
    icon: '🍋',
    subCategories: [
      { name: 'Khatta Meetha Nimbu Pickle', hindi: 'खट्टा मीठा नीम्बू का अचार', slug: 'khatta-meetha-nimbu', taste: 'sweet' },
      { name: 'Oil-Free Sun-Dried Lemon', hindi: 'धूप में पका बिना तेल का नीम्बू', slug: 'oil-free-lemon-pickle', taste: 'tangy' },
      { name: 'Salty Black Lemon Pickle', hindi: 'काला पाचक नीम्बू अचार', slug: 'black-lemon-pickle', taste: 'tangy' },
      { name: 'Spicy Lemon Pickle', hindi: 'तीखा चटपटा नीम्बू', slug: 'spicy-lemon-pickle', taste: 'spicy' }
    ]
  },
  {
    id: 'chilli',
    name: 'Chilli',
    hindiName: 'मिर्च',
    categorySlug: 'red-chilli-pickles',
    icon: '🌶️',
    subCategories: [
      { name: 'Banarasi Bharwa Lal Mirch', hindi: 'बनारसी भरवां लाल मिर्च', slug: 'banarasi-lal-mirch', taste: 'spicy' },
      { name: 'Rajasthani Hari Mirch Tipore', hindi: 'राजस्थानी हरी मिर्च के टिपोरे', slug: 'hari-mirch-tipore', taste: 'spicy' },
      { name: 'Green Chilli Thecha', hindi: 'हरी मिर्च का ठेचा', slug: 'green-chilli-thecha', taste: 'spicy' },
      { name: 'Rai Vali Teekhi Hari Mirch', hindi: 'राई वाली तीखी हरी मिर्च', slug: 'rai-hari-mirch', taste: 'spicy' },
      { name: 'Sweet & Tangy Chilli Pickle', hindi: 'खट्टी मीठी मिर्च', slug: 'sweet-tangy-chilli', taste: 'sweet' }
    ]
  },
  {
    id: 'mixed',
    name: 'Mixed',
    hindiName: 'मिक्स',
    categorySlug: 'mixed-pickles',
    icon: '🥗',
    subCategories: [
      { name: 'Pachranga Shahi Mix Pickle', hindi: 'पचरंगा शाही मिक्स अचार', slug: 'pachranga-mix-pickle', taste: 'rajasthani' },
      { name: 'Gajar Gobhi Shalgam Winter Pickle', hindi: 'गाजर गोभी शलजम सर्दियों का अचार', slug: 'gajar-gobhi-shalgam', taste: 'winter' },
      { name: 'Sweet & Sour Mixed Pickle', hindi: 'खट्टा मीठा मिक्स अचार', slug: 'sweet-sour-mixed', taste: 'sweet' }
    ]
  },
  {
    id: 'gooseberry',
    name: 'Gooseberry',
    hindiName: 'आंवला',
    categorySlug: 'amla-pickles',
    icon: '🟢',
    subCategories: [
      { name: 'Desi Amla Masala Pickle', hindi: 'देसी आंवला मसालेदार अचार', slug: 'amla-masala-pickle', taste: 'tangy' },
      { name: 'Sweet Amla Murabba', hindi: 'मीठा आंवला मुरब्बा', slug: 'amla-murabba', taste: 'sweet' },
      { name: 'Oil-Free Amla Achar', hindi: 'बिना तेल का आंवला', slug: 'oil-free-amla', taste: 'tangy' }
    ]
  },
  {
    id: 'garlic',
    name: 'Garlic',
    hindiName: 'लहसुन',
    categorySlug: 'garlic-pickles',
    icon: '🧄',
    subCategories: [
      { name: 'Desi Lahsun Masaledar Achar', hindi: 'देसी लहसुन का चटपटा अचार', slug: 'desi-lahsun-achar', taste: 'spicy' },
      { name: 'Garlic & Red Chilli Chutney', hindi: 'लहसुन लाल मिर्च की चटनी', slug: 'garlic-chilli-chutney', taste: 'spicy' },
      { name: 'Sun-Dried Garlic Pickle', hindi: 'धूप में पका लहसुन अचार', slug: 'sun-dried-garlic', taste: 'tangy' }
    ]
  },
  {
    id: 'ginger',
    name: 'Ginger',
    hindiName: 'अदरक',
    categorySlug: 'ginger-pickles',
    icon: '🫚',
    subCategories: [
      { name: 'Nimbu Adrak Hari Mirch', hindi: 'नीम्बू अदरक हरी मिर्च पाचक अचार', slug: 'nimbu-adrak-mirch', taste: 'tangy' },
      { name: 'Masaledar Adrak Ka Achar', hindi: 'मसालेदार अदरक का अचार', slug: 'masaledar-adrak', taste: 'spicy' }
    ]
  },
  {
    id: 'rajasthani-specials',
    name: 'Rajasthani Specials',
    hindiName: 'कैर सांगरी',
    categorySlug: 'rajasthani-specials',
    icon: '🏺',
    subCategories: [
      { name: 'Royal Marwadi Kair Sangri', hindi: 'शाही कैर सांगरी का अचार', slug: 'kair-sangri-pickle', taste: 'rajasthani' },
      { name: 'Marwadi Gunda / Lesua Pickle', hindi: 'मारवाड़ी गुंदा / लसोड़ा अचार', slug: 'marwadi-gunda-pickle', taste: 'rajasthani' },
      { name: 'Bikaneri Moong Dal Papad', hindi: 'बीकानेरी मूंग दाल पापड़', slug: 'bikaneri-papad', taste: 'rajasthani' },
      { name: 'Shahi Achar Masala Mix', hindi: 'शाही अचार का मसाला', slug: 'shahi-achar-masala', taste: 'rajasthani' }
    ]
  }
];

export const getIngredientCategory = (catId = '') => {
  if (!catId) return null;
  const clean = catId.toLowerCase().replace(/s$/, '').replace(/-pickle$/, '').replace(/-pickles$/, '');
  return INGREDIENT_CATEGORIES.find(c => 
    c.id === clean || 
    c.categorySlug === catId || 
    c.categorySlug.replace(/s$/, '') === catId.replace(/s$/, '') ||
    c.name.toLowerCase() === clean
  ) || null;
};
