const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /v1/category/
router.get('/', categoryController.listCategories);

// GET /v1/category/:id
router.get('/:id', categoryController.getCategoryById);

// POST /v1/category/
router.post('/', categoryController.createCategory);

// PUT /v1/category/:id
router.put('/:id', categoryController.updateCategory);

// DELETE /v1/category/:id
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;