export const SAMPLE_CATEGORIES = [
  {
    name: 'Mango Pickles',
    hindiName: 'आम का अचार',
    slug: 'mango-pickles',
    description: 'Sun-cured raw green mangoes infused with cold-pressed mustard oil & roasted whole spices.',
    image: '🥭',
    displayOrder: 1
  },
  {
    name: 'Red Chilli Pickles',
    hindiName: 'लाल मिर्च का अचार',
    slug: 'red-chilli-pickles',
    description: 'Banarasi sun-dried red peppers hand-stuffed with tangy amchur, saunf, and mustard.',
    image: '🌶️',
    displayOrder: 2
  },
  {
    name: 'Green Chilli Pickles',
    hindiName: 'हरी मिर्च का अचार',
    slug: 'green-chilli-pickles',
    description: 'Crisp hand-cut green chillies cured with lemon, turmeric, and cracked rai.',
    image: '🫑',
    displayOrder: 3
  },
  {
    name: 'Lemon Pickles',
    hindiName: 'नीम्बू का अचार',
    slug: 'lemon-pickles',
    description: 'Khatta-meetha and oil-free lemon pickles aged in earthen martabans under sunlight.',
    image: '🍋',
    displayOrder: 4
  },
  {
    name: 'Rajasthani Specials',
    hindiName: 'राजस्थानी स्पेशल',
    slug: 'rajasthani-specials',
    description: 'Authentic royal Marwadi heritage creations: Kair Sangri, Lesua (Gunda), and Hing Aam.',
    image: '🏺',
    displayOrder: 5
  },
  {
    name: 'Garlic Pickles',
    hindiName: 'लहसुन का अचार',
    slug: 'garlic-pickles',
    description: 'Whole juicy garlic cloves steeped in spiced cold-pressed mustard oil.',
    image: '🧄',
    displayOrder: 6
  },
  {
    name: 'Mixed Pickles',
    hindiName: 'पचरंगा मिक्स अचार',
    slug: 'mixed-pickles',
    description: 'Festive crunch of farm-fresh winter vegetables and raw fruits in mustard oil.',
    image: '🥗',
    displayOrder: 7
  },
  {
    name: 'Combo Packs & Hampers',
    hindiName: 'कॉम्बो और गिफ़्ट पैक',
    slug: 'combo-packs',
    description: 'Handpicked tasting sets, Dadi trial boxes, and ceramic martaban gift hampers.',
    image: '🎁',
    displayOrder: 8
  },
  {
    name: 'Bikaneri Papad',
    hindiName: 'बीकानेरी पापड़',
    slug: 'papad',
    description: 'Crispy sun-dried handmade Moong & Chana dal papads with authentic Hing & Kali Mirch.',
    image: '🫓',
    displayOrder: 9
  },
  {
    name: 'A2 Gir Cow Ghee',
    hindiName: 'A2 गिर गाय बिलोना घी',
    slug: 'a2-ghee',
    description: 'Traditional wood-churned Bilona golden ghee prepared from grass-fed Gir cows.',
    image: '🍯',
    displayOrder: 10
  },
  {
    name: 'Artisan Masalas',
    hindiName: 'देसी पिसे मसाले',
    slug: 'masalas',
    description: 'Stone-ground heritage spice blends: Royal Achar Masala, Chai Masala, and Shahi Garam Masala.',
    image: '🌶️',
    displayOrder: 11
  }
];

