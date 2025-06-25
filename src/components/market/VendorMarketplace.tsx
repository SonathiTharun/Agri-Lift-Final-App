import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Package, TrendingUp, Award, Users, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/LanguageContext";
import { GlassCard } from "./GlassCard";

interface Vendor {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  specialties: string[];
  verified: boolean;
  joinedDate: string;
  description: string;
  featuredProducts: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
  }>;
}

const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "Green Valley Farms",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    location: "Karnataka, India",
    rating: 4.9,
    totalProducts: 156,
    totalSales: 2847,
    specialties: ["Organic Seeds", "Fertilizers", "Tools"],
    verified: true,
    joinedDate: "2022-03-15",
    description: "Premium organic farming solutions with 15+ years of experience",
    featuredProducts: [
      { id: "1", name: "Organic Tomato Seeds", price: 299, image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200&h=200&fit=crop", rating: 4.8 },
      { id: "2", name: "Bio Fertilizer", price: 1299, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop", rating: 4.9 }
    ]
  },
  {
    id: "2",
    name: "AgriTech Solutions",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    location: "Punjab, India",
    rating: 4.7,
    totalProducts: 89,
    totalSales: 1523,
    specialties: ["Smart Tools", "IoT Devices", "Sensors"],
    verified: true,
    joinedDate: "2021-08-22",
    description: "Cutting-edge agricultural technology for modern farming",
    featuredProducts: [
      { id: "3", name: "Soil pH Sensor", price: 2499, image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop", rating: 4.6 },
      { id: "4", name: "Smart Irrigation Kit", price: 8999, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop", rating: 4.8 }
    ]
  },
  {
    id: "3",
    name: "Harvest Hub",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    location: "Tamil Nadu, India",
    rating: 4.8,
    totalProducts: 234,
    totalSales: 3456,
    specialties: ["Pesticides", "Growth Enhancers", "Crop Protection"],
    verified: true,
    joinedDate: "2020-11-10",
    description: "Comprehensive crop protection and enhancement solutions",
    featuredProducts: [
      { id: "5", name: "Organic Pesticide", price: 899, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop", rating: 4.7 },
      { id: "6", name: "Growth Booster", price: 1599, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop", rating: 4.9 }
    ]
  }
];

export const VendorMarketplace = () => {
  const { t } = useLanguage();
  const [vendors, setVendors] = useState(mockVendors);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('grid');

  const VendorCard = ({ vendor }: { vendor: Vendor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-6 h-full cursor-pointer hover:bg-white/10 transition-all duration-300"
        onClick={() => setSelectedVendor(vendor)}
      >
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={vendor.avatar} alt={vendor.name} />
            <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-white">{vendor.name}</h3>
              {vendor.verified && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Award className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-300 text-sm mb-2">
              <MapPin className="w-3 h-3" />
              {vendor.location}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                {vendor.rating}
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {vendor.totalProducts} products
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {vendor.totalSales} sales
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{vendor.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {vendor.specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="outline" className="text-xs border-white/20 text-gray-300">
              {specialty}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {vendor.featuredProducts.slice(0, 2).map((product) => (
            <div key={product.id} className="bg-white/5 rounded-lg p-2">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-16 object-cover rounded mb-1"
              />
              <div className="text-xs text-gray-300 truncate">{product.name}</div>
              <div className="text-xs text-green-400 font-semibold">₹{product.price}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
            <ExternalLink className="w-3 h-3 mr-1" />
            View Store
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 text-gray-300">
            <MessageCircle className="w-3 h-3" />
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );

  const FeaturedVendor = ({ vendor }: { vendor: Vendor }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={vendor.avatar} alt={vendor.name} />
                <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-white">{vendor.name}</h2>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <Award className="w-3 h-3 mr-1" />
                    Featured Vendor
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-gray-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  {vendor.location}
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    {vendor.rating} ({vendor.totalSales} reviews)
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {vendor.totalProducts} products
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Member since {new Date(vendor.joinedDate).getFullYear()}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{vendor.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {vendor.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="border-white/20 text-gray-300">
                  {specialty}
                </Badge>
              ))}
            </div>

            <div className="flex gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Store
              </Button>
              <Button variant="outline" className="border-white/20 text-gray-300">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Vendor
              </Button>
            </div>
          </div>

          <div className="lg:w-80">
            <h3 className="text-lg font-semibold text-white mb-4">Featured Products</h3>
            <div className="grid grid-cols-2 gap-3">
              {vendor.featuredProducts.map((product) => (
                <div key={product.id} className="bg-white/5 rounded-lg p-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                  <div className="text-sm text-gray-300 truncate mb-1">{product.name}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-green-400 font-semibold">₹{product.price}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      {product.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{t('marketplace.vendorMarketplace')}</h2>
          <p className="text-gray-300">{t('marketplace.vendorDescription')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            className="border-white/20"
          >
            All Vendors
          </Button>
          <Button
            variant={viewMode === 'featured' ? 'default' : 'outline'}
            onClick={() => setViewMode('featured')}
            className="border-white/20"
          >
            Featured
          </Button>
        </div>
      </div>

      {viewMode === 'featured' && (
        <FeaturedVendor vendor={vendors[0]} />
      )}

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <VendorCard vendor={vendor} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
