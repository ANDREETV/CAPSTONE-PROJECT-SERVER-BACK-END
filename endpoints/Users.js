const express = require('express');
const routers = express.Router();
require('dotenv').config();

// Model
const userModel = require('../models/UserModel');

// Middlewares
const authLogin = require('../middlewares/AuthLogin');

routers.get('/users', authLogin, async (req, res) => {
  const users = await userModel.find();
  return res.status(200).json(users);
});

// PUT USER

routers.put('/users/:id', async (req, res) => {
  try {
    res
      .status(200)
      .json(await userModel.findByIdAndUpdate(req.params.id, req.body));
  } catch (err) {
    res.status(400).json({ error: 'Utente non trovato' }, ...err);
  }
});

// DELETE USER
routers.delete('/user/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await userModel.findByIdAndDelete(id);
    return res.status(200).json({});
  } catch (err) {
    res.status(500).json({ error: 'Utente non trovato', ...err });
  }
});

// Exports

module.exports = routers;
