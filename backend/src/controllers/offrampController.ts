import type { Request, Response } from 'express';
import KycService from '../services/KycService.js';
import BankAccount from '../models/BankAccount.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';


export const getRate = async (req: Request, res: Response): Promise<void> => {
    try {

        const rate = await KycService.getRate();

        res.status(200).json({ success: true, data: rate });
    } catch (error: any) {
        console.error('Error fetching rate:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
}

export const offramp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, amount, bank_id, tx_hash } = req.body;
        const user = req.user;

        if (!user) {
            res.status(401).json({ success: false, message: 'User not found' });
            return;
        }

        const wallet = await Wallet.findOne({ where: { user_id: user.id } });

        if (!wallet) {
            res.status(404).json({ success: false, message: 'Wallet not found' });
            return;
        }

        const bank = await BankAccount.findOne({ where: { id: bank_id, user_id: user.id } });

        if (!bank) {
            res.status(404).json({ success: false, message: 'Bank account not found' });
            return;
        }

        const asset = `base:${token}`;

        const offramp = await KycService.offramp(amount, wallet.wallet_id, bank.beneficiary_id, asset);

        await Transaction.create({
            hash: tx_hash,
            from: user.address,
            to: wallet.wallet_address,
            amount: amount.toString(),
            token: token,
            type: 'offramp',
            status: 'success',
            transactionPayload: JSON.stringify(offramp)
        });

        res.status(200).json({ success: true, data: offramp });
    } catch (error: any) {
        console.error('Error offramping:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
}
