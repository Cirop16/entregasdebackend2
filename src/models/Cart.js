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
    const productIds = this.items.map(item => item.product);
    const products = await mongoose.model('Product').find({ _id: { $in: productIds } });

    const productMap = products.reduce((acc, product) => {
        acc[product._id] = product.price;
        return acc;
    }, {});

    this.totalPrice = this.items.reduce((total, item) => {
        return total + (productMap[item.product] * item.quantity || 0);
    }, 0);

    await this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;