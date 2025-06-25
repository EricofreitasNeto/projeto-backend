const express = require('express');
const router = express.Router();
const productImageController = require('../controllers/productImageController');

router.get('/', productImageController.index);
router.get('/:id', productImageController.show);
router.post('/', productImageController.create);
router.put('/:id', productImageController.update);
router.delete('/:id', productImageController.destroy);

module.exports = router;