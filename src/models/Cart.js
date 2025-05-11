import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalPrice: { type: Number, default: 0 },
}, { timestamps: true });

cartSchema.methods.calculateTotal = async function () {
    let total = 0;
    for (const item of this.items) {
        const product = await mongoose.model('Product').findById(item.product);
        if (product) total += product.price * item.quantity;
    }
    this.totalPrice = total;
    await this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;