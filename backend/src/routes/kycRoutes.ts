import { Router } from "express";
import { submitKyc, getKycStatus, getBanks, verifyBankAccount } from "../controllers/kycController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get('/banks', authenticate, getBanks);
router.post('/verify-account', authenticate, verifyBankAccount);
router.post('/', authenticate, submitKyc);
router.get('/status', authenticate, getKycStatus);

export default router;
