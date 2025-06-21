const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Cadastro de novo usuário
exports.register = async (req, res) => {
  try {
    const { firstname, surname, email, confirmEmail, password } = req.body;

    if (!firstname || !surname || !email || !confirmEmail || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (email !== confirmEmail) {
      return res.status(400).json({ error: 'Os e-mails não coincidem' });
    }

    const user = await User.create({
      firstname,
      surname,
      email: email.toLowerCase(),
      password
    });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const user = await User.scope(null).findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login realizado com sucesso', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};