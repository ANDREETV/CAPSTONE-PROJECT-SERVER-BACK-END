const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.APP_JWT_SECRET_KEY;

// Middleware

const authLogin = (req, res, next) => {
  let token = req.headers.authorization;

  if (token) {
    const err = new Error('Not authorized');
    err.status = 401;
    next(err);
  } else {
    token = token.split(' ')[1];
    jwt.verify(token, jwtSecretKey, (err, data) => {
      if (err) {
        err.message = 'Invalid token';
        err.status = 401;
        next(err);
      } else {
        console.log(data);
      }
    });
  }
  next();
};

// Exports

module.exports = authLogin;
