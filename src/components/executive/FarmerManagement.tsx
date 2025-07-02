import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  MessageSquare,
  MoreHorizontal,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingCart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  landArea: number;
  joinDate: string;
  lastActive: string;
  totalOrders: number;
  totalSpent: number;
  cropTypes: string[];
  loanStatus: 'none' | 'active' | 'pending' | 'defaulted';
  verification: 'verified' | 'pending' | 'rejected';
}

const FarmerManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
  const navigate = useNavigate();
  const [viewedFarmer, setViewedFarmer] = useState<Farmer | null>(null);
  const [contactFarmer, setContactFarmer] = useState<Farmer | null>(null);
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  
  const [farmers, setFarmers] = useState<Farmer[]>([
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
      totalSpent: 125000,
      cropTypes: ["Wheat", "Rice", "Corn"],
      loanStatus: "active",
      verification: "verified"
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
      totalSpent: 89000,
      cropTypes: ["Vegetables", "Fruits"],
      loanStatus: "none",
      verification: "verified"
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
      totalSpent: 35000,
      cropTypes: ["Cotton", "Sugarcane"],
      loanStatus: "pending",
      verification: "pending"
    },
    {
      id: "4",
      name: "Sunita Devi",
      email: "sunita@email.com",
      phone: "+91 65432 10987",
      location: "Bihar, India",
      status: "suspended",
      landArea: 8.5,
      joinDate: "2024-03-05",
      lastActive: "1 week ago",
      totalOrders: 5,
      totalSpent: 15000,
      cropTypes: ["Rice", "Pulses"],
      loanStatus: "defaulted",
      verification: "rejected"
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive", className: string }> = {
      active: { variant: "default", className: "bg-green-100 text-green-800 border-green-200" },
      pending: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      inactive: { variant: "secondary", className: "bg-gray-100 text-gray-800 border-gray-200" },
      suspended: { variant: "destructive", className: "bg-red-100 text-red-800 border-red-200" }
    };
    
    return (
      <Badge className={`${variants[status]?.className} animate-pulse`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleAction = async (action: string, farmerId: string, farmerName: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (action === "Approve") {
        setFarmers(prev => prev.map(farmer => 
          farmer.id === farmerId 
            ? { ...farmer, status: 'active' as const, verification: 'verified' as const }
            : farmer
        ));
      } else if (action === "Suspend") {
        setFarmers(prev => prev.map(farmer => 
          farmer.id === farmerId 
            ? { ...farmer, status: 'suspended' as const }
            : farmer
        ));
      }
      
      toast({
        title: `${action} Completed`,
        description: `Action "${action}" performed for farmer ${farmerName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedFarmers.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select farmers first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Bulk Action Completed",
        description: `${action} applied to ${selectedFarmers.length} farmers`,
      });
      
      setSelectedFarmers([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform bulk action.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Export Completed",
        description: "Farmer data has been exported successfully.",
      });
    }, 2000);
  };

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || farmer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: farmers.length,
    active: farmers.filter(f => f.status === 'active').length,
    pending: farmers.filter(f => f.status === 'pending').length,
    suspended: farmers.filter(f => f.status === 'suspended').length
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center animate-slide-in">
        <h2 className="text-2xl font-bold">Farmer Management</h2>
        <div className="flex gap-2">
          {selectedFarmers.length > 0 && (
            <div className="flex gap-2 animate-scale-in">
              <Button 
                variant="outline" 
                onClick={() => handleBulkAction("Send Notification")}
                disabled={isLoading}
                className="hover:scale-105 transition-transform"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Notify Selected ({selectedFarmers.length})
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleBulkAction("Suspend")}
                disabled={isLoading}
                className="hover:scale-105 transition-transform"
              >
                <UserX className="h-4 w-4 mr-2" />
                Suspend Selected
              </Button>
            </div>
          )}
          <Button 
            variant="outline" 
            onClick={exportData}
            disabled={isLoading}
            className="hover:scale-105 transition-transform"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Farmers", value: stats.total, icon: User, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active", value: stats.active, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending Approval", value: stats.pending, icon: TrendingUp, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Suspended", value: stats.suspended, icon: UserX, color: "text-red-600", bg: "bg-red-50" }
        ].map((stat, index) => (
          <Card key={stat.label} className={`hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in ${stat.bg}`} style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search farmers by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all focus:scale-105"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background hover:bg-gray-50 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Farmers List */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredFarmers.map((farmer, index) => (
            <Card key={farmer.id} className="hover:shadow-lg transition-all duration-300 hover:scale-102 animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={selectedFarmers.includes(farmer.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFarmers([...selectedFarmers, farmer.id]);
                          } else {
                            setSelectedFarmers(selectedFarmers.filter(id => id !== farmer.id));
                          }
                        }}
                        className="rounded transition-transform hover:scale-110"
                      />
                      <Avatar className="h-12 w-12 hover:scale-110 transition-transform">
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                          {farmer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors cursor-pointer">{farmer.name}</h3>
                        {getStatusBadge(farmer.status)}
                        <Badge variant="outline" className={farmer.verification === 'verified' ? 'border-green-500 text-green-700' : 'border-gray-300'}>
                          {farmer.verification}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                          <Mail className="h-3 w-3" />
                          {farmer.email}
                        </div>
                        <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                          <Phone className="h-3 w-3" />
                          {farmer.phone}
                        </div>
                        <div className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                          <MapPin className="h-3 w-3" />
                          {farmer.location}
                        </div>
                        <div className="flex items-center gap-1 hover:text-orange-600 transition-colors">
                          <User className="h-3 w-3" />
                          {farmer.landArea} acres
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {farmer.cropTypes.map(crop => (
                          <Badge key={crop} variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                        <span>Joined: {new Date(farmer.joinDate).toLocaleDateString()}</span>
                        <span>Last Active: {farmer.lastActive}</span>
                        <span>Orders: {farmer.totalOrders} | Spent: ₹{farmer.totalSpent.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setViewedFarmer(farmer)}
                      className="hover:scale-105 transition-transform"
                      disabled={isLoading}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    
                    {farmer.status === 'pending' && (
                      <Button 
                        size="sm"
                        onClick={() => handleAction("Approve", farmer.id, farmer.name)}
                        className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all"
                        disabled={isLoading}
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    )}
                    
                    {farmer.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setContactFarmer(farmer);
                          setContactSubject(`Message for ${farmer.name}`);
                          setContactMessage("");
                        }}
                        className="hover:scale-105 transition-transform"
                        disabled={isLoading}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleAction("Suspend", farmer.id, farmer.name)}
                      className="hover:scale-105 transition-transform"
                      disabled={isLoading}
                    >
                      <UserX className="h-3 w-3 mr-1" />
                      Suspend
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-bold text-green-600">₹{farmers.reduce((sum, f) => sum + f.totalSpent, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average per Farmer</span>
                    <span className="font-bold">₹{Math.round(farmers.reduce((sum, f) => sum + f.totalSpent, 0) / farmers.length).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Order Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Orders</span>
                    <span className="font-bold text-blue-600">{farmers.reduce((sum, f) => sum + f.totalOrders, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average per Farmer</span>
                    <span className="font-bold">{Math.round(farmers.reduce((sum, f) => sum + f.totalOrders, 0) / farmers.length)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Land Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Land Area</span>
                    <span className="font-bold text-purple-600">{farmers.reduce((sum, f) => sum + f.landArea, 0)} acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Farm Size</span>
                    <span className="font-bold">{Math.round(farmers.reduce((sum, f) => sum + f.landArea, 0) / farmers.length)} acres</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {filteredFarmers.length === 0 && (
        <Card className="animate-fade-in">
          <CardContent className="pt-6 text-center py-12">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No farmers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            <Button 
              className="mt-4 hover:scale-105 transition-transform" 
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog for View Profile */}
      <Dialog open={!!viewedFarmer} onOpenChange={open => !open && setViewedFarmer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Farmer Profile</DialogTitle>
            <DialogDescription>Details of the selected farmer.</DialogDescription>
          </DialogHeader>
          {viewedFarmer && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-2xl">
                    {viewedFarmer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-lg">{viewedFarmer.name}</div>
                  <div className="text-sm text-gray-600">{viewedFarmer.email}</div>
                  <div className="text-sm text-gray-600">{viewedFarmer.phone}</div>
                  <div className="text-sm text-gray-600">{viewedFarmer.location}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {viewedFarmer.cropTypes.map(crop => (
                  <Badge key={crop} variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">{crop}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Land Area: <b>{viewedFarmer.landArea} acres</b></span>
                <span>Status: <b>{viewedFarmer.status}</b></span>
                <span>Verification: <b>{viewedFarmer.verification}</b></span>
                <span>Joined: <b>{new Date(viewedFarmer.joinDate).toLocaleDateString()}</b></span>
                <span>Last Active: <b>{viewedFarmer.lastActive}</b></span>
                <span>Orders: <b>{viewedFarmer.totalOrders}</b></span>
                <span>Total Spent: <b>₹{viewedFarmer.totalSpent.toLocaleString()}</b></span>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Contact */}
      <Dialog open={!!contactFarmer} onOpenChange={open => !open && setContactFarmer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Farmer</DialogTitle>
            <DialogDescription>Send a message to the selected farmer.</DialogDescription>
          </DialogHeader>
          {contactFarmer && (
            <form onSubmit={e => {
              e.preventDefault();
              setContactFarmer(null);
              toast({ title: "Message Sent", description: `Message sent to ${contactFarmer.name}` });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <Input value={contactFarmer.email} disabled className="bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Input value={contactSubject} onChange={e => setContactSubject(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea value={contactMessage} onChange={e => setContactMessage(e.target.value)} required rows={4} className="w-full border rounded-md p-2" />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Send</Button>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmerManagement;
