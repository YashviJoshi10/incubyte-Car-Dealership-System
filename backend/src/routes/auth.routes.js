const { Router } = require('express');
const { authController } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const router = Router();

router.post('/register', validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);
router.post('/login', validate(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

module.exports = router;
