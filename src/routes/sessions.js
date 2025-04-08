import express from 'express';
import User from '../models/User.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.render('profile', { user });
});

export default router;