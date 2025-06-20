import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/components/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import {
  Droplet, Thermometer, Leaf, Wind, Signal, Gauge, Cloud, Flower,
  Crop, Fuel, AlertTriangle, Bell, Eye, ArrowUpRight, Battery, Satellite
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
    case 'critical': return 'bg-red-500';
    case 'warning': return 'bg-yellow-500';
    case 'info': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};

const Monitoring = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedField, setSelectedField] = useState(fieldData[0]);
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleAlertAction = (alertId: number) => {
    toast({
      title: "Alert acknowledged",
      description: "The alert has been marked as addressed.",
    });
  };
  
  const handleSensorCalibration = (sensorType: string) => {
    toast({
      title: "Calibration initiated",
      description: `${sensorType} sensor calibration has been scheduled.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foliage-dark hover:text-foliage transition-colors">
              {t('farm-monitoring')}
            </h1>
            <p className="text-gray-600">{t('monitoring-description')}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex gap-2 items-center hover:scale-105 transition-transform duration-200"
            >
              <Bell size={16} className="animate-pulse" />
              <span className="bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {alertsData.filter(a => a.severity === 'critical').length}
              </span>
            </Button>
            <Button 
              className="bg-foliage hover:bg-foliage-dark transition-colors duration-300 hover:scale-105 transform"
            >
              Refresh Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 mb-8 animate-fade-in">
            {["overview", "soil", "weather", "crops", "irrigation", "machinery", "livestock"].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="hover:scale-105 transition-transform duration-200"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Field Health",
                  description: "Average crop health across all fields",
                  content: (
                    <>
                      <div className="text-4xl font-bold text-foliage-dark transition-all hover:scale-105">
                        {Math.round(fieldData.reduce((sum, field) => sum + field.health, 0) / fieldData.length)}%
                      </div>
                      <Progress 
                        value={Math.round(fieldData.reduce((sum, field) => sum + field.health, 0) / fieldData.length)} 
                        className="h-2 mt-2 transition-all duration-500" 
                      />
                    </>
                  )
                },
                {
                  title: "Active Alerts",
                  description: "Issues requiring attention",
                  content: (
                    <>
                      <div className="text-4xl font-bold text-amber-500 transition-all hover:scale-105">
                        {alertsData.length}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {['critical', 'warning', 'info'].map((severity) => (
                          <Badge 
                            key={severity}
                            className={`${getSeverityColor(severity)} transform hover:scale-110 transition-transform cursor-pointer`}
                          >
                            {alertsData.filter(a => a.severity === severity).length} {severity.charAt(0).toUpperCase() + severity.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )
                },
                {
                  title: "Weather Forecast",
                  description: "Today's conditions",
                  content: (
                    <div className="flex justify-between items-center">
                      <div className="transition-all hover:scale-105">
                        <div className="text-4xl font-bold">26°C</div>
                        <div className="text-gray-600">Partly Cloudy</div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center justify-end gap-1 text-blue-500 transition-all hover:scale-105">
                          <Droplet size={16} className="animate-bounce" />
                          <span>20% Chance of Rain</span>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-gray-600 transition-all hover:scale-105">
                          <Wind size={16} className="animate-pulse" />
                          <span>8 km/h NE</span>
                        </div>
                      </div>
                    </div>
                  )
                }
              ].map((item, index) => (
                <Card key={index} className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {item.content}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="transform hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Issues requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alertsData.slice(0, 3).map(alert => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <div className={`rounded-full p-2 ${getSeverityColor(alert.severity)}`}>
                          <AlertTriangle className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{alert.message}</div>
                          <div className="text-sm text-gray-500">{alert.time}</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleAlertAction(alert.id)}>
                          Acknowledge
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => setActiveTab('alerts')}>
                    View All Alerts
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="transform hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Soil Moisture Trends</CardTitle>
                  <CardDescription>Average across all fields</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={soilMoistureData}>
                      <defs>
                        <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area type="monotone" dataKey="moisture" stroke="#8884d8" fillOpacity={1} fill="url(#moistureGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card className="transform hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Field Status</CardTitle>
                <CardDescription>Current condition of your fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {fieldData.map(field => (
                    <div 
                      key={field.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedField.id === field.id 
                          ? 'border-foliage bg-foliage/5 shadow-lg' 
                          : 'hover:border-gray-300 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedField(field)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{field.name}</h3>
                          <p className="text-gray-500">{field.crop}</p>
                        </div>
                        {field.alerts.length > 0 && (
                          <Badge className="bg-amber-500">
                            {field.alerts.length} {field.alerts.length === 1 ? 'Alert' : 'Alerts'}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Crop Health</span>
                          <span className={`font-medium ${field.health > 80 ? 'text-green-600' : field.health > 60 ? 'text-amber-600' : 'text-red-600'}`}>
                            {field.health}%
                          </span>
                        </div>
                        <Progress 
                          value={field.health} 
                          className="h-1.5"
                          style={{ 
                            backgroundColor: '#f3f4f6',
                            '--tw-progress-bar-background-color': field.health > 80 ? '#059669' : field.health > 60 ? '#d97706' : '#dc2626'
                          } as React.CSSProperties}
                        />
                        
                        <div className="flex justify-between mt-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Droplet size={14} />
                            <span>{field.soilMoisture}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Thermometer size={14} />
                            <span>{field.temperature}°C</span>
                          </div>
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
          
          <TabsContent value="crops">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Crop Health Dashboard</CardTitle>
                    <CardDescription>Real-time crop data from your fields</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Droplet className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Average Crop Health</p>
                          <p className="text-2xl font-semibold">92%</p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-amber-100 p-3 rounded-lg">
                          <Leaf className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Crop Yield</p>
                          <p className="text-2xl font-semibold">650 kg/ha</p>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Thermometer className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Crop Growth Rate</p>
                          <p className="text-2xl font-semibold">10% per week</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={temperatureData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Crop Nutrient Levels</CardTitle>
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
                    <CardTitle>Crop Sensors Status</CardTitle>
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
                    <Button className="w-full" onClick={() => handleSensorCalibration('crops')}>
                      Calibrate Sensors
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                    <CardDescription>Based on crop analysis</CardDescription>
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
          
          <TabsContent value="irrigation">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Irrigation Status</CardTitle>
                    <CardDescription>Current irrigation schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium mb-3">North Field</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Start Time</span>
                              <span>08:00 AM</span>
                            </div>
                            <Progress value={70} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>End Time</span>
                              <span>10:00 AM</span>
                            </div>
                            <Progress value={80} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">East Field</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Start Time</span>
                              <span>09:00 AM</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>End Time</span>
                              <span>11:00 AM</span>
                            </div>
                            <Progress value={70} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">West Field</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Start Time</span>
                              <span>10:00 AM</span>
                            </div>
                            <Progress value={50} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>End Time</span>
                              <span>12:00 PM</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rainfallData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Irrigation Alerts</CardTitle>
                    <CardDescription>Upcoming irrigation schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex gap-2 text-yellow-800 font-medium">
                          <AlertTriangle className="h-5 w-5" />
                          <span>Low Irrigation Water</span>
                        </div>
                        <p className="text-sm text-yellow-800 mt-1">Irrigation water levels are low in East Field. Consider increasing water supply.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Irrigation History</CardTitle>
                    <CardDescription>Previous irrigation schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">North Field</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Start Time</span>
                              <span>08:00 AM</span>
                            </div>
                            <Progress value={70} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>End Time</span>
                              <span>10:00 AM</span>
                            </div>
                            <Progress value={80} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">East Field</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Start Time</span>
                              <span>09:00 AM</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>End Time</span>
                              <span>11:00 AM</span>
                            </div>
                            <Progress value={70} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">West Field</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Start Time</span>
                              <span>10:00 AM</span>
                            </div>
                            <Progress value={50} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>End Time</span>
                              <span>12:00 PM</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="machinery">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Machinery Status</CardTitle>
                    <CardDescription>Current status of your machinery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium mb-3">John Deere 8R Tractor</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Status</span>
                              <span>Active</span>
                            </div>
                            <Progress value={92} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Fuel</span>
                              <span>78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Case IH Harvester</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Status</span>
                              <span>Maintenance</span>
                            </div>
                            <Progress value={68} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Fuel</span>
                              <span>45%</span>
                            </div>
                            <Progress value={45} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Sprayer Drone</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Status</span>
                              <span>Charging</span>
                            </div>
                            <Progress value={88} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Fuel</span>
                              <span>95%</span>
                            </div>
                            <Progress value={95} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={machinesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="health" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Machinery Alerts</CardTitle>
                    <CardDescription>Upcoming maintenance schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex gap-2 text-yellow-800 font-medium">
                          <AlertTriangle className="h-5 w-5" />
                          <span>Harvester Maintenance</span>
                        </div>
                        <p className="text-sm text-yellow-800 mt-1">Harvester maintenance is due in 5 days.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Machinery History</CardTitle>
                    <CardDescription>Previous maintenance schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">John Deere 8R Tractor</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Status</span>
                              <span>Active</span>
                            </div>
                            <Progress value={92} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Fuel</span>
                              <span>78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Case IH Harvester</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Status</span>
                              <span>Maintenance</span>
                            </div>
                            <Progress value={68} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Fuel</span>
                              <span>45%</span>
                            </div>
                            <Progress value={45} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Sprayer Drone</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Status</span>
                              <span>Charging</span>
                            </div>
                            <Progress value={88} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Fuel</span>
                              <span>95%</span>
                            </div>
                            <Progress value={95} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="livestock">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Livestock Health Dashboard</CardTitle>
                    <CardDescription>Real-time livestock data from your fields</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Droplet className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Average Livestock Health</p>
                          <p className="text-2xl font-semibold">92%</p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-amber-100 p-3 rounded-lg">
                          <Leaf className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Livestock Yield</p>
                          <p className="text-2xl font-semibold">650 kg/ha</p>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Thermometer className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Livestock Growth Rate</p>
                          <p className="text-2xl font-semibold">10% per week</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={temperatureData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Livestock Nutrient Levels</CardTitle>
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
                    <CardTitle>Livestock Sensors Status</CardTitle>
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
                    <Button className="w-full" onClick={() => handleSensorCalibration('livestock')}>
                      Calibrate Sensors
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                    <CardDescription>Based on livestock analysis</CardDescription>
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
        </Tabs>
      </div>
    </Layout>
  );
};

export default Monitoring;