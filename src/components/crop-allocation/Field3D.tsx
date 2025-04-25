
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";

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

const cropColors: Record<string, string> = {
  wheat: "#f0e2b6",
  rice: "#e2e7ba",
  corn: "#f9f385",
  potato: "#c2a07b",
  tomato: "#ff6847",
  cotton: "#e6e7e4",
  soybean: "#ade19b",
  sugarcane: "#b5f4cc",
};

function CropModel({ pos, color, scale, cropType }: { pos: [number, number, number], color: string, scale: number, cropType: string }) {
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
}

const FieldGround = () => {
  // Ground: gently bumpy mesh with green texture and some light patches
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(Date.now() * 0.00002) * 0.008;
    }
  });
  return (
    <mesh ref={meshRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 7, 20, 20]} />
      <meshStandardMaterial color="#96df71" roughness={0.7} />
    </mesh>
  );
};

const Field3D: React.FC<Field3DProps> = ({ crops, rotationEnabled }) => {
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
  const fieldWidth = 6.5, fieldHeight = 4.5;
  const plotSpacingX = 2;
  const plotSpacingY = 2;
  let filled = 0, cropIndex = 0, local = 0;
  const plotPositions: {crop: SelectedCrop, pos: [number, number, number]}[] = [];
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

  // Simple auto rotation
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (rotationEnabled && groupRef.current) {
      groupRef.current.rotation.y += 0.0065;
    }
  });

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border shadow bg-[#ecffe6] relative">
      <Canvas shadows camera={{ position: [0, 7, 9], fov: 48 }}>
        <ambientLight intensity={0.7} />
        <directionalLight intensity={0.6} position={[9, 6, 7]} castShadow shadow-mapSize-width={512} shadow-mapSize-height={512} />
        <Environment preset="sunset" />
        <group ref={groupRef} position={[0, 0, 0]}>
          <FieldGround />
          {/* Soil color border */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[10.8, 7.7]} />
            <meshStandardMaterial color="#e3ce97" roughness={0.95} />
          </mesh>
          {/* Blue water channel */}
          <mesh position={[0, 0.05, 1.6]}>
            <boxGeometry args={[7, 0.09, 0.22]} />
            <meshStandardMaterial color="#33C3F0" transparent opacity={0.62} />
          </mesh>
          {/* Yellow fertilizer ring */}
          <mesh position={[-2, 0.06, -1.2]} rotation={[-Math.PI/2, 0, 0]}>
            <torusGeometry args={[0.6, 0.07, 12, 32]} />
            <meshStandardMaterial color="#FFF07F" transparent opacity={0.72} />
          </mesh>
          {/* Planted crops */}
          {plotPositions.map(({crop, pos}, i) => (
            <CropModel
              key={i}
              pos={pos}
              color={cropColors[crop.id] || "#C8FA98"}
              scale={0.92 + 0.35 * Math.random()}
              cropType={crop.id}
            />
          ))}
        </group>
        <OrbitControls enablePan={false} enableDamping={true} maxPolarAngle={Math.PI/2.2} minPolarAngle={Math.PI/5} minDistance={6} maxDistance={12} />
      </Canvas>
      {/* "Field" label */}
      <span className="absolute top-2 left-4 text-gray-700 text-xs bg-white/70 px-2 py-0.5 rounded shadow">3D Field</span>
    </div>
  );
};

export default Field3D;
