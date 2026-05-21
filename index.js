require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

const cuestionariosRoutes = require('./routes/Cuestionarios');
app.use('/api/cuestionarios', cuestionariosRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AprendARTE server is running' });
});

const buildPath = path.join(__dirname, 'cuestionarios-app', 'build');
app.use(express.static(buildPath));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor backend iniciado en el puerto ${port}`);
});
