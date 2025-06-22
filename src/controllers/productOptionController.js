const { ProductOption } = require('../models');

// Criar nova opção de produto
exports.create = async (req, res) => {
  try {
    const option = await ProductOption.create(req.body);
    res.status(201).json(option);
  } catch (error) {
    console.error('Erro ao criar opção:', error);
    res.status(500).json({ error: 'Falha ao criar opção' });
  }
};

// Listar todas as opções
exports.getAll = async (req, res) => {
  try {
    const options = await ProductOption.findAll();
    res.json(options);
  } catch (error) {
    console.error('Erro ao buscar opções:', error);
    res.status(500).json({ error: 'Erro ao listar opções' });
  }
};

// Buscar opção por ID
exports.getById = async (req, res) => {
  try {
    const option = await ProductOption.findByPk(req.params.id);
    if (!option) return res.status(404).json({ error: 'Opção não encontrada' });
    res.json(option);
  } catch (error) {
    console.error('Erro ao buscar opção:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

// Atualizar uma opção
exports.update = async (req, res) => {
  try {
    const option = await ProductOption.findByPk(req.params.id);
    if (!option) return res.status(404).json({ error: 'Opção não encontrada' });

    await option.update(req.body);
    res.json(option);
  } catch (error) {
    console.error('Erro ao atualizar opção:', error);
    res.status(500).json({ error: 'Erro ao atualizar opção' });
  }
};

// Excluir uma opção
exports.remove = async (req, res) => {
  try {
    const option = await ProductOption.findByPk(req.params.id);
    if (!option) return res.status(404).json({ error: 'Opção não encontrada' });

    await option.destroy();
    res.json({ message: 'Opção excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir opção:', error);
    res.status(500).json({ error: 'Erro ao excluir opção' });
  }
};