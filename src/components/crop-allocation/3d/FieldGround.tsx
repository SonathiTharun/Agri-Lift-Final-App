
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FieldGround: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle wind effect
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.002;
    }
  });
  
  return (
    <>
      {/* Main field ground with realistic soil texture */}
      <mesh ref={meshRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[12, 9, 32, 32]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Fertile soil layer */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[11, 8, 24, 24]} />
        <meshStandardMaterial 
          color="#654321" 
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>
      
      {/* Top soil layer */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 7, 20, 20]} />
        <meshStandardMaterial 
          color="#7D5A3D" 
          roughness={0.7}
          metalness={0.02}
        />
      </mesh>
    </>
  );
};

export default FieldGround;
