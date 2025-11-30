import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Link2, Eye, EyeOff, TrendingUp } from "lucide-react";
import { USER } from "@/lib/constants";
import { getFirstName } from "@/lib/utils";

const recentTransactions = [
  { id: "1", type: "received", from: "@alice", amount: "250.00", time: "2 hours ago" },
  { id: "2", type: "sent", to: "@bob", amount: "100.00", time: "5 hours ago" },
  { id: "3", type: "received", from: "Payment Link", amount: "50.00", time: "1 day ago" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const balance = "1,234.56";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-white text-3xl font-display font-bold mb-1">Welcome back, {getFirstName(USER?.fullName)}</h1>
        <p className="text-muted-foreground">Here's what's happening with your account</p>
      </div>

      {/* Balance Card */}
      <Card className="gradient-card border-border/50 shadow-glow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-foreground/70">Total Balance</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setBalanceVisible(!balanceVisible)}
            >
              {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mb-6">
            <div className="text-4xl font-display font-bold mb-1">
              {balanceVisible ? `$${balance}` : "••••••"}
            </div>
            <div className="flex items-center gap-1 text-sm text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>+12.5% this month</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate("/send")}
              className="h-11 gradient-primary hover:opacity-90 transition-smooth"
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Send
            </Button>
            <Button
              onClick={() => navigate("/links/create")}
              variant="outline"
              className="h-11 border-border hover:bg-accent transition-smooth"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Create Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardDescription>Active Links</CardDescription>
            <CardTitle className="text-2xl font-display">12</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-2xl font-display">$2,450</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardDescription>Transactions</CardDescription>
            <CardTitle className="text-2xl font-display">48</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-display">Recent Transactions</CardTitle>
            <CardDescription>Your latest payment activity</CardDescription>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/transactions")}
            className="text-primary hover:text-primary/80"
          >
            View all
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-smooth cursor-pointer"
              onClick={() => navigate(`/transactions/${tx.id}`)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "received" ? "bg-primary/10" : "bg-muted"
                    }`}
                >
                  {tx.type === "received" ? (
                    <ArrowDownLeft className="h-5 w-5 text-primary" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {tx.type === "received" ? `From ${tx.from}` : `To ${tx.to}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{tx.time}</p>
                </div>
              </div>
              <div className={`font-semibold ${tx.type === "received" ? "text-primary" : ""}`}>
                {tx.type === "received" ? "+" : "-"}${tx.amount}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
