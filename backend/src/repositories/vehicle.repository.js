const prisma = require('../config/prisma');

class VehicleRepository {
  async findAll() {
    return prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id) {
    return prisma.vehicle.findUnique({ where: { id } });
  }

  async search(filters) {
    return prisma.vehicle.findMany({
      where: {
        ...(filters.make && { make: { contains: filters.make, mode: 'insensitive' } }),
        ...(filters.model && { model: { contains: filters.model, mode: 'insensitive' } }),
        ...(filters.category && { category: { contains: filters.category, mode: 'insensitive' } }),
        ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
          ? {
              price: {
                ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
                ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data) {
    return prisma.vehicle.create({ data });
  }

  async update(id, data) {
    return prisma.vehicle.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.vehicle.delete({ where: { id } });
  }

  async decrementQuantity(id) {
    return prisma.vehicle.update({
      where: { id },
      data: { quantity: { decrement: 1 } },
    });
  }

  async incrementQuantity(id, amount) {
    return prisma.vehicle.update({
      where: { id },
      data: { quantity: { increment: amount } },
    });
  }
}

const vehicleRepository = new VehicleRepository();
module.exports = { VehicleRepository, vehicleRepository };
