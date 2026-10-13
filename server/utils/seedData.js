import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Setting from '../models/Setting.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

dotenv.config();

export const sampleCategories = [
  {
    name: 'Mango Pickles',
    hindiName: 'आम का अचार',
    slug: 'mango-pickles',
    description: 'Sun-cured raw green mangoes infused with cold-pressed mustard oil & roasted whole spices.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    displayOrder: 1
  },
  {
    name: 'Red Chilli Pickles',
    hindiName: 'लाल मिर्च का अचार',
    slug: 'red-chilli-pickles',
    description: 'Banarasi sun-dried red peppers hand-stuffed with tangy amchur, saunf, and mustard.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    displayOrder: 2
  },
  {
    name: 'Green Chilli Pickles',
    hindiName: 'हरी मिर्च का अचार',
    slug: 'green-chilli-pickles',
    description: 'Crisp hand-cut green chillies cured with lemon, turmeric, and cracked rai.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
    displayOrder: 3
  },
  {
    name: 'Lemon Pickles',
    hindiName: 'नीम्बू का अचार',
    slug: 'lemon-pickles',
    description: 'Khatta-meetha and oil-free lemon pickles aged in earthen martabans under sunlight.',
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=600&q=80',
    displayOrder: 4
  },
  {
    name: 'Rajasthani Specials',
    hindiName: 'राजस्थानी स्पेशल',
    slug: 'rajasthani-specials',
    description: 'Authentic royal Marwadi heritage creations: Kair Sangri, Lesua (Gunda), and Hing Aam.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    displayOrder: 5
  },
  {
    name: 'Garlic Pickles',
    hindiName: 'लहसुन का अचार',
    slug: 'garlic-pickles',
    description: 'Whole juicy garlic cloves steeped in spiced cold-pressed mustard oil.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    displayOrder: 6
  },
  {
    name: 'Mixed Pickles',
    hindiName: 'पचरंगा मिक्स अचार',
    slug: 'mixed-pickles',
    description: 'Festive crunch of farm-fresh winter vegetables and raw fruits in mustard oil.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    displayOrder: 7
  },
  {
    name: 'Combo Packs & Hampers',
    hindiName: 'कॉम्बो और गिफ़्ट पैक',
    slug: 'combo-packs',
    description: 'Handpicked tasting sets, Dadi trial boxes, and ceramic martaban gift hampers.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    displayOrder: 8
  }
];

