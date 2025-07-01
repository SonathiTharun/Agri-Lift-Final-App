import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText, 
  BarChart3, 
  Users, 
  DollarSign,
  Calendar,
  Filter,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ExportJob {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'csv' | 'json';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  size?: string;
  downloadUrl?: string;
}

interface ExportManagerProps {
  className?: string;
}

export const ExportManager: React.FC<ExportManagerProps> = ({ className = "" }) => {
  const { toast } = useToast();
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: '1',
      name: 'Monthly Financial Report',
      type: 'pdf',
      status: 'completed',
      progress: 100,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      size: '2.4 MB',
      downloadUrl: '#'
    },
    {
      id: '2',
      name: 'User Analytics Data',
      type: 'excel',
      status: 'processing',
      progress: 65,
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Farmer Database Export',
      type: 'csv',
      status: 'pending',
      progress: 0,
      createdAt: new Date(Date.now() - 10 * 60 * 1000)
    }
  ]);

  const [selectedDateRange, setSelectedDateRange] = useState('month');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const reportTypes = [
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue, expenses, profit analysis',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'user-analytics',
      name: 'User Analytics',
      description: 'User engagement and behavior data',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'platform-performance',
      name: 'Platform Performance',
      description: 'System metrics and performance data',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'farmer-database',
      name: 'Farmer Database',
      description: 'Complete farmer information export',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const handleExportRequest = (reportType: string) => {
    const newJob: ExportJob = {
      id: Date.now().toString(),
      name: reportTypes.find(r => r.id === reportType)?.name || 'Custom Report',
      type: selectedFormat as any,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    setExportJobs(prev => [newJob, ...prev]);

    // Simulate processing
    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, status: 'processing', progress: 25 } : job
      ));
    }, 1000);

    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, progress: 75 } : job
      ));
    }, 3000);

    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id ? { 
          ...job, 
          status: 'completed', 
          progress: 100,
          size: '1.8 MB',
          downloadUrl: '#'
        } : job
      ));
    }, 5000);

    toast({
      title: "Export Started",
      description: `${newJob.name} export has been queued for processing.`,
    });
  };

  const handleDownload = (job: ExportJob) => {
    toast({
      title: "Download Started",
      description: `Downloading ${job.name}...`,
    });
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="agrilift-card">
        <CardHeader className="agrilift-card-header">
          <CardTitle className="text-lg font-semibold agrilift-text-primary flex items-center gap-2">
            <Download className="h-5 w-5 text-green-600" />
            Export & Reports Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="new-export" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new-export">New Export</TabsTrigger>
              <TabsTrigger value="export-history">Export History</TabsTrigger>
            </TabsList>

            <TabsContent value="new-export" className="space-y-6">
              {/* Export Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-2">Date Range</label>
                  <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md agrilift-input"
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Export Format</label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md agrilift-input"
                  >
                    <option value="pdf">PDF Report</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV Data</option>
                    <option value="json">JSON Data</option>
                  </select>
                </div>
              </div>

              {/* Report Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => (
                  <Card key={report.id} className={`agrilift-card hover:shadow-md transition-all duration-200 ${report.bgColor}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <report.icon className={`h-6 w-6 ${report.color} mt-1`} />
                        <div className="flex-1">
                          <h3 className="font-semibold agrilift-text-primary">{report.name}</h3>
                          <p className="text-sm agrilift-text-secondary mb-3">{report.description}</p>
                          <Button
                            size="sm"
                            onClick={() => handleExportRequest(report.id)}
                            className="w-full"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export {selectedFormat.toUpperCase()}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="export-history" className="space-y-4">
              {exportJobs.length === 0 ? (
                <div className="text-center py-8 agrilift-text-muted">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No export history found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exportJobs.map((job) => (
                    <Card key={job.id} className="agrilift-card">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {getStatusIcon(job.status)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium agrilift-text-primary">{job.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {job.type.toUpperCase()}
                                </Badge>
                                {getStatusBadge(job.status)}
                              </div>
                              <div className="flex items-center gap-4 text-sm agrilift-text-muted">
                                <span>{formatTimestamp(job.createdAt)}</span>
                                {job.size && <span>{job.size}</span>}
                              </div>
                              {job.status === 'processing' && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Processing...</span>
                                    <span>{job.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${job.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {job.status === 'completed' && job.downloadUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(job)}
                              className="ml-4"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportManager;
