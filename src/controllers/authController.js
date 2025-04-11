import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Cart from '../models/Cart.js';

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, cart, role } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ first_name, last_name, email, age, password: hashedPassword, cart, role });
        await newUser.save();

        const newCart = new Cart({ user: newUser._id, items: [] });
        await newCart.save();

        newUser.cart = newCart._id;
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Usuario registrado exitosamente', token });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error interno en el servidor', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        console.log("Contraseña ingresada:", password);
        console.log("Contraseña en BD:", user.password);
        console.log("Resultado de comparación:", isPasswordCorrect);
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token, user });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno en el servidor', error: error.message });
    }
};