import Cart from '../models/Cart.js';

class CartDAO {
    async getById(id) {
        return await Cart.findById(id).populate('products');
    }

    async create(cartData) {
        const newCart = new Cart(cartData);
        return await newCart.save();
    }

    async addProduct(cartId, productId, quantity) {
        return await Cart.findByIdAndUpdate(cartId, { $push: { products: { product: productId, quantity } } }, { new: true });
    }

    async deleteProduct(cartId, productId) {
        return await Cart.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } }, { new: true });
    }
}

export default new CartDAO();