const { vehicleRepository } = require('../repositories/vehicle.repository');
const { AppError } = require('../types/AppError');

class VehicleService {
  async getAllVehicles() {
    return vehicleRepository.findAll();
  }

  async searchVehicles(filters) {
    return vehicleRepository.search(filters);
  }

  async createVehicle(dto) {
    return vehicleRepository.create(dto);
  }

  async updateVehicle(id, dto) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    return vehicleRepository.update(id, dto);
  }

  async deleteVehicle(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    return vehicleRepository.delete(id);
  }
}

const vehicleService = new VehicleService();
module.exports = { VehicleService, vehicleService };
