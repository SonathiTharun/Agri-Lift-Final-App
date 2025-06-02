
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Download,
  CreditCard,
  PieChart,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoanApplication {
  id: string;
  farmerName: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  appliedDate: string;
  documents: string[];
  creditScore: number;
  collateral: string;
  interestRate: number;
}

interface Transaction {
  id: string;
  type: 'payment' | 'commission' | 'loan_disbursement' | 'refund';
  amount: number;
  farmerName: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

const FinancialManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("loans");
  
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([
    {
      id: "1",
      farmerName: "Rajesh Kumar",
      amount: 50000,
      purpose: "Seed purchase for Kharif season",
      status: "pending",
      appliedDate: "2024-05-15",
      documents: ["income_cert.pdf", "land_records.pdf"],
      creditScore: 750,
      collateral: "Land (5 acres)",
      interestRate: 8.5
    },
    {
      id: "2",
      farmerName: "Priya Sharma",
      amount: 75000,
      purpose: "Farm equipment purchase",
      status: "approved",
      appliedDate: "2024-05-10",
      documents: ["income_cert.pdf", "equipment_quote.pdf"],
      creditScore: 720,
      collateral: "Equipment",
      interestRate: 9.0
    },
    {
      id: "3",
      farmerName: "Amit Patel",
      amount: 100000,
      purpose: "Irrigation system installation",
      status: "disbursed",
      appliedDate: "2024-04-20",
      documents: ["project_plan.pdf", "contractor_quote.pdf"],
      creditScore: 680,
      collateral: "Land (10 acres)",
      interestRate: 9.5
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "payment",
      amount: 15000,
      farmerName: "Amit Patel",
      date: "2024-05-20",
      status: "completed",
      reference: "PAY-2024-001"
    },
    {
      id: "2",
      type: "commission",
      amount: 2500,
      farmerName: "Rajesh Kumar",
      date: "2024-05-19",
      status: "completed",
      reference: "COM-2024-002"
    },
    {
      id: "3",
      type: "loan_disbursement",
      amount: 75000,
      farmerName: "Priya Sharma",
      date: "2024-05-18",
      status: "pending",
      reference: "LOAN-2024-003"
    }
  ]);

  const [financialMetrics, setFinancialMetrics] = useState({
    totalRevenue: 2450000,
    totalLoansDisburse: 1820000,
    commissionEarned: 180000,
    pendingApprovals: 12,
    defaultRate: 2.3,
    avgLoanAmount: 65000
  });

  const handleLoanAction = async (loanId: string, action: 'approve' | 'reject' | 'disburse') => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLoanApplications(prev => prev.map(loan => 
        loan.id === loanId 
          ? { ...loan, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'disbursed' }
          : loan
      ));
      
