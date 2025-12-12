import { viemClient } from "./config";
import { parseAbi, formatUnits, parseUnits } from "viem";
import { TOKENS } from "../constants";

// Uniswap V3 SwapRouter02 Address on Base
// https://docs.uniswap.org/contracts/v3/reference/deployments
const SWAP_ROUTER_ADDRESS = "0x2626664c2603336E57B271c5C0b26F421741e481";

// Minimal ABI for SwapRouter02
const SWAP_ROUTER_ABI = parseAbi([
    "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)",
    "function exactOutputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountIn)",
]);

// QuoterV2 Address on Base
const QUOTER_ADDRESS = "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a";

// Minimal ABI for QuoterV2
const QUOTER_ABI = parseAbi([
    "function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)",
]);

export async function getQuote(
    tokenInAddress: string,
    tokenOutAddress: string,
    amountIn: string,
    tokenInDecimals: number,
    tokenOutDecimals: number
): Promise<string> {
    try {
        const amountInBigInt = parseUnits(amountIn, tokenInDecimals);

        // Using a static fee tier of 0.3% (3000) for now. 
        // In a production app, we should find the best pool.
        const fee = 3000;

        // Simulate the call to get the quote
        // Note: Quoter functions are not view functions, but we can simulate them with `simulateContract` or `readContract` depending on the client support, 
        // but for QuoterV2 specifically, it's often designed to be static called.
        // However, viem's `simulateContract` is the standard way to get the result of a state-changing function without executing it.

        const { result } = await viemClient.simulateContract({
            address: QUOTER_ADDRESS,
            abi: QUOTER_ABI,
            functionName: "quoteExactInputSingle",
            args: [{
                tokenIn: tokenInAddress as `0x${string}`,
                tokenOut: tokenOutAddress as `0x${string}`,
                amountIn: amountInBigInt,
                fee: fee,
                sqrtPriceLimitX96: 0n
            }],
        });

        // The result is a struct/array. The first element is amountOut.
        const amountOut = result[0];
        return formatUnits(amountOut, tokenOutDecimals);

    } catch (error) {
        console.error("Error getting quote:", error);
        return "0";
    }
}

export const SWAP_ABI = SWAP_ROUTER_ABI;
export const ROUTER_ADDRESS = SWAP_ROUTER_ADDRESS;
