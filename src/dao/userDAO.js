import User from '../models/User.js';

class UserDAO {
    async getUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw new Error('No se pudo encontrar el usuario.');
        }
    }

    async getUserById(uid) {
        try {
            return await User.findById(uid);
        } catch (error) {
            console.error('Error al buscar usuario por ID:', error);
            throw new Error('No se pudo encontrar el usuario.');
        }
    }

    async registerUser(userData) {
        try {
            if (!userData.email || !userData.password) {
                throw new Error('El email y la contraseña son obligatorios.');
            }
            return await User.create(userData);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw new Error('No se pudo registrar el usuario.');
        }
    }
}

export default new UserDAO();