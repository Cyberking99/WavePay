import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate Privy connection
    setTimeout(() => {
      // Check if user is new (in real app, check from Privy/backend)
      const isNewUser = true; // Simulate new user
      if (isNewUser) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo & Title */}
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <Wallet className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">PayFlow</h1>
            <p className="text-muted-foreground text-lg">
              Send and receive stablecoin payments with ease
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 text-left">
          {[
            "Instant blockchain payments",
            "Generate shareable payment links",
            "Track all your transactions",
            "Secure and decentralized",
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-foreground/90">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Connect Button */}
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full h-12 text-base font-medium gradient-primary hover:opacity-90 transition-smooth"
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
