const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // console.log("Auth Header:", req.headers.authorization);
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
            console.log("Token received:", token);

      // Verify token (use correct env variable name)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (includes role + level if added to JWT)
      req.user = await User.findById(decoded.id).select('-password');

      // If you want to also attach level directly from token:
      if (decoded.level) {
        req.user.level = decoded.level;
        console.log("Decoded JWT:", decoded);
        console.log("req.user:", req.user);

      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Restrict routes: only allow certain roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};


module.exports = { protect, restrictTo };