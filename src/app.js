require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { sequelize } = require('./models');

const app = express();

// Configuração básica de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));

// Limitar requisições para evitar ataques de força bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por IP
});
app.use(limiter);

// Logs de requisições em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Configuração do body parser com limite aumentado para uploads
app.use(bodyParser.json({
  limit: '10mb',
  extended: true
}));
app.use(bodyParser.urlencoded({
  limit: '10mb',
  extended: true
}));

// Testar conexão com o banco de dados
sequelize.authenticate()
  .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso.'))
  .catch(err => console.error('Não foi possível conectar ao banco de dados:', err));

// Rotas da API
const apiRouter = express.Router();

// Rotas públicas (sem autenticação)
const authRoutes = require('./routes/authRoutes');
const productOptionRoutes = require('./routes/productOptionRoutes');
apiRouter.use('/options', productOptionRoutes);


// Rotas protegidas (com autenticação JWT)
const authenticateJWT = require('./middleware/authMiddleware');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productSearchRoutes = require('./routes/productSearchRoutes');
//const productImageRoutes = require('./routes/imageRoutes');

apiRouter.use('/auth', authRoutes);
apiRouter.use('/user', authenticateJWT, userRoutes);
apiRouter.use('/category/search',  categoryRoutes);
apiRouter.use('/product',  productRoutes);
apiRouter.use('/product/search',  productSearchRoutes);

//apiRouter.use('/images', productImageRoutes);
app.use('/v1', apiRouter);

// Prefixo de versão para a API
/*app.use('/v1/user', userRoutes); 
app.use('/v1/category', categoryRoutes); 
app.use('/v1/product', productRoutes); 
app.use('/v1/auth', authRoutes)*/
  // Exemplo ideal em userRoutes.js

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    database: sequelize.config.database,
    dialect: sequelize.getDialect()
  });
});

// Middleware para rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.path,
    method: req.method
  });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Ocorreu um erro no servidor' 
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details
    })
  });
});

// Exportar a instância do app para testes
module.exports = app;