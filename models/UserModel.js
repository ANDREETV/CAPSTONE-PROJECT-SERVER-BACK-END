const mongoose = require('mongoose');

// Mongosse Schema

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  img: String,
  provider: {
    type: String,
    default: 'register',
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

// Mongoose model

const userModel = mongoose.model('UserLogin', UserSchema);

// Export model

module.exports = userModel;
