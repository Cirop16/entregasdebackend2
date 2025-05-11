import Ticket from '../models/Ticket.js';

class TicketDAO {
    async createTicket(ticketData) {
        try {
            if (!ticketData.amount || ticketData.amount <= 0) {
                throw new Error('El monto debe ser un número positivo.');
            }
            if (!ticketData.purchaser || typeof ticketData.purchaser !== 'string') {
                throw new Error('El comprador debe ser un correo válido.');
            }

            return await Ticket.create(ticketData);
        } catch (error) {
            console.error('Error al crear ticket:', error);
            throw new Error('No se pudo generar el ticket.');
        }
    }

    async getTicketsByUser(email) {
        try {
            if (!email || typeof email !== 'string') {
                throw new Error('El email proporcionado no es válido.');
            }
            return await Ticket.find({ purchaser: email });
        } catch (error) {
            console.error('Error al obtener tickets del usuario:', error);
            throw new Error('No se pudieron recuperar los tickets.');
        }
    }
}

export default new TicketDAO();