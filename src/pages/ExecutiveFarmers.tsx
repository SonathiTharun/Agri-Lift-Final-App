import { Layout } from "@/components/Layout";
import { ExecutiveNavbar } from "@/components/ExecutiveNavbar";
import FarmerManagement from "@/components/executive/FarmerManagement";

const ExecutiveFarmers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-foliage-light via-sky-light to-wheat-light">
      <ExecutiveNavbar />
      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-6">
          <FarmerManagement />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveFarmers;
