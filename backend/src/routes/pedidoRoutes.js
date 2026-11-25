const express = require('express');
const router = express.Router();
router.post('/', require('../controllers/pedidoController').criarPedido);
module.exports = router;
