import { type Request, type Response } from 'express';
import User from '../models/User.js';
import UserDetails from '../models/UserDetails.js';

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

        const userDetails = await UserDetails.findOne({ where: { user_id: user.id } });

        const userInfo = {
            id: user.id,
            address: user.address,
            name: user.fullName,
            phone: user.username,
            isOnboarded: user.isOnboarded,
            email: userDetails?.email,
        };

        res.json({ success: true, user: userInfo, isOnboarded: user.isOnboarded });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
