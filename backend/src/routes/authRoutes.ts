import express from 'express';
import { verifyAuth } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/verify', authenticate, verifyAuth);

export default router;
