import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const user = await userRepository.registerUser(req.body);
        res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

router.post('/login', passport.authenticate('login', { session: false }), async (req, res) => {
    try {
        const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'Inicio de sesión exitoso', token, user: req.user });
    } catch (error) {
        res.status(500).json({ message: 'Error en el inicio de sesión' });
    }
});

router.get('/current', isAuthenticated, async (req, res) => {
    try {
        const user = await userRepository.getUserById(req.user.id);
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error en logout:', err);
            return res.status(500).json({ message: 'Error al cerrar sesión.' });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al eliminar la sesión:', err);
                return res.status(500).json({ message: 'Error al eliminar la sesión.' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Sesión cerrada correctamente.' });
        });
    });
});

export default router;