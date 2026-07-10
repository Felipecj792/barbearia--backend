const Meta = require('../models/Meta');
const Barbeiro = require('../models/Barbeiro');

exports.listar = async (req, res) => {
  try {
    const { status, barbeiro_id } = req.query;
    const where = {};

    if (status) where.status = status;
    if (barbeiro_id) where.barbeiro_id = barbeiro_id;

    const metas = await Meta.findAll({
      where,
      include: [{ model: Barbeiro }],
      order: [['data_fim', 'ASC']]
    });

    res.json(metas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.buscar = async (req, res) => {
  try {
    const { id } = req.params;
    const meta = await Meta.findByPk(id, {
      include: [{ model: Barbeiro }]
    });
    
    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }
    
    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const { nome, descricao, tipo, valor_meta, data_inicio, data_fim, barbeiro_id } = req.body;

    const meta = await Meta.create({
      nome,
      descricao,
      tipo,
      valor_meta,
      data_inicio,
      data_fim,
      barbeiro_id,
      valor_atual: 0,
      status: 'ativo'
    });

    res.status(201).json(meta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, tipo, valor_meta, data_inicio, data_fim, barbeiro_id, status } = req.body;

    const meta = await Meta.findByPk(id);
    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    await meta.update({
      nome,
      descricao,
      tipo,
      valor_meta,
      data_inicio,
      data_fim,
      barbeiro_id,
      status
    });

    res.json(meta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const meta = await Meta.findByPk(id);
    
    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    await meta.destroy();
    res.json({ message: 'Meta removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.atualizarProgresso = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor_atual } = req.body;

    const meta = await Meta.findByPk(id);
    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    meta.valor_atual = valor_atual;

    if (meta.valor_atual >= meta.valor_meta) {
      meta.status = 'concluido';
    }

    await meta.save();
    res.json(meta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};