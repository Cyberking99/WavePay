import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Link2, Eye, EyeOff, TrendingUp } from "lucide-react";
import { USER } from "@/lib/constants";
import { getFirstName, getTotalBalance, truncateAddress } from "@/lib/utils";
import api from "@/lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [balance, setBalance] = useState("0.00");
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalSent: 0, totalReceived: 0, totalLinks: 0, totalTransactions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      if (USER?.address) {
        const total = await getTotalBalance(USER.address);
        setBalance(total);
      }
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, statsRes] = await Promise.all([
          api.get("/transactions/?limit=5"),
          api.get("/users/stats")
        ]);

        if (transactionsRes.data.success) {
          setRecentTransactions(transactionsRes.data.transactions);
        }
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTransactions = recentTransactions.filter(
    (tx) =>
      tx.from ||
      tx.to ||
      tx.amount
  );

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLinks}</div>
            <p className="text-xs text-muted-foreground">Active payment links</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Lifetime transactions</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime sent</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalReceived.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime received</p>
          </CardContent>
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
          {filteredTransactions.map((tx) => (
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
                    {tx.type === "received" ? `From ${truncateAddress(tx.from)}` : `To ${truncateAddress(tx.to)}`}
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
