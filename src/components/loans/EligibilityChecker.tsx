import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  DollarSign,
  Calendar,
  MapPin,
  TrendingUp
} from "lucide-react";
import { GlassCard } from "@/components/market/GlassCard";

interface EligibilityData {
  age: string;
  monthlyIncome: string;
  existingLoans: string;
  creditScore: string;
  landOwnership: string;
  farmingExperience: string;
  loanAmount: string;
}

interface EligibilityResult {
  score: number;
  status: "excellent" | "good" | "fair" | "poor";
  recommendations: string[];
  eligibleBanks: string[];
}

export const EligibilityChecker = () => {
  const [formData, setFormData] = useState<EligibilityData>({
    age: '',
    monthlyIncome: '',
    existingLoans: '',
    creditScore: '',
    landOwnership: '',
    farmingExperience: '',
    loanAmount: ''
  });
  
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const updateFormData = (field: keyof EligibilityData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEligibility = async () => {
    setIsChecking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple scoring algorithm
    let score = 0;
    const recommendations: string[] = [];
    const eligibleBanks: string[] = [];

    // Age scoring
    const age = parseInt(formData.age);
    if (age >= 18 && age <= 65) {
      score += 20;
    } else {
      recommendations.push("Age should be between 18-65 years for most loan schemes");
    }

    // Income scoring
    const income = parseInt(formData.monthlyIncome);
    if (income >= 25000) {
      score += 25;
      eligibleBanks.push("State Bank of India", "HDFC Bank", "ICICI Bank");
    } else if (income >= 15000) {
      score += 15;
      eligibleBanks.push("State Bank of India", "Regional Rural Banks");
    } else {
      recommendations.push("Consider increasing income sources or apply for smaller loan amounts");
    }

    // Credit Score
    const creditScore = parseInt(formData.creditScore);
    if (creditScore >= 750) {
      score += 25;
    } else if (creditScore >= 650) {
      score += 15;
    } else {
      score += 5;
      recommendations.push("Work on improving your credit score for better loan terms");
    }

    // Land Ownership
    if (formData.landOwnership === "owned") {
      score += 20;
    } else if (formData.landOwnership === "leased") {
      score += 10;
      recommendations.push("Some banks offer loans to tenant farmers with proper agreements");
    }

    // Farming Experience
    const experience = parseInt(formData.farmingExperience);
    if (experience >= 3) {
      score += 10;
    } else {
      recommendations.push("Consider getting training or mentorship in farming practices");
    }

    // Determine status
    let status: EligibilityResult["status"];
    if (score >= 80) status = "excellent";
    else if (score >= 60) status = "good";
    else if (score >= 40) status = "fair";
    else status = "poor";

    if (recommendations.length === 0) {
      recommendations.push("You have excellent eligibility! Apply with confidence.");
    }

    setResult({
      score,
      status,
      recommendations,
      eligibleBanks: [...new Set(eligibleBanks)]
    });
    
    setIsChecking(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600";
      case "good": return "text-blue-600";
      case "fair": return "text-yellow-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "good": return <CheckCircle className="h-6 w-6 text-blue-500" />;
      case "fair": return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case "poor": return <XCircle className="h-6 w-6 text-red-500" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Loan Eligibility Checker</h2>
        <p className="text-gray-600">Check your eligibility for agricultural loans in minutes</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <GlassCard className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-foliage" />
              Your Information
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-0 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="50000"
                  value={formData.monthlyIncome}
                  onChange={(e) => updateFormData('monthlyIncome', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditScore">Credit Score</Label>
              <Select value={formData.creditScore} onValueChange={(value) => updateFormData('creditScore', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select credit score range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="800">Excellent (750+)</SelectItem>
                  <SelectItem value="700">Good (650-749)</SelectItem>
                  <SelectItem value="600">Fair (550-649)</SelectItem>
                  <SelectItem value="500">Poor (Below 550)</SelectItem>
                  <SelectItem value="0">Don't know</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="landOwnership">Land Ownership</Label>
              <Select value={formData.landOwnership} onValueChange={(value) => updateFormData('landOwnership', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ownership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owned">Owned</SelectItem>
                  <SelectItem value="leased">Leased/Tenant</SelectItem>
                  <SelectItem value="family">Family Land</SelectItem>
                  <SelectItem value="none">No Land</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="farmingExperience">Farming Experience (years)</Label>
                <Input
                  id="farmingExperience"
                  type="number"
                  placeholder="5"
                  value={formData.farmingExperience}
                  onChange={(e) => updateFormData('farmingExperience', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Desired Loan Amount (₹)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="500000"
                  value={formData.loanAmount}
                  onChange={(e) => updateFormData('loanAmount', e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={calculateEligibility}
              disabled={isChecking || !formData.age || !formData.monthlyIncome}
              className="w-full bg-foliage hover:bg-foliage-dark"
            >
              {isChecking ? "Checking Eligibility..." : "Check Eligibility"}
            </Button>
          </CardContent>
        </GlassCard>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <GlassCard className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  {getStatusIcon(result.status)}
                </div>
                <div className="text-3xl font-bold mb-2">
                  {result.score}/100
                </div>
                <div className={`text-lg font-semibold capitalize ${getStatusColor(result.status)}`}>
                  {result.status} Eligibility
                </div>
                <Progress value={result.score} className="mt-4" />
              </GlassCard>

              {/* Eligible Banks */}
              {result.eligibleBanks.length > 0 && (
                <GlassCard className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Eligible Banks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.eligibleBanks.map((bank) => (
                      <Badge key={bank} className="bg-green-100 text-green-800">
                        {bank}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Recommendations */}
              <GlassCard className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ) : (
            <GlassCard className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Check?</h3>
              <p className="text-gray-600">
                Fill in your details to get an instant eligibility assessment for agricultural loans.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </motion.div>
  );
};
