
import { Layout } from "@/components/Layout";
import { ExecutiveNavbar } from "@/components/ExecutiveNavbar";
import FinancialManagement from "@/components/executive/FinancialManagement";

const ExecutiveFinancial = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExecutiveNavbar />
      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-6">
          <FinancialManagement />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveFinancial;
