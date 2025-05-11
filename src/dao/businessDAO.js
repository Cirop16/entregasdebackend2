import Business from '../models/Business.js';

class BusinessDAO {
    async registerBusiness(businessData) {
        return await Business.create(businessData);
    }

    async getBusinessById(businessId) {
        return await Business.findById(businessId).populate('products');
    }
}

export default new BusinessDAO();