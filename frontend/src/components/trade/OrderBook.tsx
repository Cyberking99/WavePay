import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function OrderBook() {
    // Mock Data
    const asks = [
        { price: 3005.50, amount: 1.2, total: 3606.60 },
        { price: 3004.20, amount: 0.5, total: 1502.10 },
        { price: 3003.80, amount: 2.1, total: 6307.98 },
        { price: 3002.50, amount: 0.8, total: 2402.00 },
        { price: 3001.00, amount: 5.0, total: 15005.00 },
    ];

    const bids = [
        { price: 2999.00, amount: 1.5, total: 4498.50 },
        { price: 2998.50, amount: 0.9, total: 2698.65 },
        { price: 2997.20, amount: 3.2, total: 9591.04 },
        { price: 2996.00, amount: 1.1, total: 3295.60 },
        { price: 2995.50, amount: 10.0, total: 29955.00 },
    ];

    return (
        <Card className="h-full border-border bg-card/50 backdrop-blur-sm flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-border">
                <CardTitle className="text-sm font-medium">Order Book</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden text-xs font-mono">
                <div className="flex px-4 py-2 text-muted-foreground border-b border-border/50">
                    <div className="flex-1">Price (USDC)</div>
                    <div className="flex-1 text-right">Amount (ETH)</div>
                    <div className="hidden sm:block flex-1 text-right">Total</div>
                </div>

                {/* Asks (Sells) - Red */}
                <div className="flex flex-col-reverse justify-end max-h-[50%] overflow-hidden">
                    {asks.map((ask, i) => (
                        <div key={i} className="flex px-4 py-1 hover:bg-secondary/40 cursor-pointer">
                            <div className="flex-1 text-red-500">{ask.price.toFixed(2)}</div>
                            <div className="flex-1 text-right">{ask.amount.toFixed(4)}</div>
                            <div className="hidden sm:block flex-1 text-right text-muted-foreground">{ask.total.toFixed(2)}</div>
                        </div>
                    ))}
                </div>

                <div className="py-2 text-center font-bold text-lg border-y border-border/50 bg-secondary/20">
                    3000.00 <span className="text-xs font-normal text-muted-foreground">≈ $3000.00</span>
                </div>

                {/* Bids (Buys) - Green */}
                <div className="max-h-[50%] overflow-hidden">
                    {bids.map((bid, i) => (
                        <div key={i} className="flex px-4 py-1 hover:bg-secondary/40 cursor-pointer">
                            <div className="flex-1 text-green-500">{bid.price.toFixed(2)}</div>
                            <div className="flex-1 text-right">{bid.amount.toFixed(4)}</div>
                            <div className="hidden sm:block flex-1 text-right text-muted-foreground">{bid.total.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
