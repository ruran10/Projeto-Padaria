const dados = require('../data/dados');

function criarPedido({ cliente, itens, pagamento }) {
  const nome = typeof cliente?.nome === 'string' ? cliente.nome.trim() : '';
  if (!nome) throw new Error('Informe o nome do cliente.');
  if (!Array.isArray(itens) || itens.length === 0) throw new Error('O pedido deve conter ao menos um produto.');

  const quantidades = new Map();
  for (const item of itens) {
    const id = Number(item.id);
    const quantidade = Number(item.quantidade);
    if (!Number.isInteger(id) || !Number.isInteger(quantidade) || quantidade < 1) {
      throw new Error('Item do pedido com formato inválido.');
    }
    quantidades.set(id, (quantidades.get(id) || 0) + quantidade);
  }

  const itensPedido = [...quantidades].map(([id, quantidade]) => {
    const produto = dados.produtos.find((item) => item.id === id);
    if (!produto) throw new Error(`Produto ID ${id} não foi encontrado.`);
    if (quantidade > produto.estoque) throw new Error(`Estoque insuficiente para "${produto.nome}".`);
    return {
      id: produto.id,
      nome: produto.nome,
      quantidade,
      preco: produto.preco,
      subtotal: Number((produto.preco * quantidade).toFixed(2))
    };
  });

  const numero = dados.proximoNumeroPedido();
  const metodo = ['PIX', 'DINHEIRO', 'CARTÃO'].includes(pagamento) ? pagamento : 'PIX';
  const pedido = {
    id: numero,
    numero: `Pedido #${String(numero).padStart(3, '0')}`,
    cliente: { nome },
    itens: itensPedido,
    total: Number(itensPedido.reduce((soma, item) => soma + item.subtotal, 0).toFixed(2)),
    pagamento: metodo,
    status: metodo === 'DINHEIRO' ? 'Aguardando no balcão' : 'Novo',
    criadoEm: new Date().toISOString()
  };

  itensPedido.forEach((item) => {
    dados.produtos.find((produto) => produto.id === item.id).estoque -= item.quantidade;
  });
  dados.definirPedidoAtual(pedido);
  return pedido;
}

function entregarPedido() { 
  if (!dados.pedidoAtual) throw new Error('Não há pedido aguardando entrega.');
  dados.definirPedidoAtual(null);
}

function simularPagamento({ idPedido }) {
  const pedido = dados.pedidoAtual;
  if (!pedido || Number(idPedido) !== pedido.id) throw new Error('Pedido atual não foi encontrado.');
  pedido.status = 'Pago';
  return { sucesso: true, status: pedido.status };
}

module.exports = { criarPedido, entregarPedido, simularPagamento };

