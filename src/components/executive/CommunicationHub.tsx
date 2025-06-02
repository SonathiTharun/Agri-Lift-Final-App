
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Bell, 
  MessageSquare, 
  Mail, 
  Phone,
  Users,
  Filter,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'alert' | 'update';
  recipients: 'all' | 'farmers' | 'executives';
  status: 'draft' | 'sent' | 'scheduled';
  sentDate?: string;
  scheduledDate?: string;
}

interface SupportTicket {
  id: string;
  farmerName: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdDate: string;
  lastUpdated: string;
}

const CommunicationHub = () => {
  const { toast } = useToast();
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'announcement' as const,
    recipients: 'all' as const
  });

  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Monsoon Season Alert",
      message: "Heavy rainfall expected in northern regions. Plan accordingly for crop protection.",
      type: "alert",
      recipients: "farmers",
      status: "sent",
      sentDate: "2024-05-20"
    },
    {
      id: "2",
      title: "New Market Features Available",
      message: "Enhanced marketplace with improved search and filtering options now live.",
      type: "update",
      recipients: "all",
      status: "sent",
      sentDate: "2024-05-18"
    },
    {
      id: "3",
      title: "Seasonal Farming Tips",
      message: "Best practices for Kharif season planting and crop management.",
      type: "announcement",
      recipients: "farmers",
      status: "draft"
    }
  ]);

  const [supportTickets] = useState<SupportTicket[]>([
    {
      id: "1",
      farmerName: "Rajesh Kumar",
      subject: "Unable to access loan application",
      message: "I'm getting an error when trying to submit my loan application. Please help.",
      status: "open",
      priority: "high",
      createdDate: "2024-05-20",
      lastUpdated: "2024-05-20"
    },
    {
      id: "2",
      farmerName: "Priya Sharma",
      subject: "Machinery booking confirmation",
      message: "Need confirmation for tractor booking scheduled for next week.",
      status: "in_progress",
      priority: "medium",
      createdDate: "2024-05-19",
      lastUpdated: "2024-05-20"
    }
  ]);

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Notification Sent",
      description: `Notification "${newNotification.title}" has been sent to ${newNotification.recipients}.`,
    });

    setNewNotification({
      title: '',
      message: '',
      type: 'announcement',
      recipients: 'all'
    });
  };

  const handleTicketAction = (ticketId: string, action: string) => {
    toast({
      title: `Ticket ${action}`,
      description: `Support ticket ${ticketId} has been ${action}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      draft: "secondary",
      sent: "default",
      scheduled: "default",
      open: "destructive",
      in_progress: "secondary",
      resolved: "default",
      closed: "default"
    };
    
    return <Badge variant={variants[status]}>{status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      low: "secondary",
      medium: "default",
      high: "destructive",
      urgent: "destructive"
    };
    
    return <Badge variant={variants[priority]}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Communication Hub</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Communication Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">12 scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">8 urgent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Average engagement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="support">Support Tickets</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast Message</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{notification.title}</h4>
                          {getStatusBadge(notification.status)}
                          <Badge variant="outline" className="capitalize">{notification.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500">Recipients: {notification.recipients}</p>
                        {notification.sentDate && (
                          <p className="text-xs text-gray-500">Sent: {new Date(notification.sentDate).toLocaleDateString()}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {notification.status === 'draft' && (
                          <Button size="sm">
                            <Send className="h-3 w-3 mr-1" />
                            Send
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Ticket Management</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">#{ticket.id} - {ticket.subject}</h4>
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <p className="text-sm text-gray-600">From: {ticket.farmerName}</p>
                        <p className="text-sm text-gray-600">{ticket.message}</p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(ticket.createdDate).toLocaleDateString()} | 
                          Updated: {new Date(ticket.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => handleTicketAction(ticket.id, 'respond')}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Respond
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleTicketAction(ticket.id, 'resolve')}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter notification title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Enter your message here..."
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({...newNotification, type: e.target.value as any})}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="announcement">Announcement</option>
                      <option value="alert">Alert</option>
                      <option value="update">Update</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Recipients</label>
                    <select
                      value={newNotification.recipients}
                      onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value as any})}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="all">All Users</option>
                      <option value="farmers">Farmers Only</option>
                      <option value="executives">Executives Only</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSendNotification}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </Button>
                  <Button variant="outline">
                    Schedule Later
                  </Button>
                  <Button variant="outline">
                    Save Draft
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Campaign management features will be implemented here for targeted marketing and engagement campaigns.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationHub;
