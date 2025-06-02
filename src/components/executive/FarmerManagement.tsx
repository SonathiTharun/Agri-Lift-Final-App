
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Eye,
  UserCheck,
  UserX,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  landArea: number;
  joinDate: string;
  lastActive: string;
  totalOrders: number;
  totalSpent: number;
}

const FarmerManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const [farmers] = useState<Farmer[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@email.com",
      phone: "+91 98765 43210",
      location: "Punjab, India",
      status: "active",
      landArea: 25.5,
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      totalOrders: 45,
      totalSpent: 125000
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@email.com",
      phone: "+91 87654 32109",
      location: "Haryana, India",
      status: "active",
      landArea: 18.2,
      joinDate: "2024-02-20",
      lastActive: "1 day ago",
      totalOrders: 32,
      totalSpent: 89000
    },
    {
      id: "3",
      name: "Amit Patel",
      email: "amit@email.com",
      phone: "+91 76543 21098",
      location: "Gujarat, India",
      status: "pending",
      landArea: 42.0,
      joinDate: "2024-05-10",
      lastActive: "3 days ago",
      totalOrders: 12,
      totalSpent: 35000
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      pending: "secondary",
      inactive: "destructive"
    };
    
    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleAction = (action: string, farmerId: string, farmerName: string) => {
    toast({
      title: `${action} Completed`,
      description: `Action "${action}" performed for farmer ${farmerName}`,
    });
  };

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || farmer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Farmer Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search farmers by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Farmers List */}
      <div className="grid gap-4">
        {filteredFarmers.map((farmer) => (
          <Card key={farmer.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {farmer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{farmer.name}</h3>
                      {getStatusBadge(farmer.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {farmer.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {farmer.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {farmer.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {farmer.landArea} acres
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                      <span>Joined: {new Date(farmer.joinDate).toLocaleDateString()}</span>
                      <span>Last Active: {farmer.lastActive}</span>
                      <span>Orders: {farmer.totalOrders} | Spent: ₹{farmer.totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAction("View Profile", farmer.id, farmer.name)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  
                  {farmer.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => handleAction("Approve", farmer.id, farmer.name)}
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                  )}
                  
                  {farmer.status === 'active' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAction("Contact", farmer.id, farmer.name)}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Contact
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleAction("Suspend", farmer.id, farmer.name)}
                  >
                    <UserX className="h-3 w-3 mr-1" />
                    Suspend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFarmers.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No farmers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FarmerManagement;
