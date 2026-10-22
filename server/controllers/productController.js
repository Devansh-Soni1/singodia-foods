import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { getLocalProducts, saveLocalProducts } from '../utils/productStore.js';

export const getProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      subCategory,
      taste,
      spiceLevel, 
      search, 
      minPrice, 
      maxPrice, 
      sort, 
      isBestSeller, 
      isFeatured,
      isNewArrival,
      page = 1, 
      limit = 24 
    } = req.query;

    const query = { isActive: { $ne: false } };

    if (category && category !== 'all') {
      const cleanCat = category.toLowerCase().replace(/\/$/, '');
      const baseCat = cleanCat.replace(/s$/, '').replace(/-pickle$/, '').replace(/-pickles$/, '');
      query.$or = [
        { category: cleanCat },
        { category: cleanCat.replace(/s$/, '') },
        { category: cleanCat + 's' },
        { category: new RegExp(baseCat, 'i') },
        { tags: new RegExp(baseCat, 'i') }
      ];
    }

    const tasteSub = subCategory || taste;
    if (tasteSub && tasteSub !== 'all') {
      const cleanSub = tasteSub.toLowerCase().replace(/\/$/, '');
      const cleanWords = cleanSub.replace(/-/g, ' ').split(' ').filter(w => !['pickle', 'pickles', 'achar', 'ka', 'ke', 'style'].includes(w));
      const subRegex = new RegExp(cleanSub.replace(/-/g, '.*'), 'i');
      const wordRegex = cleanWords.length > 0 ? new RegExp(cleanWords.join('|'), 'i') : subRegex;

      const subCondition = {
        $or: [
          { subCategory: new RegExp(cleanSub, 'i') },
          { subCategory: wordRegex },
          { name: wordRegex },
          { hindiName: wordRegex },
          { slug: subRegex },
          { tags: wordRegex }
        ]
      };

      if (query.$and) {
        query.$and.push(subCondition);
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, subCondition];
        delete query.$or;
      } else {
        query.$or = subCondition.$or;
      }
    }

    if (spiceLevel && spiceLevel !== 'all') {
      query.spiceLevel = spiceLevel;
    }

    if (isBestSeller === 'true') {
      query.isBestSeller = true;
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    if (isNewArrival === 'true') {
      query.isNewArrival = true;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { hindiName: searchRegex },
        { shortDescription: searchRegex },
        { ingredients: searchRegex },
        { tags: searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOption = { 'variants.0.price': 1 };
    } else if (sort === 'price-high') {
      sortOption = { 'variants.0.price': -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1, numReviews: -1 };
    } else if (sort === 'popular') {
      sortOption = { numReviews: -1, rating: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    let products = [];
    let total = 0;

    // When MongoDB is connected, strictly trust MongoDB as source of truth
    if (mongoose.connection.readyState === 1) {
      try {
        total = await Product.countDocuments(query);
        products = await Product.find(query)
          .sort(sortOption)
          .skip((page - 1) * limit)
          .limit(Number(limit));

        return res.json({
          success: true,
          products,
          total,
          page: Number(page),
          totalPages: Math.ceil(total / Number(limit)) || 1
        });
      } catch (err) {
        console.warn('Mongo find failed, reading from local fallback:', err.message);
      }
    }

    // Fallback to local persistent products ONLY if MongoDB is disconnected
    let filtered = getLocalProducts().filter(p => p.isActive !== false);
    
    if (category && category !== 'all') {
      const cleanCat = category.toLowerCase().replace(/\/$/, '');
      const baseCat = cleanCat.replace(/s$/, '').replace(/-pickle$/, '').replace(/-pickles$/, '');
      filtered = filtered.filter(p => {
        const cat = (p.category || '').toLowerCase();
        return cat.includes(baseCat) || cat === cleanCat || cat === baseCat || cat === baseCat + 's';
      });
    }
    if (tasteSub && tasteSub !== 'all') {
      const cleanSub = tasteSub.toLowerCase().replace(/\/$/, '');
      const cleanWords = cleanSub.replace(/-/g, ' ').split(' ').filter(w => !['pickle', 'pickles', 'achar', 'ka', 'ke', 'style'].includes(w));
      filtered = filtered.filter(p => {
        const sub = (p.subCategory || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        const hindi = (p.hindiName || '').toLowerCase();
        const slug = (p.slug || '').toLowerCase();
        const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : (p.tags || '').toLowerCase();
        if (sub.includes(cleanSub) || slug.includes(cleanSub)) return true;
        return cleanWords.some(w => sub.includes(w) || name.includes(w) || hindi.includes(w) || slug.includes(w) || tags.includes(w));
      });
    }
    if (spiceLevel && spiceLevel !== 'all') {
      filtered = filtered.filter(p => p.spiceLevel === spiceLevel);
    }
    if (isBestSeller === 'true') {
      filtered = filtered.filter(p => p.isBestSeller);
    }
    if (isFeatured === 'true') {
      filtered = filtered.filter(p => p.isFeatured);
    }
    if (isNewArrival === 'true') {
      filtered = filtered.filter(p => p.isNewArrival);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(s) || 
        p.hindiName?.includes(s) || 
        p.shortDescription?.toLowerCase().includes(s) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(s))) ||
        (typeof p.tags === 'string' && p.tags.toLowerCase().includes(s))
      );
    }
    if (minPrice) {
      filtered = filtered.filter(p => p.variants?.[0]?.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.variants?.[0]?.price <= Number(maxPrice));
    }

    if (sort === 'price-low') {
      filtered.sort((a, b) => (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0));
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0));
    } else if (sort === 'rating' || sort === 'popular') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // newest first
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    total = filtered.length;
    products = filtered.slice((page - 1) * limit, page * limit);

    res.json({
      success: true,
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    let { slug } = req.params;
    if (slug) {
      slug = slug.toLowerCase().replace(/\/$/, '');
    }
    let product = null;

    const SLUG_ALIASES = {
      'mango-pickle': ['mango-pickle', 'homemade-mango-pickle-aam-ka-achar', 'kachi-keri-desi-aam-ka-achar', 'punjabi-mango-pickle-punjabi-aam-ka-achar'],
      'mango-pickles': ['mango-pickle', 'homemade-mango-pickle-aam-ka-achar', 'kachi-keri-desi-aam-ka-achar', 'punjabi-mango-pickle-punjabi-aam-ka-achar'],
      'red-chilli-pickle': ['red-chilli-pickle', 'banarasi-lal-mirch-bharwa-achar', 'red-chilli-pickle-lal-mirch-ka-achar'],
      'red-chilli-pickles': ['red-chilli-pickle', 'banarasi-lal-mirch-bharwa-achar', 'red-chilli-pickle-lal-mirch-ka-achar'],
      'green-chilli-pickle': ['green-chilli-pickle', 'rajasthani-hari-mirch-tipore'],
      'green-chilli-pickles': ['green-chilli-pickle', 'rajasthani-hari-mirch-tipore'],
      'lemon-pickle': ['lemon-pickle', 'khatta-meetha-nimbu-achar'],
      'lemon-pickles': ['lemon-pickle', 'khatta-meetha-nimbu-achar'],
      'rajasthani-specials': ['rajasthani-specials', 'kair-sangri-pickle', 'ker-sangri-pickle-kair-sangri-ka-achar', 'marwadi-kair-sangri-shahi-achar'],
      'kair-sangri-pickle': ['kair-sangri-pickle', 'ker-sangri-pickle-kair-sangri-ka-achar', 'marwadi-kair-sangri-shahi-achar'],
      'garlic-pickle': ['garlic-pickle', 'desi-lahsun-masaledar-achar'],
      'garlic-pickles': ['garlic-pickle', 'desi-lahsun-masaledar-achar'],
      'sweet-pickle': ['sweet-pickle', 'khatta-meetha-nimbu-achar'],
      'mixed-pickle': ['mixed-pickle', 'pachranga-shahi-mix-achar'],
      'mixed-pickles': ['mixed-pickle', 'pachranga-shahi-mix-achar'],
      'papad': ['papad', 'bikaneri-handmade-moong-dal-papad'],
      'a2-ghee': ['a2-ghee', 'pure-desi-gir-cow-a2-bilona-ghee'],
      'masalas': ['masalas', 'artisan-shahi-achar-masala-chai-masala'],
      'combo-packs': ['combo-packs', 'dadis-special-pickle-trial-box', 'rajasthani-shahi-martaban-hamper']
    };

    const searchSlugs = [slug, ...(SLUG_ALIASES[slug] || [])];

    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(slug)) {
          product = await Product.findById(slug);
        }
        if (!product) {
          product = await Product.findOne({
            $or: [
              { slug: { $in: searchSlugs } },
              { slug: new RegExp(`^${slug}`, 'i') },
              { category: slug },
              { category: slug + 's' }
            ]
          });
        }
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
      } catch (err) {
        console.warn('Mongo findOne error:', err.message);
      }
    }

    if (!product) {
      const local = getLocalProducts();
      product = local.find(p => 
        searchSlugs.includes(p.slug) ||
        p.slug === slug || 
        p.slug?.includes(slug) ||
        p.category === slug ||
        p.category === slug + 's' ||
        p._id?.toString() === slug
      );
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch related products
    let relatedProducts = [];
    if (mongoose.connection.readyState === 1) {
      try {
        relatedProducts = await Product.find({
          category: product.category,
          slug: { $ne: product.slug },
          isActive: { $ne: false }
        }).limit(4);
      } catch (e) {}
    } else {
      const local = getLocalProducts();
      relatedProducts = local
        .filter(p => p.category === product.category && p.slug !== product.slug && p.isActive !== false)
        .slice(0, 4);
    }

    res.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedAndBestsellers = async (req, res, next) => {
  try {
    let bestsellers = [];
    let featured = [];
    let newArrivals = [];

    if (mongoose.connection.readyState === 1) {
      try {
        bestsellers = await Product.find({ isBestSeller: true, isActive: true }).limit(8);
        featured = await Product.find({ isFeatured: true, isActive: true }).limit(8);
        newArrivals = await Product.find({ isNewArrival: true, isActive: true }).limit(8);

        return res.json({
          success: true,
          bestsellers,
          featured,
          newArrivals
        });
      } catch (e) {
        console.warn('Mongo getFeaturedAndBestsellers failed:', e.message);
      }
    }

    const local = getLocalProducts();
    bestsellers = local.filter(p => p.isBestSeller).slice(0, 8);
    featured = local.filter(p => p.isFeatured).slice(0, 8);
    newArrivals = local.filter(p => p.isNewArrival).slice(0, 8);

    res.json({
      success: true,
      bestsellers,
      featured,
      newArrivals
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    
    // Auto-generate clean slug
    if (!productData.slug && productData.name) {
      productData.slug = productData.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (!productData.slug) {
      productData.slug = 'pickle-' + Date.now();
    }

    // Ensure uniqueness
    const local = getLocalProducts();
    let baseSlug = productData.slug;
    let counter = 1;
    while (local.some(p => p.slug === productData.slug)) {
      productData.slug = `${baseSlug}-${counter++}`;
    }

    // Default fields
    if (!productData.shortDescription) {
      productData.shortDescription = productData.name || 'Traditional Homemade Pickle';
    }
    if (!productData.fullDescription) {
      productData.fullDescription = productData.shortDescription;
    }
    if (!productData.images || productData.images.length === 0) {
      productData.images = ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'];
    }
    if (!productData.spiceLevel) productData.spiceLevel = 'Medium';
    if (!productData.shelfLife) productData.shelfLife = '12 Months from packaging date';
    if (!productData.oilType) productData.oilType = 'Pure Kachi Ghani Mustard Oil (सरसों का तेल)';
    if (productData.isActive === undefined) productData.isActive = true;

    let savedProduct = null;
    if (mongoose.connection.readyState === 1) {
      try {
        savedProduct = await Product.create(productData);
      } catch (err) {
        console.warn('Mongo Product.create failed, saving locally:', err.message);
      }
    }

    if (!savedProduct) {
      savedProduct = {
        _id: 'prod-' + Date.now() + '-' + Math.round(Math.random() * 1000),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Save to local storage for immediate persistence
    const updated = [savedProduct, ...local];
    saveLocalProducts(updated);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updated = null;

    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.isValidObjectId(id)) {
          updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        } else {
          updated = await Product.findOneAndUpdate({ $or: [{ slug: id }, { _id: id }] }, req.body, { new: true, runValidators: true });
        }
      } catch (err) {
        console.warn('Mongo findByIdAndUpdate failed:', err.message);
      }
    }

    const local = getLocalProducts();
    const index = local.findIndex(p => p._id?.toString() === id || p.slug === id);
    if (index !== -1) {
      local[index] = { ...local[index], ...req.body, updatedAt: new Date().toISOString() };
      saveLocalProducts(local);
      if (!updated) updated = local[index];
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.isValidObjectId(id)) {
          await Product.findByIdAndDelete(id);
        } else {
          await Product.findOneAndDelete({ $or: [{ slug: id }, { _id: id }] });
        }
      } catch (err) {
        console.warn('Mongo delete failed:', err.message);
      }
    }

    const local = getLocalProducts();
    const filtered = local.filter(p => p._id?.toString() !== id && p.slug !== id);
    saveLocalProducts(filtered);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
