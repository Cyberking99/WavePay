import { Router } from "express";
import { getRate, offramp } from "../controllers/offrampController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get('/rate', authenticate, getRate);
router.post('/', authenticate, offramp);

export default router;
