import { Request, Response, NextFunction } from 'express';
import { vehicleService } from '../services/vehicle.service';
import { SearchVehicleFilters } from '../validators/vehicle.validator';

export class VehicleController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicles = await vehicleService.getAllVehicles();
      res.status(200).json(vehicles);
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { make, model, category, minPrice, maxPrice } = req.query as Record<string, string>;

      const filters: SearchVehicleFilters = {
        ...(make && { make }),
        ...(model && { model }),
        ...(category && { category }),
        ...(minPrice && { minPrice: parseFloat(minPrice) }),
        ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
      };

      const vehicles = await vehicleService.searchVehicles(filters);
      res.status(200).json(vehicles);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.createVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.updateVehicle(req.params['id']!, req.body);
      res.status(200).json(vehicle);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await vehicleService.deleteVehicle(req.params['id']!);
      res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const vehicleController = new VehicleController();
