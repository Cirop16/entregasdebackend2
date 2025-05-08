import Ticket from '../models/Ticket.js';

class TicketDAO {
    async createTicket(ticketData) {
        const newTicket = new Ticket(ticketData);
        return await newTicket.save();
    }
}

export default new TicketDAO();