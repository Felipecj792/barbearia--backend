const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Barbeiro = require('./Barbeiro');
const Servico = require('./Servico');

const Agendamento = sequelize.define('Agendamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cliente,
      key: 'id'
    }
  },
  barbeiro_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Barbeiro,
      key: 'id'
    }
  },
  servico_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Servico,
      key: 'id'
    }
  },
  data_hora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duracao_minutos: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('agendado', 'confirmado', 'em_andamento', 'finalizado', 'cancelado', 'nao_compareceu'),
    defaultValue: 'agendado'
  },
  observacoes: {
    type: DataTypes.TEXT
  },
  preco_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  comissao_barbeiro: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  timestamps: true
});

Agendamento.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Agendamento.belongsTo(Barbeiro, { foreignKey: 'barbeiro_id' });
Agendamento.belongsTo(Servico, { foreignKey: 'servico_id' });

Cliente.hasMany(Agendamento, { foreignKey: 'cliente_id' });
Barbeiro.hasMany(Agendamento, { foreignKey: 'barbeiro_id' });
Servico.hasMany(Agendamento, { foreignKey: 'servico_id' });

module.exports = Agendamento;