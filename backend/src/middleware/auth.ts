import { type Request, type Response, type NextFunction } from 'express';
import { verifyMessage } from 'viem';

const AUTH_MESSAGE = "Authenticate with WavePay";

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                address: string;
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

        const valid = await verifyMessage({
            address: req.headers['x-wallet-address'] as `0x${string}`, // We might need the address too if we can't recover it easily without context, but verifyMessage usually takes address + message + signature to return boolean, OR recoverMessageAddress takes message + signature.
            // Wait, verifyMessage signature: { address, message, signature } -> boolean.
            // So we need the user to send their address too, or we recover it.
            // Let's use recoverMessageAddress to get the address from the signature and message.
            // Actually, verifyMessage is safer if we expect the user to claim an address.
            // Let's require x-wallet-address header as well for verification.
            message: AUTH_MESSAGE,
            signature: signature as `0x${string}`,
        });

        // Wait, verifyMessage needs the address to verify AGAINST.
        // If we want to just recover the address, we use recoverMessageAddress.
        // But usually we want to know who the user claims to be.
        // Let's assume the client sends 'x-wallet-address'.

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

        req.user = { address };
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};
