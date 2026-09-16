const jwt = require('jsonwebtoken');

/**
 * Extract Bearer token from Authorization header
 */
function extractBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
}

const protect = (req, res, next) => {
  // Accept token from cookie, Authorization header, OR query parameter
  const token = req.cookies.jwt || req.cookies.token || extractBearerToken(req) || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id, role, etc.
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.cookies.jwt || req.cookies.token || extractBearerToken(req) || req.query.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      // ignore invalid token in optionalAuth
    }
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, optionalAuth, adminOnly };
