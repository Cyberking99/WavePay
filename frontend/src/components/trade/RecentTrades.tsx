import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade, fetchRecentTrades } from "@/lib/blockchain/exchange";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RecentTradesProps {
    poolAddress: string;
    userAddress?: string;
}

export function RecentTrades({ poolAddress, userAddress }: RecentTradesProps) {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("market");

    useEffect(() => {
        const loadTrades = async () => {
             if (!poolAddress) return;
             setLoading(true);
             const data = await fetchRecentTrades(poolAddress);
             if (data) setTrades(data.slice(0, 50)); 
             setLoading(false);
        };
        loadTrades();

        // Refresh every 30s
        const interval = setInterval(loadTrades, 30000);
        return () => clearInterval(interval);
    }, [poolAddress]);

    const displayedTrades = activeTab === "market" 
        ? trades 
        : trades.filter(t => userAddress && t.maker.toLowerCase() === userAddress.toLowerCase());

    return (
        <Card className="h-full border-border bg-card/50 backdrop-blur-sm flex flex-col">
             <CardHeader className="py-2 px-4 border-b border-border flex flex-row justify-between items-center space-y-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-between items-center w-full">
                        <TabsList className="bg-secondary/40 h-8">
                            <TabsTrigger value="market" className="text-xs px-3 h-6 data-[state=active]:bg-background">Market</TabsTrigger>
                            <TabsTrigger value="mine" className="text-xs px-3 h-6 data-[state=active]:bg-background">My Trades</TabsTrigger>
                        </TabsList>
                        {loading && <span className="text-xs text-muted-foreground animate-pulse ml-2">Updating...</span>}
                    </div>
                </Tabs>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                 <div className="flex px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border/50 bg-background/50 sticky top-0 backdrop-blur-sm">
                    <div className="flex-1">Price (USD)</div>
                    <div className="flex-1 text-right">Amount (USD)</div>
                    <div className="flex-1 text-right">Time</div>
                </div>
                <div className="flex flex-col">
                    {displayedTrades.map((trade, i) => (
                        <div key={i} className="flex px-4 py-1.5 text-xs font-mono hover:bg-secondary/40 transition-colors">
                            <div className={`flex - 1 ${ trade.type === 'buy' ? 'text-green-500' : 'text-red-500' } `}>
                                ${Number(trade.price_usd).toFixed(4)}
                            </div>
                            <div className="flex-1 text-right text-foreground">
                                ${Number(trade.volume_usd).toFixed(2)}
                            </div>
                            <div className="flex-1 text-right text-muted-foreground">
                                {new Date(trade.block_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))}
                    {!loading && displayedTrades.length === 0 && (
                        <div className="p-4 text-center text-xs text-muted-foreground">
                            {activeTab === "market" ? "No recent trades found" : "No trades found for you"}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
