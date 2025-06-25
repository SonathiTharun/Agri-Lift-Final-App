import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Package, TrendingDown, Calculator, Truck, Calendar, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/LanguageContext";
import { GlassCard } from "./GlassCard";
import { toast } from 'sonner';

interface BulkProduct {
  id: string;
  name: string;
  image: string;
  basePrice: number;
  unit: string;
  minQuantity: number;
  maxQuantity: number;
  category: string;
  supplier: string;
  tiers: Array<{
    minQty: number;
    maxQty: number;
    discount: number;
    pricePerUnit: number;
  }>;
  features: string[];
  deliveryTime: string;
  inStock: number;
}

interface BulkOrder {
  productId: string;
  quantity: number;
  selectedTier: number;
  totalPrice: number;
}

const mockBulkProducts: BulkProduct[] = [
  {
    id: "bulk-1",
    name: "Organic NPK Fertilizer",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
    basePrice: 1200,
    unit: "50kg bag",
    minQuantity: 10,
    maxQuantity: 1000,
    category: "Fertilizers",
    supplier: "Green Valley Farms",
    tiers: [
      { minQty: 10, maxQty: 49, discount: 5, pricePerUnit: 1140 },
      { minQty: 50, maxQty: 99, discount: 10, pricePerUnit: 1080 },
      { minQty: 100, maxQty: 499, discount: 15, pricePerUnit: 1020 },
      { minQty: 500, maxQty: 1000, discount: 20, pricePerUnit: 960 }
    ],
    features: ["Organic certified", "Slow release", "All crop types"],
    deliveryTime: "5-7 days",
    inStock: 2500
  },
  {
    id: "bulk-2",
    name: "Hybrid Tomato Seeds",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=300&h=300&fit=crop",
    basePrice: 800,
    unit: "1kg pack",
    minQuantity: 5,
    maxQuantity: 500,
    category: "Seeds",
    supplier: "Seed Masters",
    tiers: [
      { minQty: 5, maxQty: 19, discount: 8, pricePerUnit: 736 },
      { minQty: 20, maxQty: 49, discount: 12, pricePerUnit: 704 },
      { minQty: 50, maxQty: 99, discount: 18, pricePerUnit: 656 },
      { minQty: 100, maxQty: 500, discount: 25, pricePerUnit: 600 }
    ],
    features: ["Disease resistant", "High yield", "90% germination"],
    deliveryTime: "3-5 days",
    inStock: 800
  },
  {
    id: "bulk-3",
    name: "Drip Irrigation Pipes",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop",
    basePrice: 45,
    unit: "meter",
    minQuantity: 100,
    maxQuantity: 10000,
    category: "Irrigation",
    supplier: "AgriTech Solutions",
    tiers: [
      { minQty: 100, maxQty: 499, discount: 10, pricePerUnit: 40.5 },
      { minQty: 500, maxQty: 999, discount: 15, pricePerUnit: 38.25 },
      { minQty: 1000, maxQty: 4999, discount: 20, pricePerUnit: 36 },
      { minQty: 5000, maxQty: 10000, discount: 25, pricePerUnit: 33.75 }
    ],
    features: ["UV resistant", "Pressure tested", "10-year warranty"],
    deliveryTime: "7-10 days",
    inStock: 50000
  }
];

