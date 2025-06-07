
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { CropRecommendation } from './types';
import CropRecommendationCard from './CropRecommendationCard';

interface AIRecommendationsTabProps {
  isAnalyzing: boolean;
  recommendations: CropRecommendation[];
  onAddCrop: (crop: CropRecommendation, area: number) => void;
  maxArea: number;
}

const AIRecommendationsTab = ({
  isAnalyzing,
  recommendations,
  onAddCrop,
  maxArea
}: AIRecommendationsTabProps) => {
  return (
    <>
      {isAnalyzing ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <Brain className="h-6 w-6 text-purple-600 animate-pulse" />
              <div className="text-lg font-medium">Analyzing your land for optimal crops...</div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {recommendations.map((crop) => (
            <CropRecommendationCard 
              key={crop.id}
              crop={crop}
              onAddCrop={onAddCrop}
              maxArea={maxArea}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AIRecommendationsTab;
