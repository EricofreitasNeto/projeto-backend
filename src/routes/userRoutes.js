const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
//const authMiddleware = require('../middleware/authMiddleware'); // opcional

// Lista todos os usuários
router.get('/', userController.listUsers); // Adicione authMiddleware se quiser proteger

// Obter usuário por ID
router.get('/:id', userController.getUserById);

// Criar novo usuário
router.post('/', userController.createUser);

// Atualizar usuário
router.put('/:id', userController.updateUser);

// Deletar usuário
router.delete('/:id', userController.deleteUser);

module.exports = router;