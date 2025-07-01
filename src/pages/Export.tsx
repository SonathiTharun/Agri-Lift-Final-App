
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/components/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Check, Globe, Package, ShoppingBag, Store, Truck, Upload, X, Calendar,
  FileText, Shield, Award, MapPin, Filter, Download, Eye, Star,
  Clock, DollarSign, Users, TrendingUp, AlertCircle, CheckCircle,
  Phone, Mail, ExternalLink, Search, ChevronDown, Plus, Minus,
  BarChart3, PieChart, FileDown, Printer, RefreshCw, Settings
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';

const Export = () => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedBuyers, setSelectedBuyers] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBuyerModal, setSelectedBuyerModal] = useState<any>(null);
  const [consultationModal, setConsultationModal] = useState(false);
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterMarketType, setFilterMarketType] = useState<string>('all');
  const [exportReadinessScore, setExportReadinessScore] = useState(75);
  const [myExports, setMyExports] = useState<any[]>([]);
  const [exportFilters, setExportFilters] = useState({
    crop: 'all',
    buyer: 'all',
    status: 'all',
    dateRange: 'all'
  });

  const [cropDetails, setCropDetails] = useState({
    name: '',
    quantity: '',
    price: '',
    description: '',
    harvestDate: '',
  });

  // Available certifications
  const availableCertifications = [
    'Organic', 'GAP Certified', 'FSSAI', 'APEDA', 'Fair Trade',
    'Rainforest Alliance', 'GlobalGAP', 'ISO 22000', 'HACCP', 'BRC'
  ];

  // Sample export data
  const sampleExports = [
    {
      id: 1,
      product: 'Organic Wheat',
      buyer: 'UAE Food Importers',
      status: 'In Transit',
      date: '2024-01-15',
      payment: 'Paid',
      amount: '₹2,50,000',
      quantity: '5000 kg'
    },
    {
      id: 2,
      product: 'Basmati Rice',
      buyer: 'European Fresh Markets',
      status: 'Delivered',
      date: '2024-01-10',
      payment: 'Paid',
      amount: '₹3,75,000',
      quantity: '3000 kg'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCropDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBuyerSelection = (buyerId: string) => {
    setSelectedBuyers(prev =>
      prev.includes(buyerId)
        ? prev.filter(id => id !== buyerId)
        : [...prev, buyerId]
    );
  };

  const handleCertificationToggle = (certification: string) => {
    setSelectedCertifications(prev =>
      prev.includes(certification)
        ? prev.filter(cert => cert !== certification)
        : [...prev, certification]
    );
  };

  // Image upload handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Enhanced validation
    if (!cropDetails.name || !cropDetails.quantity || !cropDetails.price) {
      toast.error("Missing information", {
        description: "Please fill in all required fields"
      });
      setIsSubmitting(false);
      return;
    }

    if (selectedBuyers.length === 0) {
      toast.error("No buyers selected", {
        description: "Please select at least one buyer"
      });
      setIsSubmitting(false);
      return;
    }

    if (!uploadedImage) {
      toast.error("Image required", {
        description: "Please upload an image of your produce"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Success toast with animation
    toast.success("🎉 Export listing created successfully!", {
      description: `Your ${cropDetails.name} has been listed for export to ${selectedBuyers.length} buyer(s)`,
      action: {
        label: "View Listing",
        onClick: () => console.log("View listing")
      }
    });

    // Reset form
    setCropDetails({
      name: '',
      quantity: '',
      price: '',
      description: '',
      harvestDate: '',
    });
    setSelectedBuyers([]);
    setSelectedCertifications([]);
    setUploadedImage(null);
    setIsSubmitting(false);
  };

  const internationalBuyers = [
    {
      id: 'uae',
      name: 'UAE Food Importers',
      flag: '🇦🇪',
      markets: ['Organic Foods', 'Premium Fruits'],
      region: 'Middle East',
      rating: 4.8,
      volume: '500+ tons/month',
      contact: '+971-4-123-4567',
      email: 'imports@uaefood.ae',
      certifications: ['HACCP', 'ISO 22000'],
      description: 'Leading food importer in UAE specializing in premium organic produce'
    },
    {
      id: 'usa',
      name: 'US Agri Trade',
      flag: '🇺🇸',
      markets: ['Specialty Grains', 'Organic Certification Required'],
      region: 'North America',
      rating: 4.9,
      volume: '1000+ tons/month',
      contact: '+1-555-123-4567',
      email: 'procurement@usagritrade.com',
      certifications: ['USDA Organic', 'Non-GMO'],
      description: 'Premium agricultural products distributor across North America'
    },
    {
      id: 'eu',
      name: 'European Fresh Markets',
      flag: '🇪🇺',
      markets: ['Premium Quality', 'Sustainable Farming'],
      region: 'Europe',
      rating: 4.7,
      volume: '750+ tons/month',
      contact: '+49-30-123-4567',
      email: 'sourcing@eufresh.eu',
      certifications: ['GlobalGAP', 'BRC'],
      description: 'Sustainable agriculture focused distributor serving European markets'
    },
    {
      id: 'brazil',
      name: 'Brazilian Importers',
      flag: '🇧🇷',
      markets: ['Tropical Fruits', 'Spices'],
      region: 'South America',
      rating: 4.6,
      volume: '300+ tons/month',
      contact: '+55-11-123-4567',
      email: 'compras@brazilimport.com.br',
      certifications: ['Fair Trade', 'Rainforest Alliance'],
      description: 'Specialized in exotic fruits and spices for Brazilian market'
    },
  ];

  const localBuyers = [
    {
      id: 'jiomart',
      name: 'JioMart',
      logo: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop',
      type: 'Supermarket Chain',
      volume: '2000+ tons/month',
      locations: '300+ stores',
      contact: '+91-22-123-4567',
      rating: 4.5
    },
    {
      id: 'dmart',
      name: 'DMart',
      logo: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=800&auto=format&fit=crop',
      type: 'Wholesale Retailer',
      volume: '1500+ tons/month',
      locations: '250+ stores',
      contact: '+91-22-987-6543',
      rating: 4.4
    },
    {
      id: 'bigbasket',
      name: 'BigBasket',
      logo: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&auto=format&fit=crop',
      type: 'Online Grocery',
      volume: '1000+ tons/month',
      locations: '25+ cities',
      contact: '+91-80-123-4567',
      rating: 4.3
    },
  ];

  const onlinePlatforms = [
    {
      id: 'amazon',
      name: 'Amazon',
      logo: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop',
      commission: '8-15%',
      reach: '500M+ customers',
      features: ['FBA', 'Prime Delivery', 'Global Shipping']
    },
    {
      id: 'flipkart',
      name: 'Flipkart',
      logo: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&auto=format&fit=crop',
      commission: '5-12%',
      reach: '400M+ customers',
      features: ['Flipkart Assured', 'Same Day Delivery']
    },
    {
      id: 'instamart',
      name: 'Swiggy Instamart',
      logo: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop',
      commission: '10-18%',
      reach: '100M+ customers',
      features: ['10-min Delivery', 'Fresh Guarantee']
    },
    {
      id: 'blinkit',
      name: 'Blinkit',
      logo: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=800&auto=format&fit=crop',
      commission: '12-15%',
      reach: '50M+ customers',
      features: ['Quick Commerce', 'Fresh Produce']
    },
    {
      id: 'zepto',
      name: 'Zepto',
      logo: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&auto=format&fit=crop',
      commission: '10-15%',
      reach: '30M+ customers',
      features: ['10-min Delivery', 'Premium Quality']
    },
  ];

  const exportServices = [
    {
      id: 'documentation',
      title: 'Documentation Support',
      description: 'Complete assistance with FSSAI, APEDA, and Phytosanitary certificates',
      icon: FileText,
      features: ['FSSAI Registration', 'APEDA Certification', 'Phytosanitary Certificates', 'Export Permits'],
      price: '₹15,000 - ₹25,000',
      duration: '7-14 days'
    },
    {
      id: 'logistics',
      title: 'Logistics Support',
      description: 'End-to-end shipping and transportation management',
      icon: Truck,
      features: ['Container Booking', 'Cold Chain', 'Port Handling', 'Insurance'],
      price: '₹50 - ₹100 per kg',
      duration: '15-30 days'
    },
    {
      id: 'packaging',
      title: 'Packaging & Labeling',
      description: 'Professional packaging solutions for international standards',
      icon: Package,
      features: ['Export Packaging', 'Labeling Design', 'Branding Support', 'Quality Testing'],
      price: '₹20 - ₹50 per unit',
      duration: '3-7 days'
    },
    {
      id: 'consultation',
      title: 'Expert Consultation',
      description: 'One-on-one guidance from export specialists',
      icon: Users,
      features: ['Market Analysis', 'Pricing Strategy', 'Compliance Guidance', 'Buyer Matching'],
      price: '₹5,000 per session',
      duration: '1-2 hours'
    }
  ];

  const exportReadinessChecklist = [
    { item: 'Product Quality Standards', completed: true, weight: 20 },
    { item: 'Required Certifications', completed: true, weight: 25 },
    { item: 'Documentation Complete', completed: false, weight: 20 },
    { item: 'Packaging Standards', completed: true, weight: 15 },
    { item: 'Logistics Partner', completed: false, weight: 10 },
    { item: 'Payment Terms', completed: true, weight: 10 }
  ];

  // Sample exports data for dashboard
  const myExportsData = [
    {
      id: 'exp001',
      product: 'Organic Basmati Rice',
      variety: 'Premium Grade A',
      buyer: 'UAE Food Importers',
      buyerFlag: '🇦🇪',
      destination: 'Dubai, UAE',
      quantity: '500 MT',
      value: '₹45,00,000',
      status: 'In Transit',
      date: '2024-01-15'
    },
    {
      id: 'exp002',
      product: 'Fresh Mangoes',
      variety: 'Alphonso',
      buyer: 'UK Fresh Imports',
      buyerFlag: '🇬🇧',
      destination: 'London, UK',
      quantity: '200 MT',
      value: '₹28,00,000',
      status: 'Delivered',
      date: '2024-01-10'
    },
    {
      id: 'exp003',
      product: 'Turmeric Powder',
      variety: 'Organic Certified',
      buyer: 'German Spice Co.',
      buyerFlag: '🇩🇪',
      destination: 'Hamburg, Germany',
      quantity: '100 MT',
      value: '₹15,00,000',
      status: 'Processing',
      date: '2024-01-20'
    }
  ];

  return (
    <TooltipProvider>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-foliage-light/10">
          <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
            <motion.div
              className="flex flex-col space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Clean Header Section */}
              <motion.div
                className="text-center space-y-6 py-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-4">
                  <motion.div
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-foliage/20"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Globe className="h-6 w-6 text-foliage" />
                    <span className="text-foliage font-semibold">Export Management Portal</span>
                  </motion.div>

                  <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foliage-dark via-foliage to-foliage-light bg-clip-text text-transparent leading-tight">
                    Global Trade Hub
                  </h1>

                </div>

                {/* Stats Cards */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { icon: Globe, label: "Global Buyers", value: "500+", color: "text-blue-600" },
                    { icon: Package, label: "Active Exports", value: "1.2K+", color: "text-green-600" },
                    { icon: TrendingUp, label: "Success Rate", value: "98%", color: "text-purple-600" },
                    { icon: DollarSign, label: "Total Value", value: "₹50Cr+", color: "text-orange-600" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -5, scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Success Banner */}
              

              {/* Modern Navigation Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="sticky top-4 z-10"
              >
                <Tabs defaultValue="listing" className="w-full">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 mb-8">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full bg-transparent gap-2">
                      <TabsTrigger
                        value="listing"
                        className="flex items-center gap-3 px-6 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-foliage data-[state=active]:to-foliage-dark data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-gray-50"
                      >
                        <Plus className="h-5 w-5" />
                        <span className="font-medium">Create Listing</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="buyers"
                        className="flex items-center gap-3 px-6 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-foliage data-[state=active]:to-foliage-dark data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-gray-50"
                      >
                        <Globe className="h-5 w-5" />
                        <span className="font-medium">Find Buyers</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="services"
                        className="flex items-center gap-3 px-6 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-foliage data-[state=active]:to-foliage-dark data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-gray-50"
                      >
                        <Truck className="h-5 w-5" />
                        <span className="font-medium">Export Services</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="dashboard"
                        className="flex items-center gap-3 px-6 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-foliage data-[state=active]:to-foliage-dark data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-gray-50"
                      >
                        <BarChart3 className="h-5 w-5" />
                        <span className="font-medium">My Exports</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Create Listing Tab - Clean & Modern */}
                  <TabsContent value="listing" className="space-y-0">
                    <motion.div
                      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-foliage-light/20 via-white to-foliage/10 px-8 py-6 border-b border-gray-100">
                        <div className="text-center space-y-3">
                          <div className="inline-flex items-center gap-3 px-4 py-2 bg-foliage/10 rounded-full">
                            <Package className="h-5 w-5 text-foliage" />
                            <span className="text-foliage font-semibold">Create Export Listing</span>
                          </div>
                          <h2 className="text-3xl font-bold text-gray-900">List Your Premium Produce</h2>
                          <p className="text-gray-600 max-w-2xl mx-auto">
                            Connect with verified global buyers and showcase your agricultural products to international markets
                          </p>
                        </div>
                      </div>

                      {/* Form Content */}
                      <div className="p-8 space-y-8">

                        <form onSubmit={handleSubmit} className="space-y-8">
                          {/* Image Upload Section - Enhanced */}
                          <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 bg-foliage rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                              <Label className="text-lg font-semibold text-gray-900">Product Image*</Label>
                            </div>

                            <div
                              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group ${
                                isDragOver
                                  ? 'border-foliage bg-foliage-light/20 scale-[1.02] shadow-lg'
                                  : uploadedImage
                                    ? 'border-foliage bg-foliage-light/10 shadow-md'
                                    : 'border-gray-300 hover:border-foliage hover:bg-foliage-light/5 hover:shadow-md'
                              }`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />

                              {uploadedImage ? (
                                <div className="relative">
                                  <img
                                    src={uploadedImage}
                                    alt="Uploaded crop"
                                    className="max-h-56 mx-auto rounded-xl shadow-lg"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-3 right-3 rounded-full shadow-lg"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setUploadedImage(null);
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                                    <p className="text-sm font-medium text-gray-700">✓ Image uploaded</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="group-hover:scale-110 transition-transform duration-300"
                                  >
                                    <Upload className="h-20 w-20 mx-auto text-foliage" />
                                  </motion.div>
                                  <div className="space-y-2">
                                    <p className="text-xl font-semibold text-gray-900">
                                      Upload Product Image
                                    </p>
                                    <p className="text-gray-600">
                                      Drag & drop your crop image here or click to browse
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Supports JPG, PNG • Max size 10MB • Recommended: 1200x800px
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>

                          {/* Form Fields - Clean Grid Layout */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="flex items-center gap-2 mb-6">
                              <div className="w-8 h-8 bg-foliage rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                <div className="space-y-3">
                                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Package className="h-4 w-4 text-foliage" />
                                    Crop Name*
                                  </Label>
                                  <Input
                                    id="name"
                                    name="name"
                                    value={cropDetails.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Organic Basmati Rice"
                                    className="h-12 border-2 border-gray-200 focus:border-foliage rounded-xl transition-all duration-300"
                                    required
                                  />
                                </div>

                                <div className="space-y-3">
                                  <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-foliage" />
                                    Available Quantity (kg)*
                                  </Label>
                                  <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    value={cropDetails.quantity}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 5000"
                                    className="h-12 border-2 border-gray-200 focus:border-foliage rounded-xl transition-all duration-300"
                                    required
                                  />
                                </div>

                                <div className="space-y-3">
                                  <Label htmlFor="price" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-foliage" />
                                    Price per kg (₹)*
                                  </Label>
                                  <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={cropDetails.price}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 45"
                                    className="h-12 border-2 border-gray-200 focus:border-foliage rounded-xl transition-all duration-300"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div className="space-y-3">
                                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-foliage" />
                                    Product Description
                                  </Label>
                                  <Textarea
                                    id="description"
                                    name="description"
                                    value={cropDetails.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your produce quality, farming methods, certifications, etc."
                                    className="min-h-[120px] border-2 border-gray-200 focus:border-foliage rounded-xl resize-none transition-all duration-300"
                                  />
                                </div>

                                <div className="space-y-3">
                                  <Label htmlFor="harvestDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-foliage" />
                                    Harvest Date
                                  </Label>
                                  <Input
                                    id="harvestDate"
                                    name="harvestDate"
                                    type="date"
                                    value={cropDetails.harvestDate}
                                    onChange={handleInputChange}
                                    className="h-12 border-2 border-gray-200 focus:border-foliage rounded-xl transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          {/* Certifications Section - Enhanced */}
                          <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 bg-foliage rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                              <h3 className="text-lg font-semibold text-gray-900">Quality Certifications</h3>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6">
                              <p className="text-sm text-gray-600 mb-4">
                                Select all applicable certifications to increase buyer confidence and premium pricing
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {availableCertifications.map(cert => (
                                  <motion.div
                                    key={cert}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <div
                                      className={`cursor-pointer p-4 rounded-xl text-center transition-all duration-300 border-2 ${
                                        selectedCertifications.includes(cert)
                                          ? 'bg-foliage text-white border-foliage shadow-lg'
                                          : 'bg-white border-gray-200 hover:border-foliage hover:bg-foliage/5 text-gray-700'
                                      }`}
                                      onClick={() => handleCertificationToggle(cert)}
                                    >
                                      <div className="flex items-center justify-center gap-2">
                                        <span className="font-medium text-sm">{cert}</span>
                                        {selectedCertifications.includes(cert) && (
                                          <Check className="w-4 h-4" />
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>

                              {selectedCertifications.length > 0 && (
                                <div className="mt-4 p-3 bg-foliage/10 rounded-lg">
                                  <p className="text-sm text-foliage-dark font-medium">
                                    ✓ {selectedCertifications.length} certification{selectedCertifications.length > 1 ? 's' : ''} selected
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>

                    {/* Target Buyers Section */}
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label className="text-lg font-semibold text-foliage-dark">Target Buyers*</Label>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-foliage-dark mb-2">🌍 International Buyers</h4>
                          <div className="flex flex-wrap gap-2">
                            {internationalBuyers.map(buyer => (
                              <motion.div
                                key={buyer.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Badge
                                  variant={selectedBuyers.includes(buyer.id) ? "default" : "outline"}
                                  className={`cursor-pointer p-2 transition-all duration-300 ${
                                    selectedBuyers.includes(buyer.id)
                                      ? 'bg-foliage text-white shadow-lg'
                                      : 'hover:bg-foliage/10 hover:border-foliage'
                                  }`}
                                  onClick={() => handleBuyerSelection(buyer.id)}
                                >
                                  {buyer.flag} {buyer.name}
                                  {selectedBuyers.includes(buyer.id) && <Check className="ml-1 w-3 h-3" />}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-foliage-dark mb-2">🏪 Local Buyers</h4>
                          <div className="flex flex-wrap gap-2">
                            {localBuyers.map(buyer => (
                              <motion.div
                                key={buyer.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Badge
                                  variant={selectedBuyers.includes(buyer.id) ? "default" : "outline"}
                                  className={`cursor-pointer p-2 transition-all duration-300 ${
                                    selectedBuyers.includes(buyer.id)
                                      ? 'bg-foliage text-white shadow-lg'
                                      : 'hover:bg-foliage/10 hover:border-foliage'
                                  }`}
                                  onClick={() => handleBuyerSelection(buyer.id)}
                                >
                                  {buyer.name}
                                  {selectedBuyers.includes(buyer.id) && <Check className="ml-1 w-3 h-3" />}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-foliage-dark mb-2">🛒 Online Platforms</h4>
                          <div className="flex flex-wrap gap-2">
                            {onlinePlatforms.map(platform => (
                              <motion.div
                                key={platform.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Badge
                                  variant={selectedBuyers.includes(platform.id) ? "default" : "outline"}
                                  className={`cursor-pointer p-2 transition-all duration-300 ${
                                    selectedBuyers.includes(platform.id)
                                      ? 'bg-foliage text-white shadow-lg'
                                      : 'hover:bg-foliage/10 hover:border-foliage'
                                  }`}
                                  onClick={() => handleBuyerSelection(platform.id)}
                                >
                                  {platform.name}
                                  {selectedBuyers.includes(platform.id) && <Check className="ml-1 w-3 h-3" />}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                          {/* Submit Section - Enhanced */}
                          <motion.div
                            className="border-t border-gray-100 pt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                              <div className="text-center md:text-left">
                                <h4 className="font-semibold text-gray-900 mb-2">Ready to go global?</h4>
                                <p className="text-sm text-gray-600">
                                  Your listing will be reviewed and published within 24 hours
                                </p>
                              </div>

                              <div className="flex gap-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="px-8 py-3 border-2 border-gray-300 hover:border-foliage hover:text-foliage transition-all duration-300"
                                >
                                  Save Draft
                                </Button>

                                <Button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="px-12 py-3 text-lg font-semibold bg-gradient-to-r from-foliage to-foliage-dark hover:from-foliage-dark hover:to-foliage transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                                      Creating Listing...
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="mr-2 h-5 w-5" />
                                      Publish to Global Market
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        </form>
                      </div>
                    </motion.div>
                  </TabsContent>

              {/* Enhanced Find Buyers Tab */}
              <TabsContent value="buyers">
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Header with Filters */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-foliage-dark">🌐 Find Buyers</h2>
                        <p className="text-muted-foreground">Connect with verified buyers worldwide</p>
                      </div>

                      {/* Filters */}
                      <div className="flex gap-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-foliage text-foliage hover:bg-foliage hover:text-white">
                              <Filter className="mr-2 h-4 w-4" />
                              Region: {filterRegion === 'all' ? 'All' : filterRegion}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterRegion('all')}>All Regions</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRegion('North America')}>North America</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRegion('Europe')}>Europe</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRegion('Middle East')}>Middle East</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterRegion('South America')}>South America</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-foliage text-foliage hover:bg-foliage hover:text-white">
                              <Store className="mr-2 h-4 w-4" />
                              Type: {filterMarketType === 'all' ? 'All' : filterMarketType}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterMarketType('all')}>All Types</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterMarketType('International')}>International</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterMarketType('Local')}>Local</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterMarketType('Online')}>Online</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* International Buyers */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg border">
                      <h3 className="text-2xl font-bold text-foliage-dark mb-4 flex items-center gap-2">
                        🌍 International Buyers
                        <Badge className="bg-foliage">{internationalBuyers.length}</Badge>
                      </h3>
                      <p className="text-muted-foreground mb-6">Premium buyers from global markets</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {internationalBuyers
                          .filter(buyer => filterRegion === 'all' || buyer.region === filterRegion)
                          .map((buyer, index) => (
                          <motion.div
                            key={buyer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group"
                          >
                            <Card className="overflow-hidden border-2 hover:border-foliage transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
                              <CardHeader className="pb-3 bg-gradient-to-r from-foliage-light/20 to-foliage/10">
                                <CardTitle className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-3xl">{buyer.flag}</span>
                                    <div>
                                      <p className="font-bold text-foliage-dark">{buyer.name}</p>
                                      <p className="text-xs text-muted-foreground">{buyer.region}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{buyer.rating}</span>
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium text-foliage-dark">Volume:</p>
                                  <p className="text-sm text-muted-foreground">{buyer.volume}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foliage-dark">Specialties:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {buyer.markets.slice(0, 2).map((market, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {market}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="space-y-2">
                                <div className="flex gap-2 w-full">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-foliage text-foliage hover:bg-foliage hover:text-white"
                                    onClick={() => setSelectedBuyerModal(buyer)}
                                  >
                                    <Eye className="mr-1 h-3 w-3" />
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-foliage hover:bg-foliage-dark"
                                  >
                                    <Globe className="mr-1 h-3 w-3" />
                                    Connect
                                  </Button>
                                </div>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
              
                  {/* Local Buyers */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg border">
                      <h3 className="text-2xl font-bold text-foliage-dark mb-4 flex items-center gap-2">
                        🏪 Local Buyers
                        <Badge className="bg-foliage">{localBuyers.length}</Badge>
                      </h3>
                      <p className="text-muted-foreground mb-6">Trusted domestic retailers and chains</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {localBuyers
                          .filter(() => filterMarketType === 'all' || filterMarketType === 'Local')
                          .map((buyer, index) => (
                          <motion.div
                            key={buyer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -5, scale: 1.02 }}
                          >
                            <Card className="overflow-hidden border-2 hover:border-foliage transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
                              <CardHeader className="pb-3 bg-gradient-to-r from-foliage-light/20 to-foliage/10">
                                <CardTitle className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-foliage">
                                      <AvatarImage src={buyer.logo} alt={buyer.name} />
                                      <AvatarFallback className="bg-foliage text-white font-bold">
                                        {buyer.name[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-bold text-foliage-dark">{buyer.name}</p>
                                      <p className="text-sm text-muted-foreground">{buyer.type}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{buyer.rating}</span>
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-sm font-medium text-foliage-dark">Volume:</p>
                                    <p className="text-sm text-muted-foreground">{buyer.volume}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foliage-dark">Locations:</p>
                                    <p className="text-sm text-muted-foreground">{buyer.locations}</p>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter>
                                <div className="flex gap-2 w-full">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-foliage text-foliage hover:bg-foliage hover:text-white"
                                  >
                                    <Phone className="mr-1 h-3 w-3" />
                                    Call
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-foliage hover:bg-foliage-dark"
                                  >
                                    <Store className="mr-1 h-3 w-3" />
                                    Connect
                                  </Button>
                                </div>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Online Platforms */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg border">
                      <h3 className="text-2xl font-bold text-foliage-dark mb-4 flex items-center gap-2">
                        🛒 Online Platforms
                        <Badge className="bg-foliage">{onlinePlatforms.length}</Badge>
                      </h3>
                      <p className="text-muted-foreground mb-6">Reach millions of customers online</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {onlinePlatforms
                          .filter(() => filterMarketType === 'all' || filterMarketType === 'Online')
                          .map((platform, index) => (
                          <motion.div
                            key={platform.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -5, scale: 1.02 }}
                          >
                            <Card className="overflow-hidden border-2 hover:border-foliage transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
                              <CardHeader className="pb-3 bg-gradient-to-r from-foliage-light/20 to-foliage/10">
                                <CardTitle className="flex flex-col items-center text-center gap-2">
                                  <Avatar className="h-16 w-16 border-2 border-foliage">
                                    <AvatarImage src={platform.logo} alt={platform.name} />
                                    <AvatarFallback className="bg-foliage text-white font-bold text-lg">
                                      {platform.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-bold text-foliage-dark">{platform.name}</p>
                                    <p className="text-sm text-muted-foreground">Commission: {platform.commission}</p>
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2 text-center">
                                <div>
                                  <p className="text-sm font-medium text-foliage-dark">Reach:</p>
                                  <p className="text-sm text-muted-foreground">{platform.reach}</p>
                                </div>
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {platform.features.slice(0, 2).map((feature, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                              <CardFooter>
                                <Button
                                  size="sm"
                                  className="w-full bg-foliage hover:bg-foliage-dark"
                                >
                                  <ShoppingBag className="mr-1 h-3 w-3" />
                                  Join Platform
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Buyer Details Modal */}
                <Dialog open={!!selectedBuyerModal} onOpenChange={() => setSelectedBuyerModal(null)}>
                  <DialogContent className="max-w-2xl">
                    {selectedBuyerModal && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <span className="text-3xl">{selectedBuyerModal.flag}</span>
                            <div>
                              <h3 className="text-2xl font-bold text-foliage-dark">{selectedBuyerModal.name}</h3>
                              <p className="text-muted-foreground">{selectedBuyerModal.region}</p>
                            </div>
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="font-semibold text-foliage-dark">Rating</Label>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < Math.floor(selectedBuyerModal.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className="font-medium">{selectedBuyerModal.rating}/5</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="font-semibold text-foliage-dark">Monthly Volume</Label>
                              <p className="text-muted-foreground">{selectedBuyerModal.volume}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-semibold text-foliage-dark">Description</Label>
                            <p className="text-muted-foreground">{selectedBuyerModal.description}</p>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-semibold text-foliage-dark">Market Specialties</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedBuyerModal.markets.map((market: string, i: number) => (
                                <Badge key={i} className="bg-foliage-light text-foliage-dark">
                                  {market}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-semibold text-foliage-dark">Required Certifications</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedBuyerModal.certifications.map((cert: string, i: number) => (
                                <Badge key={i} variant="outline" className="border-foliage text-foliage">
                                  <Shield className="mr-1 h-3 w-3" />
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="font-semibold text-foliage-dark">Contact</Label>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Phone className="h-3 w-3" />
                                  {selectedBuyerModal.contact}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Mail className="h-3 w-3" />
                                  {selectedBuyerModal.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedBuyerModal(null)}>
                            Close
                          </Button>
                          <Button className="bg-foliage hover:bg-foliage-dark">
                            <Globe className="mr-2 h-4 w-4" />
                            Connect Now
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* Enhanced Export Services Tab */}
              <TabsContent value="services">
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Header */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border text-center">
                    <h2 className="text-3xl font-bold text-foliage-dark mb-2">🚚 Export Services</h2>
                    <p className="text-muted-foreground">End-to-end support for your export journey</p>
                  </div>

                  {/* Export Readiness Score */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-gradient-to-r from-foliage-light/20 to-foliage/10 p-6 rounded-xl border-2 border-foliage/30">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foliage-dark">📊 Export Readiness Score</h3>
                          <p className="text-muted-foreground">Your current export preparation status</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-foliage">{exportReadinessScore}%</div>
                          <p className="text-sm text-muted-foreground">Ready to Export</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Overall Progress</span>
                          <span className="text-sm text-muted-foreground">{exportReadinessScore}%</span>
                        </div>
                        <Progress value={exportReadinessScore} className="h-3" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {exportReadinessChecklist.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              {item.completed ? (
                                <CheckCircle className="h-4 w-4 text-foliage" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                              )}
                              <span className={`text-sm ${item.completed ? 'text-foliage-dark' : 'text-muted-foreground'}`}>
                                {item.item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exportServices.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card className="overflow-hidden border-2 hover:border-foliage transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl h-full">
                          <CardHeader className="pb-4 bg-gradient-to-r from-foliage-light/20 to-foliage/10">
                            <CardTitle className="flex items-center gap-3">
                              <div className="p-2 bg-foliage rounded-lg">
                                <service.icon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-foliage-dark">{service.title}</h3>
                                <p className="text-sm text-muted-foreground">{service.duration}</p>
                              </div>
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {service.description}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-sm font-semibold text-foliage-dark">Features:</Label>
                              <ul className="mt-2 space-y-1">
                                {service.features.map((feature, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Check className="h-3 w-3 text-foliage" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              <div>
                                <Label className="text-sm font-semibold text-foliage-dark">Price:</Label>
                                <p className="text-lg font-bold text-foliage">{service.price}</p>
                              </div>
                              <Badge className="bg-foliage-light text-foliage-dark">
                                {service.duration}
                              </Badge>
                            </div>
                          </CardContent>

                          <CardFooter className="space-y-2">
                            <div className="flex gap-2 w-full">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-foliage text-foliage hover:bg-foliage hover:text-white"
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                Details
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-foliage hover:bg-foliage-dark"
                                onClick={() => service.id === 'consultation' && setConsultationModal(true)}
                              >
                                <Calendar className="mr-1 h-3 w-3" />
                                Book Now
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Consultation Booking Modal */}
                <Dialog open={consultationModal} onOpenChange={setConsultationModal}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-foliage" />
                        Book Expert Consultation
                      </DialogTitle>
                      <DialogDescription>
                        Schedule a one-on-one session with our export specialists
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Preferred Date</Label>
                        <Input type="date" className="border-foliage focus:border-foliage" />
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Time</Label>
                        <Input type="time" className="border-foliage focus:border-foliage" />
                      </div>
                      <div className="space-y-2">
                        <Label>Topic of Discussion</Label>
                        <Textarea
                          placeholder="What would you like to discuss?"
                          className="border-foliage focus:border-foliage"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setConsultationModal(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-foliage hover:bg-foliage-dark"
                        onClick={() => {
                          setConsultationModal(false);
                          toast.success("Consultation booked!", {
                            description: "Our expert will contact you within 24 hours"
                          });
                        }}
                      >
                        Book Session
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* Enhanced My Exports Tab */}
              <TabsContent value="dashboard">
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Header with Stats */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-foliage-dark">📦 My Exports</h2>
                        <p className="text-muted-foreground">Track and manage your export activities</p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="border-foliage text-foliage hover:bg-foliage hover:text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export Data
                        </Button>
                        <Button className="bg-foliage hover:bg-foliage-dark">
                          <Plus className="mr-2 h-4 w-4" />
                          New Listing
                        </Button>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-foliage-light/20 to-foliage/10 p-4 rounded-lg border border-foliage/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-foliage rounded-lg">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Exports</p>
                            <p className="text-2xl font-bold text-foliage-dark">12</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg border border-green-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Revenue</p>
                            <p className="text-2xl font-bold text-green-700">₹8.5L</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">In Transit</p>
                            <p className="text-2xl font-bold text-blue-700">3</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-purple-100 to-purple-50 p-4 rounded-lg border border-purple-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Active Buyers</p>
                            <p className="text-2xl font-bold text-purple-700">8</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Exports Table */}
                  <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
                    <div className="p-6 border-b">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search exports..."
                              className="pl-10 border-foliage focus:border-foliage"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="border-foliage text-foliage hover:bg-foliage hover:text-white">
                                <Filter className="mr-2 h-4 w-4" />
                                Status
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>All Status</DropdownMenuItem>
                              <DropdownMenuItem>In Transit</DropdownMenuItem>
                              <DropdownMenuItem>Delivered</DropdownMenuItem>
                              <DropdownMenuItem>Pending</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <Button variant="outline" className="border-foliage text-foliage hover:bg-foliage hover:text-white">
                            <Calendar className="mr-2 h-4 w-4" />
                            Date Range
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-foliage-light/20">
                          <tr>
                            <th className="text-left p-4 font-semibold text-foliage-dark">Product</th>
                            <th className="text-left p-4 font-semibold text-foliage-dark">Buyer</th>
                            <th className="text-left p-4 font-semibold text-foliage-dark">Quantity</th>
                            <th className="text-left p-4 font-semibold text-foliage-dark">Value</th>
                            <th className="text-left p-4 font-semibold text-foliage-dark">Status</th>
                            <th className="text-left p-4 font-semibold text-foliage-dark">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myExportsData.map((exportItem, index) => (
                            <motion.tr
                              key={exportItem.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="border-b hover:bg-foliage-light/10 transition-colors"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-foliage-light rounded-lg flex items-center justify-center">
                                    <span className="text-foliage-dark font-bold text-lg">
                                      {exportItem.product[0]}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-foliage-dark">{exportItem.product}</p>
                                    <p className="text-sm text-muted-foreground">{exportItem.variety}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{exportItem.buyerFlag}</span>
                                  <div>
                                    <p className="font-medium">{exportItem.buyer}</p>
                                    <p className="text-sm text-muted-foreground">{exportItem.destination}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="font-medium">{exportItem.quantity}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-foliage">{exportItem.value}</p>
                              </td>
                              <td className="p-4">
                                <Badge
                                  className={`${
                                    exportItem.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    exportItem.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                    exportItem.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {exportItem.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>View Details</TooltipContent>
                                  </Tooltip>

                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                        <MapPin className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Track Shipment</TooltipContent>
                                  </Tooltip>

                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Download Invoice</TooltipContent>
                                  </Tooltip>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
                </Tabs>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </TooltipProvider>
  );
};

export default Export;
