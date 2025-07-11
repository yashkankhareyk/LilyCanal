<<<<<<< HEAD
# lilycanal.com - Beauty Affiliate Product Website

A fully functional beauty affiliate product website built with React.js and Node.js. Features a beautiful, responsive design with admin panel for product management.

## Features

### Frontend
- **Responsive Product Grid**: Beautiful 4-column responsive layout that adapts to all screen sizes
- **Product Cards**: Elegant cards with hover effects and affiliate link integration
- **Sale Banner**: Eye-catching promotional banner with customizable messaging
- **Modern Design**: Clean, minimalist design with premium typography and animations
- **Mobile Optimized**: Fully responsive design for all devices

### Admin Panel
- **Secure Authentication**: JWT-based admin login system
- **Product Management**: Full CRUD operations for products
- **Image Upload**: Support for product image uploads
- **Intuitive Dashboard**: Easy-to-use interface for managing products

### Backend
- **RESTful API**: Express.js backend with MongoDB integration
- **Authentication**: Secure JWT-based authentication
- **File Upload**: Multer integration for image uploads
- **CORS Enabled**: Cross-origin resource sharing support

## Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, In-memory storage
- **Authentication**: JWT, bcryptjs
- **File Upload**: Multer
- **Icons**: Lucide React
- **Styling**: Tailwind CSS, Google Fonts

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lilycanal-beauty-affiliate
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   npm run install-server
   ```

4. **Run the development servers**
   
   **Frontend (Terminal 1):**
   ```bash
   npm run dev
   ```
   
   **Backend (Terminal 2):**
   ```bash
   npm run server
   ```

   Note: The application now uses in-memory storage instead of MongoDB, so no database setup is required.
## Usage

### Admin Access
- Navigate to `/admin` to access the admin login
- Default credentials:
  - Email: `admin@lilycanal.com`
  - Password: `admin123`

### Product Management
- Add new products with images, descriptions, prices, and affiliate links
- Edit existing products
- Delete products (soft delete - sets isActive to false)
- View all products in a clean table format

### Customer Experience
- Browse products in a beautiful grid layout
- Click on any product to be redirected to the affiliate link
- Responsive design works on all devices
- Fast loading with optimized images

## API Endpoints

- `GET /api/products` - Get all active products
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)
- `POST /api/auth/login` - Admin login
- `POST /api/upload` - Upload product image (admin only)

## Database Schema

### Product
```javascript
{
  _id: String (auto-generated),
  name: String (required),
  description: String (required),
  price: String (required),
  imageUrl: String (required),
  affiliateLink: String (required),
  brand: String (optional),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin
```javascript
{
  _id: String (auto-generated),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

This application is ready for deployment on platforms like:
- **Render** (recommended for full-stack apps)
- **Vercel** (frontend only)
- **Railway**
- **Heroku**

### Environment Variables for Production
Optional environment variables for your deployment platform:
- `JWT_SECRET` - A secure secret key for JWT tokens (defaults to 'your-secret-key')
- `PORT` - Server port (usually set automatically, defaults to 5000)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- File upload restrictions
- Admin-only routes protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
=======
# Ashwini-jadhav
>>>>>>> 530e643813d5f5f22da4b7a1328673b6091eef71
