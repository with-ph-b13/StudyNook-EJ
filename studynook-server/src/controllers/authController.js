const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Set cookie options
const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // support cross-origin cookie sharing in dev/production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, photoUrl, password } = req.body;

    if (!name || !email || !photoUrl || !password) {
      res.status(400);
      throw new Error('All fields are required');
    }

    // Password validation (must be checked before submission/saving)
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const isAtLeast6Chars = password.length >= 6;

    if (!isAtLeast6Chars || !hasUppercase || !hasLowercase) {
      res.status(400);
      throw new Error(
        'Password must be at least 6 characters long, containing at least one uppercase and one lowercase letter'
      );
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      photoUrl,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful! Please login.',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photoUrl: user.photoUrl,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token (cookie)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Simulated Google login/register endpoint
 * @route   POST /api/auth/google-mock
 * @access  Public
 */
const googleMockLogin = async (req, res, next) => {
  try {
    const email = 'google.user@example.com';
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: 'Google Scholar',
        email,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
        password: 'GoogleSecretPassword123!',
      });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Google authentication successful!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Redirect to Google OAuth consent page
 * @route   GET /api/auth/google
 * @access  Public
 */
const initiateGoogleLogin = (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent('openid email profile')}` +
    `&prompt=select_account`;
  res.redirect(googleAuthUrl);
};

/**
 * @desc    Handle Google OAuth callback, exchange code, set JWT cookie, redirect user
 * @route   GET /api/auth/callback/google
 * @access  Public
 */
const handleGoogleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) {
      res.status(400);
      throw new Error('Authorization code not provided');
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Token exchange error:', tokenData);
      res.status(400);
      throw new Error('Failed to exchange code for access token');
    }

    // Fetch user profile from Google UserInfo API
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const profileData = await profileResponse.json();
    if (!profileResponse.ok || !profileData.email) {
      console.error('Google Userinfo fetch error:', profileData);
      res.status(400);
      throw new Error('Failed to retrieve user profile from Google');
    }

    const { name, email, picture } = profileData;

    // Find or create user in database
    let user = await User.findOne({ email });
    if (!user) {
      const generatedPassword = require('crypto').randomBytes(16).toString('hex') + 'G1!';
      user = await User.create({
        name: name || 'Google User',
        email,
        photoUrl: picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        password: generatedPassword,
      });
    } else if (picture && user.photoUrl !== picture) {
      user.photoUrl = picture;
      await user.save();
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, getCookieOptions());

    // Redirect to frontend client home page or relative route
    res.redirect(process.env.CLIENT_URL || '/');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  googleMockLogin,
  initiateGoogleLogin,
  handleGoogleCallback,
};

