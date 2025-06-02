
import { Layout } from "@/components/Layout";
import { ExecutiveNavbar } from "@/components/ExecutiveNavbar";
import AnalyticsDashboard from "@/components/executive/AnalyticsDashboard";

const ExecutiveAnalytics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExecutiveNavbar />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveAnalytics;
