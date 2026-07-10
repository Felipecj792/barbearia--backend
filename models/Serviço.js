const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servico = sequelize.define('Servico', {
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
  duracao_minutos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING(50)
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Servico;