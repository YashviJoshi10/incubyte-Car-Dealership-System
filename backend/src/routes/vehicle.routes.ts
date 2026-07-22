import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';
import { inventoryController } from '../controllers/inventory.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createVehicleSchema, updateVehicleSchema, restockSchema } from '../validators/vehicle.validator';

const router = Router();

// Vehicle CRUD
router.get('/', authenticate, (req, res, next) => vehicleController.getAll(req, res, next));
router.get('/search', authenticate, (req, res, next) => vehicleController.search(req, res, next));
router.post('/', authenticate, requireAdmin, validate(createVehicleSchema), (req, res, next) =>
  vehicleController.create(req, res, next)
);
router.put('/:id', authenticate, requireAdmin, validate(updateVehicleSchema), (req, res, next) =>
  vehicleController.update(req, res, next)
);
router.delete('/:id', authenticate, requireAdmin, (req, res, next) =>
  vehicleController.delete(req, res, next)
);

// Inventory operations
router.post('/:id/purchase', authenticate, (req, res, next) =>
  inventoryController.purchase(req, res, next)
);
router.post('/:id/restock', authenticate, requireAdmin, validate(restockSchema), (req, res, next) =>
  inventoryController.restock(req, res, next)
);

export default router;
