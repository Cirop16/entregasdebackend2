import orderService from '../services/orderService.js';

export const createOrder = async (req, res) => {
    try {
        const newOrder = await orderService.createOrder(req.body);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la orden' });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener órdenes' });
    }
};