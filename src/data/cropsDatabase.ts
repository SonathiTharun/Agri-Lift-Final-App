
export interface CropDetails {
  id: string;
  name: string;
  category: string;
  soilCompatibility: string[];
  climateCompatibility: string[];
  waterUsage: "low" | "medium" | "high";
  growthCycle: "short" | "medium" | "long";
  roi: "low" | "medium" | "high";
  description: string;
  yieldPerAcre: number;
  plantingSeasons: string[];
  harvestMonths: string[];
  marketPrice: number; // price per kg/ton
  waterRequirement: number; // liters per day per plant
  fertilizer: string[];
  commonDiseases: string[];
  companionCrops: string[];
  rotationCrops: string[];
  minTemp: number;
  maxTemp: number;
  phRange: [number, number];
  plantingDepth: number; // in cm
  spacing: number; // in cm
  maturityDays: number;
}

export const CROPS_DATABASE: CropDetails[] = [
  {
    id: "wheat",
    name: "Wheat",
    category: "Grain",
    soilCompatibility: ["Loam", "Clay", "Silt"],
    climateCompatibility: ["Temperate", "Continental"],
    waterUsage: "medium",
    growthCycle: "medium",
    roi: "medium",
    description: "A staple grain crop grown worldwide for food production",
    yieldPerAcre: 3.5,
    plantingSeasons: ["Winter", "Spring"],
    harvestMonths: ["May", "June", "July"],
    marketPrice: 25000, // per ton
    waterRequirement: 1.5,
    fertilizer: ["NPK", "Urea", "DAP"],
    commonDiseases: ["Rust", "Blight", "Smut"],
    companionCrops: ["legumes", "mustard"],
    rotationCrops: ["rice", "cotton", "sugarcane"],
    minTemp: 3,
    maxTemp: 32,
    phRange: [6.0, 7.5],
    plantingDepth: 3,
    spacing: 15,
    maturityDays: 120
  },
  {
    id: "rice",
    name: "Rice",
    category: "Grain",
    soilCompatibility: ["Clay", "Loam"],
    climateCompatibility: ["Tropical", "Temperate"],
    waterUsage: "high",
    growthCycle: "medium",
    roi: "medium",
    description: "Major staple food crop grown in flooded fields",
    yieldPerAcre: 4.2,
    plantingSeasons: ["Monsoon", "Winter"],
    harvestMonths: ["October", "November", "April"],
    marketPrice: 22000,
    waterRequirement: 8.0,
    fertilizer: ["NPK", "Urea", "Potash"],
    commonDiseases: ["Blast", "Sheath blight", "Brown spot"],
    companionCrops: ["fish farming", "ducks"],
    rotationCrops: ["wheat", "maize", "vegetables"],
    minTemp: 16,
    maxTemp: 40,
    phRange: [5.5, 6.5],
    plantingDepth: 2,
    spacing: 20,
    maturityDays: 110
  },
  {
    id: "corn",
    name: "Corn/Maize",
    category: "Grain",
    soilCompatibility: ["Loam", "Silt", "Sandy"],
    climateCompatibility: ["Temperate", "Tropical", "Continental"],
    waterUsage: "medium",
    growthCycle: "medium",
    roi: "high",
    description: "Versatile grain used for food, feed, and industrial purposes",
    yieldPerAcre: 5.8,
    plantingSeasons: ["Summer", "Winter"],
    harvestMonths: ["July", "August", "December"],
    marketPrice: 18000,
    waterRequirement: 2.5,
    fertilizer: ["NPK", "Zinc", "Boron"],
    commonDiseases: ["Borer", "Rust", "Leaf blight"],
    companionCrops: ["beans", "squash", "sunflower"],
    rotationCrops: ["wheat", "soybean", "cotton"],
    minTemp: 10,
    maxTemp: 35,
    phRange: [5.8, 7.0],
    plantingDepth: 5,
    spacing: 25,
    maturityDays: 90
  },
  {
    id: "potato",
    name: "Potato",
    category: "Root Vegetable",
    soilCompatibility: ["Loam", "Sandy"],
    climateCompatibility: ["Temperate", "Continental"],
    waterUsage: "medium",
    growthCycle: "medium",
    roi: "high",
    description: "Important tuber crop and world's fourth-largest food crop",
    yieldPerAcre: 12,
    plantingSeasons: ["Winter"],
    harvestMonths: ["March", "April"],
    marketPrice: 15000,
    waterRequirement: 3.0,
    fertilizer: ["NPK", "Potash", "Compost"],
    commonDiseases: ["Late blight", "Early blight", "Scab"],
    companionCrops: ["beans", "cabbage", "spinach"],
    rotationCrops: ["cereals", "legumes"],
    minTemp: 7,
    maxTemp: 25,
    phRange: [4.8, 5.4],
    plantingDepth: 10,
    spacing: 30,
    maturityDays: 70
  },
  {
    id: "tomato",
    name: "Tomato",
    category: "Vegetable",
    soilCompatibility: ["Loam", "Sandy"],
    climateCompatibility: ["Temperate", "Mediterranean"],
    waterUsage: "medium",
    growthCycle: "short",
    roi: "high",
    description: "Popular fruit vegetable with high market value",
    yieldPerAcre: 15,
    plantingSeasons: ["Summer", "Winter"],
    harvestMonths: ["Year-round with proper care"],
    marketPrice: 25000,
    waterRequirement: 4.0,
    fertilizer: ["NPK", "Calcium", "Magnesium"],
    commonDiseases: ["Blight", "Wilt", "Mosaic virus"],
    companionCrops: ["basil", "marigold", "carrots"],
    rotationCrops: ["legumes", "leafy vegetables"],
    minTemp: 13,
    maxTemp: 29,
    phRange: [6.0, 6.8],
    plantingDepth: 1,
    spacing: 45,
    maturityDays: 60
  },
  {
    id: "cotton",
    name: "Cotton",
    category: "Fiber",
    soilCompatibility: ["Loam", "Clay"],
    climateCompatibility: ["Tropical", "Arid"],
    waterUsage: "high",
    growthCycle: "long",
    roi: "medium",
    description: "Major fiber crop for textile industry",
    yieldPerAcre: 0.8,
    plantingSeasons: ["Summer"],
    harvestMonths: ["November", "December", "January"],
    marketPrice: 75000,
    waterRequirement: 6.0,
    fertilizer: ["NPK", "Boron", "Zinc"],
    commonDiseases: ["Bollworm", "Aphids", "Jassids"],
    companionCrops: ["marigold", "sunflower"],
    rotationCrops: ["wheat", "gram", "mustard"],
    minTemp: 15,
    maxTemp: 40,
    phRange: [5.8, 8.0],
    plantingDepth: 3,
    spacing: 30,
    maturityDays: 180
  },
  {
    id: "soybean",
    name: "Soybean",
    category: "Legume",
    soilCompatibility: ["Loam", "Clay", "Silt"],
    climateCompatibility: ["Temperate", "Continental"],
    waterUsage: "low",
    growthCycle: "medium",
    roi: "medium",
    description: "Protein-rich legume crop with nitrogen-fixing capability",
    yieldPerAcre: 2.5,
    plantingSeasons: ["Monsoon"],
    harvestMonths: ["October", "November"],
    marketPrice: 45000,
    waterRequirement: 2.0,
    fertilizer: ["Phosphorus", "Potash", "Rhizobium"],
    commonDiseases: ["Pod borer", "Rust", "Mosaic"],
    companionCrops: ["corn", "sorghum"],
    rotationCrops: ["wheat", "rice", "cotton"],
    minTemp: 13,
    maxTemp: 30,
    phRange: [6.0, 7.0],
    plantingDepth: 3,
    spacing: 5,
    maturityDays: 95
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    category: "Cash Crop",
    soilCompatibility: ["Loam", "Clay"],
    climateCompatibility: ["Tropical"],
    waterUsage: "high",
    growthCycle: "long",
    roi: "high",
    description: "Major source of sugar with high water requirement",
    yieldPerAcre: 35,
    plantingSeasons: ["Spring", "Autumn"],
    harvestMonths: ["December", "January", "February"],
    marketPrice: 3500,
    waterRequirement: 12.0,
    fertilizer: ["NPK", "Compost", "Micronutrients"],
    commonDiseases: ["Red rot", "Smut", "Borer"],
    companionCrops: ["intercropping not common"],
    rotationCrops: ["wheat", "potato", "gram"],
    minTemp: 20,
    maxTemp: 40,
    phRange: [6.5, 7.5],
    plantingDepth: 5,
    spacing: 120,
    maturityDays: 365
  },
  {
    id: "onion",
    name: "Onion",
    category: "Vegetable",
    soilCompatibility: ["Sandy", "Loam"],
    climateCompatibility: ["Temperate", "Mediterranean"],
    waterUsage: "medium",
    growthCycle: "medium",
    roi: "high",
    description: "Important bulb vegetable with good storage life",
    yieldPerAcre: 8,
    plantingSeasons: ["Winter"],
    harvestMonths: ["April", "May"],
    marketPrice: 20000,
    waterRequirement: 2.5,
    fertilizer: ["NPK", "Sulfur", "Boron"],
    commonDiseases: ["Purple blotch", "Thrips", "White rot"],
    companionCrops: ["cabbage", "tomato", "carrot"],
    rotationCrops: ["cereals", "pulses"],
    minTemp: 13,
    maxTemp: 25,
    phRange: [6.0, 7.0],
    plantingDepth: 2,
    spacing: 10,
    maturityDays: 110
  },
  {
    id: "cabbage",
    name: "Cabbage",
    category: "Vegetable",
    soilCompatibility: ["Loam", "Clay"],
    climateCompatibility: ["Temperate", "Continental"],
    waterUsage: "medium",
    growthCycle: "short",
    roi: "medium",
    description: "Cool season leafy vegetable with good nutritional value",
    yieldPerAcre: 20,
    plantingSeasons: ["Winter"],
    harvestMonths: ["March", "April"],
    marketPrice: 12000,
    waterRequirement: 3.5,
    fertilizer: ["NPK", "Calcium", "Compost"],
    commonDiseases: ["Clubroot", "Cabbage worm", "Aphids"],
    companionCrops: ["onion", "potato", "beans"],
    rotationCrops: ["root vegetables", "legumes"],
    minTemp: 7,
    maxTemp: 24,
    phRange: [6.0, 6.5],
    plantingDepth: 1,
    spacing: 40,
    maturityDays: 70
  }
];

export const getCropById = (id: string): CropDetails | undefined => {
  return CROPS_DATABASE.find(crop => crop.id === id);
};

export const getCropsByCategory = (category: string): CropDetails[] => {
  return CROPS_DATABASE.filter(crop => crop.category === category);
};

export const getCompatibleCrops = (soilType: string, climateType: string): CropDetails[] => {
  return CROPS_DATABASE.filter(crop => 
    crop.soilCompatibility.includes(soilType) && 
    crop.climateCompatibility.includes(climateType)
  );
};

export const getCropRecommendationScore = (crop: CropDetails, soilType: string, climateType: string): number => {
  let score = 0;
  
  // Soil compatibility (40% weight)
  if (crop.soilCompatibility.includes(soilType)) score += 40;
  
  // Climate compatibility (40% weight)
  if (crop.climateCompatibility.includes(climateType)) score += 40;
  
  // ROI bonus (20% weight)
  if (crop.roi === "high") score += 20;
  else if (crop.roi === "medium") score += 10;
  
  return Math.min(score, 100);
};
