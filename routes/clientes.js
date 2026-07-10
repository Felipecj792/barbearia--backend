const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', clienteController.listar);
router.get('/:id', clienteController.buscar);
router.post('/', clienteController.criar);
router.put('/:id', clienteController.atualizar);
router.delete('/:id', clienteController.deletar);

module.exports = router;