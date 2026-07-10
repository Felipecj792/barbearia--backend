const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
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
    validate: {
      isEmail: true
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING(14),
    unique: true
  },
  data_nascimento: {
    type: DataTypes.DATEONLY
  },
  observacoes: {
    type: DataTypes.TEXT
  },
  preferencias: {
    type: DataTypes.JSON
  }
}, {
  timestamps: true
});

module.exports = Cliente;