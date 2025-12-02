import { Router } from "express";
import { getRate } from "../controllers/offrampController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get('/rate', authenticate, getRate);

export default router;
