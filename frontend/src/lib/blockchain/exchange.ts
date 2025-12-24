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
/**
 * GeckoTerminal API
 */
const GECKO_TERMINAL_API_URL = "https://api.geckoterminal.com/api/v2";

export interface OHLCV {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

/**
 * Fetch the top liquidity pool for a token on Base to get chart data
 */
export async function fetchPoolAddress(tokenAddress: string): Promise<string | null> {
    try {
        // Search for pools involving this token
        // Use the 'networks/base/tokens/{address}/pools' endpoint
        const response = await axios.get(`${GECKO_TERMINAL_API_URL}/networks/base/tokens/${tokenAddress}/pools?page=1`);
        const pools = response.data.data;
        if (!pools || pools.length === 0) return null;

        // Return the address of the first pool (usually the highest liquidity one)
        return pools[0].attributes.address;
    } catch (error) {
        console.error("Error fetching pool address:", error);
        return null;
    }
}

// Timeframe options supported by UI
export type Timeframe = '15m' | '1H' | '4H' | '1D';

/**
 * Fetch OHLCV (candlestick) data for a pool
 * Handles aggregation for different timeframes
 */
export async function fetchOHLCV(poolAddress: string, timeframe: Timeframe = '1H'): Promise<OHLCV[]> {
    try {
        let apiTimeframe = 'hour';
        let aggregate = 1;

        switch (timeframe) {
            case '15m':
                apiTimeframe = 'minute';
                aggregate = 15;
                break;
            case '1H':
                apiTimeframe = 'hour';
                aggregate = 1;
                break;
            case '4H':
                apiTimeframe = 'hour';
                aggregate = 4;
                break;
            case '1D':
                apiTimeframe = 'day';
                aggregate = 1;
                break;
        }

        const response = await axios.get(`${GECKO_TERMINAL_API_URL}/networks/base/pools/${poolAddress}/ohlcv/${apiTimeframe}`, {
            params: {
                aggregate: aggregate,
                limit: 100
            }
        });

        const data = response.data.data.attributes.ohlcv_list;

        // Format: [timestamp, open, high, low, close, volume]
        return data.map((item: any[]) => ({
            time: item[0],
            open: item[1],
            high: item[2],
            low: item[3],
            close: item[4]
        })).sort((a: OHLCV, b: OHLCV) => a.time - b.time); // Ascending order
    } catch (error) {
        console.error("Error fetching OHLCV:", error);
        return [];
    }
}

export interface PoolStats {
    price_usd: string;
    volume_usd_h24: string;
    price_change_percentage_h24: string;
    fdv_usd?: string;
    market_cap_usd?: string;
}

export interface Trade {
    type: "buy" | "sell";
    price_usd: string;
    volume_usd: string;
    from_token_amount: string;
    to_token_amount: string;
    block_timestamp: number;
    tx_hash: string;
    from_token_address: string;
    maker: string; // The address that initiated the trade
}

/**
 * Fetch detailed pool stats (Price, Vol, etc.)
 */
export async function fetchPoolStats(poolAddress: string): Promise<PoolStats | null> {
    try {
        const response = await axios.get(`${GECKO_TERMINAL_API_URL}/networks/base/pools/${poolAddress}`);
        const attr = response.data.data.attributes;
        return {
            price_usd: attr.base_token_price_usd,
            volume_usd_h24: attr.volume_usd.h24,
            price_change_percentage_h24: attr.price_change_percentage.h24,
            fdv_usd: attr.fdv_usd,
            market_cap_usd: attr.market_cap_usd
        };
    } catch (error) {
        console.error("Error fetching pool stats:", error);
        return null;
    }
}

/**
 * Fetch recent trades for a pool
 */
export async function fetchRecentTrades(poolAddress: string): Promise<Trade[]> {
    try {
        const response = await axios.get(`${GECKO_TERMINAL_API_URL}/networks/base/pools/${poolAddress}/trades`);

        return response.data.data.map((trade: any) => ({
            type: trade.attributes.kind,
            price_usd: trade.attributes.price_to_in_usd,
            volume_usd: trade.attributes.volume_in_usd,
            from_token_amount: trade.attributes.from_token_amount,
            to_token_amount: trade.attributes.to_token_amount,
            block_timestamp: new Date(trade.attributes.block_timestamp).getTime(),
            tx_hash: trade.attributes.tx_hash,
            from_token_address: trade.attributes.from_token_address,
            maker: trade.attributes.tx_from_address || ""
        }));
    } catch (error) {
        console.error("Error fetching trades:", error);
        return [];
    }
}
