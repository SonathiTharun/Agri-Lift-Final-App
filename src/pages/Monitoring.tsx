
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import {
  Droplet,
  Thermometer,
  Leaf,
  Wind,
  Signal,
  Sensor,
  Cloud,
  Flower,
  Crop,
  Fuel,
  AlertTriangle,
  Bell,
  Eye,
  ArrowUpRight,
  Battery,
  Satellite
} from "lucide-react";

// Sample data
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

// Sample alerts data
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foliage-dark">Farm Monitoring System</h1>
            <p className="text-gray-600">Monitor and manage all your farming operations in real-time</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex gap-2 items-center">
              <Bell size={16} />
              <span className="bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {alertsData.filter(a => a.severity === 'critical').length}
              </span>
            </Button>
            <Button className="bg-foliage hover:bg-foliage-dark">Refresh Data</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="soil">Soil Sensors</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="crops">Crops & Fields</TabsTrigger>
            <TabsTrigger value="irrigation">Water & Irrigation</TabsTrigger>
            <TabsTrigger value="machinery">Machinery</TabsTrigger>
            <TabsTrigger value="livestock">Livestock</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Field Health</CardTitle>
                  <CardDescription>Average crop health across all fields</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foliage-dark">
                    {Math.round(fieldData.reduce((sum, field) => sum + field.health, 0) / fieldData.length)}%
                  </div>
                  <Progress 
                    value={Math.round(fieldData.reduce((sum, field) => sum + field.health, 0) / fieldData.length)} 
                    className="h-2 mt-2" 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Active Alerts</CardTitle>
                  <CardDescription>Issues requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-amber-500">
                    {alertsData.length}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-red-500">
                      {alertsData.filter(a => a.severity === 'critical').length} Critical
                    </Badge>
                    <Badge className="bg-yellow-500">
                      {alertsData.filter(a => a.severity === 'warning').length} Warnings
                    </Badge>
                    <Badge className="bg-blue-500">
                      {alertsData.filter(a => a.severity === 'info').length} Info
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Weather Forecast</CardTitle>
                  <CardDescription>Today's conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-4xl font-bold">26°C</div>
                      <div className="text-gray-600">Partly Cloudy</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-blue-500">
                        <Droplet size={16} />
                        <span>20% Chance of Rain</span>
                      </div>
                      <div className="flex items-center justify-end gap-1 text-gray-600 mt-1">
                        <Wind size={16} />
                        <span>8 km/h NE</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
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
              
              <Card>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Field Status</CardTitle>
                <CardDescription>Current condition of your fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {fieldData.map(field => (
                    <div 
                      key={field.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedField.id === field.id ? 'border-foliage bg-foliage/5' : 'hover:border-gray-300'}`}
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
                  <div className="mt-8 border-t pt-6">
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
                            <Sensor className="h-4 w-4 text-green-600" />
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
                            <Sensor className="h-4 w-4 text-green-600" />
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
                            <Sensor className="h-4 w-4 text-green-600" />
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
                            <Sensor className="h-4 w-4 text-red-600" />
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
                            <Sensor className="h-3 w-3 text-amber-700" />
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
                          <span className="text-sm text-gray-600">Clouds</span>
                          <span className="font-medium">40%</span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-lg">
                          <Eye className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-gray-600">Visibility</span>
                          <span className="font-medium">10 km</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-6">
                      <h3 className="font-medium">Hourly Forecast</h3>
                      <div className="overflow-x-auto">
                        <div className="flex space-x-8 py-4 px-1">
                          {[
                            { time: '2 PM', temp: 26, icon: 'partly-cloudy', rain: '20%' },
                            { time: '3 PM', temp: 27, icon: 'partly-cloudy', rain: '20%' },
                            { time: '4 PM', temp: 26, icon: 'partly-cloudy', rain: '20%' },
                            { time: '5 PM', temp: 25, icon: 'cloudy', rain: '30%' },
                            { time: '6 PM', temp: 24, icon: 'cloudy', rain: '40%' },
                            { time: '7 PM', temp: 22, icon: 'rain', rain: '60%' },
                            { time: '8 PM', temp: 21, icon: 'rain', rain: '70%' },
                            { time: '9 PM', temp: 20, icon: 'rain', rain: '60%' },
                          ].map((hour, i) => (
                            <div key={i} className="flex flex-col items-center min-w-[60px]">
                              <div className="text-sm font-medium">{hour.time}</div>
                              <div className="my-1">
                                {hour.icon === 'partly-cloudy' && <Cloud className="h-5 w-5 text-gray-600" />}
                                {hour.icon === 'cloudy' && <Cloud className="h-5 w-5 text-gray-600" />}
                                {hour.icon === 'rain' && <Droplet className="h-5 w-5 text-blue-600" />}
                              </div>
                              <div className="font-medium">{hour.temp}°C</div>
                              <div className="text-xs text-blue-600">{hour.rain}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="font-medium mb-3">Monthly Rainfall</h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={rainfallData}>
                          <defs>
                            <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip />
                          <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#rainfallGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Weather Alerts</CardTitle>
                    <CardDescription>Forecasted weather events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          Heavy Rain Warning
                        </div>
                        <p className="text-sm text-red-800 mb-1">Heavy rainfall expected in your area tomorrow between 6 PM - 11 PM.</p>
                        <p className="text-xs text-red-600">Expected precipitation: 25-30mm</p>
                      </div>
                      
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          Strong Wind Advisory
                        </div>
                        <p className="text-sm text-amber-800 mb-1">Strong winds forecasted for next 48 hours, gusting up to 50 km/h.</p>
                        <p className="text-xs text-amber-600">Take precautions with outdoor equipment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Environmental Sensors</CardTitle>
                    <CardDescription>Readings from your weather station</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Droplet className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Humidity</p>
                            <p className="font-medium">65%</p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Wind className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Wind Speed</p>
                            <p className="font-medium">8 km/h</p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-amber-600" />
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Thermometer className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Air Temperature</p>
                            <p className="font-medium">26°C</p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Signal className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Barometric Pressure</p>
                            <p className="font-medium">1013 hPa</p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleSensorCalibration('weather')}>
                      Calibrate Weather Sensors
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="crops">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Field Overview</CardTitle>
                      <CardDescription>Status of all crop fields</CardDescription>
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Crops</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="soybeans">Soybeans</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {fieldData.map(field => (
                        <div key={field.id} className="border rounded-lg p-4">
                          <div className="flex flex-wrap gap-4 justify-between">
                            <div>
                              <h3 className="font-semibold text-lg flex items-center gap-2">
                                {field.name}
                                {field.alerts.length > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {field.alerts.length} {field.alerts.length === 1 ? 'Alert' : 'Alerts'}
                                  </Badge>
                                )}
                              </h3>
                              <p className="text-gray-600">{field.crop} • {field.area}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-600">Crop Health:</span>
                                <span className={`font-medium ${field.health > 80 ? 'text-green-600' : field.health > 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                  {field.health}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <span>Planted:</span>
                                <span>{field.plantDate}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                              <span className="text-xs text-gray-500">Soil Moisture</span>
                              <span className="font-medium">{field.soilMoisture}%</span>
                              <Progress value={field.soilMoisture} className="h-1 mt-2" />
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                              <span className="text-xs text-gray-500">Temperature</span>
                              <span className="font-medium">{field.temperature}°C</span>
                              <Progress value={field.temperature * 2} className="h-1 mt-2" />
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                              <span className="text-xs text-gray-500">Growth Stage</span>
                              <span className="font-medium">Vegetative</span>
                              <Progress value={35} className="h-1 mt-2" />
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                              <span className="text-xs text-gray-500">Harvest Countdown</span>
                              <span className="font-medium">
                                {Math.ceil((new Date(field.harvestDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days
                              </span>
                              <Progress 
                                value={100 - Math.ceil((new Date(field.harvestDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24) / 1.2)} 
                                className="h-1 mt-2" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Crop Analytics</CardTitle>
                    <CardDescription>Season performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">Yield Prediction</h4>
                          <Badge variant="outline" className="text-amber-600 bg-amber-50">
                            +5% vs Last Year
                          </Badge>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="text-3xl font-bold">6.7</div>
                          <div className="text-gray-600 mb-1">tonnes/hectare</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-3">Crop Distribution</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Wheat</span>
                              <span>4.2 ha</span>
                            </div>
                            <Progress value={30} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Corn</span>
                              <span>6.8 ha</span>
                            </div>
                            <Progress value={48} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Soybeans</span>
                              <span>5.5 ha</span>
                            </div>
                            <Progress value={40} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Rice</span>
                              <span>3.2 ha</span>
                            </div>
                            <Progress value={22} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-3">Growth Stages</h4>
                        <div className="grid grid-cols-4 gap-1 text-xs text-center">
                          <div className="bg-green-100 text-green-800 py-1 rounded-l-md font-medium">
                            Seeding
                          </div>
                          <div className="bg-green-200 text-green-800 py-1 font-medium">
                            Vegetative
                          </div>
                          <div className="bg-green-300 text-green-800 py-1 font-medium">
                            Flowering
                          </div>
                          <div className="bg-green-400 text-green-800 py-1 rounded-r-md font-medium">
                            Harvest
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Tasks</CardTitle>
                    <CardDescription>Scheduled farming activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                        <div className="bg-foliage text-white p-2 rounded-md">
                          <Crop className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="font-medium">Fertilizer Application</h5>
                          <p className="text-sm text-gray-600">East Field • Corn</p>
                          <p className="text-xs text-gray-500 mt-1">Tomorrow, 8:00 AM</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                        <div className="bg-foliage text-white p-2 rounded-md">
                          <Droplet className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="font-medium">Irrigation Check</h5>
                          <p className="text-sm text-gray-600">All Fields</p>
                          <p className="text-xs text-gray-500 mt-1">Apr 23, 9:00 AM</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                        <div className="bg-foliage text-white p-2 rounded-md">
                          <Flower className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="font-medium">Pest Control</h5>
                          <p className="text-sm text-gray-600">West Field • Rice</p>
                          <p className="text-xs text-gray-500 mt-1">Apr 25, 10:00 AM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Complete Schedule
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="irrigation">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Irrigation System Status</CardTitle>
                    <CardDescription>Real-time water management data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
                        <div className="bg-blue-100 rounded-full p-3 mb-2">
                          <Droplet className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Water Consumption</div>
                          <div className="text-2xl font-semibold">3,246 L</div>
                          <div className="text-xs text-green-600">-12% vs. last week</div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
                        <div className="bg-blue-100 rounded-full p-3 mb-2">
                          <Flower className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Fields Irrigated</div>
                          <div className="text-2xl font-semibold">2/4</div>
                          <div className="text-xs text-gray-500">Last: 8 hours ago</div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
                        <div className="bg-blue-100 rounded-full p-3 mb-2">
                          <Signal className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">System Pressure</div>
                          <div className="text-2xl font-semibold">4.8 bar</div>
                          <div className="text-xs text-green-600">Normal</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg mb-6">
                      <div className="bg-gray-50 p-3 rounded-t-lg border-b">
                        <h3 className="font-medium">Irrigation Zones Status</h3>
                      </div>
                      <div className="p-3">
                        <table className="w-full">
                          <thead>
                            <tr className="text-sm text-gray-600 border-b">
                              <th className="pb-2 text-left">Zone</th>
                              <th className="pb-2 text-left">Status</th>
                              <th className="pb-2 text-left">Last Watered</th>
                              <th className="pb-2 text-left">Soil Moisture</th>
                              <th className="pb-2 text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            <tr className="text-sm">
                              <td className="py-3">North Field</td>
                              <td>
                                <Badge className="bg-green-500">Active</Badge>
                              </td>
                              <td>Now</td>
                              <td>42%</td>
                              <td>
                                <Button variant="outline" size="sm">Stop</Button>
                              </td>
                            </tr>
                            <tr className="text-sm">
                              <td className="py-3">East Field</td>
                              <td>
                                <Badge variant="outline" className="text-amber-600 border-amber-600">Scheduled</Badge>
                              </td>
                              <td>12 hours ago</td>
                              <td>39%</td>
                              <td>
                                <Button variant="outline" size="sm">Start</Button>
                              </td>
                            </tr>
                            <tr className="text-sm">
                              <td className="py-3">South Field</td>
                              <td>
                                <Badge variant="outline" className="text-gray-600 border-gray-600">Idle</Badge>
                              </td>
                              <td>1 day ago</td>
                              <td>44%</td>
                              <td>
                                <Button variant="outline" size="sm">Start</Button>
                              </td>
                            </tr>
                            <tr className="text-sm">
                              <td className="py-3">West Field</td>
                              <td>
                                <Badge className="bg-green-500">Active</Badge>
                              </td>
                              <td>Now</td>
                              <td>68%</td>
                              <td>
                                <Button variant="outline" size="sm">Stop</Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <h3 className="font-medium mb-3">Weekly Water Usage</h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { day: 'Mon', usage: 1200 },
                          { day: 'Tue', usage: 1800 },
                          { day: 'Wed', usage: 1600 },
                          { day: 'Thu', usage: 1400 },
                          { day: 'Fri', usage: 2100 },
                          { day: 'Sat', usage: 1700 },
                          { day: 'Sun', usage: 1300 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="usage" stroke="#3b82f6" name="Water (L)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Water Sources</CardTitle>
                    <CardDescription>Storage capacity and levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between mb-1">
                          <h4 className="text-sm font-medium">Main Reservoir</h4>
                          <span className="text-sm text-gray-600">75%</span>
                        </div>
                        <Progress value={75} className="h-3" />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>18,750 L remaining</span>
                          <span>25,000 L capacity</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <h4 className="text-sm font-medium">Secondary Tank</h4>
                          <span className="text-sm text-gray-600">43%</span>
                        </div>
                        <Progress value={43} className="h-3" />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>4,300 L remaining</span>
                          <span>10,000 L capacity</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <h4 className="text-sm font-medium">Rainwater Collection</h4>
                          <span className="text-sm text-gray-600">92%</span>
                        </div>
                        <Progress value={92} className="h-3" />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>5,520 L remaining</span>
                          <span>6,000 L capacity</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Water Quality</CardTitle>
                    <CardDescription>Latest measurements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-600">pH Level</div>
                          <div className="font-medium text-lg">7.2</div>
                        </div>
                        <Badge className="bg-green-500">Normal</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-600">Electrical Conductivity</div>
                          <div className="font-medium text-lg">0.7 mS/cm</div>
                        </div>
                        <Badge className="bg-green-500">Normal</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-600">Dissolved Oxygen</div>
                          <div className="font-medium text-lg">8.3 mg/L</div>
                        </div>
                        <Badge className="bg-green-500">Normal</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-600">Turbidity</div>
                          <div className="font-medium text-lg">12 NTU</div>
                        </div>
                        <Badge className="bg-amber-500">Moderate</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleSensorCalibration('water')}>
                      Calibrate Water Sensors
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Irrigation Schedule</CardTitle>
                    <CardDescription>Upcoming watering events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="font-medium">East Field</p>
                        <p className="text-sm text-gray-600">Today, 6:00 PM</p>
                        <div className="flex justify-between text-xs mt-2">
                          <span>Duration: 45 min</span>
                          <span>Est. usage: 800 L</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="font-medium">South Field</p>
                        <p className="text-sm text-gray-600">Tomorrow, 5:30 AM</p>
                        <div className="flex justify-between text-xs mt-2">
                          <span>Duration: 60 min</span>
                          <span>Est. usage: 1,200 L</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-foliage hover:bg-foliage-dark">
                        Configure Schedule
                      </Button>
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
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Machinery Fleet</CardTitle>
                      <CardDescription>Status and location of all equipment</CardDescription>
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="idle">Idle</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {machinesData.map(machine => (
                        <div key={machine.id} className="border rounded-lg p-4">
                          <div className="flex flex-wrap gap-4 justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-100 p-3 rounded-lg">
                                {machine.id.startsWith('TRA') && <Fuel className="h-6 w-6 text-foliage" />}
                                {machine.id.startsWith('HAR') && <Crop className="h-6 w-6 text-foliage" />}
                                {machine.id.startsWith('SPR') && <Satellite className="h-6 w-6 text-foliage" />}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{machine.name}</h3>
                                <p className="text-gray-600">ID: {machine.id}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge className={`${
                                machine.status === 'active' ? 'bg-green-500' : 
                                machine.status === 'maintenance' ? 'bg-amber-500' : 
                                'bg-gray-500'
                              }`}>
                                {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">
                                Location: {machine.location}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                              <span className="text-xs text-gray-500">Fuel Level</span>
                              <span className="font-medium">{machine.fuel}%</span>
                              <Progress 
                                value={machine.fuel} 
                                className="h-1 mt-2" 
                                style={{
                                  '--tw-progress-bar-background-color': 
                                    machine.fuel > 70 ? 'rgb(34 197 94)' : 
                                    machine.fuel > 30 ? 'rgb(234 179 8)' : 
                                    'rgb(239 68 68)'
                                } as React.CSSProperties}
                              />
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                              <span className="text-xs text-gray-500">Health Status</span>
                              <span className="font-medium">{machine.health}%</span>
                              <Progress 
                                value={machine.health} 
                                className="h-1 mt-2"
                                style={{
                                  '--tw-progress-bar-background-color': 
                                    machine.health > 80 ? 'rgb(34 197 94)' : 
                                    machine.health > 50 ? 'rgb(234 179 8)' : 
                                    'rgb(239 68 68)'
                                } as React.CSSProperties}
                              />
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                              <span className="text-xs text-gray-500">Next Maintenance</span>
                              <span className="font-medium">{machine.nextMaintenance}</span>
                              <p className="text-xs text-gray-600 mt-1">
                                {Math.ceil((new Date(machine.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days remaining
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View All Equipment</Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Maintenance Schedule</CardTitle>
                    <CardDescription>Upcoming service requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex justify-between">
                          <p className="font-medium">Case IH Harvester</p>
                          <Badge className="bg-amber-500">Urgent</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Oil Change & Filter Replacement</p>
                        <p className="text-xs text-amber-600 mt-1">Due in 10 days</p>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium">John Deere 8R Tractor</p>
                        <p className="text-sm text-gray-600">Routine Inspection</p>
                        <p className="text-xs text-gray-600 mt-1">Due in 55 days</p>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium">Sprayer Drone</p>
                        <p className="text-sm text-gray-600">Propeller Calibration</p>
                        <p className="text-xs text-gray-600 mt-1">Due in 92 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Fuel Consumption</CardTitle>
                    <CardDescription>Monthly usage trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { month: 'Jan', diesel: 280, gasoline: 120 },
                          { month: 'Feb', diesel: 250, gasoline: 110 },
                          { month: 'Mar', diesel: 320, gasoline: 140 },
                          { month: 'Apr', diesel: 350, gasoline: 160 },
                          { month: 'May', diesel: 410, gasoline: 180 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="diesel" name="Diesel (L)" stroke="#1e40af" strokeWidth={2} />
                          <Line type="monotone" dataKey="gasoline" name="Gasoline (L)" stroke="#ea580c" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-sm mt-4">
                      <div>
                        <p className="text-gray-500">This Month</p>
                        <p className="font-medium">410 L diesel</p>
                        <p className="font-medium">180 L gasoline</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500">Estimated Cost</p>
                        <p className="font-medium">$850 diesel</p>
                        <p className="font-medium">$390 gasoline</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Equipment Utilization</CardTitle>
                    <CardDescription>Usage hours this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>John Deere 8R Tractor</span>
                          <span>78 hours</span>
                        </div>
                        <Progress value={78} max={100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Case IH Harvester</span>
                          <span>32 hours</span>
                        </div>
                        <Progress value={32} max={100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sprayer Drone</span>
                          <span>45 hours</span>
                        </div>
                        <Progress value={45} max={100} className="h-2" />
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        Target: 100 hours per machine
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
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Livestock Overview</CardTitle>
                      <CardDescription>Health and status of your animals</CardDescription>
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Animals</SelectItem>
                        <SelectItem value="cattle">Cattle</SelectItem>
                        <SelectItem value="poultry">Poultry</SelectItem>
                        <SelectItem value="pigs">Pigs</SelectItem>
                        <SelectItem value="bees">Bees</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg">Cattle</h3>
                          <div className="bg-green-100 p-2 rounded-full">
                            <Leaf className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-3xl font-bold">42</div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-600">Health:</span>
                            <span className="text-green-600">96%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg">Poultry</h3>
                          <div className="bg-amber-100 p-2 rounded-full">
                            <Leaf className="h-5 w-5 text-amber-600" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-3xl font-bold">350</div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-600">Health:</span>
                            <span className="text-amber-600">88%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg">Pigs</h3>
                          <div className="bg-red-100 p-2 rounded-full">
                            <Leaf className="h-5 w-5 text-red-600" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-3xl font-bold">28</div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-600">Health:</span>
                            <span className="text-red-600">75%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg">Bees</h3>
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Leaf className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-3xl font-bold">15</div>
                          <div className="text-sm text-gray-600 mt-1">hives</div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-600">Activity:</span>
                            <span className="text-blue-600">High</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg mb-6">
                      <div className="bg-gray-50 p-3 rounded-t-lg border-b">
                        <h3 className="font-medium">Cattle Monitoring</h3>
                      </div>
                      <div className="p-3">
                        <table className="w-full">
                          <thead>
                            <tr className="text-sm text-gray-600 border-b">
                              <th className="pb-2 text-left">ID</th>
                              <th className="pb-2 text-left">Status</th>
                              <th className="pb-2 text-left">Location</th>
                              <th className="pb-2 text-left">Last Check</th>
                              <th className="pb-2 text-left">Health</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {[
                              { id: 'C-101', status: 'Grazing', location: 'North Pasture', lastCheck: '2 hours ago', health: 'Good' },
                              { id: 'C-102', status: 'Resting', location: 'East Pasture', lastCheck: '3 hours ago', health: 'Good' },
                              { id: 'C-103', status: 'Grazing', location: 'North Pasture', lastCheck: '2 hours ago', health: 'Attention' },
                              { id: 'C-104', status: 'Moving', location: 'West Pasture', lastCheck: '1 hour ago', health: 'Good' },
                            ].map(animal => (
                              <tr key={animal.id} className="text-sm">
                                <td className="py-3">{animal.id}</td>
                                <td>{animal.status}</td>
                                <td>{animal.location}</td>
                                <td>{animal.lastCheck}</td>
                                <td>
                                  <Badge className={animal.health === 'Good' ? 'bg-green-500' : 'bg-amber-500'}>
                                    {animal.health}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-3">Daily Activity</h3>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                              { time: '00:00', activity: 30 },
                              { time: '03:00', activity: 20 },
                              { time: '06:00', activity: 25 },
                              { time: '09:00', activity: 65 },
                              { time: '12:00', activity: 70 },
                              { time: '15:00', activity: 60 },
                              { time: '18:00', activity: 45 },
                              { time: '21:00', activity: 35 },
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="activity" name="Activity Level" stroke="#16a34a" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Feed Consumption</h3>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                              { day: 'Mon', consumption: 350 },
                              { day: 'Tue', consumption: 320 },
                              { day: 'Wed', consumption: 340 },
                              { day: 'Thu', consumption: 360 },
                              { day: 'Fri', consumption: 330 },
                              { day: 'Sat', consumption: 310 },
                              { day: 'Sun', consumption: 345 },
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="consumption" name="Feed (kg)" stroke="#ca8a04" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Health Alerts</CardTitle>
                    <CardDescription>Animal wellness concerns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Pig #P-203</h4>
                            <p className="text-sm text-gray-600">Reduced movement detected</p>
                          </div>
                          <Badge className="bg-red-500">High</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Detected 3 hours ago</p>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline">Schedule Vet</Button>
                          <Button size="sm" onClick={() => handleAlertAction(1)}>Acknowledge</Button>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Cow #C-103</h4>
                            <p className="text-sm text-gray-600">Irregular feeding pattern</p>
                          </div>
                          <Badge className="bg-amber-500">Medium</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Detected 5 hours ago</p>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline">Monitor</Button>
                          <Button size="sm" onClick={() => handleAlertAction(2)}>Acknowledge</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Production Metrics</CardTitle>
                    <CardDescription>Yield and output tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-sm mb-3">Milk Production</h4>
                        <div className="flex items-end gap-2">
                          <div className="text-3xl font-bold">287</div>
                          <div className="text-gray-600 mb-1">liters/day</div>
                        </div>
                        <div className="text-xs text-green-600 flex items-center gap-1">
                          <span>+5.2% vs last week</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-3">Egg Collection</h4>
                        <div className="flex items-end gap-2">
                          <div className="text-3xl font-bold">248</div>
                          <div className="text-gray-600 mb-1">eggs/day</div>
                        </div>
                        <div className="text-xs text-amber-600 flex items-center gap-1">
                          <span>-2.1% vs last week</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-3">Honey Production</h4>
                        <div className="flex items-end gap-2">
                          <div className="text-3xl font-bold">42</div>
                          <div className="text-gray-600 mb-1">kg this month</div>
                        </div>
                        <div className="text-xs text-green-600 flex items-center gap-1">
                          <span>On target for season</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Tasks</CardTitle>
                    <CardDescription>Scheduled animal care activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">Cattle Vaccination</p>
                        <p className="text-sm text-gray-600">15 animals</p>
                        <p className="text-xs text-gray-500 mt-1">Tomorrow, 9:00 AM</p>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">Poultry Health Check</p>
                        <p className="text-sm text-gray-600">All birds</p>
                        <p className="text-xs text-gray-500 mt-1">Apr 24, 10:30 AM</p>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">Hive Inspection</p>
                        <p className="text-sm text-gray-600">Bee colonies</p>
                        <p className="text-xs text-gray-500 mt-1">Apr 25, 2:00 PM</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View All Tasks</Button>
                  </CardFooter>
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
