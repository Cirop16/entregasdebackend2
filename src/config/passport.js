import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import userDAO from '../dao/userDAO.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const existingUser = await userDAO.getUserByEmail(email);
        if (existingUser) return done(null, false, { message: 'El usuario ya está registrado' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userDAO.registerUser({
            email,
            password: hashedPassword,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            role: req.body.role || 'user'
        });

        return done(null, newUser);
    } catch (error) {
        console.error('Error en registro:', error);
        return done(error);
    }
}));

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await userDAO.getUserByEmail(email);

        if (!user) return done(null, false, { message: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

        return done(null, user);
    } catch (error) {
        console.error('Error en login:', error);
        return done(error);
    }
}));

const cookieExtractor = (req) => {
    if (req && req.cookies) {
        return req.cookies.token || null;
    }
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOpts, async (jwt_payload, done) => {
    try {
        if (!jwt_payload.id) {
            return done(null, false, { message: 'Token inválido o sin ID.' });
        }

        const user = await userDAO.getUserById(jwt_payload.id);
        if (!user) {
            return done(null, false, { message: 'Token inválido o usuario no encontrado' });
        }
        return done(null, user);
    } catch (error) {
        console.error('Error en validación de token:', error);
        return done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userDAO.getUserById(id);
        if (!user) return done(null, false);
        done(null, user);
    } catch (error) {
        console.error('Error en deserialización:', error);
        done(error, null);
    }
});

export default passport;