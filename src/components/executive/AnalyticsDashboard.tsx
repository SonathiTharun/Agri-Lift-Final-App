import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MapPin,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const analyticsData = {
    userGrowth: [
      { month: "Jan", farmers: 120, executives: 5 },
      { month: "Feb", farmers: 145, executives: 7 },
      { month: "Mar", farmers: 180, executives: 9 },
      { month: "Apr", farmers: 220, executives: 12 },
      { month: "May", farmers: 280, executives: 15 }
    ],
    revenueData: [
      { category: "Market Sales", amount: 450000, growth: 12.5 },
      { category: "Machinery Rental", amount: 180000, growth: 8.3 },
      { category: "Labor Services", amount: 120000, growth: 15.2 },
      { category: "Loan Commissions", amount: 85000, growth: -2.1 }
    ],
    regionalPerformance: [
      { region: "Punjab", farmers: 450, revenue: 180000, growth: 15.2 },
      { region: "Haryana", farmers: 320, revenue: 145000, growth: 12.8 },
      { region: "Gujarat", farmers: 280, revenue: 125000, growth: 18.5 },
      { region: "Maharashtra", farmers: 190, revenue: 95000, growth: 10.3 }
    ]
  };

  const handleFilterApply = () => {
    setFilterOpen(false);
    toast({ title: "Filter Applied", description: `Showing data from ${dateRange.from} to ${dateRange.to}` });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await new Promise(res => setTimeout(res, 1200));
      toast({ title: "Export Complete", description: "Analytics exported as CSV." });
    } catch {
      toast({ title: "Export Failed", description: "An error occurred during export.", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wheat-light via-sky-light to-foliage-light">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foliage-dark drop-shadow-md">Analytics Dashboard</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setFilterOpen(true)} className="hover:scale-105 hover:shadow-2xl transition-all focus:ring-2 focus:ring-foliage-dark">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button onClick={handleExport} disabled={exporting} className="bg-gradient-to-r from-foliage-light to-sky-light text-foliage-dark hover:from-foliage-dark hover:to-sky-dark hover:text-white focus:ring-4 focus:ring-foliage-300 transition-all">
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </div>
        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogContent className="backdrop-blur-lg bg-white/60 border border-white/30 shadow-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-foliage-dark text-2xl font-bold">Filter by Date Range</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} className="rounded-xl border-foliage-200 focus:ring-2 focus:ring-foliage-dark" />
              <Input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} className="rounded-xl border-foliage-200 focus:ring-2 focus:ring-foliage-dark" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFilterOpen(false)} className="hover:scale-105 transition-all">Cancel</Button>
              <Button onClick={handleFilterApply} className="bg-gradient-to-r from-foliage-light to-sky-light text-foliage-dark hover:from-foliage-dark hover:to-sky-dark hover:text-white focus:ring-4 focus:ring-foliage-300 transition-all">Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 animate-fade-in">
          {/* Cards use glassmorphism and color palette */}
          <Card className="bg-white/60 backdrop-blur-md border border-white/30 shadow-xl rounded-3xl hover:shadow-2xl hover:scale-105 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foliage-dark">Total Users</CardTitle>
              <Users className="h-4 w-4 text-foliage-dark" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foliage-dark">1,347</div>
              <p className="text-xs text-foliage-dark/70">+27% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-md border border-white/30 shadow-xl rounded-3xl hover:shadow-2xl hover:scale-105 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foliage-dark">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-foliage-dark" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foliage-dark">₹8.35L</div>
              <p className="text-xs text-foliage-dark/70">+12.3% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-md border border-white/30 shadow-xl rounded-3xl hover:shadow-2xl hover:scale-105 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foliage-dark">Platform Usage</CardTitle>
              <BarChart3 className="h-4 w-4 text-foliage-dark" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foliage-dark">94.2%</div>
              <p className="text-xs text-foliage-dark/70">Average daily active users</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-md border border-white/30 shadow-xl rounded-3xl hover:shadow-2xl hover:scale-105 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foliage-dark">Satisfaction Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-foliage-dark" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foliage-dark">4.8/5</div>
              <p className="text-xs text-foliage-dark/70">Based on 1,200+ reviews</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
            <TabsTrigger value="regional">Regional Performance</TabsTrigger>
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.userGrowth.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{data.month}</span>
                        <div className="flex gap-4">
                          <span className="text-sm text-blue-600">{data.farmers} farmers</span>
                          <span className="text-sm text-green-600">{data.executives} executives</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Daily Active Users</span>
                        <span>94.2%</span>
                      </div>
                      <Progress value={94.2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Feature Adoption</span>
                        <span>87.5%</span>
                      </div>
                      <Progress value={87.5} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>User Retention</span>
                        <span>91.8%</span>
                      </div>
                      <Progress value={91.8} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Session Duration</span>
                        <span>78.3%</span>
                      </div>
                      <Progress value={78.3} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.revenueData.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{item.category}</h4>
                          <p className="text-2xl font-bold text-green-600">₹{(item.amount / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.growth >= 0 ? '+' : ''}{item.growth}%
                          </p>
                          <p className="text-xs text-gray-500">vs last month</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.regionalPerformance.map((region, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <h4 className="font-semibold">{region.region}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{region.farmers} active farmers</p>
                          <p className="text-lg font-bold text-green-600">₹{(region.revenue / 1000).toFixed(0)}K revenue</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-600">+{region.growth}% growth</p>
                          <p className="text-xs text-gray-500">this quarter</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Market Trends & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Seasonal Patterns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Peak activity during planting and harvesting seasons</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Kharif Season</span>
                            <span className="text-sm font-medium">High Activity</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Rabi Season</span>
                            <span className="text-sm font-medium">Medium Activity</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Summer</span>
                            <span className="text-sm font-medium">Low Activity</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Popular Services</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Crop Allocation</span>
                            <div className="flex items-center gap-2">
                              <Progress value={92} className="w-16 h-2" />
                              <span className="text-xs">92%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Market Trading</span>
                            <div className="flex items-center gap-2">
                              <Progress value={87} className="w-16 h-2" />
                              <span className="text-xs">87%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Machinery Rental</span>
                            <div className="flex items-center gap-2">
                              <Progress value={73} className="w-16 h-2" />
                              <span className="text-xs">73%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Labor Services</span>
                            <div className="flex items-center gap-2">
                              <Progress value={68} className="w-16 h-2" />
                              <span className="text-xs">68%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
