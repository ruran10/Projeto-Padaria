const { produtos } = require('../data/dados');

exports.listarProdutos = (_req, res) => res.json(produtos);
