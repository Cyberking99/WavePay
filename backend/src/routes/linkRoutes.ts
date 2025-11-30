import express from 'express';
import { createLink, getLinks } from '../controllers/linkController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createLink);
router.get('/', authenticate, getLinks);

export default router;
