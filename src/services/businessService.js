import businessDAO from '../dao/businessDAO.js';

class BusinessService {
    async registerBusiness(businessData) {
        return await businessDAO.registerBusiness(businessData);
    }

    async getBusinessById(businessId) {
        return await businessDAO.getBusinessById(businessId);
    }
}

export default new BusinessService();