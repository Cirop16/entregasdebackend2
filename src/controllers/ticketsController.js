import ticketService from '../services/ticketService.js';

export const purchaseCart = async (req, res) => {
    try {
        const { amount, purchaser } = req.body;

        if (!amount || amount <= 0 || typeof amount !== 'number') {
            return res.status(400).json({ message: 'El monto debe ser un número positivo.' });
        }
        if (!purchaser || typeof purchaser !== 'string' || !purchaser.includes('@')) {
            return res.status(400).json({ message: 'El comprador debe ser un correo electrónico válido.' });
        }

        const newTicket = await ticketService.createTicket({ amount, purchaser });
        res.status(201).json({ message: 'Compra realizada con éxito', ticket: newTicket });
    } catch (error) {
        console.error('Error al generar ticket:', error.message);
        res.status(500).json({ message: 'Error interno al procesar la compra.' });
    }
};