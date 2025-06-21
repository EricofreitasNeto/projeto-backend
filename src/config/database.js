const { Sequelize } = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {

host: process.env.DB_HOST,

dialect: 'mysql',

logging: false, // Desativa os logs se não quiser ver as queries

});

module.exports = sequelize;