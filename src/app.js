import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import passport from './config/passportConfig.js';
import authRoutes from './routes/auth.js';
import sessionsRoutes from './routes/sessions.js';
import { fileURLToPath } from 'url';

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
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home', { title: 'Bienvenido al Proyecto' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Registro de usuario' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Iniciar sesión' });
});

app.get('/profile', (req, res) => {
    res.render('profile', { title: 'Mi Perfil' });
});

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionsRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión:', err));


const PORT = process.env.PORT || 3000; //sacar si funciona

app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));