export const sampleProducts = [
  {
    name: 'Banarasi Lal Mirch Ka Bharwa Achar',
    hindiName: 'बनारसी भरवां लाल मिर्च अचार',
    slug: 'banarasi-lal-mirch-bharwa-achar',
    category: 'red-chilli-pickles',
    shortDescription: 'Plump sun-dried red chillies hand-stuffed with aromatic roasted spices, saunf, amchur, and pure mustard oil.',
    fullDescription: 'Our Banarasi Bharwa Lal Mirch Achar is the crown jewel of traditional Indian pickling. Each ripe, crimson chilli is carefully handpicked, slit with precision, and meticulously stuffed by hand with a slow-roasted dry spice blend comprising whole coriander seeds, fennel (saunf), fenugreek (methi), black mustard seeds (rai), dry mango powder (amchur), and pungent Hing. Matured naturally under the Indian sun in large ceramic barnis with cold-pressed Kachi Ghani mustard oil.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 249, originalPrice: 299, inStock: true, stockCount: 65, sku: 'BLM-250' },
      { weight: '500g', price: 449, originalPrice: 520, inStock: true, stockCount: 40, sku: 'BLM-500' },
      { weight: '1kg', price: 799, originalPrice: 950, inStock: true, stockCount: 20, sku: 'BLM-1000' }
    ],
    spiceLevel: 'Spicy',
    ingredients: [
      'Sun-dried Red Chillies',
      'Cold-Pressed Kachi Ghani Mustard Oil',
      'Fennel Seeds (Saunf)',
      'Fenugreek Seeds (Methi Dana)',
      'Yellow Mustard Seeds (Peeli Sarson)',
      'Amchur (Dry Mango Powder)',
      'Pure Hing (Asafoetida)',
      'Kalonji (Nigella)',
      'Rock Salt & Turmeric'
    ],
    allergenInfo: 'Contains Mustard. Preservative-free, prepared in a traditional hygienic kitchen.',
    storageInstructions: 'Keep submerged in mustard oil. Always use a dry wooden or steel spoon. Keep away from water moisture.',
    shelfLife: '12 Months from packaging date',
    oilType: 'Pure Cold-Pressed Mustard Oil (सरसों का तेल)',
    traditionNotes: '100% Hand-stuffed using our 40-year-old family recipe from grandmother’s kitchen in Rajasthan.',
    pairWith: ['Garama-Garam Aloo Paratha', 'Dal Khichdi & Ghee', 'Bedmi Puri Sabzi', 'Mathri with Evening Chai'],
    tags: ['Bestseller', 'Handmade', 'Sun-Dried', 'Zero Preservatives'],
    rating: 4.9,
    numReviews: 184,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    name: 'Kachi Keri Desi Aam Ka Achar',
    hindiName: 'पारंपरिक कच्ची केरी आम का अचार',
    slug: 'kachi-keri-desi-aam-ka-achar',
    category: 'mango-pickles',
    shortDescription: 'Classic sun-cured raw mango pickle made with hand-cut Ramkela mangoes, fenugreek, and cold-pressed mustard oil.',
    fullDescription: 'Nothing evokes childhood nostalgia quite like the piquant crunch of raw mango pickle. We hand-select sour, firm Ramkela raw mangoes, cut them into traditional bite-sized pieces with their tender kernels intact, and marinate them with freshly ground whole spices. Bathed in golden Kachi Ghani mustard oil, our jars are kept in the blazing courtyard sun for weeks until every piece absorbs the tangy spiced richness.',
    images: [
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 199, originalPrice: 249, inStock: true, stockCount: 80, sku: 'AAM-250' },
      { weight: '500g', price: 369, originalPrice: 420, inStock: true, stockCount: 50, sku: 'AAM-500' },
      { weight: '1kg', price: 689, originalPrice: 799, inStock: true, stockCount: 35, sku: 'AAM-1000' }
    ],
    spiceLevel: 'Medium',
    ingredients: [
      'Hand-cut Raw Mango Chunks (Kachi Keri)',
      'Cold-Pressed Mustard Oil',
      'Split Mustard Seeds (Rai Dal)',
      'Fenugreek (Methi)',
      'Fennel (Saunf)',
      'Kalonji',
      'Turmeric Powder',
      'Red Chilli Powder',
      'Hing',
      'Iodized Salt'
    ],
    allergenInfo: 'Contains Mustard. 100% Natural, no artificial vinegar or synthetic acids.',
    storageInstructions: 'Store in cool and dry place. Ensure oil layer covers the top to maintain natural preservation.',
    shelfLife: '18 Months from packaging date',
    oilType: 'Cold-Pressed Mustard Oil',
    traditionNotes: 'Aged in traditional white-and-yellow ceramic martabans in natural sunlight.',
    pairWith: ['Dal Chawal', 'Ajwain Paratha', 'Thepla & Curd', 'Poha & Sev'],
    tags: ['Traditional', 'Bestseller', 'Sun-Cured', 'Pure Mustard Oil'],
    rating: 4.8,
    numReviews: 240,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    name: 'Khatta Meetha Nimbu Ka Achar (Oil-Free)',
    hindiName: 'खट्टा मीठा नीम्बू का अचार (बिना तेल)',
    slug: 'khatta-meetha-nimbu-achar',
    category: 'lemon-pickles',
    shortDescription: 'Zero oil, sunlight-cured juicy thin-skinned lemons blended with organic jaggery, black salt, and ajwain.',
    fullDescription: 'Our heirloom Oil-Free Khatta Meetha Nimbu Achar is as therapeutic as it is delectable. Thin-skinned, seedless Kagzi lemons are quartered and slow-matured in earthen jars under direct sunlight with whole spices, black rock salt, and authentic organic gur (jaggery). Over months, the lemon rinds soften into a glistening, melt-in-mouth dark preserve that aids digestion and awakens every taste bud.',
    images: [
      'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 219, originalPrice: 260, inStock: true, stockCount: 50, sku: 'NMB-250' },
      { weight: '500g', price: 389, originalPrice: 450, inStock: true, stockCount: 45, sku: 'NMB-500' },
      { weight: '1kg', price: 720, originalPrice: 850, inStock: true, stockCount: 15, sku: 'NMB-1000' }
    ],
    spiceLevel: 'Mild',
    ingredients: [
      'Fresh Kagzi Lemons (Thin Skinned)',
      'Organic Jaggery (Gur)',
      'Black Salt (Kala Namak)',
      'Carom Seeds (Ajwain)',
      'Roasted Cumin (Bhuna Jeera)',
      'Black Pepper',
      'Cinnamon & Clove powder',
      'Rock Salt'
    ],
    allergenInfo: 'Completely Oil-Free and Gluten-Free. Safe for all ages.',
    storageInstructions: 'Store in an airtight jar in ambient temperature. Keeps improving with age.',
    shelfLife: '24 Months (Improves with time!)',
    oilType: '100% Oil-Free (Zero Oil)',
    traditionNotes: 'Sun-matured for 60 continuous days until the lemon peel turns translucent and velvety.',
    pairWith: ['Jeera Rice & Dal Tadka', 'Plain Paratha', 'Khichdi', 'Samosa & Kachori'],
    tags: ['Oil-Free', 'Digestive', 'Sun-Aged', 'Organic Jaggery'],
    rating: 4.9,
    numReviews: 156,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    name: 'Marwadi Kair Sangri Ka Shahi Achar',
    hindiName: 'मारवाड़ी कैर सांगरी शाही अचार',
    slug: 'marwadi-kair-sangri-shahi-achar',
    category: 'rajasthani-specials',
    shortDescription: 'Royal Thar Desert delicacy crafted from wild Kair capers and desert Sangri pods in golden mustard oil and royal spices.',
    fullDescription: 'Hailing from the heart of the Thar Desert, Kair Sangri is Rajasthan’s most prized culinary treasure. Hand-foraged wild desert capers (Kair) and indigenous Sangri bean pods are dried and soaked in buttermilk, then simmered with roasted spices, whole red Mathania chillies, amchur, and fragrant cold-pressed mustard oil. Rich, earthy, and extraordinarily aromatic.',
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 349, originalPrice: 399, inStock: true, stockCount: 30, sku: 'KS-250' },
      { weight: '500g', price: 649, originalPrice: 750, inStock: true, stockCount: 20, sku: 'KS-500' }
    ],
    spiceLevel: 'Medium',
    ingredients: [
      'Wild Handpicked Kair (Capers)',
      'Thar Desert Sangri (Bean Pods)',
      'Cold-Pressed Mustard Oil',
      'Mathania Whole Red Chillies',
      'Fennel (Saunf)',
      'Coriander Seeds',
      'Dry Mango Powder (Amchur)',
      'Pure Rajasthani Hing',
      'Rock Salt'
    ],
    allergenInfo: 'Contains Mustard. Premium royal recipe with wild organic desert herbs.',
    storageInstructions: 'Store in a cool dry place. Stir gently with a clean dry spoon.',
    shelfLife: '12 Months from packaging date',
    oilType: 'Cold-Pressed Mustard Oil',
    traditionNotes: 'Prepared following 18th-century Marwadi royal banquet recipes.',
    pairWith: ['Bajra Roti & White Butter', 'Missi Roti', 'Dal Baati Churma', 'Poori & Kaddu Sabzi'],
    tags: ['Royal Heritage', 'Desert Delicacy', 'Wild Foraged', 'Exclusive'],
    rating: 5.0,
    numReviews: 92,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    name: 'Rajasthani Teekhi Hari Mirch Ke Tipore',
    hindiName: 'राजस्थानी तीखी हरी मिर्च का अचार',
    slug: 'rajasthani-hari-mirch-tipore',
    category: 'green-chilli-pickles',
    shortDescription: 'Fresh crisp green chillies chopped and tossed with coarse ground mustard, turmeric, and tangy lemon brine.',
    fullDescription: 'A daily dining essential across Rajasthani homes! Freshly harvested spicy green chillies are slit and tossed with cracked rai seeds, aromatic saunf, pinch of turmeric, and warm mustard oil. Gives an instant zesty punch to everyday dal-roti without overwhelming the palate.',
    images: [
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 189, originalPrice: 229, inStock: true, stockCount: 75, sku: 'HM-250' },
      { weight: '500g', price: 329, originalPrice: 390, inStock: true, stockCount: 50, sku: 'HM-500' }
    ],
    spiceLevel: 'Extra Spicy',
    ingredients: [
      'Crisp Indian Green Chillies',
      'Cold-Pressed Mustard Oil',
      'Cracked Yellow Mustard (Rai Kuria)',
      'Fennel (Saunf)',
      'Turmeric Powder',
      'Lemon Juice',
      'Asafoetida (Hing)',
      'Rock Salt'
    ],
    allergenInfo: 'Contains Mustard. Made fresh in small batches.',
    storageInstructions: 'Refrigerate after opening for extended crunchiness.',
    shelfLife: '9 Months from packaging date',
    oilType: 'Cold-Pressed Mustard Oil',
    traditionNotes: 'Quick-cured in small earthen pots to maintain crisp crunch.',
    pairWith: ['Ghee Roti & Dal Tadka', 'Kadhi Chawal', 'Besan Chilla', 'Vada Pav'],
    tags: ['Crunchy', 'Extra Spicy', 'Daily Essential'],
    rating: 4.7,
    numReviews: 112,
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    name: 'Desi Lahsun Ka Masaledar Achar',
    hindiName: 'देसी लहसुन का चटपटा अचार',
    slug: 'desi-lahsun-masaledar-achar',
    category: 'garlic-pickles',
    shortDescription: 'Plump desi garlic cloves steeped in mustard oil, roasted fenugreek, nigella, and fiery chilli powder.',
    fullDescription: 'Our Lahsun Achar uses small, intensely flavourful indigenous garlic cloves grown in Rajasthan. Each clove is gently peeled and preserved in aromatic mustard oil laced with methi, kalonji, crushed coriander, and chilli powder. Exceptional for heart health, immunity, and warming winter meals.',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 239, originalPrice: 289, inStock: true, stockCount: 40, sku: 'LHS-250' },
      { weight: '500g', price: 429, originalPrice: 499, inStock: true, stockCount: 30, sku: 'LHS-500' }
    ],
    spiceLevel: 'Spicy',
    ingredients: [
      'Small Indigenous Desi Garlic Cloves',
      'Cold-Pressed Mustard Oil',
      'Crushed Red Chilli',
      'Fenugreek Seeds',
      'Mustard Seeds',
      'Amchur Powder',
      'Kalonji',
      'Hing',
      'Rock Salt'
    ],
    allergenInfo: 'Contains Mustard. 100% Vegan & preservative-free.',
    storageInstructions: 'Store in dry pantry. Ensure cloves remain immersed in mustard oil.',
    shelfLife: '12 Months from packaging date',
    oilType: 'Cold-Pressed Mustard Oil',
    traditionNotes: 'Gently heated with whole spices to mellow raw pungent bite into savory sweetness.',
    pairWith: ['Bhakri & Ghee', 'Curd Rice', 'Paneer Paratha', 'Khichdi'],
    tags: ['Immunity Booster', 'Pungent & Savory', 'Desi Garlic'],
    rating: 4.8,
    numReviews: 98,
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: true,
    isActive: true
  },
  {
    name: 'Pachranga Shahi Mix Achar',
    hindiName: 'पचरंगा शाही मिक्स अचार',
    slug: 'pachranga-shahi-mix-achar',
    category: 'mixed-pickles',
    shortDescription: 'Harvest blend of raw mango, lime, crunchy carrots, cauliflower, and green chillies in spiced mustard oil.',
    fullDescription: 'The ultimate all-rounder on the Indian dinner table! A harmony of five farm-fresh ingredients: firm raw mangoes, juicy Kagzi limes, crisp winter carrots, tender cauliflower florets, and slit green chillies. Balanced seasoning ensures every spoonful delivers tangy, spicy, and crunchy notes.',
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 199, originalPrice: 239, inStock: true, stockCount: 55, sku: 'MIX-250' },
      { weight: '500g', price: 349, originalPrice: 410, inStock: true, stockCount: 45, sku: 'MIX-500' },
      { weight: '1kg', price: 649, originalPrice: 750, inStock: true, stockCount: 25, sku: 'MIX-1000' }
    ],
    spiceLevel: 'Medium',
    ingredients: [
      'Raw Mango Chunks',
      'Fresh Lemon Wedges',
      'Winter Carrots & Cauliflower',
      'Green Chillies',
      'Cold-Pressed Mustard Oil',
      'Saunf & Methi',
      'Cracked Mustard Seeds',
      'Turmeric & Red Chilli',
      'Rock Salt'
    ],
    allergenInfo: 'Contains Mustard. Zero chemical preservatives.',
    storageInstructions: 'Store in cool dry place. Keep jar tightly closed.',
    shelfLife: '12 Months from packaging date',
    oilType: 'Cold-Pressed Mustard Oil',
    traditionNotes: 'Harvested in season and sun-cured together for complete spice fusion.',
    pairWith: ['Everyday Thali', 'Dal Rice', 'Parathas', 'Puri Chole'],
    tags: ['Crunchy', 'Family Favorite', 'Multi-Vegetable'],
    rating: 4.8,
    numReviews: 134,
    isBestSeller: true,
    isFeatured: false,
    isNewArrival: false,
    isActive: true
  },
  {
    name: 'Hing Aam Ka Piquant Achar',
    hindiName: 'हींग वाला आम का अचार',
    slug: 'hing-aam-piquant-achar',
    category: 'rajasthani-specials',
    shortDescription: 'Bold Hathras asafoetida infused raw mango chunks with red chilli and rock salt, cured under the desert sun.',
    fullDescription: 'Crafted for true pickle connoisseurs, this distinct pickle is infused with unadulterated Hathras pure Hing (asafoetida). Sour green mango cubes are preserved without excess clutter—just Hing, hand-ground Mathania chilli, turmeric, and mustard oil. The lingering aroma of authentic Hing transforms ordinary meals.',
    images: [
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 239, originalPrice: 279, inStock: true, stockCount: 35, sku: 'HNG-250' },
      { weight: '500g', price: 429, originalPrice: 490, inStock: true, stockCount: 25, sku: 'HNG-500' }
    ],
    spiceLevel: 'Spicy',
    ingredients: [
      'Raw Mango Cubes (Kachi Keri)',
      'Hathras Grade-A Hing (Asafoetida)',
      'Cold-Pressed Mustard Oil',
      'Mathania Red Chilli Powder',
      'Fenugreek Seeds',
      'Turmeric Powder',
      'Sendha Namak (Rock Salt)'
    ],
    allergenInfo: 'Contains Mustard & Hing. Digestive and pungent.',
    storageInstructions: 'Airtight glass jar in room temperature.',
    shelfLife: '18 Months from packaging date',
    oilType: 'Cold-Pressed Mustard Oil',
    traditionNotes: 'Heavily infused with pure whole roasted asafoetida resin.',
    pairWith: ['Moong Dal Khichdi', 'Puri Aloo', 'Sattu Paratha'],
    tags: ['Hathras Hing', 'Aromatic', 'Heritage Recipe'],
    rating: 4.9,
    numReviews: 88,
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: true,
    isActive: true
  },
  {
    name: "Dadi's Special Pickle Trial Box (Set of 5)",
    hindiName: 'दादी का स्पेशल ट्रायल बॉक्स (5 जार सेट)',
    slug: 'dadis-special-pickle-trial-box',
    category: 'combo-packs',
    shortDescription: 'Sample our 5 signature authentic pickles in 75g glass jars: Mango, Banarasi Lal Mirch, Hari Mirch, Khatta Meetha Nimbu, and Mix.',
    fullDescription: 'Cannot decide which authentic flavour to pick first? Dadi’s Special Trial Box brings together our five top-rated homemade pickles in charming mini barni jars (75g each). Sample the handcrafted spectrum from fiery Banarasi Lal Mirch to digestion-boosting oil-free Nimbu and classic sun-dried Aam. Ideal for discovering your household favourite or gifting loved ones.',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '5 x 75g Jars (375g Total)', price: 499, originalPrice: 599, inStock: true, stockCount: 50, sku: 'TRL-5' }
    ],
    spiceLevel: 'Medium',
    ingredients: [
      'Assortment includes 1 jar each of: Kachi Keri Aam, Banarasi Lal Mirch, Hari Mirch Tipore, Khatta Meetha Nimbu, Pachranga Mix.'
    ],
    allergenInfo: 'Contains Mustard in oil pickles.',
    storageInstructions: 'Store in cool dry place. Individual jars are hermetically sealed.',
    shelfLife: '12 Months from packaging date',
    oilType: 'Assorted (Cold-Pressed Mustard Oil & Oil-Free Nimbu)',
    traditionNotes: 'Specially created for families exploring traditional homemade Indian flavours.',
    pairWith: ['Every Meal! Perfect for discovering your personal favorite.'],
    tags: ['Bestseller', 'Sampler Set', 'Perfect Gift', 'Great Value'],
    rating: 5.0,
    numReviews: 215,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    name: 'Rajasthani Shahi Martaban Hamper (Festive Gift Box)',
    hindiName: 'राजस्थानी शाही मर्तबान हैंपर (गिफ़्ट बॉक्स)',
    slug: 'rajasthani-shahi-martaban-hamper',
    category: 'combo-packs',
    shortDescription: 'Royal festive hamper with 2 handcrafted ceramic Barnis (500g Kair Sangri + 500g Banarasi Lal Mirch) and hand-carved brass spoon.',
    fullDescription: 'An opulent celebration of traditional Rajasthani culture. Presented in an ornate ethnic gift box, this hamper features two reusable ceramic pickle martabans filled with 500g Royal Marwadi Kair Sangri and 500g Banarasi Lal Mirch Bharwa, completed by an authentic pure brass hand-forged pickle serving spoon. An unforgettable gift for weddings, housewarmings, and festive feasts.',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '2 x 500g Ceramic Barnis + Brass Spoon', price: 1199, originalPrice: 1450, inStock: true, stockCount: 25, sku: 'HMP-ROYAL' }
    ],
    spiceLevel: 'Medium',
    ingredients: [
      'Kair Sangri Achar 500g + Banarasi Bharwa Lal Mirch 500g + Handcrafted Brass Spoon.'
    ],
    allergenInfo: 'Contains Mustard.',
    storageInstructions: 'Keep in ceramic barnis in cool, dry pantry.',
    shelfLife: '12 Months from packaging date',
    oilType: 'Cold-Pressed Mustard Oil',
    traditionNotes: 'Includes traditional lead-free food-grade glazed clay martabans that keep pickles fresh naturally.',
    pairWith: ['Festive Feasts, Royal Thalis, Weddings & Banquets'],
    tags: ['Festive Gift', 'Ceramic Barnis', 'Brass Spoon Included', 'Luxury Hamper'],
    rating: 4.9,
    numReviews: 67,
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: true,
    isActive: true
  }
];

