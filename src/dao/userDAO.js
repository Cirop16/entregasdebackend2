import User from '../models/User.js';

class UserDAO {
    async getUserByEmail(email) {
        return await User.findOne({ email });
    }

    async registerUser(userData) {
        return await User.create(userData);
    }
}

export default new UserDAO();