import { type Request, type Response } from 'express';
import Link from '../models/Link.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const createLink = async (req: Request, res: Response) => {
    try {
        const address = req.user?.address;
        const { amount, description, type, expiryDate, customFields } = req.body;

        if (!type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await User.findOne({ where: { address } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const link = await Link.create({
            userId: user.id,
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

export const getLinkById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const link = await Link.findOne({ where: { linkId: id } });

        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }

        if (!link.active) {
            return res.status(400).json({ error: 'Link is inactive' });
        }

        res.json({ success: true, link });
    } catch (error) {
        console.error('Fetch link error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const recordPayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { hash, from, amount, token } = req.body;

        const link = await Link.findOne({ where: { linkId: id } });
        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }

        // Create transaction record
        const transaction = await Transaction.create({
            hash,
            from,
            to: link.address,
            amount,
            token,
            type: 'receive',
            status: 'confirmed',
            linkId: link.id
        });

        // Update link stats
        link.uses += 1;
        if (link.type === 'one-time') {
            link.active = false;
        }
        await link.save();

        res.json({ success: true, transaction });
    } catch (error) {
        console.error('Record payment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
