class CartManager {
    async addToCart({ userId, productId, quantity }) {
        const cart = await Cart.findOne({ user: userId }) || new Cart({ user: userId, items: [] });

        cart.items.push({ product: productId, quantity });
        await cart.save();

        return cart;
    }
}

export default CartManager;