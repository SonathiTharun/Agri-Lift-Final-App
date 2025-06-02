
import { Layout } from "@/components/Layout";
import { ExecutiveNavbar } from "@/components/ExecutiveNavbar";
import ResourceManagement from "@/components/executive/ResourceManagement";
import MarketAdmin from "@/components/executive/MarketAdmin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExecutiveOperations = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExecutiveNavbar />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="resources" className="space-y-6">
            <TabsList>
              <TabsTrigger value="resources">Resource Management</TabsTrigger>
              <TabsTrigger value="market">Market Administration</TabsTrigger>
            </TabsList>

            <TabsContent value="resources">
              <ResourceManagement />
            </TabsContent>

            <TabsContent value="market">
              <MarketAdmin />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveOperations;
