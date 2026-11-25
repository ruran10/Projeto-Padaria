const express = require('express');
const router = express.Router();
router.get('/', require('../controllers/produtoController').listarProdutos);
module.exports = router;
