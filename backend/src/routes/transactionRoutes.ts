import express from 'express';
import { createTransaction, getTransactions } from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createTransaction);
router.get('/', authenticate, getTransactions);

export default router;