export const SAMPLE_PRODUCTS = [
  {
    _id: 'p1',
    name: 'Homemade Mango Pickle | Aam ka Achar',
    hindiName: 'घर का बना आम का अचार',
    slug: 'mango-pickle',
    category: 'mango-pickles',
    subCategory: 'tangy',
    shortDescription: 'Classic sun-cured raw mango pickle made with hand-cut Ramkela mangoes, fenugreek, and cold-pressed oil.',
    fullDescription: 'Nothing evokes childhood nostalgia quite like the piquant crunch of raw mango pickle. We hand-select sour, firm Ramkela raw mangoes, cut them into traditional bite-sized pieces with their tender kernels intact, and marinate them with freshly ground whole spices.',
    images: [
      '/products/homemade-mango-pickle.png',
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 249, originalPrice: 299, inStock: true, stockCount: 80, sku: 'HMP-250' },
      { weight: '500g', price: 449, originalPrice: 520, inStock: true, stockCount: 50, sku: 'HMP-500' },
      { weight: '1kg', price: 799, originalPrice: 950, inStock: true, stockCount: 35, sku: 'HMP-1000' }
    ],
    spiceLevel: 'Medium spicy',
    ingredients: ['Raw Mango Chunks', 'Sunflower Oil / Mustard Oil', 'Fenugreek', 'Fennel', 'Kalonji', 'Turmeric', 'Rock Salt'],
    allergenInfo: '100% Natural, preservative-free.',
    storageInstructions: 'Keep covered with oil in a cool dry place.',
    shelfLife: '12 Months',
    oilType: 'Sunflower Oil',
    traditionNotes: 'Sun-cured in traditional ceramic martabans.',
    pairWith: ['Dal Chawal', 'Ajwain Paratha', 'Thepla & Curd'],
    tags: ['Sunflower Oil', 'Medium spicy', 'Jain Friendly'],
    rating: 4.7,
    numReviews: 1837,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    _id: 'p2',
    name: 'Red Chilli Pickle | Lal Mirch ka Achar',
    hindiName: 'बनारसी भरवां लाल मिर्च अचार',
    slug: 'red-chilli-pickle',
    category: 'red-chilli-pickles',
    subCategory: 'spicy',
    shortDescription: 'Plump sun-dried red chillies hand-stuffed with aromatic roasted spices, saunf, amchur, and pure mustard oil.',
    fullDescription: 'Our Bharwa Lal Mirch Achar is the crown jewel of traditional Indian pickling. Each ripe, crimson chilli is carefully handpicked, slit with precision, and meticulously stuffed by hand with a slow-roasted dry spice blend.',
    images: [
      '/products/red-chilli-pickle.png',
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 249, originalPrice: 299, inStock: true, stockCount: 65, sku: 'RCP-250' },
      { weight: '500g', price: 449, originalPrice: 520, inStock: true, stockCount: 40, sku: 'RCP-500' },
      { weight: '1kg', price: 799, originalPrice: 950, inStock: true, stockCount: 20, sku: 'RCP-1000' }
    ],
    spiceLevel: 'Medium Spicy',
    ingredients: ['Sun-dried Red Chillies', 'Pure Mustard Oil', 'Fennel Seeds', 'Fenugreek', 'Yellow Mustard', 'Amchur', 'Hing', 'Rock Salt'],
    allergenInfo: 'Contains Mustard. Preservative-free.',
    storageInstructions: 'Keep submerged in mustard oil.',
    shelfLife: '12 Months',
    oilType: 'Mustard Oil',
    traditionNotes: '100% Hand-stuffed using our 40-year-old family recipe.',
    pairWith: ['Aloo Paratha', 'Dal Khichdi & Ghee', 'Mathri'],
    tags: ['Mustard Oil', 'Medium Spicy', 'Jain Friendly'],
    rating: 4.8,
    numReviews: 795,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    _id: 'p3',
    name: 'Punjabi Mango Pickle | Punjabi Aam Ka Achar',
    hindiName: 'पंजाबी आम का अचार',
    slug: 'punjabi-mango-pickle-punjabi-aam-ka-achar',
    category: 'mango-pickles',
    subCategory: 'tangy',
    shortDescription: 'Zesty North Indian style raw mango pickle with whole methi dana, saunf, and aromatic mustard oil.',
    fullDescription: 'Rich Punjabi style raw mango pickle infused with roasted kalonji, saunf, fenugreek, and cold-pressed Kachi Ghani mustard oil for an authentic dhaba and home flavor.',
    images: [
      '/products/punjabi-mango-pickle.png',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 249, originalPrice: 299, inStock: true, stockCount: 50, sku: 'PMP-250' },
      { weight: '500g', price: 449, originalPrice: 520, inStock: true, stockCount: 35, sku: 'PMP-500' },
      { weight: '1kg', price: 799, originalPrice: 950, inStock: true, stockCount: 25, sku: 'PMP-1000' }
    ],
    spiceLevel: 'Medium Spicy',
    ingredients: ['Hand-cut Mangoes', 'Mustard Oil', 'Methi Dana', 'Fennel', 'Kalonji', 'Red Chilli', 'Turmeric', 'Rock Salt'],
    allergenInfo: 'Contains Mustard.',
    storageInstructions: 'Store in airtight jar in room temperature.',
    shelfLife: '12 Months',
    oilType: 'Mustard Oil',
    traditionNotes: 'Traditional North Indian heritage spice blend.',
    pairWith: ['Stuffed Paratha', 'Chole Bhature', 'Dal Makhani'],
    tags: ['Mustard Oil', 'Medium Spicy', 'Jain Friendly'],
    rating: 4.8,
    numReviews: 668,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    _id: 'p4',
    name: 'Ker Sangri Pickle | Kair Sangri Ka Achar',
    hindiName: 'मारवाड़ी कैर सांगरी शाही अचार',
    slug: 'ker-sangri-pickle-kair-sangri-ka-achar',
    category: 'rajasthani-specials',
    subCategory: 'rajasthani',
    shortDescription: 'Royal Thar Desert delicacy crafted from wild Kair capers and desert Sangri pods in golden mustard oil.',
    fullDescription: 'Hailing from the heart of the Thar Desert, Kair Sangri is Rajasthan’s most prized culinary treasure. Hand-foraged wild desert capers (Kair) and indigenous Sangri bean pods simmered with roasted spices and cold-pressed mustard oil.',
    images: [
      '/products/kair-sangri-pickle.png',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 349, originalPrice: 399, inStock: true, stockCount: 12, sku: 'KS-250' },
      { weight: '500g', price: 649, originalPrice: 750, inStock: true, stockCount: 8, sku: 'KS-500' }
    ],
    spiceLevel: 'Medium Spicy',
    ingredients: ['Wild Kair Capers', 'Thar Sangri', 'Cold-Pressed Mustard Oil', 'Mathania Chillies', 'Fennel', 'Amchur', 'Hing', 'Rock Salt'],
    allergenInfo: 'Contains Mustard.',
    storageInstructions: 'Keep in cool dry place.',
    shelfLife: '12 Months',
    oilType: 'Mustard Oil',
    traditionNotes: 'Wild foraged royal Marwadi recipe.',
    pairWith: ['Bajra Roti', 'Missi Roti', 'Dal Baati Churma'],
    tags: ['Mustard Oil', 'Medium Spicy', 'Jain Friendly'],
    rating: 4.8,
    numReviews: 106,
    isBestSeller: true,
    isFeatured: true,
    isLimitedStock: true,
    isNewArrival: false,
    isActive: true
  },
  {
    _id: 'p5',
    name: 'Rajasthani Teekhi Hari Mirch Ke Tipore',
    hindiName: 'राजस्थानी तीखी हरी मिर्च का अचार',
    slug: 'rajasthani-hari-mirch-tipore',
    category: 'green-chilli-pickles',
    subCategory: 'spicy',
    shortDescription: 'Fresh crisp green chillies chopped and tossed with coarse ground mustard, turmeric, and tangy lemon brine.',
    fullDescription: 'A daily dining essential across Rajasthani homes! Freshly harvested spicy green chillies are slit and tossed with cracked rai seeds, aromatic saunf, pinch of turmeric, and warm mustard oil. Gives an instant zesty punch to everyday dal-roti without overwhelming the palate.',
    images: [
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80'
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
    _id: 'p6',
    name: 'Desi Lahsun Ka Masaledar Achar',
    hindiName: 'देसी लहसुन का चटपटा अचार',
    slug: 'desi-lahsun-masaledar-achar',
    category: 'garlic-pickles',
    subCategory: 'spicy',
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
    _id: 'p7',
    name: 'Pachranga Shahi Mix Achar',
    hindiName: 'पचरंगा शाही मिक्स अचार',
    slug: 'pachranga-shahi-mix-achar',
    category: 'mixed-pickles',
    subCategory: 'winter',
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
    _id: 'p_lemon',
    name: 'Khatta Meetha Nimbu Ka Achar | Sweet Lemon Pickle',
    hindiName: 'खट्टा-मीठा नीम्बू का पारंपरिक अचार',
    slug: 'khatta-meetha-nimbu-achar',
    category: 'lemon-pickles',
    subCategory: 'sweet',
    shortDescription: 'Sun-cured thin-skinned Kagzi lemons cooked with mishri, black salt, cumin, and warm spices without a single drop of oil.',
    fullDescription: 'Our signature zero-oil digestive tonic! Hand-selected juicy thin-skinned Kagzi limes are cured in rock salt and raw mishri inside authentic clay martabans under bright sunlight for over 45 days. The lemon peels turn velvety soft, creating an irresistible sweet, sour, and mildly spiced syrup that enhances digestion.',
    images: [
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '250g', price: 219, originalPrice: 269, inStock: true, stockCount: 60, sku: 'KMN-250' },
      { weight: '500g', price: 399, originalPrice: 480, inStock: true, stockCount: 45, sku: 'KMN-500' }
    ],
    spiceLevel: 'Mild',
    ingredients: ['Kagzi Lemons', 'Raw Cane Sugar (Mishri)', 'Black Salt', 'Ajwain', 'Cumin Seeds', 'Degi Mirch', 'Hing', 'Rock Salt'],
    allergenInfo: '100% Oil-Free & Preservative-Free.',
    storageInstructions: 'Store in a cool dry place. Keep jar tightly sealed.',
    shelfLife: '24 Months (Tastes richer as it ages)',
    oilType: 'Oil-Free (बिना तेल का)',
    traditionNotes: 'Aged in sunlight for 45+ days in traditional ceramic jars.',
    pairWith: ['Ajwain Poori', 'Khichdi', 'Thepla', 'Stomach Soothing Tonic'],
    tags: ['Oil-Free', 'Sweet & Sour', 'Digestive', 'Sun-Cured'],
    rating: 4.9,
    numReviews: 240,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    _id: 'p8',
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
    _id: 'p9',
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
  },
  {
    _id: 'p10',
    name: 'Bikaneri Handmade Moong Dal Papad (Spiced)',
    hindiName: 'बीकानेरी हाथ का बना मूँग दाल पापड़',
    slug: 'bikaneri-handmade-moong-dal-papad',
    category: 'papad',
    shortDescription: 'Sun-dried traditional crisp papads rolled by hand using stone-ground Moong dal, black pepper, and pure Hing.',
    fullDescription: 'Prepared using traditional rolling pins by skilled women artisans in Bikaner. Made from high-protein Moong dal and Urad dal seasoned with coarsely crushed Malabar black pepper, sajji khar, and aromatic Hing. Roast over open flame or fry to golden crisp perfection.',
    images: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '400g (Approx 25-30 pieces)', price: 179, originalPrice: 220, inStock: true, stockCount: 60, sku: 'PAP-400' },
      { weight: '800g Family Pack', price: 329, originalPrice: 399, inStock: true, stockCount: 40, sku: 'PAP-800' }
    ],
    spiceLevel: 'Medium',
    ingredients: ['Moong Dal Flour', 'Urad Dal Flour', 'Crushed Black Pepper (Kali Mirch)', 'Pure Hing (Asafoetida)', 'Sajji', 'Salt', 'Cottonseed Oil'],
    allergenInfo: 'Gluten-Free ingredients.',
    storageInstructions: 'Store in an airtight container away from moisture.',
    shelfLife: '6 Months from packaging date',
    oilType: 'Sun-dried',
    traditionNotes: '100% Hand-rolled in Bikaner, Rajasthan.',
    pairWith: ['Dal Chawal, Khichdi, Evening Tea Snacks'],
    tags: ['Bestseller', 'Handmade', 'Sun-Dried', 'Bikaneri Special'],
    rating: 4.8,
    numReviews: 92,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    _id: 'p11',
    name: 'Pure Desi Gir Cow A2 Bilona Ghee',
    hindiName: 'शुद्ध देसी गिर गाय A2 बिलोना घी',
    slug: 'pure-desi-gir-cow-a2-bilona-ghee',
    category: 'a2-ghee',
    shortDescription: 'Cultured golden A2 ghee prepared through traditional Vedic wooden bilona churning over gentle dung-cake fires.',
    fullDescription: 'Crafted from pure whole curd of grass-fed indigenous Gir cows. Slowly churned both clockwise and counter-clockwise with a traditional wooden bilona to yield makkhan, then gently simmered to perfection. Granular texture (danedar), nutty aroma, and rich in natural nutrients.',
    images: [
      'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '500ml Glass Jar', price: 849, originalPrice: 999, inStock: true, stockCount: 30, sku: 'GHEE-500' },
      { weight: '1 Litre Glass Jar', price: 1599, originalPrice: 1899, inStock: true, stockCount: 20, sku: 'GHEE-1000' }
    ],
    spiceLevel: 'Mild',
    ingredients: ['100% Pure A2 Gir Cow Cultured Milk Fat (Clarified Butter)'],
    allergenInfo: 'Contains dairy fat (Lactose-friendly cultured ghee).',
    storageInstructions: 'Store in a cool, dry place. Do not refrigerate.',
    shelfLife: '12 Months',
    oilType: 'A2 Gir Cow Milk Fat',
    traditionNotes: 'Vedic 5-step Bilona method.',
    pairWith: ['Hot Rotis, Khichdi, Desi Pickles, Morning Warm Water'],
    tags: ['A2 Gir Cow', 'Vedic Bilona', 'Danedar', '100% Natural'],
    rating: 5.0,
    numReviews: 114,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: true,
    isActive: true
  },
  {
    _id: 'p12',
    name: 'Artisan Shahi Achar Masala & Chai Masala Duo',
    hindiName: 'शाही अचार मसाला और कड़क चाय मसाला',
    slug: 'artisan-shahi-achar-masala-chai-masala',
    category: 'masalas',
    shortDescription: 'Stone-ground heritage spices: Fresh whole-spice pickle seasoning & royal Rajasthani saffron cardamom tea blend.',
    fullDescription: 'Two iconic spice secrets from grandmother’s pantry. Includes 200g of our signature slow-roasted Achar Masala (perfect for curating homemade pickles, achari paneer, or stuffing parathas) and 100g of aromatic royal Chai Masala infused with green cardamom, ginger, cloves, and saffron strands.',
    images: [
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: '200g Achar Masala + 100g Chai Masala', price: 349, originalPrice: 420, inStock: true, stockCount: 45, sku: 'MAS-DUO' }
    ],
    spiceLevel: 'Medium',
    ingredients: ['Fennel, Methi, Peeli Sarson, Amchur, Kalonji, Green Cardamom, Dry Ginger, Cloves, Black Pepper, Cinnamon, Kesar'],
    allergenInfo: 'Contains Mustard.',
    storageInstructions: 'Store in airtight jars to retain volatile essential oils.',
    shelfLife: '12 Months',
    oilType: 'Dry Stone-Ground Spices',
    traditionNotes: 'Pounded slowly in stone mortar to preserve authentic aroma.',
    pairWith: ['Achari Parathas, Daily Morning Tea, Curries'],
    tags: ['Heritage Spices', 'Zero Preservatives', 'Aromatic'],
    rating: 4.9,
    numReviews: 48,
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: false,
    isActive: true
  },
  {
    _id: 'p13',
    name: 'Rajasthani Shahi Utsav Hamper (Sweet & Spicy Delights)',
    hindiName: 'राजस्थानी शाही उत्सव हैंपर',
    slug: 'rajasthani-shahi-utsav-hamper',
    category: 'combo-packs',
    shortDescription: 'Grand festive gifting box: Ceramic Martaban with Banarasi Lal Mirch, Khatta-Meetha Lemon, Moong Papad, and brass Diya.',
    fullDescription: 'Illuminate your celebrations with the authentic tastes of royal Rajasthan. This luxurious festive hamper features a ceramic pickle martaban, 350g Banarasi Bharwa Lal Mirch, 350g Sweet Khatta-Meetha Nimbu Achar, a pack of handcrafted Bikaneri Moong Papad, and an auspicious handcrafted brass Peacock Diya. Packed in a regal festive gift box.',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { weight: 'Luxury Gift Box with Brass Diya', price: 1499, originalPrice: 1850, inStock: true, stockCount: 20, sku: 'SHAHI-HAMPER' }
    ],
    spiceLevel: 'Medium',
    ingredients: ['Banarasi Mirch 350g + Khatta Meetha Nimbu 350g + Bikaneri Papad 400g + Brass Diya.'],
    allergenInfo: 'Contains Mustard.',
    storageInstructions: 'Store in a cool, dry place.',
    shelfLife: '12 Months',
    oilType: 'Mustard Oil & Oil-Free Lemon',
    traditionNotes: 'Specially curated for festive auspicious gifting.',
    pairWith: ['Festive Family Gatherings, Royal Feasts'],
    tags: ['Festive Hamper', 'Ceramic Barni', 'Gift Box'],
    rating: 5.0,
    numReviews: 34,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: true,
    isActive: true
  }
];

