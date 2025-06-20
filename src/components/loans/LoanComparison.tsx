import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Star, 
  Clock, 
  Shield, 
  TrendingUp,
  ExternalLink,
  Check,
  AlertCircle
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

interface LoanComparisonProps {
  banks: Bank[];
  onRemove: (bankName: string) => void;
}

export const LoanComparison = ({ banks, onRemove }: LoanComparisonProps) => {
  if (banks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <GlassCard className="p-8 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Banks Selected</h3>
          <p className="text-gray-600 mb-4">
            Add banks to comparison from the Browse Loans tab to see detailed comparisons.
          </p>
          <Button variant="outline">
            Browse Loans
          </Button>
        </GlassCard>
      </motion.div>
    );
  }

  const comparisonFeatures = [
    { key: 'rate', label: 'Interest Rate', icon: TrendingUp },
    { key: 'rating', label: 'Rating', icon: Star },
    { key: 'processingTime', label: 'Processing Time', icon: Clock },
    { key: 'type', label: 'Bank Type', icon: Shield },
    { key: 'minAmount', label: 'Min Amount', icon: null },
    { key: 'maxAmount', label: 'Max Amount', icon: null }
  ];

  const getBestValue = (feature: string) => {
    switch (feature) {
      case 'rate':
        return Math.min(...banks.map(bank => parseFloat(bank.rate.split(' - ')[0].replace('%', ''))));
      case 'rating':
        return Math.max(...banks.map(bank => bank.rating));
      case 'minAmount':
        return Math.min(...banks.map(bank => bank.minAmount));
      case 'maxAmount':
        return Math.max(...banks.map(bank => bank.maxAmount));
      default:
        return null;
    }
  };

  const isBestValue = (bank: Bank, feature: string) => {
    const bestValue = getBestValue(feature);
    if (bestValue === null) return false;
    
    switch (feature) {
      case 'rate':
        return parseFloat(bank.rate.split(' - ')[0].replace('%', '')) === bestValue;
      case 'rating':
        return bank.rating === bestValue;
      case 'minAmount':
        return bank.minAmount === bestValue;
      case 'maxAmount':
        return bank.maxAmount === bestValue;
      default:
        return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Compare Loans</h2>
        <p className="text-gray-600">Side-by-side comparison of selected banks</p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Bank Headers */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${banks.length}, 1fr)` }}>
            <div></div>
            {banks.map((bank, index) => (
              <motion.div
                key={bank.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard className="p-4 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(bank.name)}
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="text-center">
                    <img 
                      src={bank.logo} 
                      alt={bank.alt}
                      className="w-12 h-12 mx-auto mb-2 rounded-lg object-cover"
                    />
                    <h3 className="font-semibold text-sm">{bank.name}</h3>
                    <Badge 
                      variant={bank.type === "Government" ? "default" : "secondary"}
                      className="text-xs mt-1"
                    >
                      {bank.type}
                    </Badge>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Comparison Rows */}
          <div className="space-y-4">
            {comparisonFeatures.map((feature, featureIndex) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * featureIndex }}
                className="grid gap-4"
                style={{ gridTemplateColumns: `200px repeat(${banks.length}, 1fr)` }}
              >
                {/* Feature Label */}
                <div className="flex items-center gap-2 font-medium text-gray-700">
                  {feature.icon && <feature.icon className="h-4 w-4" />}
                  {feature.label}
                </div>

                {/* Feature Values */}
                {banks.map((bank) => (
                  <GlassCard 
                    key={`${bank.name}-${feature.key}`}
                    className={`p-3 text-center transition-all duration-200 ${
                      isBestValue(bank, feature.key) 
                        ? 'ring-2 ring-green-500 bg-green-50/50' 
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <div className="relative">
                      {isBestValue(bank, feature.key) && (
                        <div className="absolute -top-1 -right-1">
                          <Badge className="bg-green-500 text-white text-xs px-1 py-0">
                            Best
                          </Badge>
                        </div>
                      )}
                      
                      {feature.key === 'rate' && (
                        <div className="font-semibold text-foliage-dark">{bank.rate}</div>
                      )}
                      
                      {feature.key === 'rating' && (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold">{bank.rating}</span>
                        </div>
                      )}
                      
                      {feature.key === 'processingTime' && (
                        <div className="text-sm font-medium">{bank.processingTime}</div>
                      )}
                      
                      {feature.key === 'type' && (
                        <Badge variant={bank.type === "Government" ? "default" : "secondary"}>
                          {bank.type}
                        </Badge>
                      )}
                      
                      {feature.key === 'minAmount' && (
                        <div className="text-sm font-medium">
                          ₹{(bank.minAmount / 100000).toFixed(1)}L
                        </div>
                      )}
                      
                      {feature.key === 'maxAmount' && (
                        <div className="text-sm font-medium">
                          ₹{(bank.maxAmount / 100000).toFixed(1)}L
                        </div>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </motion.div>
            ))}

            {/* Features Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid gap-4"
              style={{ gridTemplateColumns: `200px repeat(${banks.length}, 1fr)` }}
            >
              <div className="font-medium text-gray-700">Key Features</div>
              {banks.map((bank) => (
                <GlassCard key={`${bank.name}-features`} className="p-3">
                  <div className="space-y-1">
                    {bank.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-xs">
                        <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid gap-4"
              style={{ gridTemplateColumns: `200px repeat(${banks.length}, 1fr)` }}
            >
              <div className="font-medium text-gray-700">Apply</div>
              {banks.map((bank) => (
                <Button
                  key={`${bank.name}-apply`}
                  className="bg-foliage hover:bg-foliage-dark"
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
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">Comparison Summary</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Lowest Rate:</span>
              <div className="text-green-600 font-semibold">
                {getBestValue('rate')}% 
                ({banks.find(b => parseFloat(b.rate.split(' - ')[0].replace('%', '')) === getBestValue('rate'))?.name})
              </div>
            </div>
            <div>
              <span className="font-medium">Highest Rating:</span>
              <div className="text-blue-600 font-semibold">
                {getBestValue('rating')} stars
                ({banks.find(b => b.rating === getBestValue('rating'))?.name})
              </div>
            </div>
            <div>
              <span className="font-medium">Highest Loan Amount:</span>
              <div className="text-purple-600 font-semibold">
                ₹{((getBestValue('maxAmount') || 0) / 100000).toFixed(1)}L
                ({banks.find(b => b.maxAmount === getBestValue('maxAmount'))?.name})
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
