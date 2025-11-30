import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch based on id
  const transaction = {
    id: id,
    type: "received",
    from: "@alice",
    amount: "250.00",
    time: "2024-01-20 14:30:45",
    status: "completed",
    method: "username",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    fee: "0.50",
    note: "Payment for consulting services - January 2024",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate("/transactions")}
        className="mb-6"
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
            <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
              {transaction.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount */}
          <div className="text-center py-6 border-y border-border">
            <p className="text-sm text-muted-foreground mb-2">Amount</p>
            <p className={`text-4xl font-display font-bold ${
              transaction.type === "received" ? "text-primary" : ""
            }`}>
              {transaction.type === "received" ? "+" : "-"}${transaction.amount}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <p className="font-medium capitalize">{transaction.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Method</p>
                <p className="font-medium capitalize">{transaction.method}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {transaction.type === "received" ? "From" : "To"}
              </p>
              <p className="font-medium">
                {transaction.type === "received" ? transaction.from : transaction.from}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
              <p className="font-medium">{transaction.time}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Network Fee</p>
              <p className="font-medium">${transaction.fee}</p>
            </div>

            {transaction.note && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Note</p>
                <p className="font-medium">{transaction.note}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                  {transaction.txHash}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(`https://etherscan.io/tx/${transaction.txHash}`, "_blank")}
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
