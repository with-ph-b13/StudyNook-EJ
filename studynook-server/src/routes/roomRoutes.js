const express = require('express');
const {
  createRoom,
  getAllRooms,
  getLatestRooms,
  getRoomDetails,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllRooms);
router.get('/latest', getLatestRooms);
router.get('/:id', getRoomDetails);

// Protected routes
router.post('/', protect, createRoom);
router.put('/:id', protect, updateRoom);
router.delete('/:id', protect, deleteRoom);

module.exports = router;
