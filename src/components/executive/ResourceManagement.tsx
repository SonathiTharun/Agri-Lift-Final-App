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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

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
  status: 'pending' | 'confirmed' | 'completed' | 'rejected';
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

  const [bookings, setBookings] = useState<Booking[]>([
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

  const [maintenanceMachine, setMaintenanceMachine] = useState<Machinery | null>(null);
  const [maintenanceDate, setMaintenanceDate] = useState("");
  const [maintenanceNotes, setMaintenanceNotes] = useState("");
  const [viewMachine, setViewMachine] = useState<Machinery | null>(null);
  const [contactWorker, setContactWorker] = useState<Worker | null>(null);
  const [contactWorkerSubject, setContactWorkerSubject] = useState("");
  const [contactWorkerMessage, setContactWorkerMessage] = useState("");
  const [assignWorker, setAssignWorker] = useState<Worker | null>(null);
  const [assignTaskName, setAssignTaskName] = useState("");
  const [assignTaskDesc, setAssignTaskDesc] = useState("");
  const [assignTaskDue, setAssignTaskDue] = useState("");
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [addMachineryOpen, setAddMachineryOpen] = useState(false);
  const [addWorkerOpen, setAddWorkerOpen] = useState(false);
  const [newMachineName, setNewMachineName] = useState("");
  const [newMachineType, setNewMachineType] = useState("");
  const [newMachineLocation, setNewMachineLocation] = useState("");
  const [newMachineNextMaintenance, setNewMachineNextMaintenance] = useState("");
  const [newMachineUtilization, setNewMachineUtilization] = useState("");
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerSkills, setNewWorkerSkills] = useState("");
  const [newWorkerPhone, setNewWorkerPhone] = useState("");
  const [newWorkerLocation, setNewWorkerLocation] = useState("");
  const [newWorkerRating, setNewWorkerRating] = useState("");
  const [machineryList, setMachineryList] = useState(machinery);
  const [workersList, setWorkersList] = useState(workers);

  const handleBookingAction = (bookingId: string, action: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        if (action === 'confirm') {
          toast({ title: 'Booking Confirmed', description: `Booking #${bookingId} has been confirmed.` });
          return { ...b, status: 'confirmed' };
        } else if (action === 'reject') {
          toast({ title: 'Booking Rejected', description: `Booking #${bookingId} has been rejected.` });
          return { ...b, status: 'rejected' as Booking["status"] };
        }
      }
      return b;
    }));
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
      completed: "default",
      rejected: "destructive"
    };
    
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resource Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => setAddMachineryOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Machinery
          </Button>
          <Button variant="outline" onClick={() => setAddWorkerOpen(true)}>
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
                {machineryList.map((machine) => (
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
                        <Button size="sm" variant="outline" onClick={() => {
                          setMaintenanceMachine(machine);
                          setMaintenanceDate("");
                          setMaintenanceNotes("");
                        }}>
                          Schedule Maintenance
                        </Button>
                        <Button size="sm" onClick={() => setViewMachine(machine)}>
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
                {workersList.map((worker) => (
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
                        <Button size="sm" variant="outline" onClick={() => {
                          setContactWorker(worker);
                          setContactWorkerSubject(`Message for ${worker.name}`);
                          setContactWorkerMessage("");
                        }}>
                          Contact
                        </Button>
                        <Button size="sm" onClick={() => {
                          setAssignWorker(worker);
                          setAssignTaskName("");
                          setAssignTaskDesc("");
                          setAssignTaskDue("");
                        }}>
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
                      {booking.status === 'rejected' && (
                        <div className="text-red-600 font-semibold">Rejected</div>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditBooking(booking);
                          setEditStartDate(booking.startDate);
                          setEditEndDate(booking.endDate);
                          setEditAmount(booking.amount.toString());
                        }}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => {
                          setBookings(prev => prev.filter(b => b.id !== booking.id));
                          toast({ title: 'Booking Deleted', description: `Booking #${booking.id} has been deleted.` });
                        }}>
                          Delete
                        </Button>
                      </div>
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

      {/* Dialog for Schedule Maintenance */}
      <Dialog open={!!maintenanceMachine} onOpenChange={open => !open && setMaintenanceMachine(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>Schedule maintenance for the selected machine.</DialogDescription>
          </DialogHeader>
          {maintenanceMachine && (
            <form onSubmit={e => {
              e.preventDefault();
              setMaintenanceMachine(null);
              toast({ title: "Maintenance Scheduled", description: `Maintenance for ${maintenanceMachine.name} on ${maintenanceDate}` });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Machine</label>
                <input value={maintenanceMachine.name} disabled className="bg-gray-100 w-full rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" value={maintenanceDate} onChange={e => setMaintenanceDate(e.target.value)} required className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea value={maintenanceNotes} onChange={e => setMaintenanceNotes(e.target.value)} rows={3} className="w-full border rounded-md p-2" />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Schedule</Button>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for View Details */}
      <Dialog open={!!viewMachine} onOpenChange={open => !open && setViewMachine(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Machinery Details</DialogTitle>
            <DialogDescription>Details of the selected machine.</DialogDescription>
          </DialogHeader>
          {viewMachine && (
            <div className="space-y-3">
              <div className="font-bold text-lg">{viewMachine.name}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Type: <b>{viewMachine.type}</b></span>
                <span>Status: <b>{viewMachine.status}</b></span>
                <span>Location: <b>{viewMachine.location}</b></span>
                <span>Utilization: <b>{viewMachine.utilizationRate}%</b></span>
                <span>Next Maintenance: <b>{new Date(viewMachine.nextMaintenance).toLocaleDateString()}</b></span>
                {viewMachine.bookedBy && <span>Booked By: <b>{viewMachine.bookedBy}</b></span>}
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

      {/* Dialog for Contact Worker */}
      <Dialog open={!!contactWorker} onOpenChange={open => !open && setContactWorker(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Worker</DialogTitle>
            <DialogDescription>Send a message to the selected worker.</DialogDescription>
          </DialogHeader>
          {contactWorker && (
            <form onSubmit={e => {
              e.preventDefault();
              setContactWorker(null);
              toast({ title: "Message Sent", description: `Message sent to ${contactWorker.name}` });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <input value={contactWorker.phone} disabled className="bg-gray-100 w-full rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input value={contactWorkerSubject} onChange={e => setContactWorkerSubject(e.target.value)} required className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea value={contactWorkerMessage} onChange={e => setContactWorkerMessage(e.target.value)} required rows={4} className="w-full border rounded-md p-2" />
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

      {/* Dialog for Assign Task */}
      <Dialog open={!!assignWorker} onOpenChange={open => !open && setAssignWorker(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
            <DialogDescription>Assign a new task to the selected worker.</DialogDescription>
          </DialogHeader>
          {assignWorker && (
            <form onSubmit={e => {
              e.preventDefault();
              setAssignWorker(null);
              toast({ title: "Task Assigned", description: `Task assigned to ${assignWorker.name}` });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Worker</label>
                <input value={assignWorker.name} disabled className="bg-gray-100 w-full rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Task Name</label>
                <input value={assignTaskName} onChange={e => setAssignTaskName(e.target.value)} required className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={assignTaskDesc} onChange={e => setAssignTaskDesc(e.target.value)} required rows={3} className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input type="date" value={assignTaskDue} onChange={e => setAssignTaskDue(e.target.value)} required className="w-full border rounded-md p-2" />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Assign</Button>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Edit Booking */}
      <Dialog open={!!editBooking} onOpenChange={open => !open && setEditBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>Edit the details of this booking.</DialogDescription>
          </DialogHeader>
          {editBooking && (
            <form onSubmit={e => {
              e.preventDefault();
              setBookings(prev => prev.map(b => b.id === editBooking.id ? {
                ...b,
                startDate: editStartDate,
                endDate: editEndDate,
                amount: parseInt(editAmount, 10)
              } : b));
              setEditBooking(null);
              toast({ title: 'Booking Updated', description: `Booking #${editBooking.id} has been updated.` });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input type="date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} required className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} required className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} required min="0" className="w-full border rounded-md p-2" />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Save</Button>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Add Machinery */}
      <Dialog open={addMachineryOpen} onOpenChange={setAddMachineryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Machinery</DialogTitle>
            <DialogDescription>Enter details for the new machine.</DialogDescription>
          </DialogHeader>
          <form onSubmit={e => {
            e.preventDefault();
            setMachineryList(prev => [
              ...prev,
              {
                id: (prev.length + 1).toString(),
                name: newMachineName,
                type: newMachineType,
                status: 'available',
                location: newMachineLocation,
                nextMaintenance: newMachineNextMaintenance,
                utilizationRate: parseInt(newMachineUtilization, 10)
              }
            ]);
            setAddMachineryOpen(false);
            setNewMachineName("");
            setNewMachineType("");
            setNewMachineLocation("");
            setNewMachineNextMaintenance("");
            setNewMachineUtilization("");
            toast({ title: 'Machinery Added', description: 'New machinery has been added.' });
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input value={newMachineName} onChange={e => setNewMachineName(e.target.value)} required className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <input value={newMachineType} onChange={e => setNewMachineType(e.target.value)} required className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input value={newMachineLocation} onChange={e => setNewMachineLocation(e.target.value)} required className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Next Maintenance Date</label>
              <input type="date" value={newMachineNextMaintenance} onChange={e => setNewMachineNextMaintenance(e.target.value)} required className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Utilization Rate (%)</label>
              <input type="number" value={newMachineUtilization} onChange={e => setNewMachineUtilization(e.target.value)} required min="0" max="100" className="w-full border rounded-md p-2" />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Add</Button>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Add Worker */}
      <Dialog open={addWorkerOpen} onOpenChange={setAddWorkerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Worker</DialogTitle>
            <DialogDescription>Enter details for the new worker.</DialogDescription>
          </DialogHeader>
          <form onSubmit={e => {
            e.preventDefault();
            setWorkersList(prev => [
              ...prev,
              {
                id: (prev.length + 1).toString(),
                name: newWorkerName,
                skills: newWorkerSkills.split(',').map(s => s.trim()),
                rating: parseFloat(newWorkerRating),
                status: 'available',
                phone: newWorkerPhone,
                location: newWorkerLocation
              }
            ]);
            setAddWorkerOpen(false);
            setNewWorkerName("");
            setNewWorkerSkills("");
            setNewWorkerPhone("");
            setNewWorkerLocation("");
            setNewWorkerRating("");
            toast({ title: 'Worker Added', description: 'New worker has been added.' });
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input value={newWorkerName} onChange={e => setNewWorkerName(e.target.value)} required className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
              <input value={newWorkerSkills} onChange={e => setNewWorkerSkills(e.target.value)} required className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input value={newWorkerPhone} onChange={e => setNewWorkerPhone(e.target.value)} required className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input value={newWorkerLocation} onChange={e => setNewWorkerLocation(e.target.value)} required className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <input type="number" value={newWorkerRating} onChange={e => setNewWorkerRating(e.target.value)} required min="0" max="5" step="0.1" className="w-full border rounded-md p-2" />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Add</Button>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceManagement;
