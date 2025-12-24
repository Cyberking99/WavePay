import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Send from "./pages/Send";
import Offramp from "./pages/Offramp";
import CreateLink from "./pages/CreateLink";
import PaymentLinks from "./pages/PaymentLinks";
import LinkDetails from "./pages/LinkDetails";
import Transactions from "./pages/Transactions";
import TradePage from "./pages/TradePage";
import TransactionDetail from "./pages/TransactionDetail";
import Profile from "./pages/Profile";
import AppLayout from "./components/layouts/AppLayout";
import NotFound from "./pages/NotFound";
import Pay from "./pages/Pay";
import BankAccounts from "./pages/BankAccounts";
import Swap from "./pages/Swap";
import { ContextProvider } from "@/config";

const App = () => (
  <ContextProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send" element={<Send />} />
            <Route path="/offramp" element={<Offramp />} />
            <Route path="/links" element={<PaymentLinks />} />
            <Route path="/links/create" element={<CreateLink />} />
            <Route path="/links/:id" element={<LinkDetails />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bank-accounts" element={<BankAccounts />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/trade" element={<TradePage />} />
          </Route>
          <Route path="/pay/:id" element={<Pay />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ContextProvider>
);

export default App;
