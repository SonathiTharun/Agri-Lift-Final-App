import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/components/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import {
  Droplet, Thermometer, Leaf, Wind, Signal, Gauge, Cloud, Flower,
  Crop, Fuel, AlertTriangle, Bell, Eye, ArrowUpRight, Battery, Satellite,
  Zap, Wifi, Activity, TrendingUp, TrendingDown, RefreshCw, Settings,
  MapPin, Calendar, Clock, Users, Truck, Sprout, Shield, Target
} from "lucide-react";

const soilMoistureData = [
  { time: '00:00', moisture: 42 },
  { time: '04:00', moisture: 40 },
  { time: '08:00', moisture: 45 },
  { time: '12:00', moisture: 48 },
  { time: '16:00', moisture: 49 },
  { time: '20:00', moisture: 47 },
  { time: '23:59', moisture: 44 }
];

const temperatureData = [
  { time: '00:00', temp: 18 },
  { time: '04:00', temp: 16 },
  { time: '08:00', temp: 22 },
  { time: '12:00', temp: 28 },
  { time: '16:00', temp: 30 },
  { time: '20:00', temp: 25 },
  { time: '23:59', temp: 22 }
];

const rainfallData = [
  { month: 'Jan', amount: 65 },
  { month: 'Feb', amount: 59 },
  { month: 'Mar', amount: 80 },
  { month: 'Apr', amount: 81 },
  { month: 'May', amount: 56 },
  { month: 'Jun', amount: 55 },
  { month: 'Jul', amount: 40 }
];

const fieldData = [
  { 
    id: 1, 
    name: 'North Field', 
    crop: 'Wheat', 
    health: 92, 
    area: '4.2 hectares', 
    plantDate: '2024-03-15', 
    harvestDate: '2024-07-20',
    soilMoisture: 42,
    temperature: 26,
    alerts: []
  },
  { 
    id: 2, 
    name: 'East Field', 
    crop: 'Corn', 
    health: 78, 
    area: '6.8 hectares', 
    plantDate: '2024-04-10', 
    harvestDate: '2024-08-15',
    soilMoisture: 39,
    temperature: 25,
    alerts: [{ type: 'moisture', message: 'Low soil moisture detected', severity: 'warning' }]
  },
  { 
    id: 3, 
    name: 'South Field', 
    crop: 'Soybeans', 
    health: 85, 
    area: '5.5 hectares', 
    plantDate: '2024-04-05', 
    harvestDate: '2024-09-10',
    soilMoisture: 44,
    temperature: 24,
    alerts: []
  },
  { 
    id: 4, 
    name: 'West Field', 
    crop: 'Rice', 
    health: 65, 
    area: '3.2 hectares', 
    plantDate: '2024-05-01', 
    harvestDate: '2024-10-01',
    soilMoisture: 68,
    temperature: 29,
    alerts: [
      { type: 'pest', message: 'Possible pest infestation detected', severity: 'critical' },
      { type: 'moisture', message: 'High moisture level', severity: 'info' }
    ]
  }
];

const machinesData = [
  {
    id: 'TRA-101',
    name: 'John Deere 8R Tractor',
    status: 'active',
    location: 'North Field',
    fuel: 78,
    health: 92,
    nextMaintenance: '2024-06-15'
  },
  {
    id: 'HAR-201',
    name: 'Case IH Harvester',
    status: 'maintenance',
    location: 'Equipment Shed',
    fuel: 45,
    health: 68,
    nextMaintenance: '2024-05-10'
  },
  {
    id: 'SPR-301',
    name: 'Sprayer Drone',
    status: 'charging',
    location: 'Control Room',
    fuel: 95,
    health: 88,
    nextMaintenance: '2024-07-22'
  }
];

const alertsData = [
  { id: 1, type: 'moisture', message: 'Low soil moisture detected in East Field', severity: 'warning', time: '2 hours ago' },
  { id: 2, type: 'temperature', message: 'Greenhouse temperature above threshold', severity: 'critical', time: '30 minutes ago' },
  { id: 3, type: 'machinery', message: 'Harvester maintenance due in 5 days', severity: 'info', time: '1 day ago' },
  { id: 4, type: 'pest', message: 'Possible pest detection in West Field', severity: 'critical', time: '1 hour ago' },
  { id: 5, type: 'weather', message: 'Heavy rain forecast for tomorrow', severity: 'warning', time: '3 hours ago' }
];

