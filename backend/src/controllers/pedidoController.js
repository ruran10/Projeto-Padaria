const pedidoService = require('../services/pedidoService');

exports.criarPedido = (req, res) => {
  try {
    res.status(201).json(pedidoService.criarPedido(req.body));
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

exports.pedidoAtual = (_req, res) => {
  res.json({ pedido: require('../data/dados').pedidoAtual });
};

exports.entregarPedido = (_req, res) => {
  try {
    pedidoService.entregarPedido();
    res.json({ sucesso: true, pedido: null });
  } catch (error) {
    res.status(409).json({ erro: error.message });
  }
};

exports.simularPagamento = (req, res) => {
  try {
    res.json(pedidoService.simularPagamento(req.body));
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

