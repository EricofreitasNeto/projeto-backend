const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota protegida com middleware JWT
router.post('/dados-secretos', authMiddleware, (req, res) => {
  res.json({ message: `Acesso autorizado, ${req.user.email}` });
});

// Rotas públicas de autenticação
router.post('/register', register);

router.post('/login', login);

module.exports = router;