import productDAO from '../dao/productDAO.js';
import ProductDTO from '../dtos/productDTO.js';

class ProductRepository {
    async getProducts() {
        const products = await productDAO.getAll();
        return products.map(product => new ProductDTO(product));
    }

    async getProductById(id) {
        const product = await productDAO.getById(id);
        return product ? new ProductDTO(product) : null;
    }

    async createProduct(productData) {
        const newProduct = await productDAO.create(productData);
        return new ProductDTO(newProduct);
    }

    async updateProduct(id, productData) {
        const updatedProduct = await productDAO.update(id, productData);
        return new ProductDTO(updatedProduct);
    }

    async deleteProduct(id) {
        return await productDAO.delete(id);
    }
}

export default new ProductRepository();