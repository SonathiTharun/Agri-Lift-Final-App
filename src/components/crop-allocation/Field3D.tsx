
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import FieldGround from "./3d/FieldGround";
import FieldDecorations from "./3d/FieldDecorations";
import CropPlacement from "./3d/CropPlacement";

interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

interface Field3DProps {
  crops: SelectedCrop[];
  rotationEnabled: boolean;
}

const Field3DScene: React.FC<Field3DProps> = ({ crops, rotationEnabled }) => {
  // Simple auto rotation
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (rotationEnabled && groupRef.current) {
      groupRef.current.rotation.y += 0.0065;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <FieldGround />
      <FieldDecorations />
      <CropPlacement crops={crops} />
    </group>
  );
};

const Field3D: React.FC<Field3DProps> = ({ crops, rotationEnabled }) => {
  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border shadow bg-[#ecffe6] relative">
      <Canvas shadows camera={{ position: [0, 7, 9], fov: 48 }}>
        <ambientLight intensity={0.7} />
        <directionalLight 
          intensity={0.6} 
          position={[9, 6, 7]} 
          castShadow 
          shadow-mapSize-width={512} 
          shadow-mapSize-height={512} 
        />
        <Environment preset="sunset" />
        <Field3DScene crops={crops} rotationEnabled={rotationEnabled} />
        <OrbitControls 
          enablePan={false} 
          enableDamping={true} 
          maxPolarAngle={Math.PI/2.2} 
          minPolarAngle={Math.PI/5} 
          minDistance={6} 
          maxDistance={12} 
        />
      </Canvas>
      {/* "Field" label */}
      <span className="absolute top-2 left-4 text-gray-700 text-xs bg-white/70 px-2 py-0.5 rounded shadow">3D Field</span>
    </div>
  );
};

export default Field3D;
