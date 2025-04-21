
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { 
  Thermometer, 
  Droplet, 
  Wind, 
  CloudRain, 
  CloudSun, 
  Gauge, 
  FlowMeter, 
  Database,
  Tractor, 
  Battery, 
  Wifi, 
  BellElectric,
  Bell,
  TreeDeciduous,
  Leaf,
  Wheat,
  Fish,
  Cow,
  Chicken,
  Pig,
  Bee,
  MapPin
} from "lucide-react";

// Mock data for sensors
const soilMoistureData = [
  { time: '06:00', value: 42 },
  { time: '09:00', value: 38 },
  { time: '12:00', value: 35 },
  { time: '15:00', value: 32 },
  { time: '18:00', value: 40 },
];

const temperatureData = [
  { time: '06:00', value: 18 },
  { time: '09:00', value: 22 },
  { time: '12:00', value: 27 },
  { time: '15:00', value: 28 },
  { time: '18:00', value: 25 },
];

const rainfallData = [
  { time: '06:00', value: 0 },
  { time: '09:00', value: 0.2 },
  { time: '12:00', value: 1.5 },
  { time: '15:00', value: 0.8 },
  { time: '18:00', value: 0 },
];

const fieldData = [
  { 
    id: 1, 
    name: "North Field", 
    area: "12.5 acres", 
    crop: "Wheat",
    soilMoisture: 38,
    soilTemp: 22,
    soilPH: 6.8,
    lastIrrigated: "2025-04-19",
    nextIrrigation: "2025-04-24",
    alerts: 1
  },
  { 
    id: 2, 
    name: "South Field", 
    area: "8.3 acres", 
    crop: "Corn",
    soilMoisture: 42,
    soilTemp: 23,
    soilPH: 7.2,
    lastIrrigated: "2025-04-20",
    nextIrrigation: "2025-04-25",
    alerts: 0
  },
  { 
    id: 3, 
    name: "East Field", 
    area: "15.7 acres", 
    crop: "Soybeans",
    soilMoisture: 35,
    soilTemp: 21,
    soilPH: 6.5,
    lastIrrigated: "2025-04-18",
    nextIrrigation: "2025-04-23",
    alerts: 2
  },
  { 
    id: 4, 
    name: "West Field", 
    area: "10.2 acres", 
    crop: "Cotton",
    soilMoisture: 40,
    soilTemp: 24,
    soilPH: 7.0,
    lastIrrigated: "2025-04-21",
    nextIrrigation: "2025-04-26",
    alerts: 0
  }
];

const livestockData = [
  {
    type: "Dairy Cattle",
    count: 120,
    location: "Main Barn",
    status: "Healthy",
    alerts: 0
  },
  {
    type: "Poultry",
    count: 2500,
    location: "Poultry House A",
    status: "Routine Checkup Required",
    alerts: 1
  },
  {
    type: "Beehives",
    count: 25,
    location: "Orchard Edge",
    status: "Active",
    alerts: 0
  },
  {
    type: "Pigs",
    count: 75,
    location: "East Barn",
    status: "Healthy",
    alerts: 0
  }
];

const sensorAlerts = [
  {
    id: 1,
    device: "Soil Moisture Sensor #12",
    location: "East Field",
    alert: "Low Moisture Level",
    timestamp: "2025-04-21 09:23:15",
    severity: "high"
  },
  {
    id: 2,
    device: "Temperature Sensor #5",
    location: "Greenhouse 2",
    alert: "High Temperature",
    timestamp: "2025-04-21 10:15:42",
    severity: "medium"
  },
  {
    id: 3,
    device: "Water Flow Meter #3",
    location: "Irrigation Line C",
    alert: "Low Flow Rate",
    timestamp: "2025-04-21 08:47:33",
    severity: "high"
  },
  {
    id: 4,
    device: "pH Sensor #8",
    location: "North Field",
    alert: "pH Level Below Threshold",
    timestamp: "2025-04-21 07:12:05",
    severity: "medium"
  }
];

