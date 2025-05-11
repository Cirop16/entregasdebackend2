import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    totalAmount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});

export default mongoose.model('Order', orderSchema);