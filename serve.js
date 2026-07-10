const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const agendamentosRoutes = require('./routes/agendamentos');
const barbeirosRoutes = require('./routes/barbeiros');
const clientesRoutes = require('./routes/clientes');
const metasRoutes = require('./routes/metas');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/agendamentos', agendamentosRoutes);
app.use('/api/barbeiros', barbeirosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/metas', metasRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando!' });
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco de dados sincronizado');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar banco:', err);
  });