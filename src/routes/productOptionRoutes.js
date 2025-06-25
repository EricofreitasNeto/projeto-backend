
const express = require('express');
const router = express.Router();
const controller = require('../controllers/productOptionController');
const authenticateJWT = require('../middleware/authMiddleware');

// 🔓 Públicas
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/',  controller.create);
// 🔐 Protegidas
//router.post('/', authenticateJWT, controller.create);
router.put('/:id', authenticateJWT, controller.update);
router.delete('/:id', authenticateJWT, controller.remove);

module.exports = router;