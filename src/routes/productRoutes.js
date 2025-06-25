const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Buscar com filtros (search inteligente)
router.get('/search', productController.search);

// CRUD básico + categorias
router.get('/', productController.listProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.deleteProduct);

module.exports = router;