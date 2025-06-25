const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


// Inicializa a conexão com Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
);

const db = {};

// Carrega todos os modelos da pasta atual (exceto este arquivo)
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const definirModelo = require(path.join(__dirname, file));
    const modelo = definirModelo(sequelize, DataTypes);
    db[modelo.name] = modelo;
  });

// Aplica os relacionamentos se houverem
Object.values(db).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

// Anexa instância e construtor Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;