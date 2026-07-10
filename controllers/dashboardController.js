const Agendamento = require('../models/Agendamento');
const Barbeiro = require('../models/Barbeiro');
const Cliente = require('../models/Cliente');
const Servico = require('../models/Servico');
const { Op } = require('sequelize');

exports.getDados = async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const totalClientes = await Cliente.count();
    const totalBarbeiros = await Barbeiro.count({ where: { ativo: true } });
    const totalServicos = await Servico.count({ where: { ativo: true } });

    const agendamentosHoje = await Agendamento.count({
      where: {
        data_hora: {
          [Op.between]: [hoje, amanha]
        },
        status: {
          [Op.notIn]: ['cancelado']
        }
      }
    });

    const faturamentoMes = await Agendamento.sum('preco_total', {
      where: {
        status: 'finalizado',
        data_hora: {
          [Op.gte]: new Date(hoje.getFullYear(), hoje.getMonth(), 1)
        }
      }
    });

    res.json({
      totalClientes,
      totalBarbeiros,
      totalServicos,
      agendamentosHoje,
      faturamentoMes: faturamentoMes || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFaturamento = async (req, res) => {
  try {
    const { periodo } = req.query;
    // Implementação simplificada
    res.json({ message: 'Endpoint em desenvolvimento' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAgendamentosHoje = async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const agendamentos = await Agendamento.findAll({
      where: {
        data_hora: {
          [Op.between]: [hoje, amanha]
        },
        status: {
          [Op.notIn]: ['cancelado']
        }
      },
      include: [
        { model: Cliente },
        { model: Barbeiro },
        { model: Servico }
      ],
      order: [['data_hora', 'ASC']]
    });

    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRankingBarbeiros = async (req, res) => {
  try {
    const barbeiros = await Barbeiro.findAll({
      where: { ativo: true },
      include: [{
        model: Agendamento,
        where: { status: 'finalizado' },
        required: false
      }]
    });

    const ranking = barbeiros.map(barbeiro => ({
      id: barbeiro.id,
      nome: barbeiro.nome,
      totalAgendamentos: barbeiro.Agendamentos ? barbeiro.Agendamentos.length : 0
    }));

    ranking.sort((a, b) => b.totalAgendamentos - a.totalAgendamentos);
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getServicosPopulares = async (req, res) => {
  try {
    const servicos = await Servico.findAll({
      where: { ativo: true },
      include: [{
        model: Agendamento,
        where: { status: 'finalizado' },
        required: false
      }]
    });

    const ranking = servicos.map(servico => ({
      id: servico.id,
      nome: servico.nome,
      totalAgendamentos: servico.Agendamentos ? servico.Agendamentos.length : 0
    }));

    ranking.sort((a, b) => b.totalAgendamentos - a.totalAgendamentos);
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};