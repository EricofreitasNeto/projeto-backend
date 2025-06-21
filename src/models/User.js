const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => { const User = sequelize.define('User', {
   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
   firstname: { type: DataTypes.STRING, allowNull: false }, 
   surname: { type: DataTypes.STRING, allowNull: false }, 
   email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } }, 
   password: { type: DataTypes.STRING, allowNull: false } }, 
   { tableName: 'users', underscored: true, hooks: { beforeCreate: async (user) => { 
    user.password = await bcrypt.hash(user.password, 10); }, beforeUpdate: async (user) => { 
      if (user.changed('password')) { user.password = await bcrypt.hash(user.password, 10); } } } });
// Método para validar senha User.prototype.validatePassword = async function (senhaDigitada) { return bcrypt.compare(senhaDigitada, this.password); };
return User; };
