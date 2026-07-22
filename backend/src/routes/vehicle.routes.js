const { Router } = require('express');
const { vehicleController } = require('../controllers/vehicle.controller');
const { inventoryController } = require('../controllers/inventory.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createVehicleSchema, updateVehicleSchema, restockSchema } = require('../validators/vehicle.validator');

const router = Router();

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
router.post('/:id/purchase', authenticate, (req, res, next) =>
  inventoryController.purchase(req, res, next)
);
router.post('/:id/restock', authenticate, requireAdmin, validate(restockSchema), (req, res, next) =>
  inventoryController.restock(req, res, next)
);

module.exports = router;
