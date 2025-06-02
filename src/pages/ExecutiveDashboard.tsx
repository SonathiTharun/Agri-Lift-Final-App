
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Tractor,
  User,
  Calendar,
  Bell,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardMetrics {
  totalFarmers: number;
  activeFarmers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  pendingLoans: number;
  marketOrders: number;
  machineryBookings: number;
  laborRequests: number;
}

const ExecutiveDashboard = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalFarmers: 1247,
    activeFarmers: 892,
    totalRevenue: 2450000,
    monthlyGrowth: 15.3,
    pendingLoans: 23,
    marketOrders: 156,
    machineryBookings: 78,
    laborRequests: 34
  });

  const [recentActivities] = useState([
    { id: 1, type: 'farmer_registration', message: 'New farmer registered: Rajesh Kumar', time: '2 hours ago' },
    { id: 2, type: 'loan_application', message: 'Loan application submitted by Priya Sharma', time: '4 hours ago' },
    { id: 3, type: 'market_order', message: 'Large order placed for seeds (₹50,000)', time: '6 hours ago' },
    { id: 4, type: 'machinery_booking', message: 'Tractor booked for next week', time: '8 hours ago' }
  ]);

  const handleQuickAction = (action: string) => {
    toast({
      title: "Action Initiated",
      description: `${action} has been initiated successfully.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor and manage AgriLift platform operations</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleQuickAction("System Health Check")}>
              <Activity className="h-4 w-4 mr-2" />
              Health Check
            </Button>
            <Button onClick={() => handleQuickAction("Generate Report")}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalFarmers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{metrics.activeFarmers}</span> active this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(metrics.totalRevenue / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{metrics.monthlyGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Loans</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pendingLoans}</div>
              <p className="text-xs text-muted-foreground">
                Requiring approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.marketOrders}</div>
              <p className="text-xs text-muted-foreground">
                Active orders
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {activity.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Platform Uptime</span>
                        <span>99.8%</span>
                      </div>
                      <Progress value={99.8} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Database Performance</span>
                        <span>96.2%</span>
                      </div>
                      <Progress value={96.2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>API Response Time</span>
                        <span>142ms avg</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="farmers">
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                Farmer management features are being implemented. You'll be able to view, manage, and support all registered farmers.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="financial">
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                Financial management tools including loan approvals, payment tracking, and revenue analytics are coming soon.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="operations">
            <Alert>
              <Tractor className="h-4 w-4" />
              <AlertDescription>
                Operations management for machinery, labor, and market activities will be available here.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="analytics">
            <Alert>
              <PieChart className="h-4 w-4" />
              <AlertDescription>
                Advanced analytics and reporting features are under development for comprehensive business insights.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ExecutiveDashboard;
