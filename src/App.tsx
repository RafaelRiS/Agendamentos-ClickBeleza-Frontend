import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import MyAppointments from "./pages/MyAppointments";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import AnalyticsTracker from "./analytics/AnalyticsTracker"
import AnalyticsDashboard from "@/analytics/AnalyticsDashboard.tsx";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <AnalyticsTracker />
          <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/meus-agendamentos" element={<MyAppointments />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="*" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;