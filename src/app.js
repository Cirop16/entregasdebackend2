import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './config/passport.js';
import connectDB from './config/database.js';
import { fileURLToPath } from 'url';
import { errorHandler } from './middlewares/errorMiddleware.js';
import authRoutes from './routes/auth.js';
import sessionsRoutes from './routes/sessions.js';
import profileRoutes from './routes/profile.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/carts.js';
import viewRoutes from './routes/views.js';
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
    secret: process.env.SESSION_SECRET || 'tu_secreto_seguro',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', profileRoutes);
app.use('/', viewRoutes);

app.get('/', (req, res) => {
    res.render('home', { title: 'Bienvenido al Proyecto' });
});

app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`));