import { baseSepolia, type AppKitNetwork } from "@reown/appkit/networks";

export const BASE_URL = "https://wave-pay.vercel.app";
export const APP_URL = "https://wave-pay.vercel.app";
export const APP_NAME = "WavePay";
export const APP_DESCRIPTION = "WavePay - Blockchain Stablecoin Payments";
export const APP_ICON = "https://wave-pay.vercel.app/favicon.ico";
export const API_URL = import.meta.env.VITE_API_URL || "https://wave-pay.vercel.app/api";
export const SUPPORTED_NETWORKS: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia]
export const USER = localStorage.getItem("wavepay_user") ? JSON.parse(localStorage.getItem("wavepay_user")!) : null;