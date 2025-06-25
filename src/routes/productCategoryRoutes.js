const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.get('/', controller.index);
router.post('/', controller.create);
router.delete('/:product_id/:category_id', controller.destroy);

module.exports = router;