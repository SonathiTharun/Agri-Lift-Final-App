import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Lightbulb, Target, Droplets } from 'lucide-react';
import { useRealTimeData } from '@/hooks/useRealTimeData';

interface AIRecommendation {
  id: string;
  type: 'planting' | 'irrigation' | 'harvest' | 'market' | 'disease' | 'fertilizer';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  estimatedImpact: string;
  deadline?: string;
}

interface AIRecommendationEngineProps {
  landDetails: any;
  selectedCrops: any[];
  location: string;
}

const AIRecommendationEngine: React.FC<AIRecommendationEngineProps> = ({
  landDetails,
  selectedCrops,
  location
}) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const { weatherData, marketData, soilData } = useRealTimeData(location);

  useEffect(() => {
    const generateRecommendations = () => {
      setIsAnalyzing(true);
      
      setTimeout(() => {
        const newRecommendations: AIRecommendation[] = [
          {
            id: '1',
            type: 'irrigation',
            priority: 'high',
            title: 'Adjust Irrigation Schedule',
            description: 'Soil moisture is below optimal levels. Increase irrigation by 15% for the next 3 days.',
            confidence: 92,
            actionable: true,
            estimatedImpact: '+12% yield',
            deadline: 'Next 24 hours'
          },
          {
            id: '2',
            type: 'market',
            priority: 'medium',
            title: 'Optimal Selling Window',
            description: 'Wheat prices are trending upward. Consider selling 30% of harvest in next 2 weeks.',
            confidence: 87,
            actionable: true,
            estimatedImpact: '+₹8,500 revenue'
          },
          {
            id: '3',
            type: 'disease',
            priority: 'high',
            title: 'Disease Risk Alert',
            description: 'Weather conditions favor blight development. Apply preventive fungicide treatment.',
            confidence: 89,
            actionable: true,
            estimatedImpact: 'Prevent 20% crop loss',
            deadline: 'Next 48 hours'
          },
          {
            id: '4',
            type: 'fertilizer',
            priority: 'medium',
            title: 'Nutrient Optimization',
            description: 'Nitrogen levels are declining. Apply 25kg urea per acre during next irrigation.',
            confidence: 84,
            actionable: true,
            estimatedImpact: '+8% growth rate'
          },
          {
            id: '5',
            type: 'planting',
            priority: 'low',
            title: 'Next Season Planning',
            description: 'Consider intercropping with legumes to improve soil nitrogen for next season.',
            confidence: 76,
            actionable: false,
            estimatedImpact: '+15% soil fertility'
          }
        ];

        setRecommendations(newRecommendations);
        setIsAnalyzing(false);
      }, 2000);
    };

    generateRecommendations();
  }, [weatherData, marketData, soilData, selectedCrops]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'irrigation': return <Droplets className="h-4 w-4" />;
      case 'market': return <TrendingUp className="h-4 w-4" />;
      case 'disease': return <AlertCircle className="h-4 w-4" />;
      case 'fertilizer': return <Target className="h-4 w-4" />;
      case 'planting': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Brain className="h-5 w-5 mr-2 text-purple-600 animate-pulse" />
            AI Analysis in Progress...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="animate-pulse">
              <div className="h-4 bg-purple-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-purple-100 rounded w-1/2"></div>
            </div>
            <div className="text-sm text-purple-600">
              Analyzing weather patterns, soil conditions, and market trends...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            AI Recommendations
          </span>
          <Badge className="bg-purple-100 text-purple-800">
            {recommendations.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getTypeIcon(rec.type)}
                <h4 className="font-medium text-gray-900">{rec.title}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(rec.priority)} variant="outline">
                  {rec.priority}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {rec.confidence}% confidence
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-500">Impact: </span>
                  <span className="font-medium text-green-600">{rec.estimatedImpact}</span>
                </div>
                {rec.deadline && (
                  <div className="text-sm">
                    <span className="text-gray-500">Deadline: </span>
                    <span className="font-medium text-red-600">{rec.deadline}</span>
                  </div>
                )}
              </div>
              
              {rec.actionable && (
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Take Action
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <div className="text-center pt-2">
          <Button variant="outline" size="sm" className="text-purple-600 border-purple-200">
            View All Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationEngine;
