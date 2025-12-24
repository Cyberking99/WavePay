import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSendTransaction } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { toast } from "sonner";
import { getSwapQuote, Token, QuoteResponse } from "@/lib/blockchain/exchange";
import { USDC_ABI } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

interface OrderFormProps {
    baseToken: Token | null;
    quoteToken: Token | null;
}

export function OrderForm({ baseToken, quoteToken }: OrderFormProps) {
    const { address, chain } = useAccount();
    const [side, setSide] = useState<"buy" | "sell">("buy");
    const [amount, setAmount] = useState("");
    const [quote, setQuote] = useState<QuoteResponse | null>(null);
    const [loading, setLoading] = useState(false);

    // Determines the input token and output token based on side
    const tokenIn = side === "buy" ? quoteToken : baseToken; // buying BASE with QUOTE (e.g. buy ETH with USDC)
    const tokenOut = side === "buy" ? baseToken : quoteToken;

    const { data: balanceResult } = useReadContract({
        address: tokenIn?.address as `0x${string}`,
        abi: USDC_ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
        query: { enabled: !!address && !!tokenIn?.address }
    });

    const balanceIn = balanceResult !== undefined ? {
        formatted: formatUnits(balanceResult, tokenIn?.decimals || 18),
        value: balanceResult
    } : undefined;

    useEffect(() => {
        const fetchQuote = async () => {
            if (!amount || !tokenIn || !tokenOut || !address) {
                setQuote(null);
                return;
            }
            if (parseFloat(amount) <= 0) return;

            setLoading(true);
            try {
                // If buying, amount is usually in Quote Token (USDC). 
                // If selling, amount is in Base Token (WETH).
                const amountWei = parseUnits(amount, tokenIn.decimals).toString();
                const quoteData = await getSwapQuote(tokenIn.address, tokenOut.address, amountWei, address);
                setQuote(quoteData);
            } catch (error) {
                console.error("Quote error:", error);
                setQuote(null);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchQuote, 500);
        return () => clearTimeout(timeout);
    }, [amount, tokenIn, tokenOut, address]);

    // Approval Logic
    const { data: allowance } = useReadContract({
        address: tokenIn?.address as `0x${string}`,
        abi: USDC_ABI, // Using standard ERC20 ABI
        functionName: "allowance",
        args: [address as `0x${string}`, quote?.allowanceTarget as `0x${string}`],
        query: { enabled: !!address && !!tokenIn && !!quote?.allowanceTarget }
    });

    const { writeContract, data: hash, isPending: isTxPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isSuccess) toast.success("Transaction confirmed!");
    }, [isSuccess]);

    const handleApprove = () => {
        if (!tokenIn || !quote || !address || !chain) return;
        writeContract({
            address: tokenIn.address as `0x${string}`,
            abi: USDC_ABI,
            functionName: "approve",
            args: [quote.allowanceTarget as `0x${string}`, BigInt(quote.sellAmount)],
            chain,
            account: address
        });
    };

    // Swap Logic
    const { sendTransaction, isPending: isSendPending } = useSendTransaction();

    const executeSwap = () => {
        if (!quote) return;
        sendTransaction({
            to: quote.to as `0x${string}`,
            data: quote.data as `0x${string}`,
            value: BigInt(quote.value),
        });
    };

    const needsApproval = quote && allowance !== undefined && (allowance as bigint) < BigInt(quote.sellAmount);

    const [orderType, setOrderType] = useState<"market" | "limit">("market");
    const [limitPrice, setLimitPrice] = useState("");

    // Calculation for Limit Order Output
    const limitTotal = (parseFloat(amount) * parseFloat(limitPrice || "0")).toFixed(6);

    return (
        <Card className="border-border bg-card/50 backdrop-blur-sm h-full">
            <Tabs defaultValue="buy" className="w-full" onValueChange={(v) => setSide(v as "buy" | "sell")}>
                <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-border rounded-none p-0 h-10">
                    <TabsTrigger
                        value="buy"
                        className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-green-500 data-[state=active]:border-b-2 data-[state=active]:border-green-500 h-full border-b-2 border-transparent transition-all"
                    >
                        Buy {baseToken?.symbol}
                    </TabsTrigger>
                    <TabsTrigger
                        value="sell"
                        className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-500 h-full border-b-2 border-transparent transition-all"
                    >
                        Sell {baseToken?.symbol}
                    </TabsTrigger>
                </TabsList>

                <CardContent className="space-y-4 pt-6">
                    {/* Order Type Selector */}
                    <div className="flex gap-2 mb-4 bg-secondary/30 p-1 rounded-lg">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 h-7 text-xs ${orderType === "market" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
                            onClick={() => setOrderType("market")}
                        >
                            Market
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 h-7 text-xs ${orderType === "limit" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
                            onClick={() => setOrderType("limit")}
                        >
                            Limit
                        </Button>
                    </div>

                    {/* Price Input (Only for Limit) */}
                    {orderType === "limit" && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <Label>Price ({quoteToken?.symbol})</Label>
                                <span className="text-blue-400 cursor-pointer" onClick={() => setLimitPrice(quote?.price || "")}>Last: {quote ? Number(quote.price).toFixed(4) : "-"}</span>
                            </div>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="pr-16 text-right font-mono"
                                    value={limitPrice}
                                    onChange={(e) => setLimitPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <Label>Amount ({tokenIn?.symbol})</Label>
                            <span>Avail: {balanceIn ? parseFloat(balanceIn.formatted).toFixed(4) : "0.00"}</span>
                        </div>
                        <div className="relative">
                            <Input
                                type="number"
                                placeholder="0.00"
                                className="pr-16 text-right font-mono"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <div className="absolute left-3 top-2.5 text-sm font-medium text-muted-foreground">
                                {side === "buy" ? "Pay" : "Sell"}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <Label>Total ({tokenOut?.symbol})</Label>
                            <span>{orderType === "market" ? "Estimated" : "Total Value"}</span>
                        </div>
                        <div className="relative">
                            <Input
                                type="number"
                                placeholder="0.00"
                                className="pr-16 text-right font-mono bg-secondary/20"
                                value={orderType === "limit" ? limitTotal : (quote ? formatUnits(BigInt(quote.buyAmount), tokenOut?.decimals || 18) : "")}
                                readOnly
                            />
                            <div className="absolute left-3 top-2.5 text-sm font-medium text-muted-foreground">
                                Get
                            </div>
                        </div>
                    </div>

                    {/* Percentages */}
                    <div className="grid grid-cols-4 gap-2">
                        {[25, 50, 75, 100].map((pct) => (
                            <Button
                                key={pct}
                                variant="outline"
                                size="sm"
                                className="text-xs h-6"
                                onClick={() => {
                                    if (balanceIn) {
                                        const val = parseFloat(balanceIn.formatted) * (pct / 100);
                                        setAmount(val.toFixed(6));
                                    }
                                }}
                            >
                                {pct}%
                            </Button>
                        ))}
                    </div>

                    {orderType === "market" && quote && (
                        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                            <div className="flex justify-between">
                                <span>Price Impact</span>
                                <span className="text-green-500">~0.01%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Network Cost</span>
                                <span>${quote.estimatedGas ? (Number(quote.estimatedGas) * 0.000000001 * 2500).toFixed(4) : "0.01"}</span>
                            </div>
                        </div>
                    )}

                    {loading && <div className="text-center text-xs text-muted-foreground animate-pulse">Fetching quote...</div>}

                    {orderType === "limit" ? (
                        <Button
                            className="w-full h-10 font-medium mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            disabled={!amount || !limitPrice}
                            onClick={() => toast.info("Limit Orders coming soon!")}
                        >
                            Place Limit Order
                        </Button>
                    ) : needsApproval ? (
                        <Button
                            className="w-full h-10 gradient-primary font-medium mt-4"
                            onClick={handleApprove}
                            disabled={isTxPending || isConfirming}
                        >
                            {isTxPending ? "Approving..." : `Approve ${tokenIn?.symbol}`}
                        </Button>
                    ) : (
                        <Button
                            className={`w-full h-10 font-medium mt-4 ${side === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                            onClick={executeSwap}
                            disabled={!quote || isSendPending || loading}
                        >
                            {isSendPending ? (side === "buy" ? "Buying..." : "Selling...") : (side === "buy" ? "Buy" : "Sell")}
                        </Button>
                    )}

                </CardContent>
            </Tabs>
        </Card>
    );
}
