import cartDAO from '../dao/cartDAO.js';
import productDAO from '../dao/productDAO.js';
import ticketService from './ticketService.js';

class CartService {
    async createCart() {
        return await cartDAO.createCart();
    }

    async getCartById(cartId) {
        return await cartDAO.getById(cartId);
    }

    async purchaseCart(cartId, purchaserEmail) {
        const cart = await cartDAO.getById(cartId);
        if (!cart) return { error: 'Carrito no encontrado' };

        let totalAmount = 0;
        let unprocessedProducts = [];

        for (let item of cart.products) {
            const product = await productDAO.getById(item.product);
            if (product && product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await productDAO.updateProduct(product._id, { stock: product.stock });
                totalAmount += product.price * item.quantity;
            } else {
                unprocessedProducts.push(item.product);
            }
        }

        if (totalAmount > 0) {
            const ticketData = {
                code: `TCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                amount: totalAmount,
                purchaser: purchaserEmail
            };
            await ticketService.createTicket(ticketData);
        }

        cart.products = cart.products.filter(item => unprocessedProducts.includes(item.product));
        await cartDAO.updateCart(cart);

        return { unprocessedProducts, totalAmount };
    }
}

export default new CartService();