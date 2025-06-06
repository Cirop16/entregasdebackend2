import productDAO from '../dao/productDAO.js';

class ProductRepository {
    async getProducts() {
        return await productDAO.getAll();
    }

    async getProductById(productId) {
        return await productDAO.getById(productId);
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

export default new ProductRepository();