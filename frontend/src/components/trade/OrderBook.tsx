import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function OrderBook() {
    // Mock Data
    const asks = Array.from({ length: 20 }).map((_, i) => ({
        price: 3000 + (i + 1) * 0.5,
        amount: Math.random() * 5,
        total: (3000 + (i + 1) * 0.5) * (Math.random() * 5)
    })).reverse();

    const bids = Array.from({ length: 20 }).map((_, i) => ({
        price: 3000 - (i + 1) * 0.5,
        amount: Math.random() * 5,
        total: (3000 - (i + 1) * 0.5) * (Math.random() * 5)
    }));

    return (
        <Card className="h-full border-border bg-card/50 backdrop-blur-sm flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-border">
                <CardTitle className="text-sm font-medium">Order Book</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden text-xs font-mono">
                <div className="flex px-4 py-2 text-muted-foreground border-b border-border/50 bg-background/50">
                    <div className="flex-1">Price (USDC)</div>
                    <div className="flex-1 text-right">Amount (ETH)</div>
                    <div className="hidden sm:block flex-1 text-right">Total</div>
                </div>

                {/* Asks (Sells) - Red - Scroll from bottom */}
                <div className="flex-1 overflow-y-auto flex flex-col-reverse justify-end scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
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
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
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
