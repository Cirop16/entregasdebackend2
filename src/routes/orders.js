import express from 'express';
import { createOrder, getOrders } from '../controllers/ordenesController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);

export default router;