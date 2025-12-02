import type { Request, Response } from 'express';
import User from '../models/User.js';
import UserKyc from '../models/UserKyc.js';

export const submitKyc = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dob, identity_type, identity_number } = req.body;
        const userId = (req as any).user.id;
        if (!dob || !identity_type || !identity_number) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }

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
        res.status(200).json({ success: true, message: 'KYC submitted successfully' });
    } catch (error) {
        console.error('Error submitting KYC:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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
        res.status(200).json({ success: true, kyc_status: (user as any).kyc_status });
    } catch (error) {
        console.error('Error fetching KYC status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
