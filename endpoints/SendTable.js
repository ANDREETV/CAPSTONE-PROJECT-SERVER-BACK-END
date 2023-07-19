const express = require('express');
const routers = express.Router();
const jwt = require('jsonwebtoken');

const ordersModel = require('../models/OrderProducts');

const jwtTableKey = process.env.T;

routers.get('/', (req, res) => {
  res.send('Orders!');
});

// GET to get an order

routers.get('/orders', async (req, res) => {
  const orders = await ordersModel.find();
  return res.status(200).json(orders);
});

// GET Endpoint to get a specific order
routers.get('/orders/:tableNumber', async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const order = await ordersModel.findOne({ tableNumber });
    if (!order) {
      res.status(404).json({ error: 'Ordine non trovato' });
    } else {
      res.json(order);
    }
  } catch (error) {
    res.status(500).json({ error: "Errore nel recuperare l'ordine" });
  }
});

// Endpoint to get a specific order
routers.post('/orders/add/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const cartItems = req.body.cart;

    const order = await ordersModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Ordine non trovato' });
    }

    order.orders.push(...cartItems);
    await order.save();

    res.json({ status: 'Ordine aggiornato con successo', data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante l'aggiunta all'ordine" });
  }
});

// POST create orders
routers.post('/orders', async (req, res) => {
  const { tableNumber, people } = req.body;
  try {
    const oldTable = await ordersModel.findOne({ tableNumber });
    if (oldTable) {
      return res.json({ error: 'Table Exists' });
    }

    const token = jwt.sign(
      {
        tableNumber: tableNumber,
        people: people,
      },
      jwtTableKey,
      { expiresIn: '2h' }
    );

    await ordersModel.create({
      tableNumber,
      people,
    });
    res.json({ status: 'Send Success', data: token });
  } catch (error) {
    res.send({ status: 'error', message: error.message });
  }
});

// Patch CHANGE ORDER STATUS

routers.patch('/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  const newStatus = req.body.statusOrders;

  try {
    const order = await ordersModel.findOneAndUpdate(
      { _id: orderId },
      { statusOrders: newStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }

    res.json({ message: "Stato dell'ordine aggiornato con successo", order });
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento dello stato dell'ordine:",
      error
    );
    res.status(500).json({
      message:
        "Si è verificato un errore durante l'aggiornamento dello stato dell'ordine",
    });
  }
});

// Delete ORDER

routers.delete('/orders/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await ordersModel.findByIdAndDelete(id);
    return res.status(200).json({});
  } catch (error) {
    res.status(500).json({ error: 'Ordine non trovato', ...err });
  }
});

module.exports = routers;
