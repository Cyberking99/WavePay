import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/lib/constants";

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
  });

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.username) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const signature = localStorage.getItem("wavepay_signature");
      const address = localStorage.getItem("wavepay_address");

      await axios.post(
        `${API_URL}/user/onboard`,
        formData,
        {
          headers: {
            "x-api-key": signature,
            "x-wallet-address": address,
          },
        }
      );

      toast.success("Profile created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding failed:", error);
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Welcome to WavePay</CardTitle>
          <CardDescription>Let's set up your profile to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full gradient-primary hover:opacity-90 transition-smooth"
            disabled={loading}
          >
            {loading ? (
              "Creating Profile..."
            ) : (
              <>
                <User className="mr-2 h-4 w-4" />
                Complete Setup
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