export const SAMPLE_REVIEWS = [
  {
    id: 'r1',
    reviewerName: 'Meenakshi Sharma',
    rating: 5,
    title: 'Nostalgic dadi ke haath ka swad!',
    comment: 'The Banarasi Lal Mirch achar reminded me exactly of my dadi in Jaipur. The masala stuffing is rich, roasted, and not overly salty like commercial market pickles. Finished the first jar in 2 weeks!',
    location: 'Jaipur, Rajasthan',
    date: '2 days ago',
    isVerifiedBuyer: true
  },
  {
    id: 'r2',
    reviewerName: 'Rohit Agrawal',
    rating: 5,
    title: 'Kair Sangri pickle is unbelievable',
    comment: 'Real Kair Sangri is so hard to find outside Rajasthan. Singodhia Foods has nailed the authentic royal taste. The mustard oil aroma is fresh and pure.',
    location: 'Gurugram, Haryana',
    date: '1 week ago',
    isVerifiedBuyer: true
  },
  {
    id: 'r3',
    reviewerName: 'Pooja Iyer',
    rating: 5,
    title: 'The Oil-free Khatta Meetha Nimbu is divine',
    comment: 'My parents cannot consume heavy oil pickles due to diet restrictions, and this sun-aged oil-free lemon pickle was a revelation for them. Soft peel and perfect jaggery-black salt balance.',
    location: 'Bengaluru, Karnataka',
    date: '2 weeks ago',
    isVerifiedBuyer: true
  },
  {
    id: 'r4',
    reviewerName: 'Vikas Verma',
    rating: 4,
    title: 'Super fast delivery and pristine packing',
    comment: 'The trial box was packed with triple bubble wrap and arrived without a drop of oil leak. Loved the spicy Hari Mirch Tipore with morning parathas.',
    location: 'New Delhi',
    date: '3 weeks ago',
    isVerifiedBuyer: true
  }
];

