const mongoose = require('mongoose');

// Mongose Schema

const ordersSchema = new mongoose.Schema({
  tableNumber: Number,
  people: String,
  orders: {
    type: Array,
    default: [],
  },
  statusOrders: {
    type: String,
    enum: ['pending', 'served', 'payed'],
    default: 'pending',
  },
});

const ordersModel = mongoose.model('orders', ordersSchema);

module.exports = ordersModel;
