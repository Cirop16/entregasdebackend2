import Order from '../models/Order.js';

class OrderDAO {
    async createOrder(orderData) {
        return await Order.create(orderData);
    }

    async getAllOrders() {
        return await Order.find().populate('products.product');
    }

    async getOrderById(orderId) {
        return await Order.findById(orderId).populate('products.product');
    }
}

export default new OrderDAO();