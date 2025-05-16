import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const logout = async (req, res) => {
    try {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al cerrar sesión.' });
            }
            res.clearCookie('token');
            res.status(200).json({ message: 'Sesión cerrada correctamente.' });
        });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export const loginSuccess = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autorizado. Credenciales incorrectas o sesión inválida.' });
    }
    const token = generateToken(req.user);
    res.status(200).json({ message: 'Inicio de sesión exitoso', token, user: req.user });
};

export const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya está registrado.' });
        }

        const newUser = new User({ email, password, role: role || 'user' });
        await newUser.save();

        const token = generateToken(newUser);
        res.status(201).json({ message: 'Registro exitoso', token, user: newUser });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno al registrar usuario' });
    }
};