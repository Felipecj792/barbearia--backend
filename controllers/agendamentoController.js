const Agendamento = require('../models/Agendamento');
const Barbeiro = require('../models/Barbeiro');
const Servico = require('../models/Servico');
const Cliente = require('../models/Cliente');
const { Op } = require('sequelize');

exports.listar = async (req, res) => {
  try {
    const { data_inicio, data_fim, barbeiro_id, status } = req.query;
    const where = {};

    if (data_inicio && data_fim) {
      where.data_hora = {
        [Op.between]: [new Date(data_inicio), new Date(data_fim)]
      };
    }
    if (barbeiro_id) where.barbeiro_id = barbeiro_id;
    if (status) where.status = status;

    const agendamentos = await Agendamento.findAll({
      where,
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

exports.buscar = async (req, res) => {
  try {
    const { id } = req.params;
    const agendamento = await Agendamento.findByPk(id, {
      include: [Cliente, Barbeiro, Servico]
    });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    res.json(agendamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const { cliente_id, barbeiro_id, servico_id, data_hora, observacoes } = req.body;
    
    const servico = await Servico.findByPk(servico_id);
    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    const conflito = await Agendamento.findOne({
      where: {
        barbeiro_id,
        data_hora: new Date(data_hora),
        status: {
          [Op.notIn]: ['cancelado', 'finalizado']
        }
      }
    });

    if (conflito) {
      return res.status(409).json({ error: 'Horário indisponível' });
    }

    const agendamento = await Agendamento.create({
      cliente_id,
      barbeiro_id,
      servico_id,
      data_hora,
      duracao_minutos: servico.duracao_minutos,
      preco_total: servico.preco,
      observacoes
    });

    await agendamento.reload({
      include: [Cliente, Barbeiro, Servico]
    });

    res.status(201).json(agendamento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente_id, barbeiro_id, servico_id, data_hora, observacoes, status } = req.body;

    const agendamento = await Agendamento.findByPk(id);
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    if (servico_id) {
      const servico = await Servico.findByPk(servico_id);
      if (servico) {
        agendamento.duracao_minutos = servico.duracao_minutos;
        agendamento.preco_total = servico.preco;
        agendamento.servico_id = servico_id;
      }
    }

    await agendamento.update({
      cliente_id,
      barbeiro_id,
      data_hora,
      observacoes,
      status
    });

    await agendamento.reload({
      include: [Cliente, Barbeiro, Servico]
    });

    res.json(agendamento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const agendamento = await Agendamento.findByPk(id);
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    agendamento.status = status;
    await agendamento.save();

    res.json(agendamento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const agendamento = await Agendamento.findByPk(id);
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    await agendamento.destroy();
    res.json({ message: 'Agendamento removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDisponibilidade = async (req, res) => {
  try {
    const { barbeiro_id, data } = req.query;
    const horarios = [];
    for (let hora = 9; hora < 18; hora++) {
      horarios.push(`${hora}:00`);
      horarios.push(`${hora}:30`);
    }
    res.json({ disponiveis: horarios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};