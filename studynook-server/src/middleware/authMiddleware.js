const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token and check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token' });
  }
};

module.exports = { protect };
