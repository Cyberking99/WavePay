import express from 'express';
import { addBankAccount, getBankAccounts, deleteBankAccount } from '../controllers/bankController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, addBankAccount);
router.get('/', authenticate, getBankAccounts);
router.delete('/:id', authenticate, deleteBankAccount);

export default router;
