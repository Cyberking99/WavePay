import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, ArrowDownLeft, Search, Link2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAccount } from "wagmi";
import { Loader2 } from "lucide-react";
import { truncateAddress } from "@/lib/utils";

export default function Transactions() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/transactions?page=${currentPage}&limit=10`);
        if (response.data.success) {
          setTransactions(response.data.transactions);
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage]);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.amount.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-white text-3xl font-display font-bold mb-1">Transaction History</h1>
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.to === address ? "bg-primary/10" : "bg-muted"
                    }`}
                >
                  {tx.linkId ? (
                    <Link2 className="h-5 w-5 text-primary" />
                  ) : tx.to === address ? (
                    <ArrowDownLeft className="h-5 w-5 text-primary" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {tx.linkId ? "Payment Link" : tx.to === address ? `Received` : `Sent`}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {tx.to === address ? `From ${truncateAddress(tx.from)}` : `To ${truncateAddress(tx.to)}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{new Date(tx.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className={`font-semibold ${tx.to === address ? "text-primary" : ""}`}>
                  {tx.to === address ? "+" : "-"}${tx.amount}
                </div>
                <div className="text-xs text-muted-foreground capitalize">{tx.status}</div>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
