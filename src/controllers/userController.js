const bcrypt = require('bcrypt');
const { User } = require('../models');

// Obter usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] } // Não retorna a senha
    });

    if (!user) return res.status(404).json({ error: 'Not Found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar usuário
exports.createUser = async (req, res) => {
  try {
    const { firstname, surname, email, password } = req.body;

    // Validação de campos básicos
    if (!firstname || !surname || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Se ativar autenticação

    const user = await User.create({
      firstname,
      surname,
      email,
      password // hashedPassword
    });

    res.status(201).json({
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.status(204).end(); // Atualizado com sucesso, sem corpo de resposta
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar usuário
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.status(204).end(); // Deletado com sucesso
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar todos os usuários
exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Protege a senha
    });
    res.status(200).json(users,+'OK');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};