export const sampleCoupons = [
  {
    code: 'DESI10',
    description: '10% OFF on all orders above ₹399',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 399,
    maxDiscountAmount: 150,
    isActive: true
  },
  {
    code: 'SWAD15',
    description: '15% OFF on orders above ₹699',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 699,
    maxDiscountAmount: 300,
    isActive: true
  },
  {
    code: 'FREESHIP',
    description: 'Free Shipping on any order',
    discountType: 'fixed',
    discountValue: 60,
    minOrderValue: 0,
    maxDiscountAmount: 60,
    isActive: true
  }
];

export const sampleSettings = [
  { key: 'freeShippingThreshold', value: 499, description: 'Minimum order value for free delivery in INR' },
  { key: 'standardShippingFee', value: 60, description: 'Standard shipping charge for orders below threshold' },
  { key: 'codEnabled', value: true, description: 'Enable Cash on Delivery' },
  { key: 'codFee', value: 0, description: 'Extra fee for COD in INR' },
  { key: 'announcementText', value: '🌶️ Traditional Rajasthani Handcrafted Pickles • FREE Delivery on orders above ₹499! • Use Code: DESI10 for 10% OFF', description: 'Header announcement marquee' },
  { key: 'whatsappNumber', value: '919782983909', description: 'Business WhatsApp phone number for customer queries' },
  { key: 'storeAddress', value: 'Prem Niwas, Bagreche Bass, Sujangarh, Rajasthan 331507', description: 'Physical store address' },
  { key: 'supportPhone', value: '+91 97829 83909', description: 'Support helpline phone' },
  { key: 'supportEmail', value: 'premsingodiya861@gmail.com', description: 'Customer support email' },
  { key: 'heroBannerImage', value: '/hero-banner.png', description: 'Hero banner image displayed on homepage' }
];

