import passport from 'passport';
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Se requiere autenticación.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};

//export const isAuthenticated = passport.authenticate('jwt', { session: false });

/*export const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    next();
};*/

export const isAuthenticated = (req, res, next) => {
    console.log('Verificando autenticación...');

    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            console.error('Error de autenticación:', err);
            return res.status(401).json({ message: 'No autorizado. Token inválido o usuario no encontrado.' });
        }

        console.log('Usuario autenticado:', user.email);
        req.user = user;
        return next();
    })(req, res, next);
};

export const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'No autorizado. Se requiere autenticación.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permisos suficientes.' });
        }

        next();
    };
};

//si genera problemas, elminar
export const authorizeUser = (req, res, next) => {
    if (!req.user || req.user.role !== 'user') {
        return res.status(403).json({ message: 'Solo los usuarios pueden agregar productos a su carrito.' });
    }
    next();
};

export const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.role || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
};