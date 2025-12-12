import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, User, Wallet, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { APP_NAME, TOKENS, USDC_ABI } from "@/lib/constants";
import api from "@/lib/api";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useEnsAddress } from "wagmi";
import { parseUnits, isAddress, parseAbi } from "viem";
import { TransactionReceipt } from "@/components/TransactionReceipt";

export default function Send() {
  const [usernameData, setUsernameData] = useState({ username: "", amount: "" });
  const [walletData, setWalletData] = useState({ address: "", amount: "" });
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [isSending, setIsSending] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("username");
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [verifiedRecipient, setVerifiedRecipient] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { address: userAddress } = useAccount();
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: ensAddress, isLoading: isResolvingEns } = useEnsAddress({
    name: walletData.address.endsWith('.eth') ? walletData.address : undefined,
    chainId: 84532, // Base Sepolia
  });

  useEffect(() => {
    if (isPending || isConfirming) {
      setIsSending(true);
    } else {
      setIsSending(false);
    }
  }, [isPending, isConfirming]);

  useEffect(() => {
    if (isConfirmed) {
      // Save transaction to database
      api.post('/transactions', {
        hash,
        from: userAddress,
        to: walletData.address,
        amount: walletData.amount,
        token: selectedToken.symbol,
        type: 'send'
      }).then(response => {
        if (response.data.success) {
          setLastTransaction(response.data.transaction);
          setShowReceipt(true);
        }
      }).catch(err => {
        console.error("Failed to save transaction:", err);
        // Fallback toast if saving fails
        toast.success("Payment sent successfully!", {
          description: `$${walletData.amount} sent to wallet`,
        });
      });

      if (selectedMethod == "username") {
        setUsernameData({ username: "", amount: "" });
      } else {
        setWalletData({ address: "", amount: "" });
      }
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (writeError) {
      toast.error("Transaction failed", {
        description: writeError.message,
      });
      setIsSending(false);
    }
  }, [writeError]);

  const handleVerifyUsername = async () => {
    if (!usernameData.username) return;

    setIsVerifying(true);
    setVerifiedRecipient(null);

    try {
      const response = await api.get(`/users/lookup/${usernameData.username.replace('@', '')}`);
      const recipient = response.data.user;

      if (recipient && recipient.address) {
        setVerifiedRecipient(recipient);
      } else {
        toast.error("User not found");
      }
    } catch (error) {
      toast.error("User not found");
      setVerifiedRecipient(null);
    } finally {
      setIsVerifying(false);
    }
  };


  const handleSendByUsername = async (e: React.FormEvent) => {
    setSelectedMethod("username");
    e.preventDefault();
    setIsSending(true);

    try {
      // Lookup user
      let recipient = verifiedRecipient;

      if (!recipient) {
        // Fallback if somehow they bypassed verification (shouldn't happen with disabled button)
        const response = await api.get(`/users/lookup/${usernameData.username.replace('@', '')}`);
        recipient = response.data.user;
      }

      if (!recipient || !recipient.address) {
        toast.error("User not found");
        setIsSending(false);
        return;
      }

      const amount = parseUnits(usernameData.amount, selectedToken.decimals);

      writeContract({
        address: selectedToken.address as `0x${string}`,
        abi: parseAbi(USDC_ABI),
        functionName: 'transfer',
        args: [recipient.address as `0x${string}`, amount],
      });

      setWalletData(prev => ({ ...prev, amount: usernameData.amount, address: recipient.address }));

    } catch (error) {
      console.error("Error sending payment:", error);
      toast.error("Failed to initiate payment");
      setIsSending(false);
    }
  };

  const handleSendByWallet = async (e: React.FormEvent) => {
    setSelectedMethod("wallet");
    e.preventDefault();

    if (!walletData.address || !walletData.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isAddress(walletData.address) && !ensAddress) {
      toast.error("Invalid wallet address or Basename");
      return;
    }

    const recipientAddress = ensAddress || walletData.address;

    try {
      const amount = parseUnits(walletData.amount, selectedToken.decimals);

      writeContract({
        address: selectedToken.address as `0x${string}`,
        abi: parseAbi(USDC_ABI),
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, amount],
      });

    } catch (error) {
      console.error("Error sending payment:", error);
      toast.error("Failed to initiate payment");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-white text-3xl font-display font-bold mb-1">Send Money</h1>
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
                Wallet / Basename
              </TabsTrigger>
            </TabsList>

            <TabsContent value="username">
              <form onSubmit={handleSendByUsername} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex gap-2">
                    <Input
                      id="username"
                      placeholder="@username"
                      value={usernameData.username}
                      onChange={(e) => {
                        setUsernameData({ ...usernameData, username: e.target.value });
                        setVerifiedRecipient(null);
                      }}
                      required
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleVerifyUsername}
                      disabled={isVerifying || !usernameData.username}
                    >
                      {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                    </Button>
                  </div>

                  {verifiedRecipient && (
                    <div className="flex items-center gap-2 text-sm text-green-500">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verified: {verifiedRecipient.fullName || verifiedRecipient.username}</span>
                    </div>
                  )}

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

                <div className="space-y-2">
                  <Label>Token</Label>
                  <Select
                    value={selectedToken.symbol}
                    onValueChange={(value) => {
                      const token = TOKENS.find((t) => t.symbol === value);
                      if (token) setSelectedToken(token);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center gap-2">
                            <img src={token.logo} alt={token.name} className="w-5 h-5" />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 gradient-primary hover:opacity-90 transition-smooth"
                  disabled={isSending || !verifiedRecipient}
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
                  <Label htmlFor="address">Wallet Address or Basename</Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      placeholder="0x... or name.base.eth"
                      value={walletData.address}
                      onChange={(e) =>
                        setWalletData({ ...walletData, address: e.target.value })
                      }
                      required
                    />
                    {isResolvingEns && (
                      <div className="flex items-center justify-center px-3">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {ensAddress && (
                    <div className="flex items-center gap-2 text-sm text-green-500">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Resolved: {ensAddress.slice(0, 6)}...{ensAddress.slice(-4)}</span>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Enter the recipient's wallet address or Basename (e.g., name.base.eth)
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

                <div className="space-y-2">
                  <Label>Token</Label>
                  <Select
                    value={selectedToken.symbol}
                    onValueChange={(value) => {
                      const token = TOKENS.find((t) => t.symbol === value);
                      if (token) setSelectedToken(token);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center gap-2">
                            <img src={token.logo} alt={token.name} className="w-5 h-5" />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

      <TransactionReceipt
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={lastTransaction}
      />
    </div >
  );
}
