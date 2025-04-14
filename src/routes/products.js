import express from 'express';
import ProductsManager from '../managers/productsManager.js';

const router = express.Router();
const productsManager = new ProductsManager();

router.get('/', async (req, res) => {
    const products = await productsManager.getAll();
    res.json(products);
});

router.post('/', async (req, res) => {
    const newProduct = await productsManager.create(req.body);
    res.json(newProduct);
});

export default router;