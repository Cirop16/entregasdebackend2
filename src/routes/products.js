import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        await getProducts(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/', isAuthenticated, authorizeRole(['admin']), async (req, res, next) => {
    try {
        const { name, price, description } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: 'El nombre y precio son obligatorios.' });
        }
        await createProduct(req, res);
    } catch (error) {
        next(error);
    }
});

router.put('/:pid', isAuthenticated, authorizeRole(['admin']), async (req, res, next) => {
    try {
        const { pid } = req.params;
        if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID de producto inválido.' });
        }

        const productExists = await updateProduct(req, res);
        if (!productExists) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:pid', isAuthenticated, authorizeRole(['admin']), async (req, res, next) => {
    try {
        const { pid } = req.params;
        if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID de producto inválido.' });
        }

        const productExists = await deleteProduct(req, res);
        if (!productExists) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
    } catch (error) {
        next(error);
    }
});

export default router;