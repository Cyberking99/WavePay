import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, RefreshCw, Settings, ChevronDown } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useBalance, useSendTransaction } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { toast } from "sonner";
import { fetchTokenList, getSwapQuote, Token, QuoteResponse } from "@/lib/blockchain/exchange";
import { TokenSelector } from "@/components/TokenSelector";
import { USDC_ABI } from "@/lib/constants";

export default function Swap() {
    const { address } = useAccount();
    const [tokens, setTokens] = useState<Token[]>([]);
    const [tokenIn, setTokenIn] = useState<Token | null>(null);
    const [tokenOut, setTokenOut] = useState<Token | null>(null);
    const [amountIn, setAmountIn] = useState("");
    const [quote, setQuote] = useState<QuoteResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const [selectorOpen, setSelectorOpen] = useState(false);
    const [selectingSide, setSelectingSide] = useState<"in" | "out">("in");

    useEffect(() => {
        const loadTokens = async () => {
            const list = await fetchTokenList();
            setTokens(list);
            const weth = list.find(t => t.symbol === "WETH");
            const usdc = list.find(t => t.symbol === "USDC");
            if (weth && !tokenIn) setTokenIn(weth);
            if (usdc && !tokenOut) setTokenOut(usdc);
        };
        loadTokens();
    }, []);

    useEffect(() => {
        const fetchQuote = async () => {
            if (!amountIn || !tokenIn || !tokenOut || address === undefined) {
                setQuote(null);
                return;
            }
            if (parseFloat(amountIn) <= 0) return;

            setLoading(true);
            try {
                const amountWei = parseUnits(amountIn, tokenIn.decimals).toString();
                const quoteData = await getSwapQuote(tokenIn.address, tokenOut.address, amountWei, address);
                setQuote(quoteData);
            } catch (error) {
                console.error("Quote error:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchQuote, 500);
        return () => clearTimeout(timeout);
    }, [amountIn, tokenIn, tokenOut, address]);

    const { data: allowance } = useReadContract({
        address: tokenIn?.address as `0x${string}`,
        abi: USDC_ABI,
        functionName: "allowance",
        args: [address as `0x${string}`, quote?.allowanceTarget as `0x${string}`],
        query: {
            enabled: !!address && !!tokenIn && !!quote?.allowanceTarget,
        }
    });

    const { writeContract, data: hash, isPending: isTxPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isSuccess) {
            toast.success("Transaction confirmed!");
        }
    }, [isSuccess]);

    const handleApprove = () => {
        if (!tokenIn || !quote) return;
        writeContract({
            address: tokenIn.address as `0x${string}`,
            abi: USDC_ABI,
            functionName: "approve",
            args: [quote.allowanceTarget as `0x${string}`, BigInt(quote.sellAmount)],
        });
    };

    const handleSwap = () => {
        if (!quote || !address) return;

        writeContract({
            address: quote.to as `0x${string}`,
            abi: USDC_ABI,
            functionName: "approve",
            args: [quote.allowanceTarget as `0x${string}`, BigInt(quote.sellAmount)],
        } as any);
    };

    const { sendTransaction, isPending: isSendPending } = useSendTransaction();

    const executeSwap = () => {
        if (!quote) return;
        sendTransaction({
            to: quote.to as `0x${string}`,
            data: quote.data as `0x${string}`,
            value: BigInt(quote.value),
        });
    };

    const needsApproval = quote && allowance !== undefined && allowance < BigInt(quote.sellAmount);

    return (
        <div className="max-w-md mx-auto mt-10">
            <TokenSelector
                open={selectorOpen}
                onOpenChange={setSelectorOpen}
                tokens={tokens}
                onSelect={(t) => {
                    if (selectingSide === "in") setTokenIn(t);
                    else setTokenOut(t);
                }}
            />

            <div className="mb-6">
                <h1 className="text-white text-3xl font-display font-bold mb-1">Swap</h1>
                <p className="text-muted-foreground">Exchange any token on Base</p>
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
                            {/* <span className="text-muted-foreground">Balance: {balanceIn?.formatted}</span> */}
                        </div>
                        <div className="flex gap-2 p-3 border border-border rounded-xl bg-background/50">
                            <Input
                                type="number"
                                placeholder="0.00"
                                className="text-2xl font-medium border-none bg-transparent p-0 focus-visible:ring-0 h-auto"
                                value={amountIn}
                                onChange={(e) => setAmountIn(e.target.value)}
                            />
                            <Button
                                variant="secondary"
                                className="rounded-full gap-2 min-w-[120px]"
                                onClick={() => { setSelectingSide("in"); setSelectorOpen(true); }}
                            >
                                {tokenIn ? (
                                    <>
                                        {tokenIn.logoURI && <img src={tokenIn.logoURI} className="w-5 h-5 rounded-full" />}
                                        {tokenIn.symbol}
                                    </>
                                ) : "Select"}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-center -my-3 relative z-10">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-background border-border h-8 w-8"
                            onClick={() => {
                                const temp = tokenIn;
                                setTokenIn(tokenOut);
                                setTokenOut(temp);
                            }}
                        >
                            <ArrowDown className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* To Token */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <Label>To</Label>
                        </div>
                        <div className="flex gap-2 p-3 border border-border rounded-xl bg-background/50">
                            <Input
                                type="number"
                                placeholder="0.00"
                                className="text-2xl font-medium border-none bg-transparent p-0 focus-visible:ring-0 h-auto"
                                value={quote ? formatUnits(BigInt(quote.buyAmount), tokenOut?.decimals || 18) : ""}
                                readOnly
                            />
                            <Button
                                variant="secondary"
                                className="rounded-full gap-2 min-w-[120px]"
                                onClick={() => { setSelectingSide("out"); setSelectorOpen(true); }}
                            >
                                {tokenOut ? (
                                    <>
                                        {tokenOut.logoURI && <img src={tokenOut.logoURI} className="w-5 h-5 rounded-full" />}
                                        {tokenOut.symbol}
                                    </>
                                ) : "Select"}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </div>
                    </div>

                    {loading && <div className="text-center text-sm text-muted-foreground animate-pulse">Fetching best price...</div>}

                    {/* Action Button */}
                    {needsApproval ? (
                        <Button
                            className="w-full h-12 gradient-primary text-lg font-medium mt-4"
                            onClick={handleApprove}
                            disabled={isTxPending || isConfirming}
                        >
                            {isTxPending ? "Approving..." : `Approve ${tokenIn?.symbol}`}
                        </Button>
                    ) : (
                        <Button
                            className="w-full h-12 gradient-primary text-lg font-medium mt-4"
                            onClick={executeSwap}
                            disabled={!quote || isSendPending || loading}
                        >
                            {isSendPending ? "Swapping..." : "Swap"}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


