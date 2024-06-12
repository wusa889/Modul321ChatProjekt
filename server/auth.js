const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SokratesSecretCodeSecret'; 

// Middleware to verify the token
function verifyToken(req, res, next) {
  const token = req.query.token || req.headers['authorization'];
  if (!token) {
      return res.status(403).send('A token is required for authentication');
  }
  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
  } catch (err) {
      return res.status(401).send('Invalid Token');
  }
  return next();
}
module.exports = { verifyToken };