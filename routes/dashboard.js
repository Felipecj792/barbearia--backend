const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', dashboardController.getDados);
router.get('/faturamento', dashboardController.getFaturamento);
router.get('/agendamentos-hoje', dashboardController.getAgendamentosHoje);
router.get('/barbeiros-ranking', dashboardController.getRankingBarbeiros);
router.get('/servicos-populares', dashboardController.getServicosPopulares);

module.exports = router;