
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CropRecommendation } from './types';

interface CustomSelectionTabProps {
  onAddCrop: (crop: CropRecommendation, area: number) => void;
  maxArea: number;
}

const CustomSelectionTab = ({ onAddCrop, maxArea }: CustomSelectionTabProps) => {
  const cropOptions = ['Wheat', 'Rice', 'Corn', 'Tomato', 'Potato', 'Onion', 'Cotton', 'Sugarcane'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Crop Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Select crops manually based on your experience and preferences.
        </p>
        <div className="space-y-4">
          {cropOptions.map((cropName) => (
            <div key={cropName} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex-1 font-medium">{cropName}</div>
              <Input
                type="number"
                step="0.1"
                min="0"
                max={maxArea}
                placeholder="Area (acres)"
                className="w-32"
                onChange={(e) => {
                  const area = parseFloat(e.target.value) || 0;
                  if (area > 0) {
                    onAddCrop({
                      id: cropName.toLowerCase(),
                      name: cropName,
                      suitability: 75,
                      expectedYield: 3.0,
                      marketPrice: 2000,
                      profitability: 70,
                      riskLevel: 'medium',
                      waterRequirement: 'medium',
                      growingSeason: 'Season varies',
                      marketDemand: 'medium',
                      reasons: ['Manual selection']
                    }, area);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomSelectionTab;
