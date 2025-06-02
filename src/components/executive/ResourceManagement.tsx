
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tractor, 
  Users, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Machinery {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'booked' | 'maintenance';
  location: string;
  bookedBy?: string;
  nextMaintenance: string;
  utilizationRate: number;
}

interface Worker {
  id: string;
  name: string;
  skills: string[];
  rating: number;
  status: 'available' | 'assigned' | 'offline';
  currentAssignment?: string;
  phone: string;
  location: string;
}

interface Booking {
  id: string;
  type: 'machinery' | 'labor';
  farmerName: string;
  resourceName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'completed';
  amount: number;
}

const ResourceManagement = () => {
  const { toast } = useToast();
  
  const [machinery] = useState<Machinery[]>([
    {
      id: "1",
      name: "John Deere 5050D",
      type: "Tractor",
      status: "available",
      location: "Punjab Hub",
      nextMaintenance: "2024-06-15",
      utilizationRate: 75
    },
    {
      id: "2",
      name: "Mahindra 575 DI",
      type: "Tractor",
      status: "booked",
      location: "Haryana Hub",
      bookedBy: "Rajesh Kumar",
      nextMaintenance: "2024-07-01",
      utilizationRate: 90
    },
    {
      id: "3",
      name: "Combine Harvester CH-1",
      type: "Harvester",
      status: "maintenance",
      location: "Punjab Hub",
      nextMaintenance: "2024-05-25",
      utilizationRate: 60
    }
  ]);

  const [workers] = useState<Worker[]>([
    {
      id: "1",
      name: "Suresh Patel",
      skills: ["Irrigation", "Pest Control", "Harvesting"],
      rating: 4.8,
      status: "available",
      phone: "+91 98765 43210",
      location: "Punjab"
    },
    {
      id: "2",
      name: "Ramesh Singh",
      skills: ["Planting", "Fertilization", "Equipment Operation"],
      rating: 4.5,
      status: "assigned",
      currentAssignment: "Farm A - Wheat Harvesting",
      phone: "+91 87654 32109",
      location: "Haryana"
    }
  ]);

  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      type: "machinery",
      farmerName: "Rajesh Kumar",
      resourceName: "John Deere 5050D",
      startDate: "2024-05-25",
      endDate: "2024-05-27",
      status: "pending",
      amount: 5000
    },
    {
      id: "2",
      type: "labor",
      farmerName: "Priya Sharma",
      resourceName: "Suresh Patel",
      startDate: "2024-05-26",
      endDate: "2024-05-30",
      status: "confirmed",
      amount: 8000
    }
  ]);

  const handleBookingAction = (bookingId: string, action: string) => {
    toast({
      title: `Booking ${action}`,
      description: `Booking ${bookingId} has been ${action}d successfully.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      available: "default",
      booked: "secondary",
      maintenance: "destructive",
      assigned: "secondary",
      offline: "destructive",
      pending: "secondary",
      confirmed: "default",
      completed: "default"
    };
    
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resource Management</h2>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Machinery
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Worker
          </Button>
        </div>
      </div>

      {/* Resource Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Machinery</CardTitle>
            <Tractor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">78% utilization rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">89 currently assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">12 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4.2L</div>
            <p className="text-xs text-muted-foreground">+22% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="machinery" className="space-y-6">
        <TabsList>
          <TabsTrigger value="machinery">Machinery Fleet</TabsTrigger>
          <TabsTrigger value="workers">Worker Management</TabsTrigger>
          <TabsTrigger value="bookings">Booking Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Resource Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="machinery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Machinery Fleet Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {machinery.map((machine) => (
                  <div key={machine.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{machine.name}</h4>
                          {getStatusBadge(machine.status)}
                        </div>
                        <p className="text-sm text-gray-600">Type: {machine.type}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {machine.location}
                        </div>
                        {machine.bookedBy && (
                          <p className="text-sm text-gray-600">Booked by: {machine.bookedBy}</p>
                        )}
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          Next Maintenance: {new Date(machine.nextMaintenance).toLocaleDateString()}
                        </div>
                        <p className="text-sm text-gray-600">Utilization: {machine.utilizationRate}%</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Schedule Maintenance
                        </Button>
                        <Button size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Worker Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workers.map((worker) => (
                  <div key={worker.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{worker.name}</h4>
                          {getStatusBadge(worker.status)}
                        </div>
                        <p className="text-sm text-gray-600">Skills: {worker.skills.join(", ")}</p>
                        <p className="text-sm text-gray-600">Rating: {worker.rating}/5.0 ⭐</p>
                        <p className="text-sm text-gray-600">Phone: {worker.phone}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {worker.location}
                        </div>
                        {worker.currentAssignment && (
                          <p className="text-sm text-gray-600">Assignment: {worker.currentAssignment}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Contact
                        </Button>
                        <Button size="sm">
                          Assign Task
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">Booking #{booking.id}</h4>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p className="text-sm text-gray-600 capitalize">Type: {booking.type}</p>
                        <p className="text-sm text-gray-600">Farmer: {booking.farmerName}</p>
                        <p className="text-sm text-gray-600">Resource: {booking.resourceName}</p>
                        <p className="text-sm text-gray-600">
                          Duration: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">Amount: ₹{booking.amount}</p>
                      </div>
                      
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleBookingAction(booking.id, 'confirm')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirm
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleBookingAction(booking.id, 'reject')}
                          >
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

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Resource Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Resource analytics dashboard will be implemented here with utilization charts, revenue trends, and performance metrics.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceManagement;
