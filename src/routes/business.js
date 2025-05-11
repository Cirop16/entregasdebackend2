import express from 'express';
import { registerBusiness, getBusinessById } from '../controllers/negociosController.js';

const router = express.Router();

router.post('/', registerBusiness);
router.get('/:bid', getBusinessById);

export default router;