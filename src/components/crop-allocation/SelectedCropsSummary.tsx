
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Wand2, AlertTriangle } from "lucide-react";
import { LandDetails, SelectedCrop } from './types';

interface SelectedCropsSummaryProps {
  landDetails: LandDetails;
  selectedCrops: SelectedCrop[];
  isOptimizing: boolean;
  onOptimize: () => void;
  onRemoveCrop: (id: string) => void;
}

const SelectedCropsSummary = ({
  landDetails,
  selectedCrops,
  isOptimizing,
  onOptimize,
  onRemoveCrop
}: SelectedCropsSummaryProps) => {
  
  const totalAllocated = selectedCrops.reduce((sum, crop) => sum + crop.area, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-600" />
            Selected Crops
          </span>
          <Button 
            onClick={onOptimize} 
            variant="outline" 
            className="flex items-center space-x-1" 
            disabled={isOptimizing}
          >
            <Wand2 size={16} className="mr-1" />
            {isOptimizing ? "Optimizing..." : "Let AI Decide"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span>Total Area:</span>
            <span className="font-semibold">{landDetails.totalArea} acres</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Allocated:</span>
            <span className={`font-semibold ${totalAllocated > landDetails.totalArea ? 'text-red-600' : 'text-green-600'}`}>
              {totalAllocated.toFixed(1)} acres
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Remaining:</span>
            <span className="font-semibold">{(landDetails.totalArea - totalAllocated).toFixed(1)} acres</span>
          </div>
        </div>

        {totalAllocated > landDetails.totalArea && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm text-red-800">
                Allocated area exceeds total land area
              </span>
            </div>
          </div>
        )}

        {isOptimizing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center space-x-2">
              <Wand2 className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm text-blue-800">
                AI is optimizing crop allocation...
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {selectedCrops.map((crop) => (
            <div key={crop.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{crop.name}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveCrop(crop.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                <div>Area: {crop.area} acres ({crop.percentage.toFixed(1)}%)</div>
                <div>Est. Yield: {crop.estimatedYield.toFixed(1)} tons</div>
              </div>
            </div>
          ))}
        </div>

        {selectedCrops.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <div className="text-sm">No crops selected yet</div>
            <div className="text-xs">Choose from AI recommendations</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectedCropsSummary;
