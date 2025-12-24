import { useState, useEffect } from "react";
import { PriceChart } from "@/components/trade/PriceChart";
import { OrderForm } from "@/components/trade/OrderForm";
import { OrderBook } from "@/components/trade/OrderBook";
import { fetchTokenList, Token } from "@/lib/blockchain/exchange";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TradePage() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [baseToken, setBaseToken] = useState<Token | null>(null);
    const [quoteToken, setQuoteToken] = useState<Token | null>(null);

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

    return (
        <div className="container mx-auto p-4 max-w-[1600px] h-[calc(100vh-80px)] min-h-[800px] flex flex-col gap-4">

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

                    {baseToken && (
                        <div className="flex gap-4 text-sm">
                            <span className="text-green-500 font-medium">3,000.00</span>
                            <span className="text-muted-foreground">24h Vol: $42.5M</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Trading Layout */}
            <div className="grid grid-cols-12 gap-4 flex-1">

                {/* Left: Chart (8 cols) */}
                <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
                    {/* Chart Area */}
                    <div className="flex-1 min-h-[400px]">
                        {baseToken && <PriceChart symbol={baseToken.symbol} address={baseToken.address} />}
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
