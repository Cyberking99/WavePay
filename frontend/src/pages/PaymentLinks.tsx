import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Power, Plus } from "lucide-react";
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

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${APP_URL}/pay/${id}`);
    toast.success("Link copied to clipboard");
  };

  const openLink = (id: string) => {
    window.open(`${APP_URL}/pay/${id}`, '_blank');
  };

  const toggleStatus = (id: string) => {
    setLinks(
      links.map((link) =>
        link.id === id
          ? { ...link, status: link.active === 1 ? "inactive" : "active" }
          : link
      )
    );
    toast.success("Link status updated");
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
          <>
            {console.log(link)}
            <Card key={link.id} className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="font-display text-xl">
                      ${link.amount}
                      <Badge
                        variant={link.active === 1 ? "default" : "destructive"}
                        className="ml-3"
                      >
                        {link.active === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-base">
                      {link.description || "No description"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => copyLink(link.linkId)} title="Copy link">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openLink(link.linkId)} title="Open link">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    {link.active === 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleStatus(link.id)}
                        title={link.active === 1 ? "Deactivate" : "Activate"}
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
                    <p className="font-medium">{new Date(link.createdAt).toLocaleDateString()}</p>
                  </div>
                  {link.expiry && (
                    <div>
                      <p className="text-muted-foreground mb-1">Expires</p>
                      <p className="font-medium">{new Date(link.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ))}
      </div>
    </div>
  );
}
