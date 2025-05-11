import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('🟢 Conectado a MongoDB');
    } catch (error) {
        console.error('🔴 Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;