# Elysian Backend API

A comprehensive backend API for the Elysian Hotels & Resorts booking system built with Express.js, TypeScript, and Prisma.

## Features

- 🔐 **Authentication**: JWT-based user authentication with signup/login
- 🏨 **Hotels Management**: CRUD operations for hotels and rooms
- 📅 **Booking System**: Complete reservation management with availability checking
- 🎯 **Offers & Promotions**: Special deals and discount management
- ⭐ **Testimonials**: Customer reviews and feedback system
- 🛡️ **Security**: Rate limiting, CORS, helmet, and input validation
- 📊 **Database**: SQLite with Prisma ORM

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - User logout (protected)

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID

### Rooms
- `GET /api/rooms` - Get all rooms (with filtering)
- `GET /api/rooms/:id` - Get room by ID
- `GET /api/rooms/:id/availability` - Check room availability

### Bookings (Protected)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `PATCH /api/bookings/:id` - Update booking

### Offers
- `GET /api/offers` - Get all offers
- `GET /api/offers/:id` - Get offer by ID
- `GET /api/offers/active/list` - Get active offers

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials/:id` - Get testimonial by ID
- `GET /api/testimonials/featured/list` - Get featured testimonials
- `GET /api/testimonials/rating/:rating` - Get testimonials by rating

### Health Check
- `GET /health` - Server health status

## Database Schema

The API uses the following main entities:

- **User**: Customer information and authentication
- **Hotel**: Hotel properties and locations
- **Room**: Individual rooms with pricing and amenities
- **Booking**: Reservation records with payment details
- **Offer**: Promotional deals and discounts
- **Testimonial**: Customer reviews and ratings

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run generate` - Generate Prisma client
- `npm run seed` - Seed database with sample data

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication

## Error Handling

The API includes comprehensive error handling with:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## Development

The backend is configured for development with:
- TypeScript compilation
- Hot reload with nodemon
- Comprehensive logging
- Database seeding for testing

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use a production database (PostgreSQL recommended)
3. Set secure JWT secrets
4. Configure proper CORS origins
5. Set up SSL/HTTPS
6. Use environment-specific configurations

## API Documentation

The API follows RESTful conventions and returns JSON responses. All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

