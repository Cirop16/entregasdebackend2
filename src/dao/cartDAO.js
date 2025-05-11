import Cart from '../models/Cart.js';

class CartDAO {
    async createCart(userId) {
        try {
            const newCart = await Cart.create({ userId, items: [] });
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw new Error('No se pudo crear el carrito');
        }
    }

    async getById(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('items.product');
            return cart || null;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw new Error('No se pudo encontrar el carrito');
        }
    }

    async updateCart(cartId, updatedItems) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.items = updatedItems;
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw new Error('No se pudo actualizar el carrito');
        }
    }
}

export default new CartDAO();