import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, Wallet, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { injected } from "wagmi/connectors";
import { parseUnits, parseAbi } from "viem";
import { USDC_ABI, TOKENS, CURRENT_NETWORK } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

export default function Pay() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [link, setLink] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const { address, isConnected } = useAccount();
    const { connectAsync } = useConnect();
    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        const fetchLink = async () => {
            try {
                const response = await api.get(`/links/${id}`);
                setLink(response.data.link);
            } catch (error) {
                console.error("Fetch link error:", error);
                toast.error("Failed to load payment link");
            } finally {
                setLoading(false);
            }
        };
        fetchLink();
    }, [id]);

    useEffect(() => {
        if (isConfirmed && hash && link) {
            api.post(`/links/${id}/pay`, {
                hash,
                from: address,
                amount,
                token: 'USDC',
                transactionPayload: customFieldValues
            }).catch(err => console.error("Failed to record payment:", err));

            setSuccess(true);
            setIsProcessing(false);
            toast.success("Payment successful!");
        }
    }, [isConfirmed, hash, link, id, address]);

    useEffect(() => {
        if (writeError) {
            console.error("Payment failed:", writeError);
            toast.error("Payment failed. Please try again.");
            setIsProcessing(false);
        }
    }, [writeError]);

    const handlePay = async () => {
        if (!link) return;
        setIsProcessing(true);

        try {
            if (!isConnected) {
                await connectAsync({ connector: injected() });
            }

            const paymentAmount = parseUnits(amount, 6);

            writeContract({
                address: TOKENS[0].address as `0x${string}`,
                abi: parseAbi(USDC_ABI),
                functionName: 'transfer',
                args: [link.address as `0x${string}`, paymentAmount],
            });

        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Failed to initiate payment");
            setIsProcessing(false);
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value || /^\d+$/.test(value)) {
            setAmount(value);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!link) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Link Not Found</h1>
                    <p className="text-muted-foreground">This payment link does not exist or has expired.</p>
                    <Button onClick={() => navigate('/')} className="mt-4">Back to Home</Button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <Card className="w-full max-w-md border-border print:border-0 print:shadow-none">
                    <CardContent className="pt-6 space-y-6">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center print:hidden">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Payment Receipt</h2>
                                <p className="text-muted-foreground text-sm">
                                    {new Date().toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-b border-border py-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount Paid</span>
                                <span className="font-bold text-lg">${amount} USDC</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Transaction Hash</span>
                                <a
                                    href={`${CURRENT_NETWORK.blockExplorers?.default?.url}/tx/${hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-sm text-primary hover:underline"
                                    title="View on Explorer"
                                >
                                    {hash?.slice(0, 6)}...{hash?.slice(-4)}
                                </a>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">From</span>
                                <span className="font-mono text-sm" title={address}>
                                    {address?.slice(0, 6)}...{address?.slice(-4)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">To</span>
                                <span className="font-mono text-sm" title={link.address}>
                                    {link.address?.slice(0, 6)}...{link.address?.slice(-4)}
                                </span>
                            </div>
                            {link.description && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Description</span>
                                    <span className="font-medium">{link.description}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 print:hidden">
                            <Button
                                onClick={() => window.print()}
                                className="w-full gradient-primary"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download Receipt
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="w-full"
                            >
                                Make Another Payment
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <style>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .min-h-screen {
                            min-height: auto;
                            display: block;
                        }
                        .card-content, .card-content * {
                            visibility: visible;
                        }
                        .card-content {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        );
    }

    const customFields = link.customFields ? JSON.parse(link.customFields) : [];

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-border">
                <CardHeader>
                    <CardTitle className="text-2xl font-display text-center">{link.amount ? `Pay ${link.amount}` : 'Pay'}</CardTitle>
                    {link.description && (
                        <CardDescription className="text-center text-base">
                            {link.description}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    {link.amount ? (
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={link.amount}
                                disabled={true}
                            />
                        </div>
                    ) : (
                        <div>
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Enter amount"
                            />
                        </div>
                    )}
                    {customFields.length > 0 && (
                        <div className="space-y-4">
                            {customFields.map((field: any) => (
                                <div key={field.id} className="space-y-2">
                                    <Label htmlFor={field.id}>
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </Label>
                                    {field.type === 'textarea' ? (
                                        <Textarea
                                            id={field.id}
                                            value={customFieldValues[field.id] || ''}
                                            onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                        />
                                    ) : field.type === 'select' ? (
                                        <Select
                                            value={customFieldValues[field.id] || ''}
                                            onValueChange={(v) => setCustomFieldValues(prev => ({ ...prev, [field.id]: v }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options?.map((opt: string) => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            id={field.id}
                                            type="text"
                                            value={customFieldValues[field.id] || ''}
                                            onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <Button
                        onClick={handlePay}
                        className="w-full h-12 gradient-primary hover:opacity-90 transition-smooth text-lg"
                        disabled={isProcessing || isPending || isConfirming}
                    >
                        {isProcessing || isPending || isConfirming ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Wallet className="mr-2 h-5 w-5" />
                                Pay with Wallet
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
