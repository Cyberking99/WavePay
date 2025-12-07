import type { Request, Response } from 'express';
import User from '../models/User.js';
import UserKyc from '../models/UserKyc.js';
import UserDetails from '../models/UserDetails.js';
import Wallet from '../models/Wallet.js';
import KycService from '../services/KycService.js';


export const getBanks = async (req: Request, res: Response): Promise<void> => {
    try {

        const banks = await KycService.getBanks();

        res.status(200).json({ success: true, data: banks });
    } catch (error: any) {
        console.error('Error fetching banks:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
}

export const verifyBankAccount = async (req: Request, res: Response): Promise<void> => {
    try {
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

        res.status(200).json({ success: true, data: verification.data });
    } catch (error: any) {
        console.error('Error verifying bank account:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};


export const submitKyc = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dob, identity_type, identity_number } = req.body;
        const address = (req as any).user.address;

        if (!dob || !identity_type || !identity_number) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }

        const user = await User.findOne({ where: { address } });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const userId = user.id;

        const existingKyc = await UserKyc.findOne({ where: { user_id: userId } });
        if (existingKyc) {
            res.status(400).json({ success: false, message: 'KYC already submitted' });
            return;
        }

        await UserKyc.create({
            user_id: userId,
            dob,
            identity_type,
            bvn: identity_type === 'bvn' ? identity_number : null,
            nin: identity_type === 'nin' ? identity_number : null,
        });

        await User.update({ kyc_status: 'pending' }, { where: { id: userId } });

        const verification = await KycService.verifyIdentity(
            identity_type,
            user.fullName,
            identity_number,
            dob
        );

        if (!verification.success || !verification.data) {
            await User.update({ kyc_status: 'rejected' }, { where: { id: userId } });

            res.status(400).json({ success: false, message: verification.message });
            return;
        }

        await User.update({ kyc_status: 'approved' }, { where: { id: userId } });

        const userDetails = await UserDetails.findOne({ where: { user_id: userId } });
        if (userDetails) {
            userDetails.identityId = verification.data.id;
            await userDetails.save();

            const wallet = await KycService.createWallet(userDetails.userId);
            if (!wallet.success || !wallet.data) {
                await User.update({ kyc_status: 'rejected' }, { where: { id: userId } });

                res.status(400).json({ success: false, message: wallet.message });
                return;
            }

            await Wallet.create({
                user_id: userId,
                wallet_id: wallet.data.wallet_id,
                wallet_reference: wallet.data.reference,
                type: "evm",
                wallet_address: wallet.data.address.evm,
                auto_offramp: false
            });
        } else {

            const uniqueUserId = Date.now().toString();

            await UserDetails.create({
                user_id: userId,
                userId: uniqueUserId,
                identityId: verification.data.id,
                email: null
            });

            const wallet = await KycService.createWallet(uniqueUserId);
            if (!wallet.success || !wallet.data) {
                await User.update({ kyc_status: 'rejected' }, { where: { id: userId } });

                res.status(400).json({ success: false, message: wallet.message });
                return;
            }

            await Wallet.create({
                user_id: userId,
                wallet_id: wallet.data.wallet_id,
                wallet_reference: wallet.data.reference,
                type: "evm",
                wallet_address: wallet.data.address.evm,
                auto_offramp: false
            });
        }

        res.status(200).json({ success: true, message: 'KYC submitted and verified successfully', data: verification.data });

    } catch (error: any) {
        console.error('Error submitting KYC:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

export const getKycStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        let walletAddress = null;
        if ((user as any).kyc_status === 'approved') {
            const wallet = await Wallet.findOne({ where: { user_id: userId } });
            if (wallet) {
                walletAddress = wallet.wallet_address;
            }
        }

        res.status(200).json({ success: true, kyc_status: (user as any).kyc_status, wallet_address: walletAddress });
    } catch (error) {
        console.error('Error fetching KYC status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
