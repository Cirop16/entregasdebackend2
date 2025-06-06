import userDAO from '../dao/userDAO.js';

class UserRepository {
    async getUserByEmail(email) {
        return await userDAO.getUserByEmail(email);
    }

    async getUserById(userId) {
        return await userDAO.getUserById(userId);
    }

    async registerUser(userData) {
        return await userDAO.registerUser(userData);
    }
}

export default new UserRepository();