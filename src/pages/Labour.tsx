import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MapPin, Clock, Star, Phone, Mail, Calendar, Filter, Search, 
  ChevronDown, ChevronUp, Heart, Share2, MessageCircle, CheckCircle, 
  AlertCircle, TrendingUp, Award, Shield, Zap, Eye, UserPlus, 
  Briefcase, BarChart3, Settings, Bell, Download, Upload, 
  Target, Sparkles, Activity, Globe, Headphones, Video,
  FileText, DollarSign, Timer, ThumbsUp, Send, Plus,
  ArrowRight, ArrowLeft, RefreshCw, SlidersHorizontal,
  UserCheck, Building, Truck, Wrench, Leaf, Droplets,
  Sun, Moon, Wind, CloudRain, Thermometer, Gauge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/components/LanguageContext';
import { Layout } from '@/components/Layout';

// Types for better type safety
type WorkerCategory = 'all' | 'planting' | 'harvesting' | 'irrigation' | 'machinery' | 'livestock' | 'pest-control' | 'soil-management' | 'greenhouse';

type JobType = 'full-time' | 'part-time' | 'contract' | 'seasonal' | 'temporary' | 'freelance';

type Worker = {
  id: string;
  name: string;
  category: WorkerCategory;
  skills: string[];
  experience: string;
  location: string;
  rating: number;
  reviews: number;
  hourlyRate: string;
  dailyRate: string;
  availability: string;
  phone: string;
  email: string;
  image: string;
  verified: boolean;
  premium: boolean;
  completedJobs: number;
  responseTime: string;
  languages: string[];
  successRate: number;
  lastActive: string;
  badges: string[];
  specializations: string[];
  teamSize?: number;
  isTeam?: boolean;
  teamLeader?: string;
  description: string;
  certifications: string[];
  equipment: string[];
  workingHours: string;
  emergencyAvailable: boolean;
};

type Job = {
  id: string;
  title: string;
  type: JobType;
  description: string;
  requirements: string[];
  location: string;
  payRate: string;
  deadline: string;
  postedBy: string;
  postedDate: string;
  applications: number;
  status: 'active' | 'closed' | 'draft' | 'expired';
  priority: 'urgent' | 'high' | 'standard' | 'low';
  category: WorkerCategory;
  duration: string;
  benefits: string[];
};

