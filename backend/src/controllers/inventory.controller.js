const { inventoryService } = require('../services/inventory.service');

class InventoryController {
  async purchase(req, res, next) {
    try {
      const vehicle = await inventoryService.purchaseVehicle(req.params.id);
      res.status(200).json({ message: 'Purchase successful', vehicle });
    } catch (error) {
      next(error);
    }
  }

  async restock(req, res, next) {
    try {
      const vehicle = await inventoryService.restockVehicle(req.params.id, req.body.quantity);
      res.status(200).json({ message: 'Restock successful', vehicle });
    } catch (error) {
      next(error);
    }
  }
}

const inventoryController = new InventoryController();
module.exports = { InventoryController, inventoryController };
