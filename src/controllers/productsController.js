import productService from '../services/productService.js';
import Product from '../models/Product.js'
import productDAO from '../dao/productDAO.js';

export const getProducts = async (req, res) => {
    try {
        const products = await productDAO.getAll();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createProduct = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        const { title, description, price, category, stock, code, thumbnail, status } = req.body;

        if (!title || !description || !price || !category || !stock || !code) {
            return res.status(400).json({ message: 'El título, descripción, precio, categoría, stock y código son obligatorios.' });
        }

        const existingProduct = await Product.findOne({ code });
        if (existingProduct) {
            return res.status(400).json({ message: 'El código de producto ya está en uso.' });
        }

        const newProduct = new Product({ title, description, price, category, stock, code, thumbnail, status });
        await newProduct.save();

        res.status(201).json({ message: 'Producto creado correctamente.', product: newProduct });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden actualizar productos.' });
        }

        const { pid } = req.params;
        const { name, price, description } = req.body;

        const updatedProduct = await productDAO.update(pid, { name, price, description });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto actualizado correctamente', product: updatedProduct });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden eliminar productos.' });
        }

        const { pid } = req.params;
        const deletedProduct = await productDAO.delete(pid);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};