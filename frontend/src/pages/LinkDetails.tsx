import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, ExternalLink, Calendar, CreditCard, Activity } from "lucide-react";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import { truncateAddress } from "@/lib/utils";

export default function LinkDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [link, setLink] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLinkDetails = async () => {
            try {
                const response = await api.get(`/links/${id}`);
                if (response.data.success) {
                    setLink(response.data.link);
                    setTransactions(response.data.transactions || []);
                }
            } catch (error) {
                console.error("Failed to fetch link details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLinkDetails();
    }, [id]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!link) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Link Not Found</h2>
                <Button onClick={() => navigate("/links")}>Back to Links</Button>
            </div>
        );
    }

    const linkUrl = `${window.location.origin}/pay/${link.linkId}`;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/links")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-bold">Link Report</h1>
                    <p className="text-muted-foreground">Detailed view and transaction history</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Link Details Card */}
                <Card className="md:col-span-2 border-border">
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Settings for this payment link</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Type</label>
                                <div className="flex items-center gap-2 mt-1 capitalize">
                                    <Activity className="h-4 w-4" />
                                    {link.type}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                                <div className="text-lg font-bold mt-1">
                                    {link.amount ? `$${link.amount}` : "Optional"}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Created</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(link.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${link.active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                    }`}>
                                    {link.active ? "Active" : "Inactive"}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <label className="text-sm font-medium text-muted-foreground">Share Link</label>
                            <div className="flex items-center gap-2 mt-2">
                                <code className="flex-1 bg-muted p-2 rounded text-sm truncate">{linkUrl}</code>
                                <Button variant="outline" size="icon" onClick={() => copyToClipboard(linkUrl)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => window.open(linkUrl, "_blank")}>
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Card */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>Performance</CardTitle>
                        <CardDescription>Usage statistics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Total Uses</div>
                            <div className="text-3xl font-bold">{link.uses}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</div>
                            <div className="text-3xl font-bold text-primary">
                                ${transactions.reduce((acc, tx) => acc + parseFloat(tx.amount), 0).toFixed(2)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card className="border-border">
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Payments received through this link</CardDescription>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No transactions yet
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium">Payment from {truncateAddress(tx.from)}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(tx.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg">+${tx.amount}</div>
                                        <div className="text-xs text-muted-foreground uppercase">{tx.token}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
