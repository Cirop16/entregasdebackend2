class OrderDTO {
    constructor(order) {
        this.code = order.code;
        this.purchase_datetime = order.purchase_datetime;
        this.products = order.products.map(p => ({
            product: p.product.title,
            quantity: p.quantity
        }));
        this.totalAmount = order.totalAmount;
        this.purchaser = order.purchaser;
    }
}

export default OrderDTO;