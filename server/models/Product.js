// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  cloudinaryId: String,
  affiliateLink: String,
  brand: String,
  isActive: { type: Boolean, default: true }
});

// Change to default export
export default mongoose.model('Product', productSchema);
