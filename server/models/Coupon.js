import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, default: '' },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true }, // e.g. 15 for 15% or 100 for ₹100
  minOrderValue: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number, default: 500 },
  validFrom: { type: Date, default: Date.now },
  validTill: { type: Date },
  usageLimit: { type: Number, default: 1000 },
  timesUsed: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

