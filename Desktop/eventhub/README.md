# EventHub - Event Booking System

EventHub is a full-stack MERN application that allows users to browse events, book tickets, and manage their bookings online. The system also provides admin functionality to manage events, pricing, and availability.

This project was built as part of an assignment to demonstrate full-stack development using React, Node.js, Express, and MongoDB.

## Features

### User Features
	•	Browse and search events
	•	View event details (date, venue, price, availability)
	•	User authentication (register & login)
	•	Book tickets using Stripe (test mode)
	•	View booked events under My Bookings
	•	Responsive UI for desktop and mobile
### Admin Features
	•	Create, update, and delete events
	•	Manage ticket pricing and availability
	•	View all user bookings

## Tech Stack

### Backend
- **Node.js** (v18.x or higher)
- **Express.js** (v4.18.2)
- **MongoDB** (v6.x or higher)
- **Mongoose** (v8.0.3)
- **JWT** (v9.0.2) - Authentication
- **Stripe** (v14.9.0) - Payment processing
- **bcryptjs** (v2.4.3) - Password hashing
- **dotenv** (v16.3.1) - Environment variables

### Frontend
- **React** (v18.2.0)
- **React Router DOM** (v6.20.1) - Routing
- **Axios** (v1.6.2) - HTTP client
- **Stripe React** (v2.4.0) - Stripe integration
- **React Toastify** (v9.1.3) - Notifications
- **date-fns** (v2.30.0) - Date formatting

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6.x or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Stripe Account** - [Sign up](https://stripe.com/) (for payment processing)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eventhub
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventhub
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
```

**Important Notes:**
- Replace `MONGO_URI` with your MongoDB connection string (local or cloud)
- Generate a strong random string for `JWT_SECRET`
- Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- For webhook secret, set up a webhook endpoint in Stripe Dashboard pointing to `http://localhost:5000/api/payments/webhook` (use ngrok for local testing)

Start the backend server:

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

**Note:** The API URL should include `/api` at the end as the frontend makes requests to `/api/*` endpoints.

**Note:** Replace with your Stripe Publishable Key from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

Start the frontend development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
eventhub/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── eventController.js # Event CRUD operations
│   │   ├── bookingController.js # Booking management
│   │   ├── paymentController.js # Stripe integration
│   │   └── notificationController.js # Notifications
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── errorHandler.js    # Error handling
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Event.js           # Event schema
│   │   └── Booking.js         # Booking schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── eventRoutes.js     # Event endpoints
│   │   ├── bookingRoutes.js   # Booking endpoints
│   │   ├── paymentRoutes.js   # Payment endpoints
│   │   └── notificationRoutes.js # Notification endpoints
│   ├── utils/
│   │   └── generateToken.js   # JWT token generation
│   ├── server.js              # Express server setup
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js      # Navigation component
│   │   │   ├── PrivateRoute.js # Protected routes
│   │   │   └── AdminRoute.js  # Admin-only routes
│   │   ├── context/
│   │   │   └── AuthContext.js  # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.js        # Homepage
│   │   │   ├── Events.js      # Events listing
│   │   │   ├── EventDetails.js # Event detail page
│   │   │   ├── Login.js       # Login page
│   │   │   ├── Register.js    # Registration page
│   │   │   ├── Booking.js     # Booking page
│   │   │   ├── MyBookings.js  # User bookings
│   │   │   └── AdminDashboard.js # Admin panel
│   │   ├── services/
│   │   │   └── api.js         # API configuration
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Users can:
- Register with name, email, password, and optional phone number
- Login with email and password
- Access protected routes with valid JWT tokens
- Admins have elevated permissions for event management

## Payment Processing

Payment processing is handled through Stripe:
1. User creates a booking
2. Payment intent is created on the backend
3. User completes payment using Stripe Elements
4. Payment is verified and booking is confirmed
5. Event ticket availability is updated automatically

**Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future expiry date, any CVC, and any ZIP code

## Booking Flow

1. User browses events and selects an event
2. User clicks "Book Now" and is redirected to booking page
3. User selects number of tickets and enters attendee details
4. User proceeds to payment
5. Payment is processed via Stripe
6. Booking is confirmed and tickets are reserved
7. User receives notification and can view booking in "My Bookings"

## Admin Access

To create an admin user, you can either:
1. Manually update the user document in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```
2. Or modify the registration logic to allow admin creation during development

## Notifications

The system includes a notification system for:
- Booking confirmations
- Event reminders (can be extended)
- Event updates

Notifications are stored in the user document and can be accessed via the API.

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Testing the Application

### 1. Create a Test User
- Register a new account through the frontend
- Login with your credentials

### 2. Create an Admin User (via MongoDB)
```javascript
use eventhub
db.users.insertOne({
  name: "Admin User",
  email: "admin@eventhub.com",
  password: "$2a$10$...", // Hashed password
  role: "admin"
})
```

### 3. Create Test Events
- Login as admin
- Navigate to Admin Dashboard
- Create events with various categories and pricing

### 4. Test Booking Flow
- Browse events as a regular user
- Select an event and book tickets
- Complete payment with test card
- Verify booking appears in "My Bookings"

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod` or start MongoDB service
- Check `MONGO_URI` in `.env` file
- Verify MongoDB is accessible on the specified port

**JWT Authentication Error:**
- Verify `JWT_SECRET` is set in `.env`
- Ensure token is being sent in Authorization header

**Stripe Payment Error:**
- Verify Stripe keys are correct
- Check Stripe dashboard for API errors
- Ensure webhook endpoint is configured (for production)

### Frontend Issues

**API Connection Error:**
- Verify backend server is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure CORS is enabled in backend

**Stripe Payment Form Not Loading:**
- Verify `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set
- Check browser console for errors
- Ensure Stripe keys match (test/live mode)

## Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventhub
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Update `MONGO_URI` with your cloud database connection string
3. Set environment variables on your hosting platform (Heroku, AWS, etc.)
4. Deploy to your preferred Node.js hosting service

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `build` folder to hosting service (Netlify, Vercel, etc.)
3. Update `REACT_APP_API_URL` to point to your deployed backend
4. Update `REACT_APP_STRIPE_PUBLISHABLE_KEY` with production keys


## Author

Layeba Irshad

## Acknowledgments

- Stripe for payment processing
- MongoDB for database
- React team for the amazing framework
- All open-source contributors

## Notes

This project is intended for learning and evaluation purposes.
For production use, additional security and optimizations would be required.
