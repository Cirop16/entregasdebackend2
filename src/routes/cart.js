import express from 'express';
import cartRepository from '../repositories/cartRepository.js';
import { authorizeRole } from '../middlewares/authMiddleware.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartRepository.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/add', authorizeRole(['user']), async (req, res) => {
    try {
        const result = await cartRepository.addProductToCart(req.user.cartId, req.body.productId, req.body.quantity);
        res.json(result);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.get('/', authorizeRole(['user']), async (req, res) => {
    try {
        const cart = await cartRepository.getCartById(req.user.cartId);
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/:cid/purchase', isAuthenticated, async (req, res) => {
    try {
        const result = await cartRepository.purchaseCart(req.params.cid, req.user.email);
        res.json(result);
    } catch (error) {
        console.error('Error en proceso de compra:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;