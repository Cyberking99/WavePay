import type { Request, Response } from 'express';
import KycService from '../services/KycService.js';


export const getRate = async (req: Request, res: Response): Promise<void> => {
    try {

        const rate = await KycService.getRate();

        res.status(200).json({ success: true, data: rate });
    } catch (error: any) {
        console.error('Error fetching rate:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
}
