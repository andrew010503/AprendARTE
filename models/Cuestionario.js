const mongoose = require('mongoose');

const preguntaSchema = new mongoose.Schema({
  enunciado: String,
  opciones: [String],
  respuestaCorrecta: String,
});

const cuestionarioSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  moduloAsociado: String,
  preguntas: [preguntaSchema],
  tiempoLimiteMin: Number,
});

module.exports = mongoose.model('Cuestionario', cuestionarioSchema);
