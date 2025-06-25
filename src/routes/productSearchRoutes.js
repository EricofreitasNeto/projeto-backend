const express = require('express');
const router = express.Router();
const { search } = require('../controllers/productSearchController');

router.get('/', search);

module.exports = router;