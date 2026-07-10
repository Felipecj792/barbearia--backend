const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Barbeiro = sequelize.define('Barbeiro', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telefone: {
    type: DataTypes.STRING(20)
  },
  especialidade: {
    type: DataTypes.STRING(100)
  },
  horario_inicio: {
    type: DataTypes.TIME,
    defaultValue: '09:00'
  },
  horario_fim: {
    type: DataTypes.TIME,
    defaultValue: '18:00'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  comissao_percentual: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 50.00
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Barbeiro;