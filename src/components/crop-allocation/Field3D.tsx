
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import FieldGround from "./3d/FieldGround";
import FieldDecorations from "./3d/FieldDecorations";
import CropPlacement from "./3d/CropPlacement";
import { SelectedCrop } from "./types";

interface Field3DProps {
  crops: SelectedCrop[];
  rotationEnabled: boolean;
}

const Field3DScene: React.FC<Field3DProps> = ({
  crops,
  rotationEnabled
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (rotationEnabled && groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });
  
  return <group ref={groupRef} position={[0, 0, 0]}>
      <FieldGround />
      <FieldDecorations />
      <CropPlacement crops={crops} />
      
      {/* Field Information Labels */}
      <Html position={[-4, 2, 3]} className="pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg text-xs">
          <div className="font-semibold text-green-700">Field Status</div>
          <div className="text-gray-600">
            {crops.length} crop types planted
          </div>
        </div>
      </Html>
      
      <Html position={[4, 2, 3]} className="pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg text-xs">
          <div className="font-semibold text-blue-700">Irrigation</div>
          <div className="text-gray-600">Active</div>
        </div>
      </Html>
      
      {/* Crop yield information */}
      {crops.length > 0 && <Html position={[0, 3, 0]} className="pointer-events-none">
          <div className="bg-green-100/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm">
            <div className="font-semibold text-green-800 mb-1">Total Expected Yield</div>
            <div className="text-green-700">
              {crops.reduce((sum, crop) => sum + crop.estimatedYield, 0).toFixed(1)} tons
            </div>
          </div>
        </Html>}
    </group>;
};

const Field3D: React.FC<Field3DProps> = ({
  crops,
  rotationEnabled
}) => {
  const [showInfo, setShowInfo] = useState(true);
  
  return <div className="w-full h-96 rounded-lg overflow-hidden border shadow bg-gradient-to-b from-sky-200 to-green-100 relative">
      <Canvas shadows camera={{
      position: [0, 8, 10],
      fov: 50
    }} gl={{
      antialias: true
    }}>
        <fog attach="fog" args={['#87CEEB', 10, 25]} />
        
        {/* Enhanced lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight intensity={0.8} position={[10, 10, 5]} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} />
        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#FFE4B5" />
        
        <Environment preset="sunset" />
        <Field3DScene crops={crops} rotationEnabled={rotationEnabled} />
        <OrbitControls enablePan={false} enableDamping={true} dampingFactor={0.05} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 6} minDistance={8} maxDistance={15} autoRotate={false} />
      </Canvas>
      
      {/* Enhanced Field Info Overlay */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm">
        <div className="font-bold text-green-800 mb-2">🚜 Realistic Farm Field</div>
        <div className="space-y-1 text-xs">
          <div className="text-gray-700">Area: 10 x 7 units</div>
          <div className="text-gray-700">Crops: {crops.length} varieties</div>
          <div className="text-gray-700">Status: Growing 🌱</div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute top-3 right-3 space-y-2">
        <button onClick={() => setShowInfo(!showInfo)} className="place some where else and the fuctionality is not working properly\n">
          {showInfo ? '🔍 Hide Info' : '🔍 Show Info'}
        </button>
      </div>
      
      {/* Weather indicator */}
      <div className="absolute bottom-3 right-3 bg-blue-100/90 backdrop-blur-sm rounded-lg p-2 shadow-lg text-xs">
        <div className="text-blue-800 font-medium">☀️ Weather: Sunny</div>
        <div className="text-blue-600">Perfect for growth</div>
      </div>
    </div>;
};

export default Field3D;
