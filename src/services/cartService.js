import cartDAO from '../dao/cartDAO.js';
import productDAO from '../dao/productDAO.js';
import ticketService from './ticketService.js';
import mongoose from 'mongoose';

class CartService {
    async createCart() {
        return await cartDAO.createCart();
    }

    async getCartById(cartId) {
        return await cartDAO.getById(cartId);
    }

async purchaseCart(cartId, purchaserEmail) {
    try {
        const cart = await cartDAO.getById(cartId);
        console.log('Carrito antes de compra:', cart);

        if (!cart) {
            console.error(`Carrito con ID ${cartId} no encontrado.`);
            return { error: 'Carrito no encontrado' };
        }

        if (!cart.items || cart.items.length === 0) {
            console.warn(`El carrito ${cartId} no tiene productos.`);
            return { error: 'El carrito está vacío.', unprocessedProducts: [] };
        }

        let totalAmount = 0;
        let unprocessedProducts = [];
        let purchasedProducts = [];

        for (let item of cart.items) {
            const productId = item.product._id ? item.product._id : item.product;

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                console.warn(`ID de producto inválido: ${productId}`);
                unprocessedProducts.push(productId);
                continue;
            }

            const product = await productDAO.getById(productId);
            if (!product) {
                console.warn(`Producto con ID ${productId} no encontrado.`);
                unprocessedProducts.push(productId);
                continue;
            }

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await productDAO.updateProduct(product._id, { stock: product.stock });
                totalAmount += product.price * item.quantity;
                purchasedProducts.push({ productId: product._id.toString(), quantity: item.quantity });
            } else {
                console.warn(`Stock insuficiente para producto ${productId}.`);
                unprocessedProducts.push(productId);
            }
        }

        let ticket = null;
        if (totalAmount > 0) {
            const ticketData = {
                code: `TCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                amount: totalAmount,
                purchaser: purchaserEmail
            };

            try {
                ticket = await ticketService.createTicket(ticketData);
            } catch (error) {
                console.error('Error al crear ticket:', error);
                return { error: 'Error al generar el ticket.', unprocessedProducts, totalAmount };
            }
        }

        console.log('Productos no procesados:', unprocessedProducts);

        cart.items = cart.items.filter(item => !unprocessedProducts.includes(item.product._id.toString()));
        await cartDAO.updateCart(cart);

        console.log('Carrito después de compra:', cart);

        return { ticket, purchasedProducts, unprocessedProducts, totalAmount };
    } catch (error) {
        console.error('Error en `purchaseCart`:', error);
        return { error: 'Error interno en proceso de compra.' };
    }
}
}

export default new CartService();