const Labour = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('find-workers');
  const [selectedCategory, setSelectedCategory] = useState<WorkerCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteWorkers, setFavoriteWorkers] = useState<string[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [filterRate, setFilterRate] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    activeWorkers: 1247,
    availableNow: 89,
    jobsPosted: 156,
    successfulHires: 2341
  });

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeWorkers: prev.activeWorkers + Math.floor(Math.random() * 3) - 1,
        availableNow: prev.availableNow + Math.floor(Math.random() * 5) - 2,
        jobsPosted: prev.jobsPosted + Math.floor(Math.random() * 2),
        successfulHires: prev.successfulHires + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const workerCategories = [
    { id: 'all' as WorkerCategory, nameKey: 'all-workers', count: 156, icon: Users },
    { id: 'planting' as WorkerCategory, nameKey: 'planting-specialist', count: 45, icon: Leaf },
    { id: 'harvesting' as WorkerCategory, nameKey: 'harvest-expert', count: 38, icon: Sun },
    { id: 'irrigation' as WorkerCategory, nameKey: 'irrigation-specialist', count: 28, icon: Droplets },
    { id: 'machinery' as WorkerCategory, nameKey: 'machinery-expert', count: 25, icon: Wrench },
    { id: 'livestock' as WorkerCategory, nameKey: 'livestock-expert', count: 20, icon: Building },
    { id: 'pest-control' as WorkerCategory, nameKey: 'pest-control-expert', count: 18, icon: Shield },
    { id: 'soil-management' as WorkerCategory, nameKey: 'soil-management', count: 15, icon: Gauge },
    { id: 'greenhouse' as WorkerCategory, nameKey: 'greenhouse-specialist', count: 12, icon: Wind }
  ];

  const workers: Worker[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      category: 'planting',
      skills: ['Seed Planting', 'Soil Preparation', 'Organic Farming'],
      experience: '8 years',
      location: 'Punjab, India',
      rating: 4.8,
      reviews: 124,
      hourlyRate: '₹150',
      dailyRate: '₹1200',
      availability: 'Available',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@email.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true,
      premium: true,
      completedJobs: 89,
      responseTime: '< 2 hours',
      languages: ['Hindi', 'Punjabi', 'English'],
      successRate: 96,
      lastActive: '2 hours ago',
      badges: ['top-rated', 'quick-responder', 'eco-friendly'],
      specializations: ['Organic Farming', 'Precision Agriculture'],
      description: 'Experienced agricultural worker specializing in organic farming and sustainable practices.',
      certifications: ['Organic Farming Certificate', 'Soil Management'],
      equipment: ['Hand Tools', 'Spraying Equipment'],
      workingHours: '6 AM - 6 PM',
      emergencyAvailable: true
    },
    {
      id: '2',
      name: 'Priya Sharma',
      category: 'harvesting',
      skills: ['Crop Harvesting', 'Post-Harvest Processing', 'Quality Control'],
      experience: '6 years',
      location: 'Haryana, India',
      rating: 4.9,
      reviews: 98,
      hourlyRate: '₹180',
      dailyRate: '₹1440',
      availability: 'Available',
      phone: '+91 98765 43211',
      email: 'priya.sharma@email.com',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
      premium: false,
      completedJobs: 67,
      responseTime: '< 1 hour',
      languages: ['Hindi', 'English'],
      successRate: 98,
      lastActive: '1 hour ago',
      badges: ['premium-worker', 'quick-responder'],
      specializations: ['Harvest Management', 'Quality Assurance'],
      description: 'Expert in crop harvesting with focus on quality and efficiency.',
      certifications: ['Harvest Management', 'Food Safety'],
      equipment: ['Harvesting Tools', 'Quality Testing Kit'],
      workingHours: '5 AM - 7 PM',
      emergencyAvailable: false
    },
    {
      id: '3',
      name: 'Suresh Patel',
      category: 'irrigation',
      skills: ['Drip Irrigation', 'Sprinkler Systems', 'Water Management'],
      experience: '12 years',
      location: 'Gujarat, India',
      rating: 4.7,
      reviews: 156,
      hourlyRate: '₹200',
      dailyRate: '₹1600',
      availability: 'Busy until Dec 15',
      phone: '+91 98765 43212',
      email: 'suresh.patel@email.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      premium: true,
      completedJobs: 134,
      responseTime: '< 3 hours',
      languages: ['Gujarati', 'Hindi', 'English'],
      successRate: 94,
      lastActive: '3 hours ago',
      badges: ['irrigation-specialist', 'water-expert'],
      specializations: ['Smart Irrigation', 'Water Conservation'],
      description: 'Irrigation specialist with expertise in modern water management systems.',
      certifications: ['Irrigation Technology', 'Water Management'],
      equipment: ['Irrigation Tools', 'Water Testing Kit'],
      workingHours: '7 AM - 5 PM',
      emergencyAvailable: true
    },
    {
      id: '4',
      name: 'Anita Singh',
      category: 'machinery',
      skills: ['Tractor Operation', 'Harvester Operation', 'Equipment Maintenance'],
      experience: '5 years',
      location: 'Uttar Pradesh, India',
      rating: 4.6,
      reviews: 78,
      hourlyRate: '₹250',
      dailyRate: '₹2000',
      availability: 'Available',
      phone: '+91 98765 43213',
      email: 'anita.singh@email.com',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      verified: true,
      premium: false,
      completedJobs: 45,
      responseTime: '< 4 hours',
      languages: ['Hindi', 'English'],
      successRate: 92,
      lastActive: '4 hours ago',
      badges: ['machinery-expert', 'reliable'],
      specializations: ['Heavy Machinery', 'Equipment Repair'],
      description: 'Skilled machinery operator with expertise in modern agricultural equipment.',
      certifications: ['Machinery Operation License', 'Safety Training'],
      equipment: ['Tractor', 'Harvester', 'Maintenance Tools'],
      workingHours: '7 AM - 6 PM',
      emergencyAvailable: true
    },
    {
      id: '5',
      name: 'Vikram Reddy',
      category: 'livestock',
      skills: ['Cattle Care', 'Dairy Management', 'Veterinary Assistance'],
      experience: '10 years',
      location: 'Telangana, India',
      rating: 4.8,
      reviews: 112,
      hourlyRate: '₹175',
      dailyRate: '₹1400',
      availability: 'Available',
      phone: '+91 98765 43214',
      email: 'vikram.reddy@email.com',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      premium: true,
      completedJobs: 78,
      responseTime: '< 2 hours',
      languages: ['Telugu', 'Hindi', 'English'],
      successRate: 97,
      lastActive: '1 hour ago',
      badges: ['livestock-expert', 'veterinary-trained'],
      specializations: ['Dairy Farming', 'Animal Health'],
      description: 'Experienced livestock specialist with veterinary training.',
      certifications: ['Veterinary Assistant', 'Dairy Management'],
      equipment: ['Medical Kit', 'Milking Equipment'],
      workingHours: '5 AM - 8 PM',
      emergencyAvailable: true
    },
    {
      id: '6',
      name: 'Meera Joshi',
      category: 'greenhouse',
      skills: ['Greenhouse Management', 'Hydroponic Systems', 'Climate Control'],
      experience: '7 years',
      location: 'Maharashtra, India',
      rating: 4.9,
      reviews: 89,
      hourlyRate: '₹190',
      dailyRate: '₹1520',
      availability: 'Available',
      phone: '+91 98765 43215',
      email: 'meera.joshi@email.com',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      verified: true,
      premium: false,
      completedJobs: 56,
      responseTime: '< 1 hour',
      languages: ['Marathi', 'Hindi', 'English'],
      successRate: 99,
      lastActive: '30 minutes ago',
      badges: ['greenhouse-specialist', 'tech-savvy'],
      specializations: ['Controlled Environment', 'Precision Farming'],
      description: 'Greenhouse specialist with expertise in modern controlled environment agriculture.',
      certifications: ['Greenhouse Technology', 'Hydroponic Systems'],
      equipment: ['Climate Sensors', 'Hydroponic Setup'],
      workingHours: '6 AM - 7 PM',
      emergencyAvailable: false
    },
    {
      id: '7',
      name: 'Ramesh Yadav',
      category: 'pest-control',
      skills: ['Integrated Pest Management', 'Organic Pesticides', 'Crop Protection'],
      experience: '9 years',
      location: 'Rajasthan, India',
      rating: 4.7,
      reviews: 143,
      hourlyRate: '₹160',
      dailyRate: '₹1280',
      availability: 'Available',
      phone: '+91 98765 43216',
      email: 'ramesh.yadav@email.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      premium: true,
      completedJobs: 98,
      responseTime: '< 3 hours',
      languages: ['Hindi', 'Rajasthani', 'English'],
      successRate: 95,
      lastActive: '2 hours ago',
      badges: ['pest-control-expert', 'organic-certified'],
      specializations: ['IPM', 'Biological Control'],
      description: 'Pest control specialist focusing on sustainable and organic methods.',
      certifications: ['IPM Certification', 'Pesticide License'],
      equipment: ['Spraying Equipment', 'Detection Tools'],
      workingHours: '6 AM - 6 PM',
      emergencyAvailable: true
    },
    {
      id: '8',
      name: 'Kavitha Nair',
      category: 'soil-management',
      skills: ['Soil Testing', 'Nutrient Management', 'Soil Conservation'],
      experience: '6 years',
      location: 'Kerala, India',
      rating: 4.8,
      reviews: 76,
      hourlyRate: '₹170',
      dailyRate: '₹1360',
      availability: 'Available',
      phone: '+91 98765 43217',
      email: 'kavitha.nair@email.com',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
      premium: false,
      completedJobs: 54,
      responseTime: '< 2 hours',
      languages: ['Malayalam', 'Tamil', 'English'],
      successRate: 96,
      lastActive: '1 hour ago',
      badges: ['soil-expert', 'conservation-specialist'],
      specializations: ['Soil Health', 'Fertility Management'],
      description: 'Soil management expert specializing in sustainable soil health practices.',
      certifications: ['Soil Science', 'Conservation Practices'],
      equipment: ['Soil Testing Kit', 'pH Meters'],
      workingHours: '7 AM - 5 PM',
      emergencyAvailable: false
    }
  ];

  const teams = [
    {
      id: 't1',
      name: 'Green Harvesters',
      teamLeader: 'Prakash Sharma',
      teamSize: 8,
      specialization: 'Rice Plantation & Harvesting',
      rating: 4.7,
      reviews: 45,
      dailyRate: '₹5000',
      location: 'Punjab, India',
      availability: 'Available',
      phone: '+91 98765 43220',
      email: 'green.harvesters@email.com',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=150&h=150&fit=crop&crop=face',
      verified: true,
      completedProjects: 67,
      responseTime: '< 4 hours',
      successRate: 94,
      lastActive: '3 hours ago',
      description: 'Experienced team specializing in rice cultivation and harvesting with modern techniques.',
      equipment: ['Tractors', 'Harvesters', 'Irrigation Equipment'],
      workingHours: '6 AM - 7 PM',
      emergencyAvailable: true
    },
    {
      id: 't2',
      name: 'Farming Solutions',
      teamLeader: 'Anita Desai',
      teamSize: 12,
      specialization: 'Complete Farm Management',
      rating: 4.9,
      reviews: 78,
      dailyRate: '₹8000',
      location: 'Maharashtra, India',
      availability: 'Available',
      phone: '+91 98765 43221',
      email: 'farming.solutions@email.com',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=150&h=150&fit=crop&crop=face',
      verified: true,
      completedProjects: 89,
      responseTime: '< 2 hours',
      successRate: 97,
      lastActive: '1 hour ago',
      description: 'Full-service agricultural team providing end-to-end farm management solutions.',
      equipment: ['Complete Farm Equipment', 'Soil Testing Kit', 'Drones'],
      workingHours: '5 AM - 8 PM',
      emergencyAvailable: true
    },
    {
      id: 't3',
      name: 'Organic Experts',
      teamLeader: 'Ravi Kumar',
      teamSize: 6,
      specialization: 'Organic Farming & Certification',
      rating: 4.8,
      reviews: 34,
      dailyRate: '₹6000',
      location: 'Karnataka, India',
      availability: 'Available',
      phone: '+91 98765 43222',
      email: 'organic.experts@email.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true,
      completedProjects: 45,
      responseTime: '< 3 hours',
      successRate: 98,
      lastActive: '2 hours ago',
      description: 'Specialized team for organic farming practices and certification processes.',
      equipment: ['Organic Fertilizers', 'Bio-pesticides', 'Certification Tools'],
      workingHours: '6 AM - 6 PM',
      emergencyAvailable: false
    }
  ];

  const jobs: Job[] = [
    {
      id: 'j1',
      title: 'Rice Harvesting Team Required',
      type: 'seasonal',
      description: 'Need experienced team for rice harvesting in 50-acre farm. Must have own equipment.',
      requirements: ['Experience in rice harvesting', 'Own harvesting equipment', 'Team of 6-8 people'],
      location: 'Punjab, India',
      payRate: '₹5000/day',
      deadline: '2024-01-15',
      postedBy: 'Farmer Singh',
      postedDate: '2024-01-01',
      applications: 12,
      status: 'active',
      priority: 'urgent',
      category: 'harvesting',
      duration: '15 days',
      benefits: ['Food provided', 'Accommodation', 'Bonus on completion']
    },
    {
      id: 'j2',
      title: 'Organic Farm Management',
      type: 'contract',
      description: 'Looking for organic farming specialists to manage 25-acre organic farm.',
      requirements: ['Organic farming certification', 'Minimum 5 years experience', 'Knowledge of bio-fertilizers'],
      location: 'Maharashtra, India',
      payRate: '₹3000/day',
      deadline: '2024-01-20',
      postedBy: 'Green Farms Ltd',
      postedDate: '2024-01-02',
      applications: 8,
      status: 'active',
      priority: 'high',
      category: 'planting',
      duration: '6 months',
      benefits: ['Health insurance', 'Performance bonus', 'Training provided']
    },
    {
      id: 'j3',
      title: 'Irrigation System Installation',
      type: 'temporary',
      description: 'Need skilled workers for drip irrigation system installation across 100 acres.',
      requirements: ['Irrigation system experience', 'Technical knowledge', 'Physical fitness'],
      location: 'Gujarat, India',
      payRate: '₹400/hour',
      deadline: '2024-01-25',
      postedBy: 'AgroTech Solutions',
      postedDate: '2024-01-03',
      applications: 15,
      status: 'active',
      priority: 'standard',
      category: 'irrigation',
      duration: '1 month',
      benefits: ['Skill development', 'Certificate', 'Travel allowance']
    }
  ];

  // Filtering and sorting logic
  const filteredWorkers = useMemo(() => {
    let filtered = workers.filter(worker => {
      const matchesCategory = selectedCategory === 'all' || worker.category === selectedCategory;
      const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           worker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           worker.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !filterLocation || filterLocation === 'all' ||
                             worker.location.toLowerCase().includes(filterLocation.toLowerCase());
      const matchesExperience = !filterExperience || filterExperience === 'all' ||
                               checkExperienceMatch(worker.experience, filterExperience);
      const matchesAvailability = !filterAvailability || filterAvailability === 'all' ||
                                 worker.availability.toLowerCase().includes(filterAvailability.toLowerCase());

      return matchesCategory && matchesSearch && matchesLocation && matchesExperience && matchesAvailability;
    });

    // Sort workers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        case 'rate':
          return parseInt(b.hourlyRate.replace('₹', '')) - parseInt(a.hourlyRate.replace('₹', ''));
        case 'availability':
          return a.availability === 'Available' ? -1 : 1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [workers, selectedCategory, searchTerm, filterLocation, filterExperience, filterAvailability, sortBy]);

  const checkExperienceMatch = (experience: string, filter: string) => {
    const years = parseInt(experience);
    switch (filter) {
      case '0-2':
        return years >= 0 && years <= 2;
      case '3-5':
        return years >= 3 && years <= 5;
      case '6-10':
        return years >= 6 && years <= 10;
      case '10+':
        return years > 10;
      default:
        return true;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredWorkers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWorkers = filteredWorkers.slice(startIndex, startIndex + itemsPerPage);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  // Handler functions
  const handleHireWorker = (worker: Worker) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`${t('worker-hired')}: ${worker.name}`);
    }, 1500);
  };

  const handleViewProfile = (worker: Worker) => {
    setSelectedWorker(worker);
    setShowWorkerModal(true);
  };

  const handleSendMessage = (worker: Worker) => {
    alert(`${t('message-sent')} ${worker.name}`);
  };

  const toggleFavorite = (workerId: string) => {
    setFavoriteWorkers(prev =>
      prev.includes(workerId)
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Hero Section with Real-time Stats */}
        <motion.div 
          className="relative overflow-hidden bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative container mx-auto px-4 py-16">
            <motion.div 
              className="text-center mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                {t('labor-management')}
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100"
                variants={itemVariants}
              >
                {t('labor-description')}
              </motion.p>

              {/* Feature Badges */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 mb-8"
                variants={itemVariants}
              >
                {[
                  { key: 'skill-matching', icon: Target },
                  { key: 'real-time-availability', icon: Activity },
                  { key: 'verified-workers', icon: Shield },
                  { key: 'instant-hiring', icon: Zap },
                  { key: 'performance-tracking', icon: BarChart3 },
                  { key: 'smart-recommendations', icon: Sparkles }
                ].map(({ key, icon: Icon }) => (
                  <motion.div
                    key={key}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{t(key)}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Real-time Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { label: 'worker-profiles', value: realTimeData.activeWorkers, icon: Users, color: 'from-blue-400 to-blue-600' },
                { label: 'real-time-availability', value: realTimeData.availableNow, icon: Activity, color: 'from-green-400 to-green-600' },
                { label: 'post-jobs', value: realTimeData.jobsPosted, icon: Briefcase, color: 'from-purple-400 to-purple-600' },
                { label: 'hiring-confirmed', value: realTimeData.successfulHires, icon: CheckCircle, color: 'from-orange-400 to-orange-600' }
              ].map(({ label, value, icon: Icon, color }) => (
                <motion.div
                  key={label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    <motion.span
                      key={value}
                      initial={{ scale: 1.2, color: '#fbbf24' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      transition={{ duration: 0.3 }}
                    >
                      {value.toLocaleString()}
                    </motion.span>
                  </div>
                  <div className="text-sm text-blue-100">{t(label)}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="find-workers" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                {t('find-workers')}
              </TabsTrigger>
              <TabsTrigger value="hire-teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('hire-teams')}
              </TabsTrigger>
              <TabsTrigger value="post-jobs" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('post-jobs')}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t('worker-analytics')}
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {t('job-marketplace')}
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('labor-insights')}
              </TabsTrigger>
            </TabsList>

            {/* Find Workers Tab */}
            <TabsContent value="find-workers">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Search and Filters */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder={t('search-workers')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        {t('filter-by-skills')}
                        {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showFilters && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                            <Select value={filterLocation} onValueChange={setFilterLocation}>
                              <SelectTrigger>
                                <SelectValue placeholder={t('filter-by-location')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">{t('location')}</SelectItem>
                                <SelectItem value="punjab">Punjab</SelectItem>
                                <SelectItem value="haryana">Haryana</SelectItem>
                                <SelectItem value="gujarat">Gujarat</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={filterExperience} onValueChange={setFilterExperience}>
                              <SelectTrigger>
                                <SelectValue placeholder={t('filter-by-experience')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">{t('experience')}</SelectItem>
                                <SelectItem value="0-2">0-2 {t('years-experience')}</SelectItem>
                                <SelectItem value="3-5">3-5 {t('years-experience')}</SelectItem>
                                <SelectItem value="6-10">6-10 {t('years-experience')}</SelectItem>
                                <SelectItem value="10+">10+ {t('years-experience')}</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger>
                                <SelectValue placeholder={t('sort-by')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rating">{t('sort-by-rating')}</SelectItem>
                                <SelectItem value="experience">{t('sort-by-experience')}</SelectItem>
                                <SelectItem value="rate">{t('sort-by-rate')}</SelectItem>
                                <SelectItem value="availability">{t('sort-by-availability')}</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button variant="outline" onClick={() => {
                              setFilterLocation('');
                              setFilterExperience('');
                              setFilterRate('');
                              setFilterAvailability('');
                            }}>
                              {t('clear-filters')}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Worker Categories */}
                <motion.div
                  className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {workerCategories.map(({ id, nameKey, count, icon: Icon }) => (
                    <motion.div
                      key={id}
                      variants={itemVariants}
                      whileHover="hover"
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(id)}
                    >
                      <motion.div
                        className={`p-4 rounded-xl text-center transition-all duration-300 ${
                          selectedCategory === id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'bg-white hover:bg-gray-50 border border-gray-200'
                        }`}
                        variants={cardHoverVariants}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-2 ${
                          selectedCategory === id ? 'text-white' : 'text-gray-600'
                        }`} />
                        <div className={`text-sm font-medium mb-1 ${
                          selectedCategory === id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {t(nameKey)}
                        </div>
                        <div className={`text-xs ${
                          selectedCategory === id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {count}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Workers Grid */}
                {filteredWorkers.length > 0 ? (
                  <>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {paginatedWorkers.map((worker) => (
                    <motion.div
                      key={worker.id}
                      variants={itemVariants}
                      whileHover="hover"
                      className="cursor-pointer"
                    >
                      <motion.div
                        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                        variants={cardHoverVariants}
                      >
                        <div className="relative">
                          <img
                            src={worker.image}
                            alt={worker.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                            {worker.verified && (
                              <Badge className="bg-green-500 text-white">
                                <Shield className="h-3 w-3 mr-1" />
                                {t('verified-badge')}
                              </Badge>
                            )}
                            {worker.premium && (
                              <Badge className="bg-purple-500 text-white">
                                <Award className="h-3 w-3 mr-1" />
                                {t('premium-worker')}
                              </Badge>
                            )}
                          </div>
                          <div className="absolute top-4 right-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="bg-white/80 backdrop-blur-sm hover:bg-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFavoriteWorkers(prev =>
                                  prev.includes(worker.id)
                                    ? prev.filter(id => id !== worker.id)
                                    : [...prev, worker.id]
                                );
                              }}
                            >
                              <Heart className={`h-4 w-4 ${
                                favoriteWorkers.includes(worker.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-gray-600'
                              }`} />
                            </Button>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Badge className={`${
                              worker.availability === 'Available'
                                ? 'bg-green-500'
                                : 'bg-orange-500'
                            } text-white`}>
                              <Activity className="h-3 w-3 mr-1" />
                              {worker.availability}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {worker.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <MapPin className="h-4 w-4" />
                                {worker.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{worker.rating}</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                  ({worker.reviews} {t('rating')})
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {worker.hourlyRate}
                              </div>
                              <div className="text-sm text-gray-500">
                                {t('hourly-rate')}
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {worker.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {worker.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{worker.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <span className="text-gray-500">{t('experience')}:</span>
                              <div className="font-medium">{worker.experience}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">{t('response-time')}:</span>
                              <div className="font-medium">{worker.responseTime}</div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              size="sm"
                              onClick={() => handleHireWorker(worker)}
                              disabled={isLoading}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              {isLoading ? t('hiring-confirmed') : t('hire-now')}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProfile(worker)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendMessage(worker)}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    className="flex justify-center items-center gap-4 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t('previous')}
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      {t('next')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
                </>
                ) : (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('no-workers-found')}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t('try-different-filters')}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setFilterLocation('');
                        setFilterExperience('');
                        setFilterAvailability('');
                        setCurrentPage(1);
                      }}
                    >
                      {t('clear-filters')}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            {/* Hire Teams Tab */}
            <TabsContent value="hire-teams">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('specialized-teams')}</h2>
                  <p className="text-gray-600">{t('team-management')}</p>
                </div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {teams.map((team) => (
                    <motion.div
                      key={team.id}
                      variants={itemVariants}
                      whileHover="hover"
                      className="cursor-pointer"
                    >
                      <motion.div
                        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                        variants={cardHoverVariants}
                      >
                        <div className="relative">
                          <img
                            src={team.image}
                            alt={team.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            {team.verified && (
                              <Badge className="bg-green-500 text-white">
                                <Shield className="h-3 w-3 mr-1" />
                                {t('verified-badge')}
                              </Badge>
                            )}
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Badge className={`${
                              team.availability === 'Available'
                                ? 'bg-green-500'
                                : 'bg-orange-500'
                            } text-white`}>
                              <Activity className="h-3 w-3 mr-1" />
                              {team.availability}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {team.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Users className="h-4 w-4" />
                                {team.teamSize} {t('team-size')}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <MapPin className="h-4 w-4" />
                                {team.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{team.rating}</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                  ({team.reviews} {t('reviews')})
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {team.dailyRate}
                              </div>
                              <div className="text-sm text-gray-500">
                                {t('daily-rate')}
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <Badge variant="secondary" className="text-xs">
                              {team.specialization}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <span className="text-gray-500">{t('team-leader')}:</span>
                              <div className="font-medium">{team.teamLeader}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">{t('success-rate')}:</span>
                              <div className="font-medium">{team.successRate}%</div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              size="sm"
                              onClick={() => alert(`${t('team-hired')}: ${team.name}`)}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              {t('hire-team')}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Post Jobs Tab */}
            <TabsContent value="post-jobs">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      {t('post-job')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {t('post-jobs')}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {t('job-marketplace')}
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('post-job')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'total-applications', value: '1,247', icon: FileText, color: 'from-blue-400 to-blue-600' },
                    { label: 'pending-applications', value: '89', icon: Clock, color: 'from-orange-400 to-orange-600' },
                    { label: 'approved-applications', value: '156', icon: CheckCircle, color: 'from-green-400 to-green-600' },
                    { label: 'success-rate', value: '94%', icon: TrendingUp, color: 'from-purple-400 to-purple-600' }
                  ].map(({ label, value, icon: Icon, color }) => (
                    <motion.div
                      key={label}
                      className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
                      <div className="text-sm text-gray-600">{t(label)}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Marketplace Tab */}
            <TabsContent value="marketplace">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('job-marketplace')}</h2>
                  <p className="text-gray-600">{t('active-jobs')}</p>
                </div>

                <motion.div
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {job.title}
                            </h3>
                            <Badge className={`${
                              job.priority === 'urgent' ? 'bg-red-500' :
                              job.priority === 'high' ? 'bg-orange-500' :
                              job.priority === 'standard' ? 'bg-blue-500' : 'bg-gray-500'
                            } text-white`}>
                              {t(job.priority)}
                            </Badge>
                            <Badge variant="outline">
                              {t(job.type)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.payRate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {job.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.deadline}
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3">{job.description}</p>

                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">{t('job-requirements')}:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.map((req, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.benefits.map((benefit, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              <span>{t('posted-by')}: {job.postedBy}</span>
                              <span className="mx-2">•</span>
                              <span>{job.applications} {t('total-applications')}</span>
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm">
                                <Send className="h-4 w-4 mr-2" />
                                Apply Now
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {t('labor-insights')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {t('labor-insights')}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {t('worker-analytics')}
                      </p>
                      <Button>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        {t('view-all')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Worker Profile Modal */}
        <Dialog open={showWorkerModal} onOpenChange={setShowWorkerModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedWorker && (
                  <>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedWorker.image} alt={selectedWorker.name} />
                      <AvatarFallback>{selectedWorker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{selectedWorker.name}</h2>
                      <p className="text-sm text-gray-600">{selectedWorker.location}</p>
                    </div>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedWorker && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('worker-details')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('rating')}:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{selectedWorker.rating}</span>
                          <span className="text-sm text-gray-500">({selectedWorker.reviews})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('experience')}:</span>
                        <span className="font-medium">{selectedWorker.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('hourly-rate')}:</span>
                        <span className="font-medium text-green-600">{selectedWorker.hourlyRate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('daily-rate')}:</span>
                        <span className="font-medium text-green-600">{selectedWorker.dailyRate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('availability')}:</span>
                        <Badge className={selectedWorker.availability === 'Available' ? 'bg-green-500' : 'bg-orange-500'}>
                          {selectedWorker.availability}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('response-time')}:</span>
                        <span className="font-medium">{selectedWorker.responseTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{t('success-rate')}:</span>
                        <span className="font-medium">{selectedWorker.successRate}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('contact-info')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedWorker.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedWorker.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{selectedWorker.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{selectedWorker.workingHours}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span>{selectedWorker.languages.join(', ')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Skills and Specializations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('skills')} & {t('specialization')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">{t('skills')}:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedWorker.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('specialization')}:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedWorker.specializations.map((spec, index) => (
                            <Badge key={index} variant="outline">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Certifications:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedWorker.certifications.map((cert, index) => (
                            <Badge key={index} className="bg-blue-500 text-white">
                              <Award className="h-3 w-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedWorker.description}</p>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleHireWorker(selectedWorker);
                      setShowWorkerModal(false);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t('hire-now')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSendMessage(selectedWorker)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('send-message')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toggleFavorite(selectedWorker.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${
                      favoriteWorkers.includes(selectedWorker.id)
                        ? 'fill-red-500 text-red-500'
                        : ''
                    }`} />
                    {favoriteWorkers.includes(selectedWorker.id) ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Labour;
