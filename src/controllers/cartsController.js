import cartService from '../services/cartService.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import cartDAO from '../dao/cartDAO.js';

const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export const createCart = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'El usuario debe estar autenticado para crear un carrito.' });
        }

        const newCart = await Cart.create({ userId: req.user.id, items: [] });
        res.status(201).json({ message: 'Carrito creado correctamente', cart: newCart });
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ message: 'Error interno al crear el carrito.' });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            console.warn(`Carrito con ID ${cartId} no encontrado.`);
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Stock insuficiente.' });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: 'Producto agregado al carrito.', cart });
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

export const purchaseCart = async (req, res) => {
    try {
        console.log('Usuario autenticado:', req.user);
        console.log('Carrito ID recibido:', req.params.cartId);

        if (!req.user || req.user.role !== 'user') {
            return res.status(403).json({ message: 'Solo los usuarios pueden comprar su carrito.' });
        }

        const cart = await Cart.findById(req.params.cartId).populate('items.product');
        if (!cart) {
            console.warn(`Carrito con ID ${req.params.cartId} no encontrado.`);
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        let totalAmount = 0;
        const purchasedProducts = [];
        const failedProducts = [];

        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                failedProducts.push(item.product._id);
                continue;
            }

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                totalAmount += product.price * item.quantity;
                purchasedProducts.push({ productId: product._id, quantity: item.quantity });
            } else {
                failedProducts.push(item.product._id);
            }
        }

        if (purchasedProducts.length === 0) {
            return res.status(400).json({ message: 'No se pudo procesar la compra por falta de stock.', productos_fallidos: failedProducts });
        }

        const ticket = await cartService.createTicket(totalAmount, req.user.email);
        cart.items = cart.items.filter(item => !failedProducts.includes(item.product._id));
        await cart.save();

        res.status(201).json({
            message: 'Compra procesada.',
            ticket,
            productos_comprados: purchasedProducts,
            productos_fallidos: failedProducts
        });
    } catch (error) {
        console.error('Error en proceso de compra:', error);
        res.status(500).json({ message: 'Error interno en proceso de compra.', error: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const cart = await Cart.findById(cartId).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado.' });

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

export const updateCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { items } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado.' });

        cart.items = items;
        await cart.save();
        res.status(200).json({ message: 'Carrito actualizado', cart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado.' });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.status(200).json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};