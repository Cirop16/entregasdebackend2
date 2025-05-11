import ticketDAO from '../dao/ticketDAO.js';
import { TicketDTO } from '../dtos/TicketDTO.js';

class TicketService {
    async createTicket(ticketData) {
        try {
            const { amount, purchaser } = ticketData;

            if (!amount || amount <= 0 || typeof amount !== 'number') {
                throw new Error('El monto de la compra debe ser un número positivo.');
            }
            if (!purchaser || typeof purchaser !== 'string' || !purchaser.includes('@')) {
                throw new Error('El comprador debe ser un correo electrónico válido.');
            }

            const ticket = await ticketDAO.createTicket(ticketData);
            return new TicketDTO(ticket);
        } catch (error) {
            console.error('Error al crear ticket:', error.message);
            throw new Error('No se pudo generar el ticket, revisa los datos de la compra.');
        }
    }

    async getTicketsByUser(email) {
        try {
            if (!email || typeof email !== 'string' || !email.includes('@')) {
                throw new Error('El email proporcionado no es válido.');
            }
            
            const tickets = await ticketDAO.getTicketsByUser(email);
            return tickets.map(ticket => new TicketDTO(ticket));
        } catch (error) {
            console.error('Error al obtener tickets del usuario:', error.message);
            throw new Error('No se pudieron recuperar los tickets, intenta más tarde.');
        }
    }
}

export default new TicketService();