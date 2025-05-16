import express from 'express';
import { createCart, purchaseCart, addProductToCart, getCart, updateCart, deleteProduct } from '../controllers/cartsController.js';
import { isAuthenticated, authorizeUser } from '../middlewares/authMiddleware.js';
import cartService from '../services/cartService.js';

const router = express.Router();

const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const newCart = await createCart(req, res);
        res.status(201).json({ message: 'Carrito creado correctamente.', cart: newCart });
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ message: 'Error interno al crear carrito.' });
    }
});

router.post('/:cartId/product/:productId', isAuthenticated, async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        if (!cartId.match(/^[0-9a-fA-F]{24}$/) || !productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID de carrito o producto inválido.' });
        }

        await addProductToCart(req, res);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error interno al agregar producto al carrito.' });
    }
});

router.get('/:cartId', isAuthenticated, async (req, res) => {
    try {
        const { cartId } = req.params;
        if (!isValidMongoId(cartId)) {
            return res.status(400).json({ message: 'ID de carrito inválido.' });
        }

        const cart = await getCart(req, res);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ message: 'Error interno al obtener carrito.' });
    }
});

router.post('/:cartId/purchase', isAuthenticated, async (req, res) => {
    try {
        const result = await cartService.purchaseCart(req.params.cartId, req.user.email);

        if (result.error) {
            return res.status(400).json({ message: result.error, productos_fallidos: result.unprocessedProducts });
        }

        return res.status(201).json({
            message: 'Compra procesada correctamente.',
            ticket: result.ticket,
            productos_comprados: result.purchasedProducts
        });
    } catch (error) {
        console.error('Error en proceso de compra:', error);
        return res.status(500).json({ message: 'Error interno en proceso de compra.' });
    }
});

router.put('/:cartId', isAuthenticated, async (req, res) => {
    try {
        const { cartId } = req.params;
        if (!isValidMongoId(cartId)) {
            return res.status(400).json({ message: 'ID de carrito inválido.' });
        }

        const updatedCart = await updateCart(req, res);
        res.status(200).json({ message: 'Carrito actualizado correctamente.', cart: updatedCart });
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
        res.status(500).json({ message: 'Error interno al actualizar carrito.' });
    }
});

router.delete('/:cartId/products/:productId', isAuthenticated, async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        if (!isValidMongoId(cartId) || !isValidMongoId(productId)) {
            return res.status(400).json({ message: 'ID de carrito o producto inválido.' });
        }

        const updatedCart = await deleteProduct(req, res);
        res.status(200).json({ message: 'Producto eliminado del carrito.', cart: updatedCart });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error interno al eliminar producto del carrito.' });
    }
});

export default router;