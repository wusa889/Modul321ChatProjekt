const jwt = require('jsonwebtoken');
const path = require('path');
const rootPath = path.resolve(__dirname, '..');
const SECRET_KEY = 'SokratesSecretCodeSecret'; 

// Middleware to verify the token
function verifyToken(req, res, next) {
  const token = req.query.token;
  const tokenh = req.headers['authorization']
  if (!token && !tokenh) {
    return res.sendFile(path.join(rootPath, 'client/login.html'));
  }

  try {
    let decoded;
    if(!token){
      let tokenFromHeader = tokenh.split(' ')[1];
      decoded = jwt.verify(tokenFromHeader, SECRET_KEY);
    }
    else{
      decoded = jwt.verify(token, SECRET_KEY);
    }
      req.user = decoded;
  } catch (err) {
    return res.sendFile(path.join(rootPath, 'client/login.html'));
  }
  return next();
}
module.exports = { verifyToken };