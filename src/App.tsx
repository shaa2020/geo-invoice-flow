
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/invoices" element={<AppLayout><Invoices /></AppLayout>} />
          <Route path="/invoices/new" element={<AppLayout><CreateInvoice /></AppLayout>} />
          
          {/* Placeholders for future pages */}
          <Route path="/customers" element={<AppLayout><NotFoundPage /></AppLayout>} />
          <Route path="/products" element={<AppLayout><NotFoundPage /></AppLayout>} />
          <Route path="/payments" element={<AppLayout><NotFoundPage /></AppLayout>} />
          <Route path="/reports" element={<AppLayout><NotFoundPage /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><NotFoundPage /></AppLayout>} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
