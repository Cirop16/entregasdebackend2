import User from '../models/User.js';

class UserDAO {
    async getById(id) {
        return await User.findById(id);
    }

    async getByEmail(email) {
        return await User.findOne({ email });
    }

    async create(userData) {
        const newUser = new User(userData);
        return await newUser.save();
    }
}

export default new UserDAO();