const getSeverityColor = (severity: string) => {
  switch(severity) {
    case 'critical': return 'bg-red-500 hover:bg-red-600';
    case 'warning': return 'bg-yellow-500 hover:bg-yellow-600';
    case 'info': return 'bg-blue-500 hover:bg-blue-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

const getSeverityIcon = (severity: string) => {
  switch(severity) {
    case 'critical': return <AlertTriangle className="h-4 w-4" />;
    case 'warning': return <AlertTriangle className="h-4 w-4" />;
    case 'info': return <Eye className="h-4 w-4" />;
    default: return <Bell className="h-4 w-4" />;
  }
};

const Monitoring = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedField, setSelectedField] = useState(fieldData[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realTimeData, setRealTimeData] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (realTimeData) {
      const interval = setInterval(() => {
        setAnimationKey(prev => prev + 1);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [realTimeData]);

  const handleAlertAction = (alertId: number) => {
    toast({
      title: t('alert-acknowledged') || "Alert acknowledged",
      description: t('alert-addressed') || "The alert has been marked as addressed.",
    });
  };

  const handleSensorCalibration = (sensorType: string) => {
    toast({
      title: t('calibration-initiated') || "Calibration initiated",
      description: t('sensor-calibration-scheduled') || `${sensorType} sensor calibration has been scheduled.`,
    });
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnimationKey(prev => prev + 1);
    setIsRefreshing(false);
    toast({
      title: t('data-refreshed') || "Data Refreshed",
      description: t('latest-data-loaded') || "Latest monitoring data has been loaded.",
    });
  };

  const toggleRealTimeData = () => {
    setRealTimeData(!realTimeData);
    toast({
      title: realTimeData ? t('real-time-disabled') || "Real-time Updates Disabled" : t('real-time-enabled') || "Real-time Updates Enabled",
      description: realTimeData ? t('manual-refresh-only') || "Data will only update when manually refreshed." : t('auto-refresh-enabled') || "Data will automatically refresh every 30 seconds.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foliage-dark hover:text-foliage transition-colors duration-300">
              {t('farm-monitoring') || 'Farm Monitoring Dashboard'}
            </h1>
            <p className="text-gray-600">{t('monitoring-page-desc') || 'Real-time monitoring and analytics for your farm operations'}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${realTimeData ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span>{realTimeData ? t('live-data') || 'Live Data' : t('manual-mode') || 'Manual Mode'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{t('last-updated') || 'Last updated'}: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={toggleRealTimeData}
              className="flex gap-2 items-center hover:scale-105 transition-all duration-200 hover:shadow-md"
            >
              <Activity size={16} className={realTimeData ? "animate-pulse text-green-600" : "text-gray-400"} />
              <span className="hidden sm:inline">{realTimeData ? t('live') || 'Live' : t('manual') || 'Manual'}</span>
            </Button>
            <Button
              variant="outline"
              className="flex gap-2 items-center hover:scale-105 transition-all duration-200 hover:shadow-md relative"
            >
              <Bell size={16} className="animate-bounce" />
              <span className="bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs animate-pulse">
                {alertsData.filter(a => a.severity === 'critical').length}
              </span>
              <span className="hidden sm:inline">{t('alerts') || 'Alerts'}</span>
            </Button>
            <Button
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="bg-foliage hover:bg-foliage-dark transition-all duration-300 hover:scale-105 transform hover:shadow-lg flex gap-2 items-center"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{isRefreshing ? t('refreshing') || 'Refreshing...' : t('refresh-data') || 'Refresh Data'}</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-8 animate-fade-in bg-white/80 backdrop-blur-sm border shadow-lg">
            {[
              { key: "overview", icon: <Activity size={16} />, label: t('overview') || 'Overview' },
              { key: "soil", icon: <Leaf size={16} />, label: t('soil') || 'Soil' },
              { key: "weather", icon: <Cloud size={16} />, label: t('weather') || 'Weather' },
              { key: "crops", icon: <Sprout size={16} />, label: t('crops') || 'Crops' },
              { key: "irrigation", icon: <Droplet size={16} />, label: t('irrigation-tab') || 'Irrigation' },
              { key: "machinery", icon: <Truck size={16} />, label: t('machinery-tab') || 'Machinery' },
              { key: "livestock", icon: <Users size={16} />, label: t('livestock') || 'Livestock' }
            ].map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="hover:scale-105 transition-all duration-200 flex items-center gap-2 data-[state=active]:bg-foliage data-[state=active]:text-white"
              >
                <span className="hidden sm:inline">{tab.icon}</span>
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 animate-fade-in" key={`overview-${animationKey}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: t('field-health') || "Field Health",
                  description: t('average-crop-health') || "Average crop health across all fields",
                  icon: <Leaf className="h-6 w-6 text-green-600" />,
                  content: (
                    <>
                      <div className="text-4xl font-bold text-foliage-dark transition-all hover:scale-105 animate-pulse-soft">
                        {Math.round(fieldData.reduce((sum, field) => sum + field.health, 0) / fieldData.length)}%
                      </div>
                      <Progress
                        value={Math.round(fieldData.reduce((sum, field) => sum + field.health, 0) / fieldData.length)}
                        className="h-3 mt-2 transition-all duration-500"
                      />
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <TrendingUp size={14} className="text-green-500" />
                        <span>{t('improving') || 'Improving'} +2.3%</span>
                      </div>
                    </>
                  )
                },
                {
                  title: t('active-alerts') || "Active Alerts",
                  description: t('issues-requiring-attention') || "Issues requiring attention",
                  icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
                  content: (
                    <>
                      <div className="text-4xl font-bold text-amber-500 transition-all hover:scale-105 animate-bounce-gentle">
                        {alertsData.length}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['critical', 'warning', 'info'].map((severity) => (
                          <Badge
                            key={severity}
                            className={`${getSeverityColor(severity)} transform hover:scale-110 transition-all duration-200 cursor-pointer flex items-center gap-1`}
                          >
                            {getSeverityIcon(severity)}
                            <span>{alertsData.filter(a => a.severity === severity).length}</span>
                            <span className="hidden sm:inline">{t(severity) || severity.charAt(0).toUpperCase() + severity.slice(1)}</span>
                          </Badge>
                        ))}
                      </div>
                    </>
                  )
                },
                {
                  title: t('weather-forecast') || "Weather Forecast",
                  description: t('todays-conditions') || "Today's conditions",
                  icon: <Cloud className="h-6 w-6 text-blue-600" />,
                  content: (
                    <div className="flex justify-between items-center">
                      <div className="transition-all hover:scale-105">
                        <div className="text-4xl font-bold animate-glow">26°C</div>
                        <div className="text-gray-600">{t('partly-cloudy') || 'Partly Cloudy'}</div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center justify-end gap-1 text-blue-500 transition-all hover:scale-105">
                          <Droplet size={16} className="animate-bounce" />
                          <span className="text-sm">20% {t('rain-chance') || 'Rain'}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-gray-600 transition-all hover:scale-105">
                          <Wind size={16} className="animate-pulse" />
                          <span className="text-sm">8 km/h NE</span>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-gray-600">
                          <Thermometer size={16} />
                          <span className="text-sm">{t('feels-like') || 'Feels'} 28°C</span>
                        </div>
                      </div>
                    </div>
                  )
                }
              ].map((item, index) => (
                <Card key={index} className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100/80">
                        {item.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                        <CardDescription className="text-sm">{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {item.content}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-red-50/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <Bell className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{t('recent-alerts') || 'Recent Alerts'}</CardTitle>
                      <CardDescription>{t('issues-requiring-attention') || 'Issues requiring your attention'}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alertsData.slice(0, 3).map((alert, index) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border hover:shadow-md transition-all duration-200 animate-slide-in-left"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`rounded-full p-2 ${getSeverityColor(alert.severity)} animate-pulse-soft`}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{t(`alert-${alert.type}`) || alert.message}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {alert.time}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAlertAction(alert.id)}
                          className="hover:scale-105 transition-transform text-xs"
                        >
                          {t('acknowledge') || 'Acknowledge'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full hover:bg-red-50 transition-colors"
                    onClick={() => setActiveTab('alerts')}
                  >
                    {t('view-all-alerts') || 'View All Alerts'} ({alertsData.length})
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-blue-50/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Droplet className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{t('soil-moisture-trends') || 'Soil Moisture Trends'}</CardTitle>
                      <CardDescription>{t('average-across-fields') || 'Average across all fields'}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>{t('current') || 'Current'}: 42%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp size={14} className="text-green-500" />
                      <span className="text-green-600">+5% {t('from-yesterday') || 'from yesterday'}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={soilMoistureData} key={animationKey}>
                      <defs>
                        <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        label={{ value: t('moisture-percentage') || 'Moisture %', angle: -90, position: 'insideLeft' }}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        labelFormatter={(value) => `${t('time') || 'Time'}: ${value}`}
                        formatter={(value) => [`${value}%`, t('moisture') || 'Moisture']}
                      />
                      <Area
                        type="monotone"
                        dataKey="moisture"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#moistureGradient)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-green-50/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t('field-status') || 'Field Status'}</CardTitle>
                    <CardDescription>{t('current-field-conditions') || 'Current condition of your fields'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {fieldData.map((field, index) => (
                    <div
                      key={field.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 animate-slide-in-left ${
                        selectedField.id === field.id
                          ? 'border-foliage bg-foliage/10 shadow-lg ring-2 ring-foliage/20'
                          : 'hover:border-gray-300 hover:shadow-md bg-white/80 backdrop-blur-sm'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setSelectedField(field)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-lg flex items-center gap-2">
                            <Crop size={16} className="text-green-600" />
                            {field.name}
                          </h3>
                          <p className="text-gray-500 text-sm">{field.crop}</p>
                        </div>
                        {field.alerts.length > 0 && (
                          <Badge className="bg-amber-500 animate-pulse">
                            {field.alerts.length} {field.alerts.length === 1 ? t('alert') || 'Alert' : t('alerts') || 'Alerts'}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Leaf size={12} className="text-green-600" />
                            {t('crop-health') || 'Crop Health'}
                          </span>
                          <span className={`font-medium ${field.health > 80 ? 'text-green-600' : field.health > 60 ? 'text-amber-600' : 'text-red-600'}`}>
                            {field.health}%
                          </span>
                        </div>
                        <Progress
                          value={field.health}
                          className="h-2 transition-all duration-500"
                          style={{
                            backgroundColor: '#f3f4f6',
                            '--tw-progress-bar-background-color': field.health > 80 ? '#059669' : field.health > 60 ? '#d97706' : '#dc2626'
                          } as React.CSSProperties}
                        />

                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                            <Droplet size={14} className="text-blue-600" />
                            <span>{field.soilMoisture}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600 bg-orange-50 p-2 rounded">
                            <Thermometer size={14} className="text-orange-600" />
                            <span>{field.temperature}°C</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{t('harvest-in') || 'Harvest in'}: {Math.ceil((new Date(field.harvestDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} {t('days') || 'days'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedField && (
                  <div className="mt-8 border-t pt-6 animate-fade-in">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-semibold">{selectedField.name} Details</h3>
                        <p className="text-gray-600">{selectedField.crop} - {selectedField.area}</p>
                      </div>
                      <div>
                        <Button size="sm">View Complete Analysis</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Crop Information</h4>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <span className="text-gray-500">Plant Date</span>
                          <span>{selectedField.plantDate}</span>
                          <span className="text-gray-500">Harvest Date</span>
                          <span>{selectedField.harvestDate}</span>
                          <span className="text-gray-500">Days to Harvest</span>
                          <span>
                            {Math.ceil((new Date(selectedField.harvestDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Soil Conditions</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Moisture</span>
                            <span>{selectedField.soilMoisture}%</span>
                          </div>
                          <Progress value={selectedField.soilMoisture} className="h-1.5" />
                          
                          <div className="flex justify-between text-sm mt-3">
                            <span className="text-gray-500">pH Level</span>
                            <span>6.8</span>
                          </div>
                          <Progress value={68} className="h-1.5" />
                          
                          <div className="flex justify-between text-sm mt-3">
                            <span className="text-gray-500">Nitrogen</span>
                            <span>Medium</span>
                          </div>
                          <Progress value={55} className="h-1.5" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Active Alerts</h4>
                        {selectedField.alerts.length > 0 ? (
                          <div className="space-y-2">
                            {selectedField.alerts.map((alert, index) => (
                              <div key={index} className={`text-sm p-2 rounded-md ${
                                alert.severity === 'critical' ? 'bg-red-50 text-red-800' : 
                                alert.severity === 'warning' ? 'bg-amber-50 text-amber-800' : 
                                'bg-blue-50 text-blue-800'
                              }`}>
                                {alert.message}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">No active alerts</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="soil">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Soil Health Dashboard</CardTitle>
                    <CardDescription>Real-time soil data from your fields</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Droplet className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Average Soil Moisture</p>
                          <p className="text-2xl font-semibold">42%</p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-amber-100 p-3 rounded-lg">
                          <Leaf className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Soil pH Level</p>
                          <p className="text-2xl font-semibold">6.8</p>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Thermometer className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Soil Temperature</p>
                          <p className="text-2xl font-semibold">19°C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={soilMoistureData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Soil Nutrient Levels</CardTitle>
                    <CardDescription>Nutrient composition across fields</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Nitrogen (N)</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>North Field</span>
                              <span>65%</span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>East Field</span>
                              <span>42%</span>
                            </div>
                            <Progress value={42} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>West Field</span>
                              <span>78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Phosphorus (P)</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>North Field</span>
                              <span>56%</span>
                            </div>
                            <Progress value={56} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>East Field</span>
                              <span>49%</span>
                            </div>
                            <Progress value={49} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>West Field</span>
                              <span>62%</span>
                            </div>
                            <Progress value={62} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Potassium (K)</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>North Field</span>
                              <span>72%</span>
                            </div>
                            <Progress value={72} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>East Field</span>
                              <span>68%</span>
                            </div>
                            <Progress value={68} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>West Field</span>
                              <span>51%</span>
                            </div>
                            <Progress value={51} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Soil Sensors Status</CardTitle>
                    <CardDescription>Health and battery status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Gauge className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Moisture Sensor</p>
                            <p className="text-sm text-gray-500">North Field</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-green-600" />
                          <span className="text-sm">92%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Gauge className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">pH Sensor</p>
                            <p className="text-sm text-gray-500">East Field</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm">45%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Gauge className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">EC Sensor</p>
                            <p className="text-sm text-gray-500">West Field</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-green-600" />
                          <span className="text-sm">88%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded-full">
                            <Gauge className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">Temperature Sensor</p>
                            <p className="text-sm text-gray-500">South Field</p>
                          </div>
                        </div>
                        <div>
                          <Badge variant="destructive">Offline</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleSensorCalibration('soil')}>
                      Calibrate Sensors
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                    <CardDescription>Based on soil analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
                          <div className="bg-blue-200 p-1 rounded-full">
                            <Droplet className="h-3 w-3 text-blue-700" />
                          </div>
                          Irrigation
                        </div>
                        <p className="text-sm text-blue-800">Consider increasing irrigation by 15% in East Field due to low soil moisture readings.</p>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                          <div className="bg-green-200 p-1 rounded-full">
                            <Leaf className="h-3 w-3 text-green-700" />
                          </div>
                          Fertilizer
                        </div>
                        <p className="text-sm text-green-800">Apply nitrogen-rich fertilizer to West Field in the next 7 days to optimize nutrient levels.</p>
                      </div>
                      
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-800 font-medium mb-1">
                          <div className="bg-amber-200 p-1 rounded-full">
                            <Gauge className="h-3 w-3 text-amber-700" />
                          </div>
                          Maintenance
                        </div>
                        <p className="text-sm text-amber-800">South Field temperature sensor requires maintenance or replacement.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="weather">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Current Weather Conditions</CardTitle>
                    <CardDescription>Real-time weather data for your farm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-center gap-6">
                        <div className="text-6xl font-light">26°C</div>
                        <div>
                          <div className="text-lg font-medium">Partly Cloudy</div>
                          <div className="text-gray-600">Feels like 28°C</div>
                          <div className="text-gray-600">Updated: 1:30 PM</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-lg">
                          <Droplet className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-gray-600">Humidity</span>
                          <span className="font-medium">65%</span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-lg">
                          <Wind className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-gray-600">Wind</span>
                          <span className="font-medium">8 km/h NE</span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-lg">
                          <Cloud className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-gray-600">Cloud Cover</span>
                          <span className="font-medium">40%</span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-lg">
                          <Thermometer className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-gray-600">Feels Like</span>
                          <span className="font-medium">28°C</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Temperature forecast for next 7 days</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Weather Alerts</CardTitle>
                    <CardDescription>Upcoming conditions to be aware of</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex gap-2 text-yellow-800 font-medium">
                          <AlertTriangle className="h-5 w-5" />
                          <span>Heavy Rain Alert</span>
                        </div>
                        <p className="text-sm text-yellow-800 mt-1">Expected heavy rainfall tomorrow. Consider adjusting irrigation schedules.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Satellite View</CardTitle>
                    <CardDescription>Cloud cover over your farm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <Satellite className="h-10 w-10 text-gray-400" />
                        <span className="text-sm text-gray-500">Satellite imagery</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Forecast</CardTitle>
                    <CardDescription>7-day prediction</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Today</span>
                        <div className="flex items-center gap-1">
                          <Cloud className="h-4 w-4" />
                          <span>26°C</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tomorrow</span>
                        <div className="flex items-center gap-1">
                          <Droplet className="h-4 w-4" />
                          <span>24°C</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="irrigation" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6 transform hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-blue-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Droplet className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{t('irrigation-dashboard') || 'Irrigation Dashboard'}</CardTitle>
                        <CardDescription>{t('water-management-overview') || 'Water management and irrigation system overview'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3 animate-slide-in-left">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Droplet className="h-6 w-6 text-blue-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t('total-water-usage') || 'Total Water Usage'}</p>
                          <p className="text-2xl font-semibold">2,450L</p>
                          <p className="text-xs text-green-600">-12% {t('from-last-week') || 'from last week'}</p>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 animate-slide-in-left" style={{ animationDelay: '100ms' }}>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Target className="h-6 w-6 text-green-600 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t('irrigation-efficiency') || 'Irrigation Efficiency'}</p>
                          <p className="text-2xl font-semibold">87%</p>
                          <p className="text-xs text-green-600">+3% {t('improvement') || 'improvement'}</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg flex items-center gap-3 animate-slide-in-left" style={{ animationDelay: '200ms' }}>
                        <div className="bg-amber-100 p-3 rounded-lg">
                          <Zap className="h-6 w-6 text-amber-600 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t('active-zones') || 'Active Zones'}</p>
                          <p className="text-2xl font-semibold">6/12</p>
                          <p className="text-xs text-gray-600">{t('zones-running') || 'zones running'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={soilMoistureData} key={`irrigation-${animationKey}`}>
                          <defs>
                            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="time"
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            label={{ value: t('water-flow-rate') || 'Water Flow (L/min)', angle: -90, position: 'insideLeft' }}
                          />
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            labelFormatter={(value) => `${t('time') || 'Time'}: ${value}`}
                            formatter={(value) => [`${value}L/min`, t('water-flow') || 'Water Flow']}
                          />
                          <Area
                            type="monotone"
                            dataKey="moisture"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#waterGradient)"
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="mb-6 transform hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Settings className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{t('irrigation-zones') || 'Irrigation Zones'}</CardTitle>
                        <CardDescription>{t('zone-status-control') || 'Zone status and control'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { zone: 'Zone 1', field: 'North Field', status: 'active', duration: '45 min', flow: '12 L/min' },
                        { zone: 'Zone 2', field: 'East Field', status: 'scheduled', duration: '30 min', flow: '8 L/min' },
                        { zone: 'Zone 3', field: 'South Field', status: 'inactive', duration: '0 min', flow: '0 L/min' },
                        { zone: 'Zone 4', field: 'West Field', status: 'active', duration: '20 min', flow: '15 L/min' }
                      ].map((zone, index) => (
                        <div key={zone.zone} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-slide-in-right" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              zone.status === 'active' ? 'bg-green-500 animate-pulse' :
                              zone.status === 'scheduled' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}></div>
                            <div>
                              <p className="font-medium text-sm">{zone.zone}</p>
                              <p className="text-xs text-gray-500">{zone.field}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{zone.duration}</p>
                            <p className="text-xs text-gray-500">{zone.flow}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                      <Settings size={16} className="mr-2" />
                      {t('manage-irrigation') || 'Manage Irrigation'}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('water-recommendations') || 'Water Recommendations'}</CardTitle>
                    <CardDescription>{t('ai-powered-suggestions') || 'AI-powered irrigation suggestions'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg animate-fade-in">
                        <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
                          <div className="bg-blue-200 p-1 rounded-full">
                            <Droplet className="h-3 w-3 text-blue-700" />
                          </div>
                          {t('optimal-timing') || 'Optimal Timing'}
                        </div>
                        <p className="text-sm text-blue-800">{t('irrigation-timing-suggestion') || 'Best irrigation time: 6:00 AM - 8:00 AM for maximum efficiency.'}</p>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                          <div className="bg-green-200 p-1 rounded-full">
                            <Target className="h-3 w-3 text-green-700" />
                          </div>
                          {t('water-saving') || 'Water Saving'}
                        </div>
                        <p className="text-sm text-green-800">{t('water-saving-suggestion') || 'Reduce Zone 3 irrigation by 20% based on recent rainfall data.'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="machinery" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Truck className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{t('machinery-status') || 'Machinery Status'}</CardTitle>
                      <CardDescription>{t('equipment-monitoring') || 'Real-time equipment monitoring and maintenance'}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: 'Tractor JD-2040',
                        type: 'Tractor',
                        status: 'active',
                        location: 'North Field',
                        fuel: 85,
                        hours: 1247,
                        maintenance: 'due',
                        icon: <Truck className="h-5 w-5" />
                      },
                      {
                        name: 'Harvester CH-960',
                        type: 'Harvester',
                        status: 'idle',
                        location: 'Equipment Shed',
                        fuel: 45,
                        hours: 892,
                        maintenance: 'ok',
                        icon: <Crop className="h-5 w-5" />
                      },
                      {
                        name: 'Sprayer SP-300',
                        type: 'Sprayer',
                        status: 'maintenance',
                        location: 'Service Bay',
                        fuel: 20,
                        hours: 634,
                        maintenance: 'in-progress',
                        icon: <Sprout className="h-5 w-5" />
                      },
                      {
                        name: 'Irrigation Pump IP-150',
                        type: 'Pump',
                        status: 'active',
                        location: 'East Field',
                        fuel: 92,
                        hours: 2156,
                        maintenance: 'ok',
                        icon: <Droplet className="h-5 w-5" />
                      }
                    ].map((machine, index) => (
                      <div
                        key={machine.name}
                        className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm animate-slide-in-left"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              machine.status === 'active' ? 'bg-green-100 text-green-600' :
                              machine.status === 'idle' ? 'bg-gray-100 text-gray-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {machine.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{machine.name}</h3>
                              <p className="text-sm text-gray-500">{machine.type}</p>
                            </div>
                          </div>
                          <Badge className={`${
                            machine.status === 'active' ? 'bg-green-500' :
                            machine.status === 'idle' ? 'bg-gray-500' :
                            'bg-red-500'
                          } ${machine.status === 'active' ? 'animate-pulse' : ''}`}>
                            {t(`status-${machine.status}`) || machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" />
                            <span>{machine.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" />
                            <span>{machine.hours}h</span>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Fuel size={14} className="text-blue-500" />
                              {t('fuel-level') || 'Fuel Level'}
                            </span>
                            <span className={`font-medium ${machine.fuel > 50 ? 'text-green-600' : machine.fuel > 20 ? 'text-amber-600' : 'text-red-600'}`}>
                              {machine.fuel}%
                            </span>
                          </div>
                          <Progress
                            value={machine.fuel}
                            className="h-2"
                            style={{
                              backgroundColor: '#f3f4f6',
                              '--tw-progress-bar-background-color': machine.fuel > 50 ? '#059669' : machine.fuel > 20 ? '#d97706' : '#dc2626'
                            } as React.CSSProperties}
                          />

                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Settings size={14} className="text-gray-500" />
                              {t('maintenance') || 'Maintenance'}
                            </span>
                            <Badge variant="outline" className={`${
                              machine.maintenance === 'ok' ? 'border-green-500 text-green-600' :
                              machine.maintenance === 'due' ? 'border-amber-500 text-amber-600' :
                              'border-red-500 text-red-600'
                            }`}>
                              {t(`maintenance-${machine.maintenance}`) || machine.maintenance.charAt(0).toUpperCase() + machine.maintenance.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gray-600 hover:bg-gray-700 transition-colors">
                    <Settings size={16} className="mr-2" />
                    {t('manage-machinery') || 'Manage Machinery'}
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-6">
                <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{t('performance-metrics') || 'Performance Metrics'}</CardTitle>
                        <CardDescription>{t('efficiency-analytics') || 'Equipment efficiency and usage analytics'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Tractor', efficiency: 87, usage: 92 },
                        { name: 'Harvester', efficiency: 78, usage: 45 },
                        { name: 'Sprayer', efficiency: 65, usage: 23 },
                        { name: 'Pump', efficiency: 94, usage: 88 }
                      ]} key={`machinery-${animationKey}`}>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="efficiency" fill="#3b82f6" name={t('efficiency') || 'Efficiency (%)'} />
                        <Bar dataKey="usage" fill="#10b981" name={t('usage') || 'Usage (%)'} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('maintenance-schedule') || 'Maintenance Schedule'}</CardTitle>
                    <CardDescription>{t('upcoming-maintenance') || 'Upcoming maintenance and service reminders'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { equipment: 'Tractor JD-2040', task: 'Oil Change', due: '2 days', priority: 'high' },
                        { equipment: 'Harvester CH-960', task: 'Filter Replacement', due: '1 week', priority: 'medium' },
                        { equipment: 'Sprayer SP-300', task: 'Calibration', due: 'In Progress', priority: 'high' },
                        { equipment: 'Irrigation Pump', task: 'Inspection', due: '2 weeks', priority: 'low' }
                      ].map((item, index) => (
                        <div
                          key={item.equipment}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-slide-in-right"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div>
                            <p className="font-medium text-sm">{item.equipment}</p>
                            <p className="text-xs text-gray-500">{item.task}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{item.due}</p>
                            <Badge className={`text-xs ${
                              item.priority === 'high' ? 'bg-red-500' :
                              item.priority === 'medium' ? 'bg-amber-500' :
                              'bg-green-500'
                            }`}>
                              {t(`priority-${item.priority}`) || item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weather" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6 transform hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-blue-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Cloud className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{t('weather-dashboard') || 'Weather Dashboard'}</CardTitle>
                        <CardDescription>{t('current-conditions-forecast') || 'Current conditions and 7-day forecast'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg text-center animate-slide-in-left">
                        <div className="flex justify-center mb-2">
                          <Thermometer className="h-8 w-8 text-orange-500 animate-pulse" />
                        </div>
                        <p className="text-2xl font-bold">26°C</p>
                        <p className="text-sm text-gray-600">{t('temperature') || 'Temperature'}</p>
                        <p className="text-xs text-gray-500">{t('feels-like') || 'Feels like'} 28°C</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg text-center animate-slide-in-left" style={{ animationDelay: '100ms' }}>
                        <div className="flex justify-center mb-2">
                          <Droplet className="h-8 w-8 text-blue-500 animate-bounce" />
                        </div>
                        <p className="text-2xl font-bold">65%</p>
                        <p className="text-sm text-gray-600">{t('humidity') || 'Humidity'}</p>
                        <p className="text-xs text-gray-500">20% {t('rain-chance') || 'Rain chance'}</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg text-center animate-slide-in-left" style={{ animationDelay: '200ms' }}>
                        <div className="flex justify-center mb-2">
                          <Wind className="h-8 w-8 text-gray-500 animate-pulse" />
                        </div>
                        <p className="text-2xl font-bold">8 km/h</p>
                        <p className="text-sm text-gray-600">{t('wind-speed') || 'Wind Speed'}</p>
                        <p className="text-xs text-gray-500">NE {t('direction') || 'direction'}</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg text-center animate-slide-in-left" style={{ animationDelay: '300ms' }}>
                        <div className="flex justify-center mb-2">
                          <Gauge className="h-8 w-8 text-purple-500 animate-pulse" />
                        </div>
                        <p className="text-2xl font-bold">1013</p>
                        <p className="text-sm text-gray-600">{t('pressure') || 'Pressure'}</p>
                        <p className="text-xs text-gray-500">hPa</p>
                      </div>
                    </div>

                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { time: '00:00', temp: 18, humidity: 75, pressure: 1012 },
                          { time: '06:00', temp: 22, humidity: 68, pressure: 1013 },
                          { time: '12:00', temp: 26, humidity: 65, pressure: 1013 },
                          { time: '18:00', temp: 24, humidity: 70, pressure: 1014 },
                          { time: '24:00', temp: 20, humidity: 72, pressure: 1012 }
                        ]} key={`weather-${animationKey}`}>
                          <XAxis
                            dataKey="time"
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="temp"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            name={t('temperature') || 'Temperature (°C)'}
                            animationDuration={1500}
                          />
                          <Line
                            type="monotone"
                            dataKey="humidity"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            name={t('humidity') || 'Humidity (%)'}
                            animationDuration={1500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{t('7-day-forecast') || '7-Day Forecast'}</CardTitle>
                        <CardDescription>{t('extended-weather-outlook') || 'Extended weather outlook'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { day: 'Today', icon: '☀️', high: 26, low: 18, rain: 20 },
                        { day: 'Tomorrow', icon: '⛅', high: 24, low: 16, rain: 40 },
                        { day: 'Wednesday', icon: '🌧️', high: 22, low: 14, rain: 80 },
                        { day: 'Thursday', icon: '☀️', high: 28, low: 19, rain: 10 },
                        { day: 'Friday', icon: '⛅', high: 25, low: 17, rain: 30 },
                        { day: 'Saturday', icon: '☀️', high: 29, low: 20, rain: 5 },
                        { day: 'Sunday', icon: '⛅', high: 27, low: 18, rain: 25 }
                      ].map((forecast, index) => (
                        <div
                          key={forecast.day}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-slide-in-right"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl animate-float" style={{ animationDelay: `${index * 200}ms` }}>
                              {forecast.icon}
                            </span>
                            <div>
                              <p className="font-medium text-sm">{forecast.day}</p>
                              <p className="text-xs text-gray-500">{forecast.rain}% {t('rain-chance-text') || 'rain'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{forecast.high}°/{forecast.low}°</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('weather-alerts') || 'Weather Alerts'}</CardTitle>
                    <CardDescription>{t('important-weather-warnings') || 'Important weather warnings and advisories'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg animate-fade-in">
                        <div className="flex items-center gap-2 text-yellow-800 font-medium mb-1">
                          <AlertTriangle className="h-4 w-4" />
                          {t('frost-warning') || 'Frost Warning'}
                        </div>
                        <p className="text-sm text-yellow-800">{t('frost-warning-message') || 'Temperatures may drop below 2°C tonight. Protect sensitive crops.'}</p>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
                          <Droplet className="h-4 w-4" />
                          {t('rain-advisory') || 'Rain Advisory'}
                        </div>
                        <p className="text-sm text-blue-800">{t('rain-advisory-message') || 'Heavy rainfall expected Wednesday. Consider adjusting irrigation schedules.'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="soil" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-green-50/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{t('soil-analysis-monitoring') || 'Soil Analysis'}</CardTitle>
                      <CardDescription>{t('comprehensive-soil-monitoring') || 'Comprehensive soil health monitoring and analysis'}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: t('ph-level-monitoring') || 'pH Level', value: '6.8', status: 'optimal', icon: <Gauge className="h-5 w-5" />, color: 'green' },
                      { label: t('nitrogen') || 'Nitrogen', value: '45 ppm', status: 'good', icon: <Leaf className="h-5 w-5" />, color: 'blue' },
                      { label: t('phosphorus') || 'Phosphorus', value: '32 ppm', status: 'low', icon: <Sprout className="h-5 w-5" />, color: 'amber' },
                      { label: t('potassium') || 'Potassium', value: '180 ppm', status: 'high', icon: <Shield className="h-5 w-5" />, color: 'purple' }
                    ].map((metric, index) => (
                      <div
                        key={metric.label}
                        className={`p-4 rounded-lg bg-${metric.color}-50 border border-${metric.color}-200 animate-slide-in-left`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`text-${metric.color}-600`}>
                            {metric.icon}
                          </div>
                          <span className="text-sm font-medium">{metric.label}</span>
                        </div>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <Badge className={`text-xs ${
                          metric.status === 'optimal' ? 'bg-green-500' :
                          metric.status === 'good' ? 'bg-blue-500' :
                          metric.status === 'low' ? 'bg-amber-500' :
                          'bg-purple-500'
                        }`}>
                          {t(`status-${metric.status}`) || metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart key={`soil-${animationKey}`}>
                        <Pie
                          data={[
                            { name: t('sand-composition') || 'Sand', value: 45, fill: '#f59e0b' },
                            { name: t('clay-composition') || 'Clay', value: 30, fill: '#ef4444' },
                            { name: t('silt-composition') || 'Silt', value: 25, fill: '#8b5cf6' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          animationDuration={1500}
                        >
                          {[
                            { name: 'Sand', value: 45, fill: '#f59e0b' },
                            { name: 'Clay', value: 30, fill: '#ef4444' },
                            { name: 'Silt', value: 25, fill: '#8b5cf6' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value) => [`${value}%`, t('composition') || 'Composition']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700 transition-colors">
                    <Leaf size={16} className="mr-2" />
                    {t('detailed-soil-report') || 'View Detailed Soil Report'}
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-6">
                <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Droplet className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{t('moisture-levels') || 'Moisture Levels'}</CardTitle>
                        <CardDescription>{t('field-by-field-moisture') || 'Field-by-field moisture monitoring'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {fieldData.map((field, index) => (
                        <div
                          key={field.id}
                          className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm animate-slide-in-right"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-gray-500" />
                              <span className="font-medium">{field.name}</span>
                            </div>
                            <Badge className={`${
                              field.soilMoisture > 60 ? 'bg-blue-500' :
                              field.soilMoisture > 30 ? 'bg-green-500' :
                              'bg-red-500'
                            }`}>
                              {field.soilMoisture}%
                            </Badge>
                          </div>
                          <Progress
                            value={field.soilMoisture}
                            className="h-3 mb-2"
                            style={{
                              backgroundColor: '#f3f4f6',
                              '--tw-progress-bar-background-color': field.soilMoisture > 60 ? '#3b82f6' : field.soilMoisture > 30 ? '#10b981' : '#ef4444'
                            } as React.CSSProperties}
                          />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{t('optimal-range-monitoring') || 'Optimal'}: 40-70%</span>
                            <span className={`${
                              field.soilMoisture >= 40 && field.soilMoisture <= 70 ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {field.soilMoisture >= 40 && field.soilMoisture <= 70 ? t('optimal-status') || 'Optimal' : t('needs-attention') || 'Needs Attention'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('soil-recommendations') || 'Soil Recommendations'}</CardTitle>
                    <CardDescription>{t('ai-soil-suggestions') || 'AI-powered soil improvement suggestions'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in">
                        <div className="flex items-center gap-2 text-amber-800 font-medium mb-1">
                          <Sprout className="h-4 w-4" />
                          {t('phosphorus-deficiency') || 'Phosphorus Deficiency'}
                        </div>
                        <p className="text-sm text-amber-800">{t('phosphorus-recommendation') || 'Consider applying phosphorus fertilizer to North Field to improve crop yield.'}</p>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
                          <Droplet className="h-4 w-4" />
                          {t('irrigation-adjustment') || 'Irrigation Adjustment'}
                        </div>
                        <p className="text-sm text-blue-800">{t('irrigation-recommendation') || 'Reduce irrigation in East Field due to high moisture levels.'}</p>
                      </div>

                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                          <Leaf className="h-4 w-4" />
                          {t('soil-health') || 'Soil Health'}
                        </div>
                        <p className="text-sm text-green-800">{t('soil-health-recommendation') || 'Overall soil health is excellent. Continue current management practices.'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="crops" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6 transform hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-green-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Sprout className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{t('crop-monitoring') || 'Crop Monitoring'}</CardTitle>
                        <CardDescription>{t('growth-health-analytics') || 'Growth stages, health analytics, and yield predictions'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-green-50 p-4 rounded-lg text-center animate-slide-in-left">
                        <div className="flex justify-center mb-2">
                          <Sprout className="h-8 w-8 text-green-600 animate-bounce" />
                        </div>
                        <p className="text-2xl font-bold">87%</p>
                        <p className="text-sm text-gray-600">{t('average-health') || 'Average Health'}</p>
                        <p className="text-xs text-green-600">+5% {t('from-last-month') || 'from last month'}</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg text-center animate-slide-in-left" style={{ animationDelay: '100ms' }}>
                        <div className="flex justify-center mb-2">
                          <TrendingUp className="h-8 w-8 text-blue-600 animate-pulse" />
                        </div>
                        <p className="text-2xl font-bold">12.5T</p>
                        <p className="text-sm text-gray-600">{t('predicted-yield') || 'Predicted Yield'}</p>
                        <p className="text-xs text-blue-600">{t('per-hectare') || 'per hectare'}</p>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg text-center animate-slide-in-left" style={{ animationDelay: '200ms' }}>
                        <div className="flex justify-center mb-2">
                          <Calendar className="h-8 w-8 text-amber-600 animate-pulse" />
                        </div>
                        <p className="text-2xl font-bold">45</p>
                        <p className="text-sm text-gray-600">{t('days-to-harvest') || 'Days to Harvest'}</p>
                        <p className="text-xs text-amber-600">{t('estimated') || 'estimated'}</p>
                      </div>
                    </div>

                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { week: 'Week 1', growth: 15, health: 85 },
                          { week: 'Week 2', growth: 28, health: 87 },
                          { week: 'Week 3', growth: 42, health: 89 },
                          { week: 'Week 4', growth: 58, health: 88 },
                          { week: 'Week 5', growth: 72, health: 90 },
                          { week: 'Week 6', growth: 85, health: 87 }
                        ]} key={`crops-${animationKey}`}>
                          <defs>
                            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="week"
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="growth"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#growthGradient)"
                            name={t('growth-stage') || 'Growth Stage (%)'}
                            animationDuration={1500}
                          />
                          <Area
                            type="monotone"
                            dataKey="health"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#healthGradient)"
                            name={t('health-score') || 'Health Score (%)'}
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{t('crop-alerts') || 'Crop Alerts'}</CardTitle>
                        <CardDescription>{t('health-issues-recommendations') || 'Health issues and recommendations'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { type: 'pest', severity: 'warning', field: 'North Field', message: 'Aphid infestation detected', action: 'Apply organic pesticide' },
                        { type: 'disease', severity: 'critical', field: 'East Field', message: 'Fungal infection spreading', action: 'Immediate treatment required' },
                        { type: 'nutrition', severity: 'info', field: 'South Field', message: 'Nitrogen levels optimal', action: 'Continue current fertilization' },
                        { type: 'growth', severity: 'warning', field: 'West Field', message: 'Slow growth detected', action: 'Check irrigation schedule' }
                      ].map((alert, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm animate-slide-in-right"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`rounded-full p-2 ${getSeverityColor(alert.severity)} animate-pulse-soft`}>
                              {getSeverityIcon(alert.severity)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{alert.field}</span>
                                <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                                  {t(`alert-type-${alert.type}`) || alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mb-1">{alert.message}</p>
                              <p className="text-xs text-blue-600">{t('recommended-action') || 'Recommended'}: {alert.action}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-green-600 hover:bg-green-700 transition-colors">
                      <Eye size={16} className="mr-2" />
                      {t('view-all-crop-alerts') || 'View All Crop Alerts'}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="transform hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('harvest-schedule') || 'Harvest Schedule'}</CardTitle>
                    <CardDescription>{t('upcoming-harvest-activities') || 'Upcoming harvest activities and timeline'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {fieldData.map((field, index) => {
                        const daysToHarvest = Math.ceil((new Date(field.harvestDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                        return (
                          <div
                            key={field.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-slide-in-right"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                daysToHarvest <= 7 ? 'bg-red-500 animate-pulse' :
                                daysToHarvest <= 30 ? 'bg-amber-500' : 'bg-green-500'
                              }`}></div>
                              <div>
                                <p className="font-medium text-sm">{field.name}</p>
                                <p className="text-xs text-gray-500">{field.crop}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{daysToHarvest} {t('days') || 'days'}</p>
                              <p className="text-xs text-gray-500">{field.health}% {t('health') || 'health'}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Monitoring;