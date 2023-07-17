const express = require('express');
const routers = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecretKey = process.env.APP_JWT_SECRET_KEY;
require('dotenv').config();

// Models
const UserModel = require('../models/UserModel');

// Middlewares
const upload = require('../middlewares/uploadImg');

routers.post('/register', upload.single('uploadFile'), async (req, res) => {
  const { name, lastname, username, email, password, img, verified } = req.body;
  const data = req.file ? req.file.path : '';

  const saltRounds = await bcrypt.hash(password, 10);
  try {
    const oldEmail = await UserModel.findOne({ email });
    if (oldEmail) {
      return res.json({ error: 'Email Exists' });
    }
    const oldUser = await UserModel.findOne({ username });
    if (oldUser) {
      return res.json({ error: 'User Exists' });
    }
    await UserModel.create({
      name,
      lastname,
      username,
      email,
      password: saltRounds,
      img: data,
      verified: false,
    });
    res.send({ status: 'Register Success' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

routers.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const userLogin = await UserModel.findOne({ email });
  if (!userLogin) {
    return res.json({ error: 'User Not found' });
  }
  if (await bcrypt.compare(password, userLogin.password)) {
    const token = jwt.sign(
      {
        _id: userLogin._id,
        name: userLogin.name,
        lastname: userLogin.lastname,
        email: userLogin.email,
        img: userLogin.img,
        verified: userLogin.verified,
      },
      jwtSecretKey,
      { expiresIn: '1h' }
    );

    if (res.status(201)) {
      return res.json({ status: 'Login Success', data: token });
    } else {
      return res.json({ error: 'error' });
    }
  }
  res.json({ status: 'error', error: 'Invalid Password' });
});

// Export

module.exports = routers;
