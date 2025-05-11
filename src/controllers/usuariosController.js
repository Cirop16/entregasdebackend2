import userService from '../services/userService.js';

export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.uid);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Usuario no encontrado' });
    }
};

export const registerUser = async (req, res) => {
    try {
        const newUser = await userService.registerUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const userDTO = new UserDTO(req.user);
        res.status(200).json(userDTO);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};