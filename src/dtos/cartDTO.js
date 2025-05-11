export const formatCartResponse = (cart) => {
    return {
        id: cart._id,
        userId: cart.userId,
        items: cart.items.map(item => ({
            productId: item.product._id,
            name: item.product.name,
            quantity: item.quantity
        })),
        totalPrice: cart.totalPrice
    };
};