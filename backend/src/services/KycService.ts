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

interface BankResponse {
    success: boolean;
    message: string;
    data?: {
        name: string;
        code: string;
        icon: string;
        [key: string]: any;
    }[];
}

interface BankVerificationResponse {
    success: boolean;
    message: string;
    data?: {
        bank_code: string;
        bank_name: string;
        account_number: string;
        account_name: string;
        [key: string]: any;
    };
}

interface BeneficiaryResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        [key: string]: any;
    };
}

interface RateResponse {
    success: boolean;
    message: string;
    data?: {
        expiry: string;
        rate: number;
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

    async getBanks(): Promise<BankResponse> {
        try {
            const response = await fetch(`${BREAD_API}/banks?currency=ngn`, {
                method: 'GET',
                headers: HEADERS
            });

            const data = await response.json();

            if (!data.success) {
                return {
                    success: false,
                    message: data.message || 'Failed to get banks.',
                };
            }

            return {
                success: true,
                message: 'Banks retrieved successfully.',
                data: data.data,
            };
        } catch (error: any) {
            console.error('Unable to retrieve banks:', error);
            return {
                success: false,
                message: error.message || 'Banks retrieval failed.',
            };
        }
    }

    async verifyBankAccount(bankCode: string, accountNumber: string): Promise<BankVerificationResponse> {
        try {
            const response = await fetch(`${BREAD_API}/lookup`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({
                    bank_code: bankCode,
                    currency: 'ngn',
                    account_number: accountNumber,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                return {
                    success: false,
                    message: data.message || 'Failed to verify bank account.',
                };
            }

            return {
                success: true,
                message: 'Bank account verified successfully.',
                data: data.data,
            };
        } catch (error: any) {
            console.error('Bank Verification Error:', error);
            return {
                success: false,
                message: error.message || 'Bank account verification failed.',
            };
        }
    }

    async createBeneficiary(identityId: string, bankCode: string, accountNumber: string): Promise<BeneficiaryResponse> {
        try {
            const response = await fetch(`${BREAD_API}/beneficiary`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({
                    currency: 'ngn',
                    identity_id: identityId,
                    details: {
                        bank_code: bankCode,
                        account_number: accountNumber,
                    }
                }),
            });

            const data = await response.json();

            if (!data.success) {
                return {
                    success: false,
                    message: data.message || 'Failed to create beneficiary.',
                };
            }

            return {
                success: true,
                message: 'Beneficiary created successfully.',
                data: data.data,
            };
        } catch (error: any) {
            console.error('Beneficiary Creation Error:', error);
            return {
                success: false,
                message: error.message || 'Beneficiary creation failed.',
            };
        }
    }

    async getRate(): Promise<RateResponse> {
        try {
            const response = await fetch(`${BREAD_API}/quote/offramp`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({
                    currency: 'ngn',
                    amount: 1,
                    asset: 'base:usdc',
                }),
            });

            const data = await response.json();

            if (!data.success) {
                return {
                    success: false,
                    message: data.message || 'Failed to get rate.',
                };
            }

            return {
                success: true,
                message: 'Rate retrieved successfully.',
                data: data.data,
            };
        } catch (error: any) {
            console.error('Rate Retrieval Error:', error);
            return {
                success: false,
                message: error.message || 'Rate retrieval failed.',
            };
        }
    }
}

export default new KycService();
