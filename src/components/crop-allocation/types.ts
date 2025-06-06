
export interface LandDetails {
  location: string;
  pincode: string;
  plotNumber: string;
  totalArea: number;
  soilType: string;
  climateType: string;
}

export interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

export interface CropRecommendation {
  id: string;
  name: string;
  suitability: number;
  expectedYield: number;
  marketPrice: number;
  profitability: number;
  riskLevel: 'low' | 'medium' | 'high';
  waterRequirement: 'low' | 'medium' | 'high';
  growingSeason: string;
  marketDemand: 'low' | 'medium' | 'high';
  reasons: string[];
}
