import axios from "axios";
import { formatUnits, parseUnits } from "viem";

const ZERO_EX_API_URL = "https://base.api.0x.org/swap/v1";
const UNISWAP_TOKEN_LIST_URL = "https://tokens.uniswap.org";

export interface Token {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
}

export interface QuoteResponse {
    price: string;
    guaranteedPrice: string;
    to: string;
    data: string; // Calldata for the transaction
    value: string; // Value of ETH to send (if any)
    buyTokenAddress: string;
    sellTokenAddress: string;
    buyAmount: string;
    sellAmount: string;
    allowanceTarget: string; // The address to approve
    estimatedGas: string;
}

/**
 * Fetch the standard Uniswap Token List
 */
export async function fetchTokenList(): Promise<Token[]> {
    try {
        const response = await axios.get(UNISWAP_TOKEN_LIST_URL);
        const tokens = response.data.tokens;
        return tokens.filter((t: Token) => t.chainId === 8453);
    } catch (error) {
        console.error("Failed to fetch token list:", error);
        return [];
    }
}

/**
 * Get a quote from 0x API
 * Note: Requires 0x API Key header '0x-api-key' for production use usually.
 */
export async function getSwapQuote(
    sellToken: string,
    buyToken: string,
    sellAmount: string, // In base units (wei)
    takerAddress: string
): Promise<QuoteResponse | null> {
    try {
        const params = {
            sellToken,
            buyToken,
            sellAmount,
            takerAddress,
        };

        const response = await axios.get(`${ZERO_EX_API_URL}/quote`, {
            params,
        });

        return response.data;
    } catch (error: any) {
        console.error("Error fetching quote:", error.response?.data || error.message);
        return null;
    }
}