const deviceStatus = [
  {
    category: "Soil Sensors",
    online: 42,
    offline: 3,
    maintenance: 1,
    total: 46
  },
  {
    category: "Weather Sensors",
    online: 18,
    offline: 1,
    maintenance: 0,
    total: 19
  },
  {
    category: "Crop Sensors",
    online: 23,
    offline: 2,
    maintenance: 3,
    total: 28
  },
  {
    category: "Water Sensors",
    online: 15,
    offline: 0,
    maintenance: 1,
    total: 16
  },
  {
    category: "Machinery Sensors",
    online: 28,
    offline: 4,
    maintenance: 2,
    total: 34
  },
  {
    category: "Livestock Sensors",
    online: 32,
    offline: 2,
    maintenance: 0,
    total: 34
  }
];

const laborAssignments = [
  {
    id: 1,
    team: "Irrigation Crew",
    members: 4,
    assignment: "South Field Irrigation Maintenance",
    startDate: "2025-04-22",
    endDate: "2025-04-23",
    status: "Scheduled"
  },
  {
    id: 2,
    team: "Harvest Team A",
    members: 8,
    assignment: "East Field Corn Harvest",
    startDate: "2025-04-28",
    endDate: "2025-05-02",
    status: "Scheduled"
  },
  {
    id: 3,
    team: "Livestock Handlers",
    members: 3,
    assignment: "Poultry House Maintenance",
    startDate: "2025-04-21",
    endDate: "2025-04-21",
    status: "In Progress"
  }
];

// Sensor config for charts
const sensorConfig = {
  moisture: { 
    label: "Soil Moisture", 
    theme: { light: "#3B82F6", dark: "#60A5FA" }
  },
  temperature: { 
    label: "Temperature", 
    theme: { light: "#EF4444", dark: "#F87171" }
  },
  rainfall: { 
    label: "Rainfall", 
    theme: { light: "#10B981", dark: "#34D399" }
  }
};

