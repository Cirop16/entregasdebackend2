import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.get('/register', (req, res) => res.render('register'));
router.post('/register', register);
router.get('/login', (req, res) => res.render('login'));
router.post('/login', login);
router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/login');
});

export default router;