const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cuestionario = require('../models/Cuestionario');

router.get('/', async (req, res) => {
  try {
    const cuestionarios = await Cuestionario.find();
    res.json(cuestionarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los cuestionarios' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, preguntas } = req.body;


    if (!titulo || !descripcion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios y debe haber al menos una pregunta.' });
    }
    const nuevoCuestionario = new Cuestionario(req.body);
    await nuevoCuestionario.save();
    res.status(201).json(nuevoCuestionario);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear el cuestionario', detalles: err.message });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID de cuestionario no válido' });
  }

  try {
    const cuestionarioActualizado = await Cuestionario.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!cuestionarioActualizado) {
      return res.status(404).json({ mensaje: 'Cuestionario no encontrado' });
    }

    res.json(cuestionarioActualizado);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el cuestionario' });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID de cuestionario no válido' });
  }

  try {
    const cuestionarioEliminado = await Cuestionario.findByIdAndDelete(id);

    if (!cuestionarioEliminado) {
      return res.status(404).json({ error: 'Cuestionario no encontrado' });
    }

    res.json({ mensaje: 'Cuestionario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el cuestionario' });
  }
});

module.exports = router;
