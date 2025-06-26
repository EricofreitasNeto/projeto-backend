const { Op } = require('sequelize');
const {
  Product,
  ProductCategory,
  ProductImage,
  ProductOption,
  Category
} = require('../models');

// Função utilitária para formatar produto
function formatProduct(product) {
  return {
    id: product.id,
    enabled: product.enabled,
    name: product.name,
    slug: product.slug,
    stock: product.stock,
    description: product.description,
    price: product.price,
    price_with_discount: product.price_with_discount,
    category_ids: product.categories?.map(c => c.id) || [],
    images: product.images?.map(img => ({
      id: img.id,
      content: `https://store.com/media/${product.slug}/${img.path}`
    })) || [],
    options: product.options || []
  };
}

// Criar produto com relacionamentos
exports.create = async (req, res) => {
  try {
    const {
      category_ids = [],
      images = [],
      options = [],
      ...productData
    } = req.body;

    const product = await Product.create(productData);

    if (category_ids.length > 0) {
      const links = category_ids.map(category_id => ({
        product_id: product.id,
        category_id
      }));
      await ProductCategory.bulkCreate(links);
    }

    if (images.length > 0) {
      const imageRecords = images.map(img => ({
        product_id: product.id,
        path: img.path,
        enabled: img.enabled ?? true
      }));
      await ProductImage.bulkCreate(imageRecords);
    }

    if (options.length > 0) {
      const optionRecords = options.map(opt => ({
        product_id: product.id,
        option_id: opt.option_id,
        value: opt.value
      }));
      await ProductOption.bulkCreate(optionRecords);
    }

    const full = await Product.findByPk(product.id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductOption, as: 'options' },
        {
          model: Category,
          as: 'categories',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });

    res.status(201).json({ data: [formatProduct(full)], total: 1, limit: 1, page: 1 });
  } catch (error) {
    console.error('[CreateProductError]', error);
    res.status(400).json({ error: 'Erro ao criar o produto.' });
  }
};

// Atualizar produto + categorias
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_ids = [], ...updates } = req.body;

    const product = await Product.findByPk(id);
    if (!product)
      return res.status(404).json({ error: 'Produto não encontrado.' });

    await product.update(updates);
    await ProductCategory.destroy({ where: { product_id: id } });

    if (category_ids.length > 0) {
      const links = category_ids.map(category_id => ({
        product_id: id,
        category_id
      }));
      await ProductCategory.bulkCreate(links);
    }

    const full = await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductOption, as: 'options' },
        {
          model: Category,
          as: 'categories',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });

    res.json({ data: [formatProduct(full)], total: 1, limit: 1, page: 1 });
  } catch (error) {
    console.error('[UpdateProductError]', error);
    res.status(400).json({ error: 'Erro ao atualizar o produto.' });
  }
};

//Obter produto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductOption, as: 'options' },
        {
          model: Category,
          as: 'categories',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });

    if (!product)
      return res.status(404).json({ error: 'Produto não encontrado' });

    res.json({ data: [formatProduct(product)], total: 1, limit: 1, page: 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//Buscar produtos com filtros
exports.search = async (req, res) => {
  try {
    const {
      limit = 12,
      page = 1,
      fields,
      match,
      category_ids,
      'price-range': priceRange
    } = req.query;

    const where = {};

    if (match) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${match}%` } },
        { description: { [Op.iLike]: `%${match}%` } }
      ];
    }

    if (category_ids) {
      const ids = category_ids.split(',').map(Number);
      where.category_ids = { [Op.overlap]: ids };
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      where.price = { [Op.between]: [min, max] };
    }

      const validProductFields = [
      'id', 'enabled', 'name', 'slug', 'stock',
      'description', 'price', 'price_with_discount'
    ];

    const selectedFields = fields
      ? fields.split(',').filter(f => validProductFields.includes(f))
      : null;

    const finalLimit = parseInt(limit);
    const offset = finalLimit === -1 ? undefined : (parseInt(page) - 1) * finalLimit;

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [
        { model: ProductImage, as: 'images', attributes: ['id', 'path'] },
        { model: ProductOption, as: 'options' },
        {
          model: Category,
          as: 'categories',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ],
      ...(selectedFields ? { attributes: selectedFields } : {}),
      ...(offset !== undefined ? { offset } : {}),
      ...(finalLimit !== -1 ? { limit: finalLimit } : {})
    });

    const data = rows.map(formatProduct);

    res.status(200).json({
      data,
      total: count,
      limit: finalLimit === -1 ? count : finalLimit,
      page: finalLimit === -1 ? 1 : parseInt(page)
    });
  } catch (err) {
    console.error('[ProductSearchError]', err);
    res.status(400).json({ error: 'Erro na requisição' });
  }
};

//Listar todos (sem include)
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Deletar
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted)
      return res.status(404).json({ error: 'Produto não encontrado' });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createWithAssets = async (req, res) => {
  try {
    const {
      category_ids = [],
      images = [],
      options = [],
      ...productData
    } = req.body;

    const product = await Product.create(productData);

    // CATEGORIAS
    if (category_ids.length > 0) {
      await ProductCategory.bulkCreate(
        category_ids.map(category_id => ({
          product_id: product.id,
          category_id
        }))
      );
    }

    // IMAGENS base64
    const fs = require('fs');
    const path = require('path');
    const crypto = require('crypto');
    const imagePath = path.join(__dirname, '..', 'public', 'media', product.slug);
    fs.mkdirSync(imagePath, { recursive: true });

    const imageRecords = images.map(img => {
      const ext = img.type.split('/')[1] || 'png';
      const filename = `${crypto.randomUUID()}.${ext}`;
      const fullPath = path.join(imagePath, filename);
      fs.writeFileSync(fullPath, Buffer.from(img.content, 'base64'));
      return { product_id: product.id, path: filename, enabled: true };
    });
    await ProductImage.bulkCreate(imageRecords);

    // OPÇÕES
    const optionRecords = options.map(opt => ({
      product_id: product.id,
      title: opt.title,
      shape: opt.shape ?? 'square',
      radius: parseInt(opt.radius) || 0,
      type: opt.type ?? 'text',
      values: Array.isArray(opt.value || opt.values)
        ? (opt.value || opt.values).join(',')
        : ''
    }));
    await ProductOption.bulkCreate(optionRecords);

    res.status(201).json({ message: 'Produto com assets criado com sucesso', id: product.id });
  } catch (error) {
    console.error('[CreateWithAssetsError]', error);
    res.status(500).json({ error: 'Erro ao criar produto com imagens e opções' });
  }
};
