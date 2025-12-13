import { viemClient } from "./config";
import { formatUnits, parseUnits } from "viem";
import { SWAP_ROUTER_ADDRESS, SWAP_ROUTER_ABI, QUOTER_ADDRESS, QUOTER_ABI } from "../constants";

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