export const SAMPLE_FAQS = [
  {
    q: 'How are Singodhia Foods pickles prepared?',
    a: 'All our pickles are prepared strictly by hand in small artisan batches using heritage family recipes from Rajasthan. We use 100% natural spices, cold-pressed Kachi Ghani mustard oil, and mature them naturally under sunlight in traditional ceramic barnis (martabans).'
  },
  {
    q: 'Do your pickles contain any chemical preservatives or artificial vinegar?',
    a: 'Absolutely not! We do not add synthetic acetic acid, sodium benzoate, or artificial food colours. Natural preservation is achieved purely through sun-curing, cold-pressed mustard oil, and pure rock salt/spices.'
  },
  {
    q: 'How long do the pickles stay fresh?',
    a: 'Our mustard oil pickles typically have a shelf life of 12 to 18 months, and our oil-free sun-aged lemon pickle stays delicious for 24+ months! Always ensure the oil layer covers the pickle and use a clean, dry spoon.'
  },
  {
    q: 'What is the shipping cost and delivery time?',
    a: 'We offer FREE Delivery across India on all orders above ₹499! For orders below ₹499, a nominal shipping fee of ₹60 is applied. Most orders are dispatched within 24 hours and delivered in 3 to 5 business days.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept 100% secure online payments powered by Razorpay, including UPI (Google Pay, PhonePe, Paytm, BHIM), all Debit & Credit Cards, and Net Banking.'
  },
  {
    q: 'Can I create a custom gift hamper or corporate combo?',
    a: 'Yes! Use our "Build Your Own Pickle Combo" section on the website to handpick your favorite jars and boxes, or contact us directly on WhatsApp for bulk festive corporate gifting.'
  }
];

