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
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden crear productos.' });
        }

        const { name, price, description } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: 'El nombre y el precio son obligatorios.' });
        }

        const newProduct = await productDAO.create({ name, price, description });
        res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
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