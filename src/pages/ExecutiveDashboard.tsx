
import { useState, useEffect } from "react";
import { ExecutiveNavbar } from "@/components/ExecutiveNavbar";
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
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
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

interface RecentActivity {
  id: number;
  type: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'failed';
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

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    { id: 1, type: 'farmer_registration', message: 'New farmer registered: Rajesh Kumar', time: '2 hours ago', priority: 'medium', status: 'completed' },
    { id: 2, type: 'loan_application', message: 'Loan application submitted by Priya Sharma', time: '4 hours ago', priority: 'high', status: 'pending' },
    { id: 3, type: 'market_order', message: 'Large order placed for seeds (₹50,000)', time: '6 hours ago', priority: 'medium', status: 'completed' },
    { id: 4, type: 'machinery_booking', message: 'Tractor booked for next week', time: '8 hours ago', priority: 'low', status: 'completed' }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeFarmers: prev.activeFarmers + Math.floor(Math.random() * 3),
        marketOrders: prev.marketOrders + Math.floor(Math.random() * 2)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (action: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Action Completed",
        description: `${action} has been initiated successfully.`,
      });
      
      // Add new activity
      const newActivity: RecentActivity = {
        id: Date.now(),
        type: 'admin_action',
        message: `Executive performed: ${action}`,
        time: 'Just now',
        priority: 'high',
        status: 'completed'
      };
      
      setRecentActivities(prev => [newActivity, ...prev.slice(0, 3)]);
    }, 2000);
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    setIsLoading(true);
    
    setTimeout(() => {
      // Simulate data refresh
      setMetrics(prev => ({
        ...prev,
        monthlyGrowth: timeframe === 'year' ? 25.8 : timeframe === 'week' ? 8.2 : 15.3
      }));
      setIsLoading(false);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading && metrics.totalFarmers === 1247) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ExecutiveNavbar />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center animate-pulse">
                <Activity className="h-12 w-12 mx-auto mb-4 text-green-600 animate-spin" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Executive Dashboard</h2>
                <p className="text-gray-500">Fetching latest platform data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ExecutiveNavbar />
      <div className="pt-16 animate-fade-in">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8 animate-slide-in">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor and manage AgriLift platform operations</p>
            </div>
            <div className="flex gap-3">
              <select 
                value={selectedTimeframe}
                onChange={(e) => handleTimeframeChange(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white hover:bg-gray-50 transition-colors"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <Button 
                onClick={() => handleQuickAction("System Health Check")}
                className="hover:scale-105 transition-transform"
                disabled={isLoading}
              >
                <Activity className="h-4 w-4 mr-2" />
                Health Check
              </Button>
              <Button 
                onClick={() => handleQuickAction("Generate Report")}
                className="hover:scale-105 transition-transform"
                disabled={isLoading}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: "Total Farmers", value: metrics.totalFarmers.toLocaleString(), subtitle: `${metrics.activeFarmers} active this month`, icon: Users, color: "text-blue-600" },
              { title: "Total Revenue", value: `₹${(metrics.totalRevenue / 100000).toFixed(1)}L`, subtitle: `+${metrics.monthlyGrowth}% from last ${selectedTimeframe}`, icon: DollarSign, color: "text-green-600" },
              { title: "Pending Loans", value: metrics.pendingLoans.toString(), subtitle: "Requiring approval", icon: TrendingUp, color: "text-orange-600" },
              { title: "Market Orders", value: metrics.marketOrders.toString(), subtitle: "Active orders", icon: ShoppingCart, color: "text-purple-600" }
            ].map((metric, index) => (
              <Card key={metric.title} className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-pulse">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Alerts */}
          <div className="mb-8 animate-slide-in">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>System Maintenance:</strong> Scheduled maintenance window tomorrow 2:00 AM - 4:00 AM IST
              </AlertDescription>
            </Alert>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="transition-all hover:scale-105">Overview</TabsTrigger>
              <TabsTrigger value="quickActions" className="transition-all hover:scale-105">Quick Actions</TabsTrigger>
              <TabsTrigger value="analytics" className="transition-all hover:scale-105">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={activity.id} className={`flex items-start justify-between p-3 rounded-lg border transition-all hover:shadow-sm animate-slide-in ${getPriorityColor(activity.priority)}`} style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex-1 flex items-start gap-3">
                            {getStatusIcon(activity.status)}
                            <div>
                              <p className="text-sm font-medium">{activity.message}</p>
                              <p className="text-xs opacity-75">{activity.time}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-2 capitalize">
                            {activity.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "Platform Uptime", value: 99.8, color: "bg-green-500" },
                        { label: "Database Performance", value: 96.2, color: "bg-blue-500" },
                        { label: "API Response Time", value: 85, color: "bg-yellow-500", unit: "142ms avg" }
                      ].map((stat, index) => (
                        <div key={stat.label} className="animate-slide-in" style={{ animationDelay: `${index * 200}ms` }}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{stat.label}</span>
                            <span>{stat.unit || `${stat.value}%`}</span>
                          </div>
                          <Progress value={stat.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="quickActions" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Perform common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "Approve Pending Loans", icon: TrendingUp, action: "Approve All Pending Loans", color: "bg-green-500 hover:bg-green-600" },
                      { label: "Send Weekly Report", icon: User, action: "Send Weekly Report", color: "bg-blue-500 hover:bg-blue-600" },
                      { label: "Schedule Maintenance", icon: Tractor, action: "System Maintenance", color: "bg-orange-500 hover:bg-orange-600" }
                    ].map((item, index) => (
                      <Button 
                        key={item.label}
                        className={`h-20 flex flex-col ${item.color} text-white hover:scale-105 transition-all animate-scale-in`}
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => handleQuickAction(item.action)}
                        disabled={isLoading}
                      >
                        <item.icon className="h-6 w-6 mb-2" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Machinery Utilization</span>
                        <span className="text-green-600 font-semibold">78%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Labor Efficiency</span>
                        <span className="text-blue-600 font-semibold">85%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Market Success Rate</span>
                        <span className="text-purple-600 font-semibold">92%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Regional Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { region: "Punjab", percentage: 35, color: "bg-green-500" },
                        { region: "Haryana", percentage: 25, color: "bg-blue-500" },
                        { region: "Gujarat", percentage: 20, color: "bg-yellow-500" },
                        { region: "Others", percentage: 20, color: "bg-gray-500" }
                      ].map((item, index) => (
                        <div key={item.region} className="animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.region}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${item.color} h-2 rounded-full transition-all duration-1000`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
