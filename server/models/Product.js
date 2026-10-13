import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true }, // e.g. "200g", "350g", "500g", "1kg"
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 50 },
  sku: { type: String, default: '' }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  hindiName: { type: String, default: '' },
  slug: { type: String, required: true, unique: true, lowercase: true },
  category: { type: String, required: true }, // Category slug or name
  categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  images: [{ type: String, required: true }],
  variants: [variantSchema],
  spiceLevel: { 
    type: String, 
    enum: ['Mild', 'Medium', 'Spicy', 'Extra Spicy'], 
    default: 'Medium' 
  },
  ingredients: [{ type: String }],
  allergenInfo: { type: String, default: 'Contains Mustard. Handcrafted in a traditional kitchen without artificial preservatives.' },
  storageInstructions: { type: String, default: 'Store in a cool, dry place. Keep covered with oil. Use only clean, dry spoons.' },
  shelfLife: { type: String, default: '12 Months from date of packaging' },
  oilType: { type: String, default: 'Kachi Ghani Mustard Oil (सरसों का तेल)' },
  traditionNotes: { type: String, default: 'Slow sun-cured in traditional ceramic martabans for authentic aged flavour.' },
  pairWith: [{ type: String }],
  tags: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  numReviews: { type: Number, default: 0 },
  isBestSeller: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);

