import { parseAbi, formatUnits } from "viem"
import { USDC_ABI } from "../constants"
import { viemClient } from "./config"

const abi = parseAbi(USDC_ABI);

export async function getERC20Balance(tokenAddress: string, userAddress: string): Promise<string> {
    try {
        const publicClient = viemClient;

        const balance = await publicClient.readContract({
            address: tokenAddress as `0x${string}`,
            abi,
            functionName: 'balanceOf',
            args: [userAddress as `0x${string}`]
        });

        const decimals = await publicClient.readContract({
            address: tokenAddress as `0x${string}`,
            abi,
            functionName: 'decimals',
        });

        return formatUnits(balance, decimals);
    } catch (error) {
        console.error("Error getting ERC20 balance:", error);
        return "0";
    }
}
