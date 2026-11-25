const API_URL = location.protocol === 'file:' || (['localhost', '127.0.0.1'].includes(location.hostname) && location.port !== '3000') ? 'http://localhost:3000' : location.origin;
const dinheiro = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const caixa = {
  esperando: document.querySelector('#waiting'),
  pedido: document.querySelector('#order'),
  numero: document.querySelector('#number'),
  cliente: document.querySelector('#customer'),
  itens: document.querySelector('#items'),
  total: document.querySelector('#total'),
  erro: document.querySelector('#error'),
  entregar: document.querySelector('#deliver')
};
let atualizando = false;

function mostrarPedido(pedido) {
  caixa.esperando.hidden = Boolean(pedido);
  caixa.pedido.hidden = !pedido;
  caixa.erro.hidden = true;
  if (!pedido) return;

  caixa.numero.textContent = pedido.numero;
  caixa.cliente.textContent = pedido.cliente.nome;
  caixa.total.textContent = dinheiro.format(pedido.total);
  caixa.itens.replaceChildren(...pedido.itens.map((item) => {
    const linha = document.createElement('li');
    const descricao = document.createElement('span');
    const preco = document.createElement('strong');
    descricao.textContent = `${item.quantidade}x ${item.nome}`;
    preco.className = 'price';
    preco.textContent = dinheiro.format(item.subtotal);
    linha.append(descricao, preco);
    return linha;
  }));
}

async function atualizarPedido() {
  if (atualizando) return;
  atualizando = true;
  try {
    const resposta = await fetch(API_URL + '/pedido-atual');
    if (!resposta.ok) throw new Error('Não foi possível consultar o pedido.');
    mostrarPedido((await resposta.json()).pedido);
  } catch {
    caixa.erro.textContent = 'Sem conexão. Inicie o servidor em backend (npm start); tentando novamente…';
    caixa.erro.hidden = false;
  } finally {
    atualizando = false;
  }
}

caixa.entregar.addEventListener('click', async () => {
  caixa.entregar.disabled = true;
  try {
    const resposta = await fetch(API_URL + '/pedido-atual/entregar', { method: 'POST' });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível concluir a entrega.');
    mostrarPedido(null);
  } catch (erro) {
    caixa.erro.textContent = erro.message;
    caixa.erro.hidden = false;
  } finally {
    caixa.entregar.disabled = false;
    atualizarPedido();
  }
});

atualizarPedido();
setInterval(atualizarPedido, 1000);

