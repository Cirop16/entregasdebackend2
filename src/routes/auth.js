import express from 'express';
import passport from 'passport';

const router = express.Router();

router.post('/register', passport.authenticate('register', { session: false }), (req, res) => {
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: req.user });
});

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    res.status(200).json({ message: 'Inicio de sesión exitoso', token: req.user.token, user: req.user });
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión.' });
        }
        res.clearCookie('token');
        res.status(200).json({ message: 'Sesión cerrada correctamente.' });
    });
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    res.status(200).json({ user: req.user });
});

export default router;