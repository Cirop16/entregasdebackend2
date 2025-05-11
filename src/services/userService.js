import userDAO from '../dao/userDAO.js';

class UserService {
    async getUserById(userId) {
        return await userDAO.getUserById(userId);
    }

    async registerUser(userData) {
        return await userDAO.registerUser(userData);
    }
}

export default new UserService();