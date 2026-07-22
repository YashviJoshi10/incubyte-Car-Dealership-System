const { vehicleRepository } = require('../repositories/vehicle.repository');
const { AppError } = require('../types/AppError');

class InventoryService {
  async purchaseVehicle(vehicleId) {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    if (vehicle.quantity === 0) {
      throw new AppError('Vehicle is out of stock', 400);
    }
    return vehicleRepository.decrementQuantity(vehicleId);
  }

  async restockVehicle(vehicleId, quantity) {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    return vehicleRepository.incrementQuantity(vehicleId, quantity);
  }
}

const inventoryService = new InventoryService();
module.exports = { InventoryService, inventoryService };
