const API_URL = location.protocol === 'file:' || (['localhost', '127.0.0.1'].includes(location.hostname) && location.port !== '3000') ? 'http://localhost:3000' : location.origin;
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
let produtos = [];
let categoriaAtual = 'Todos';
let carrinho = [];
try {
  const salvo = JSON.parse(localStorage.getItem('frangolino_carrinho') || '[]');
  if (Array.isArray(salvo)) carrinho = salvo;
} catch { }
let clienteAtual = { nome: '' };
let metodoPagamentoAtual = 'PIX';
let toastTimer;

document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
  atualizarResumoCarrinho();
});

async function carregarProdutos() {
  const container = document.getElementById('produtos-container');
  try {
    const resposta = await fetch(`${API_URL}/produtos`);
    if (!resposta.ok) throw new Error();
    produtos = await resposta.json();
    renderizarProdutos();
  } catch {
    container.innerHTML = '<div class="loading-state"><p>Não foi possível carregar os produtos. Inicie o servidor em backend (npm start) e tente novamente.</p><button class="btn btn-secondary btn-sm" onclick="carregarProdutos()">Tentar novamente</button></div>';
  }
}

function formatarMoeda(valor) {
  return moeda.format(Number(valor) || 0);
}

function renderizarProdutos() {
  const container = document.getElementById('produtos-container');
  if (!container) return;
  const lista = categoriaAtual === 'Todos'
    ? produtos
    : produtos.filter((produto) => produto.categoria.toLowerCase() === categoriaAtual.toLowerCase());

  container.innerHTML = lista.length ? lista.map((produto) => {
    const esgotado = produto.estoque <= 0;
    return `<article class="product-card">
      <div><div class="product-image-container"><img src="${produto.imagem || 'pao.jpeg'}" alt="${produto.nome}" onerror="this.src='pao.jpeg'"></div>
      <div class="product-meta-tag">${produto.categoria}</div><h3 class="product-name-title">${produto.nome}</h3>
      <div class="product-availability ${esgotado ? 'out-of-stock' : ''}">${esgotado ? 'Esgotado' : 'Disponível'}</div></div>
      <div class="product-card-footer"><span class="product-price-tag">${formatarMoeda(produto.preco)}</span>
      <button class="btn-add-item" ${esgotado ? 'disabled' : ''} onclick="adicionarAoCarrinho(${produto.id})">${esgotado ? 'Esgotado' : 'Adicionar'}</button></div>
    </article>`;
  }).join('') : '<div class="loading-state"><p>Nenhum produto encontrado nesta categoria.</p></div>';
}

function filtrarCategoria(categoria) {
  categoriaAtual = categoria;
  document.querySelectorAll('.category-btn').forEach((botao) => botao.classList.toggle('active', botao.dataset.categoria === categoria));
  renderizarProdutos();
}

function salvarCarrinho() {
  try { localStorage.setItem('frangolino_carrinho', JSON.stringify(carrinho)); } catch { }
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find((item) => item.id === id);
  if (!produto) return;
  const item = carrinho.find((linha) => linha.id === id);
  if (produto.estoque <= (item?.quantidade || 0)) return mostrarToast('Limite de estoque atingido.');
  if (item) item.quantidade += 1;
  else carrinho.push({ id, nome: produto.nome, preco: produto.preco, quantidade: 1, estoqueMax: produto.estoque });
  salvarCarrinho();
  atualizarResumoCarrinho();
  mostrarToast(`${produto.nome} adicionado ao carrinho.`);
}

function alterarQuantidade(id, delta) {
  const item = carrinho.find((linha) => linha.id === id);
  if (!item) return;
  item.quantidade += delta;
  if (item.quantidade < 1) carrinho = carrinho.filter((linha) => linha.id !== id);
  else if (item.quantidade > item.estoqueMax) {
    item.quantidade = item.estoqueMax;
    mostrarToast('Estoque máximo atingido.');
  }
  salvarCarrinho();
  atualizarResumoCarrinho();
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter((item) => item.id !== id);
  salvarCarrinho();
  atualizarResumoCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  atualizarResumoCarrinho();
  mostrarToast('Carrinho esvaziado.');
}

function atualizarResumoCarrinho() {
  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  const quantidade = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  document.getElementById('cart-badge-count').textContent = quantidade;
  document.getElementById('quick-total-price').textContent = formatarMoeda(total);
  document.getElementById('cart-summary-count').textContent = quantidade;
  document.getElementById('cart-summary-subtotal').textContent = formatarMoeda(total);
  document.getElementById('cart-summary-total').textContent = formatarMoeda(total);
  document.getElementById('btn-finalizar-pedido').disabled = !carrinho.length;
  renderizarListaCarrinho();
}

