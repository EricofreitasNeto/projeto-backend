const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORTSERV || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});