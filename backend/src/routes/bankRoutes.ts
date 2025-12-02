import express from 'express';
import { addBankAccount, getBankAccounts } from '../controllers/bankController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, addBankAccount);
router.get('/', authenticate, getBankAccounts);

export default router;
