import ticketDAO from '../dao/ticketDAO.js';

class TicketService {
    async createTicket(ticketData) {
        return await ticketDAO.createTicket(ticketData);
    }
}

export default new TicketService();