const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'd1cdf1v5dggvbf1gbb1fg5';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    // Token format "Bearer <token>"
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        // Token invalid or out to date
        return res.status(403).json({ message: 'Token invalide ou expiré' });
      }
      // Token valid
      req.user = decoded;
      console.log(req.user);
      next();
    });
  } else {
    // no token
    res.status(401).json({ message: 'Token manquant' });
  }
};

module.exports = authenticateJWT;


