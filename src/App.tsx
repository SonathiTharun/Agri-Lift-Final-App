import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";

// Lazy load components to identify any import issues
const Welcome = React.lazy(() => import("./pages/Welcome"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Loans = React.lazy(() => import("./pages/Loans"));
const Market = React.lazy(() => import("./pages/Market"));
const ProductCategory = React.lazy(() => import("./pages/ProductCategory"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Labour = React.lazy(() => import("./pages/Labour"));
const Machinery = React.lazy(() => import("./pages/Machinery"));
const Export = React.lazy(() => import("./pages/Export"));
const Monitoring = React.lazy(() => import("./pages/Monitoring"));
const Services = React.lazy(() => import("./pages/Services"));
const Contact = React.lazy(() => import("./pages/Contact"));
const FarmingType = React.lazy(() => import("./pages/FarmingType"));
const CropAllocation = React.lazy(() => import("./pages/CropAllocation"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Profile = React.lazy(() => import("./pages/Profile"));
const ExecutiveDashboard = React.lazy(() => import("./pages/ExecutiveDashboard"));
const ExecutiveFarmers = React.lazy(() => import("./pages/ExecutiveFarmers"));
const ExecutiveAnalytics = React.lazy(() => import("./pages/ExecutiveAnalytics"));
const ExecutiveFinancial = React.lazy(() => import("./pages/ExecutiveFinancial"));
const ExecutiveOperations = React.lazy(() => import("./pages/ExecutiveOperations"));
const ExecutiveCommunications = React.lazy(() => import("./pages/ExecutiveCommunications"));
const DairyLiftHome = React.lazy(() => import("./pages/dairy-lift/DairyLiftHome"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-green-700 font-medium">Loading Agri-Lift Soil Insight...</p>
    </div>
  </div>
);

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
        <Route path="/executive/farmers" element={<ExecutiveFarmers />} />
        <Route path="/executive/analytics" element={<ExecutiveAnalytics />} />
        <Route path="/executive/financial" element={<ExecutiveFinancial />} />
        <Route path="/executive/operations" element={<ExecutiveOperations />} />
        <Route path="/executive/communications" element={<ExecutiveCommunications />} />
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
        <Route path="/dairy-lift/*" element={<DairyLiftHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </TooltipProvider>
);

export default App;
