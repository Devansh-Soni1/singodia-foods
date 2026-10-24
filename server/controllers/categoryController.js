import mongoose from 'mongoose';
import Category from '../models/Category.js';
import { sampleCategories } from '../utils/seedData.js';

const defaultSubCategoriesMap = {
  'mango-pickles': [
    { name: 'Traditional Mango Pickle', hindiName: 'पारंपरिक आम का अचार', slug: 'traditional-mango-pickle', taste: 'tangy' },
    { name: 'Punjabi Mango Pickle', hindiName: 'पंजाबी आम का अचार', slug: 'punjabi-mango-pickle', taste: 'spicy' },
    { name: 'Sweet Mango Pickle', hindiName: 'मीठा आम का अचार', slug: 'sweet-mango-pickle', taste: 'sweet' },
    { name: 'Mango Chundo / Chunda', hindiName: 'आम का छुंदा / मुरब्बा', slug: 'mango-chunda', taste: 'sweet' },
    { name: 'Avakaya (Andhra Style)', hindiName: 'आवाकाया आम अचार', slug: 'avakaya-mango-pickle', taste: 'spicy' },
    { name: 'Dry Mango Pickle', hindiName: 'सूखा हींग आम का अचार', slug: 'dry-mango-pickle', taste: 'tangy' },
    { name: 'Kachi Keri Desi Pickle', hindiName: 'कच्ची केरी का अचार', slug: 'kachi-keri-pickle', taste: 'tangy' }
  ],
  'jackfruit-pickles': [
    { name: 'Traditional Kathal Pickle', hindiName: 'पारंपरिक कटहल का अचार', slug: 'traditional-kathal-pickle', taste: 'spicy' },
    { name: 'Spicy Mustard Kathal Achar', hindiName: 'सरसों मसालेदार कटहल', slug: 'spicy-mustard-kathal', taste: 'spicy' },
    { name: 'Desi Kathal Masala', hindiName: 'देसी कटहल मसाला', slug: 'desi-kathal-masala', taste: 'tangy' }
  ],
  'lemon-pickles': [
    { name: 'Khatta Meetha Nimbu Pickle', hindiName: 'खट्टा मीठा नीम्बू का अचार', slug: 'khatta-meetha-nimbu', taste: 'sweet' },
    { name: 'Oil-Free Sun-Dried Lemon', hindiName: 'धूप में पका बिना तेल का नीम्बू', slug: 'oil-free-lemon-pickle', taste: 'tangy' },
    { name: 'Salty Black Lemon Pickle', hindiName: 'काला पाचक नीम्बू अचार', slug: 'black-lemon-pickle', taste: 'tangy' },
    { name: 'Spicy Lemon Pickle', hindiName: 'तीखा चटपटा नीम्बू', slug: 'spicy-lemon-pickle', taste: 'spicy' }
  ],
  'red-chilli-pickles': [
    { name: 'Banarasi Bharwa Lal Mirch', hindiName: 'बनारसी भरवां लाल मिर्च', slug: 'banarasi-lal-mirch', taste: 'spicy' },
    { name: 'Rajasthani Hari Mirch Tipore', hindiName: 'राजस्थानी हरी मिर्च के टिपोरे', slug: 'hari-mirch-tipore', taste: 'spicy' },
    { name: 'Green Chilli Thecha', hindiName: 'हरी मिर्च का ठेचा', slug: 'green-chilli-thecha', taste: 'spicy' },
    { name: 'Rai Vali Teekhi Hari Mirch', hindiName: 'राई वाली तीखी हरी मिर्च', slug: 'rai-hari-mirch', taste: 'spicy' },
    { name: 'Sweet & Tangy Chilli Pickle', hindiName: 'खट्टी मीठी मिर्च', slug: 'sweet-tangy-chilli', taste: 'sweet' }
  ],
  'green-chilli-pickles': [
    { name: 'Rajasthani Hari Mirch Tipore', hindiName: 'राजस्थानी हरी मिर्च के टिपोरे', slug: 'hari-mirch-tipore', taste: 'spicy' },
    { name: 'Green Chilli Thecha', hindiName: 'हरी मिर्च का ठेचा', slug: 'green-chilli-thecha', taste: 'spicy' },
    { name: 'Rai Vali Teekhi Hari Mirch', hindiName: 'राई वाली तीखी हरी मिर्च', slug: 'rai-hari-mirch', taste: 'spicy' }
  ],
  'mixed-pickles': [
    { name: 'Pachranga Shahi Mix Pickle', hindiName: 'पचरंगा शाही मिक्स अचार', slug: 'pachranga-mix-pickle', taste: 'rajasthani' },
    { name: 'Gajar Gobhi Shalgam Winter Pickle', hindiName: 'गाजर गोभी शलजम सर्दियों का अचार', slug: 'gajar-gobhi-shalgam', taste: 'winter' },
    { name: 'Sweet & Sour Mixed Pickle', hindiName: 'खट्टा मीठा मिक्स अचार', slug: 'sweet-sour-mixed', taste: 'sweet' }
  ],
  'amla-pickles': [
    { name: 'Desi Amla Masala Pickle', hindiName: 'देसी आंवला मसालेदार अचार', slug: 'amla-masala-pickle', taste: 'tangy' },
    { name: 'Sweet Amla Murabba', hindiName: 'मीठा आंवला मुरब्बा', slug: 'amla-murabba', taste: 'sweet' },
    { name: 'Oil-Free Amla Achar', hindiName: 'बिना तेल का आंवला', slug: 'oil-free-amla', taste: 'tangy' }
  ],
  'garlic-pickles': [
    { name: 'Desi Lahsun Masaledar Achar', hindiName: 'देसी लहसुन का चटपटा अचार', slug: 'desi-lahsun-achar', taste: 'spicy' },
    { name: 'Garlic & Red Chilli Chutney', hindiName: 'लहसुन लाल मिर्च की चटनी', slug: 'garlic-chilli-chutney', taste: 'spicy' },
    { name: 'Sun-Dried Garlic Pickle', hindiName: 'धूप में पका लहसुन अचार', slug: 'sun-dried-garlic', taste: 'tangy' }
  ],
  'ginger-pickles': [
    { name: 'Nimbu Adrak Hari Mirch', hindiName: 'नीम्बू अदरक हरी मिर्च पाचक अचार', slug: 'nimbu-adrak-mirch', taste: 'tangy' },
    { name: 'Masaledar Adrak Ka Achar', hindiName: 'मसालेदार अदरक का अचार', slug: 'masaledar-adrak', taste: 'spicy' }
  ],
  'rajasthani-specials': [
    { name: 'Royal Marwadi Kair Sangri', hindiName: 'शाही कैर सांगरी का अचार', slug: 'kair-sangri-pickle', taste: 'rajasthani' },
    { name: 'Marwadi Gunda / Lesua Pickle', hindiName: 'मारवाड़ी गुंदा / लसोड़ा अचार', slug: 'marwadi-gunda-pickle', taste: 'rajasthani' },
    { name: 'Bikaneri Moong Dal Papad', hindiName: 'बीकानेरी मूंग दाल पापड़', slug: 'bikaneri-papad', taste: 'rajasthani' },
    { name: 'Shahi Achar Masala Mix', hindiName: 'शाही अचार का मसाला', slug: 'shahi-achar-masala', taste: 'rajasthani' }
  ]
};

export const getCategories = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const rawCategories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });
      const categories = rawCategories.map(cat => {
        const obj = cat.toObject ? cat.toObject() : { ...cat };
        if (!obj.subCategories || obj.subCategories.length === 0) {
          const matchKey = Object.keys(defaultSubCategoriesMap).find(k => 
            k === obj.slug || 
            k.replace(/-pickles?$/, '') === obj.slug.replace(/-pickles?$/, '')
          );
          if (matchKey) {
            obj.subCategories = defaultSubCategoriesMap[matchKey];
          } else {
            obj.subCategories = [];
          }
        }
        return obj;
      });

      return res.json({
        success: true,
        categories
      });
    }
    res.json({
      success: true,
      categories: sampleCategories
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, hindiName, slug, description, image, displayOrder, subCategories } = req.body;
    const catSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');
    const category = await Category.create({
      name,
      hindiName,
      slug: catSlug,
      description,
      image,
      displayOrder: displayOrder || 0,
      subCategories: Array.isArray(subCategories) ? subCategories : []
    });
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const filter = isObjectId ? { _id: id } : { slug: id };

    const category = await Category.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const filter = isObjectId ? { _id: id } : { slug: id };

    const category = await Category.findOneAndDelete(filter);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

