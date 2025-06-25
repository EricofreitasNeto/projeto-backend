const { ProductCategory } = require('../models');

module.exports = {
  async index(req, res) {
    try {
      const items = await ProductCategory.findAll();
      return res.json(items);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar associações' });
    }
  },

  async create(req, res) {
    try {
      const data = Array.isArray(req.body) ? req.body : [req.body];
      const inserted = await ProductCategory.bulkCreate(data);
      return res.status(201).json(inserted);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar associação' });
    }
  },

  async destroy(req, res) {
    try {
      const { product_id, category_id } = req.params;

      const deleted = await ProductCategory.destroy({
        where: { product_id, category_id }
      });

      if (deleted === 0) {
        return res.status(404).json({ error: 'Associação não encontrada' });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar associação' });
    }
  }
};