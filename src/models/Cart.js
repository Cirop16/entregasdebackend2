import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Carts', cartSchema);

export default Cart;