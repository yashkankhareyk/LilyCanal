import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: String,
  imageUrl: String,
  cloudinaryId: String, 
  affiliateLink: String,
  brand: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
