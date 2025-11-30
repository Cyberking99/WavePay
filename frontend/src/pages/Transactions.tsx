import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, ArrowDownLeft, Search, Link2 } from "lucide-react";

const mockTransactions = [
  {
    id: "1",
    type: "received",
    from: "@alice",
    amount: "250.00",
    time: "2024-01-20 14:30",
    status: "completed",
    method: "username",
  },
  {
    id: "2",
    type: "sent",
    to: "@bob",
    amount: "100.00",
    time: "2024-01-20 10:15",
    status: "completed",
    method: "username",
  },
  {
    id: "3",
    type: "received",
    from: "Payment Link",
    amount: "50.00",
    time: "2024-01-19 18:45",
    status: "completed",
    method: "link",
  },
  {
    id: "4",
    type: "sent",
    to: "0x742d...5e2a",
    amount: "75.50",
    time: "2024-01-19 12:20",
    status: "completed",
    method: "wallet",
  },
  {
    id: "5",
    type: "received",
    from: "@charlie",
    amount: "300.00",
    time: "2024-01-18 09:00",
    status: "completed",
    method: "username",
  },
];

export default function Transactions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = mockTransactions.filter(
    (tx) =>
      tx.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.amount.includes(searchQuery)
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold mb-1">Transaction History</h1>
        <p className="text-muted-foreground">View all your payment activity</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display">All Transactions</CardTitle>
          <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/50 transition-smooth cursor-pointer"
              onClick={() => navigate(`/transactions/${tx.id}`)}
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === "received" ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  {tx.method === "link" ? (
                    <Link2 className="h-5 w-5 text-primary" />
                  ) : tx.type === "received" ? (
                    <ArrowDownLeft className="h-5 w-5 text-primary" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {tx.type === "received" ? `From ${tx.from}` : `To ${tx.to}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{tx.time}</p>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className={`font-semibold ${tx.type === "received" ? "text-primary" : ""}`}>
                  {tx.type === "received" ? "+" : "-"}${tx.amount}
                </div>
                <div className="text-xs text-muted-foreground capitalize">{tx.status}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