export const findSampleProduct = (slug = '') => {
  if (!slug) return null;
  const clean = slug.toLowerCase().replace(/\/$/, '');

  // 1. Direct match
  let p = SAMPLE_PRODUCTS.find(item => item.slug === clean || item._id === clean);
  if (p) return p;

  // 2. Common clean slug mappings
  const cleanMap = {
    'mango-pickle': 'homemade-mango-pickle-aam-ka-achar',
    'mango-pickles': 'homemade-mango-pickle-aam-ka-achar',
    'red-chilli-pickle': 'red-chilli-pickle-lal-mirch-ka-achar',
    'red-chilli-pickles': 'red-chilli-pickle-lal-mirch-ka-achar',
    'green-chilli-pickle': 'rajasthani-hari-mirch-tipore',
    'green-chilli-pickles': 'rajasthani-hari-mirch-tipore',
    'lemon-pickle': 'khatta-meetha-nimbu-achar',
    'lemon-pickles': 'khatta-meetha-nimbu-achar',
    'rajasthani-specials': 'ker-sangri-pickle-kair-sangri-ka-achar',
    'kair-sangri-pickle': 'ker-sangri-pickle-kair-sangri-ka-achar',
    'garlic-pickle': 'desi-lahsun-masaledar-achar',
    'garlic-pickles': 'desi-lahsun-masaledar-achar',
    'mixed-pickle': 'pachranga-shahi-mix-achar',
    'mixed-pickles': 'pachranga-shahi-mix-achar',
    'sweet-pickle': 'khatta-meetha-nimbu-achar',
    'papad': 'bikaneri-handmade-moong-dal-papad',
    'a2-ghee': 'pure-desi-gir-cow-a2-bilona-ghee',
    'masalas': 'artisan-shahi-achar-masala-chai-masala',
    'combo-packs': 'dadis-special-pickle-trial-box'
  };

  const target = cleanMap[clean];
  if (target) {
    p = SAMPLE_PRODUCTS.find(item => item.slug === target);
    if (p) return p;
  }

  // 3. Substring match
  p = SAMPLE_PRODUCTS.find(item => 
    item.slug?.includes(clean) || 
    clean.includes(item.slug) ||
    item.category?.replace(/s$/, '') === clean.replace(/s$/, '')
  );

  return p || null;
};

