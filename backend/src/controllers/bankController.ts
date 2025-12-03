import type { Request, Response } from 'express';
import BankAccount from '../models/BankAccount.js';
import KycService from '../services/KycService.js';

export const addBankAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { bank_code, account_number } = req.body;

        if (!bank_code || !account_number) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }

        const verification = await KycService.verifyBankAccount(bank_code, account_number);

        if (!verification.success) {
            res.status(400).json({ success: false, message: verification.message });
            return;
        }

        const beneficiary = await KycService.createBeneficiary((req as any).user.identityId, bank_code, account_number);

        if (!beneficiary.success) {
            res.status(400).json({ success: false, message: beneficiary.message });
            return;
        }

        const bankAccount = await BankAccount.create({
            user_id: userId,
            bank_name: verification?.data?.bank_name,
            bank_code,
            account_number,
            account_name: verification?.data?.account_name,
            beneficiary_id: beneficiary?.data?.id,
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

export const deleteBankAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        const bankAccount = await BankAccount.findOne({ where: { id, user_id: userId } });

        if (!bankAccount) {
            res.status(404).json({ success: false, message: 'Bank account not found' });
            return;
        }

        await bankAccount.destroy();

        res.status(200).json({ success: true, message: 'Bank account deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting bank account:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};
