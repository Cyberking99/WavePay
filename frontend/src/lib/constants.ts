import { baseSepolia, type AppKitNetwork } from "@reown/appkit/networks";
import { parseAbi } from "viem";

export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://wave-pay.vercel.app";
export const APP_URL = import.meta.env.VITE_APP_URL || "https://wave-pay.vercel.app";
export const APP_NAME = "WavePay";
export const APP_DESCRIPTION = "WavePay - Blockchain Stablecoin Payments";
export const APP_ICON = "https://wave-pay.vercel.app/favicon.ico";
export const API_URL = import.meta.env.VITE_API_URL || "https://wavepay.onrender.com/api";
export const SUPPORTED_NETWORKS: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia]
export const DEFAULT_NETWORK = baseSepolia;
export const CURRENT_NETWORK = localStorage.getItem("wavepay_network") ? JSON.parse(localStorage.getItem("wavepay_network")!) : DEFAULT_NETWORK;
export const EXPLORER_URL = "https://sepolia.basescan.org";
export const USER = localStorage.getItem("wavepay_user") ? JSON.parse(localStorage.getItem("wavepay_user")!) : null;

export const SWAP_ROUTER_ADDRESS = "0x2626664c2603336E57B271c5C0b26F421741e481";
export const SWAP_ROUTER_ABI = parseAbi([
    "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)",
    "function exactOutputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountIn)",
]);

export const QUOTER_ADDRESS = "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a";
export const QUOTER_ABI = parseAbi([
    "function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)",
]);

export const ROUTES = {
    AUTH: "/",
    ONBOARDING: "/onboarding",
    DASHBOARD: "/dashboard",
    SEND: "/send",
    OFFRAMP: "/offramp",
    LINKS: "/links",
    LINKS_CREATE: "/links/create",
    TRANSACTIONS: "/transactions",
    TRANSACTION_DETAIL: "/transactions/:id",
    PROFILE: "/profile",
    BANK_ACCOUNTS: "/bank-accounts",
}

export const TOKEN_LOGOS = {
    USDC: "/USDC.svg",
    USDT: "/USDT.svg",
}

export const TOKENS = [
    {
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
        address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        logo: TOKEN_LOGOS.USDC,
    }
]

export const USDC_ABI = [
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function totalSupply() external view returns (uint256)",
    "function name() external view returns (string)",
    "function symbol() external view returns (string)",
    "function decimals() external view returns (uint8)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
] as const;