import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import sessionsRoutes from './routes/sessions.js';
import profileRoutes from './routes/profile.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import viewRoutes from './routes/views.js';
import { fileURLToPath } from 'url';
import usersRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.engine('handlebars', engine({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_seguro', //hasheo(?)
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.render('home', { title: 'Bienvenido al Proyecto' }));
app.get('/register', (req, res) => res.render('register', { title: 'Registro de usuario' }));
app.get('/login', (req, res) => res.render('login', { title: 'Iniciar sesión' }));
app.get('/profile', (req, res) => res.render('profile', { title: 'Mi Perfil' }));

app.use('/users', usersRoutes);
app.use('/', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/', viewRoutes);

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión:', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));