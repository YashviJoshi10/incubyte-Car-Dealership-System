import prisma from '../config/prisma';
import { CreateVehicleDto, UpdateVehicleDto, SearchVehicleFilters } from '../validators/vehicle.validator';

export class VehicleRepository {
  async findAll() {
    return prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.vehicle.findUnique({ where: { id } });
  }

  async search(filters: SearchVehicleFilters) {
    return prisma.vehicle.findMany({
      where: {
        ...(filters.make && {
          make: { contains: filters.make, mode: 'insensitive' },
        }),
        ...(filters.model && {
          model: { contains: filters.model, mode: 'insensitive' },
        }),
        ...(filters.category && {
          category: { contains: filters.category, mode: 'insensitive' },
        }),
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

  async create(data: CreateVehicleDto) {
    return prisma.vehicle.create({ data });
  }

  async update(id: string, data: UpdateVehicleDto) {
    return prisma.vehicle.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.vehicle.delete({ where: { id } });
  }

  async decrementQuantity(id: string) {
    return prisma.vehicle.update({
      where: { id },
      data: { quantity: { decrement: 1 } },
    });
  }

  async incrementQuantity(id: string, amount: number) {
    return prisma.vehicle.update({
      where: { id },
      data: { quantity: { increment: amount } },
    });
  }
}

export const vehicleRepository = new VehicleRepository();
