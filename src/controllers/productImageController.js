const { ProductImage } = require('../models');

module.exports = {
  async index(req, res) {
    try {
      const images = await ProductImage.findAll();
      return res.json(images);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar imagens.' });
    }
  },

  async show(req, res) {
    try {
      const image = await ProductImage.findByPk(req.params.id);
      if (!image) return res.status(404).json({ error: 'Imagem não encontrada.' });
      return res.json(image);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar imagem.' });
    }
  },

  async create(req, res) {
    try {
      const image = await ProductImage.create(req.body);
      return res.status(201).json(image);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar imagem.' });
    }
  },

  async update(req, res) {
    try {
      const image = await ProductImage.findByPk(req.params.id);
      if (!image) return res.status(404).json({ error: 'Imagem não encontrada.' });

      await image.update(req.body);
      return res.json(image);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar imagem.' });
    }
  },

  async destroy(req, res) {
    try {
      const image = await ProductImage.findByPk(req.params.id);
      if (!image) return res.status(404).json({ error: 'Imagem não encontrada.' });

      await image.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar imagem.' });
    }
  }
};