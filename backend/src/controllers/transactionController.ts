import { type Request, type Response } from 'express';
import Transaction from '../models/Transaction.js';
import sequelize from '../config/database.js';

export const createTransaction = async (req: Request, res: Response) => {
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
};

export const getTransactions = async (req: Request, res: Response) => {
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
};
