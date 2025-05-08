import express from 'express';
import ProductsManager from '../managers/productsManager.js';
import { authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();
const productsManager = new ProductsManager();

router.get('/', async (req, res) => {
    try {
        const products = await productsManager.getAll();
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/', authorizeRole(['admin']), async (req, res) => {
    try {
        const newProduct = await productsManager.create(req.body);
        res.json(newProduct);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.put('/:id', authorizeRole(['admin']), async (req, res) => {
    try {
        const updatedProduct = await productsManager.update(req.params.id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.delete('/:id', authorizeRole(['admin']), async (req, res) => {
    try {
        await productsManager.delete(req.params.id);
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;