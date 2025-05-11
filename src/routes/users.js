import express from 'express';
import { getUserById, registerUser, getCurrentUser } from '../controllers/usuariosController.js';
import { authorizeRole, isAuthenticated } from '../middlewares/authMiddleware.js';
import { UserDTO } from '../dtos/UserDTO.js';

const router = express.Router();

router.get('/:uid', authorizeRole(['admin', 'user']), getUserById);

router.post('/register', registerUser);

router.get('/current', isAuthenticated, async (req, res) => {
    try {
        const userDTO = new UserDTO(req.user);
        res.status(200).json(userDTO);
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

export default router;