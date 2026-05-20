const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room ID is required'],
    },
    date: {
      type: String, // Store YYYY-MM-DD
      required: [true, 'Booking date is required'],
    },
    startTime: {
      type: String, // Store HH:MM (e.g., "08:00")
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, // Store HH:MM (e.g., "10:00")
      required: [true, 'End time is required'],
    },
    totalCost: {
      type: Number,
      required: [true, 'Total cost is required'],
      min: [0, 'Total cost cannot be negative'],
    },
    specialNote: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
