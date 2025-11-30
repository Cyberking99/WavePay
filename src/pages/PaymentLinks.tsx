import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Power, Plus } from "lucide-react";
import { toast } from "sonner";

const mockLinks = [
  {
    id: "1",
    amount: "50.00",
    description: "Consulting Service",
    type: "one-time",
    status: "active",
    uses: 0,
    created: "2024-01-15",
  },
  {
    id: "2",
    amount: "25.00",
    description: "Monthly Subscription",
    type: "public",
    status: "active",
    uses: 12,
    created: "2024-01-10",
  },
  {
    id: "3",
    amount: "100.00",
    description: "Event Ticket",
    type: "time-based",
    status: "expired",
    uses: 5,
    expiry: "2024-01-20",
    created: "2024-01-05",
  },
];

export default function PaymentLinks() {
  const navigate = useNavigate();
  const [links, setLinks] = useState(mockLinks);

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`https://payflow.app/pay/${id}`);
    toast.success("Link copied to clipboard!");
  };

  const toggleStatus = (id: string) => {
    setLinks(
      links.map((link) =>
        link.id === id
          ? { ...link, status: link.status === "active" ? "inactive" : "active" }
          : link
      )
    );
    toast.success("Link status updated");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Payment Links</h1>
          <p className="text-muted-foreground">Manage your payment links and track performance</p>
        </div>
        <Button
          onClick={() => navigate("/links/create")}
          className="gradient-primary hover:opacity-90 transition-smooth"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Link
        </Button>
      </div>

      <div className="grid gap-4">
        {links.map((link) => (
          <Card key={link.id} className="border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="font-display text-xl">
                    ${link.amount}
                    <Badge
                      variant={link.status === "active" ? "default" : "secondary"}
                      className="ml-3"
                    >
                      {link.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {link.description || "No description"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyLink(link.id)}
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(`/pay/${link.id}`, "_blank")}
                    title="Open link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  {link.status !== "expired" && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleStatus(link.id)}
                      title={link.status === "active" ? "Deactivate" : "Activate"}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Type</p>
                  <p className="font-medium capitalize">{link.type.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Uses</p>
                  <p className="font-medium">{link.uses}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Created</p>
                  <p className="font-medium">{link.created}</p>
                </div>
                {link.expiry && (
                  <div>
                    <p className="text-muted-foreground mb-1">Expires</p>
                    <p className="font-medium">{link.expiry}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
