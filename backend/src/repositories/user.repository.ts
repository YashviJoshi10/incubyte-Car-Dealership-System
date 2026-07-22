import prisma from '../config/prisma';
import { RegisterDto } from '../validators/auth.validator';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: Omit<RegisterDto, 'role'> & { password: string; role: 'ADMIN' | 'USER' }) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
