
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Loans from "./pages/Loans";
import Market from "./pages/Market";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Labour from "./pages/Labour";
import Machinery from "./pages/Machinery";
import Export from "./pages/Export";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/market" element={<Market />} />
          <Route path="/market/:category" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/labour" element={<Labour />} />
          <Route path="/machinery" element={<Machinery />} />
          <Route path="/export" element={<Export />} />
          <Route path="/contact" element={<NotFound />} />
          <Route path="/monitoring" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
