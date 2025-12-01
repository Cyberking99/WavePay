import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAccount } from "wagmi";
import { truncateAddress } from "@/lib/utils";
import { CURRENT_NETWORK } from "@/lib/constants";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useAccount();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await api.get(`/transactions/${id}`);
        if (response.data.success) {
          setTransaction(response.data.transaction);
        }
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransaction();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Transaction Not Found</h2>
        <Button onClick={() => navigate("/transactions")}>Back to Transactions</Button>
      </div>
    );
  }

  const isReceived = transaction.to === address;
  const type = isReceived ? "received" : "sent";
  const counterparty = isReceived ? transaction.from : transaction.to;

  return (
    <div className="max-w-3xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate("/transactions")}
        className="mb-6 bg-primary text-primary-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Transactions
      </Button>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-display mb-2">
                Transaction Details
              </CardTitle>
              <CardDescription>Transaction ID: {transaction.id}</CardDescription>
            </div>
            <Badge variant={transaction.status === "confirmed" ? "default" : "secondary"}>
              {transaction.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount */}
          <div className="text-center py-6 border-y border-border">
            <p className="text-sm text-muted-foreground mb-2">Amount</p>
            <p className={`text-4xl font-display font-bold ${isReceived ? "text-green-500" : "text-red-500"
              }`}>
              {isReceived ? "+" : "-"}${transaction.amount}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <p className="font-medium capitalize">{transaction.linkId != null ? "Payment Link" : "Transfer"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Token</p>
                <p className="font-medium uppercase">{transaction.token}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {isReceived ? "From" : "To"}
              </p>
              <p className="font-medium">
                {truncateAddress(counterparty)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
              <p className="font-medium">{new Date(transaction.createdAt).toLocaleString()}</p>
            </div>

            {transaction.transactionPayload && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payload</p>
                <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
                  {transaction.transactionPayload}
                </code>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                  {transaction.hash}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(`${CURRENT_NETWORK.blockExplorers?.default?.url}/tx/${transaction.hash}`, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
