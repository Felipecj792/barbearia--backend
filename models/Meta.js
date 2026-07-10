const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meta = sequelize.define('Meta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  },
  tipo: {
    type: DataTypes.ENUM('faturamento', 'clientes', 'servicos', 'avaliacao'),
    allowNull: false
  },
  valor_meta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  valor_atual: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  data_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  data_fim: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  barbeiro_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Barbeiros',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('ativo', 'concluido', 'cancelado'),
    defaultValue: 'ativo'
  }
}, {
  timestamps: true
});

module.exports = Meta;