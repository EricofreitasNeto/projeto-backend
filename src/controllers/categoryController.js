const { Category } = require('../models');

exports.listCategories = async (req, res) => {
  try {
    let {
      limit = 12,
      page = 1,
      fields,
      use_in_menu
    } = req.query;

    limit = Number(limit);
    page = Number(page);

    if (isNaN(limit) || (limit !== -1 && limit < 1)) {
      return res.status(400).json({ error: 'Parâmetro "limit" inválido' });
    }

    if (limit !== -1 && (isNaN(page) || page < 1)) {
      return res.status(400).json({ error: 'Parâmetro "page" inválido' });
    }

    // Selecionar campos retornados
    const attributes = fields ? fields.split(',') : undefined;

    // Filtro de uso no menu
    const where = {};
    if (use_in_menu !== undefined) {
      if (use_in_menu !== 'true' && use_in_menu !== 'false') {
        return res.status(400).json({ error: 'Parâmetro "use_in_menu" deve ser true ou false' });
      }
      where.use_in_menu = use_in_menu === 'true';
    }

    if (limit === -1) {
      const data = await Category.findAll({ attributes, where });
      return res.status(200).json({
        data,
        total: data.length,
        limit: -1,
        page: 1
      });
    }

    const offset = (page - 1) * limit;
    const { rows: data, count: total } = await Category.findAndCountAll({
      where,
      attributes,
      limit,
      offset
    });

    res.status(200).json({
      data,
      total,
      limit,
      page
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

// Obter categoria por ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar nova categoria 
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
// Atualizar categoria
exports.updateCategory = async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Categoria não encontrada' });

    const updatedCategory = await Category.findByPk(req.params.id);
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar categoria
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};