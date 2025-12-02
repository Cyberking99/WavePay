import { useState } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Home, Send, Link2, DollarSign, History, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { APP_NAME, USER, ROUTES } from "@/lib/constants";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

const navigation = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: Home },
  { name: "Send Money", href: ROUTES.SEND, icon: Send },
  { name: "Payment Links", href: ROUTES.LINKS, icon: Link2 },
  { name: "Offramp", href: ROUTES.OFFRAMP, icon: DollarSign },
  { name: "Transactions", href: ROUTES.TRANSACTIONS, icon: History },
  { name: "Profile", href: ROUTES.PROFILE, icon: User },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();

  if (status === "connecting" || status === "reconnecting") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  console.log(USER);

  if (!isConnected) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  if (!USER) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <h1 className="text-white text-xl font-display font-bold">
              {APP_NAME}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden bg-primary text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <Button onClick={() => open()} variant={isConnected ? "outline" : "default"} className="gradient-primary hover:opacity-90 transition-smooth">
            {isConnected ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white" />
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
