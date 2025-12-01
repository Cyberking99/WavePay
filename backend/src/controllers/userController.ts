import { type Request, type Response } from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Link from '../models/Link.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

export const getMe = (req: Request, res: Response) => {
    res.json({ user: req.user });
};

export const onboardUser = async (req: Request, res: Response) => {
    try {
        const address = req.user?.address;
        const { fullName, username } = req.body;

        if (!fullName || !username) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await User.findOne({ where: { address } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.fullName = fullName;
        user.username = username;
        user.isOnboarded = true;
        await user.save();

        res.json({ success: true, user });
    } catch (error) {
        console.error('Onboarding error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserByUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({
            where: { username },
            attributes: ['address', 'username', 'fullName']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('User lookup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserStats = async (req: Request, res: Response) => {
    try {
        const address = req.user?.address;

        const user = await User.findOne({ where: { address } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const totalSent = await Transaction.sum('amount', {
            where: { from: address }
        }) || 0;

        const totalReceived = await Transaction.sum('amount', {
            where: { to: address }
        }) || 0;

        const totalLinks = await Link.count({
            where: { userId: user.id }
        });

        const totalTransactions = await Transaction.count({
            where: sequelize.or(
                { from: address },
                { to: address }
            )
        });

        res.json({
            success: true,
            stats: {
                totalSent,
                totalReceived,
                totalLinks,
                totalTransactions
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
