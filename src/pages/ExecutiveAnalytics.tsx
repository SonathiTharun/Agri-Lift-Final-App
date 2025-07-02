import { Layout } from "@/components/Layout";
import { ExecutiveNavbar } from "@/components/ExecutiveNavbar";
import AnalyticsDashboard from "@/components/executive/AnalyticsDashboard";

const ExecutiveAnalytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-foliage-light via-sky-light to-wheat-light">
      <ExecutiveNavbar />
      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-6">
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveAnalytics;
