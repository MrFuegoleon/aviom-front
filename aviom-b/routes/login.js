const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'd1cdf1v5dggvbf1gbb1fg5';

/*
// Route de login qui authentifie l'utilisateur et génère un JWT
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  })(req, res, next);
});

*/


// Route de login qui authentifie l'utilisateur et génère un JWT
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    // Générer un token JWT avec expiration 1h
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1min' });
    res.json({ token });
  })(req, res, next);
});


module.exports = router;
