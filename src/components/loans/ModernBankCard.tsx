import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Clock, 
  TrendingUp, 
  Shield, 
  ExternalLink,
  Plus,
  Check,
  Info,
  Banknote,
  FileText,
  Users
} from "lucide-react";
import { GlassCard } from "@/components/market/GlassCard";

interface Bank {
  name: string;
  logo: string;
  alt: string;
  website: string;
  features: string[];
  rate: string;
  type: "Government" | "Private";
  country: string;
  rating: number;
  processingTime: string;
  minAmount: number;
  maxAmount: number;
  eligibility: string[];
  documents: string[];
}

interface ModernBankCardProps {
  bank: Bank;
  onAddToComparison: () => void;
  isInComparison: boolean;
}

export const ModernBankCard = ({ bank, onAddToComparison, isInComparison }: ModernBankCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const rateRange = bank.rate.split(' - ');
  const minRate = parseFloat(rateRange[0].replace('%', ''));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <GlassCard className="h-full overflow-hidden bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-300">
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={bank.logo} 
                  alt={bank.alt}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                />
                {bank.type === "Government" && (
                  <div className="absolute -top-1 -right-1">
                    <Shield className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-foliage transition-colors">
                  {bank.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={bank.type === "Government" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {bank.type}
                  </Badge>
                  <span className="text-xs text-gray-500">{bank.country}</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddToComparison}
              disabled={isInComparison}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isInComparison ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(bank.rating) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({bank.rating})</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Interest Rate */}
          <div className="text-center p-4 bg-gradient-to-r from-foliage/10 to-blue-500/10 rounded-lg">
            <div className="text-2xl font-bold text-foliage-dark">{bank.rate}</div>
            <div className="text-sm text-gray-600">Interest Rate</div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{bank.processingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-green-500" />
              <span>₹{(bank.minAmount / 100000).toFixed(1)}L+</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Key Features:</h4>
            <div className="space-y-1">
              {bank.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Details */}
          <motion.div
            initial={false}
            animate={{ height: showDetails ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-3 border-t">
              <div>
                <h5 className="font-medium text-sm mb-2">Eligibility:</h5>
                <div className="space-y-1">
                  {bank.eligibility.slice(0, 2).map((req, idx) => (
                    <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {req}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-sm mb-2">Required Documents:</h5>
                <div className="flex flex-wrap gap-1">
                  {bank.documents.slice(0, 3).map((doc, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1"
            >
              <Info className="h-4 w-4 mr-1" />
              {showDetails ? "Less Info" : "More Info"}
            </Button>
            
            <Button
              size="sm"
              className="flex-1 bg-foliage hover:bg-foliage-dark"
              asChild
            >
              <a 
                href={bank.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1"
              >
                Apply Now
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>

          {/* Processing indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="text-xs text-center text-gray-500 flex items-center justify-center gap-1"
          >
            <TrendingUp className="h-3 w-3" />
            Fast approval process
          </motion.div>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
};
