const jwt = require('jsonwebtoken'); 
const { JWT_SECRET } = process.env; 
module.exports = (req, res, next) => { 
const authHeader = req.headers.authorization; 
if (!authHeader) return res.status(401).json({ message: 'Token inválido ou ausente' }); 
const [, token] = authHeader.split(' '); // Formato: Bearer <token> 
try { 
const decoded = jwt.verify(token, JWT_SECRET); 
req.user = decoded; // Adiciona o payload do token ao request 
next(); 
} catch (error) { 
res.status(401).json({ message: 'Token inválido ou ausente' }); 
} 
}; 