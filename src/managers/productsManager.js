class ProductsManager {
    async getAll() {
        return await Product.find();
    }

    async create(data) {
        const newProduct = new Product(data);
        return await newProduct.save();
    }
}

export default ProductsManager;