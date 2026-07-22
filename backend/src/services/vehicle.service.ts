import { vehicleRepository } from '../repositories/vehicle.repository';
import { AppError } from '../types/AppError';
import { CreateVehicleDto, UpdateVehicleDto, SearchVehicleFilters } from '../validators/vehicle.validator';

export class VehicleService {
  async getAllVehicles() {
    return vehicleRepository.findAll();
  }

  async searchVehicles(filters: SearchVehicleFilters) {
    return vehicleRepository.search(filters);
  }

  async createVehicle(dto: CreateVehicleDto) {
    return vehicleRepository.create(dto);
  }

  async updateVehicle(id: string, dto: UpdateVehicleDto) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    return vehicleRepository.update(id, dto);
  }

  async deleteVehicle(id: string) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    return vehicleRepository.delete(id);
  }
}

export const vehicleService = new VehicleService();
