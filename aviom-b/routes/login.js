const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { pool, findUserByUsername } = require('../db');
const bcrypt = require('bcrypt');

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




router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    const token = jwt.sign({ id: user.id, username: user.username, project_name: user.project_name, project_id: user.project_id }, JWT_SECRET, { expiresIn: '10min' });
    res.json({ token });
  })(req, res, next);
});



router.post('/register', async (req, res) => {
  const { firstName, lastName, company, email, phone, username, password, city } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      `INSERT INTO users (firstName, lastName, company, email, phone, username, password, city)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, company, email, phone, username, hashedPassword, city]
    );
    
    res.status(201).json({ message: 'Inscription réussie', userId: result.insertId });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
});



module.exports = router;
