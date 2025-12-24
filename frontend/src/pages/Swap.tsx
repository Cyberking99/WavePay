import { SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";
import { useAccount } from "wagmi";
import { TOKENS } from "@/lib/constants";

// Base Sepolia Chain ID: 84532
// Base Mainnet Chain ID: 8453
const JSON_RPC_URL = "https://sepolia.base.org";
const CHAIN_ID = 84532;

// Custom token list or default
// Ideally we use a standard list URL, but we can also pass a local array if formatted correctly
// For now, let's use the default Uniswap list behavior by not passing tokenList (or passing a URL)
const TOKEN_LIST = "https://gateway.ipfs.io/ipns/tokens.uniswap.org";

export default function Swap() {
    const { address } = useAccount();

    // Basic provider retrieval. 
    // In a robust app, we'd use a useProvider hook that adapts wagmi's Client to an Ethers provider or EIP-1193 provider.
    // For the widget, passing 'window.ethereum' works for injected wallets.
    // For WalletConnect, we'd need to extract the provider from the connector.
    const provider = window.ethereum;

    return (
        <div className="max-w-xl mx-auto mt-10">
            <div className="mb-6">
                <h1 className="text-white text-3xl font-display font-bold mb-1">Swap</h1>
                <p className="text-muted-foreground">Powered by Uniswap</p>
            </div>

            <div className="Uniswap text-black flex justify-center">
                <SwapWidget
                    jsonRpcUrlMap={{
                        [CHAIN_ID]: [JSON_RPC_URL],
                    }}
                    defaultChainId={CHAIN_ID}
                    tokenList={TOKEN_LIST}
                    provider={provider}
                    width="100%"
                    theme={{
                        primary: '#1d4ed8', // blue-700
                        secondary: '#1e293b', // slate-800
                        interactive: '#2563eb', // blue-600
                        container: '#0f172a', // slate-900 (card bg)
                        module: '#1e293b', // slate-800
                        accent: '#2563eb',
                        outline: '#334155',
                        dialog: '#0f172a',
                        fontFamily: 'Inter',
                        borderRadius: 0.8,
                    }}
                    defaultInputTokenAddress="NATIVE"
                    defaultOutputTokenAddress={TOKENS[0]?.address} // USDC
                />
            </div>
        </div>
    );
}
