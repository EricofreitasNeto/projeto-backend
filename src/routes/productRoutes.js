const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /v1/product/
router.get('/', productController.listProducts);

// GET /v1/product/:id
router.get('/:id', productController.getProductById);

// POST /v1/product/
router.post('/', productController.createProduct);

// PUT /v1/product/:id
router.put('/:id', productController.updateProduct);

// DELETE /v1/product/:id
router.delete('/:id', productController.deleteProduct);

module.exports = router;