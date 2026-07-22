import { vehicleRepository } from '../repositories/vehicle.repository';
import { AppError } from '../types/AppError';

export class InventoryService {
  async purchaseVehicle(vehicleId: string) {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    if (vehicle.quantity === 0) {
      throw new AppError('Vehicle is out of stock', 400);
    }
    return vehicleRepository.decrementQuantity(vehicleId);
  }

  async restockVehicle(vehicleId: string, quantity: number) {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    return vehicleRepository.incrementQuantity(vehicleId, quantity);
  }
}

export const inventoryService = new InventoryService();
