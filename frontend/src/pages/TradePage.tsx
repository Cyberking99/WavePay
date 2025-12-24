import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { PriceChart } from "@/components/trade/PriceChart";
import { OrderForm } from "@/components/trade/OrderForm";
import { OrderBook } from "@/components/trade/OrderBook";
import { RecentTrades } from "@/components/trade/RecentTrades";
import { fetchTokenList, Token, fetchPoolAddress, fetchPoolStats, PoolStats } from "@/lib/blockchain/exchange";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TradePage() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [baseToken, setBaseToken] = useState<Token | null>(null);
    const [quoteToken, setQuoteToken] = useState<Token | null>(null);
    const [poolAddress, setPoolAddress] = useState<string | null>(null);
    const [poolStats, setPoolStats] = useState<PoolStats | null>(null);
    const { address } = useAccount();

    // Initial load
    useEffect(() => {
        const loadTokens = async () => {
            const list = await fetchTokenList();
            setTokens(list);

            // Default pair: WETH / USDC
            const weth = list.find(t => t.symbol === "WETH");
            const usdc = list.find(t => t.symbol === "USDC");

            if (weth) setBaseToken(weth);
            if (usdc) setQuoteToken(usdc);
        };
        loadTokens();
    }, []);

    // Fetch Pool Address and Stats
    useEffect(() => {
        const loadPoolData = async () => {
            if (!baseToken) return;

            // 1. Get Pool Address
            const address = await fetchPoolAddress(baseToken.address);
            setPoolAddress(address);

            if (address) {
                // 2. Get Pool Stats
                const stats = await fetchPoolStats(address);
                setPoolStats(stats);
            } else {
                setPoolStats(null);
            }
        };
        loadPoolData();
    }, [baseToken]);

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] p-4 lg:overflow-hidden">

            {/* Left Column (Chart & Trades) */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
                {/* Header Stats */}
                <div className="flex justify-between items-center bg-card/50 backdrop-blur-sm p-3 rounded-xl border border-border">
                    <div className="flex items-center gap-2">
                        {baseToken ? (
                            <>
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs overflow-hidden">
                                    <img src={baseToken.logoURI || "https://token-icons.s3.amazonaws.com/eth.png"} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-display font-bold text-sm">{baseToken.symbol} / {quoteToken?.symbol || "USDC"}</span>
                                    <span className="text-[10px] text-muted-foreground">Base Network</span>
                                </div>
                            </>
                        ) : (
                            <div className="h-8 w-32 bg-secondary/50 animate-pulse rounded" />
                        )}
                    </div>

                    {poolStats ? (
                        <div className="flex flex-col items-end md:flex-row md:items-center md:gap-6 text-sm">
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground">Price</div>
                                <div className="font-mono font-medium">${Number(poolStats.price_usd).toFixed(4)}</div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <div className="text-xs text-muted-foreground">24h Vol</div>
                                <div className="font-mono text-muted-foreground">${(Number(poolStats.volume_usd_h24) / 1000).toFixed(1)}k</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground">24h Change</div>
                                <div className={`font-mono ${Number(poolStats.price_change_percentage_h24) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {Number(poolStats.price_change_percentage_h24).toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4 text-sm animate-pulse">
                            <div className="h-8 w-20 bg-secondary/50 rounded" />
                        </div>
                    )}
                </div>

                {/* Chart Area */}
                <div className="flex-none lg:flex-1 min-h-[350px] lg:min-h-0">
                    {baseToken && <PriceChart symbol={baseToken.symbol} poolAddress={poolAddress} />}
                </div>

                {/* Recent Trades (Hidden on small mobile, visible on desktop or large mobile? Let's keep it stacked) */}
                <div className="flex-none lg:flex-1 min-h-[300px] lg:min-h-0">
                    {poolAddress && <RecentTrades poolAddress={poolAddress} userAddress={address} />}
                </div>
            </div>

            {/* Right Column (Order Form & Book) */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-4 lg:h-full lg:overflow-hidden">
                {/* Order Form */}
                <div className="flex-none">
                    <OrderForm baseToken={baseToken} quoteToken={quoteToken} />
                </div>

                {/* Order Book */}
                <div className="flex-1 min-h-[300px] lg:min-h-0 lg:overflow-hidden">
                    <OrderBook />
                </div>
            </div>

        </div>
    );
}
