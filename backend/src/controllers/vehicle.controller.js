const { vehicleService } = require('../services/vehicle.service');

class VehicleController {
  async getAll(req, res, next) {
    try {
      const vehicles = await vehicleService.getAllVehicles();
      res.status(200).json(vehicles);
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const { make, model, category, minPrice, maxPrice } = req.query;
      const filters = {
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

  async create(req, res, next) {
    try {
      const vehicle = await vehicleService.createVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
      res.status(200).json(vehicle);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await vehicleService.deleteVehicle(req.params.id);
      res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

const vehicleController = new VehicleController();
module.exports = { VehicleController, vehicleController };
