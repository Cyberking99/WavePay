import dotenv from 'dotenv';

dotenv.config();

const BREAD_API = process.env.BREAD_API_URL;

const HEADERS = {
    'x-service-key': process.env.BREAD_API_KEY || '',
    'Content-Type': 'application/json'
};

interface IdentityDetails {
    bvn?: string;
    nin?: string;
    dob: string;
}

interface VerificationResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        [key: string]: any;
    };
}

export class KycService {
    async verifyIdentity(type: 'bvn' | 'nin', name: string, number: string, dob: string): Promise<VerificationResponse> {
        try {
            let identityDetails: IdentityDetails = { dob };
            if (type === 'bvn') {
                identityDetails.bvn = number;
            } else {
                identityDetails.nin = number;
            }

            const response = await fetch(`${BREAD_API}/identity`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({
                    type: type.toUpperCase(),
                    name: name,
                    details: identityDetails,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                return {
                    success: false,
                    message: data.message || 'Failed to verify identity.',
                };
            }

            return {
                success: true,
                message: 'Identity verified successfully.',
                data: data.data,
            };
        } catch (error: any) {
            console.error('KYC Service Error:', error);
            return {
                success: false,
                message: error.message || 'Identity verification failed.',
            };
        }
    }
}

export default new KycService();
