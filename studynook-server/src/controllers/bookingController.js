const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

// Helper to convert "HH:MM" to total minutes from midnight
const toMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * @desc    Book a study room
 * @route   POST /api/bookings
 * @access  Private (Student/User)
 */
const createBooking = async (req, res, next) => {
  try {
    const { roomId, date, startTime, endTime, specialNote } = req.body;

    if (!roomId || !date || !startTime || !endTime) {
      res.status(400);
      throw new Error('Please provide room, date, start time, and end time');
    }

    // Verify room exists
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error('Study room not found');
    }

    // Validate booking date: must be today or in the future
    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      res.status(400);
      throw new Error('Booking date must be today or a future date');
    }

    // Convert times to minutes to validate and compute cost
    const startMins = toMinutes(startTime);
    const endMins = toMinutes(endTime);

    if (startMins >= endMins) {
      res.status(400);
      throw new Error('End time must be after the start time');
    }

    const durationHours = (endMins - startMins) / 60;
    if (durationHours < 1) {
      res.status(400);
      throw new Error('Minimum booking duration is 1 hour');
    }

    // --- TIME-CONFLICT DETECTION (ADVANCED LOGIC) ---
    // Fetch all confirmed bookings for the same room and date
    const existingBookings = await Booking.find({
      roomId,
      date,
      status: 'confirmed',
    });

    // Check for overlapping slots: (requestedStart < bookedEnd) && (requestedEnd > bookedStart)
    for (const booked of existingBookings) {
      const bookedStart = toMinutes(booked.startTime);
      const bookedEnd = toMinutes(booked.endTime);

      if (startMins < bookedEnd && endMins > bookedStart) {
        res.status(400);
        throw new Error(
          `Time conflict detected: The room is already booked from ${booked.startTime} to ${booked.endTime} on this date.`
        );
      }
    }

    // Calculate total cost
    const totalCost = durationHours * room.hourlyRate;

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      roomId,
      date,
      startTime,
      endTime,
      totalCost,
      specialNote: specialNote || '',
      status: 'confirmed',
    });

    // --- MANAGE USER BOOKINGS ARRAY & ROOM COUNT (ADVANCED REQUIREMENT) ---
    // 1. $push booking ID into User's bookings array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { bookings: booking._id },
    });

    // 2. $inc room's bookingCount
    await Room.findByIdAndUpdate(roomId, {
      $inc: { bookingCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Room booked successfully!',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get bookings of the logged-in user
 * @route   GET /api/bookings/mine
 * @access  Private (Logged-in User)
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('roomId', 'name imageUrl floor hourlyRate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a booking (Private - Owner of booking only)
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Verify ownership
    if (booking.userId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('You are not authorized to cancel this booking');
    }

    // Check if status is already cancelled
    if (booking.status === 'cancelled') {
      res.status(400);
      throw new Error('Booking is already cancelled');
    }

    // Check booking date rules: Must be in the future (today or later)
    const todayStr = new Date().toISOString().split('T')[0];
    const nowMins = toMinutes(new Date().toTimeString().slice(0, 5));

    if (booking.date < todayStr) {
      res.status(400);
      throw new Error('Cannot cancel a booking from a past date');
    }

    if (booking.date === todayStr) {
      const startMins = toMinutes(booking.startTime);
      if (startMins <= nowMins) {
        res.status(400);
        throw new Error('Cannot cancel a booking that has already started or passed today');
      }
    }

    // Update status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    // --- CLEAN UP USER BOOKINGS ARRAY & DECREMENT ROOM COUNT ---
    // 1. $pull the booking ID from the user's bookings array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { bookings: booking._id },
    });

    // 2. $inc room's bookingCount by -1
    await Room.findByIdAndUpdate(booking.roomId, {
      $inc: { bookingCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};
