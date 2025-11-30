import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticate } from './middleware/auth.js';

import sequelize from './config/database.js';
import User from './models/User.js';
import Transaction from './models/Transaction.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Sync database
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Failed to sync database:', err);
});

app.get('/', (req: Request, res: Response) => {
    res.send('WavePay API is running');
});

import { requireOnboarding } from './middleware/onboarding.js';

app.get('/me', authenticate, requireOnboarding, (req: Request, res: Response) => {
    res.json({ user: req.user });
});

app.post('/api/auth/verify', authenticate, async (req: Request, res: Response) => {
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
});

app.post('/api/user/onboard', authenticate, async (req: Request, res: Response) => {
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
});

app.post('/api/transactions', authenticate, async (req: Request, res: Response) => {
    try {
        const { hash, from, to, amount, token, type } = req.body;

        if (!hash || !from || !to || !amount || !token || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const transaction = await Transaction.create({
            hash,
            from,
            to,
            amount,
            token,
            type,
            status: 'confirmed'
        });

        res.json({ success: true, transaction });
    } catch (error) {
        console.error('Transaction save error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/transactions', authenticate, async (req: Request, res: Response) => {
    try {
        const address = req.user?.address;
        const transactions = await Transaction.findAll({
            where: sequelize.or(
                { from: address },
                { to: address }
            ),
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, transactions });
    } catch (error) {
        console.error('Fetch transactions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
