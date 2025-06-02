
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./components/LanguageContext";
import { CartProvider } from "./context/CartContext";

import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard"; 
import NotFound from "./pages/NotFound";
import Loans from "./pages/Loans";
import Market from "./pages/Market";
import ProductCategory from "./pages/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Labour from "./pages/Labour";
import Machinery from "./pages/Machinery";
import Export from "./pages/Export";
import Monitoring from "./pages/Monitoring";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import FarmingType from "./pages/FarmingType"; 
import CropAllocation from "./pages/CropAllocation";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CartProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
              <Route path="/farming-type" element={<FarmingType />} />
              <Route path="/crop-allocation" element={<CropAllocation />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/market" element={<Market />} />
              <Route path="/market/:categoryId" element={<ProductCategory />} />
              <Route path="/market/:categoryId/:productId" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/labour" element={<Labour />} />
              <Route path="/machinery" element={<Machinery />} />
              <Route path="/export" element={<Export />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </CartProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
