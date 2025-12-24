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
        <div className="container mx-auto p-4 max-w-[1600px] min-h-[calc(100vh-80px)] flex flex-col gap-4">

            {/* Header / Pair Selector */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Select
                        value={baseToken?.symbol}
                        onValueChange={(val) => setBaseToken(tokens.find(t => t.symbol === val) || null)}
                    >
                        <SelectTrigger className="w-[180px] font-display font-bold text-lg border-none bg-transparent p-0 hover:bg-transparent shadow-none focus:ring-0 text-white">
                            <SelectValue placeholder="Select pair">
                                {baseToken && quoteToken ? `${baseToken.symbol} / ${quoteToken.symbol}` : "Loading..."}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {tokens.filter(t => t.symbol !== "USDC").map(t => (
                                <SelectItem key={t.address} value={t.symbol}>{t.symbol} / USDC</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {baseToken && poolStats && (
                        <div className="flex gap-4 text-sm items-center">
                            <span className="text-green-500 font-medium text-lg">${Number(poolStats.price_usd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
                            <div className="flex flex-col text-xs">
                                <span className={Number(poolStats.price_change_percentage_h24) >= 0 ? "text-green-500" : "text-red-500"}>
                                    {Number(poolStats.price_change_percentage_h24).toFixed(2)}%
                                </span>
                                <span className="text-muted-foreground">24h</span>
                            </div>
                            <div className="flex flex-col text-xs border-l border-border pl-4">
                                <span className="text-foreground font-medium">${Number(poolStats.volume_usd_h24).toLocaleString(undefined, { notation: "compact" })}</span>
                                <span className="text-muted-foreground">Vol 24h</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Trading Layout */}
            <div className="grid grid-cols-12 gap-4 flex-1">

                {/* Left: Chart & Recent Trades (8 cols) */}
                <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
                    {/* Chart Area */}
                    <div className="h-[500px]">
                        {baseToken && <PriceChart symbol={baseToken.symbol} poolAddress={poolAddress} />}
                    </div>
                    {/* Recent Trades (New) */}
                    <div className="flex-1 min-h-[300px]">
                        {poolAddress && <RecentTrades poolAddress={poolAddress} userAddress={address} />}
                    </div>
                </div>

                {/* Right: Order Book & Order Form (4 cols) */}
                <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-4 h-full">
                    {/* Order Book (Top Half) */}
                    <div className="h-[40%] min-h-[300px]">
                        <OrderBook />
                    </div>

                    {/* Order Form (Bottom Half) */}
                    <div className="flex-1 min-h-[350px]">
                        <OrderForm baseToken={baseToken} quoteToken={quoteToken} />
                    </div>
                </div>

            </div>
        </div>
    );
}
