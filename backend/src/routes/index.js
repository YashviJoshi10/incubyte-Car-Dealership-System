const { Router } = require('express');
const authRoutes = require('./auth.routes');
const vehicleRoutes = require('./vehicle.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);

module.exports = router;
