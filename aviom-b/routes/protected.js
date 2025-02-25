const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'd1cdf1v5dggvbf1gbb1fg5';

/*
// Middleware pour protéger les routes
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Format attendu: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get('/', authenticateJWT, (req, res) => {
  res.json({ message: 'Accès protégé', user: req.user });
});

*/

// Middleware de protection par JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Le format attendu est "Bearer <token>"
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get('/', authenticateJWT, (req, res) => {
  res.json({ message: 'Accès protégé', user: req.user });
});

module.exports = router;
