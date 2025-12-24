import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade, fetchRecentTrades } from "@/lib/blockchain/exchange";
import { useEffect, useState } from "react";

interface RecentTradesProps {
    poolAddress: string;
}

export function RecentTrades({ poolAddress }: RecentTradesProps) {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadTrades = async () => {
            if (!poolAddress) return;
            setLoading(true);
            const data = await fetchRecentTrades(poolAddress);
            if (data) setTrades(data.slice(0, 50)); // Show last 50
            setLoading(false);
        };
        loadTrades();

        // Refresh every 30s
        const interval = setInterval(loadTrades, 30000);
        return () => clearInterval(interval);
    }, [poolAddress]);

    return (
        <Card className="h-full border-border bg-card/50 backdrop-blur-sm flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-border flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Recent Trades</CardTitle>
                {loading && <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>}
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                <div className="flex px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border/50 bg-background/50 sticky top-0 backdrop-blur-sm">
                    <div className="flex-1">Price (USD)</div>
                    <div className="flex-1 text-right">Amount (USD)</div>
                    <div className="flex-1 text-right">Time</div>
                </div>
                <div className="flex flex-col">
                    {trades.map((trade, i) => (
                        <div key={i} className="flex px-4 py-1.5 text-xs font-mono hover:bg-secondary/40 transition-colors">
                            <div className={`flex-1 ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
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
                    {!loading && trades.length === 0 && (
                        <div className="p-4 text-center text-xs text-muted-foreground">No recent trades found</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
