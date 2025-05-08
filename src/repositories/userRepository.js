import userDAO from '../dao/userDAO.js';
import UserDTO from '../dtos/userDTO.js';

class UserRepository {
    async getUserById(id) {
        const user = await userDAO.getById(id);
        return user ? new UserDTO(user) : null;
    }

    async getUserByEmail(email) {
        const user = await userDAO.getByEmail(email);
        return user ? new UserDTO(user) : null;
    }

    async registerUser(userData) {
        const newUser = await userDAO.create(userData);
        return new UserDTO(newUser);
    }
}

export default new UserRepository();