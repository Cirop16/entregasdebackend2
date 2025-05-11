import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    code: { type: String, unique: true, required: true },
    thumbnail: { type: [String], default: [] },
    status: { type: Boolean, default: true }
});

export default mongoose.model('Product', productSchema);