function renderizarListaCarrinho() {
  const container = document.getElementById('carrinho-lista');
  if (!container) return;
  container.innerHTML = carrinho.length ? carrinho.map((item) => `
    <div class="cart-item-row"><div class="cart-item-info"><div class="cart-item-title">${item.nome}</div>
    <div class="cart-item-unit">${formatarMoeda(item.preco)} cada</div></div>
    <div class="qty-controls"><button class="qty-btn" onclick="alterarQuantidade(${item.id}, -1)">−</button>
    <span class="qty-val">${item.quantidade}</span><button class="qty-btn" onclick="alterarQuantidade(${item.id}, 1)">+</button></div>
    <div class="cart-item-subtotal">${formatarMoeda(item.preco * item.quantidade)}</div>
    <button class="btn-remove" title="Remover" onclick="removerDoCarrinho(${item.id})">Remover</button></div>`).join('')
    : '<div class="loading-state"><p>Seu carrinho está vazio.</p><button class="btn btn-secondary btn-sm" onclick="mostrarSecao(\'cardapio\')">Ir para o Cardápio</button></div>';
}

function mostrarSecao(id) {
  document.querySelectorAll('.view-section').forEach((secao) => secao.classList.toggle('active', secao.id === `secao-${id}`));
  document.querySelectorAll('.nav-btn').forEach((botao) => botao.classList.toggle('active', botao.id === `nav-${id}`));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'carrinho') atualizarResumoCarrinho();
}

function avancarParaIdentificacao() {
  if (!carrinho.length) return mostrarToast('Seu carrinho está vazio.');
  mostrarSecao('identificacao');
}

function avancarParaPagamento() {
  const inputNome = document.getElementById('cliente-nome');
  const nome = inputNome.value.trim();
  if (!nome) {
    mostrarToast('Informe seu nome.');
    inputNome.focus();
    return;
  }
  clienteAtual = { nome };
  document.getElementById('payment-total-amount').textContent = formatarMoeda(carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0));
  gerarQrCodePix();
  mostrarSecao('pagamento');
}

function selecionarMetodoPagamento(metodo) {
  metodoPagamentoAtual = metodo;
  const chave = metodo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  document.querySelectorAll('.method-option').forEach((el) => el.classList.toggle('active', el.id === `method-${chave}`));
  document.querySelectorAll('.payment-subview').forEach((el) => el.classList.toggle('active', el.id === `payment-view-${chave}`));
  document.querySelector(`input[name="metodo"][value="${metodo}"]`).checked = true;
}

function gerarQrCodePix() {
  const valor = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  document.getElementById('qrcode-payload-text').textContent = `PADARIA-FRANGOLINO | VALOR-${valor.toFixed(2)} | PAGAMENTO-SIMULADO`;
  const padrao = Array.from({ length: 21 * 21 }, (_, i) => ((i * 17 + Math.floor(valor * 100)) % 5 < 2));
  const blocos = padrao.map((escuro, i) => escuro ? `<rect x="${i % 21}" y="${Math.floor(i / 21)}" width="1" height="1"/>` : '').join('');
  document.getElementById('qrcode-container').innerHTML = `<svg viewBox="0 0 21 21" width="160" height="160" aria-label="QR Code de pagamento simulado"><rect width="21" height="21" fill="white"/><g fill="#3c2415">${blocos}</g></svg>`;
}

async function concluirPedidoEPagamento(metodo = metodoPagamentoAtual) {
  if (!carrinho.length) return mostrarToast('Seu carrinho está vazio.');
  const botao = document.querySelector('.payment-subview.active .btn-primary');
  if (botao) botao.disabled = true;
  try {
    const resposta = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente: clienteAtual, itens: carrinho.map(({ id, quantidade }) => ({ id, quantidade })), pagamento: metodo })
    });
    const pedido = await resposta.json();
    if (!resposta.ok) throw new Error(pedido.erro || 'Não foi possível criar o pedido.');
    if (metodo !== 'DINHEIRO') {
      const pagamento = await fetch(`${API_URL}/pagamentos/simular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idPedido: pedido.id })
      });
      if (!pagamento.ok) throw new Error('Não foi possível simular o pagamento.');
    }
    document.getElementById('confirmed-order-number').textContent = pedido.numero;
    document.getElementById('confirmed-customer-name').textContent = pedido.cliente.nome;
    document.getElementById('confirmed-payment-method').textContent = pedido.pagamento;
    document.getElementById('confirmed-payment-status').textContent = metodo === 'DINHEIRO' ? pedido.status : 'Pagamento aprovado';
    document.getElementById('confirmed-total-amount').textContent = formatarMoeda(pedido.total);
    document.getElementById('confirmed-items-list').innerHTML = pedido.itens.map((item) => `<div class="conf-row"><span>${item.quantidade}x ${item.nome}</span><strong>${formatarMoeda(item.subtotal)}</strong></div>`).join('');
    carrinho = [];
    salvarCarrinho();
    atualizarResumoCarrinho();
    await carregarProdutos();
    mostrarSecao('confirmacao');
  } catch (erro) {
    mostrarToast(erro.message);
  } finally {
    if (botao) botao.disabled = false;
  }
}

function iniciarNovoPedido() {
  clienteAtual = { nome: '' };
  document.getElementById('form-identificacao').reset();
  mostrarSecao('inicio');
}

function mostrarToast(mensagem) {
  const toast = document.getElementById('toast-notification');
  document.getElementById('toast-message').textContent = mensagem;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}



