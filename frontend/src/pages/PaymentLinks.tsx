import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Power, Plus, Link2 } from "lucide-react";
import { toast } from "sonner";
import { APP_URL } from "@/lib/constants";

export default function PaymentLinks() {
  const navigate = useNavigate();
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await api.get('/links');
        setLinks(response.data.links);
      } catch (error) {
        console.error("Fetch links error:", error);
        toast.error("Failed to load links");
      }
    };
    fetchLinks();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard");
  };

  const toggleStatus = (id: string) => {
    // This would need an API endpoint to actually toggle status
    setLinks(
      links.map((link) =>
        link.id === id
          ? { ...link, active: !link.active }
          : link
      )
    );
    toast.success("Link status updated");
  };

  const isLinkActive = (link: any) => {
    return link.type == "time-based" ? new Date(link.expiryDate) > new Date() && link.active : link.active;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-display font-bold mb-1">Payment Links</h1>
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
          <Card
            key={link.id}
            className="group relative bg-card hover:bg-accent/50 border border-border rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer"
            onClick={() => navigate(`/links/${link.linkId}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Link2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="font-display text-xl flex items-center gap-2">
                      {link.amount ? `$${link.amount}` : "Optional Amount"}
                      <Badge
                        variant={isLinkActive(link) ? "default" : "destructive"}
                        className="ml-2"
                      >
                        {isLinkActive(link) ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-base">
                      {link.description || "No description"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(`${APP_URL}/pay/${link.linkId}`);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`${APP_URL}/pay/${link.linkId}`, "_blank");
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
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
                  <p className="font-medium">{new Date(link.createdAt).toLocaleDateString()}</p>
                </div>
                {link.type === "time-based" && link.expiryDate && (
                  <div>
                    <p className="text-muted-foreground mb-1">Expires</p>
                    <p className="font-medium">{new Date(link.expiryDate).toLocaleDateString()}</p>
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
