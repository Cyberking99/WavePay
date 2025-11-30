import { type Request, type Response, type NextFunction } from 'express';
import User from '../models/User.js';

export const requireOnboarding = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = req.user?.address;
        if (!address) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findOne({ where: { address } });

        if (!user || !user.isOnboarded) {
            return res.status(403).json({ error: 'User not onboarded', requiresOnboarding: true });
        }

        next();
    } catch (error) {
        console.error('Onboarding check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
