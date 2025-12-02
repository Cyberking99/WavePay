import { type Request, type Response, type NextFunction } from 'express';
import { verifyMessage } from 'viem';
import User from '../models/User.js';

const AUTH_MESSAGE = "Authenticate with WavePay";

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                address: string;
                id?: number;
            };
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const signature = req.headers['x-api-key'] as string;

        if (!signature) {
            return res.status(401).json({ error: 'Missing API key (signature)' });
        }

        const address = req.headers['x-wallet-address'] as string;

        if (!address) {
            return res.status(401).json({ error: 'Missing wallet address header' });
        }

        const isValid = await verifyMessage({
            address: address as `0x${string}`,
            message: AUTH_MESSAGE,
            signature: signature as `0x${string}`,
        });

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const user = await User.findOne({ where: { address } });
        req.user = {
            address,
            ...(user?.id ? { id: user.id } : {})
        };
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};
