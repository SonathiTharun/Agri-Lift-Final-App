import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, Clock, Users, TrendingUp, Eye, Heart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/LanguageContext";
import { GlassCard } from "./GlassCard";
import { toast } from 'sonner';

interface Auction {
  id: string;
  title: string;
  description: string;
  image: string;
  currentBid: number;
  minBid: number;
  bidIncrement: number;
  totalBids: number;
  watchers: number;
  timeLeft: number; // in seconds
  seller: {
    name: string;
    rating: number;
    verified: boolean;
  };
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  status: 'active' | 'ending-soon' | 'ended';
}

const mockAuctions: Auction[] = [
  {
    id: "1",
    title: "Premium Organic Fertilizer - 50kg Bags",
    description: "High-quality organic fertilizer perfect for all crop types. Bulk quantity available.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    currentBid: 2500,
    minBid: 2000,
    bidIncrement: 100,
    totalBids: 23,
    watchers: 156,
    timeLeft: 3600, // 1 hour
    seller: {
      name: "Green Valley Farms",
      rating: 4.8,
      verified: true
    },
    category: "Fertilizers",
    condition: "new",
    status: "active"
  },
  {
    id: "2",
    title: "Smart Irrigation System - Complete Kit",
    description: "Advanced IoT-enabled irrigation system with sensors and mobile app control.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    currentBid: 15000,
    minBid: 12000,
    bidIncrement: 500,
    totalBids: 45,
    watchers: 289,
    timeLeft: 1800, // 30 minutes
    seller: {
      name: "AgriTech Solutions",
      rating: 4.9,
      verified: true
    },
    category: "Equipment",
    condition: "new",
    status: "ending-soon"
  },
  {
    id: "3",
    title: "Hybrid Tomato Seeds - Premium Variety",
    description: "High-yield hybrid tomato seeds with disease resistance. Perfect for commercial farming.",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop",
    currentBid: 800,
    minBid: 500,
    bidIncrement: 50,
    totalBids: 12,
    watchers: 78,
    timeLeft: 7200, // 2 hours
    seller: {
      name: "Seed Masters",
      rating: 4.7,
      verified: true
    },
    category: "Seeds",
    condition: "new",
    status: "active"
  }
];

export const LiveAuctions = () => {
  const { t } = useLanguage();
  const [auctions, setAuctions] = useState(mockAuctions);
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const [watchedAuctions, setWatchedAuctions] = useState<Set<string>>(new Set());

  // Update auction timers
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions(prev => prev.map(auction => ({
        ...auction,
        timeLeft: Math.max(0, auction.timeLeft - 1),
        status: auction.timeLeft <= 300 ? 'ending-soon' : auction.timeLeft <= 0 ? 'ended' : auction.status
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeLeft = (seconds: number) => {
    if (seconds <= 0) return "Ended";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleBid = (auctionId: string) => {
    const auction = auctions.find(a => a.id === auctionId);
    const bidAmount = parseFloat(bidAmounts[auctionId] || '0');
    
    if (!auction) return;
    
    if (bidAmount < auction.currentBid + auction.bidIncrement) {
      toast.error(`Minimum bid is ₹${auction.currentBid + auction.bidIncrement}`);
      return;
    }

    // Update auction with new bid
    setAuctions(prev => prev.map(a => 
      a.id === auctionId 
        ? { ...a, currentBid: bidAmount, totalBids: a.totalBids + 1 }
        : a
    ));

    setBidAmounts(prev => ({ ...prev, [auctionId]: '' }));
    toast.success(`Bid placed successfully for ₹${bidAmount}`);
  };

  const toggleWatch = (auctionId: string) => {
    setWatchedAuctions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(auctionId)) {
        newSet.delete(auctionId);
        toast.info("Removed from watchlist");
      } else {
        newSet.add(auctionId);
        toast.success("Added to watchlist");
      }
      return newSet;
    });
  };

  const AuctionCard = ({ auction, index }: { auction: Auction; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <GlassCard className="overflow-hidden">
        <div className="relative">
          <img 
            src={auction.image} 
            alt={auction.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge 
              className={`${
                auction.status === 'ending-soon' 
                  ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                  : auction.status === 'ended'
                  ? 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  : 'bg-green-500/20 text-green-300 border-green-500/30'
              }`}
            >
              <Gavel className="w-3 h-3 mr-1" />
              {auction.status === 'ending-soon' ? 'Ending Soon' : 
               auction.status === 'ended' ? 'Ended' : 'Live'}
            </Badge>
            {auction.seller.verified && (
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Verified
              </Badge>
            )}
          </div>
          <button
            onClick={() => toggleWatch(auction.id)}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-colors ${
              watchedAuctions.has(auction.id) 
                ? 'bg-red-500/20 text-red-300' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${watchedAuctions.has(auction.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-white line-clamp-2">{auction.title}</h3>
            <Badge variant="outline" className="border-white/20 text-gray-300 text-xs">
              {auction.category}
            </Badge>
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{auction.description}</p>

          <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {auction.totalBids} bids
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {auction.watchers} watching
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Current Bid</span>
              <motion.span 
                key={auction.currentBid}
                initial={{ scale: 1.1, color: '#10b981' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="text-xl font-bold text-white"
              >
                ₹{auction.currentBid.toLocaleString()}
              </motion.span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Min increment: ₹{auction.bidIncrement}</span>
              <span>by {auction.seller.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Clock className={`w-4 h-4 ${
              auction.status === 'ending-soon' ? 'text-red-400' : 'text-gray-400'
            }`} />
            <span className={`text-sm font-medium ${
              auction.status === 'ending-soon' ? 'text-red-400' : 'text-gray-300'
            }`}>
              {formatTimeLeft(auction.timeLeft)}
            </span>
            {auction.status === 'ending-soon' && (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
          </div>

          {auction.status !== 'ended' && (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Min ₹${auction.currentBid + auction.bidIncrement}`}
                value={bidAmounts[auction.id] || ''}
                onChange={(e) => setBidAmounts(prev => ({ ...prev, [auction.id]: e.target.value }))}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button 
                onClick={() => handleBid(auction.id)}
                className="bg-green-600 hover:bg-green-700"
                disabled={!bidAmounts[auction.id] || parseFloat(bidAmounts[auction.id]) < auction.currentBid + auction.bidIncrement}
              >
                <Gavel className="w-4 h-4 mr-1" />
                Bid
              </Button>
            </div>
          )}

          {auction.status === 'ended' && (
            <Button disabled className="w-full">
              Auction Ended
            </Button>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Gavel className="w-8 h-8" />
            {t('marketplace.liveAuctions')}
          </h2>
          <p className="text-gray-300">{t('marketplace.auctionsDescription')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            {auctions.filter(a => a.status === 'active').length} Active
          </Badge>
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            {auctions.filter(a => a.status === 'ending-soon').length} Ending Soon
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction, index) => (
          <AuctionCard key={auction.id} auction={auction} index={index} />
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" variant="outline" className="border-white/20 text-gray-300">
          View All Auctions
        </Button>
      </div>
    </div>
  );
};
