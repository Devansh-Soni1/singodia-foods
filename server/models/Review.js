import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, default: '' },
  comment: { type: String, required: true },
  location: { type: String, default: 'India' },
  isVerifiedBuyer: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);

