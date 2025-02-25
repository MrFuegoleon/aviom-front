const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'd1cdf1v5dggvbf1gbb1fg5';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    // Le format attendu est "Bearer <token>"
    const token = authHeader.split(' ')[1];
    console.log(token);
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        // Token invalide ou expiré
        return res.status(403).json({ message: 'Token invalide ou expiré' });
      }
      // Token valide, on peut attacher les informations à la requête
      req.user = decoded;
      next();
    });
  } else {
    // Pas de token fourni
    res.status(401).json({ message: 'Token manquant' });
  }
};

module.exports = authenticateJWT;
