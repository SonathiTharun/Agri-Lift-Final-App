
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CropModelProps {
  pos: [number, number, number];
  color: string;
  scale: number;
  cropType: string;
}

const CropModel: React.FC<CropModelProps> = ({ pos, color, scale, cropType }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying motion
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime + pos[0] + pos[2]) * 0.02;
    }
  });

  const renderCrop = () => {
    switch (cropType) {
      case "wheat":
        return (
          <>
            {/* Wheat stalks */}
            {[...Array(5)].map((_, i) => (
              <mesh key={i} position={[
                (Math.random() - 0.5) * 0.4,
                0.3 + Math.random() * 0.2,
                (Math.random() - 0.5) * 0.4
              ]} castShadow>
                <cylinderGeometry args={[0.02, 0.04, 0.6 * scale, 6]} />
                <meshStandardMaterial color="#DAA520" />
              </mesh>
            ))}
            {/* Wheat heads */}
            {[...Array(3)].map((_, i) => (
              <mesh key={`head-${i}`} position={[
                (Math.random() - 0.5) * 0.3,
                0.7 * scale,
                (Math.random() - 0.5) * 0.3
              ]} castShadow>
                <sphereGeometry args={[0.05 * scale, 8, 6]} />
                <meshStandardMaterial color="#F4A460" />
              </mesh>
            ))}
          </>
        );
      
      case "corn":
        return (
          <>
            {/* Corn stalk */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.06 * scale, 0.08 * scale, 0.8 * scale, 8]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            {/* Corn leaves */}
            {[...Array(4)].map((_, i) => (
              <mesh key={i} position={[
                Math.sin(i * Math.PI/2) * 0.2,
                0.3 + i * 0.1,
                Math.cos(i * Math.PI/2) * 0.2
              ]} rotation={[0, i * Math.PI/2, Math.PI/6]} castShadow>
                <boxGeometry args={[0.02, 0.3 * scale, 0.01]} />
                <meshStandardMaterial color="#32CD32" />
              </mesh>
            ))}
            {/* Corn cob */}
            <mesh position={[0.1, 0.6 * scale, 0]} rotation={[0, 0, Math.PI/4]} castShadow>
              <cylinderGeometry args={[0.04 * scale, 0.05 * scale, 0.15 * scale, 8]} />
              <meshStandardMaterial color="#FFD700" />
            </mesh>
          </>
        );
      
      case "tomato":
        return (
          <>
            {/* Tomato plant stem */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.02 * scale, 0.03 * scale, 0.3 * scale, 6]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            {/* Tomato fruits */}
            {[...Array(3)].map((_, i) => (
              <mesh key={i} position={[
                (Math.random() - 0.5) * 0.3,
                0.2 + Math.random() * 0.2,
                (Math.random() - 0.5) * 0.3
              ]} castShadow>
                <sphereGeometry args={[0.06 * scale, 12, 10]} />
                <meshStandardMaterial color="#FF6347" />
              </mesh>
            ))}
            {/* Leaves */}
            {[...Array(6)].map((_, i) => (
              <mesh key={`leaf-${i}`} position={[
                Math.sin(i * Math.PI/3) * 0.15,
                0.25,
                Math.cos(i * Math.PI/3) * 0.15
              ]} rotation={[Math.PI/6, i * Math.PI/3, 0]} castShadow>
                <boxGeometry args={[0.08 * scale, 0.01, 0.12 * scale]} />
                <meshStandardMaterial color="#32CD32" />
              </mesh>
            ))}
          </>
        );
      
      case "potato":
        return (
          <>
            {/* Potato plant */}
            <mesh position={[0, 0.1, 0]} castShadow>
              <sphereGeometry args={[0.15 * scale, 8, 6]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            {/* Potato leaves */}
            {[...Array(8)].map((_, i) => (
              <mesh key={i} position={[
                Math.sin(i * Math.PI/4) * 0.2,
                0.15 + Math.random() * 0.1,
                Math.cos(i * Math.PI/4) * 0.2
              ]} rotation={[Math.random() * 0.3, i * Math.PI/4, 0]} castShadow>
                <boxGeometry args={[0.06 * scale, 0.01, 0.1 * scale]} />
                <meshStandardMaterial color="#228B22" />
              </mesh>
            ))}
          </>
        );
      
      default:
        return (
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.1 * scale, 0.15 * scale, 0.4 * scale, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
    }
  };

  return (
    <group ref={groupRef} position={pos}>
      {renderCrop()}
    </group>
  );
};

export default CropModel;
