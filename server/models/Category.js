import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  hindiName: { type: String, default: '' },
  slug: { type: String, required: true, lowercase: true, trim: true },
  taste: { type: String, default: 'tangy' },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { _id: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  hindiName: { type: String, default: '' },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  subCategories: [subCategorySchema]
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);

