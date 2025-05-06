
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Package, Truck, Clock, CheckCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Sample order data
const sampleOrders = [
  {
    id: "ORD-1234",
    date: "2025-05-04",
    total: 1245,
    status: "delivered",
    items: [
      { name: "High-Yield Rice Seedling", quantity: 2, price: 199 },
      { name: "Organic Insect Spray", quantity: 1, price: 159 },
      { name: "Premium Hybrid Tomato Seeds", quantity: 3, price: 89 }
    ]
  },
  {
    id: "ORD-1235",
    date: "2025-05-01",
    total: 678,
    status: "processing",
    items: [
      { name: "Disease-Resistant Wheat", quantity: 1, price: 249 },
      { name: "Slow-Release Granular Fertilizer", quantity: 1, price: 399 }
    ]
  },
  {
    id: "ORD-1236",
    date: "2025-04-28",
    total: 349,
    status: "shipped",
    items: [
      { name: "Fast-Growing Vegetable Set", quantity: 1, price: 349 }
    ]
  },
  {
    id: "ORD-1237",
    date: "2025-04-20",
    total: 867,
    status: "delivered",
    items: [
      { name: "Liquid Seaweed Fertilizer", quantity: 2, price: 179 },
      { name: "Herb Garden Seed Kit", quantity: 4, price: 129 }
    ]
  }
];

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter orders based on search and active tab
  const filteredOrders = sampleOrders.filter(order => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Tab filter
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="mr-1 h-3 w-3" /> Processing
        </Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Truck className="mr-1 h-3 w-3" /> Shipped
        </Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" /> Delivered
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <WeatherWidget />
      
      <main className="container mx-auto px-4 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-soil-dark mb-2">Your Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search orders..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {filteredOrders.length === 0 ? (
            <Card className="text-center p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col items-center gap-4">
                <Package className="h-16 w-16 text-gray-400" />
                <CardTitle>No orders found</CardTitle>
                <p className="text-gray-500">
                  {searchQuery ? "Try a different search term." : "You haven't placed any orders yet."}
                </p>
                {!searchQuery && (
                  <Button onClick={() => window.location.href = '/market'}>
                    Start Shopping
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {filteredOrders.map((order, index) => (
                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          Order #{order.id}
                        </CardTitle>
                        <CardDescription>
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(order.status)}
                        <span className="font-semibold">₹{order.total}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center text-sm">
                          <span className="flex-1">{item.name} × {item.quantity}</span>
                          <span className="text-gray-600">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="pt-4 flex justify-between">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="ghost" size="sm">Track Order</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Orders;
