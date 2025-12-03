import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface BankAccount {
    id: number;
    bank_name: string;
    account_number: string;
    account_name: string;
    bank_code: string;
}

export default function BankAccounts() {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await api.get("/bank-accounts");
            if (response.data.success) {
                setAccounts(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching bank accounts:", error);
            toast.error("Failed to fetch bank accounts");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await api.delete(`/bank-accounts/${id}`);
            if (response.data.success) {
                toast.success("Bank account deleted successfully");
                fetchAccounts();
            }
        } catch (error) {
            console.error("Error deleting bank account:", error);
            toast.error("Failed to delete bank account");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        Bank Accounts
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your connected bank accounts
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="h-24 bg-muted/50" />
                            <CardContent className="h-32 bg-muted/20" />
                        </Card>
                    ))}
                </div>
            ) : accounts.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No bank accounts added</h3>
                        <p className="text-muted-foreground mb-4">
                            Add a bank account to start withdrawing funds
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {accounts.map((account) => (
                        <Card key={account.id} className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {account.bank_name}
                                </CardTitle>
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight mb-1">
                                    {account.account_number}
                                </div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    {account.account_name}
                                </p>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleDelete(account.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
