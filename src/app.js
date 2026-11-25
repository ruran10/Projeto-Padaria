const express = require('express');
const app = express();
const path = require('path');
const pedidos = require('./controllers/pedidoController');
const frontend = path.resolve(__dirname, '../../frontend/painel');

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.static(frontend));
app.get('/', (_req, res) => res.sendFile(path.join(frontend, 'painel.html')));
app.get('/caixa', (_req, res) => res.sendFile(path.join(frontend, 'caixa.html')));
app.get('/pedido-atual', pedidos.pedidoAtual);
app.post('/pedido-atual/entregar', pedidos.entregarPedido);
app.use('/produtos', require('./routes/produtoRoutes'));
app.use('/pedidos', require('./routes/pedidoRoutes'));
app.post('/pagamentos/simular', pedidos.simularPagamento);

module.exports = app;
