
import React from 'react';
import CropModel from './CropModel';
import cropColors from './cropColors';

interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

interface CropPlacementProps {
  crops: SelectedCrop[];
}

const CropPlacement: React.FC<CropPlacementProps> = ({ crops }) => {
  const totalPlots = 12; // Increased for more realistic field
  let cropsForPlot: { crop: SelectedCrop, n: number }[] = [];
  
  if (crops.length > 0) {
    let sum = 0;
    crops.forEach((crop) => {
      const slots = Math.max(1, Math.round((crop.percentage / 100) * totalPlots));
      cropsForPlot.push({ crop, n: slots });
      sum += slots;
    });
    
    // Adjust for rounding
    while (sum > totalPlots) {
      const largestIndex = cropsForPlot.findIndex(c => c.n === Math.max(...cropsForPlot.map(p => p.n)));
      cropsForPlot[largestIndex].n -= 1;
      sum -= 1;
    }
    while (sum < totalPlots) {
      cropsForPlot[0].n += 1;
      sum += 1;
    }
  }

  // Create realistic field rows
  const plotPositions: {crop: SelectedCrop, pos: [number, number, number]}[] = [];
  let filled = 0, cropIndex = 0, local = 0;
  
  // 3 rows x 4 columns layout for realistic farming
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      if (filled >= totalPlots || cropIndex >= cropsForPlot.length) break;
      
      const x = (col - 1.5) * 2.2; // Space out the plots
      const z = (row - 1) * 2.5;
      const crop = crops[cropIndex];
      
      // Add multiple plants per plot for realism
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
          plotPositions.push({
            crop,
            pos: [
              x + (i - 1) * 0.4 + (Math.random() - 0.5) * 0.2,
              0.05,
              z + (j - 0.5) * 0.4 + (Math.random() - 0.5) * 0.2
            ]
          });
        }
      }
      
      local += 1;
      filled += 1;
      
      if (local >= cropsForPlot[cropIndex]?.n) {
        cropIndex += 1;
        local = 0;
      }
    }
  }

  return (
    <>
      {plotPositions.map(({crop, pos}, i) => (
        <CropModel
          key={i}
          pos={pos}
          color={cropColors[crop.id] || "#90EE90"}
          scale={0.8 + 0.4 * Math.random()}
          cropType={crop.id}
        />
      ))}
    </>
  );
};

export default CropPlacement;
