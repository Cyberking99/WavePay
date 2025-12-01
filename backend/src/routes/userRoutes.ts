import express from 'express';
import { getMe, onboardUser, getUserByUsername, getUserStats } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireOnboarding } from '../middleware/onboarding.js';

const router = express.Router();

router.get('/me', authenticate, requireOnboarding, getMe);
router.post('/onboard', authenticate, onboardUser);
router.get('/lookup/:username', authenticate, getUserByUsername);
router.get('/stats', authenticate, getUserStats);

export default router;
