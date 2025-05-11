import Product from '../models/Product.js';

class ProductDAO {
    async createProduct(productData) {
        return await Product.create(productData);
    }

    async getAll() {
        return await Product.find();
    }

    async getById(productId) {
        return await Product.findById(productId);
    }

    async updateProduct(productId, updatedData) {
        return await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    }

    async deleteProduct(productId) {
        return await Product.findByIdAndDelete(productId);
    }
}

export default new ProductDAO();