export const BulkOrderingSystem = () => {
  const { t } = useLanguage();
  const [products] = useState(mockBulkProducts);
  const [orders, setOrders] = useState<Record<string, BulkOrder>>({});
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const calculatePricing = (product: BulkProduct, quantity: number) => {
    const tier = product.tiers.find(t => quantity >= t.minQty && quantity <= t.maxQty);
    if (!tier) return null;

    const totalPrice = quantity * tier.pricePerUnit;
    const savings = quantity * (product.basePrice - tier.pricePerUnit);
    
    return {
      tier,
      totalPrice,
      savings,
      pricePerUnit: tier.pricePerUnit
    };
  };

  const handleQuantityChange = (productId: string, value: string) => {
    setQuantities(prev => ({ ...prev, [productId]: value }));
    
    const quantity = parseInt(value);
    const product = products.find(p => p.id === productId);
    
    if (product && quantity >= product.minQuantity) {
      const pricing = calculatePricing(product, quantity);
      if (pricing) {
        setOrders(prev => ({
          ...prev,
          [productId]: {
            productId,
            quantity,
            selectedTier: product.tiers.indexOf(pricing.tier),
            totalPrice: pricing.totalPrice
          }
        }));
      }
    } else {
      setOrders(prev => {
        const newOrders = { ...prev };
        delete newOrders[productId];
        return newOrders;
      });
    }
  };

  const addToCart = (productId: string) => {
    const order = orders[productId];
    if (order) {
      toast.success(`Added ${order.quantity} units to bulk cart`);
    }
  };

  const getTotalOrderValue = () => {
    return Object.values(orders).reduce((total, order) => total + order.totalPrice, 0);
  };

  const BulkProductCard = ({ product, index }: { product: BulkProduct; index: number }) => {
    const quantity = parseInt(quantities[product.id] || '0');
    const pricing = quantity >= product.minQuantity ? calculatePricing(product, quantity) : null;
    const order = orders[product.id];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <GlassCard className="overflow-hidden">
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Package className="w-3 h-3 mr-1" />
                Bulk Available
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Up to {Math.max(...product.tiers.map(t => t.discount))}% OFF
              </Badge>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{product.name}</h3>
              <Badge variant="outline" className="border-white/20 text-gray-300 text-xs">
                {product.category}
              </Badge>
            </div>

            <div className="text-sm text-gray-300 mb-4">
              <div>Supplier: {product.supplier}</div>
              <div>Unit: {product.unit}</div>
              <div>Min Order: {product.minQuantity} units</div>
              <div className="flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Delivery: {product.deliveryTime}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.features.map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs border-white/20 text-gray-400">
                  {feature}
                </Badge>
              ))}
            </div>

            {/* Pricing Tiers */}
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Bulk Pricing Tiers
              </h4>
              <div className="space-y-2">
                {product.tiers.map((tier, tierIndex) => (
                  <div 
                    key={tierIndex} 
                    className={`flex items-center justify-between text-xs p-2 rounded ${
                      pricing && pricing.tier === tier ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'
                    }`}
                  >
                    <span className="text-gray-300">
                      {tier.minQty}-{tier.maxQty} units
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-medium">-{tier.discount}%</span>
                      <span className="text-white font-semibold">₹{tier.pricePerUnit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Input */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Calculate your order</span>
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`Min ${product.minQuantity}`}
                  value={quantities[product.id] || ''}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  min={product.minQuantity}
                  max={product.maxQuantity}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <span className="text-sm text-gray-300 self-center">{product.unit}s</span>
              </div>

              {pricing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-green-500/10 border border-green-500/20 rounded-lg p-3"
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Price per unit:</span>
                      <span className="text-white font-medium">₹{pricing.pricePerUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total price:</span>
                      <span className="text-green-400 font-bold">₹{pricing.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">You save:</span>
                      <span className="text-green-400 font-medium">₹{pricing.savings.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <Button 
                onClick={() => addToCart(product.id)}
                disabled={!order}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Bulk Cart
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Package className="w-8 h-8" />
            {t('marketplace.bulkOrdering')}
          </h2>
          <p className="text-gray-300">{t('marketplace.bulkDescription')}</p>
        </div>
        
        {Object.keys(orders).length > 0 && (
          <div className="text-right">
            <div className="text-sm text-gray-300">Total Order Value</div>
            <div className="text-2xl font-bold text-green-400">
              ₹{getTotalOrderValue().toLocaleString()}
            </div>
            <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-1" />
              Checkout ({Object.keys(orders).length})
            </Button>
          </div>
        )}
      </div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Bulk Ordering Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <TrendingDown className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Lower Prices</div>
              <div className="text-xs text-gray-300">Up to 25% savings</div>
            </div>
            <div className="text-center">
              <Truck className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Free Shipping</div>
              <div className="text-xs text-gray-300">On orders above ₹10,000</div>
            </div>
            <div className="text-center">
              <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Flexible Delivery</div>
              <div className="text-xs text-gray-300">Schedule as per need</div>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Quality Assured</div>
              <div className="text-xs text-gray-300">100% genuine products</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <BulkProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};
