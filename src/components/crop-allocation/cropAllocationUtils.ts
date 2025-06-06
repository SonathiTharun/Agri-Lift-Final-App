
import { CropRecommendation, SelectedCrop } from './types';

export const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getDemandColor = (demand: string) => {
  switch (demand) {
    case 'high': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const optimizeAllocation = (recommendations: CropRecommendation[], totalArea: number): SelectedCrop[] => {
  const sortedRecommendations = [...recommendations].sort((a, b) => 
    (b.suitability + b.profitability) - (a.suitability + a.profitability)
  );
  
  // Calculate allocation based on suitability, profitability and risk balance
  const newAllocations: SelectedCrop[] = [];
  let remainingArea = totalArea;
  
  // For best crop, allocate up to 40% of land depending on suitability
  if (sortedRecommendations.length > 0) {
    const topCrop = sortedRecommendations[0];
    const allocation = Math.min(
      remainingArea * 0.4, 
      (totalArea * topCrop.suitability / 100) * 0.5
    );
    newAllocations.push({
      id: topCrop.id,
      name: topCrop.name,
      area: parseFloat(allocation.toFixed(1)),
      percentage: (allocation / totalArea) * 100,
      estimatedYield: topCrop.expectedYield * allocation
    });
    remainingArea -= allocation;
  }
  
  // For second best crop, allocate up to 30% of land
  if (sortedRecommendations.length > 1) {
    const secondCrop = sortedRecommendations[1];
    const allocation = Math.min(
      remainingArea * 0.5,
      (totalArea * secondCrop.suitability / 100) * 0.4
    );
    newAllocations.push({
      id: secondCrop.id,
      name: secondCrop.name,
      area: parseFloat(allocation.toFixed(1)),
      percentage: (allocation / totalArea) * 100,
      estimatedYield: secondCrop.expectedYield * allocation
    });
    remainingArea -= allocation;
  }
  
  // Distribute remaining land to other crops based on their suitability
  if (sortedRecommendations.length > 2 && remainingArea > 0) {
    const remainingCrops = sortedRecommendations.slice(2, 5); // Take up to 3 more crops
    const totalSuitability = remainingCrops.reduce((sum, crop) => sum + crop.suitability, 0);
    
    remainingCrops.forEach(crop => {
      if (remainingArea > 0 && totalSuitability > 0) {
        const suitabilityRatio = crop.suitability / totalSuitability;
        const allocation = parseFloat((remainingArea * suitabilityRatio).toFixed(1));
        
        if (allocation >= 0.1) { // Only add if allocation is meaningful
          newAllocations.push({
            id: crop.id,
            name: crop.name,
            area: allocation,
            percentage: (allocation / totalArea) * 100,
            estimatedYield: crop.expectedYield * allocation
          });
          remainingArea -= allocation;
        }
      }
    });
  }
  
  // If there's still land left, add it to the highest suitability crop
  if (remainingArea > 0.1 && newAllocations.length > 0) {
    newAllocations[0].area = parseFloat((newAllocations[0].area + remainingArea).toFixed(1));
    newAllocations[0].percentage = (newAllocations[0].area / totalArea) * 100;
    newAllocations[0].estimatedYield = recommendations.find(r => r.id === newAllocations[0].id)!.expectedYield * newAllocations[0].area;
  }
  
  return newAllocations;
};
