import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const user = await User.findById(req.session.user._id); // ✅ Buscar usuario en DB

    res.render('profile', { user }); // ✅ Pasar datos a la vista
});

export default router;