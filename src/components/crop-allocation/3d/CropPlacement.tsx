
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
  // Split the field into X slots and assign crops to plots based on % area
  const totalPlots = 8;
  let cropsForPlot: { crop: SelectedCrop, n: number }[] = [];
  if (crops.length > 0) {
    let sum = 0;
    crops.forEach((crop) => {
      const slots = Math.max(1, Math.round((crop.percentage / 100) * totalPlots));
      cropsForPlot.push({ crop, n: slots });
      sum += slots;
    });
    // Adjust in case we overshoot/undershoot due to rounding
    while (sum > totalPlots) {
      cropsForPlot[0].n -= 1; sum -= 1;
    }
    while (sum < totalPlots) {
      cropsForPlot[0].n += 1; sum += 1;
    }
  }

  // Plots as a grid layout on the field
  const plotPositions: {crop: SelectedCrop, pos: [number, number, number]}[] = [];
  let filled = 0, cropIndex = 0, local = 0;
  
  for (let x = -2; x <= 2; x += 2) {
    for (let y = -2; y <= 2; y += 2) {
      if (filled >= totalPlots) break;
      // Figure out which crop
      let crop: SelectedCrop = crops[cropIndex];
      plotPositions.push({
        crop, pos: [x, 0.5, y],
      });
      local += 1;
      filled += 1;
      if (local >= cropsForPlot[cropIndex]?.n) {
        cropIndex += 1;
        local = 0;
      }
      if (cropIndex >= cropsForPlot.length) break;
    }
    if (filled >= totalPlots) break;
  }

  return (
    <>
      {plotPositions.map(({crop, pos}, i) => (
        <CropModel
          key={i}
          pos={pos}
          color={cropColors[crop.id] || "#C8FA98"}
          scale={0.92 + 0.35 * Math.random()}
          cropType={crop.id}
        />
      ))}
    </>
  );
};

export default CropPlacement;
