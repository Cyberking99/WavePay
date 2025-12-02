import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
interface KycFormProps {
    onSuccess: () => void;
}
export default function KycForm({ onSuccess }: KycFormProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        dob: "",
        identity_type: "bvn",
        identity_number: "",
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("/kyc", formData);
            if (response.data.success) {
                toast({
                    title: "KYC Submitted",
                    description: "Your KYC details have been submitted successfully.",
                });
                onSuccess();
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to submit KYC",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>Complete Your KYC</CardTitle>
                <CardDescription>
                    We need to verify your identity before you can use the offramp feature.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                            id="dob"
                            type="date"
                            required
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="identity_type">Identity Type</Label>
                        <Select
                            value={formData.identity_type}
                            onValueChange={(value) => setFormData({ ...formData, identity_type: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select identity type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bvn">BVN</SelectItem>
                                <SelectItem value="nin">NIN</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="identity_number">
                            {formData.identity_type === "bvn" ? "BVN Number" : "NIN Number"}
                        </Label>
                        <Input
                            id="identity_number"
                            placeholder={formData.identity_type === "bvn" ? "Enter your BVN" : "Enter your NIN"}
                            required
                            value={formData.identity_number}
                            onChange={(e) => setFormData({ ...formData, identity_number: e.target.value })}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit KYC"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}