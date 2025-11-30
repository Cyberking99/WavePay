import { createPublicClient, type Chain } from "viem";
import { SUPPORTED_NETWORKS, CURRENT_NETWORK } from "../constants";
import { http } from 'viem';

// export const config = createConfig({
//     chains: [mainnet, sepolia],
//     transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http(),
//     },
// });

export const viemClient = createPublicClient({
    chain: (SUPPORTED_NETWORKS.find((n) => n.id === CURRENT_NETWORK.id) || SUPPORTED_NETWORKS[0]) as Chain,
    transport: http(),
});