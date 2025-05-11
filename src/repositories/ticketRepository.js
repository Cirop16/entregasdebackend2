import ticketDAO from '../dao/ticketDAO.js';

class TicketRepository {
    async createTicket(ticketData) {
        return await ticketDAO.createTicket(ticketData);
    }

    async getTicketsByUser(email) {
        return await ticketDAO.getTicketsByUser(email);
    }
}

export default new TicketRepository();