import cartDAO from '../dao/cartDAO.js';
import productDAO from '../dao/productDAO.js';
import ticketService from '../services/ticketService.js';
import CartDTO from '../dtos/cartDTO.js';

class CartRepository {
    async getCartById(id) {
        const cart = await cartDAO.getById(id);
        return cart ? new CartDTO(cart) : null;
    }

    async createCart(cartData) {
        const newCart = await cartDAO.create(cartData);
        return new CartDTO(newCart);
    }

    async addProductToCart(cartId, productId, quantity) {
        const updatedCart = await cartDAO.addProduct(cartId, productId, quantity);
        return new CartDTO(updatedCart);
    }

    async removeProductFromCart(cartId, productId) {
        const updatedCart = await cartDAO.deleteProduct(cartId, productId);
        return new CartDTO(updatedCart);
    }

    async purchaseCart(cartId, purchaserEmail) {
        const cart = await cartDAO.getById(cartId);
        if (!cart) return { error: 'Carrito no encontrado' };

        let totalAmount = 0;
        let unprocessedProducts = [];

        for (let item of cart.products) {
            const product = await productDAO.getById(item.product);
            if (!product) {
                unprocessedProducts.push(item.product);
                continue;
            }

            if (product.stock >= item.quantity) {
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

export default new CartRepository();