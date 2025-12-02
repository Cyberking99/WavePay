import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import KycForm from "@/components/KycForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Offramp() {
    const [loading, setLoading] = useState(true);
    const [kycStatus, setKycStatus] = useState<"inactive" | "pending" | "approved" | "rejected" | null>(null);

    const fetchKycStatus = async () => {
        try {
            const response = await api.get("/kyc/status");
            if (response.data.success) {
                setKycStatus(response.data.kyc_status);
            }
        } catch (error) {
            console.error("Failed to fetch KYC status:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKycStatus();
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
                        <KycForm onSuccess={fetchKycStatus} />
                    )}
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Offramp Service</CardTitle>
                        <CardDescription>
                            You are verified! You can now proceed to offramp your funds.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center py-8 text-muted-foreground">
                            Offramp functionality coming soon...
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