const Monitoring = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const handleCalibrate = (device: string) => {
    toast({
      title: "Calibration Started",
      description: `Calibrating ${device}. This may take a few minutes.`,
    });
  };
  
  const handleAcknowledge = (alertId: number) => {
    toast({
      title: "Alert Acknowledged",
      description: `Alert #${alertId} has been acknowledged and is being addressed.`,
    });
  };
  
  const handleAssignTeam = () => {
    toast({
      title: "Team Assignment",
      description: "Please select a team from the Labor management section to assign to this task.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Farm Monitoring Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search sensors, fields or alerts..."
                className="w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className="flex items-center space-x-1 bg-foliage text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-foliage-dark transition-colors"
              onClick={() => {
                toast({
                  title: "Dashboard Refreshed",
                  description: "All sensor data has been updated to the latest readings.",
                });
              }}
            >
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Alert className="border-yellow-400 bg-yellow-50">
            <BellElectric className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Active Alerts: {sensorAlerts.length}</AlertTitle>
            <AlertDescription className="text-yellow-700">
              There are {sensorAlerts.filter(a => a.severity === "high").length} high-priority alerts that need immediate attention.
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7 lg:grid-cols-7 h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="soil">Soil Sensors</TabsTrigger>
            <TabsTrigger value="weather">Weather Sensors</TabsTrigger>
            <TabsTrigger value="irrigation">Irrigation & Water</TabsTrigger>
            <TabsTrigger value="crop">Crop & Fields</TabsTrigger>
            <TabsTrigger value="machinery">Machinery</TabsTrigger>
            <TabsTrigger value="livestock">Livestock</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Devices Online</CardTitle>
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {deviceStatus.reduce((acc, curr) => acc + curr.online, 0)} / 
                    {deviceStatus.reduce((acc, curr) => acc + curr.total, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {deviceStatus.reduce((acc, curr) => acc + curr.offline, 0)} devices offline
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Fields</CardTitle>
                  <TreeDeciduous className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{fieldData.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {fieldData.reduce((acc, curr) => acc + (curr.alerts > 0 ? 1 : 0), 0)} with alerts
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Weather</CardTitle>
                  <CloudSun className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24°C</div>
                  <p className="text-xs text-muted-foreground">
                    40% chance of rain
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Labor Teams</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{laborAssignments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {laborAssignments.filter(la => la.status === "In Progress").length} active assignments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Soil Moisture Trend</CardTitle>
                  <CardDescription>Last 12 hours across all fields</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={sensorConfig} className="w-full aspect-[4/3]">
                    <LineChart data={soilMoistureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Legend />
                      <Line
                        name="moisture"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Temperature & Rainfall</CardTitle>
                  <CardDescription>Last 12 hours of environmental data</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={sensorConfig} className="w-full aspect-[4/3]">
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="temp" />
                      <YAxis yAxisId="rain" orientation="right" />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Legend />
                      <Line
                        name="temperature"
                        dataKey="value"
                        stroke="#EF4444"
                        yAxisId="temp"
                        strokeWidth={2}
                      />
                      {rainfallData.map((entry, index) => (
                        <Line
                          name="rainfall"
                          key={index}
                          dataKey="value"
                          data={[rainfallData[index]]}
                          stroke="#10B981"
                          yAxisId="rain"
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Alert Section */}
            <Card>
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>Critical alerts that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sensorAlerts.map(alert => (
                    <div key={alert.id} className={`p-4 border rounded-lg ${
                      alert.severity === 'high' ? 'border-red-200 bg-red-50' : 
                      alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' : 
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{alert.device}</h4>
                          <p className="text-sm text-gray-600">{alert.alert}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{alert.location}</span>
                            <span className="mx-2">•</span>
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                        <button
                          className="text-sm font-medium text-foliage hover:text-foliage-dark"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Soil Sensors Tab Content */}
          <TabsContent value="soil" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Soil Moisture</CardTitle>
                  <CardDescription>Volumetric water content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fieldData.map(field => (
                    <div key={field.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{field.name}</h4>
                        <p className="text-sm text-gray-500">{field.crop}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Droplet className={`h-4 w-4 ${
                          field.soilMoisture < 35 ? 'text-red-500' : 
                          field.soilMoisture > 45 ? 'text-blue-500' : 
                          'text-green-500'
                        }`} />
                        <span className="font-medium">{field.soilMoisture}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full text-center text-sm text-foliage hover:text-foliage-dark" 
                    onClick={() => handleCalibrate("Moisture Sensors")}
                  >
                    Calibrate All Sensors
                  </button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Soil Temperature</CardTitle>
                  <CardDescription>Field temperature readings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fieldData.map(field => (
                    <div key={field.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{field.name}</h4>
                        <p className="text-sm text-gray-500">{field.crop}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Thermometer className={`h-4 w-4 ${
                          field.soilTemp < 18 ? 'text-blue-500' : 
                          field.soilTemp > 26 ? 'text-red-500' : 
                          'text-green-500'
                        }`} />
                        <span className="font-medium">{field.soilTemp}°C</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full text-center text-sm text-foliage hover:text-foliage-dark"
                    onClick={() => handleCalibrate("Temperature Sensors")}
                  >
                    Calibrate All Sensors
                  </button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Soil pH</CardTitle>
                  <CardDescription>Acidity/alkalinity readings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fieldData.map(field => (
                    <div key={field.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{field.name}</h4>
                        <p className="text-sm text-gray-500">{field.crop}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${
                          field.soilPH < 6.0 ? 'bg-red-500' : 
                          field.soilPH > 7.5 ? 'bg-purple-500' : 
                          'bg-green-500'
                        }`} />
                        <span className="font-medium">{field.soilPH}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full text-center text-sm text-foliage hover:text-foliage-dark"
                    onClick={() => handleCalibrate("pH Sensors")}
                  >
                    Calibrate All Sensors
                  </button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Soil Nutrients Overview</CardTitle>
                <CardDescription>NPK values across all fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-2">Nitrogen (N)</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {fieldData.map(field => (
                        <div key={field.id} className="border rounded p-3">
                          <h4 className="font-medium">{field.name}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">Nitrate</span>
                            <span className="font-medium">38 ppm</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Phosphorus (P)</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {fieldData.map(field => (
                        <div key={field.id} className="border rounded p-3">
                          <h4 className="font-medium">{field.name}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">Phosphate</span>
                            <span className="font-medium">42 ppm</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Potassium (K)</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {fieldData.map(field => (
                        <div key={field.id} className="border rounded p-3">
                          <h4 className="font-medium">{field.name}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">K+ Level</span>
                            <span className="font-medium">185 ppm</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <button 
                  className="w-full text-center text-sm text-foliage hover:text-foliage-dark"
                  onClick={() => {
                    toast({
                      title: "Nutrient Report",
                      description: "Generating detailed nutrient report for all fields. This will be available in your reports section shortly.",
                    });
                  }}
                >
                  Generate Full Nutrient Report
                </button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Weather Tab Content */}
          <TabsContent value="weather" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Temperature</CardTitle>
                  <CardDescription>Current & forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-4">
                    <Thermometer className="h-6 w-6 text-red-500 mr-2" />
                    <span className="text-4xl font-bold">24°C</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {[
                      {time: "Now", temp: "24°"},
                      {time: "2PM", temp: "26°"},
                      {time: "4PM", temp: "25°"},
                      {time: "6PM", temp: "23°"},
                      {time: "8PM", temp: "20°"},
                    ].map(item => (
                      <div key={item.time} className="text-center">
                        <div className="text-xs text-gray-500">{item.time}</div>
                        <div className="font-medium">{item.temp}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Humidity</CardTitle>
                  <CardDescription>Relative humidity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-4">
                    <Droplet className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="text-4xl font-bold">65%</span>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">Moderate humidity levels</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Wind</CardTitle>
                  <CardDescription>Speed & direction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-4">
                    <Wind className="h-6 w-6 text-gray-500 mb-2" />
                    <span className="text-3xl font-bold">12 km/h</span>
                    <span className="text-sm text-gray-500">NE Direction</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Precipitation</CardTitle>
                  <CardDescription>Current & forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-4">
                    <CloudRain className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="text-4xl font-bold">40%</span>
                  </div>
                  <p className="text-center text-sm mt-2">0.5mm expected in next 24h</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Weather Forecast</CardTitle>
                <CardDescription>7-day forecast to help plan farm operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {[
                    {day: "Today", temp: "24°/18°", icon: <CloudSun />, precip: "40%"},
                    {day: "Wed", temp: "22°/17°", icon: <CloudRain />, precip: "60%"},
                    {day: "Thu", temp: "20°/15°", icon: <CloudRain />, precip: "75%"},
                    {day: "Fri", temp: "19°/14°", icon: <CloudRain />, precip: "80%"},
                    {day: "Sat", temp: "21°/15°", icon: <CloudSun />, precip: "30%"},
                    {day: "Sun", temp: "23°/16°", icon: <CloudSun />, precip: "10%"},
                    {day: "Mon", temp: "25°/17°", icon: <CloudSun />, precip: "5%"},
                  ].map(day => (
                    <div key={day.day} className="flex flex-col items-center border rounded-md p-3">
                      <span className="font-medium">{day.day}</span>
                      <div className="my-3 text-gray-600">{React.cloneElement(day.icon, { className: "h-6 w-6" })}</div>
                      <span className="text-sm">{day.temp}</span>
                      <span className="text-xs text-gray-500 mt-1">{day.precip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-gray-500">Data from WeatherAPI</span>
                <button 
                  className="text-sm text-foliage hover:text-foliage-dark"
                  onClick={() => {
                    toast({
                      title: "Weather Advisory",
                      description: "Based on the forecast, consider postponing irrigation scheduled for Thursday.",
                    });
                  }}
                >
                  Get Weather Advisory
                </button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Solar Radiation & Light</CardTitle>
                <CardDescription>PAR and UV intensity readings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium mb-4">PAR (Photosynthetically Active Radiation)</h3>
                    <ChartContainer config={sensorConfig} className="w-full aspect-[3/2]">
                      <LineChart data={[
                        {time: "6AM", value: 120},
                        {time: "8AM", value: 450},
                        {time: "10AM", value: 780},
                        {time: "12PM", value: 1050},
                        {time: "2PM", value: 980},
                        {time: "4PM", value: 740},
                        {time: "6PM", value: 320},
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#F59E0B" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ChartContainer>
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-500">measured in μmol/m²/s</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-4">UV Intensity</h3>
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-orange-500">6.8</div>
                        <div className="text-lg font-medium mt-2">High</div>
                        <div className="text-sm text-gray-500 mt-1">UV Index</div>
                        <div className="mt-4 text-sm">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Sun protection recommended
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Additional tabs with similar detailed content structure */}
          <TabsContent value="irrigation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Irrigation Status</CardTitle>
                  <CardDescription>Current system status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Main Pump</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Pressure</span>
                      <div className="flex items-center">
                        <Gauge className="h-4 w-4 mr-1 text-blue-500" />
                        <span>65 PSI</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Flow Rate</span>
                      <div className="flex items-center">
                        <FlowMeter className="h-4 w-4 mr-1 text-blue-500" />
                        <span>75 L/min</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Active Zones</span>
                      <span>2/8</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full text-center text-sm text-foliage hover:text-foliage-dark"
                    onClick={() => {
                      toast({
                        title: "Irrigation Control",
                        description: "Opening irrigation control panel...",
                      });
                    }}
                  >
                    Open Control Panel
                  </button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Water Reservoirs</CardTitle>
                  <CardDescription>Levels and quality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Main Reservoir</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: "85%"}}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">42,500 gallons</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Secondary Tank</span>
                        <span>62%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: "62%"}}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">12,400 gallons</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Rainwater Collection</span>
                        <span>34%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: "34%"}}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">3,400 gallons</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Water Quality</CardTitle>
                  <CardDescription>Latest readings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">pH Level</span>
                      <span className="font-medium">7.2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">EC (μS/cm)</span>
                      <span className="font-medium">450</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Dissolved Oxygen</span>
                      <span className="font-medium">8.4 mg/L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Turbidity</span>
                      <span className="font-medium">12 NTU</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full text-center text-sm text-foliage hover:text-foliage-dark"
                    onClick={() => handleCalibrate("Water Quality Sensors")}
                  >
                    Calibrate Sensors
                  </button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Irrigation Schedule</CardTitle>
                <CardDescription>Current and upcoming irrigation events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">South Field - Zone 2</h4>
                        <p className="text-sm text-gray-600">Currently active</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">65% Complete</p>
                        <p className="text-sm text-gray-500">Ends in 35 minutes</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: "65%"}}></div>
                    </div>
                  </div>
                  
                  {[
                    {field: "North Field", zone: "All Zones", time: "Today, 8:00 PM", duration: "45 minutes"},
                    {field: "East Field", zone: "Zones 1-3", time: "Tomorrow, 6:00 AM", duration: "60 minutes"},
                    {field: "West Field", zone: "All Zones", time: "Tomorrow, 7:30 PM", duration: "50 minutes"},
                  ].map((schedule, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{schedule.field} - {schedule.zone}</h4>
                          <p className="text-sm text-gray-600">{schedule.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Duration: {schedule.duration}</p>
                          <div className="flex items-center justify-end space-x-2 mt-1">
                            <button 
                              className="text-xs text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                toast({
                                  title: "Schedule Edited",
                                  description: "Opening schedule editor...",
                                });
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="text-xs text-red-600 hover:text-red-800"
                              onClick={() => {
                                toast({
                                  title: "Schedule Cancelled",
                                  description: `Irrigation for ${schedule.field} has been cancelled.`,
                                });
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <button 
                  className="w-full text-center text-sm text-foliage hover:text-foliage-dark"
                  onClick={() => {
                    toast({
                      title: "Schedule Management",
                      description: "Opening irrigation schedule management...",
                    });
                  }}
                >
                  Manage Full Schedule
                </button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="crop" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Field Overview</CardTitle>
                  <CardDescription>Status of active crop fields</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fieldData.map(field => (
                      <div key={field.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{field.name}</h4>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <TreeDeciduous className="h-4 w-4 mr-1" />
                              <span>{field.crop}</span>
                              <span className="mx-1">•</span>
                              <span>{field.area}</span>
                            </div>
                          </div>
                          <div>
                            {field.alerts > 0 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {field.alerts} {field.alerts === 1 ? 'Alert' : 'Alerts'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 text-sm grid grid-cols-2 gap-2">
                          <div className="flex items-center">
                            <Droplet className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-gray-500 mr-1">Moisture:</span>
                            <span>{field.soilMoisture}%</span>
                          </div>
                          <div className="flex items-center">
                            <Thermometer className="h-3 w-3 text-red-500 mr-1" />
                            <span className="text-gray-500 mr-1">Temp:</span>
                            <span>{field.soilTemp}°C</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-purple-500 mr-1" />
                            <span className="text-gray-500 mr-1">pH:</span>
                            <span>{field.soilPH}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-1">Irrigated:</span>
                            <span>{field.lastIrrigated}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Crop Health Analysis</CardTitle>
                  <CardDescription>NDVI readings from aerial imagery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="aspect-[4/3] bg-slate-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">[Crop NDVI Visualization]</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {["Excellent", "Good", "Fair", "Poor"].map((health, idx) => (
                        <div key={idx} className="text-center">
                          <div className={`h-4 w-full rounded-sm ${
                            idx === 0 ? "bg-green-600" :
                            idx === 1 ? "bg-green-400" :
                            idx === 2 ? "bg-yellow-400" :
                            "bg-red-400"
                          }`} />
                          <div className="text-xs mt-1">{health}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Health Distribution</h3>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div className="flex">
                          <div className="bg-green-600 h-4" style={{width: "45%"}}></div>
                          <div className="bg-green-400 h-4" style={{width: "30%"}}></div>
                          <div className="bg-yellow-400 h-4" style={{width: "15%"}}></div>
                          <div className="bg-red-400 h-4" style={{width: "10%"}}></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>45% Excellent</span>
                        <span>30% Good</span>
                        <span>15% Fair</span>
                        <span>10% Poor</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full text-center text-sm text-foliage hover:text-foliage-dark"
                    onClick={() => {
                      toast({
                        title: "Drone Mission",
                        description: "Planning new drone mission for updated imagery...",
                      });
                    }}
                  >
                    Schedule New Drone Flight
                  </button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Growth Stage Monitoring</CardTitle>
                <CardDescription>Current crop development status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">North Field - Wheat</h3>
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-800">
                              Heading Stage
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-green-800">
                              65%
                            </span>
                          </div>
                        </div>
                        <div className="flex h-2 overflow-hidden text-xs bg-green-200 rounded-full">
                          <div style={{width: "65%"}} className="flex flex-col justify-center text-center text-white bg-green-600 shadow-none"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Planting</span>
                          <span>Vegetative</span>
                          <span>Heading</span>
                          <span>Ripening</span>
                          <span>Harvest</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-600">Estimated harvest: 35 days</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">South Field - Corn</h3>
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-yellow-200 text-yellow-800">
                              Tasseling Stage
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-yellow-800">
                              70%
                            </span>
                          </div>
                        </div>
                        <div className="flex h-2 overflow-hidden text-xs bg-yellow-200 rounded-full">
                          <div style={{width: "70%"}} className="flex flex-col justify-center text-center text-white bg-yellow-500 shadow-none"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Planting</span>
                          <span>V6</span>
                          <span>Tasseling</span>
                          <span>Silking</span>
                          <span>Harvest</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-600">Estimated harvest: 42 days</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">East Field - Soybeans</h3>
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                              Flowering Stage
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-800">
                              55%
                            </span>
                          </div>
                        </div>
                        <div className="flex h-2 overflow-hidden text-xs bg-blue-200 rounded-full">
                          <div style={{width: "55%"}} className="flex flex-col justify-center text-center text-white bg-blue-500 shadow-none"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Planting</span>
                          <span>Vegetative</span>
                          <span>Flowering</span>
                          <span>Pod Fill</span>
                          <span>Harvest</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-600">Estimated harvest: 55 days</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">West Field - Cotton</h3>
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-200 text-purple-800">
                              Flowering Stage
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-purple-800">
                              60%
                            </span>
                          </div>
                        </div>
                        <div className="flex h-2 overflow-hidden text-xs bg-purple-200 rounded-full">
                          <div style={{width: "60%"}} className="flex flex-col justify-center text-center text-white bg-purple-500 shadow-none"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Planting</span>
                          <span>Squaring</span>
                          <span>Flowering</span>
                          <span>Boll Dev</span>
                          <span>Harvest</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-600">Estimated harvest: 62 days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="machinery" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Status</CardTitle>
                  <CardDescription>Active machinery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tractor className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium">Main Tractor (JD 8370R)</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tractor className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="font-medium">Combine (JD S780)</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Maintenance
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tractor className="h-5 w-5 text-gray-600 mr-2" />
                        <span className="font-medium">Sprayer (JD R4060)</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Idle
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tractor className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium">Utility Tractor (JD 5100E)</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full text-center text-sm text-foliage hover:text-foliage-dark"
                    onClick={() => {
                      toast({
                        title: "Equipment Management",
                        description: "Opening equipment management system...",
                      });
                    }}
                  >
                    View All Equipment
                  </button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Main tractor status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Fuel Level</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: "65%"}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Engine Temperature</span>
                        <span>Normal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: "50%"}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Oil Pressure</span>
                        <span>Optimal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: "60%"}}></div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Engine Hours</span>
                        <span>1,245 hours</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Service Due</span>
                        <span className="text-yellow-600 font-medium">In 55 hours</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>GPS & Guidance</CardTitle>
                  <CardDescription>Main tractor positioning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-100 rounded-md mb-4 flex items-center justify-center">
                    <span className="text-gray-500">[Field Map with Tractor Position]</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Current Field</span>
                      <span>North Field</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">GPS Signal</span>
                      <div className="flex items-center">
                        <div className="flex space-x-1 mr-2">
                          <div className="w-1 h-3 bg-green-500 rounded-sm"></div>
                          <div className="w-1 h-4 bg-green-500 rounded-sm"></div>
                          <div className="w-1 h-5 bg-green-500 rounded-sm"></div>
                          <div className="w-1 h-6 bg-green-500 rounded-sm"></div>
                        </div>
                        <span className="text-sm">Strong</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Accuracy</span>
                      <span>±2cm RTK Fixed</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button 
                    className="w-full text-center text-sm text-foliage hover:text-foliage-dark"
                    onClick={() => {
                      toast({
                        title: "GPS Guidance",
                        description: "Opening GPS mapping and guidance system...",
                      });
                    }}
                  >
                    Open Guidance System
                  </button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
                <CardDescription>Upcoming maintenance for farm equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Combine (JD S780)</h4>
                        <p className="text-sm text-red-600 font-medium">Service Overdue</p>
                      </div>
                      <div>
                        <button 
                          className="px-3 py-1 bg-foliage text-white text-sm rounded-md hover:bg-foliage-dark transition-colors"
                          onClick={() => handleAssignTeam()}
                        >
                          Assign Team
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">Engine oil change, filter replacement, and belt inspection required</p>
                    </div>
                  </div>
                  
                  {[
                    {equipment: "Utility Tractor (JD 5100E)", service: "Regular maintenance", due: "5 days", hours: "25 hours", priority: "medium"},
                    {equipment: "Main Tractor (JD 8370R)", service: "Hydraulic system check", due: "12 days", hours: "55 hours", priority: "low"},
                    {equipment: "Sprayer (JD R4060)", service: "Nozzle calibration", due: "18 days", hours: "120 hours", priority: "low"},
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`border rounded-lg p-4 ${
                        item.priority === 'medium' ? 'bg-yellow-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{item.equipment}</h4>
                          <p className="text-sm text-gray-600">{item.service}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Due in {item.due}</p>
                          <p className="text-sm text-gray-500">({item.hours})</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <button 
                  className="w-full text-center text-sm text-foliage hover:text-foliage-dark"
                  onClick={() => {
                    toast({
                      title: "Maintenance Schedule",
                      description: "Opening full maintenance schedule and history...",
                    });
                  }}
                >
                  View Complete Maintenance History
                </button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="livestock" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Cow className="h-5 w-5 mr-2" />
                    Dairy Cattle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">120</div>
                  <p className="text-sm text-gray-500">animals monitored</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Lactating:</span>
                      <span className="font-medium">85</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Dry:</span>
                      <span className="font-medium">25</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Calves:</span>
                      <span className="font-medium">10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Chicken className="h-5 w-5 mr-2" />
                    Poultry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2,500</div>
                  <p className="text-sm text-gray-500">birds monitored</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Layers:</span>
                      <span className="font-medium">1,800</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Broilers:</span>
                      <span className="font-medium">700</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Pig className="h-5 w-5 mr-2" />
                    Pigs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">75</div>
                  <p className="text-sm text-gray-500">animals monitored</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Sows:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Fattening:</span>
                      <span className="font-medium">55</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Piglets:</span>
                      <span className="font-medium">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Bee className="h-5 w-5 mr-2" />
                    Beehives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">25</div>
                  <p className="text-sm text-gray-500">active hives</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Location:</span>
                      <span className="font-medium">Orchard Edge</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Health:</span>
                      <span className="font-medium text-green-600">Good</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Livestock Health Monitor</CardTitle>
                <CardDescription>RFID tracking and health status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Poultry House A - Sector 2</h4>
                        <p className="text-sm text-yellow-600">Routine checkup required</p>
                      </div>
                      <div>
                        <button 
                          className="px-3 py-1 bg-foliage text-white text-sm rounded-md hover:bg-foliage-dark transition-colors"
                          onClick={() => handleAssignTeam()}
                        >
                          Schedule Visit
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Dairy Cattle - Activity Monitoring</h3>
                      <ChartContainer config={sensorConfig} className="w-full aspect-[3/2]">
                        <LineChart data={[
                          {time: "12 AM", value: 15},
                          {time: "4 AM", value: 10},
                          {time: "8 AM", value: 45},
                          {time: "12 PM", value: 38},
                          {time: "4 PM", value: 42},
                          {time: "8 PM", value: 28},
                          {time: "12 AM", value: 18},
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <ChartTooltip />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            name="Average Activity"
                          />
                        </LineChart>
                      </ChartContainer>
                      <div className="text-center mt-2">
                        <span className="text-xs text-gray-500">measured in movements/hour</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Feed Consumption Rate</h3>
                      <ChartContainer config={sensorConfig} className="w-full aspect-[3/2]">
                        <LineChart data={[
                          {time: "Mon", cattle: 245, poultry: 82, pigs: 175},
                          {time: "Tue", cattle: 255, poultry: 80, pigs: 190},
                          {time: "Wed", cattle: 260, poultry: 85, pigs: 180},
                          {time: "Thu", cattle: 250, poultry: 81, pigs: 185},
                          {time: "Fri", cattle: 245, poultry: 80, pigs: 175},
                          {time: "Sat", cattle: 240, poultry: 78, pigs: 170},
                          {time: "Sun", cattle: 235, poultry: 75, pigs: 165},
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <ChartTooltip />
                          <Line 
                            type="monotone" 
                            dataKey="cattle" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            name="Cattle Feed (kg)"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="poultry" 
                            stroke="#EF4444" 
                            strokeWidth={2}
                            name="Poultry Feed (kg)"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="pigs" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            name="Pig Feed (kg)"
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Animal Tracking</CardTitle>
                <CardDescription>GPS and RFID monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/9] bg-slate-100 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-gray-500">[GPS Tracking Map for Livestock]</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium mb-4">Cattle Location Heatmap</h3>
                    <div className="aspect-[4/3] bg-slate-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">[Heatmap Visualization]</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium mb-4">Recent Movements</h3>
                    <div className="space-y-3">
                      {[
                        {tag: "C-1245", animal: "Holstein #45", location: "Main Barn → North Pasture", time: "09:15 AM"},
                        {tag: "C-1382", animal: "Jersey #12", location: "Main Barn → Water Pond", time: "08:42 AM"},
                        {tag: "C-1195", animal: "Holstein #28", location: "North Pasture → Main Barn", time: "08:10 AM"},
                      ].map((item, idx) => (
                        <div key={idx} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{item.animal}</h4>
                              <p className="text-sm text-gray-500">{item.tag}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">{item.location}</p>
                              <p className="text-xs text-gray-500">{item.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <button 
                  className="w-full text-center text-sm text-foliage hover:text-foliage-dark"
                  onClick={() => {
                    toast({
                      title: "Livestock Management",
                      description: "Opening comprehensive livestock management system...",
                    });
                  }}
                >
                  Open Livestock Management System
                </button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Monitoring;
