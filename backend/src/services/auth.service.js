const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userRepository } = require('../repositories/user.repository');
const { AppError } = require('../types/AppError');
const { env } = require('../config/env');

const SALT_ROUNDS = 10;
const JWT_EXPIRY = '24h';

class AuthService {
  async register(dto) {
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) {
      throw new AppError('Email already registered', 409);
    }
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    return userRepository.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? 'USER',
    });
  }

  async login(dto) {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new AppError('Invalid credentials', 401);
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}

const authService = new AuthService();
module.exports = { AuthService, authService };
