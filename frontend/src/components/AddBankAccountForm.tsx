import { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bank } from "@/lib/types";

interface AddBankAccountFormProps {
    onSuccess: () => void;
}

export default function AddBankAccountForm({ onSuccess }: AddBankAccountFormProps) {
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);
    const [formData, setFormData] = useState({
        bank_code: "",
        account_number: "",
        account_name: "",
        bank_name: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [banks, setBanks] = useState<Bank[]>();
    const [verifiedName, setVerifiedName] = useState<string | null>(null);

    const fetchBanks = useCallback(async () => {
        setIsRetrying(true);
        try {
            const response = await api.get("/kyc/banks");
            if (response.data.success) {
                setBanks(response.data.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch banks:", error);
        } finally {
            setIsRetrying(false);
        }
    }, []);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    const handleVerify = async () => {
        if (!formData.bank_code || !formData.account_number) return;

        setVerifying(true);
        setError(null);
        setVerifiedName(null);

        try {
            const response = await api.post("/kyc/verify-account", {
                bank_code: formData.bank_code,
                account_number: formData.account_number
            });

            if (response.data.success) {
                setVerifiedName(response.data.data.account_name);
                setFormData(prev => ({
                    ...prev,
                    account_name: response.data.data.account_name
                }));
            } else {
                setError(response.data.message || "Verification failed");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Verification failed");
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!verifiedName) return;

        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/bank-accounts", formData);
            if (response.data.success) {
                onSuccess();
            } else {
                setError(response.data.message || "Failed to add bank account");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleBankChange = (code: string) => {
        const bank = banks?.find(b => b.code === code);
        setFormData(prev => ({
            ...prev,
            bank_code: code,
            bank_name: bank?.name || "",
            account_name: "" // Reset verified name on change
        }));
        setVerifiedName(null);
    };

    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            account_number: e.target.value,
            account_name: "" // Reset verified name on change
        }));
        setVerifiedName(null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Bank Account</CardTitle>
                <CardDescription>
                    Please add a bank account to receive your funds.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="bank_code">Bank</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={fetchBanks}
                                disabled={isRetrying}
                            >
                                <RefreshCcw className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`} />
                                <span className="sr-only">Retry fetching banks</span>
                            </Button>
                        </div>
                        <Select
                            value={formData.bank_code}
                            onValueChange={handleBankChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a bank" />
                            </SelectTrigger>
                            <SelectContent>
                                {banks?.length === 0 && (
                                    <SelectItem value="" disabled>
                                        <span className="text-sm text-muted-foreground">
                                            No banks found
                                        </span>
                                    </SelectItem>
                                )}
                                {banks?.map((bank) => (
                                    <SelectItem key={bank.code} value={bank.code}>
                                        <div className="flex items-center gap-2">
                                            <img src={bank.icon} alt="" className="w-4 h-4" />
                                            {bank.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account_number">Account Number</Label>
                        <Input
                            id="account_number"
                            value={formData.account_number}
                            onChange={handleAccountNumberChange}
                            placeholder="Account Number"
                            required
                        />
                    </div>

                    {verifiedName && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-500">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">{verifiedName}</span>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    {!verifiedName ? (
                        <Button
                            type="button"
                            className="w-full"
                            onClick={handleVerify}
                            disabled={verifying || !formData.bank_code || !formData.account_number}
                        >
                            {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify Account
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm & Add Account
                        </Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
