import express from 'express';
import { createCart, purchaseCart, addProductToCart, getCart, updateCart, deleteProduct } from '../controllers/cartsController.js';
import { isAuthenticated, authorizeUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', isAuthenticated, async (req, res, next) => {
    try {
        await createCart(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/:cartId/products', isAuthenticated, authorizeUser, async (req, res, next) => {
    try {
        const { cartId } = req.params;
        if (!cartId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID de carrito inválido' });
        }
        await addProductToCart(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:cartId', isAuthenticated, async (req, res, next) => {
    try {
        const { cartId } = req.params;
        if (!cartId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID de carrito inválido' });
        }
        await getCart(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/:cartId/purchase', isAuthenticated, authorizeUser, async (req, res, next) => {
    try {
        const { cartId } = req.params;
        if (!cartId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID de carrito inválido' });
        }
        await purchaseCart(req, res);
    } catch (error) {
        next(error);
    }
});

router.put('/:cartId', isAuthenticated, async (req, res, next) => {
    try {
        const { cartId } = req.params;
        if (!cartId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID de carrito inválido' });
        }
        await updateCart(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete('/:cartId/products/:productId', isAuthenticated, async (req, res, next) => {
    try {
        const { cartId, productId } = req.params;
        if (!cartId.match(/^[0-9a-fA-F]{24}$/) || !productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID de carrito o producto inválido' });
        }
        await deleteProduct(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;