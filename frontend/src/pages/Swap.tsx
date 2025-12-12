import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, RefreshCw, Settings } from "lucide-react";
import { TOKENS, TOKEN_LOGOS } from "@/lib/constants";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { getQuote, SWAP_ABI, ROUTER_ADDRESS } from "@/lib/blockchain/swap";
import { parseUnits } from "viem";
import { toast } from "sonner";

// Mock token list for now, extending the one in constants
const SWAP_TOKENS = [
    ...TOKENS,
    {
        name: "Wrapped Ether",
        symbol: "WETH",
        decimals: 18,
        address: "0x4200000000000000000000000000000000000006", // Base WETH
        logo: "/ETH.svg" // Placeholder
    }
];

export default function Swap() {
    const { address } = useAccount();
    const [tokenIn, setTokenIn] = useState(SWAP_TOKENS[0]);
    const [tokenOut, setTokenOut] = useState(SWAP_TOKENS[1] || SWAP_TOKENS[0]);
    const [amountIn, setAmountIn] = useState("");
    const [amountOut, setAmountOut] = useState("");
    const [loading, setLoading] = useState(false);
    const [quoting, setQuoting] = useState(false);

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success("Swap successful!");
            setAmountIn("");
            setAmountOut("");
        }
    }, [isSuccess]);

    useEffect(() => {
        const fetchQuote = async () => {
            if (!amountIn || parseFloat(amountIn) <= 0) {
                setAmountOut("");
                return;
            }

            if (tokenIn.address === tokenOut.address) return;

            setQuoting(true);
            try {
                const quote = await getQuote(
                    tokenIn.address,
                    tokenOut.address,
                    amountIn,
                    tokenIn.decimals,
                    tokenOut.decimals
                );
                setAmountOut(quote);
            } catch (error) {
                console.error("Quote error:", error);
            } finally {
                setQuoting(false);
            }
        };

        const timeout = setTimeout(fetchQuote, 500); // Debounce
        return () => clearTimeout(timeout);
    }, [amountIn, tokenIn, tokenOut]);

    const handleSwap = () => {
        if (!address || !amountIn) return;

        try {
            const amountInBigInt = parseUnits(amountIn, tokenIn.decimals);
            const amountOutMinBigInt = parseUnits((parseFloat(amountOut) * 0.99).toString(), tokenOut.decimals); // 1% slippage

            writeContract({
                address: ROUTER_ADDRESS as `0x${string}`,
                abi: SWAP_ABI,
                functionName: "exactInputSingle",
                args: [{
                    tokenIn: tokenIn.address as `0x${string}`,
                    tokenOut: tokenOut.address as `0x${string}`,
                    fee: 3000,
                    recipient: address,
                    amountIn: amountInBigInt,
                    amountOutMinimum: amountOutMinBigInt,
                    sqrtPriceLimitX96: 0n
                }],
            });
        } catch (error) {
            console.error("Swap error:", error);
            toast.error("Failed to initiate swap");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="mb-6">
                <h1 className="text-white text-3xl font-display font-bold mb-1">Swap</h1>
                <p className="text-muted-foreground">Exchange tokens instantly</p>
            </div>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="font-display">Swap</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* From Token */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <Label>From</Label>
                            <span className="text-muted-foreground">Balance: 0.00</span>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="0.00"
                                className="text-lg font-medium"
                                value={amountIn}
                                onChange={(e) => setAmountIn(e.target.value)}
                            />
                            <Select
                                value={tokenIn.symbol}
                                onValueChange={(val) => {
                                    const t = SWAP_TOKENS.find(t => t.symbol === val);
                                    if (t) setTokenIn(t);
                                }}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SWAP_TOKENS.map((t) => (
                                        <SelectItem key={t.symbol} value={t.symbol}>
                                            <div className="flex items-center gap-2">
                                                {/* <img src={t.logo} className="w-5 h-5 rounded-full" /> */}
                                                <span className="font-medium">{t.symbol}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Swap Direction Button */}
                    <div className="flex justify-center -my-2 relative z-10">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-background border-border h-8 w-8"
                            onClick={() => {
                                const temp = tokenIn;
                                setTokenIn(tokenOut);
                                setTokenOut(temp);
                                setAmountIn(amountOut);
                            }}
                        >
                            <ArrowDown className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* To Token */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <Label>To</Label>
                            <span className="text-muted-foreground">Balance: 0.00</span>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="0.00"
                                className="text-lg font-medium"
                                value={amountOut}
                                readOnly
                            />
                            <Select
                                value={tokenOut.symbol}
                                onValueChange={(val) => {
                                    const t = SWAP_TOKENS.find(t => t.symbol === val);
                                    if (t) setTokenOut(t);
                                }}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SWAP_TOKENS.map((t) => (
                                        <SelectItem key={t.symbol} value={t.symbol}>
                                            <div className="flex items-center gap-2">
                                                {/* <img src={t.logo} className="w-5 h-5 rounded-full" /> */}
                                                <span className="font-medium">{t.symbol}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Price Info */}
                    {amountOut && (
                        <div className="flex justify-between text-sm text-muted-foreground px-1">
                            <span>Rate</span>
                            <span>1 {tokenIn.symbol} ≈ {(parseFloat(amountOut) / parseFloat(amountIn)).toFixed(4)} {tokenOut.symbol}</span>
                        </div>
                    )}

                    <Button
                        className="w-full h-12 gradient-primary text-lg font-medium mt-4"
                        onClick={handleSwap}
                        disabled={!amountIn || quoting || isPending || isConfirming}
                    >
                        {quoting ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : isPending || isConfirming ? (
                            "Swapping..."
                        ) : (
                            "Swap"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
