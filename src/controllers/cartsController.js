import cartService from '../services/cartService.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import cartDAO from '../dao/cartDAO.js';

export const createCart = async (req, res) => {
    try {
        const newCart = await cartDAO.createCart(req.user._id);
        res.status(201).json({ message: 'Carrito creado exitosamente', cart: newCart });
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { product, quantity } = req.body;

        if (!product || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Producto y cantidad deben ser válidos.' });
        }

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        const productExists = await Product.findById(product);
        if (!productExists) return res.status(404).json({ message: 'Producto no encontrado' });

        if (productExists.stock < quantity) {
            return res.status(400).json({ message: 'Stock insuficiente para la cantidad requerida.' });
        }

        const existingItem = cart.items.find(item => item.product.toString() === product);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product, quantity });
        }

        await cart.save();
        res.status(200).json({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const cart = await Cart.findById(cid).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        let totalAmount = 0;
        const purchasedProducts = [];
        const failedProducts = [];

for (const item of cart.items) {
    const product = await Product.findById(item.product._id);

    if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        totalAmount += product.price * item.quantity;
        purchasedProducts.push(item);
    } else {
        failedProducts.push(item.product._id);
    }
}

if (purchasedProducts.length === 0) {
    return res.status(400).json({ message: 'No se pudo procesar la compra por falta de stock.', productos_fallidos: failedProducts });
}

await cartService.createTicket(totalAmount, req.user.email);

cart.items = cart.items.filter(item => failedProducts.includes(item.product._id));
await cart.save();

res.status(201).json({ 
    message: 'Compra procesada', 
    ticket, 
    productos_comprados: purchasedProducts,
    productos_fallidos: failedProducts 
});

    } catch (error) {
        console.error('Error en proceso de compra:', error);
        res.status(500).json({ message: 'Error interno en proceso de compra.' });
    }
};

export const getCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const cart = await Cart.findById(cartId).populate('items.product');

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const updateCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { items } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.items = items;
        await cart.save();

        res.status(200).json({ message: 'Carrito actualizado', cart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};