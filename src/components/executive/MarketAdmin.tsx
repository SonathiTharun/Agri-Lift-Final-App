
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  ShoppingCart,
  Users,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  vendor: string;
  status: 'active' | 'inactive' | 'low_stock';
  sales: number;
}

interface Order {
  id: string;
  farmerName: string;
  products: string[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  orderDate: string;
}

const MarketAdmin = () => {
  const { toast } = useToast();
  
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Premium Wheat Seeds",
      category: "Seeds",
      price: 1200,
      stock: 150,
      vendor: "AgriSeeds Ltd",
      status: "active",
      sales: 85
    },
    {
      id: "2",
      name: "Organic Fertilizer",
      category: "Fertilizers",
      price: 800,
      stock: 25,
      vendor: "GreenGrow Co",
      status: "low_stock",
      sales: 120
    },
    {
      id: "3",
      name: "Pesticide Spray",
      category: "Pesticides",
      price: 450,
      stock: 0,
      vendor: "CropProtect Inc",
      status: "inactive",
      sales: 45
    }
  ]);

  const [orders] = useState<Order[]>([
    {
      id: "1",
      farmerName: "Rajesh Kumar",
      products: ["Premium Wheat Seeds", "Organic Fertilizer"],
      total: 2000,
      status: "pending",
      orderDate: "2024-05-20"
    },
    {
      id: "2",
      farmerName: "Priya Sharma",
      products: ["Pesticide Spray"],
      total: 450,
      status: "shipped",
      orderDate: "2024-05-18"
    }
  ]);

  const handleProductAction = (productId: string, action: string) => {
    toast({
      title: `Product ${action}`,
      description: `Product ${productId} has been ${action}d successfully.`,
    });
  };

  const handleOrderAction = (orderId: string, action: string) => {
    toast({
      title: `Order ${action}`,
      description: `Order ${orderId} status updated to ${action}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      inactive: "destructive",
      low_stock: "secondary",
      pending: "secondary",
      processing: "default",
      shipped: "default",
      delivered: "default"
    };
    
    return <Badge variant={variants[status]}>{status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Market Administration</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">2 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Product Management</TabsTrigger>
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
          <TabsTrigger value="analytics">Market Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{product.name}</h4>
                          {getStatusBadge(product.status)}
                        </div>
                        <p className="text-sm text-gray-600">Category: {product.category}</p>
                        <p className="text-sm text-gray-600">Price: ₹{product.price}</p>
                        <p className="text-sm text-gray-600">Stock: {product.stock} units</p>
                        <p className="text-sm text-gray-600">Vendor: {product.vendor}</p>
                        <p className="text-xs text-gray-500">Sales: {product.sales} units this month</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleProductAction(product.id, 'edit')}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleProductAction(product.id, 'delete')}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
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

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">Order #{order.id}</h4>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-600">Farmer: {order.farmerName}</p>
                        <p className="text-sm text-gray-600">Products: {order.products.join(", ")}</p>
                        <p className="text-sm text-gray-600">Total: ₹{order.total}</p>
                        <p className="text-xs text-gray-500">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => handleOrderAction(order.id, 'process')}
                        >
                          Process
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOrderAction(order.id, 'ship')}
                        >
                          Ship
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Vendor management interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Market Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Market analytics dashboard will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketAdmin;
