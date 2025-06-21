module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
      defaultValue: false
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    description: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    price_with_discount: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'products',
    underscored: true,
    timestamps: true // adiciona created_at e updated_at
  });

  Product.associate = (models) => {
    // Relacionamentos, se quiser
    Product.belongsToMany(models.Category, {
      through: 'ProductCategory',
      foreignKey: 'product_id',
      as: 'categories'
    });

    Product.hasMany(models.ProductImage, {
      foreignKey: 'product_id',
      as: 'images'
    });

    Product.hasMany(models.ProductOption, {
      foreignKey: 'product_id',
      as: 'options'
    });
  };

  return Product;
};