export const sampleReviews = [
  {
    reviewerName: 'Meenakshi Sharma',
    rating: 5,
    title: 'Nostalgic dadi ke haath ka swad!',
    comment: 'The Banarasi Lal Mirch achar reminded me exactly of my dadi in Jaipur. The masala stuffing is rich, roasted, and not overly salty like commercial market pickles. Finished the first jar in 2 weeks!',
    location: 'Jaipur, Rajasthan',
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    reviewerName: 'Rohit Agrawal',
    rating: 5,
    title: 'Kair Sangri pickle is unbelievable',
    comment: 'Real Kair Sangri is so hard to find outside Rajasthan. Singodhia Foods has nailed the authentic royal taste. The mustard oil aroma is fresh and pure.',
    location: 'Gurugram, Haryana',
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    reviewerName: 'Pooja Iyer',
    rating: 5,
    title: 'The Oil-free Khatta Meetha Nimbu is divine',
    comment: 'My parents cannot consume heavy oil pickles due to diet restrictions, and this sun-aged oil-free lemon pickle was a revelation for them. Soft peel and perfect jaggery-black salt balance.',
    location: 'Bengaluru, Karnataka',
    isVerifiedBuyer: true,
    isApproved: true
  },
  {
    reviewerName: 'Vikas Verma',
    rating: 4,
    title: 'Super fast delivery and pristine packing',
    comment: 'The trial box was packed with triple bubble wrap and arrived without a drop of oil leak. Loved the spicy Hari Mirch Tipore with parathas.',
    location: 'New Delhi',
    isVerifiedBuyer: true,
    isApproved: true
  }
];

