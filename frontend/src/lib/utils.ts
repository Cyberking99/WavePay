import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TOKENS } from "./constants";
import { getERC20Balance } from "./blockchain/token";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getFirstName(name: string) {
  return name.split(" ")[0];
}

export function getLastName(name: string) {
  return name.split(" ")[1];
}

export function getInitials(name: string) {
  return name.split(" ").map((word) => word[0]).join("");
}

export function getFirstLetter(name: string) {
  return name[0];
}

export async function getTokenBalance(tokenAddress: string, userAddress: string) {
  const token = TOKENS.find((token) => token.address === tokenAddress);
  if (!token) {
    return "0";
  }

  // get user balance from blockchain
  return await getERC20Balance(tokenAddress, userAddress);
}

export async function getTotalBalance(userAddress: string) {
  let totalBalance = 0;
  for (const token of TOKENS) {
    const balance = await getTokenBalance(token.address, userAddress);
    totalBalance += parseFloat(balance);
  }
  return totalBalance.toFixed(2);
}