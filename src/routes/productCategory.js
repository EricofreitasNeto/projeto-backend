const express = require('express');
const router = express.Router();

const { ProductCategory } = require('../models/ProductCategory'); // ajuste o caminho se necessário

// Listar todos os vínculos
router.get('/', async (req, res) => {
  try {
    const associations = await ProductCategory.findAll();
    res.json(associations);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar associações' });
  }
});

// Criar um novo vínculo
router.post('/', async (req, res) => {
  const { product_id, category_id } = req.body;
  try {
    const newLink = await ProductCategory.create({ product_id, category_id });
    res.status(201).json(newLink);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar associação' });
  }
});

// Remover vínculo
router.delete('/', async (req, res) => {
  const { product_id, category_id } = req.body;
  try {
    const deleted = await ProductCategory.destroy({
      where: { product_id, category_id }
    });
    if (deleted) {
      res.json({ message: 'Associação removida com sucesso' });
    } else {
      res.status(404).json({ error: 'Associação não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover associação' });
  }
});

module.exports = router;