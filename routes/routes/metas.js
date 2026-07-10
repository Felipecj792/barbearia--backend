const express = require('express');
const router = express.Router();
const metaController = require('../controllers/metaController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', metaController.listar);
router.get('/:id', metaController.buscar);
router.post('/', metaController.criar);
router.put('/:id', metaController.atualizar);
router.delete('/:id', metaController.deletar);
router.patch('/:id/progresso', metaController.atualizarProgresso);

module.exports = router;