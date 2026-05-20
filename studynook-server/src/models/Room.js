const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Room image URL is required'],
    },
    floor: {
      type: String,
      required: [true, 'Floor number is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Seat capacity is required'],
      min: [1, 'Capacity must be at least 1 person'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Hourly rate cannot be negative'],
    },
    amenities: {
      type: [String],
      enum: {
        values: ['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'],
        message: '{VALUE} is not a supported amenity',
      },
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Room owner is required'],
    },
    bookingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
