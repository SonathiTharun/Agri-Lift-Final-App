
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, DollarSign, Droplets, Clock } from "lucide-react";
import { CropRecommendation } from './types';
import { getRiskColor } from './cropAllocationUtils';

interface CropRecommendationCardProps {
  crop: CropRecommendation;
  onAddCrop: (crop: CropRecommendation, area: number) => void;
  maxArea: number;
}

const CropRecommendationCard = ({ crop, onAddCrop, maxArea }: CropRecommendationCardProps) => {
  return (
    <Card key={crop.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-blue-100 text-blue-800">
                  {crop.suitability}% Match
                </Badge>
                <Badge className={getRiskColor(crop.riskLevel)}>
                  {crop.riskLevel} risk
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ₹{(crop.expectedYield * crop.marketPrice).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">per acre potential</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-blue-500 mr-1" />
            </div>
            <div className="text-sm text-gray-600">Yield</div>
            <div className="font-semibold">{crop.expectedYield} tons/acre</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-green-500 mr-1" />
            </div>
            <div className="text-sm text-gray-600">Price</div>
            <div className="font-semibold">₹{crop.marketPrice}/ton</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Droplets className="h-4 w-4 text-blue-500 mr-1" />
            </div>
            <div className="text-sm text-gray-600">Water Need</div>
            <div className="font-semibold capitalize">{crop.waterRequirement}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-purple-500 mr-1" />
            </div>
            <div className="text-sm text-gray-600">Season</div>
            <div className="font-semibold text-xs">{crop.growingSeason}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Why this crop is recommended:</div>
          <div className="flex flex-wrap gap-2">
            {crop.reasons.map((reason, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {reason}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Label htmlFor={`area-${crop.id}`} className="text-sm">Area to allocate (acres)</Label>
            <Input
              id={`area-${crop.id}`}
              type="number"
              step="0.1"
              min="0"
              max={maxArea}
              placeholder="0"
              className="mt-1"
              onChange={(e) => {
                const area = parseFloat(e.target.value) || 0;
                if (area > 0) onAddCrop(crop, area);
              }}
            />
          </div>
          
          <Button 
            onClick={() => onAddCrop(crop, Math.min(1, maxArea))}
            className="bg-green-600 hover:bg-green-700 mt-6"
          >
            Add Crop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropRecommendationCard;
