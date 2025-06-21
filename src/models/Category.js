module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    use_in_menu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false // Sequelize interpreta false como 0 no banco
    }
  }, {
    tableName: 'categories',
    underscored: true
  });

  Category.associate = (models) => {
    // Exemplo de associação se for usar ProductCategory:
    Category.belongsToMany(models.Product, {
      through: 'ProductCategory',
      foreignKey: 'category_id',
      as: 'products'
    });
  };

  return Category;
};