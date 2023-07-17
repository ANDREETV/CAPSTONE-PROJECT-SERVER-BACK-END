const mongoose = require('mongoose');

// Mongose Schema

const ProductsSchema = new mongoose.Schema({
  nameproduct: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
  },
  image: String,
  quantity: Number,
  inCart: {
    type: Boolean,
  },
  status: {
    type: Boolean,
  },
});

// Mongoose model
const productsModel = mongoose.model('products', ProductsSchema);

module.exports = productsModel;
