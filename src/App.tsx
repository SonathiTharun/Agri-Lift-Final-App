
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { WeatherWidget } from "@/components/WeatherWidget";
import Loans from "./pages/Loans";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/contact" element={<NotFound />} />
          <Route path="/market" element={<NotFound />} />
          <Route path="/labour" element={<NotFound />} />
          <Route path="/machinery" element={<NotFound />} />
          <Route path="/export" element={<NotFound />} />
          <Route path="/monitoring" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WeatherWidget />
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
