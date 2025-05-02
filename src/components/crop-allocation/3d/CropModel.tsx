
import React from 'react';
import * as THREE from 'three';

interface CropModelProps {
  pos: [number, number, number];
  color: string;
  scale: number;
  cropType: string;
}

const CropModel: React.FC<CropModelProps> = ({ pos, color, scale, cropType }) => {
  // Simple model: cylinder for crops, with variation
  let geometry: JSX.Element = <cylinderGeometry args={[0.25*scale, 0.5*scale, 1.2*scale, 12]} />;
  
  if (cropType === "tomato") {
    geometry = <sphereGeometry args={[0.4*scale, 16, 16]} />;
  } else if (cropType === "potato") {
    geometry = <sphereGeometry args={[0.35*scale, 12, 10]} />;
  } else if (cropType === "corn") {
    geometry = <cylinderGeometry args={[0.09*scale, 0.3*scale, 1.5*scale, 8]} />;
  }

  return (
    <mesh position={pos}>
      {geometry}
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default CropModel;
