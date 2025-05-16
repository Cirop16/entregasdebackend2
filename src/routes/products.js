import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

router.get('/', async (req, res) => {
    try {
        await getProducts(req, res);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno al obtener productos.' });
    }
});

router.post('/', isAuthenticated, authorizeRole(['admin']), async (req, res) => {
    try {
        await createProduct(req, res);
    } catch (error) {
        console.error('Error en la creación de productos:', error);
        res.status(500).json({ message: 'Error interno al crear producto.' });
    }
});

router.put('/:pid', isAuthenticated, authorizeRole(['admin']), async (req, res) => {
    try {
        const { pid } = req.params;
        if (!isValidMongoId(pid)) {
            return res.status(400).json({ message: 'ID de producto inválido.' });
        }

        const updatedProduct = await updateProduct(req, res);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.status(200).json({ message: 'Producto actualizado correctamente.', product: updatedProduct });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error interno al actualizar producto.' });
    }
});

router.delete('/:pid', isAuthenticated, authorizeRole(['admin']), async (req, res) => {
    try {
        const { pid } = req.params;
        if (!isValidMongoId(pid)) {
            return res.status(400).json({ message: 'ID de producto inválido.' });
        }

        const deletedProduct = await deleteProduct(req, res);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.status(200).json({ message: 'Producto eliminado correctamente.', product: deletedProduct });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error interno al eliminar producto.' });
    }
});

export default router;