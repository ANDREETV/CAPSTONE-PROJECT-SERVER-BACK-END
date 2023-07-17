const express = require('express');
const routers = express.Router();

// Models
const productsModel = require('../models/ProductsModel');

// Middlewares
const upload = require('../middlewares/uploadImg');

// Get

routers.get('/products', (req, res) => {
  productsModel
    .find()
    .then((produt) => {
      res.status(200).json(produt);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Prodotto non trovato' }, ...err);
    });
});

// GET ID

routers.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const products = await productsModel.findById(id);
    return res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Prodotto non trovato' }, ...err);
  }
});

routers.post('/products', upload.single('uploadFile'), async (req, res) => {
  const {
    nameproduct,
    description,
    price,
    category,
    quantity,
    inCart,
    status,
  } = req.body;
  const image = req.file ? req.file.path : '';

  try {
    const oldNameProduct = await productsModel.findOne({ nameproduct });
    if (oldNameProduct) {
      return res.json({ error: 'Product Exists' });
    }
    await productsModel.create({
      nameproduct,
      description,
      price,
      category,
      quantity,
      image,
      inCart: false,
      status,
    });
    res.send({ status: 'Register Product Success' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

// Put

routers.put('/products/:id', async (req, res) => {
  try {
    res
      .status(200)
      .json(await productsModel.findByIdAndUpdate(req.params.id, req.body));
  } catch (err) {
    res.status(400).json({ error: 'Prodotto non trovato' }, ...err);
  }
});

// Delete

routers.delete('/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await productsModel.findByIdAndDelete(id);
    return res.status(200).json({});
  } catch (error) {
    res.status(500).json({ error: 'Prodotto non trovato', ...err });
  }
});

module.exports = routers;
