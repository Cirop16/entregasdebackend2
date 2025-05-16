export class TicketDTO {
    constructor(ticket) {
        this.code = ticket.code || 'SIN-CÓDIGO';
        this.purchase_datetime = ticket.purchase_datetime ? new Date(ticket.purchase_datetime).toLocaleString() : 'Fecha desconocida';
        this.amount = typeof ticket.amount === 'number' && ticket.amount > 0 ? ticket.amount : 0;
        this.purchaser = ticket.purchaser || 'Comprador desconocido';
    }
}