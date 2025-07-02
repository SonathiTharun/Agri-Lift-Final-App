import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FileText, 
  Users, 
  DollarSign, 
  Settings, 
  Download,
  Upload,
  Bell,
  Shield,
  BarChart3,
  MessageSquare,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  User
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  action: () => void;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  urgent?: boolean;
}

interface QuickActionsProps {
  className?: string;
  onAssignTask?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ className = "", onAssignTask }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleAction = async (actionId: string, actionFn: () => void) => {
    setIsLoading(actionId);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      actionFn();
    } finally {
      setIsLoading(null);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'approve-loans',
      title: 'Approve Pending Loans',
      description: 'Review and approve loan applications',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      badge: { text: '12 Pending', variant: 'destructive' },
      urgent: true,
      action: () => {
        navigate('/executive/financial');
        toast({
          title: "Navigating to Financial Management",
          description: "Review pending loan applications.",
        });
      }
    },
    {
      id: 'add-farmer',
      title: 'Add New Farmer',
      description: 'Register a new farmer to the platform',
      icon: Plus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: () => {
        navigate('/executive/farmers');
        toast({
          title: "Navigating to Farmer Management",
          description: "Add a new farmer to the platform.",
        });
      }
    },
    {
      id: 'generate-report',
      title: 'Generate Monthly Report',
      description: 'Create comprehensive monthly analytics report',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      action: () => {
        toast({
          title: "Generating Report",
          description: "Monthly report generation started. You'll be notified when ready.",
        });
      }
    },
    {
      id: 'system-health',
      title: 'System Health Check',
      description: 'Run comprehensive system diagnostics',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      badge: { text: 'Recommended', variant: 'secondary' },
      action: () => {
        toast({
          title: "System Health Check",
          description: "Running system diagnostics...",
        });
      }
    },
    {
      id: 'broadcast-message',
      title: 'Send Broadcast',
      description: 'Send message to all farmers',
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      action: () => {
        navigate('/executive/communications');
        toast({
          title: "Navigating to Communications",
          description: "Create and send broadcast message.",
        });
      }
    },
    {
      id: 'export-data',
      title: 'Export Platform Data',
      description: 'Download comprehensive data export',
      icon: Download,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      action: () => {
        toast({
          title: "Data Export",
          description: "Preparing data export. Download will start shortly.",
        });
      }
    },
    {
      id: 'manage-inventory',
      title: 'Update Inventory',
      description: 'Manage marketplace inventory levels',
      icon: Upload,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 hover:bg-teal-100',
      badge: { text: '8 Low Stock', variant: 'destructive' },
      urgent: true,
      action: () => {
        navigate('/executive/operations');
        toast({
          title: "Navigating to Operations",
          description: "Manage marketplace inventory.",
        });
      }
    },
    {
      id: 'analytics-dashboard',
      title: 'View Analytics',
      description: 'Access detailed platform analytics',
      icon: BarChart3,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100',
      action: () => {
        navigate('/executive/analytics');
        toast({
          title: "Navigating to Analytics",
          description: "View comprehensive platform analytics.",
        });
      }
    },
    {
      id: 'emergency-alert',
      title: 'Emergency Alert',
      description: 'Send critical system-wide alert',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      action: () => {
        toast({
          title: "Emergency Alert System",
          description: "Emergency alert interface opened.",
          variant: "destructive"
        });
      }
    },
    {
      id: 'assign-task',
      title: 'Assign Task',
      description: 'Assign a task to a team member',
      icon: User,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 hover:bg-cyan-100',
      action: () => {
        if (onAssignTask) onAssignTask();
        toast({
          title: "Assign Task",
          description: "Open the assign task modal.",
        });
      }
    }
  ];

  // Separate urgent and regular actions
  const urgentActions = quickActions.filter(action => action.urgent);
  const regularActions = quickActions.filter(action => !action.urgent);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Urgent Actions */}
      {urgentActions.length > 0 && (
        <Card className="agrilift-card border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Urgent Actions Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {urgentActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`h-auto p-4 justify-start ${action.bgColor} border-red-200 hover:border-red-300 transition-all duration-200`}
                  onClick={() => handleAction(action.id, action.action)}
                  disabled={isLoading === action.id}
                >
                  <div className="flex items-start gap-3 w-full">
                    <action.icon className={`h-5 w-5 ${action.color} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{action.title}</span>
                        {action.badge && (
                          <Badge variant={action.badge.variant} className="text-xs">
                            {action.badge.text}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    {isLoading === action.id && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regular Quick Actions */}
      <Card className="agrilift-card">
        <CardHeader className="agrilift-card-header pb-3">
          <CardTitle className="text-lg font-semibold agrilift-text-primary flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className={`h-auto p-4 justify-start ${action.bgColor} agrilift-border hover:shadow-md transition-all duration-200`}
                onClick={() => handleAction(action.id, action.action)}
                disabled={isLoading === action.id}
              >
                <div className="flex items-start gap-3 w-full">
                  <action.icon className={`h-5 w-5 ${action.color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium agrilift-text-primary">{action.title}</span>
                      {action.badge && (
                        <Badge variant={action.badge.variant} className="text-xs">
                          {action.badge.text}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm agrilift-text-secondary">{action.description}</p>
                  </div>
                  {isLoading === action.id && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Actions Summary */}
      <Card className="agrilift-card">
        <CardHeader className="agrilift-card-header pb-3">
          <CardTitle className="text-lg font-semibold agrilift-text-primary flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Recent Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Approved 5 loan applications</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
              <FileText className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Generated weekly analytics report</p>
                <p className="text-xs text-gray-600">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
              <Users className="h-4 w-4 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Added 12 new farmers to platform</p>
                <p className="text-xs text-gray-600">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
