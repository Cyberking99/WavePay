import type { Request, Response } from 'express';
import BankAccount from '../models/BankAccount.js';
import KycService from '../services/KycService.js';

export const addBankAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { bank_code, account_number, account_name } = req.body;

        if (!bank_code || !account_number || !account_name) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }



        const bankAccount = await BankAccount.create({
            user_id: userId,
            bank_code,
            account_number,
            account_name,
        });

        res.status(201).json({ success: true, message: 'Bank account added successfully', data: bankAccount });
    } catch (error: any) {
        console.error('Error adding bank account:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

export const getBankAccounts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const bankAccounts = await BankAccount.findAll({ where: { user_id: userId } });

        res.status(200).json({ success: true, data: bankAccounts });
    } catch (error: any) {
        console.error('Error fetching bank accounts:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};
