import { Request, Response, NextFunction } from 'express';
import { inventoryService } from '../services/inventory.service';

export class InventoryController {
  async purchase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await inventoryService.purchaseVehicle(req.params['id']!);
      res.status(200).json({ message: 'Purchase successful', vehicle });
    } catch (error) {
      next(error);
    }
  }

  async restock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await inventoryService.restockVehicle(req.params['id']!, req.body.quantity);
      res.status(200).json({ message: 'Restock successful', vehicle });
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();
