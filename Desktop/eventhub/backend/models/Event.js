const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['concert', 'conference', 'sports', 'theater', 'festival', 'workshop', 'other'],
    },
    venue: {
      name: {
        type: String,
        required: [true, 'Please add venue name'],
      },
      address: {
        type: String,
        required: [true, 'Please add venue address'],
      },
      city: {
        type: String,
        required: [true, 'Please add city'],
      },
      state: {
        type: String,
        required: [true, 'Please add state'],
      },
      zipCode: {
        type: String,
        required: [true, 'Please add zip code'],
      },
    },
    date: {
      type: Date,
      required: [true, 'Please add event date'],
    },
    time: {
      type: String,
      required: [true, 'Please add event time'],
    },
    image: {
      type: String,
      default: '',
    },
    totalTickets: {
      type: Number,
      required: [true, 'Please add total tickets'],
      min: 1,
    },
    availableTickets: {
      type: Number,
      required: [true, 'Please add available tickets'],
      min: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please add ticket price'],
      min: 0,
    },
    organizer: {
      type: String,
      required: [true, 'Please add organizer name'],
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'sold-out', 'completed'],
      default: 'active',
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Update status based on available tickets
eventSchema.pre('save', function (next) {
  if (this.availableTickets === 0 && this.status === 'active') {
    this.status = 'sold-out';
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);

