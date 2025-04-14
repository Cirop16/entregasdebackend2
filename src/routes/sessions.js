import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', passport.authenticate('register', { session: false }), (req, res) => {
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: req.user });
});

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Inicio de sesión exitoso', token, user: req.user });
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

export default router;