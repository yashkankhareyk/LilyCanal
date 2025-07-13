import express from 'express';
<<<<<<< HEAD
import cors from 'cors';
import express from 'express';
=======
>>>>>>> a2d120ed52ef115acb064261cf6d30e264fe2039
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import configurations
import cloudinary from './config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import Admin from './models/Admin.js';

// Validate environment variables
const requiredEnvVars = [
  'MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET',
  'DEFAULT_ADMIN_EMAIL', 'DEFAULT_ADMIN_PASSWORD'
];

requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    console.error(`❌ Missing required environment variable: ${env}`);
    process.exit(1);
  } else if (env === 'JWT_SECRET' && process.env[env] === 'your-secret-key') {
    console.error(`❌ Critical: Change default JWT_SECRET immediately!`);
    process.exit(1);
  }
});

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://lily-canal.vercel.app',
  'https://lily-canal-git-main-yashkankhareyks-projects.vercel.app',
  'https://lily-canal-hv1bp68p6-yashkankhareyks-projects.vercel.app',
  'https://lily-canal-yashkankhareyks-projects.vercel.app'
];

<<<<<<< HEAD
// 1. CORS Middleware - MUST BE FIRST!
=======
// 1. CORS MIDDLEWARE - MUST BE FIRST!
>>>>>>> a2d120ed52ef115acb064261cf6d30e264fe2039
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
<<<<<<< HEAD
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
=======
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle preflight requests
>>>>>>> a2d120ed52ef115acb064261cf6d30e264fe2039
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});

// Security Middleware
app.use(limiter);
<<<<<<< HEAD
app.use(helmet());
app.enable('trust proxy');
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} [${req.ip}]`);
=======
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  }
}));
app.enable('trust proxy');
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path} [Origin: ${req.headers.origin}]`);
>>>>>>> a2d120ed52ef115acb064261cf6d30e264fe2039
  next();
});

// Health check endpoint (MUST BE BEFORE OTHER ROUTES)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
<<<<<<< HEAD
=======
  });
});

// Test endpoint
app.get('/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS test successful!', 
    origin: req.headers.origin,
    headers: req.headers
>>>>>>> a2d120ed52ef115acb064261cf6d30e264fe2039
  });
});

// Test endpoint
app.get('/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS test successful!', 
    origin: req.headers.origin,
    headers: req.headers
  });
});
// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      message: 'Login successful',
      admin: { email: admin.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Product routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: err.message
    });
  }
});

app.post('/api/products', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, affiliateLink, brand } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const imageUrl = req.file?.path || req.body.imageUrl;
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      cloudinaryId: req.file?.filename || '',
      affiliateLink,
      brand
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: err.message
    });
  }
});

app.put('/api/products/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, affiliateLink, brand } = req.body;

    const updateData = {
      name,
      description,
      price,
      affiliateLink,
      brand,
      updatedAt: new Date()
    };

    if (req.file) {
      updateData.imageUrl = req.file.path;
      updateData.cloudinaryId = req.file.filename;
    } else if (req.body.imageUrl) {
      updateData.imageUrl = req.body.imageUrl;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true
    });
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: err.message
    });
  }
});

app.delete('/api/products/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: err.message
    });
  }
});

// File upload route
app.post('/api/upload', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ 
      imageUrl: req.file.path, 
      cloudinaryId: req.file.filename 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('⚠️ Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    await createDefaultAdmin();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🛡️  CORS allowed for origins: ${allowedOrigins.join(', ')}`);
      console.log(`🔍 Test CORS: https://lilycanal.onrender.com/test-cors`);
      console.log(`🩺 Health check: https://lilycanal.onrender.com/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server terminated');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
