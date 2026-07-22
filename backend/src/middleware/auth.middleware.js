const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { AppError } = require('../types/AppError');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized – no token provided', 401));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Forbidden – admin access required', 403));
  }
  return next();
}

module.exports = { authenticate, requireAdmin };
