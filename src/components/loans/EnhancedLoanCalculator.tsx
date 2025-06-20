import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  DollarSign,
  Calendar,
  Percent,
  Download,
  Share
} from "lucide-react";
import { GlassCard } from "@/components/market/GlassCard";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface EnhancedLoanCalculatorProps {
  loanAmount: number;
  setLoanAmount: (amount: number) => void;
  loanTenure: number;
  setLoanTenure: (tenure: number) => void;
  interestRate: number;
  setInterestRate: (rate: number) => void;
}

export const EnhancedLoanCalculator = ({
  loanAmount,
  setLoanAmount,
  loanTenure,
  setLoanTenure,
  interestRate,
  setInterestRate
}: EnhancedLoanCalculatorProps) => {
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = loanTenure * 12;
    
    if (monthlyRate === 0) {
      return loanAmount / totalMonths;
    }
    
    const emiValue = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                     (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return emiValue;
  };

  useEffect(() => {
    const calculatedEMI = calculateEMI();
    const total = calculatedEMI * loanTenure * 12;
    const interest = total - loanAmount;
    
    setEmi(calculatedEMI);
    setTotalAmount(total);
    setTotalInterest(interest);
  }, [loanAmount, loanTenure, interestRate]);

  const pieData = [
    { name: 'Principal', value: loanAmount, color: '#10B981' },
    { name: 'Interest', value: totalInterest, color: '#F59E0B' }
  ];

  const yearlyData = Array.from({ length: loanTenure }, (_, index) => {
    const year = index + 1;
    const yearlyEMI = emi * 12;
    const remainingPrincipal = loanAmount - (loanAmount / loanTenure * year);
    const yearlyInterest = remainingPrincipal * (interestRate / 100);
    const yearlyPrincipal = yearlyEMI - yearlyInterest;
    
    return {
      year: `Year ${year}`,
      principal: Math.max(0, yearlyPrincipal),
      interest: Math.max(0, yearlyInterest),
      total: yearlyEMI
    };
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Loan Calculator</h2>
        <p className="text-gray-600">Calculate your EMI and plan your finances</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calculator Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-foliage" />
                Loan Details
              </CardTitle>
            </CardHeader>
            
            <CardContent className="px-0 space-y-6">
              {/* Loan Amount */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Loan Amount
                  </Label>
                  <Badge variant="outline">₹{loanAmount.toLocaleString()}</Badge>
                </div>
                <Slider
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  max={10000000}
                  min={50000}
                  step={50000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹50K</span>
                  <span>₹1Cr</span>
                </div>
              </div>

              {/* Loan Tenure */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Loan Tenure
                  </Label>
                  <Badge variant="outline">{loanTenure} years</Badge>
                </div>
                <Slider
                  value={[loanTenure]}
                  onValueChange={(value) => setLoanTenure(value[0])}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Interest Rate
                  </Label>
                  <Badge variant="outline">{interestRate}% p.a.</Badge>
                </div>
                <Slider
                  value={[interestRate]}
                  onValueChange={(value) => setInterestRate(value[0])}
                  max={20}
                  min={5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-2">
                <Label>Quick Select Amount:</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[100000, 500000, 1000000].map((amount) => (
                    <Button
                      key={amount}
                      variant={loanAmount === amount ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLoanAmount(amount)}
                      className="text-xs"
                    >
                      ₹{(amount / 100000).toFixed(0)}L
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* EMI Result */}
          <GlassCard className="p-6 text-center bg-gradient-to-br from-foliage/10 to-blue-500/10">
            <div className="text-3xl font-bold text-foliage-dark mb-2">
              ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-gray-600">Monthly EMI</div>
          </GlassCard>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="p-4 text-center">
              <div className="text-xl font-semibold text-gray-800">
                ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </GlassCard>
            
            <GlassCard className="p-4 text-center">
              <div className="text-xl font-semibold text-orange-600">
                ₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-sm text-gray-600">Total Interest</div>
            </GlassCard>
          </div>

          {/* Pie Chart */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Payment Breakdown
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Principal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Interest</span>
              </div>
            </div>
          </GlassCard>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" className="flex-1">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
