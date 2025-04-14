import express from 'express';
import ViewManager from '../managers/viewManager.js';

const router = express.Router();
const viewManager = new ViewManager();

router.get('/home', (req, res) => viewManager.renderHome(req, res));
router.get('/register', (req, res) => viewManager.renderRegister(req, res));
router.get('/profile', (req, res) => viewManager.renderProfile(req, res));

export default router;