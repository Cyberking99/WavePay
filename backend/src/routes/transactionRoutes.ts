import express from 'express';
import { createTransaction, getTransactions, getTransactionById } from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createTransaction);
router.get('/', authenticate, getTransactions);
router.get('/:id', authenticate, getTransactionById);

export default router;