      toast({
        title: `Loan ${action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Disbursed'}`,
        description: `Loan application ${loanId} has been ${action}d successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process loan action.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string, icon: React.ReactNode }> = {
      pending: { className: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <Clock className="h-3 w-3" /> },
      approved: { className: "bg-blue-100 text-blue-800 border-blue-200", icon: <CheckCircle className="h-3 w-3" /> },
      rejected: { className: "bg-red-100 text-red-800 border-red-200", icon: <XCircle className="h-3 w-3" /> },
      disbursed: { className: "bg-green-100 text-green-800 border-green-200", icon: <DollarSign className="h-3 w-3" /> },
      completed: { className: "bg-green-100 text-green-800 border-green-200", icon: <CheckCircle className="h-3 w-3" /> },
      failed: { className: "bg-red-100 text-red-800 border-red-200", icon: <XCircle className="h-3 w-3" /> }
    };
    
    return (
      <Badge className={`${variants[status]?.className} animate-pulse flex items-center gap-1`}>
        {variants[status]?.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const exportData = (type: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Export Completed",
        description: `${type} data has been exported successfully.`,
      });
    }, 2000);
  };

  const filteredLoans = loanApplications.filter(loan =>
    loan.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center animate-slide-in">
        <h2 className="text-2xl font-bold">Financial Management</h2>
        <Button 
          onClick={() => exportData("Financial Report")}
          disabled={isLoading}
          className="hover:scale-105 transition-transform"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Financial Report
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", value: `₹${(financialMetrics.totalRevenue / 100000).toFixed(1)}L`, subtitle: "+15.3% from last month", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { title: "Loans Disbursed", value: `₹${(financialMetrics.totalLoansDisburse / 100000).toFixed(1)}L`, subtitle: "23 loans this month", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Commission Earned", value: `₹${(financialMetrics.commissionEarned / 100000).toFixed(1)}L`, subtitle: "7.3% of total revenue", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" },
          { title: "Default Rate", value: `${financialMetrics.defaultRate}%`, subtitle: "Below industry avg", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" }
        ].map((metric, index) => (
          <Card key={metric.title} className={`hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in ${metric.bg}`} style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="loans" className="transition-all hover:scale-105">Loan Applications</TabsTrigger>
          <TabsTrigger value="transactions" className="transition-all hover:scale-105">Transactions</TabsTrigger>
          <TabsTrigger value="analytics" className="transition-all hover:scale-105">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="transition-all hover:scale-105">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="loans" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Loan Applications</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search loan applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLoans.map((loan, index) => (
                  <div key={loan.id} className="border rounded-lg p-4 hover:shadow-md transition-all animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg">{loan.farmerName}</h4>
                          {getStatusBadge(loan.status)}
                          <Badge variant="outline" className={getCreditScoreColor(loan.creditScore)}>
                            Credit Score: {loan.creditScore}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Amount:</span>
                            <span className="ml-2 font-bold text-green-600">₹{loan.amount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Interest Rate:</span>
                            <span className="ml-2 font-bold">{loan.interestRate}%</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Collateral:</span>
                            <span className="ml-2">{loan.collateral}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-600">Purpose:</span>
                          <span className="ml-2">{loan.purpose}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Applied: {new Date(loan.appliedDate).toLocaleDateString()}</span>
                          <span>Documents: {loan.documents.join(", ")}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {loan.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleLoanAction(loan.id, 'approve')}
                              disabled={isLoading}
                              className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleLoanAction(loan.id, 'reject')}
                              disabled={isLoading}
                              className="hover:scale-105 transition-transform"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {loan.status === 'approved' && (
                          <Button 
                            size="sm"
                            onClick={() => handleLoanAction(loan.id, 'disburse')}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all"
                          >
                            <DollarSign className="h-3 w-3 mr-1" />
                            Disburse
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div key={transaction.id} className="border rounded-lg p-4 hover:shadow-md transition-all animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-lg">{transaction.farmerName}</p>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Type:</span>
                            <span className="ml-2 capitalize">{transaction.type.replace('_', ' ')}</span>
                          </div>
                          <div>
                            <span className="font-medium">Reference:</span>
                            <span className="ml-2 font-mono">{transaction.reference}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-green-600">₹{transaction.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
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
                  Loan Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Approved", count: 45, percentage: 65, color: "bg-green-500" },
                    { category: "Pending", count: 12, percentage: 17, color: "bg-yellow-500" },
                    { category: "Disbursed", count: 10, percentage: 14, color: "bg-blue-500" },
                    { category: "Rejected", count: 3, percentage: 4, color: "bg-red-500" }
                  ].map((item, index) => (
                    <div key={item.category} className="animate-slide-in" style={{ animationDelay: `${index * 200}ms` }}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.category}</span>
                        <span>{item.count} loans ({item.percentage}%)</span>
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

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg animate-pulse">
                    <div className="text-2xl font-bold text-green-600">{financialMetrics.defaultRate}%</div>
                    <div className="text-sm text-green-700">Current Default Rate</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold">₹{financialMetrics.avgLoanAmount.toLocaleString()}</div>
                      <div className="text-gray-600">Avg Loan Amount</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold">720</div>
                      <div className="text-gray-600">Avg Credit Score</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Monthly Revenue Report", desc: "Detailed revenue breakdown", icon: FileText },
                  { title: "Loan Performance Report", desc: "Loan statistics and trends", icon: TrendingUp },
                  { title: "Transaction Summary", desc: "All transaction details", icon: CreditCard },
                  { title: "Risk Assessment Report", desc: "Portfolio risk analysis", icon: AlertTriangle },
                  { title: "Commission Report", desc: "Commission tracking", icon: DollarSign },
                  { title: "Compliance Report", desc: "Regulatory compliance", icon: FileText }
                ].map((report, index) => (
                  <Button 
                    key={report.title}
                    variant="outline" 
                    className="h-24 flex flex-col hover:shadow-lg hover:scale-105 transition-all animate-fade-in" 
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => exportData(report.title)}
                    disabled={isLoading}
                  >
                    <report.icon className="h-6 w-6 mb-2" />
                    <div className="text-center">
                      <div className="font-medium text-sm">{report.title}</div>
                      <div className="text-xs text-gray-500">{report.desc}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
