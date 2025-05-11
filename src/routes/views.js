import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', { title: 'Bienvenido al Proyecto' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Iniciar sesión' });
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Registro de usuario' });
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { title: 'Mi Perfil', user: req.user });
});

router.get('/users', isAuthenticated, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden ver esta página.' });
    }
    res.render('users', { title: 'Lista de Usuarios' });
});

export default router;