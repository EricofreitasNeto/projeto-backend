// controllers/productSearchController.js
const { Op } = require('sequelize');
const { Product, ProductImage, Category, Option } = require('../models');

exports.search = async (req, res) => {
  try {
    const {
      limit = 12,
      page = 1,
      fields,
      match,
      category_ids,
      'price-range': priceRange,
      ...optionsQuery
    } = req.query;

    const where = {};

    // Filtro por nome ou descrição
    if (match) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${match}%` } },
        { description: { [Op.iLike]: `%${match}%` } }
      ];
    }

    // Filtro por categorias
    if (category_ids) {
      const ids = category_ids.split(',').map(id => Number(id));
      where.category_ids = { [Op.overlap]: ids };
    }

    // Filtro por faixa de preço
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      where.price = { [Op.between]: [min, max] };
    }

    // Filtro por opções do tipo option[45]=GG,PP
    const optionFilters = Object.keys(optionsQuery).filter(key => key.startsWith('option['));
    const optionConditions = optionFilters.map(key => {
      const optionId = key.match(/option\[(\d+)\]/)?.[1];
      const values = optionsQuery[key].split(',');
      return {
        [`$options.option_id$`]: optionId,
        [`$options.value$`]: { [Op.in]: values }
      };
    });

    // Campos a serem retornados
    const selectedFields = fields ? fields.split(',') : null;

    const finalLimit = parseInt(limit);
    const offset = finalLimit === -1 ? undefined : (parseInt(page) - 1) * finalLimit;

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [
        { model: ProductImage, as: 'images', attributes: ['id', 'path'] },
        { model: Option, as: 'options', required: !!optionFilters.length }
      ],
      ...(selectedFields ? { attributes: selectedFields } : {}),
      ...(offset !== undefined ? { offset } : {}),
      ...(finalLimit !== -1 ? { limit: finalLimit } : {})
    });

    // Formata imagem
    const data = rows.map(product => ({
      ...product.toJSON(),
      images: product.images?.map(img => ({
        id: img.id,
        content: `https://store.com/media/${product.slug}/${img.path}`
      }))
    }));

    res.status(200).json({
      data,
      total: count,
      limit: finalLimit === -1 ? count : finalLimit,
      page: finalLimit === -1 ? 1 : parseInt(page)
    });
  } catch (err) {
    console.error('[ProductSearchError]', err);
    res.status(400).json({ error: 'Parâmetros inválidos ou erro na requisição' });
  }
}