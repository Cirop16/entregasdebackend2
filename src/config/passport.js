import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return done(null, false, { message: 'El usuario ya está registrado' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, ...req.body });
        await newUser.save();

        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            console.log("Contraseña ingresada:", password);
            console.log("Contraseña en BD:", user.password);
            console.log("Resultado de comparación:", isPasswordCorrect);
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

const cookieExtractor = req => req.cookies?.token;
const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOpts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        return user ? done(null, user) : done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;