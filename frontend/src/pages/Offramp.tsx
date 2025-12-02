import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import KycForm from "@/components/KycForm";
import AddBankAccountForm from "@/components/AddBankAccountForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TOKENS } from "@/lib/constants";

export default function Offramp() {
    const [loading, setLoading] = useState(true);
    const [kycStatus, setKycStatus] = useState<"inactive" | "pending" | "approved" | "rejected" | null>(null);
    const [hasBankAccount, setHasBankAccount] = useState(false);
    const [selectedToken, setSelectedToken] = useState("cUSD");
    const [amount, setAmount] = useState("");

    const RATE = 1500; // Mock rate for now

    const fetchData = async () => {
        try {
            const [kycRes, bankRes] = await Promise.all([
                api.get("/kyc/status"),
                api.get("/bank-accounts")
            ]);

            if (kycRes.data.success) {
                setKycStatus(kycRes.data.kyc_status);
            }

            if (bankRes.data.success && bankRes.data.data.length > 0) {
                setHasBankAccount(true);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-white text-3xl font-display font-bold mb-1">Offramp</h1>
                <p className="text-muted-foreground">Convert your crypto to fiat</p>
            </div>

            {kycStatus !== "approved" ? (
                <div className="space-y-6">
                    {kycStatus === "pending" && (
                        <Card className="bg-yellow-500/10 border-yellow-500/20">
                            <CardHeader>
                                <CardTitle className="text-yellow-500">KYC Pending</CardTitle>
                                <CardDescription>
                                    Your KYC application is currently under review. We will notify you once it is approved.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    )}

                    {(!kycStatus || kycStatus === "inactive" || kycStatus === 'rejected') && (
                        <KycForm onSuccess={fetchData} />
                    )}
                </div>
            ) : !hasBankAccount ? (
                <AddBankAccountForm onSuccess={() => setHasBankAccount(true)} />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Offramp Service</CardTitle>
                        <CardDescription>
                            Convert your crypto to fiat instantly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Token</label>
                            <Select value={selectedToken} onValueChange={setSelectedToken}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select token" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TOKENS.map((token) => (
                                        <SelectItem key={token.symbol} value={token.symbol}>
                                            <div className="flex items-center gap-2">
                                                <img src={token.logo} alt={token.name} className="w-4 h-4" />
                                                {token.symbol}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="0.00"
                                />
                                <div className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                                    {selectedToken}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Exchange Rate</span>
                                <span>1 {selectedToken} = {RATE.toLocaleString()} NGN</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                                <span>You Receive</span>
                                <span className="text-primary">
                                    {amount ? (parseFloat(amount) * RATE).toLocaleString() : "0.00"} NGN
                                </span>
                            </div>
                        </div>

                        <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                            disabled={!amount || parseFloat(amount) <= 0}
                        >
                            Proceed to Offramp
                        </button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
