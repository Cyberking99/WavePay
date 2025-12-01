import express from 'express';
import { createLink, getLinks, getLinkById, recordPayment } from '../controllers/linkController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createLink);
router.get('/', authenticate, getLinks);
router.get('/:id', getLinkById); // Public route
router.post('/:id/pay', recordPayment); // Public route

export default router;
