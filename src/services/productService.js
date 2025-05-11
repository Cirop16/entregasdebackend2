import productDAO from '../dao/productDAO.js';

class ProductService {
    async getProducts() {
        return await productDAO.getAll();
    }

    async createProduct(productData) {
        return await productDAO.createProduct(productData);
    }

    async updateProduct(productId, updatedData) {
        return await productDAO.updateProduct(productId, updatedData);
    }

    async deleteProduct(productId) {
        return await productDAO.deleteProduct(productId);
    }
}

export default new ProductService();