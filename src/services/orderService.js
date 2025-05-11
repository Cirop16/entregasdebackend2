import orderDAO from '../dao/orderDAO.js';

class OrderService {
    async createOrder(orderData) {
        return await orderDAO.createOrder(orderData);
    }

    async getAllOrders() {
        return await orderDAO.getAllOrders();
    }

    async getOrderById(orderId) {
        return await orderDAO.getOrderById(orderId);
    }
}

export default new OrderService();