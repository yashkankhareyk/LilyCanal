import express from 'express';
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

app.set('trust proxy', 1);
// Security Middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// CORS Middleware - MUST be after helmet but before routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  validate: { trustProxy: true } // 👈 Add this option
});
app.use(limiter);

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/test-cors', (req, res) => {
  res.json({
    message: 'CORS test successful',
    yourOrigin: req.headers.origin,
    allowedOrigins: allowedOrigins,
    headers: req.headers
  });
});

// Cloudinary configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, crop: 'limit', quality: 'auto' }]
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// JWT Auth Middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create Default Admin
const createDefaultAdmin = async () => {
  try {
    const email = process.env.DEFAULT_ADMIN_EMAIL;
    const password = process.env.DEFAULT_ADMIN_PASSWORD;

    const exists = await Admin.findOne({ email });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Admin.create({ email, password: hashedPassword });
      console.log('✅ Default admin created');
    }
  } catch (err) {
    console.error('❌ Failed to create default admin:', err);
    process.exit(1);
  }
};

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
    res.status(500).json({ message: 'Server error', error: err.message });
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
    res.status(500).json({ message: 'Server error', error: err.message });
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('⚠️ Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
const startServer = async () => {
  try {
    await createDefaultAdmin();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🛡️  CORS allowed for origins: ${allowedOrigins.join(', ')}`);
      console.log(`🔍 Test endpoints:`);
      console.log(`   Health check: https://lilycanal.onrender.com/health`);
      console.log(`   CORS test: https://lilycanal.onrender.com/test-cors`);
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