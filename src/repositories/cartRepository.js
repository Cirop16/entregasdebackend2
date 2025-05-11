import cartDAO from '../dao/cartDAO.js';

class CartRepository {
    async createCart() {
        return await cartDAO.createCart();
    }

    async getCartById(cartId) {
        return await cartDAO.getById(cartId);
    }

    async updateCart(cart) {
        return await cartDAO.updateCart(cart);
    }
}

export default new CartRepository();