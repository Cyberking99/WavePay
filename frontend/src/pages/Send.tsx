import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, User, Wallet } from "lucide-react";
import { toast } from "sonner";
import { APP_NAME } from "@/lib/constants";

export default function Send() {
  const [usernameData, setUsernameData] = useState({ username: "", amount: "" });
  const [walletData, setWalletData] = useState({ address: "", amount: "" });
  const [isSending, setIsSending] = useState(false);

  const handleSendByUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      toast.success("Payment sent successfully!", {
        description: `$${usernameData.amount} sent to @${usernameData.username}`,
      });
      setUsernameData({ username: "", amount: "" });
      setIsSending(false);
    }, 1500);
  };

  const handleSendByWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      toast.success("Payment sent successfully!", {
        description: `$${walletData.amount} sent to wallet`,
      });
      setWalletData({ address: "", amount: "" });
      setIsSending(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold mb-1">Send Money</h1>
        <p className="text-muted-foreground">Transfer funds to another user or wallet</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display">Choose Transfer Method</CardTitle>
          <CardDescription>Send to a username or wallet address</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="username" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="username" className="gap-2">
                <User className="h-4 w-4" />
                Username
              </TabsTrigger>
              <TabsTrigger value="wallet" className="gap-2">
                <Wallet className="h-4 w-4" />
                Wallet Address
              </TabsTrigger>
            </TabsList>

            <TabsContent value="username">
              <form onSubmit={handleSendByUsername} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="@username"
                    value={usernameData.username}
                    onChange={(e) =>
                      setUsernameData({ ...usernameData, username: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the recipient's {APP_NAME} username
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount-username">Amount (USD)</Label>
                  <Input
                    id="amount-username"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={usernameData.amount}
                    onChange={(e) =>
                      setUsernameData({ ...usernameData, amount: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 gradient-primary hover:opacity-90 transition-smooth"
                  disabled={isSending}
                >
                  {isSending ? (
                    "Sending..."
                  ) : (
                    <>
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Send Payment
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="wallet">
              <form onSubmit={handleSendByWallet} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Wallet Address</Label>
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={walletData.address}
                    onChange={(e) =>
                      setWalletData({ ...walletData, address: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the recipient's blockchain wallet address
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount-wallet">Amount (USD)</Label>
                  <Input
                    id="amount-wallet"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={walletData.amount}
                    onChange={(e) =>
                      setWalletData({ ...walletData, amount: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 gradient-primary hover:opacity-90 transition-smooth"
                  disabled={isSending}
                >
                  {isSending ? (
                    "Sending..."
                  ) : (
                    <>
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Send Payment
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
