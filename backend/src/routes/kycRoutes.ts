import { Router } from "express";
import { submitKyc, getKycStatus } from "../controllers/kycController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post('/', authenticate, submitKyc);
router.get('/status', authenticate, getKycStatus);

export default router;
