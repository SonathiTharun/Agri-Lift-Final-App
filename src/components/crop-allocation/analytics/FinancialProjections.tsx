
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { getCropById } from '@/data/cropsDatabase';

interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

interface LandDetails {
  totalArea: number;
  soilType: string;
  climateType: string;
}

interface FinancialProjectionsProps {
  selectedCrops: SelectedCrop[];
  landDetails: LandDetails;
}

const FinancialProjections: React.FC<FinancialProjectionsProps> = ({ selectedCrops, landDetails }) => {
  const calculateFinancials = () => {
    let totalRevenue = 0;
    let totalCosts = 0;
    let cropFinancials: Array<{
      crop: SelectedCrop;
      revenue: number;
      costs: number;
      profit: number;
      roi: number;
    }> = [];

    selectedCrops.forEach(crop => {
      const cropData = getCropById(crop.id);
      if (!cropData) return;

      // Revenue calculation
      const revenue = crop.estimatedYield * cropData.marketPrice;

      // Cost calculation (simplified)
      const seedCost = crop.area * 2000; // ₹2000 per acre for seeds
      const fertilizerCost = crop.area * 5000; // ₹5000 per acre for fertilizer
      const laborCost = crop.area * 8000; // ₹8000 per acre for labor
      const irrigationCost = crop.area * cropData.waterRequirement * 100; // Water cost
      const miscCost = crop.area * 3000; // Miscellaneous costs

      const totalCropCosts = seedCost + fertilizerCost + laborCost + irrigationCost + miscCost;
      const profit = revenue - totalCropCosts;
      const roi = totalCropCosts > 0 ? (profit / totalCropCosts) * 100 : 0;

      cropFinancials.push({
        crop,
        revenue,
        costs: totalCropCosts,
        profit,
        roi
      });

      totalRevenue += revenue;
      totalCosts += totalCropCosts;
    });

    const totalProfit = totalRevenue - totalCosts;
    const overallROI = totalCosts > 0 ? (totalProfit / totalCosts) * 100 : 0;

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      overallROI,
      cropFinancials
    };
  };

  const financials = calculateFinancials();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Overall Financial Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(financials.totalRevenue)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(financials.totalCosts)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className={`h-4 w-4 mr-1 ${financials.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-lg font-bold ${financials.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(financials.totalProfit)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PieChart className={`h-4 w-4 mr-1 ${financials.overallROI >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-lg font-bold ${financials.overallROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {financials.overallROI.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crop-wise Financial Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Crop-wise Financial Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financials.cropFinancials.map(({ crop, revenue, costs, profit, roi }) => (
              <div key={crop.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-lg">{crop.name}</h4>
                  <Badge variant={profit >= 0 ? "default" : "destructive"}>
                    {profit >= 0 ? "Profitable" : "Loss"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Area:</span>
                    <p className="font-medium">{crop.area.toFixed(1)} acres</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue:</span>
                    <p className="font-medium text-green-600">{formatCurrency(revenue)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Costs:</span>
                    <p className="font-medium text-red-600">{formatCurrency(costs)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">ROI:</span>
                    <p className={`font-medium ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {roi.toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <span className="text-gray-600 text-sm">Net Profit:</span>
                  <p className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(profit)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cost Breakdown (Per Acre Average)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-600">Seeds</p>
              <p className="font-bold">₹2,000</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Fertilizer</p>
              <p className="font-bold">₹5,000</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Labor</p>
              <p className="font-bold">₹8,000</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Irrigation</p>
              <p className="font-bold">₹3,000</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Miscellaneous</p>
              <p className="font-bold">₹3,000</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialProjections;
