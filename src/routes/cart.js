import express from 'express';
import CartManager from '../managers/cartManager.js';

const router = express.Router();
const cartManager = new CartManager();

router.post('/add', async (req, res) => {
    const result = await cartManager.addToCart(req.body);
    res.json(result);
});

export default router;