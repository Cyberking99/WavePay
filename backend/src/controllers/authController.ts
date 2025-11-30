import { type Request, type Response } from 'express';
import User from '../models/User.js';

export const verifyAuth = async (req: Request, res: Response) => {
    try {
        const address = req.user?.address;
        if (!address) {
            return res.status(400).json({ error: 'Address not found' });
        }

        const [user, created] = await User.findOrCreate({
            where: { address },
            defaults: { address, isOnboarded: false }
        });

        res.json({ success: true, user, isOnboarded: user.isOnboarded });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
