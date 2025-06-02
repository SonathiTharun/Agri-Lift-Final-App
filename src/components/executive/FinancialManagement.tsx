
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoanApplication {
  id: string;
  farmerName: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  documents: string[];
}

interface Transaction {
  id: string;
  type: 'payment' | 'commission' | 'loan_disbursement';
  amount: number;
  farmerName: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const FinancialManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [loanApplications] = useState<LoanApplication[]>([
    {
      id: "1",
      farmerName: "Rajesh Kumar",
      amount: 50000,
      purpose: "Seed purchase for Kharif season",
      status: "pending",
      appliedDate: "2024-05-15",
      documents: ["income_cert.pdf", "land_records.pdf"]
    },
    {
      id: "2",
      farmerName: "Priya Sharma",
      amount: 75000,
      purpose: "Farm equipment purchase",
      status: "approved",
      appliedDate: "2024-05-10",
      documents: ["income_cert.pdf", "equipment_quote.pdf"]
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "payment",
      amount: 15000,
      farmerName: "Amit Patel",
      date: "2024-05-20",
      status: "completed"
    },
    {
      id: "2",
      type: "commission",
      amount: 2500,
      farmerName: "Rajesh Kumar",
      date: "2024-05-19",
      status: "completed"
    }
  ]);

  const handleLoanAction = (loanId: string, action: 'approve' | 'reject') => {
    toast({
      title: `Loan ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `Loan application ${loanId} has been ${action}d successfully.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      completed: "default",
      failed: "destructive"
    };
    
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Management</h2>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Financial Report
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹24.5L</div>
            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loans Disbursed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹18.2L</div>
            <p className="text-xs text-muted-foreground">23 loans this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1.8L</div>
            <p className="text-xs text-muted-foreground">7.3% of total revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="loans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="loans">Loan Applications</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Applications</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search loan applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanApplications.map((loan) => (
                  <div key={loan.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{loan.farmerName}</h4>
                          {getStatusBadge(loan.status)}
                        </div>
                        <p className="text-sm text-gray-600">Amount: ₹{loan.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Purpose: {loan.purpose}</p>
                        <p className="text-xs text-gray-500">Applied: {new Date(loan.appliedDate).toLocaleDateString()}</p>
                        <div className="text-xs text-gray-500">
                          Documents: {loan.documents.join(", ")}
                        </div>
                      </div>
                      
                      {loan.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleLoanAction(loan.id, 'approve')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleLoanAction(loan.id, 'reject')}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{transaction.farmerName}</p>
                        <p className="text-sm text-gray-600 capitalize">{transaction.type.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{transaction.amount.toLocaleString()}</p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Monthly Revenue Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Loan Performance Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Transaction Summary
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Commission Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
