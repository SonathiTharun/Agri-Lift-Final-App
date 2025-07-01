import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock, 
  X,
  Filter,
  MoreHorizontal,
  TrendingDown,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  category: 'system' | 'financial' | 'user' | 'market' | 'security';
  priority: 'high' | 'medium' | 'low';
  data?: any;
}

interface NotificationCenterProps {
  className?: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'critical':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Info className="h-4 w-4 text-blue-600" />;
  }
};

const getNotificationBadgeVariant = (type: string) => {
  switch (type) {
    case 'critical':
      return 'destructive';
    case 'warning':
      return 'secondary';
    case 'success':
      return 'default';
    default:
      return 'outline';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'financial':
      return <DollarSign className="h-3 w-3" />;
    case 'user':
      return <Users className="h-3 w-3" />;
    case 'market':
      return <Activity className="h-3 w-3" />;
    case 'security':
      return <AlertTriangle className="h-3 w-3" />;
    default:
      return <Info className="h-3 w-3" />;
  }
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = "" }) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'critical',
      title: 'System Performance Alert',
      message: 'Server response time has increased by 40% in the last hour. Immediate attention required.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      actionRequired: true,
      category: 'system',
      priority: 'high'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Fertilizer inventory is running low in Punjab region. Only 15 units remaining.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionRequired: true,
      category: 'market',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'info',
      title: 'New Farmer Registration',
      message: '25 new farmers registered in the last 24 hours. Total active farmers: 1,247.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      actionRequired: false,
      category: 'user',
      priority: 'low'
    },
    {
      id: '4',
      type: 'success',
      title: 'Revenue Milestone',
      message: 'Monthly revenue target achieved! Current: ₹24.5L (Target: ₹22L)',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      actionRequired: false,
      category: 'financial',
      priority: 'medium'
    },
    {
      id: '5',
      type: 'warning',
      title: 'Loan Default Risk',
      message: '3 loan applications showing high default risk indicators. Review required.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: true,
      actionRequired: true,
      category: 'financial',
      priority: 'high'
    }
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread' && notification.read) return false;
    if (activeTab === 'critical' && notification.type !== 'critical') return false;
    if (filter !== 'all' && notification.category !== filter) return false;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "Your notification center has been updated.",
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed.",
    });
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Card className={`agrilift-card ${className}`}>
      <CardHeader className="agrilift-card-header pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold agrilift-text-primary flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-600" />
            Notification Center
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-2 py-1 text-sm border rounded agrilift-input"
            >
              <option value="all">All Categories</option>
              <option value="system">System</option>
              <option value="financial">Financial</option>
              <option value="user">User</option>
              <option value="market">Market</option>
              <option value="security">Security</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All
              <Badge variant="outline" className="text-xs">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="critical" className="flex items-center gap-2">
              Critical
              {criticalCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {criticalCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-0">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 agrilift-text-muted">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications found</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        notification.read 
                          ? 'agrilift-border bg-gray-50' 
                          : 'border-green-200 bg-green-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium agrilift-text-primary truncate">
                                {notification.title}
                              </h4>
                              <Badge 
                                variant={getNotificationBadgeVariant(notification.type)}
                                className="text-xs"
                              >
                                {notification.type}
                              </Badge>
                              {notification.actionRequired && (
                                <Badge variant="outline" className="text-xs">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm agrilift-text-secondary mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs agrilift-text-muted">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <span className="flex items-center gap-1">
                                {getCategoryIcon(notification.category)}
                                {notification.category}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {notification.priority} priority
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dismissNotification(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
