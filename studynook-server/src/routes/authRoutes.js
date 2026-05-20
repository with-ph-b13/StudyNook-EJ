const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  googleMockLogin,
  initiateGoogleLogin,
  handleGoogleCallback,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/google-mock', googleMockLogin);
router.get('/google', initiateGoogleLogin);
router.get('/callback/google', handleGoogleCallback);
router.get('/me', protect, getMe);

module.exports = router;
