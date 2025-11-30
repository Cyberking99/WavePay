import { type Request, type Response } from 'express';
import User from '../models/User.js';

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
