
import { Layout } from "@/components/Layout";
import { ExecutiveNavbar } from "@/components/ExecutiveNavbar";
import CommunicationHub from "@/components/executive/CommunicationHub";

const ExecutiveCommunications = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExecutiveNavbar />
      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-6">
          <CommunicationHub />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveCommunications;
