import { type Request, type Response } from 'express';
import Link from '../models/Link.js';

export const createLink = async (req: Request, res: Response) => {
    try {
        const address = req.user?.address;
        const { amount, description, type, expiryDate, customFields } = req.body;

        if (!amount || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const link = await Link.create({
            address,
            amount,
            description,
            type,
            expiryDate,
            customFields: JSON.stringify(customFields),
            active: true,
            uses: 0
        });

        res.json({ success: true, link });
    } catch (error) {
        console.error('Create link error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getLinks = async (req: Request, res: Response) => {
    try {
        const address = req.user?.address;
        const links = await Link.findAll({
            where: { address },
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, links });
    } catch (error) {
        console.error('Fetch links error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
