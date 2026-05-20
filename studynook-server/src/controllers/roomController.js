const Room = require('../models/Room');
const Booking = require('../models/Booking');
const User = require('../models/User');

/**
 * @desc    Create a new study room
 * @route   POST /api/rooms
 * @access  Private (Owner/User)
 */
const createRoom = async (req, res, next) => {
  try {
    const { name, description, imageUrl, floor, capacity, hourlyRate, amenities } = req.body;

    if (!name || !description || !imageUrl || !floor || !capacity || !hourlyRate) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Check if room name is duplicate
    const roomExists = await Room.findOne({ name });
    if (roomExists) {
      res.status(400);
      throw new Error('A study room with this name already exists');
    }

    const room = await Room.create({
      name,
      description,
      imageUrl,
      floor,
      capacity: Number(capacity),
      hourlyRate: Number(hourlyRate),
      amenities: Array.isArray(amenities) ? amenities : [],
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Room added successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all rooms with search & filter parameters
 * @route   GET /api/rooms
 * @access  Public
 */
const getAllRooms = async (req, res, next) => {
  try {
    const { search, amenities, floor, minRate, maxRate } = req.query;

    const query = {};

    // 1. Search by name using regex (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // 2. Filter by amenities ($in operator)
    if (amenities) {
      const amenitiesList = amenities.split(',').map(a => a.trim());
      if (amenitiesList.length > 0) {
        query.amenities = { $in: amenitiesList };
      }
    }

    // 3. Filter by floor
    if (floor) {
      query.floor = floor;
    }

    // 4. Filter by hourly rate range ($gte, $lte)
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }

    const rooms = await Room.find(query).populate('owner', 'name email photoUrl');

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the latest 6 study rooms
 * @route   GET /api/rooms/latest
 * @access  Public
 */
const getLatestRooms = async (req, res, next) => {
  try {
    // Retrieve only the latest 6 rooms from the database using sort() and limit()
    const rooms = await Room.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('owner', 'name email photoUrl');

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single room details
 * @route   GET /api/rooms/:id
 * @access  Public
 */
const getRoomDetails = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('owner', 'name email photoUrl');

    if (!room) {
      res.status(404);
      throw new Error('Study room not found');
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing room (Owner Only)
 * @route   PUT /api/rooms/:id
 * @access  Private (Owner Only)
 */
const updateRoom = async (req, res, next) => {
  try {
    const { name, description, imageUrl, floor, capacity, hourlyRate, amenities } = req.body;

    let room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Study room not found');
    }

    // Verify ownership
    if (room.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('You are not authorized to update this room. Only the room owner can update it.');
    }

    // If room name is being updated, check if another room already has the same name
    if (name && name !== room.name) {
      const roomWithNameExists = await Room.findOne({ name });
      if (roomWithNameExists) {
        res.status(400);
        throw new Error('A study room with this name already exists');
      }
    }

    // Apply partial or complete updates
    room.name = name || room.name;
    room.description = description || room.description;
    room.imageUrl = imageUrl || room.imageUrl;
    room.floor = floor || room.floor;
    room.capacity = capacity !== undefined ? Number(capacity) : room.capacity;
    room.hourlyRate = hourlyRate !== undefined ? Number(hourlyRate) : room.hourlyRate;
    room.amenities = Array.isArray(amenities) ? amenities : room.amenities;

    const updatedRoom = await room.save();

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      room: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a room (Owner Only) + Cascade deletes on related bookings
 * @route   DELETE /api/rooms/:id
 * @access  Private (Owner Only)
 */
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Study room not found');
    }

    // Verify ownership
    if (room.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('You are not authorized to delete this room. Only the room owner can delete it.');
    }

    const roomId = room._id;

    // Retrieve all bookings related to this room
    const relatedBookings = await Booking.find({ roomId });
    const bookingIds = relatedBookings.map(b => b._id);

    if (bookingIds.length > 0) {
      // 1. Remove these bookings from all user bookings arrays ($pull operator)
      await User.updateMany(
        { bookings: { $in: bookingIds } },
        { $pull: { bookings: { $in: bookingIds } } }
      );

      // 2. Delete the bookings documents themselves
      await Booking.deleteMany({ roomId });
    }

    // 3. Delete the room itself
    await Room.findByIdAndDelete(roomId);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getLatestRooms,
  getRoomDetails,
  updateRoom,
  deleteRoom,
};
