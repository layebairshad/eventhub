const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    tickets: {
      type: Number,
      required: [true, 'Please specify number of tickets'],
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentIntentId: {
      type: String,
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal'],
      default: 'stripe',
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true,
    },
    attendeeDetails: [
      {
        name: String,
        email: String,
      },
    ],
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'refunded'],
      default: 'confirmed',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique booking reference
bookingSchema.pre('save', async function (next) {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.bookingReference = `EVT-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

