import { type Request, type Response } from 'express';
import Transaction from '../models/Transaction.js';
import sequelize from '../config/database.js';

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { hash, from, to, amount, token, type, linkId } = req.body;

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
            status: 'confirmed',
            linkId: linkId || null
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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Transaction.findAndCountAll({
            where: sequelize.or(
                { from: address },
                { to: address }
            ),
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            success: true,
            transactions: rows,
            pagination: {
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Fetch transactions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTransactionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const address = req.user?.address;

        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Ensure user is involved in the transaction
        if (transaction.from !== address && transaction.to !== address) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json({ success: true, transaction });
    } catch (error) {
        console.error('Fetch transaction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