// Seed function for database
export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/singodhia_foods';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    }

    console.log('Clearing existing records and seeding database...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Setting.deleteMany({});
    await Review.deleteMany({});

    // Insert categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`Seeded ${createdCategories.length} categories.`);

    // Map category ID to products
    const catMap = {};
    createdCategories.forEach(cat => {
      catMap[cat.slug] = cat._id;
    });

    const productsToInsert = sampleProducts.map(p => ({
      ...p,
      categoryRef: catMap[p.category] || null
    }));

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`Seeded ${createdProducts.length} products.`);

    // Insert coupons & settings
    await Coupon.insertMany(sampleCoupons);
    console.log(`Seeded ${sampleCoupons.length} coupons.`);

    await Setting.insertMany(sampleSettings);
    console.log(`Seeded ${sampleSettings.length} settings.`);

    // Insert sample reviews for the first product
    if (createdProducts.length > 0) {
      const reviewsWithProduct = sampleReviews.map(r => ({
        ...r,
        product: createdProducts[0]._id
      }));
      await Review.insertMany(reviewsWithProduct);
      console.log(`Seeded ${reviewsWithProduct.length} reviews.`);
    }

    // Seed default admin and test user if not exist
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@singodhiafoods.com').toLowerCase();
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Singodhia Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@Singodhia2026',
        role: 'admin',
        phone: '+91 98765 43210',
        addresses: [
          {
            fullName: 'Singodhia Master Admin',
            phone: '+91 98765 43210',
            addressLine1: 'Singodhia Bhawan, Heritage Lane',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302001',
            isDefault: true
          }
        ]
      });
      console.log(`Created default admin account: ${adminEmail} (password: ${process.env.ADMIN_PASSWORD || 'Admin@Singodhia2026'})`);
    }

    // Seed test customer account
    const testCustEmail = 'customer@example.com';
    const existingCust = await User.findOne({ email: testCustEmail });
    if (!existingCust) {
      await User.create({
        name: 'Aarav Sharma',
        email: testCustEmail,
        password: 'Password123',
        role: 'customer',
        phone: '+91 98765 12345',
        addresses: [
          {
            fullName: 'Aarav Sharma',
            phone: '+91 98765 12345',
            addressLine1: 'B-42, Malviya Nagar',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302017',
            isDefault: true
          }
        ]
      });
      console.log(`Created test customer account: ${testCustEmail} (password: Password123)`);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error.message);
  }
};

// If run directly: node utils/seedData.js
if (process.argv[1]?.endsWith('seedData.js')) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}

